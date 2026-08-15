"use client";

import { useRouter } from "next/navigation";
import {
  CommandMenu,
  type CommandMenuGroup,
} from "@/components/ui/command-menu";
import { engagements } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { navItems } from "@/lib/site";

export function SiteCommandMenu() {
  const router = useRouter();

  const groups: CommandMenuGroup[] = [
    {
      title: "Go to",
      items: navItems.map((item) => ({
        id: `nav:${item.href}`,
        title: item.label,
        group: item.hint,
        onSelect: () => router.push(item.href),
      })),
    },
    {
      title: "Work",
      items: engagements.map((engagement) => ({
        id: `work:${engagement.slug}`,
        title: engagement.client,
        group: engagement.product ?? engagement.role.company,
        onSelect: () =>
          router.push(
            engagement.caseStudy
              ? `/work/${engagement.slug}`
              : `/work#${engagement.slug}`,
          ),
      })),
    },
    {
      title: "Projects",
      items: projects.map((project) => ({
        id: `project:${project.slug}`,
        title: project.name,
        group: project.tagline,
        onSelect: () => router.push(`/projects#${project.slug}`),
      })),
    },
    {
      title: "Elsewhere",
      items: profile.links.map((link) => ({
        id: `link:${link.label}`,
        title: link.label,
        group: link.handle,
        onSelect: () => window.open(link.href, "_blank", "noopener,noreferrer"),
      })),
    },
  ];

  return (
    <CommandMenu
      groups={groups}
      brandName={profile.shortName}
      placeholder="Search work, projects, pages..."
      triggerLabel="Search"
      triggerClassName="h-9 md:w-44 lg:w-56"
    />
  );
}
