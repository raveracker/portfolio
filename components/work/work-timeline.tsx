"use client";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { staggerDelay } from "@/components/site/reveal";
import type { Role } from "@/content/schema";
import { RoleEntry } from "./role-entry";
import { WorkFilter, type WorkFilterValue } from "./work-filter";

export function WorkTimeline({ roles }: { roles: Role[] }) {
  const [active, setActive] = useState<WorkFilterValue>("all");
  const reduceMotion = useReducedMotion();

  const visible = useMemo(() => {
    if (active === "all") return roles;
    return roles
      .map((role) => ({
        ...role,
        engagements: role.engagements.filter((engagement) =>
          engagement.tags.includes(active),
        ),
      }))
      .filter(
        (role) =>
          role.engagements.length > 0 ||
          (role.engagements.length === 0 && role.tags.includes(active)),
      );
  }, [active, roles]);

  const entries = visible.map((role, index) => (
    <RoleEntry
      key={role.slug}
      role={role}
      delay={staggerDelay(index, 0.08, 3)}
    />
  ));

  return (
    <div>
      <WorkFilter
        active={active}
        onSelect={setActive}
        animated={!reduceMotion}
      />

      {visible.length === 0 && (
        <p className="mt-12 text-sm text-muted-foreground">
          Nothing tagged that way yet. Try another filter.
        </p>
      )}

      <ol className="mt-14 space-y-20">
        {/* AnimatePresence only wraps the animated path: with reduced motion the
            entries are plain <li>s, and nothing would ever tell it they had
            finished exiting. */}
        {reduceMotion ? (
          entries
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {entries}
          </AnimatePresence>
        )}
      </ol>
    </div>
  );
}
