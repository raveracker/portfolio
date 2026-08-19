# Where the "44 projects delivered" number comes from

Two sources, reconciled so nothing is counted twice:

1. **GitHub** - what can be verified programmatically. 34 projects.
2. **The CV** - engagements whose code lived in client-owned organisations or off
   GitHub entirely, and so are invisible to any query. 10 projects.

Collected 2026-08-15. Raw grouping output in `github-project-tally.txt`.

---

## Part 1 - GitHub: 34 projects

Queried via GraphQL, authenticated as **both** `punkadillo` and `allan-ra`, each with
`repo` scope, so private repositories and organisation work are included.

### Method

1. For each account, list every non-fork repository under `OWNER`, `COLLABORATOR` and
   `ORGANIZATION_MEMBER` affiliation, plus every repository contributed to via commit,
   PR, review or creation.
2. Union the two accounts by `owner/name` so shared repositories are not double counted.
3. Drop learning, practice and scratch repositories.
4. Group repositories that make up one product into a single project - a product split
   across `api`, `portal` and `app` repositories is one project, not three.

### Result

| | |
| --- | --- |
| Distinct repositories touched | 69 |
| Excluded as learning/scratch | 14 |
| Repositories counted | 55 |
| **Distinct projects** | **34** |
| Projects involving private code | 23 |

Organisations: `ValueverseFZCO`, `proceduretech`, `punk-raven`, `empirical-run`,
`Fiska-Consulting-Private-Limited`, `storiilabs`, plus several individual collaborators.

GitHub also reports **1,003 restricted contributions** for `punkadillo` - commits in
private repositories it will not attribute to a named repository even to the account
owner. Those are already inside the 34 wherever the repository itself was visible.

---

## Part 2 - Not on GitHub: 10 projects

Each of these appears on the CV and has **no** repository under either account, because
the code lived in a client-owned organisation or on another host. Checked one by one
against the 34 above to be certain there is no overlap.

| # | Project | Employer | Why GitHub cannot see it |
| --- | --- | --- | --- |
| 1 | Payment services white-labelling (CITI Bank) | Pine Labs | Client org |
| 2 | Secrets Manager | CommandK | Client org |
| 3 | Bank Statement Analysis | Paytm | Client org |
| 4 | Free Credit Score | Paytm | Client org |
| 5 | Internal admin panel | Paytm | Client org |
| 6 | Hotel Superhero POS + thermal printer integration | Treebo Hotels | Client org |
| 7 | DocMyDoc iOS and Android app | DocMyDoc | Employer org |
| 8 | BookNGogo travel platform, social module | Trabacus | Employer org |
| 9 | Kafezz | Adinav Labs | Employer org |
| 10 | Protia | Adinav Labs | Employer org |

Already covered by Part 1 and deliberately **not** re-counted here: Hive
(`ValueverseFZCO/hive-*`), BrightlifeCare / HealthKart (`punkadillo/kh*`), E-Raktkosh
(`proceduretech/e-raktkosh`), Bitespeed (`punkadillo/bytespeed-demo-api`).

---

## Total: 44

## Judgement calls, stated plainly

- **BrightlifeCare counts as one project, not nine.** The CV names nine product lines
  (HealthKart, MuscleBlaze, Gritzo, FuelOne, TrueBasics, HK Vitals, Ronnie Coleman,
  Incredio, Smash) that all received the same design system. Counting them individually
  would give **52** and would be inflation: it was one system delivered nine times, not
  nine systems. The nine-brand fact keeps its own billing as a metric on the
  BrightlifeCare card on `/work`.
- **Multi-repo products count once.** Fraudvisor is 5 repositories, Hive is 4, the BB
  platform is 4, HealthKart is 3. Counting raw repositories would give 55.
- **Paytm's internal admin panel is included** even though the CV describes it as bug
  fixes and features on an existing product rather than a delivery. Excluding it gives
  **43**. It is in because the stat reads "projects delivered" in the sense of worked on
  and shipped, which that was.
- **Learning and scratch repositories are out.** All 14 are listed in
  `github-project-tally.txt`.

## Refreshing it

Re-run the collection and grouping scripts for Part 1, re-check Part 2 against
`content/experience.ts`, then update `stats` in `content/profile.ts`. The number is
deliberately static: computing it at request time would mean shipping a token with
private-repository scope, and half the total is not on GitHub at all.
