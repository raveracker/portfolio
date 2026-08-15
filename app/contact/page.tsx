import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { LocalTime } from "@/components/contact/local-time";
import { Section } from "@/components/site/ui";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.name}. ${profile.availability.line}.`,
};

export default function ContactPage() {
  return (
    <Section className="py-20">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">
            Contact
          </p>
          <h1 className="text-balance-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&rsquo;s talk.
          </h1>

          {/* The availability line reads as a statement, not a headline - set as
              four lines of display type it swamped the page. */}
          {profile.availability.open && (
            <p className="mt-5 flex items-start gap-2.5 text-base font-medium text-foreground">
              <span className="relative mt-2 flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-signal" />
              </span>
              {profile.availability.line}
            </p>
          )}

          <p className="mt-6 text-base text-muted-foreground">
            The fastest way to reach me is the form. If you would rather not
            type into a box, every other route works too.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div className="flex gap-6">
              <dt className="w-20 shrink-0 text-muted-foreground">Based in</dt>
              <dd>
                {profile.location} · <LocalTime timezone={profile.timezone} />
              </dd>
            </div>
            {profile.links.map((link) => (
              <div key={link.label} className="flex gap-6">
                <dt className="w-20 shrink-0 text-muted-foreground">
                  {link.label}
                </dt>
                <dd>
                  <a
                    href={link.href}
                    target={
                      link.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {link.handle ?? link.href}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
