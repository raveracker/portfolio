import snapshot from "@/content/contributions-snapshot.json";

/**
 * Shape of the contribution calendar, and the archive-only build of it.
 *
 * Every year before the current one is frozen in contributions-snapshot.json,
 * so the whole calendar can be rendered on the server with no network at all.
 * The live GitHub pass only ever adds two things: the current year's most
 * recent days, and the public/private split for the trailing twelve months.
 * That is what lets the page paint instantly and enrich itself afterwards.
 */

export type ContributionDay = {
  date: string;
  count: number;
  privateCount: number;
  publicCount: number;
};

export type ContributionYear = {
  year: number;
  total: number;
  restricted: number;
  activeDays: number;
  /** True only for the window the token covers - past years have no split. */
  attributed: boolean;
  days: ContributionDay[];
};

export type ContributionsPayload = {
  years: ContributionYear[];
  rollingYear: { total: number; restricted: number; attributed: boolean };
  lifetime: {
    total: number;
    restricted: number;
    activeDays: number;
    since: number;
    capturedAt: string;
  };
  organisationCommits: { total: number } | null;
};

export type LiveDay = {
  count: number;
  privateCount: number;
  publicCount: number;
};

/** First year present in the snapshot, shown as "since <year>". */
export const EARLIEST_YEAR = Math.min(
  ...Object.values(snapshot.accounts).flatMap((account) =>
    Object.keys(account.years).map(Number),
  ),
);

export function buildPayload(
  username: string,
  live?: {
    days: Map<string, LiveDay>;
    rollingYear: { total: number; restricted: number; attributed: boolean };
  },
): ContributionsPayload {
  const account = snapshot.accounts[username as keyof typeof snapshot.accounts];
  const liveDays = live?.days ?? new Map<string, LiveDay>();

  // Every recorded year, archive first, live overlaid where the two overlap.
  const years = Object.entries(account?.years ?? {}).map(([year, record]) => {
    const days = new Map<string, LiveDay>();

    for (const [date, count] of record.days as [string, number][]) {
      days.set(date, { count, privateCount: 0, publicCount: 0 });
    }
    for (const [date, day] of liveDays) {
      if (date.startsWith(year)) days.set(date, day);
    }

    const entries = [...days.entries()].sort(([a], [b]) => a.localeCompare(b));

    return {
      year: Number(year),
      total: record.total,
      restricted: record.restricted,
      activeDays: entries.length,
      // Only the window the token covers carries a public/private split.
      attributed: entries.some(
        ([, day]) => day.privateCount > 0 || day.publicCount > 0,
      ),
      days: entries.map(([date, day]) => ({ date, ...day })),
    };
  });

  return {
    years,
    rollingYear: live?.rollingYear ?? {
      total: 0,
      restricted: 0,
      attributed: false,
    },
    lifetime: {
      total: snapshot.lifetime.total,
      restricted: snapshot.lifetime.restricted,
      activeDays: snapshot.lifetime.activeDays,
      since: EARLIEST_YEAR,
      capturedAt: snapshot.capturedAt,
    },
    organisationCommits: account?.organisationCommits ?? null,
  };
}
