import type { Metadata } from "next";
import Image from "next/image";
import { BeliefsGrid } from "@/components/about/beliefs-grid";
import { HobbyGrid } from "@/components/about/hobby-grid";
import { Reveal } from "@/components/site/reveal";
import { CtaLink, Section, SectionHeading } from "@/components/site/ui";
import { HyperText } from "@/components/ui/hyper-text";
import { LetterCascade } from "@/components/ui/letter-cascade";
import { beliefs } from "@/content/beliefs";
import { hobbies } from "@/content/hobbies";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";

export const metadata: Metadata = {
  title: "About",
  description:
    "A D2C brand before the term existed, then six years of production software. What I believe about building things, and what I do when nobody is paying me to.",
};

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------------------------------ Story and face */}
      <Section className="py-20">
        <HyperText
          text="About"
          duration={700}
          className="mb-4 py-0 text-xs uppercase tracking-[0.18em] text-brand"
        />
        {/* LetterCascade renders a span, so the page's only top-level heading
            has to be supplied around it. */}
        <h1>
          <LetterCascade
            text="Engineer, Team Player, Entrepreneur"
            className="text-balance-heading text-4xl font-semibold tracking-tight sm:text-5xl"
          />
        </h1>

        {/* The prose column is capped at a readable measure and the portrait
            takes whatever is left, so there is no dead gap between them. */}
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] md:items-center">
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {profile.story.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 40)} delay={index * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Image
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            width={profile.portrait.width}
            height={profile.portrait.height}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 24rem, 100vw"
            className="mx-auto aspect-square w-full max-w-sm rounded-2xl border border-hairline object-cover"
          />
        </div>
      </Section>

      {/* ------------------------------------------------------------ Beliefs */}
      <Section className="border-t border-hairline py-20">
        <Reveal>
          <SectionHeading
            eyebrow={
              <HyperText
                text="What I believe"
                animateOnLoad={false}
                className="py-0"
              />
            }
            title="Four things I hold to."
            description="Open one. These are how I work rather than what I have shipped - the receipts for that are on the work page."
          />
        </Reveal>
        <BeliefsGrid beliefs={beliefs} />
      </Section>

      {/* ------------------------------------------------------ Off the clock */}
      <Section className="border-t border-hairline py-20">
        <Reveal>
          <SectionHeading
            eyebrow={
              <HyperText
                text="Off the clock"
                animateOnLoad={false}
                className="py-0"
              />
            }
            title="What I do when nobody is paying me to."
          />
        </Reveal>

        <HobbyGrid hobbies={hobbies} />
      </Section>

      {/* ----------------------------------------------------------- The stack */}
      <Section className="border-t border-hairline py-20">
        <Reveal>
          <SectionHeading
            eyebrow={
              <HyperText
                text="The full list"
                animateOnLoad={false}
                className="py-0"
              />
            }
            title="Everything I actually use."
          />
        </Reveal>

        <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {skillGroups.map((group, index) => (
            <Reveal key={group.slug} delay={index * 0.04}>
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-brand">
                {group.label}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {group.items.join(" · ")}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* ------------------------------------------------------------- Closing */}
      <Section className="border-t border-hairline py-20 text-center">
        <Reveal>
          <p className="text-base text-muted-foreground">
            Thanks for reading this far. Say hi.
          </p>
          <CtaLink href="/contact" className="mt-6">
            Get in touch
          </CtaLink>
        </Reveal>
      </Section>
    </>
  );
}
