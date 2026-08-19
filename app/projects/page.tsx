import type { Metadata } from "next";
import { ContributionGraph } from "@/components/projects/contribution-graph";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Reveal } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/ui";
import { HyperText } from "@/components/ui/hyper-text";
import { featuredProjects, otherProjects } from "@/content/projects";
import { buildPayload } from "@/lib/contributions";

/** The account the calendar is built from. Only this one is kept current. */
const GITHUB_USERNAME = "punkadillo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "44 projects delivered across clients, open source and private work - reconciled from GitHub and from engagements whose code never lived there.",
};

export default function ProjectsPage() {
  return (
    <>
      {/* ------------------------------------------------------------- Intro */}
      <Section className="pt-20 pb-10">
        {/* The visible label is decorative, so the page still needs a real
            top-level heading for screen readers and search results. */}
        <h1 className="sr-only">Projects</h1>
        <HyperText
          text="Projects"
          duration={700}
          className="py-0 text-xs uppercase tracking-[0.18em] text-brand"
        />
      </Section>

      {/* --------------------------------------------------------- Calendar */}
      <Section className="pb-20">
        <Reveal className="rounded-2xl border border-hairline bg-surface p-6 sm:p-7">
          <ContributionGraph
            username={GITHUB_USERNAME}
            initial={buildPayload(GITHUB_USERNAME)}
          />
        </Reveal>
      </Section>

      {/* --------------------------------------------------------- Featured */}
      <Section className="border-t border-hairline py-16">
        <Reveal>
          <SectionHeading
            eyebrow={
              <HyperText
                text="Featured"
                animateOnLoad={false}
                className="py-0"
              />
            }
            title="Three worth opening."
            description="Published, documented and maintained in public."
          />
        </Reveal>

        <FeaturedProjects projects={featuredProjects} />
      </Section>

      {/* ---------------------------------------------------- Other projects */}
      <Section className="border-t border-hairline py-16">
        <Reveal>
          <SectionHeading
            eyebrow={
              <HyperText
                text="Everything else"
                animateOnLoad={false}
                className="py-0"
              />
            }
            title="Other Projects"
          />
        </Reveal>

        <div className="mt-10">
          <ProjectGrid projects={otherProjects} />
        </div>
      </Section>
    </>
  );
}
