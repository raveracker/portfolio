import type { Metadata } from "next";
import { Reveal } from "@/components/site/reveal";
import { CtaLink, Section } from "@/components/site/ui";
import { BorderBeam } from "@/components/ui/border-beam";
import { HyperText } from "@/components/ui/hyper-text";
import {
  SpotlightCard,
  SpotlightCardContent,
} from "@/components/ui/spotlight-card";
import { TextAnimate } from "@/components/ui/text-animate";
import { WorkTimeline } from "@/components/work/work-timeline";
import { education } from "@/content/education";
import { roles } from "@/content/experience";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Six years across four companies and nine client products - agentic AI, design systems, mobile and infrastructure.",
};

const headline = "I build the thing that builds it.";

const intro =
  "Payments, hotels, supplements, secrets. React Native at the start, agentic systems now.";

export default function WorkPage() {
  return (
    <>
      {/* ------------------------------------------------------------- Intro.
          The filter row belongs to the timeline below it, so the gap here is
          half a section rather than a full one. */}
      <Section className="pb-10 pt-20">
        <HyperText
          text="Experience"
          duration={700}
          className="mb-3 py-0 text-xs uppercase tracking-[0.18em] text-brand"
        />

        <TextAnimate
          as="h1"
          by="word"
          animation="blurInUp"
          duration={0.5}
          stagger={0.05}
          className="text-balance-heading max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          {headline}
        </TextAnimate>

        <TextAnimate
          as="p"
          by="word"
          animation="fadeIn"
          duration={0.3}
          delay={0.2}
          stagger={0.012}
          className="mt-5 max-w-2xl text-base text-muted-foreground"
        >
          {intro}
        </TextAnimate>
      </Section>

      {/* ---------------------------------------------------------- Timeline */}
      <Section className="pb-24">
        {/* The design has no visible heading here, but each role renders an h3.
            Without this the document jumps h1 -> h3. */}
        <h2 className="sr-only">Roles and engagements</h2>
        <WorkTimeline roles={roles} />
      </Section>

      {/* ------------------------------------------- Education and the pitch */}
      <Section className="border-t border-hairline py-16">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight">Education</h2>
          {education.map((entry) => (
            <div key={entry.institution} className="mt-4">
              <p className="font-medium">
                {entry.degree} · {entry.institution}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {entry.location} · {entry.start} - {entry.end}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <SpotlightCard
            borderRadius={16}
            className="relative overflow-hidden border border-hairline bg-surface"
          >
            <BorderBeam
              size={240}
              duration={14}
              borderWidth={1.5}
              colorFrom="var(--brand)"
              colorTo="var(--signal)"
            />
            <SpotlightCardContent className="p-6 sm:p-8">
              <p className="text-lg font-medium tracking-tight">
                {profile.availability.line}
              </p>
              <CtaLink href="/contact" className="mt-5">
                Get in touch
              </CtaLink>
            </SpotlightCardContent>
          </SpotlightCard>
        </Reveal>
      </Section>
    </>
  );
}
