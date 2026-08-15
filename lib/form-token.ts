import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * A signed, timestamped token minted when the contact page renders and
 * checked when the form is submitted.
 *
 * It does two things a honeypot cannot:
 *
 * - A bot that POSTs straight at the server action without ever loading the
 *   page has no valid token, and cannot mint one without the secret.
 * - The issue time is inside the signature, so a submission that arrives
 *   faster than a person can type is rejected, and a token harvested once
 *   cannot be replayed for days.
 *
 * Not a substitute for rate limiting - a determined bot can fetch the page
 * each time. It removes the cheap attacks.
 */

/** Nobody fills in three fields this fast. */
const MIN_FILL_MS = 3_000;
/** Long enough for someone to write a considered message and walk away. */
const MAX_AGE_MS = 3 * 60 * 60 * 1_000;

export type TokenVerdict =
  | { ok: true }
  | { ok: false; reason: "malformed" | "forged" | "too-fast" | "expired" };

/**
 * Derived from the Resend key so there is no extra secret to provision - it
 * is already required for the form to do anything, and it is already secret.
 * `CONTACT_FORM_SECRET` overrides it when key rotation should not invalidate
 * every open form.
 */
function secret(): string {
  const explicit = process.env.CONTACT_FORM_SECRET;
  if (explicit) return explicit;

  const derived = process.env.RESEND_API_KEY;
  if (derived) return `contact-form-token:${derived}`;

  // No secret at all means no email is going out either, so the token check
  // is moot - but never sign with a constant.
  return FALLBACK_SECRET;
}

const FALLBACK_SECRET = randomBytes(32).toString("hex");

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Mint a token. Call this when the form renders, not when it is submitted. */
export function issueFormToken(now = Date.now()): string {
  const payload = `${now}.${randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyFormToken(
  token: unknown,
  now = Date.now(),
): TokenVerdict {
  if (typeof token !== "string" || token.length > 256) {
    return { ok: false, reason: "malformed" };
  }

  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return { ok: false, reason: "malformed" };

  const payload = token.slice(0, lastDot);
  const provided = Buffer.from(token.slice(lastDot + 1));
  const expected = Buffer.from(sign(payload));

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return { ok: false, reason: "forged" };
  }

  const issuedAt = Number(payload.slice(0, payload.indexOf(".")));
  if (!Number.isFinite(issuedAt)) return { ok: false, reason: "malformed" };

  const age = now - issuedAt;
  if (age < MIN_FILL_MS) return { ok: false, reason: "too-fast" };
  if (age > MAX_AGE_MS) return { ok: false, reason: "expired" };

  return { ok: true };
}
