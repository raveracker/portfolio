"use client";

import { motion, useReducedMotion } from "framer-motion";
import { REVEAL_EASE } from "@/components/site/reveal";
import { Chip } from "@/components/site/ui";
import { HyperText } from "@/components/ui/hyper-text";
import type { Role } from "@/content/schema";
import { EngagementPanel } from "./engagement-panel";
import { HighlightList } from "./highlight-list";

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatPeriod(start: string, end: string | null) {
  const format = (value: string) =>
    monthFormatter.format(new Date(`${value}-01T00:00:00Z`));
  return `${format(start)} - ${end ? format(end) : "Present"}`;
}

/** The hairline down the left of the body, drawn top to bottom on scroll. */
function TimelineRule({ animated }: { animated: boolean }) {
  if (!animated) {
    return (
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-px bg-hairline"
      />
    );
  }

  return (
    <motion.span
      aria-hidden
      className="absolute inset-y-0 left-0 w-px origin-top bg-hairline"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: REVEAL_EASE }}
    />
  );
}

export function RoleEntry({ role, delay }: { role: Role; delay: number }) {
  const reduceMotion = useReducedMotion();
  const animated = !reduceMotion;

  const body = (
    <>
      <div className="md:sticky md:top-24 md:self-start">
        <HyperText
          text={formatPeriod(role.start, role.end)}
          animateOnLoad={false}
          duration={600}
          className="py-0 text-xs uppercase tracking-[0.14em] text-brand"
        />
        <h3 className="mt-2 text-lg font-semibold tracking-tight">
          {role.company}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{role.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{role.location}</p>
      </div>

      <div className="relative pl-6 md:pl-10">
        <TimelineRule animated={animated} />

        {role.summary && (
          <p className="mb-8 text-base text-muted-foreground">{role.summary}</p>
        )}

        {role.highlights.length > 0 && (
          <HighlightList items={role.highlights} />
        )}

        {role.tech.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {role.tech.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        )}

        {role.engagements.length > 0 && (
          <div className="mt-8 space-y-3 first:mt-0">
            {role.engagements.map((engagement) => (
              <EngagementPanel key={engagement.slug} engagement={engagement} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  const className = "grid gap-8 md:grid-cols-[190px_1fr]";

  if (!animated) {
    return <li className={className}>{body}</li>;
  }

  return (
    <motion.li
      layout
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, delay, ease: REVEAL_EASE }}
    >
      {body}
    </motion.li>
  );
}
