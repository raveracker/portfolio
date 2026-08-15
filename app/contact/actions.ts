"use server";

import { z } from "zod";
import { ContactEmail } from "@/components/contact/contact-email";
import { profile } from "@/content/profile";
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

export async function sendMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);
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
