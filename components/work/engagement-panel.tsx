"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Chip } from "@/components/site/ui";
import { HyperText } from "@/components/ui/hyper-text";
import type { Engagement } from "@/content/schema";
import { HighlightList } from "./highlight-list";

/**
 * One client engagement, as a native disclosure. It stays a <details> on
 * purpose: the body is in the DOM whether or not it is open, so search engines
 * and find-in-page both reach it. The open and close is animated in CSS by the
 * .details-reveal rule in globals.css.
 */
export function EngagementPanel({ engagement }: { engagement: Engagement }) {
  return (
    <details
      id={engagement.slug}
      className="details-reveal group scroll-mt-24 rounded-2xl border border-hairline bg-surface p-5 transition-colors open:border-brand/40"
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-medium tracking-tight">{engagement.client}</h4>
            {engagement.current && (
              <span className="rounded-full bg-signal-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
                Current
              </span>
            )}
          </div>
          {engagement.product && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {engagement.product}
            </p>
          )}
        </div>
        <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
      </summary>

      <div className="mt-5 space-y-6">
        {engagement.metrics.length > 0 && (
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {engagement.metrics.map((metric) => (
              <div key={metric.label}>
                {/* Decodes on hover. The figure is in the DOM from the first
                    paint, so it stays copyable and indexable. */}
                <HyperText
                  text={metric.value}
                  animateOnLoad={false}
                  duration={500}
                  className="py-0 text-2xl font-semibold tracking-tight text-signal"
                />
                <div className="mt-0.5 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {engagement.brands && (
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground">Products: </span>
            {engagement.brands.join(", ")}
          </p>
        )}

        <HighlightList items={engagement.highlights} />

        <div className="flex flex-wrap gap-1.5">
          {engagement.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>

        {engagement.caseStudy && (
          <Link
            href={`/work/${engagement.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Read the case study <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>
    </details>
  );
}
