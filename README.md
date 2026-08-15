# allanjeo.dev

Personal portfolio for Allan Jeo Joseph. Next.js 16 App Router, React 19, Tailwind v4,
componentry.dev components pulled through the shadcn registry.

```bash
pnpm dev      # dev server
pnpm build    # production build
pnpm lint     # biome check
pnpm format   # biome format --write
```

## Content lives in `content/`, not in the pages

Every page reads typed objects from `content/*.ts`. Each file parses itself through a Zod
schema in `content/schema.ts` at import time, so a bad edit fails the build instead of
shipping a broken page.

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, title, taglines, links, availability, the four headline stats |
| `experience.ts` | Roles and their per-client engagements. `caseStudy: true` generates `/work/<slug>` |
| `projects.ts` | Open source projects, repos, npm packages, facts |
| `skills.ts` | Grouped skills plus the home page marquee list |
| `education.ts` | Degrees |
| `beliefs.ts` | The `/about` belief cards. Each claim needs a concrete receipt |
| `hobbies.ts` | **Placeholder.** Replace every `line`, add `/public/hobbies/<slug>.jpg` |
| `travel.ts` | **Placeholder.** Replace the trips. Exactly one should stay `status: "boarding"` |

Pages check `hasRealHobbyContent` / `hasRealTravelContent` and show a placeholder banner
until the copy is real, so nothing ships pretending to be finished.

## Twilight Hues

Tokens live in `app/globals.css`; raw hexes for JS consumers live in `lib/palette.ts`.
Change both or neither.

| Role | Dark | Light |
| --- | --- | --- |
| `brand` (primary, interactive) | `#87CEEB` exactly, 11.2:1 | same hue at L 0.539, 4.8:1 |
| `signal` (metrics, availability) | orchid lifted to L 0.618, 4.9:1 | `#9400D3`, 6.4:1 |
| `twilight-*` | the five source hexes, decoration only | same |

Sky blue is 11.2:1 on the near-black backdrop and 1.7:1 on white, so it cannot carry
both themes unchanged. The purples are the mirror image. Light mode therefore uses a
darkened sky and the raw `#9400D3`; dark mode uses raw sky and a lifted orchid. Every
foreground value was solved against the **surface**, the harder of the two backdrops,
not the page background. The `twilight-*` stops are never used for text and so are not
contrast-bound.

## Componentry

Registered in `components.json` as `@componentry`:

```bash
pnpm dlx shadcn@latest add @componentry/<name>
```

Components land in `components/ui/` as source we own and have edited. Local changes worth
knowing about:

- `magnetic-dock` renders a real `<a>` when a `href` is passed, so the dock is navigable by
  keyboard and readable by a screen reader.
- `command-menu` shows `item.group` as the subtitle and includes it in the search index;
  the icon slot no longer renders an empty box.
- `github-calendar` reads `/api/github/[username]` instead of `github-contributions-api.deno.dev`,
  which 404s since Deno Deploy Classic was sunset in July 2026.
- `silk-aurora` accumulates its own clock instead of reading wall-time since mount, pauses
  when scrolled off-screen or the tab is hidden, and re-reads `prefers-reduced-motion`
  live. Its shader scales time by `0.12`, so `speed` under ~2 renders as a still image.
- `github-calendar` gained a `twilight` colour ramp and uses it by default.
- `signature` uses `opentype.parse()` on a fetched buffer. `opentype.load()` is deprecated in
  v2 and fails in the browser. The font is self-hosted at `/public/LastoriaBoldRegular.otf`.
- `letter-cascade` and `kinetic-text-reveal` announce their text once instead of spelling it
  out per character.
- Six imports from `@workspace/ui/lib/utils` leaked out of the registry and were repointed at
  `@/lib/utils`.

`biome.json` relaxes a handful of stylistic rules for `components/ui/**` only. Everything we
wrote is linted at full strength.

## Environment

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG tags. Defaults to `https://allanjeo.dev` |
| `GITHUB_TOKEN` | Splits the contribution calendar into public and private work. Needs `repo` scope and must belong to the account being rendered. Server-side only; never reaches the browser. Without it the calendar still renders, from GitHub's public HTML, with no split |
| `RESEND_API_KEY` | Contact form delivery. Provision Resend through the Vercel Marketplace |
| `CONTACT_FROM_EMAIL` | Verified sender for the contact form |

Without the Resend variables the contact form fails loudly and points the sender at the
direct email address rather than silently dropping the message.

`.env.local` already holds a working `GITHUB_TOKEN` for local development. It is
gitignored. Set the same variable in Vercel before deploying, or the production calendar
falls back to the unsplit HTML source.

### Contribution history

The rolling year on the calendar is live from `raveracker` only - the route rejects a
token whose `viewer.login` does not match the requested username. Lifetime totals come
from `content/contributions-snapshot.json`, a frozen archive.

That archive is not decoration. GitHub un-attributes a user's contributions to an
organisation's private repositories once they are removed from the org, permanently and
irrecoverably; the `allan-healthkart` account used for BrightlifeCare lost its entire
history exactly that way. Anything not captured beforehand is gone. Refresh with:

```bash
gh auth switch --user raveracker
pnpm snapshot:contributions raveracker
```

Full findings in `docs/contributions-snapshot.md`.

### Why the calendar rebuilds the private series itself

GitHub's `contributionsCollection` reports private activity only as an aggregate
`restrictedContributionsCount`, and `commitContributionsByRepository` returns public
repositories alone - even for the account owner holding `repo` scope. So
`app/api/github/[username]/route.ts` lists every private repository the token can see and
reads each one's commit history filtered to that author, tallying by date. Roughly five
GraphQL calls, cached for an hour.
