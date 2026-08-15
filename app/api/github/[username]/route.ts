import { NextResponse } from "next/server";
import { buildPayload } from "@/lib/contributions";

/**
 * Contribution data for the calendar, split into public and private work.
 *
 * Getting that split is harder than it looks. GitHub's `contributionsCollection`
 * reports private activity only as an aggregate `restrictedContributionsCount`;
 * `commitContributionsByRepository` returns public repositories alone, even when
 * the caller is the account owner holding `repo` scope. So the private series is
 * rebuilt from the source: list every private repository the token can see, then
 * read each one's commit history filtered to this author, and tally by date.
 *
 * Three paths, in order of preference:
 *   1. `GITHUB_TOKEN` present  -> calendar + real public/private split.
 *   2. Token present but a step fails -> calendar with public attribution only.
 *   3. No token -> scrape GitHub's public HTML fragment, no split at all.
 *
 * Componentry's github-calendar originally called github-contributions-api.deno.dev,
 * which has returned 404 since Deno Deploy Classic was sunset in July 2026.
 *
 * The rolling year is live. Lifetime totals come from content/contributions-snapshot.json,
 * because GitHub un-attributes contributions to an organisation's private repositories
 * once the account is removed from that org - see the `unrecoverable` entry in the
 * snapshot for the BrightlifeCare account that was lost exactly that way. Anything not
 * archived before an account goes is gone.
 */

export const revalidate = 3600;

const LEVELS = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

type Level = (typeof LEVELS)[number];

type Day = {
  date: string;
  contributionCount: number;
  contributionLevel: Level;
  privateCount: number;
  publicCount: number;
  color: string;
};

/** Repositories per batched GraphQL request, and history pages per repository. */
const REPO_BATCH = 20;
const MAX_HISTORY_PAGES = 3;

/** The repository list changes far more slowly than the contribution graph. */
const REPO_LIST_REVALIDATE = 86_400;

async function graphql<T>(
  token: string,
  query: string,
  variables: object,
  ttl: number = revalidate,
): Promise<T | null> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-contributions",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: ttl },
  });
  if (!response.ok) return null;
  const body = await response.json();
  return (body?.data as T) ?? null;
}

const CALENDAR_QUERY = `
query($from: DateTime!, $to: DateTime!) {
  viewer {
    id
    login
    contributionsCollection(from: $from, to: $to) {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
      commitContributionsByRepository(maxRepositories: 100) {
        repository { isPrivate }
        contributions(first: 100) { nodes { occurredAt commitCount } }
      }
    }
  }
}`;

const PRIVATE_REPOS_QUERY = `
query($endCursor: String) {
  viewer {
    id
    repositories(first: 100, after: $endCursor, isFork: false, privacy: PRIVATE,
      ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
      pageInfo { hasNextPage endCursor }
      nodes { owner { login } name }
    }
  }
}`;

type RepoRef = { owner: string; name: string };

type HistoryPage = {
  pageInfo: { hasNextPage: boolean; endCursor: string };
  nodes: { committedDate: string }[];
};

type PrivateReposResult = {
  viewer: {
    id: string;
    repositories: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: { owner: { login: string }; name: string }[];
    };
  };
};

/**
 * Also returns the viewer id. The commit-history queries need it, and taking
 * it from here rather than from the calendar means they no longer wait on the
 * calendar round trip - the two run side by side instead of end to end.
 */
async function listPrivateRepos(
  token: string,
): Promise<{ repos: RepoRef[]; viewerId: string | null }> {
  const repos: RepoRef[] = [];
  let cursor: string | null = null;
  let viewerId: string | null = null;

  for (let page = 0; page < 5; page++) {
    const data: PrivateReposResult | null = await graphql<PrivateReposResult>(
      token,
      PRIVATE_REPOS_QUERY,
      { endCursor: cursor },
      REPO_LIST_REVALIDATE,
    );

    if (!data) break;
    viewerId = data.viewer.id;
    for (const node of data.viewer.repositories.nodes) {
      repos.push({ owner: node.owner.login, name: node.name });
    }
    if (!data.viewer.repositories.pageInfo.hasNextPage) break;
    cursor = data.viewer.repositories.pageInfo.endCursor;
  }

  return { repos, viewerId };
}

/** Commit dates authored by `authorId` in the given private repositories. */
async function privateCommitDates(
  token: string,
  repos: RepoRef[],
  authorId: string,
  since: string,
): Promise<Map<string, number>> {
  const perDate = new Map<string, number>();

  const record = (nodes: { committedDate: string }[]) => {
    for (const node of nodes) {
      const date = node.committedDate.slice(0, 10);
      perDate.set(date, (perDate.get(date) ?? 0) + 1);
    }
  };

  const batches: RepoRef[][] = [];
  for (let start = 0; start < repos.length; start += REPO_BATCH) {
    batches.push(repos.slice(start, start + REPO_BATCH));
  }

  /** Follow one repository's cursor past the first page. Inherently serial. */
  const drain = async (repo: RepoRef, first: HistoryPage) => {
    const collected = [...first.nodes];
    let { hasNextPage, endCursor } = first.pageInfo;

    // Deep histories get a bounded number of extra pages rather than none.
    for (let page = 1; hasNextPage && page < MAX_HISTORY_PAGES; page++) {
      const more = await graphql<{
        repository?: {
          defaultBranchRef?: { target?: { history?: HistoryPage } };
        };
      }>(
        token,
        `query($owner: String!, $name: String!, $since: GitTimestamp!, $authorId: ID!, $after: String!) {
             repository(owner: $owner, name: $name) {
               defaultBranchRef { target { ... on Commit {
                 history(since: $since, author: {id: $authorId}, first: 100, after: $after) {
                   pageInfo { hasNextPage endCursor }
                   nodes { committedDate }
                 }
               } } }
             }
           }`,
        {
          owner: repo.owner,
          name: repo.name,
          since,
          authorId,
          after: endCursor,
        },
      );

      const next = more?.repository?.defaultBranchRef?.target?.history;
      if (!next) break;
      collected.push(...next.nodes);
      hasNextPage = next.pageInfo.hasNextPage;
      endCursor = next.pageInfo.endCursor;
    }

    return collected;
  };

  // Batches run concurrently, and so does each repository's own pagination.
  // Serially this was the bulk of the request; every round trip here costs
  // most of a second against GitHub's API.
  const perBatch = await Promise.all(
    batches.map(async (batch) => {
      // One request per batch, repositories aliased r0..rN.
      const fields = batch
        .map(
          (repo, i) => `
  r${i}: repository(owner: ${JSON.stringify(repo.owner)}, name: ${JSON.stringify(repo.name)}) {
    defaultBranchRef { target { ... on Commit {
      history(since: $since, author: {id: $authorId}, first: 100) {
        pageInfo { hasNextPage endCursor }
        nodes { committedDate }
      }
    } } }
  }`,
        )
        .join("\n");

      const data = await graphql<Record<string, unknown>>(
        token,
        `query($since: GitTimestamp!, $authorId: ID!) {${fields}\n}`,
        { since, authorId },
      );
      if (!data) return [];

      return Promise.all(
        batch.map(async (repo, i) => {
          const history = (
            data[`r${i}`] as
              | { defaultBranchRef?: { target?: { history?: HistoryPage } } }
              | undefined
          )?.defaultBranchRef?.target?.history;

          if (!history) return [];
          return history.pageInfo.hasNextPage
            ? drain(repo, history)
            : history.nodes;
        }),
      );
    }),
  );

  for (const batch of perBatch) {
    for (const nodes of batch) record(nodes);
  }

  return perDate;
}

async function fromGraphQL(username: string, token: string) {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);

  // Three GitHub phases, two of them independent. The calendar runs beside the
  // whole repositories -> commit-history chain rather than in front of it, so
  // the request costs max(calendar, repos + commits) instead of the sum.
  const [calendar, privatePerDate] = await Promise.all([
    graphql<{
      viewer: {
        id: string;
        login: string;
        contributionsCollection: {
          restrictedContributionsCount: number;
          contributionCalendar: {
            totalContributions: number;
            weeks: {
              contributionDays: {
                date: string;
                contributionCount: number;
                contributionLevel: Level;
              }[];
            }[];
          };
          commitContributionsByRepository: {
            repository: { isPrivate: boolean };
            contributions: {
              nodes: { occurredAt: string; commitCount: number }[];
            };
          }[];
        };
      };
    }>(token, CALENDAR_QUERY, {
      from: from.toISOString(),
      to: to.toISOString(),
    }),
    listPrivateRepos(token)
      .then(({ repos, viewerId }) =>
        viewerId && repos.length > 0
          ? privateCommitDates(token, repos, viewerId, from.toISOString())
          : new Map<string, number>(),
      )
      // Fall through with public attribution only rather than failing the page.
      .catch(() => new Map<string, number>()),
  ]);

  // The token belongs to one account; only trust it for that account's graph.
  if (
    !calendar ||
    calendar.viewer.login.toLowerCase() !== username.toLowerCase()
  ) {
    return null;
  }

  const collection = calendar.viewer.contributionsCollection;

  const publicPerDate = new Map<string, number>();
  for (const entry of collection.commitContributionsByRepository ?? []) {
    if (entry.repository?.isPrivate) continue;
    for (const node of entry.contributions?.nodes ?? []) {
      const date = node.occurredAt.slice(0, 10);
      publicPerDate.set(
        date,
        (publicPerDate.get(date) ?? 0) + node.commitCount,
      );
    }
  }

  const weeks: Day[][] = collection.contributionCalendar.weeks.map((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      contributionCount: day.contributionCount,
      contributionLevel: day.contributionLevel,
      privateCount: privatePerDate.get(day.date) ?? 0,
      publicCount: publicPerDate.get(day.date) ?? 0,
      color: "",
    })),
  );

  return {
    contributions: weeks,
    totalContributions: collection.contributionCalendar.totalContributions,
    restrictedContributions: collection.restrictedContributionsCount ?? 0,
    privateDays: [...privatePerDate.keys()].length,
    attributed: privatePerDate.size > 0 || publicPerDate.size > 0,
  };
}

const dayPattern =
  /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="contribution-day-component-(\d+)-(\d+)"[^>]*data-level="(\d)"/g;
const tooltipPattern =
  /<tool-tip[^>]*for="contribution-day-component-(\d+)-(\d+)"[^>]*>([^<]*)</g;

async function fromHtml(username: string) {
  const response = await fetch(
    `https://github.com/users/${username}/contributions`,
    {
      headers: { "User-Agent": "portfolio-contributions" },
      next: { revalidate },
    },
  );
  if (!response.ok) return null;

  const html = await response.text();

  const counts = new Map<string, number>();
  for (const [, row, column, text] of html.matchAll(tooltipPattern)) {
    const match = /^(No|[\d,]+) contribution/.exec(text.trim());
    counts.set(
      `${row}-${column}`,
      match && match[1] !== "No" ? Number(match[1].replace(/,/g, "")) : 0,
    );
  }

  const weeks: Day[][] = [];
  let total = 0;

  for (const [, date, row, column, level] of html.matchAll(dayPattern)) {
    const weekIndex = Number(column);
    const count = counts.get(`${row}-${column}`) ?? 0;
    total += count;

    weeks[weekIndex] ??= [];
    weeks[weekIndex][Number(row)] = {
      date,
      contributionCount: count,
      contributionLevel: LEVELS[Number(level)] ?? "NONE",
      privateCount: 0,
      publicCount: 0,
      color: "",
    };
  }

  if (weeks.length === 0) return null;

  return {
    // Trailing gaps appear when the final week is partial - drop the holes.
    contributions: weeks.map((week) => week.filter(Boolean)),
    totalContributions: total,
    restrictedContributions: 0,
    privateDays: 0,
    attributed: false,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  if (!/^[\w-]{1,39}$/.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const data =
    (token ? await fromGraphQL(username, token) : null) ??
    (await fromHtml(username));

  if (!data) {
    return NextResponse.json(
      { error: "No contribution data found" },
      { status: 502 },
    );
  }

  // Live days, keyed by date, so the current year can be overlaid on the archive.
  const days = new Map(
    data.contributions
      .flat()
      .filter((day) => day.contributionCount > 0)
      .map((day) => [
        day.date,
        {
          count: day.contributionCount,
          privateCount: day.privateCount,
          publicCount: day.publicCount,
        },
      ]),
  );

  return NextResponse.json(
    buildPayload(username, {
      days,
      rollingYear: {
        total: data.totalContributions,
        restricted: data.restrictedContributions,
        attributed: data.attributed,
      },
    }),
    {
      headers: {
        // The upstream calls cost seconds, and contribution history moves once
        // a day at most. Serve stale while a refresh happens behind it so no
        // visitor ever waits on GitHub.
        "Cache-Control": `public, max-age=0, s-maxage=${revalidate}, stale-while-revalidate=86400`,
      },
    },
  );
}
