"use server";

import { checkBotId } from "botid/server";
import { headers } from "next/headers";
import { z } from "zod";
import { ContactEmail } from "@/components/contact/contact-email";
import { profile } from "@/content/profile";
import { verifyFormToken } from "@/lib/form-token";
import { consume } from "@/lib/rate-limit";
import { getResend } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name.").max(100),
  email: z.email("That email does not look right."),
  message: z.string().trim().min(20, "A little more detail helps.").max(4000),
  /** Honeypot. Real people leave it empty; most bots do not. */
  company: z.string().max(0).optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

/**
 * Limits are per fixed window. The per-address one is what stops a single
 * person hammering the form; the per-IP one is deliberately looser so a
 * shared office or campus NAT does not lock everyone out over one sender.
 */
const LIMITS = {
  perEmailHour: { limit: 2, windowSeconds: 60 * 60 },
  perEmailDay: { limit: 5, windowSeconds: 24 * 60 * 60 },
  perIpHour: { limit: 5, windowSeconds: 60 * 60 },
  perIpDay: { limit: 15, windowSeconds: 24 * 60 * 60 },
} as const;

/** Spam is nearly always link delivery. Real enquiries rarely carry three. */
const MAX_LINKS = 2;
const LINK_PATTERN = /https?:\/\/|www\.|\[url|\bbit\.ly\b/gi;

const TOO_MANY = (retryAfter: number) => {
  const minutes = Math.ceil(retryAfter / 60);
  const wait =
    minutes >= 60
      ? `${Math.ceil(minutes / 60)} hour${minutes >= 120 ? "s" : ""}`
      : `${minutes} minute${minutes === 1 ? "" : "s"}`;
  return `That is a lot of messages. Try again in about ${wait}, or email me directly at ${profile.email}.`;
};

/** One generic reply for every rejection a bot could learn from. */
const REJECTED: ContactState = {
  status: "error",
  message: "That did not go through. Reload the page and try again.",
};

function clientIp(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headerList.get("x-real-ip")?.trim() || "unknown";
}

export async function sendMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // ------------------------------------------------------------ Bot checks
  // Vercel BotID. Detection is a platform feature, so off Vercel it is told
  // to bypass rather than left to throw on the missing OIDC header. It layers
  // on top of the checks below rather than replacing them.
  try {
    const verdict = await checkBotId({
      developmentOptions: { isDevelopment: !process.env.VERCEL },
    });
    if (verdict.isBot && !verdict.isVerifiedBot) {
      console.warn("[contact] botid classified the caller as a bot");
      return REJECTED;
    }
  } catch (cause) {
    // Failing open: a detection outage must not take the contact form down.
    console.error("[contact] botid check failed, continuing:", cause);
  }

  const token = verifyFormToken(formData.get("t"));
  if (!token.ok) {
    console.warn(`[contact] form token rejected: ${token.reason}`);
    return REJECTED;
  }

  // --------------------------------------------------------------- Shape
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);
    // A filled honeypot has no field of its own to report against, so it
    // lands here looking like any other rejection.
    return {
      status: "error",
      message: "Some of that did not go through.",
      fieldErrors: {
        name: flattened.fieldErrors.name?.[0],
        email: flattened.fieldErrors.email?.[0],
        message: flattened.fieldErrors.message?.[0],
      },
    };
  }

  const { name, email, message } = parsed.data;

  if ((message.match(LINK_PATTERN) ?? []).length > MAX_LINKS) {
    return {
      status: "error",
      message: `Too many links for me to trust it. Send it without them, or email me directly at ${profile.email}.`,
    };
  }

  // ---------------------------------------------------------- Rate limits
  const headerList = await headers();
  const ip = clientIp(headerList);
  const address = email.toLowerCase();

  const verdicts = await Promise.all([
    consume(`contact:email:h:${address}`, ...spread(LIMITS.perEmailHour)),
    consume(`contact:email:d:${address}`, ...spread(LIMITS.perEmailDay)),
    consume(`contact:ip:h:${ip}`, ...spread(LIMITS.perIpHour)),
    consume(`contact:ip:d:${ip}`, ...spread(LIMITS.perIpDay)),
  ]);

  const blocked = verdicts.find((verdict) => !verdict.allowed);
  if (blocked) {
    console.warn(`[contact] rate limited ${address} from ${ip}`);
    return { status: "error", message: TOO_MANY(blocked.retryAfter) };
  }

  // ---------------------------------------------------------------- Send
  const resend = getResend();

  // No keys means no delivery. Failing loudly beats telling someone their
  // message was sent when it went nowhere.
  if (!resend) {
    return {
      status: "error",
      message: `Email is not wired up yet. Reach me directly at ${profile.email}.`,
    };
  }

  try {
    const { error } = await resend.client.emails.send({
      from: resend.from,
      to: [profile.email],
      // The sender's own address, so hitting reply in the inbox reaches them
      // rather than the no-reply mailbox the message was sent from.
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      react: ContactEmail({ name, email, message }),
      // Clients that refuse HTML still get something readable.
      text: `${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("[contact] resend rejected the message:", error);
      return {
        status: "error",
        message: `Something broke on the way out. Email me directly at ${profile.email}.`,
      };
    }
  } catch (cause) {
    console.error("[contact] resend request failed:", cause);
    return {
      status: "error",
      message: `Something broke on the way out. Email me directly at ${profile.email}.`,
    };
  }

  return { status: "success", message: "Sent. I will get back to you." };
}

function spread(rule: { limit: number; windowSeconds: number }) {
  return [rule.limit, rule.windowSeconds] as const;
}
