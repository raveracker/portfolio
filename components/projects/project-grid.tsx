"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { REVEAL_EASE, staggerDelay } from "@/components/site/reveal";
import { Chip } from "@/components/site/ui";
import {
  SpotlightCard,
  SpotlightCardContent,
} from "@/components/ui/spotlight-card";
import type { Project } from "@/content/schema";
import { cn } from "@/lib/utils";
import { OwnerBadge } from "./owner-badge";
import { SourceLine } from "./project-links";

function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard
      borderRadius={16}
      className="flex h-full flex-col border border-hairline bg-surface transition-colors hover:border-brand/50"
    >
      <SpotlightCardContent className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-balance-heading text-lg font-medium leading-snug tracking-tight">
            {project.name}
          </h3>
          <OwnerBadge owner={project.owner} />
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>

        {project.facts.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
            {project.facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline gap-1.5">
                <span className="font-mono text-base font-semibold text-signal">
                  {fact.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {fact.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {project.tech.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        )}

        <div className="mt-6">
          <SourceLine project={project} />
        </div>
      </SpotlightCardContent>
    </SpotlightCard>
  );
}

function OwnerFilter({
  owners,
  active,
  onSelect,
  animated,
}: {
  owners: { owner: string; count: number }[];
  active: string;
  onSelect: (owner: string) => void;
  animated: boolean;
}) {
  return (
    <fieldset className="flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">Filter projects by who they were for</legend>
      {owners.map(({ owner, count }) => {
        const isActive = active === owner;
        return (
          <button
            key={owner}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(owner)}
            className={cn(
              "relative rounded-full border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              isActive
                ? "border-brand text-brand-contrast"
                : "border-hairline text-muted-foreground hover:border-brand hover:text-foreground",
              // Without the shared layout pill the active chip still needs a fill.
              isActive && !animated && "bg-brand",
            )}
          >
            {/* One element shared across chips, so the fill slides between
                them rather than blinking on and off. */}
            {isActive && animated && (
              <motion.span
                aria-hidden
                layoutId="project-owner-filter"
                className="absolute inset-0 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">
              {owner}
              <span className="ml-1.5 tabular-nums">{count}</span>
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All");
  const reduceMotion = useReducedMotion();

  const owners = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      counts.set(project.owner, (counts.get(project.owner) ?? 0) + 1);
    }
    return [
      { owner: "All", count: projects.length },
      ...[...counts.entries()]
        .map(([owner, count]) => ({ owner, count }))
        .sort((a, b) =>
          a.owner === "Open Source"
            ? -1
            : b.owner === "Open Source"
              ? 1
              : b.count - a.count || a.owner.localeCompare(b.owner),
        ),
    ];
  }, [projects]);

  const visible =
    active === "All" ? projects : projects.filter((p) => p.owner === active);

  return (
    <div>
      <OwnerFilter
        owners={owners}
        active={active}
        onSelect={setActive}
        animated={!reduceMotion}
      />

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {reduceMotion
          ? visible.map((project) => (
              <li key={project.slug} id={project.slug} className="scroll-mt-24">
                <ProjectCard project={project} />
              </li>
            ))
          : null}

        {reduceMotion ? null : (
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <motion.li
                key={project.slug}
                id={project.slug}
                layout
                className="scroll-mt-24"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.45,
                  delay: staggerDelay(index, 0.05, 7),
                  ease: REVEAL_EASE,
                }}
              >
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </AnimatePresence>
        )}
      </ul>
    </div>
  );
}
