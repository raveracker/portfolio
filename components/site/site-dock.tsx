"use client";

import { Briefcase, FolderGit2, Home, Mail, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagneticDock } from "@/components/ui/magnetic-dock";
import { isActivePath, navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons = {
  "/": Home,
  "/work": Briefcase,
  "/projects": FolderGit2,
  "/about": User,
  "/contact": Mail,
} as const;

export function SiteDock() {
  const pathname = usePathname();

  const items = navItems.map((item) => {
    const Icon = icons[item.href as keyof typeof icons];
    return {
      id: item.href,
      label: item.label,
      href: item.href,
      icon: <Icon className="size-full" strokeWidth={1.75} />,
      isActive: isActivePath(pathname, item.href),
    };
  });

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40"
    >
      {/* Desktop: the magnetic dock. */}
      <div className="pointer-events-auto hidden justify-center pb-6 sm:flex">
        <MagneticDock
          items={items}
          iconSize={44}
          maxScale={1.45}
          magneticDistance={130}
        />
      </div>

      {/* Mobile: a plain tab bar. A magnetic dock needs a cursor to be worth
          anything, and thumbs do not have one. */}
      <ul className="pointer-events-auto flex items-stretch justify-between border-t border-hairline bg-background/90 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden">
        {navItems.map((item) => {
          const Icon = icons[item.href as keyof typeof icons];
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  active ? "text-brand" : "text-muted-foreground",
                )}
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
