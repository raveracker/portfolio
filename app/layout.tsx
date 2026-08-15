import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteDock } from "@/components/site/site-dock";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ThemeProvider } from "@/components/site/theme-provider";
import { profile } from "@/content/profile";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${profile.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: profile.name, url: siteConfig.url }],
  creator: profile.name,
  keywords: [
    "Allan Jeo Joseph",
    "Principal Software Engineer",
    "Agentic AI",
    "MCP",
    "RAG",
    "Next.js",
    "React",
    "Design Systems",
  ],
  openGraph: {
    type: "profile",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: profile.name,
    // Images come from app/opengraph-image.tsx, which Next also reuses for
    // the Twitter card. Listing them here as well would emit two og:image tags.
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafcfe" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c15" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <SiteDock />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
