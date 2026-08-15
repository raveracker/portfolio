import Link from "next/link";
import { SiteCommandMenu } from "@/components/site/site-command-menu";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { profile } from "@/content/profile";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-5 sm:px-8">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {profile.shortName.toLowerCase()}
          <span className="text-brand">.</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <SiteCommandMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
