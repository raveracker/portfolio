import { ExternalLink, Lock, Package } from "lucide-react";
import type { Project } from "@/content/schema";

/**
 * Where the code lives, or an honest note that it does not live anywhere
 * public. Shared by the featured cards and the grid so the two never drift.
 */
export function SourceLine({ project }: { project: Project }) {
  if (project.repo) {
    return (
      <div className="flex items-center gap-4 text-xs">
        <a
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-brand transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Source <ExternalLink className="size-3" />
        </a>
        {project.repos.length > 1 && (
          <span className="text-muted-foreground">
            {project.repos.length} repositories
          </span>
        )}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Lock className="size-3" />
      {project.repos.length > 1
        ? `${project.repos.length} private repositories`
        : project.repos.length === 1
          ? "Private repository"
          : "No public repository"}
    </span>
  );
}

/** Published packages, listed under a featured project. */
export function PackageLinks({ packages }: { packages: string[] }) {
  return packages.map((pkg) => (
    <a
      key={pkg}
      href={`https://www.npmjs.com/package/${pkg}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <Package className="size-3.5" /> {pkg}
    </a>
  ));
}
