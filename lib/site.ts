import { profile } from "@/content/profile";

export const siteConfig = {
  /** Placeholder until a domain is registered - see the plan's open questions. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://allanjeo.dev",
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
