import { profileSchema } from "./schema";

export const profile = profileSchema.parse({
  name: "Allan Jeo Joseph",
  shortName: "Allan",
  title: "Software Engineer",
  taglines: [
    "agents that ship",
    "design systems that scale",
    "proofs that stay private",
    "teams that move",
  ],
  location: "Mumbai, India",
  timezone: "Asia/Kolkata",
  email: "allanjeo95@gmail.com",
  phone: "+91 88666 86766",
  availability: {
    open: true,
    line: "Open to Roles - AI Native, Growth, Forward Deployed Engineer (Full Stack)",
  },
  summary:
    "Engineer at heart, builder by obsession. 6+ years shipping production software, now working at the intersection of engineering and AI - agentic architectures, RAG pipelines and MCP tool ecosystems that build, test and ship on their own.",
  story: [
    "It started with video games, and a tiny startup I ran while doing my graduation in BCA in college. What hooked me was not the games. It was watching how local businesses actually worked, and how much of their week was a problem waiting for someone to solve it. I was not the best student in the room. I was the most curious one.",
    "Then I built a clothing brand, Athflex, on three core values: customer service people remember, the best product on the shelf, a community that sticks around. It became a D2C business before the term existed.",
    "But the code kept pulling me back. It started with small projects where I did all of it: pitch the work, close the account, then sit down and build it with the team. There is no faster way to learn to be a teammate than owing people something you have already sold. Six years on it is the same job, the tools just got stranger. I build agentic systems that test, commit and ship on their own, and I drag new paradigms into production the week I find them. I love the craft, and I love the problem even more than the stack. Still curious. Still building.",
  ],
  ethos:
    "Learning never stops, at work or outside it. I like solving problems, but what I am really after is the moment it clicks. Engineering built that instinct. Entrepreneurship taught me to lead. Self-teaching, strategy and a lot of experimenting got me here, and is still a long way to go.",
  portrait: {
    src: "/allan.jpg",
    alt: "allan profile image",
    width: 512,
    height: 512,
  },
  links: [
    {
      label: "GitHub",
      href: "https://github.com/punkadillo",
      handle: "@punkadillo",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/allanjeo",
      handle: "in/allanjeo",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/jeoallan",
      handle: "@jeoallan",
    },
    {
      label: "Email",
      href: "mailto:allanjeo95@gmail.com",
      handle: "allanjeo95@gmail.com",
    },
  ],
  stats: [
    {
      value: "6+",
      label: "years shipping",
      source: "April 2019 - present, continuous production delivery",
    },
    {
      value: "44",
      label: "projects delivered",
      source:
        "34 verified on GitHub across punkadillo and allan-ra with private repos and org work included (70 repositories touched, 15 dropped as learning or scratch, 55 grouped into 34 products, 23 involving private code), plus 10 CV engagements whose code lived in client-owned orgs and so is invisible to any query - Pine Labs, CommandK, three Paytm products, Treebo, DocMyDoc, BookNGogo, Kafezz, Protia. Checked for overlap. Full reconciliation in docs/github-project-tally.md",
    },
    {
      value: "70%",
      label: "token cost removed",
      source: "Guardrails + knowledge dependency graph at BrightlifeCare",
    },
    {
      value: "10",
      label: "npm packages published",
      source:
        "4 public and MIT, verified on the npm registry under maintainer punkadillo: figma-code-composer, @anoncitizen/core, @anoncitizen/react, @anoncitizen/contracts. The remaining 6 are private and cannot be verified from a public registry.",
    },
  ],
});
