# Contribution history: what survives, and what was already lost

## The finding on `allan-healthkart`

The account exists. It is not recoverable as contribution history.

| | |
| --- | --- |
| Login | `allan-healthkart` |
| Name on the account | Allan Jeo Joseph |
| Email | `procedure.allan@brightlifecare.com` |
| Created | 2024-12-12 |
| Public repositories | 0 |
| Public organisations | none listed |
| Public events | none |

Checked 2026-08-15, authenticated as `raveracker`:

- `hasAnyContributions` is **true for 2024 only**, and that year holds a single
  contribution. For 2025 and 2026 it is **false**.
- `restrictedContributionsCount` is 0 for every year.
- The `brightlifecare` organisation is not publicly visible (404).
- Commit search across all public repositories, by both `author:allan-healthkart` and
  `author-email:procedure.allan@brightlifecare.com`, returns **22 commits, all of them in
  `raveracker/anoncitizen`, dated 2026-03-14 to 2026-03-15**. Nothing from the org.

### Why

When GitHub removes a user from an organisation, contributions that user made to that
organisation's **private** repositories stop being attributed to them. The commits still
exist inside the repositories with their original author metadata, but they leave the
contribution graph and the contributions API, permanently, and not even the account owner
can see them afterwards. Commit search only ever indexed public repositories, so it was
never going to help here either.

### The one avenue left

Authenticating **as `allan-healthkart`** and re-running the snapshot script would query
`viewer` rather than `user(login:)`, which is the only context where GitHub reports a
`restrictedContributionsCount` for private work. Expect an aggregate number at best, never
per-repository detail, and quite possibly zero if the removal already took effect. To try:

```bash
gh auth login          # as allan-healthkart
gh auth switch --user allan-healthkart
pnpm snapshot:contributions allan-healthkart
```

The BrightlifeCare **work itself** is not lost from the site. It is counted in the 44
projects through `raveracker/khapp`, `khportal` and `khserver`, and it keeps its own
metrics on the `/work` page. Only the green squares are gone.

## Organisation coverage audit

Asked directly: **were all organisation contributions recorded?** Originally, no. The first
pass relied on `contributionsCollection`, which reports private organisation work only as an
aggregate `restrictedContributionsCount` and gives no per-repository breakdown. The snapshot
script now runs a second pass over every repository in every organisation the account belongs
to, with commit history filtered to that author.

`raveracker`, verified 2026-08-15 - **170 authored commits across 10 repositories in 5
organisations**:

| Commits | Repository | |
| --- | --- | --- |
| 52 | `punk-raven/tnt` | private |
| 29 | `Fiska-Consulting-Private-Limited/fiska-monorepo` | private |
| 28 | `punk-raven/lawsafe` | private |
| 27 | `punk-raven/dotnix` | public |
| 22 | `storiilabs/rovii` | private |
| 4 | `punk-raven/landing-punks` | public |
| 3 | `proceduretech/ragnarok-recognition` | private |
| 2 | `proceduretech/e-raktkosh` | private |
| 2 | `punk-raven/lawman-llm` | private |
| 1 | `pinkribbongood/prg-frontend` | private |

Two things the audit turned up:

1. **`pinkribbongood` was missed entirely.** The original affiliation query returned zero
   repositories for that organisation; it actually holds six, one of which has a commit.
   One commit is below the bar for "delivered", so the project count stays at 44 rather
   than 45 - but that is a judgement call, and `vipin-developer/excel` at two commits is
   only marginally above it. Say the word and it goes in.
2. **Two project cards stated the wrong number.** Fiska read "1,189 commits" and Rovii
   "1,275 commits". Those were the repositories' *total* commit counts across all authors,
   not Allan's. Corrected to 29 and 22, relabelled "commits authored". The projects
   themselves were never in doubt; the figures were.

`allan-ra`, verified but **deliberately not recorded** - 37 authored commits in
`ValueverseFZCO`: `hive-admin-backend` 19, `hive-api-backend` 12, `hive-connector` 6.
`contributionsCollection` reports 0 for this account, which is why the org pass matters.
See [Not recorded](#not-recorded) below.

## The snapshot

`content/contributions-snapshot.json`, captured 2026-08-15. This exists precisely because
of the above: anything not archived before an account is removed cannot be recovered.

| Account | Total | Restricted (private) | Active days | Range |
| --- | --- | --- | --- | --- |
| `raveracker` | 1,312 | 1,003 | 328 | 2019-2026 |
| `allan-ra` | not recorded | - | - | - |
| `allan-healthkart` | unrecoverable | - | - | - |
| **Lifetime** | **1,312** | **1,003** | **328** | since 2019 |

Plus 170 authored commits across organisation repositories, captured per repository by the
second pass.

## Not recorded

`allan-ra` is excluded from the snapshot on instruction: its token is not maintained, so
its contributions are not to be captured without an explicit request. The script refuses
it by default and needs `--force`:

```bash
gh auth switch --user allan-ra
pnpm snapshot:contributions allan-ra --force
```

What is sitting there, verified 2026-08-15: **37 authored commits in `ValueverseFZCO`** -
19 in `hive-admin-backend`, 12 in `hive-api-backend`, 6 in `hive-connector`. All private.

**This is the same shape of loss as `allan-healthkart`.** Those 37 commits are readable
today only because the token still works. Once it lapses, or once the account loses org
access, they follow the BrightlifeCare history into being unrecoverable - and the account
is already reporting 0 through `contributionsCollection`, so nothing but a direct read of
repository history sees them at all. Capturing takes one command. Not capturing is a
decision with a deadline attached.

Per year for `raveracker`:

| Year | Contributions | Restricted | Active days |
| --- | --- | --- | --- |
| 2019 | 12 | 9 | 8 |
| 2020 | 58 | 53 | 15 |
| 2021 | 138 | 129 | 59 |
| 2022 | 33 | 24 | 15 |
| 2023 | 124 | 115 | 73 |
| 2024 | 274 | 268 | 83 |
| 2025 | 58 | 25 | 24 |
| 2026 | 615 | 380 | 51 |

Note how much of the record is *restricted*: 1,003 of 1,312 contributions are private work
GitHub will not attribute to a repository. That is the bulk of the career, and it is
exactly the category that vanishes when org access ends.

The file also stores every active day as `[date, count]` pairs per year, so the full daily
series survives even if an account later does not.

## How it is used

- **Rolling year** on the calendar: live, from `raveracker` via `GITHUB_TOKEN`. The route
  refuses a token whose `viewer.login` does not match the requested username, so no other
  account can feed that graph.
- **Lifetime totals** shown beside it: read from the snapshot, never live.

## Refreshing

```bash
gh auth switch --user raveracker
pnpm snapshot:contributions raveracker
```

The script merges by account rather than overwriting, so accounts captured at different
times accumulate and lifetime totals recompute across all of them.
