"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { type ContactState, sendMessage } from "@/app/contact/actions";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

// iOS Safari zooms the whole page when a focused field computes under 16px,
// so phones get text-base and the 14px sizing starts at the sm breakpoint.
const fieldClass =
  "w-full rounded-xl border border-hairline bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand focus-visible:ring-2 focus-visible:ring-brand sm:text-sm";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-brand-contrast transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {pending ? "Sending..." : "Send message"}
    </button>
  );
}

export function ContactForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(sendMessage, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Minted when the page rendered and signed server-side. Proves the
          submission came from a real page load, and carries the timestamp the
          action uses to reject instant posts. */}
      <input type="hidden" name="t" value={token} />
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          className={fieldClass}
          placeholder="Your name"
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="mt-1.5 text-xs text-destructive">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          className={fieldClass}
          placeholder="you@company.com"
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="mt-1.5 text-xs text-destructive">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={
            state.fieldErrors?.message ? "message-error" : undefined
          }
          className={cn(fieldClass, "resize-y")}
          placeholder="What are you building?"
        />
        {state.fieldErrors?.message && (
          <p id="message-error" className="mt-1.5 text-xs text-destructive">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {/* Honeypot - hidden from people, offered to bots. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <SubmitButton />
        {state.message && (
          <output
            className={cn(
              "text-sm",
              state.status === "success" ? "text-signal" : "text-destructive",
            )}
          >
            {state.message}
          </output>
        )}
      </div>
    </form>
  );
}
