import { z } from "zod";
import { type CaseStudy, caseStudySchema } from "./schema";

/**
 * Written from two sources only: the product's own public material, and what
 * Allan did. No architecture, no internal naming, no business logic, nothing
 * that belongs to a client. Where a company makes a claim about its own
 * results, it is attributed to them rather than presented as his.
 */
export const caseStudies: CaseStudy[] = z.array(caseStudySchema).parse([
  // ------------------------------------------------------------------- Hive
  {
    slug: "hive",
    headline: "Making a hotel's own numbers answerable in a sentence.",
    standfirst:
      "Hive unifies the systems a hotel already runs into one intelligence layer. I joined as a forward deployed engineer and built across it - integrations, the conversational surface, and the agent tooling the team now delivers with.",
    product: {
      name: "Hive, by RoomAngel",
      url: "https://www.roomangel.com/",
      what: "An AI platform for hospitality that pulls a hotel's disconnected systems into a single intelligence layer, queryable in plain language.",
      who: "Hotel groups, asset managers and performance-driven operators, from a single property upward.",
      publicClaims: [
        "RoomAngel reports Hive deployed across 15,000+ properties",
        "RoomAngel cites an 87% direct booking increase at an independent London property, March 2026",
        "RoomAngel cites a 15% reduction in OTA share within 90 days for a regional group",
      ],
    },
    role: "Forward Deployed Engineer · frontend and backend · July 2021 to present",
    sections: [
      {
        heading: "The problem the product exists to solve",
        body: [
          "A hotel already generates everything it needs to make good decisions. The trouble is where that information lives: the property management system, the revenue management system, the rate shopper, the ad platforms, the analytics, the point of sale, the review feeds. Each is a separate login with a separate export.",
          "RoomAngel's own framing is that revenue managers spend fifteen to twenty hours a week simply compiling data across those systems before any decision gets made. Marketing and revenue teams end up working from different pictures of the same week. Leadership has no single view of how an asset is actually performing.",
          "Hive's answer is to unify the feeds and put a conversational interface on top, so the question a manager actually has - why did last weekend underperform, what is our position against the comp set - can be asked directly rather than assembled by hand.",
        ],
      },
      {
        heading: "What I worked on",
        body: [
          "I work across the platform rather than in one layer of it: backend services and the frontend that sits on them, which for a forward deployed role means being close enough to the customer to see which gaps actually matter.",
          "A large part of the job is integration. Hospitality runs on established third-party platforms, and each property group arrives with a different combination of them. I built integrations against those platforms with multi-tenancy throughout, so one deployment serves many properties without their data or configuration bleeding across.",
          "On the product surface, I delivered the features that let a hotel interrogate its own revenue and revenue-centre performance through the natural-language interface - turning a question typed in a chat box into a grounded answer drawn from the connected systems.",
          "I also built agents that handle the repetitive work inside that interface. Where a task was being done the same way every time, it became something the system does on its own rather than something a person retypes.",
        ],
      },
      {
        heading: "The tooling underneath the delivery",
        body: [
          "The part I would point to first is not a feature. It is the harness the team builds with.",
          "I authored the custom agents, skills, hooks and orchestration that let a single command carry a feature through the backend, the frontend and the infrastructure together, with the conventions of the codebase already encoded rather than re-explained each time.",
          "The effect is measurable in delivery rather than in a demo. Feature work that took weeks now lands in two to three days, at 98% accuracy, with no rework cycle afterwards. That last part matters more than the speed: fast delivery that comes back for repair is not fast.",
        ],
      },
    ],
    reflection: [
      "The agent harness paid for itself, but it was built while shipping rather than before. If I were starting again I would encode the conventions earlier, when there were fewer of them to capture and less existing code disagreeing with them.",
      "The other thing I would change is how early the integration surface got a shared shape. Each platform arrived with its own model and the common ground only became obvious after several were in. Building the third one is when you learn what the first two should have looked like.",
    ],
  },

  // ---------------------------------------------------------- BrightlifeCare
  {
    slug: "brightlifecare",
    headline: "Nine storefronts, one component library, no per-brand forks.",
    standfirst:
      "Bright LifeCare runs India's largest D2C health and nutrition house of brands. I architected the shared frontend the storefronts are built from, and the agent tooling that keeps contributions to it consistent.",
    product: {
      name: "Bright LifeCare (HealthKart)",
      url: "https://www.blife.in/",
      what: "A house of direct-to-consumer health and nutrition brands, each with its own storefront, audience and identity.",
      who: "Indian consumers buying nutrition, supplements and wellness products online and in retail.",
      publicClaims: [
        "Bright LifeCare states its brands are used by over 2 million customers",
        "HealthKart, established 2011, is described as supported by 190+ retail outlets",
        "The group's brands include HealthKart, MuscleBlaze, HK Vitals, TrueBasics, Gritzo, FuelOne, Ronnie Coleman, Incredio and Smash",
      ],
    },
    role: "System architecture and design system migration · React, TypeScript, Tailwind CSS",
    sections: [
      {
        heading: "Nine brands is nine of everything",
        body: [
          "Every brand in the group needs the same furniture: a product card, a cart, a checkout, a review block, a search surface. What differs is the identity on top - the palette, the typography, the tone.",
          "Built brand by brand, that produces nine of every component, drifting apart with every release. A fix lands in one storefront and not the other eight. An accessibility improvement is made once and forgotten eight times. The per-product override becomes the normal way to get anything done, and the overrides are where the inconsistency accumulates.",
          "The work was to replace that with one shared foundation that all nine storefronts consume, themed rather than forked.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "I architected a multi-brand React component library with dynamic theming, so a single component serves all nine product lines and takes its identity from the brand consuming it rather than from a copy of itself.",
          "It follows atomic design, is built on Tailwind CSS, is documented in Storybook so a developer on any brand team can see what exists before writing a new one, and is held to accessibility compliance rather than having it retrofitted.",
          "Around the library sits the rest of the shared foundation - the supporting packages every storefront needs, versioned and released so brand teams can adopt changes deliberately instead of being surprised by them. The result is plug and play: the per-product manual overrides are gone across all nine.",
          "Alongside that I optimised Core Web Vitals across the storefronts, which moved page load, SEO and the ranking signals that follow from both.",
        ],
      },
      {
        heading: "Getting agents to write code that fits",
        body: [
          "A shared library only holds if what people add to it matches what is already there. That is a hard enough problem with humans; with AI assistance it gets harder, because a model with no context will happily invent a ninth button.",
          "So I authored agent skills that encode the architectural patterns, coding standards and domain knowledge of the codebase, so generated work arrives context-aware and production-shaped rather than plausible-looking.",
          "Underneath, I built a knowledge dependency graph over the shared source and the guardrails that read from it, so an agent can find what already exists instead of generating a near-duplicate. That is also where the efficiency came from: 70% less token usage, because retrieving the right context beats re-reading everything.",
          "I led and mentored the developers working on the shared architecture, with unit and end-to-end coverage over it.",
        ],
      },
    ],
    reflection: [
      "The guardrails were the highest-leverage thing built and the last thing started. Retrieval and consistency enforcement should have come before broad agent use, not after the first wave of near-duplicate components made the case for them.",
      "Nine consumers also means nine adoption curves. I would invest earlier in making version upgrades trivial for a brand team, because a shared library that is awkward to adopt quietly becomes a forked one.",
    ],
  },

  // -------------------------------------------------------------- Bitespeed
  {
    slug: "bitespeed",
    headline: "The push channel, built end to end on serverless.",
    standfirst:
      "BiteSpeed gives e-commerce brands one place to run marketing and support across every messaging channel. I built the web and mobile push notification channel, from the broadcast backend to the mobile SDK.",
    product: {
      name: "BiteSpeed",
      url: "https://bitespeed.co/",
      what: "A multichannel marketing, sales and support platform for e-commerce brands, spanning WhatsApp, email, SMS, Instagram, website chat and push notifications.",
      who: "E-commerce merchants, with a particular focus on Shopify brands.",
      publicClaims: [
        "BiteSpeed states it works with 6,000+ e-commerce brands across 50+ countries",
        "The company cites $100M+ in sales driven and 1.5B+ messages sent",
      ],
    },
    role: "Push notification service, end to end · AWS Serverless, Node.js, React Native",
    sections: [
      {
        heading: "One channel among many, and it has to behave like the rest",
        body: [
          "A multichannel platform is only as good as its weakest channel. A brand composing a campaign does not want to think about whether push behaves differently from email - it should schedule, target, send and report the same way.",
          "Push has its own awkwardness underneath that expectation. It runs through vendor infrastructure you do not control, it is subject to delivery mechanics that differ between web and mobile, and a broadcast means a very large number of sends in a very short window rather than a steady trickle.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "I built the web and mobile push notification service end to end on AWS Serverless: the broadcast path that fans a campaign out to its audience, and the webhook handling that brings delivery and engagement signals back, both sized for the burst shape that broadcast traffic actually has.",
          "Push vendors do not agree with one another, so I engineered multi-vendor configuration handling to keep those differences out of the rest of the system, along with scheduled template fetching so campaign content stayed current without a person triggering it.",
          "For the mobile side I wrote a React Native SDK for FCM push, so the channel worked inside the Shopify mobile app rather than only on the web.",
          "I also built a Lambda authorizer covering the REST and Lambda surface, so authorisation was enforced in one place rather than reimplemented per endpoint, and a tool that automated domain verification for email broadcast - a step that had been manual, slow and easy to get wrong during onboarding.",
        ],
      },
    ],
    reflection: [
      "This was infrastructure work where the interesting failures are all operational rather than logical. I would build the delivery observability first next time: when a broadcast underperforms you want to know within minutes whether it was the audience, the vendor or the payload, and that is much harder to add afterwards.",
      "The multi-vendor abstraction was also drawn after the second vendor rather than in anticipation of it, which is the right instinct but meant one migration that a slightly later abstraction would have avoided.",
    ],
  },
]);

export const caseStudyBySlug = new Map(
  caseStudies.map((study) => [study.slug, study]),
);
