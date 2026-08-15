import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroBackdrop } from "@/components/site/hero-backdrop";
import { RotatingWords } from "@/components/site/rotating-words";
import {
  Chip,
  CtaLink,
  Metric,
  Section,
  SectionHeading,
} from "@/components/site/ui";
import { KineticTextReveal } from "@/components/ui/kinetic-text-reveal";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";
import {
  SpotlightCard,
  SpotlightCardContent,
  SpotlightCardDescription,
  SpotlightCardHeader,
  SpotlightCardTitle,
} from "@/components/ui/spotlight-card";
import { caseStudyBySlug } from "@/content/case-studies";
import { engagements } from "@/content/experience";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { marqueeSkills } from "@/content/skills";

const featuredWork = engagements.filter((engagement) => engagement.caseStudy);

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <div className="relative isolate">
        <HeroBackdrop />
        {/* Scrim. The aurora is beautiful and it eats text contrast, so the
            copy sits on a graded wash rather than directly on the canvas. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/25 to-background"
        />

        <Section className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-24">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-brand">
            {profile.title} · {profile.location}
          </p>

          <h1 className="text-balance-heading text-5xl font-semibold tracking-tight sm:text-7xl">
            {profile.name}
          </h1>

          <p className="mt-5 text-2xl font-medium tracking-tight sm:text-4xl">
            I build <RotatingWords words={profile.taglines} />
          </p>

          <KineticTextReveal
            text={profile.summary}
            splitBy="words"
            stagger={0.012}
            delay={0.15}
            className="mt-8 block max-w-2xl text-base leading-snug text-foreground/75 sm:text-lg"
          />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CtaLink href="/work">
              See the work <ArrowRight className="size-4" />
            </CtaLink>
            <CtaLink href="/about" variant="ghost">
              Meet the person
            </CtaLink>
          </div>
        </Section>
      </div>

      {/* --------------------------------------------------------- Proof band */}
      <Section className="border-y border-hairline py-12">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {profile.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <Metric value={stat.value} label={stat.label} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ------------------------------------------------------- Tech marquee */}
      <div className="overflow-hidden py-10">
        <ScrollBasedVelocity
          text={`${marqueeSkills.join("  ·  ")}  ·  `}
          default_velocity={0.7}
          className="font-mono text-2xl uppercase tracking-tight text-muted-foreground/85 sm:text-4xl"
        />
      </div>

      {/* ------------------------------------------------------ Featured work */}
      <Section className="py-20">
        <SectionHeading
          eyebrow="Selected work"
          title="The Last Three"
          description="The product, what I built on it, and what I would do differently. Everything else lives on the work page."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featuredWork.map((engagement) => {
            // The case study headline is the sharpest single line about each
            // engagement, so the card leads with it rather than the CV summary.
            const study = caseStudyBySlug.get(engagement.slug);
            return (
              <SpotlightCard
                key={engagement.slug}
                borderRadius={16}
                className="flex h-full flex-col border border-hairline bg-surface"
              >
                <SpotlightCardHeader>
                  <SpotlightCardTitle className="text-lg font-semibold tracking-tight">
                    {engagement.client}
                  </SpotlightCardTitle>
                  {/* The engagement's own product label, not the case study's
                      product name - that one repeats the client in the title. */}
                  <SpotlightCardDescription className="text-sm text-muted-foreground">
                    {engagement.product}
                  </SpotlightCardDescription>
                </SpotlightCardHeader>

                <SpotlightCardContent className="flex flex-1 flex-col gap-6">
                  <p className="text-balance-heading text-base font-medium leading-snug tracking-tight">
                    {study?.headline ?? engagement.summary}
                  </p>

                  {study && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {study.product.what}
                    </p>
                  )}

                  <Link
                    href={`/work/${engagement.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    Read the case study <ArrowRight className="size-3.5" />
                  </Link>
                </SpotlightCardContent>
              </SpotlightCard>
            );
          })}
        </div>
      </Section>

      {/* -------------------------------------------------- Open source strip */}
      <Section className="border-t border-hairline py-20">
        <SectionHeading
          eyebrow="Open source"
          title="Giving Back"
          description="MIT-licensed packages and developer tooling, published and maintained in public."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {featuredProjects.map((project) => (
            <li
              key={project.slug}
              className="rounded-2xl border border-hairline bg-surface p-5 transition-colors hover:border-brand/50"
            >
              <h3 className="font-medium tracking-tight">{project.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {project.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.facts.slice(0, 2).map((fact) => (
                  <Chip key={fact.label}>
                    {fact.value} {fact.label}
                  </Chip>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <CtaLink href="/projects" variant="ghost" className="mt-10">
          All projects <ArrowRight className="size-4" />
        </CtaLink>
      </Section>

      {/* ------------------------------------------------------ Human pivot */}
      <Section className="border-t border-hairline py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="Off the clock"
              title="Building has always been the passion."
              description={profile.ethos}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/about" variant="ghost">
                My story
              </CtaLink>
            </div>
          </div>

          <div className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-hairline bg-surface md:mr-0 md:ml-auto">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              width={profile.portrait.width}
              height={profile.portrait.height}
              sizes="(min-width: 768px) 24rem, 100vw"
              className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Ties the photo to the page's palette instead of letting the
                cafe's warm cast fight the rest of the section. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
