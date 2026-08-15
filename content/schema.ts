import { z } from "zod";

/**
 * Every content file in this directory is validated against these schemas at
 * import time. A typo fails the build, not the page.
 */

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.url(),
  handle: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  title: z.string().min(1),
  /** Cycled by the hero word-swap. Each entry completes "I build ___". */
  taglines: z.array(z.string().min(1)).min(2),
  location: z.string().min(1),
  timezone: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  availability: z.object({
    open: z.boolean(),
    line: z.string().min(1),
  }),
  summary: z.string().min(1),
  /** Three-to-four sentence first-person intro used on /about. */
  story: z.array(z.string().min(1)).min(1),
  /**
   * The "how I think" paragraph behind the home page's human pivot. Kept apart
   * from `story`, which is a chronology and has to read in sequence.
   */
  ethos: z.string().min(1),
  /**
   * Intrinsic dimensions live here rather than in the markup so next/image can
   * reserve the box at build time and the social card can reuse the same file.
   */
  portrait: z.object({
    src: z.string().startsWith("/"),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  links: z.array(linkSchema).min(1),
  /** Headline numbers for the home proof band. */
  stats: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
        /** Where the number comes from, so it can be defended. */
        source: z.string().min(1),
      }),
    )
    .min(3),
});

/**
 * The disciplines the work page filters by. One list, shared by roles and
 * engagements, so the two can never drift apart.
 */
export const workTags = [
  "ai",
  "design-systems",
  "frontend",
  "backend",
  "mobile",
  "infra",
  "web3",
] as const;

export const engagementSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: z.string().min(1),
  product: z.string().optional(),
  /** Sub-products delivered under the same engagement. */
  brands: z.array(z.string().min(1)).optional(),
  summary: z.string().min(1),
  current: z.boolean().default(false),
  highlights: z.array(z.string().min(1)).min(1),
  /** Promoted out of the bullets and given typographic weight. */
  metrics: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .default([]),
  tech: z.array(z.string().min(1)).min(1),
  tags: z.array(z.enum(workTags)).min(1),
  /** Set when a full MDX case study exists at content/case-studies/<slug>.mdx */
  caseStudy: z.boolean().default(false),
});

export const roleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  /** null means present. */
  end: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable(),
  summary: z.string().optional(),
  /** Roles that are a single body of work use `highlights`. */
  highlights: z.array(z.string().min(1)).default([]),
  tech: z.array(z.string().min(1)).default([]),
  tags: z.array(z.enum(workTags)).default([]),
  /** Consultancy roles fan out into per-client engagements. */
  engagements: z.array(engagementSchema).default([]),
});

/** The badge beside a project title: who the work was for. */
export const projectOwners = [
  "Open Source",
  "RoomAngel",
  "BrightlifeCare",
  "Procedure Tech",
  "Paytm",
  "Pine Labs",
  "CommandK",
  "Bitespeed",
  "Treebo",
  "DocMyDoc",
  "Trabacus",
  "Adinav Labs",
  "Fiska Consulting",
  "Storii Labs",
  "Empirical Run",
  "Personal",
  "Collaboration",
] as const;

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  /** Rendered as the badge next to the title. */
  owner: z.enum(projectOwners),
  tagline: z.string().min(1),
  /** Long-form body. Only the featured projects carry one. */
  description: z.array(z.string().min(1)).default([]),
  /** Present only when the source is public and linkable. */
  repo: z.url().optional(),
  repoPath: z
    .string()
    .regex(/^[\w.-]+\/[\w.-]+$/)
    .optional(),
  /** Repositories that make up this project. A product split across api/app/portal is one project. */
  repos: z.array(z.string().regex(/^[\w.-]+\/[\w.-]+$/)).default([]),
  npm: z.array(z.string().min(1)).default([]),
  homepage: z.url().optional(),
  license: z.string().optional(),
  /** `closed` covers both private repositories and work with no repository at all. */
  visibility: z.enum(["public", "closed"]),
  tech: z.array(z.string().min(1)).default([]),
  facts: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .default([]),
  featured: z.boolean().default(false),
});

/**
 * Long-form write-up for an engagement. Deliberately split into product and
 * contribution: the product half is sourced from public material, the
 * contribution half describes what was done rather than how the system works.
 * Nothing proprietary belongs in either.
 */
export const caseStudySchema = z.object({
  /** Must match an engagement slug in experience.ts. */
  slug: z.string().regex(/^[a-z0-9-]+$/),
  headline: z.string().min(1),
  standfirst: z.string().min(1),
  product: z.object({
    name: z.string().min(1),
    url: z.url().optional(),
    /** One line on what the product is, in public terms. */
    what: z.string().min(1),
    who: z.string().min(1),
    /** Claims the company makes publicly, attributed as theirs. */
    publicClaims: z.array(z.string().min(1)).default([]),
  }),
  role: z.string().min(1),
  sections: z
    .array(
      z.object({
        heading: z.string().min(1),
        body: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(2),
  /** The honest closing section. A case study without one reads like a brochure. */
  reflection: z.array(z.string().min(1)).min(1),
});

export const skillGroupSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  /** Ordered strongest first - the UI does not re-sort. */
  items: z.array(z.string().min(1)).min(1),
});

export const educationSchema = z.object({
  degree: z.string().min(1),
  field: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  start: z.string().regex(/^\d{4}$/),
  end: z.string().regex(/^\d{4}$/),
});

export const hobbySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  /** One honest sentence. Not a bio. */
  line: z.string().min(1),
  emoji: z.string().min(1),
});

export const beliefSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  claim: z.string().min(1),
  /** The receipt. A belief without one is a poster quote. */
  receipt: z.string().min(1),
});

export type Link = z.infer<typeof linkSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Engagement = z.infer<typeof engagementSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Hobby = z.infer<typeof hobbySchema>;
export type Belief = z.infer<typeof beliefSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type WorkTag = Engagement["tags"][number];
