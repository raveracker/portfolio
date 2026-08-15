"use client";

import { ExternalLink } from "lucide-react";
import { Reveal, staggerDelay } from "@/components/site/reveal";
import { Chip } from "@/components/site/ui";
import { BorderBeam } from "@/components/ui/border-beam";
import { HyperText } from "@/components/ui/hyper-text";
import type { Project } from "@/content/schema";
import { OwnerBadge } from "./owner-badge";
import { PackageLinks } from "./project-links";

/**
 * The three projects worth opening: identity and numbers on the left, the read
 * on the right. Each card carries a border beam on a staggered offset so the
 * three never pulse in unison.
 */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <ul className="mt-12 flex flex-col gap-5">
      {projects.map((project, index) => (
        <Reveal
          as="li"
          key={project.slug}
          id={project.slug}
          delay={staggerDelay(index)}
          className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-hairline bg-surface p-6 transition-colors hover:border-brand/50 sm:p-8"
        >
          <BorderBeam
            size={220}
            duration={12}
            delay={index * 4}
            borderWidth={1.5}
            colorFrom="var(--brand)"
            colorTo="var(--signal)"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-tight">
                  {project.name}
                </h3>
                <OwnerBadge owner={project.owner} />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>

              {project.facts.length > 0 && (
                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                  {project.facts.map((fact) => (
                    // Column-reverse so the value reads above its label while
                    // the DOM keeps the dt-then-dd order a dl requires. A <p>
                    // inside a dl is invalid, which is what the old label was.
                    <div key={fact.label} className="flex flex-col-reverse">
                      <dt className="mt-0.5 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd>
                        {/* Decodes on hover. The number is in the DOM from the
                            first paint, so it stays copyable and indexable. */}
                        <HyperText
                          text={fact.value}
                          animateOnLoad={false}
                          duration={500}
                          className="py-0 text-xl font-semibold text-signal"
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Source <ExternalLink className="size-3.5" />
                  </a>
                )}
                <PackageLinks packages={project.npm} />
                {project.license && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {project.license}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                {project.description.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
