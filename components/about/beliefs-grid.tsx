"use client";

import { useState } from "react";
import type { Belief } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * Claim on the face, receipt underneath. Opens on hover, focus or tap, so it
 * works with a pointer, a keyboard and a thumb. A belief with no receipt is a
 * poster quote, which is why the receipt is the larger half.
 */
export function BeliefsGrid({ beliefs }: { beliefs: Belief[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul className="mt-12 grid gap-4 md:grid-cols-2">
      {beliefs.map((belief, index) => {
        const isOpen = open === belief.slug;
        return (
          <li key={belief.slug}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : belief.slug)}
              onMouseEnter={() => setOpen(belief.slug)}
              onMouseLeave={() => setOpen(null)}
              onFocus={() => setOpen(belief.slug)}
              onBlur={() => setOpen(null)}
              className={cn(
                "group h-full w-full rounded-2xl border bg-surface p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                isOpen ? "border-brand/50" : "border-hairline",
              )}
            >
              <span className="font-mono text-xs text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-3 block text-lg font-medium tracking-tight">
                {belief.claim}
              </span>

              <span
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <span className="overflow-hidden">
                  <span className="mt-4 block text-sm leading-relaxed text-muted-foreground">
                    {belief.receipt}
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
