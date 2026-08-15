#!/usr/bin/env node
/**
 * Freezes the complete contribution history to content/contributions-snapshot.json.
 *
 * Why a snapshot exists at all: GitHub un-attributes a user's contributions to an
 * organisation's private repositories once that user is removed from the org, and
 * it does so permanently - the account `allan-healthkart` used for BrightlifeCare
 * now reports hasAnyContributions=false for 2025 and 2026. Anything not captured
 * before an account is removed is simply lost. This file is the archive.
 *
 * Run it authenticated as the account being captured:
 *   gh auth switch --user raveracker && pnpm snapshot:contributions raveracker
 *
 * It merges into the existing snapshot rather than overwriting, so accounts
 * collected at different times accumulate.
 *
 * `allan-ra` is deliberately gated behind --force. Its token is not maintained and
 * its contributions are not to be recorded without an explicit instruction; see the
 * `notRecorded` block in the snapshot for what is there and what it is worth.
 *
 * Two sources are captured per account, because one alone is not enough:
 *
 *   contributionsCollection  - GitHub's own graph. Reliable for public work, but it
 *                              reports private organisation activity only as an
 *                              aggregate `restrictedContributionsCount`, and for some
 *                              accounts not at all (allan-ra: 0 reported, 37 real).
 *   organisation repositories - every repo in every org the account belongs to, with
 *                              commit history filtered to this author. This is the
 *                              only way private org work gets counted per repository.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "content", "contributions-snapshot.json");

const login = process.argv[2];
const force = process.argv.includes("--force");

if (!login) {
  console.error("usage: pnpm snapshot:contributions <login> [--force]");
  process.exit(1);
}

// Guarded on purpose. See the header.
if (login === "allan-ra" && !force) {
  console.error(
    "allan-ra is not recorded by default - its token is not maintained.\n" +
      "Pass --force only if you have decided to capture it.",
  );
  process.exit(1);
}

const FIRST_YEAR = 2019;
const LAST_YEAR = new Date().getFullYear();

const QUERY = `
query($from: DateTime!, $to: DateTime!) {
  viewer {
    login
    createdAt
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
      totalRepositoryContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

/** Arbitrary query with variables, for the organisation pass. */
function graphqlRaw(query, variables = {}) {
  const args = ["api", "graphql", "-f", `query=${query}`];
  for (const [key, value] of Object.entries(variables)) {
    args.push("-F", `${key}=${value}`);
  }
  return JSON.parse(
    execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }),
  ).data;
}

function graphql(from, to) {
  const raw = execFileSync(
    "gh",
    [
      "api",
      "graphql",
      "-f",
      `query=${QUERY}`,
      "-F",
      `from=${from}`,
      "-F",
      `to=${to}`,
    ],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  return JSON.parse(raw).data.viewer;
}

const years = {};
let createdAt = null;
let actualLogin = null;

for (let year = FIRST_YEAR; year <= LAST_YEAR; year++) {
  const viewer = graphql(`${year}-01-01T00:00:00Z`, `${year}-12-31T23:59:59Z`);
  actualLogin ??= viewer.login;
  createdAt ??= viewer.createdAt;

  if (viewer.login !== login) {
    console.error(
      `authenticated as ${viewer.login}, expected ${login}. Run: gh auth switch --user ${login}`,
    );
    process.exit(1);
  }

  const collection = viewer.contributionsCollection;
  // Store only days with activity. A full 8-year daily grid is mostly zeroes.
  const days = collection.contributionCalendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.contributionCount > 0)
    .map((day) => [day.date, day.contributionCount]);

  years[year] = {
    total: collection.contributionCalendar.totalContributions,
    commits: collection.totalCommitContributions,
    pullRequests: collection.totalPullRequestContributions,
    reviews: collection.totalPullRequestReviewContributions,
    issues: collection.totalIssueContributions,
    repositories: collection.totalRepositoryContributions,
    restricted: collection.restrictedContributionsCount,
    days,
  };

  console.log(
    `${year}: ${String(years[year].total).padStart(4)} contributions, ${String(years[year].restricted).padStart(4)} restricted, ${days.length} active days`,
  );
}

// --- organisation commits, filtered to this author --------------------------
// contributionsCollection will not attribute private org work per repository, so
// read it from the repositories themselves.
const ORGS_QUERY = `query { viewer { id organizations(first: 30) { nodes { login } } } }`;

const { id: authorId, organizations } = graphqlRaw(ORGS_QUERY).viewer;
const orgCommits = {};
let orgTotal = 0;

for (const { login: org } of organizations.nodes) {
  let repos;
  try {
    repos = graphqlRaw(
      `query($org: String!) {
         organization(login: $org) {
           repositories(first: 100, isFork: false) { nodes { name isPrivate } }
         }
       }`,
      { org },
    ).organization.repositories.nodes;
  } catch {
    console.log(`${org}: not visible`);
    continue;
  }

  const fields = repos
    .map(
      (repo, i) =>
        `r${i}: repository(owner: ${JSON.stringify(org)}, name: ${JSON.stringify(repo.name)}) {
           defaultBranchRef { target { ... on Commit { history(author: {id: $id}, first: 1) { totalCount } } } }
         }`,
    )
    .join("\n");

  const data = graphqlRaw(`query($id: ID!) {${fields}}`, { id: authorId });

  for (const [i, repo] of repos.entries()) {
    const count =
      data[`r${i}`]?.defaultBranchRef?.target?.history?.totalCount ?? 0;
    if (count === 0) continue;
    orgCommits[`${org}/${repo.name}`] = {
      commits: count,
      isPrivate: repo.isPrivate,
    };
    orgTotal += count;
  }
}

console.log(
  `\norganisation commits authored by ${login}: ${orgTotal} across ${Object.keys(orgCommits).length} repositories`,
);
for (const [repo, entry] of Object.entries(orgCommits).sort(
  (a, b) => b[1].commits - a[1].commits,
)) {
  console.log(
    `  ${String(entry.commits).padStart(4)}  ${repo}${entry.isPrivate ? " PRIVATE" : ""}`,
  );
}

const snapshot = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, "utf8"))
  : { capturedAt: null, accounts: {} };

snapshot.capturedAt = new Date().toISOString().slice(0, 10);
snapshot.accounts[login] = {
  login: actualLogin,
  createdAt,
  years,
  organisationCommits: { total: orgTotal, repositories: orgCommits },
};

// Lifetime totals across every account captured so far.
snapshot.lifetime = Object.values(snapshot.accounts).reduce(
  (acc, account) => {
    for (const year of Object.values(account.years)) {
      acc.total += year.total;
      acc.restricted += year.restricted;
      acc.commits += year.commits;
      acc.pullRequests += year.pullRequests;
      acc.reviews += year.reviews;
      acc.activeDays += year.days.length;
    }
    return acc;
  },
  {
    total: 0,
    restricted: 0,
    commits: 0,
    pullRequests: 0,
    reviews: 0,
    activeDays: 0,
  },
);

writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`\nwrote ${OUT}`);
console.log("lifetime:", snapshot.lifetime);
