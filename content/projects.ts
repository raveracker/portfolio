import { z } from "zod";
import { type Project, projectSchema } from "./schema";

/**
 * All 44 projects behind the home page stat. 34 are reconciled from GitHub across
 * `punkadillo` and `allan-ra` including private repositories and organisation work;
 * 10 are CV engagements whose code lived in client-owned organisations and so has no
 * repository here. Method and overlap check in docs/github-project-tally.md.
 *
 * Taglines for GitHub projects are the repository's own description, not invented.
 */
export const projects: Project[] = z.array(projectSchema).parse([
  // ---------------------------------------------------------------- featured
  {
    slug: "figma-code-composer",
    name: "Figma Code Composer",
    owner: "Open Source",
    visibility: "public",
    featured: true,
    tagline:
      "Multi-agent scaffold that turns Figma designs into typed, framework-native components.",
    description: [
      "Published as figma-code-composer (fcc) on npm: a multi-agent orchestration scaffold that turns Figma designs into fully typed, framework-native frontend components for React, Vue, Angular and Svelte.",
      "The pipeline emits design tokens, components, icons, Storybook stories and tests from a single config.json, using a built-in knowledge graph that reuses components across screens instead of generating duplicates.",
      "Features complexity-based model routing across Haiku, Sonnet and Opus tiers, an append-only knowledge-graph ledger with RAG similarity retrieval, per-run handovers for context rehydration, and a 15-step setup wizard with a hard Figma-MCP reachability gate.",
    ],
    repo: "https://github.com/punkadillo/figma-code-composer",
    repoPath: "punkadillo/figma-code-composer",
    repos: ["punkadillo/figma-code-composer"],
    npm: ["figma-code-composer"],
    license: "MIT",
    tech: [
      "TypeScript",
      "Python",
      "Figma MCP",
      "Multi-Agent Orchestration",
      "RAG",
    ],
    facts: [
      { value: "137", label: "bundled skills" },
      { value: "4", label: "target frameworks" },
      { value: "2", label: "releases" },
    ],
  },
  {
    slug: "anoncitizen",
    name: "AnonCitizen",
    owner: "Open Source",
    visibility: "public",
    featured: true,
    tagline:
      "Privacy-preserving zero-knowledge proof protocol for Aadhaar identity verification.",
    description: [
      "A zero-knowledge protocol that lets a person prove their identity without exposing any personal data.",
      "Supports both off-chain and on-chain (EVM) verification, published as three npm packages: a TypeScript SDK, a React hooks library and Solidity smart contracts.",
      "Uses Groth16 proofs generated from Circom circuits, with nullifier-based sybil resistance.",
    ],
    repo: "https://github.com/punkadillo/anoncitizen",
    repoPath: "punkadillo/anoncitizen",
    repos: ["punkadillo/anoncitizen"],
    npm: ["anoncitizen"],
    license: "MIT",
    tech: ["TypeScript", "Circom", "Solidity", "Groth16", "Polygon Amoy"],
    facts: [
      { value: "202", label: "tests" },
      { value: "3", label: "npm packages" },
      { value: "2", label: "releases" },
    ],
  },
  {
    slug: "eri-tax-filing-agent",
    name: "ERI Tax Filing Agent",
    owner: "Open Source",
    visibility: "public",
    featured: true,
    tagline: "An ITR tax filing agent for ERIs.",
    description: [
      "An agentic system automating Indian ITR tax filing for ERIs.",
      "A multi-agent orchestrator built on Claude routes tool calls across six specialised agents covering authentication, return submission, DSC signing and envelope construction.",
      "Ships with a mock server and a dry-run mode so the whole flow can be exercised without touching a real filing.",
    ],
    repo: "https://github.com/punkadillo/eri-tax-filing-agent",
    repoPath: "punkadillo/eri-tax-filing-agent",
    repos: ["punkadillo/eri-tax-filing-agent"],
    license: "MIT",
    tech: ["TypeScript", "Anthropic API", "OpenAPI 3.0", "Zod", "Vitest"],
    facts: [
      { value: "6", label: "specialised agents" },
      { value: "dry-run", label: "safe by default" },
    ],
  },

  // ------------------------------------------------------------- open source
  {
    slug: "dotnix",
    name: "dotnix",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "Dotfiles to start coding with AI agents on the go with better workflow.",
    repo: "https://github.com/punk-raven/dotnix",
    repoPath: "punk-raven/dotnix",
    repos: ["punk-raven/dotnix"],
    license: "MIT",
    tech: ["Nix", "Shell", "Lua", "PowerShell"],
    facts: [{ value: "3", label: "platforms, one flake" }],
  },
  {
    slug: "fraudvisor",
    name: "Fraudvisor",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "A fraud detection platform using AI, plus a browser extension to detect scams.",
    repo: "https://github.com/punkadillo/fraudvisor",
    repoPath: "punkadillo/fraudvisor",
    repos: [
      "punkadillo/fraudvisor",
      "punkadillo/fraudvisor-backend",
      "punkadillo/fraudvisor-frontend",
      "punkadillo/fraudvisor-web-extension",
      "aniketsingh98571/Fraudvisor_Mumbai_Hacks_2025",
    ],
    license: "MIT",
    tech: ["TypeScript", "React", "Turborepo", "Docker Compose"],
    facts: [{ value: "5", label: "repositories" }],
  },
  {
    slug: "expo-image-editor",
    name: "expo-image-editor",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "A super simple image cropping and rotation tool for Expo that runs on iOS, Android and Web.",
    repo: "https://github.com/punkadillo/expo-image-editor",
    repoPath: "punkadillo/expo-image-editor",
    repos: ["punkadillo/expo-image-editor"],
    tech: ["TypeScript", "Expo", "React Native"],
  },
  {
    slug: "lavish-axi",
    name: "lavish-axi",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "Turns rich HTML artifacts into collaborative human review surfaces for agents.",
    repo: "https://github.com/punkadillo/lavish-axi",
    repoPath: "punkadillo/lavish-axi",
    repos: ["punkadillo/lavish-axi", "kunchenguid/lavish-axi"],
    tech: ["TypeScript", "Node.js", "CLI Tooling"],
  },
  {
    slug: "freellmapi",
    name: "freellmapi",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "A free-tier LLM API surface, published openly and picked up by a collaborator who mirrors it in their own repository.",
    repo: "https://github.com/punkadillo/freellmapi",
    repoPath: "punkadillo/freellmapi",
    repos: ["punkadillo/freellmapi", "tashfeenahmed/freellmapi"],
    tech: ["TypeScript"],
  },
  {
    slug: "landing-punks",
    name: "landing-punks",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "The introductory site for punk-raven, the org behind dotnix and LawSafe. JavaScript, TypeScript and Python in one small stack.",
    repo: "https://github.com/punk-raven/landing-punks",
    repoPath: "punk-raven/landing-punks",
    repos: ["punk-raven/landing-punks"],
    tech: ["JavaScript", "TypeScript", "Python"],
  },
  {
    slug: "render-tunnel",
    name: "render-tunnel",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "A small Node utility for tunnelling into Render deployments during local debugging.",
    repo: "https://github.com/punkadillo/render-tunnel",
    repoPath: "punkadillo/render-tunnel",
    repos: ["punkadillo/render-tunnel"],
    tech: ["JavaScript"],
  },
  {
    slug: "urovo-barcode-print",
    name: "Urovo TSC BarcodePrint",
    owner: "Open Source",
    visibility: "public",
    tagline:
      "Barcode printing for the Urovo i6300 and TSC Alpha-3RB Bluetooth label printer using their SDKs.",
    repo: "https://github.com/punkadillo/Urovo-TSC-BarcodePrint",
    repoPath: "punkadillo/Urovo-TSC-BarcodePrint",
    repos: ["punkadillo/Urovo-TSC-BarcodePrint"],
    tech: ["Java", "Android"],
  },

  // ------------------------------------------------------------------ client
  {
    slug: "hive",
    name: "Hive",
    owner: "RoomAngel",
    visibility: "closed",
    tagline:
      "AI-native infrastructure and agentic harnesses for hospitality operations, across four services.",
    repos: [
      "ValueverseFZCO/hive-api-backend",
      "ValueverseFZCO/hive-frontend-monorepo",
      "ValueverseFZCO/hive-admin-backend",
      "ValueverseFZCO/hive-connector",
    ],
    tech: ["Python (FastAPI)", "TypeScript", "Next.js", "MCP", "MongoDB"],
    facts: [
      { value: "2-3 days", label: "feature delivery" },
      { value: "98%", label: "accuracy" },
    ],
  },
  {
    slug: "brightlifecare",
    name: "Health Behavioural Analytics Platform",
    owner: "BrightlifeCare",
    visibility: "closed",
    tagline:
      "Mobile app, web platform and survey server for medical health behavioural analytics, plus a design system across nine brands.",
    repos: ["punkadillo/khapp", "punkadillo/khportal", "punkadillo/khserver"],
    tech: ["React", "React Native", "Node.js", "Tailwind CSS", "Storybook"],
    facts: [
      { value: "9", label: "brands unified" },
      { value: "-70%", label: "token usage" },
    ],
  },
  {
    slug: "e-raktkosh",
    name: "E-Raktkosh",
    owner: "Paytm",
    visibility: "closed",
    tagline:
      "Government blood donation mini app, built end to end as sole developer.",
    repos: ["proceduretech/e-raktkosh", "punkadillo/e-raktkosh-project-setup"],
    tech: ["React", "TypeScript"],
  },
  {
    slug: "ragnarok-recognition",
    name: "Ragnarok Recognition",
    owner: "Procedure Tech",
    visibility: "closed",
    tagline:
      "An employee recognition app built on the Frappe framework in Python, shipped for Procedure Tech internally.",
    repos: ["proceduretech/ragnarok-recognition"],
    tech: ["Python", "Frappe", "JavaScript"],
  },
  {
    slug: "bitespeed-identity",
    name: "Identity Reconciliation",
    owner: "Bitespeed",
    visibility: "public",
    tagline: "Bitespeed backend task: identity reconciliation.",
    repo: "https://github.com/punkadillo/bytespeed-demo-api",
    repoPath: "punkadillo/bytespeed-demo-api",
    repos: ["punkadillo/bytespeed-demo-api"],
    tech: ["TypeScript", "Node.js"],
  },
  {
    slug: "fiska",
    name: "Fiska Platform",
    owner: "Fiska Consulting",
    visibility: "closed",
    tagline:
      "A consulting platform in a TypeScript monorepo over PostgreSQL, with its infrastructure defined in Terraform alongside it.",
    repos: [
      "Fiska-Consulting-Private-Limited/fiska-monorepo",
      "Fiska-Consulting-Private-Limited/fiska-infra",
    ],
    tech: ["TypeScript", "PostgreSQL", "Terraform", "Docker"],
    facts: [{ value: "29", label: "commits authored" }],
  },
  {
    slug: "rovii",
    name: "Rovii",
    owner: "Storii Labs",
    visibility: "closed",
    tagline:
      "A full-stack product platform with its own Terraform-managed infrastructure, built with the Storii Labs team.",
    repos: ["storiilabs/rovii"],
    tech: ["TypeScript", "Python", "Terraform"],
    facts: [{ value: "22", label: "commits authored" }],
  },
  {
    slug: "empirical-run-ci",
    name: "CI Platform",
    owner: "Empirical Run",
    visibility: "closed",
    tagline:
      "A continuous integration platform in three parts: the service itself, the runner scripts it executes, and the Terraform that provisions both.",
    repos: [
      "empirical-run/ci-service",
      "empirical-run/ci-script",
      "empirical-run/infra",
    ],
    tech: ["TypeScript", "Shell", "Terraform", "Docker"],
  },
  {
    slug: "pine-labs-whitelabel",
    name: "Payment Services White-labelling",
    owner: "Pine Labs",
    visibility: "closed",
    tagline:
      "Partner theming for CITI Bank on a standardised global SCSS architecture.",
    tech: ["React", "SCSS", "CSS Custom Properties"],
  },
  {
    slug: "commandk-secrets",
    name: "Secrets Manager",
    owner: "CommandK",
    visibility: "closed",
    tagline:
      "Reusable frontend and a JSON-driven form generator with auto-generated validations.",
    tech: ["React", "TypeScript", "Playwright", "Docker"],
  },
  {
    slug: "paytm-bank-statement-analysis",
    name: "Bank Statement Analysis",
    owner: "Paytm",
    visibility: "closed",
    tagline: "Frontend owned end to end, managing a team of three developers.",
    tech: ["React", "JavaScript", "REST APIs"],
  },
  {
    slug: "paytm-free-credit-score",
    name: "Free Credit Score",
    owner: "Paytm",
    visibility: "closed",
    tagline:
      "Consumer credit score product, frontend ownership and performance work.",
    tech: ["React", "JavaScript", "Performance Optimization"],
  },
  {
    slug: "paytm-admin-panel",
    name: "Internal Admin Panel",
    owner: "Paytm",
    visibility: "closed",
    tagline: "Features and fixes on Paytm's internal admin tooling.",
    tech: ["React", "JavaScript"],
  },
  {
    slug: "treebo-hotel-superhero",
    name: "Hotel Superhero POS",
    owner: "Treebo",
    visibility: "closed",
    tagline:
      "POS features plus a thermal printer integration over WebSockets with multi-printer network config.",
    tech: ["React", "WebSockets", "Thermal Printer SDK"],
  },
  {
    slug: "docmydoc",
    name: "DocMyDoc",
    owner: "DocMyDoc",
    visibility: "closed",
    tagline:
      "iOS and Android health app: vaccination tracker, vitals tracker, document upload and a unified image/PDF viewer.",
    tech: ["React Native", "iOS (Swift)", "Android", "Firebase", "PDF.js"],
  },
  {
    slug: "bookngogo",
    name: "BookNGogo",
    owner: "Trabacus",
    visibility: "closed",
    tagline:
      "Instagram Story clone for the social module of a travel platform.",
    tech: ["React Native", "Redux", "React Navigation"],
  },
  {
    slug: "kafezz",
    name: "Kafezz",
    owner: "Adinav Labs",
    visibility: "closed",
    tagline: "Reusable React Native UI, on AWS infrastructure.",
    tech: ["React Native", "AWS (S3, SES, SNS)", "Firebase"],
  },
  {
    slug: "protia",
    name: "Protia",
    owner: "Adinav Labs",
    visibility: "closed",
    tagline:
      "React Native app with owned release management for Android and iOS.",
    tech: ["React Native", "Firebase", "Release Management"],
  },

  // ---------------------------------------------------------------- personal
  {
    slug: "lawsafe",
    name: "LawSafe",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "A chat-first way for any Indian to describe a legal problem in their own language and get a grounded, cited explanation of where they stand.",
    repos: ["punk-raven/lawsafe", "punk-raven/lawman-llm"],
    tech: ["Python", "TypeScript", "RAG", "LLM"],
  },
  {
    slug: "tnt",
    name: "TnT",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "A transcription and translation model served from a containerised Python pipeline. 52 authored commits, the heaviest of the private side projects.",
    repos: ["punk-raven/tnt"],
    tech: ["Python", "Docker"],
  },
  {
    slug: "bb-platform",
    name: "BB Food Management",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "Food management system across four surfaces: customer app, vendor app, admin portal and server.",
    repos: [
      "punkadillo/bbapp",
      "punkadillo/bbportal",
      "punkadillo/bbserver",
      "punkadillo/bbvendor",
    ],
    tech: ["React Native", "React", "Node.js", "Express"],
    facts: [{ value: "4", label: "surfaces" }],
  },
  {
    slug: "divvy",
    name: "Divvy",
    owner: "Personal",
    visibility: "closed",
    tagline: "A new and better version of Splitwise, mobile app plus backend.",
    repos: ["punkadillo/divvy-app", "punkadillo/divvy-central"],
    tech: ["TypeScript", "Kotlin", "Docker"],
  },
  {
    slug: "punkzero",
    name: "PunkZero",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "A custom ERP, CRM and LMS in one application, aimed at direct-to-consumer brands running all three on separate tools.",
    repos: ["punkadillo/punkzero"],
    tech: ["TypeScript", "Shell"],
  },
  {
    slug: "gymmy",
    name: "Gymmy",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "A workout management app for freelance trainers and gyms, covering programme building and client tracking.",
    repos: ["punkadillo/gymmy"],
    tech: ["TypeScript", "React"],
  },
  {
    slug: "bitledger",
    name: "BitLedger",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "A React Native passbook that tracks balances and movements across Bitcoin addresses.",
    repos: ["punkadillo/bitledger"],
    tech: ["React Native", "TypeScript"],
  },
  {
    slug: "projektwall",
    name: "Projektwall",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "A React and TypeScript board for tracking work in flight across projects.",
    repos: ["punkadillo/projektwall"],
    tech: ["TypeScript", "React"],
  },
  {
    slug: "saputc-dashboard",
    name: "SAPUTC Dashboard",
    owner: "Personal",
    visibility: "closed",
    tagline:
      "A React reporting dashboard built to surface operational figures in one view.",
    repos: ["punkadillo/saputc-dashboard"],
    tech: ["TypeScript", "React"],
  },

  // ----------------------------------------------------------- collaboration
  {
    slug: "zeno",
    name: "Zeno",
    owner: "Collaboration",
    visibility: "closed",
    tagline:
      "A two-repository build with two collaborators: a TypeScript interface in front of a Python service.",
    repos: ["aniketsingh98571/Zeno", "igoyalsamarth/zeno"],
    tech: ["TypeScript", "Python"],
  },
  {
    slug: "appointer-dashboards",
    name: "Appointer Dashboards",
    owner: "Collaboration",
    visibility: "closed",
    tagline:
      "Dashboard development for the Appointer product, built in React and TypeScript alongside its owner.",
    repos: ["dlande777/AppointerDashBoards"],
    tech: ["TypeScript", "React"],
  },
  {
    slug: "hummingnest",
    name: "HummingNest",
    owner: "Collaboration",
    visibility: "closed",
    tagline:
      "A React Native meditation app with native modules on both platforms, built with a collaborator.",
    repos: ["KurakulaHemanthKumar/HummingNest"],
    tech: ["React Native", "Java", "Objective-C"],
  },
  {
    slug: "mediwebsite",
    name: "MediWebsite",
    owner: "Collaboration",
    visibility: "closed",
    tagline:
      "A medical practice website built in React for a collaborator, the second of two projects with them.",
    repos: ["KurakulaHemanthKumar/React-App"],
    tech: ["JavaScript", "HTML", "CSS"],
  },
  {
    slug: "rto-polling",
    name: "RTO Polling",
    owner: "Collaboration",
    visibility: "closed",
    tagline:
      "A TypeScript polling service that watches regional transport office records and reports changes, server-rendered with EJS.",
    repos: ["salikansari6/rto-polling"],
    tech: ["TypeScript", "EJS"],
  },
  {
    slug: "excel-data",
    name: "Excel Data",
    owner: "Collaboration",
    visibility: "closed",
    tagline:
      "Spreadsheet ingestion and processing built with a collaborator, mixing JavaScript tooling with Python for the data passes.",
    repos: ["vipin-developer/excel"],
    tech: ["JavaScript", "Python"],
  },
]);

export const featuredProjects = projects.filter((project) => project.featured);
export const otherProjects = projects.filter((project) => !project.featured);

/** Badge order for the filter row: most work first, Open Source always leading. */
export const projectOwnerCounts = [...new Set(projects.map((p) => p.owner))]
  .map((owner) => ({
    owner,
    count: projects.filter((p) => p.owner === owner).length,
  }))
  .sort((a, b) =>
    a.owner === "Open Source"
      ? -1
      : b.owner === "Open Source"
        ? 1
        : b.count - a.count,
  );
