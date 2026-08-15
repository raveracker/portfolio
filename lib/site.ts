import { profile } from "@/content/profile";

/** Placeholder until a domain is registered - see the plan's open questions. */
const FALLBACK_SITE_URL = "https://allanjeo.dev";

/**
 * A Vercel environment variable that exists with no value arrives as an empty
 * string, and `??` does not treat "" as missing - `new URL("")` then throws
 * while Next collects page metadata and takes the whole build down. So:
 * truthiness rather than nullishness, a scheme added when the value is a bare
 * host, and every candidate validated before it is trusted.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Set by Vercel on every deployment. A bare host, hence the scheme check.
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    FALLBACK_SITE_URL,
  ];

  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (!trimmed) continue;

    const withScheme = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      // `.origin` so a trailing slash or a pasted path cannot leak into every
      // canonical link on the site.
      return new URL(withScheme).origin;
    } catch {
      // Malformed value, try the next candidate rather than failing the build.
    }
  }

  return FALLBACK_SITE_URL;
}

export const siteConfig = {
  url: resolveSiteUrl(),
  name: profile.name,
  title: `${profile.name} - ${profile.title}`,
  description: profile.summary,
  locale: "en_IN",
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** Shown in the command menu, not in the dock. */
  hint: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home", hint: "The 15-second version" },
  {
    href: "/work",
    label: "Work",
    hint: "Six years, four companies, nine products",
  },
  {
    href: "/projects",
    label: "Projects",
    hint: "Open source and npm packages",
  },
  { href: "/about", label: "About", hint: "The person behind the commits" },
  { href: "/contact", label: "Contact", hint: "Say hi" },
];

export const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);
