import { Resend } from "resend";

/**
 * Resend configuration, resolved once per process.
 *
 * `RESEND_FROM_DOMAIN` is the domain verified in the Resend dashboard; the
 * sender is derived from it so there is one thing to change when the domain
 * changes. `RESEND_FROM_EMAIL` overrides the whole address when a different
 * mailbox or display name is wanted.
 *
 * Everything is read lazily. Reading at module scope would make the contact
 * page fail to build on a machine without the keys.
 */
export type ResendConfig = {
  client: Resend;
  from: string;
};

export function getResend(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const explicit = process.env.RESEND_FROM_EMAIL;
  const domain = process.env.RESEND_FROM_DOMAIN;
  const from = explicit ?? (domain ? `Portfolio <contact@${domain}>` : null);
  if (!from) return null;

  return { client: new Resend(apiKey), from };
}
