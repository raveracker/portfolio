"use client";

import { motion } from "framer-motion";
import type { WorkTag } from "@/content/schema";
import { cn } from "@/lib/utils";

export type WorkFilterValue = WorkTag | "all";

export const workFilters: { value: WorkFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai", label: "AI & Agents" },
  { value: "design-systems", label: "Design Systems" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
  { value: "infra", label: "Infra" },
];

export function WorkFilter({
  active,
  onSelect,
  animated,
}: {
  active: WorkFilterValue;
  onSelect: (value: WorkFilterValue) => void;
  animated: boolean;
}) {
  return (
    <fieldset className="flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">Filter work by discipline</legend>
      {workFilters.map((filter) => {
        const isActive = active === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(filter.value)}
            className={cn(
              "relative rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              isActive
                ? "border-foreground text-background"
                : "border-hairline text-muted-foreground hover:border-brand hover:text-foreground",
              // Without the shared-layout pill the active chip still needs a fill.
              isActive && !animated && "bg-foreground",
            )}
          >
            {/* One element shared across the chips, so the fill slides between
                them rather than blinking on and off. */}
            {isActive && animated && (
              <motion.span
                aria-hidden
                layoutId="work-discipline-filter"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
