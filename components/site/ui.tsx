import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  /** ReactNode rather than string so an animated label can be passed in. */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-hairline bg-surface px-2 py-0.5 font-mono text-[11px] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-2xl font-semibold tracking-tight text-signal">
        {value}
      </div>
      <div className="mt-0.5 text-xs uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

const ctaBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function CtaLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "ghost" }) {
  return (
    <Link
      className={cn(
        ctaBase,
        variant === "primary"
          ? "bg-brand text-brand-contrast hover:-translate-y-0.5 hover:shadow-lg"
          : "border border-hairline text-foreground hover:border-brand hover:text-brand",
        className,
      )}
      {...props}
    />
  );
}
