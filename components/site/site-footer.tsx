import { socialIcons } from "@/components/site/social-icons";
import { profile } from "@/content/profile";

// Evaluated once at build time. Reading the clock during render would make
// every page dynamic under Cache Components for the sake of four digits.
const buildYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          {profile.availability.open && (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-signal" />
            </span>
          )}
          {profile.availability.line}
        </div>

        <ul className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {profile.links.map((link) => {
            // Anything without a mark falls back to its label, so adding a
            // link to content/profile.ts never leaves an empty slot here.
            const Icon = socialIcons[link.label];
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={
                    link.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand pointer-coarse:size-11"
                >
                  {Icon ? (
                    <Icon className="size-[1.125rem]" />
                  ) : (
                    <span className="text-sm">{link.label}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mx-auto max-w-6xl px-5 pb-24 font-mono text-xs text-muted-foreground sm:px-8 sm:pb-14">
        © {buildYear} {profile.name}
      </p>
    </footer>
  );
}
