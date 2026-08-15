import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip, Metric, Section } from "@/components/site/ui";
import { caseStudyBySlug } from "@/content/case-studies";
import { engagements } from "@/content/experience";

export function generateStaticParams() {
  return engagements
    .filter((engagement) => engagement.caseStudy)
    .map((engagement) => ({ slug: engagement.slug }));
}

const find = (slug: string) =>
  engagements.find(
    (engagement) => engagement.slug === slug && engagement.caseStudy,
  );

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const engagement = find(slug);
  if (!engagement) return {};

  const study = caseStudyBySlug.get(slug);

  return {
    title: `${engagement.client} - Case study`,
    description: study?.standfirst ?? engagement.summary,
    alternates: { canonical: `/work/${engagement.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const engagement = find(slug);
  if (!engagement) notFound();

  const study = caseStudyBySlug.get(slug);
  const others = engagements.filter(
    (other) => other.caseStudy && other.slug !== engagement.slug,
  );

  return (
    <article>
      {/* --------------------------------------------------------------- Head */}
      <Section className="py-16">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <ArrowLeft className="size-3.5" /> All work
        </Link>

        <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-brand">
          {engagement.client}
          {engagement.product ? ` · ${engagement.product}` : ""}
        </p>

        <h1 className="text-balance-heading mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {study ? study.headline : engagement.client}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {study ? study.standfirst : engagement.summary}
        </p>

        {study && (
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            {study.role}
          </p>
        )}
      </Section>

      {/* ------------------------------------------------------------ Metrics */}
      {engagement.metrics.length > 0 && (
        <Section className="border-y border-hairline py-10">
          <div className="flex flex-wrap gap-x-14 gap-y-6">
            {engagement.metrics.map((metric) => (
              <Metric
                key={metric.label}
                value={metric.value}
                label={metric.label}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ----------------------------------------------------------- Product */}
      {study && (
        <Section className="py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-brand">
                The product
              </h2>
              <p className="mt-3 text-lg font-medium tracking-tight">
                {study.product.name}
              </p>
              {study.product.url && (
                <a
                  href={study.product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {new URL(study.product.url).hostname.replace(/^www\./, "")}
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>

            <div>
              <p className="text-base leading-relaxed text-muted-foreground">
                {study.product.what}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                <span className="text-foreground">Built for: </span>
                {study.product.who}
              </p>

              {study.product.publicClaims.length > 0 && (
                <div className="mt-8 rounded-2xl border border-hairline bg-surface p-5">
                  {/* Attributed, not claimed. These are the company's figures. */}
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Stated publicly by the company
                  </p>
                  <ul className="mt-3 space-y-2">
                    {study.product.publicClaims.map((claim) => (
                      <li
                        key={claim}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-signal"
                        />
                        {claim}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------- Narrative */}
      {study && (
        <Section className="border-t border-hairline py-16">
          <div className="space-y-14">
            {study.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                What I would do differently
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                {study.reflection.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>
          </div>
        </Section>
      )}

      {/* -------------------------------------------------------- Facts, stack */}
      <Section className="border-t border-hairline py-16">
        <h2 className="text-xl font-semibold tracking-tight">
          Delivered inside this engagement
        </h2>
        <ul className="mt-6 space-y-4">
          {engagement.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex gap-3 text-base leading-relaxed text-muted-foreground"
            >
              <span
                aria-hidden
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand"
              />
              {highlight}
            </li>
          ))}
        </ul>

        {engagement.brands && (
          <>
            <h2 className="mt-14 text-xl font-semibold tracking-tight">
              Products it shipped across
            </h2>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {engagement.brands.map((brand) => (
                <Chip key={brand}>{brand}</Chip>
              ))}
            </div>
          </>
        )}

        <h2 className="mt-14 text-xl font-semibold tracking-tight">Stack</h2>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {engagement.tech.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------------- Next */}
      {others.length > 0 && (
        <Section className="border-t border-hairline py-14">
          <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-muted-foreground">
            Next case study
          </h2>
          <ul className="mt-5 space-y-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/work/${other.slug}`}
                  className="text-lg font-medium tracking-tight transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {other.client}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
