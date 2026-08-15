import type { Project } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * Open Source takes the brand colour, client and personal work the secondary.
 * The badge answers "who was this for", which is the first thing anyone
 * scanning a project list wants to know.
 */
export function OwnerBadge({ owner }: { owner: Project["owner"] }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
        owner === "Open Source"
          ? "bg-brand-muted text-brand"
          : "bg-signal-muted text-signal",
      )}
    >
      {owner}
    </span>
  );
}
