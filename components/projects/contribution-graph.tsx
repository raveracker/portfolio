"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ContributionDay as Day,
  ContributionsPayload as Payload,
} from "@/lib/contributions";
import { cn } from "@/lib/utils";

/** Sky for public work, orchid for private. Same lightness steps in both. */
const PUBLIC_RAMP = [
  "bg-[oklch(0.87_0.05_226)] dark:bg-[oklch(0.38_0.05_232)]",
  "bg-[oklch(0.79_0.09_226)] dark:bg-[oklch(0.53_0.08_228)]",
  "bg-[oklch(0.70_0.12_226)] dark:bg-[oklch(0.68_0.09_226)]",
  "bg-[oklch(0.61_0.14_226)] dark:bg-[oklch(0.81_0.08_226)]",
];

const PRIVATE_RAMP = [
  "bg-[oklch(0.87_0.05_316)] dark:bg-[oklch(0.38_0.08_312)]",
  "bg-[oklch(0.79_0.11_316)] dark:bg-[oklch(0.53_0.14_314)]",
  "bg-[oklch(0.70_0.17_314)] dark:bg-[oklch(0.68_0.16_318)]",
  "bg-[oklch(0.58_0.24_312)] dark:bg-[oklch(0.81_0.15_320)]",
];

const EMPTY = "bg-[oklch(0.93_0.01_260)] dark:bg-[oklch(0.24_0.02_288)]";

const WEEKDAYS = [
  { key: "sun", label: "" },
  { key: "mon", label: "Mon" },
  { key: "tue", label: "" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Cells outside the selected year still carry a date, so keys stay stable. */
type Cell = { inYear: boolean; day: Day };

/** Weekday rail, then one equal fraction per week. Shared by ruler and grid. */
const RAIL_TEMPLATE = (weeks: number) =>
  `1.75rem repeat(${weeks}, minmax(0, 1fr))`;

function intensity(count: number) {
  if (count >= 11) return 3;
  if (count >= 6) return 2;
  if (count >= 3) return 1;
  return 0;
}

/**
 * A full calendar year laid out the way GitHub does it: columns are weeks,
 * rows are weekdays, padded so 1 January lands on its real weekday.
 */
function buildGrid(year: number, days: Day[]) {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));

  // Back up to the Sunday on or before 1 January.
  const cursor = new Date(start);
  cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay());

  const weeks: Cell[][] = [];
  while (cursor <= end) {
    const week: Cell[] = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      const iso = cursor.toISOString().slice(0, 10);
      const inYear = cursor >= start && cursor <= end;
      week.push(
        inYear
          ? {
              inYear: true,
              day: byDate.get(iso) ?? {
                date: iso,
                count: 0,
                privateCount: 0,
                publicCount: 0,
              },
            }
          : {
              inYear: false,
              day: { date: iso, count: 0, privateCount: 0, publicCount: 0 },
            },
      );
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/**
 * `initial` is the frozen archive, rendered on the server, so the calendar is
 * on screen with the first paint. The fetch that follows only adds the current
 * year's latest days and the public/private split, and swaps them in when it
 * lands - there is no loading state to sit through.
 */
export function ContributionGraph({
  username,
  initial,
}: {
  username: string;
  initial: Payload;
}) {
  const [data, setData] = useState<Payload>(initial);
  const [selected, setSelected] = useState<number | null>(
    initial.years.at(-1)?.year ?? null,
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/github/${username}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: Payload) => {
        // The archive already covers the years, so a failed refresh costs the
        // live overlay and nothing else. It is never worth an error state.
        if (!cancelled && payload.years.length > 0) setData(payload);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [username]);

  const year = useMemo(
    () => data?.years.find((entry) => entry.year === selected) ?? null,
    [data, selected],
  );

  const weeks = useMemo(
    () => (year ? buildGrid(year.year, year.days) : []),
    [year],
  );

  if (!year) {
    return (
      <p className="text-sm text-muted-foreground">
        Contribution history is unavailable right now.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm">@{username}</span>
          <span className="text-sm text-muted-foreground">
            <span className="font-mono text-foreground">
              {data.lifetime.total.toLocaleString()}
            </span>{" "}
            contributions since {data.lifetime.since}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-mono text-signal">
            {data.lifetime.restricted.toLocaleString()}
          </span>{" "}
          of them private
          {data.organisationCommits ? (
            <>
              {" · "}
              <span className="font-mono text-foreground">
                {data.organisationCommits.total}
              </span>{" "}
              commits across organisations
            </>
          ) : null}
        </p>
      </div>

      <fieldset className="flex flex-wrap gap-1.5 border-0 p-0">
        <legend className="sr-only">Choose a year</legend>
        {data.years.map((entry) => (
          <button
            key={entry.year}
            type="button"
            aria-pressed={entry.year === selected}
            onClick={() => setSelected(entry.year)}
            className={cn(
              "rounded-lg px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              entry.year === selected
                ? "bg-brand text-brand-contrast"
                : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
            )}
          >
            {entry.year}
            <span className="ml-1.5 tabular-nums">{entry.total}</span>
          </button>
        ))}
      </fieldset>

      {/*
        Fluid grid rather than fixed 11px cells: the weeks are `1fr` columns, so
        the calendar always fills its container instead of leaving a gap on the
        right. Cells stay square via aspect-ratio, which also drives row height,
        and the weekday rail shares the same column template so the two line up.
        Below ~640px, 53 columns get too small to read, so it scrolls instead.
      */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px]">
          {/* Month ruler. A label sits above the first week that starts in it. */}
          <div
            className="mb-1.5 grid gap-[3px] font-mono text-[10px] text-muted-foreground"
            style={{ gridTemplateColumns: RAIL_TEMPLATE(weeks.length) }}
          >
            <span aria-hidden />
            {weeks.map((week, index) => {
              const first = week.find((cell) => cell.inYear)?.day;
              const day = first ? new Date(`${first.date}T00:00:00Z`) : null;
              const previous = weeks[index - 1]?.find(
                (cell) => cell.inYear,
              )?.day;
              const startsNewMonth =
                day &&
                day.getUTCDate() <= 7 &&
                (!previous ||
                  new Date(`${previous.date}T00:00:00Z`).getUTCMonth() !==
                    day.getUTCMonth());
              return (
                <span key={week[0].day.date} className="overflow-visible">
                  {startsNewMonth && day ? MONTHS[day.getUTCMonth()] : ""}
                </span>
              );
            })}
          </div>

          {/*
            One grid, filled column by column: the seven weekday labels first,
            then seven cells per week. Column flow is what keeps the rail and the
            swatches on the same rows without hard-coding a row height.
          */}
          <div
            className="grid grid-rows-7 gap-[3px]"
            style={{
              gridTemplateColumns: RAIL_TEMPLATE(weeks.length),
              gridAutoFlow: "column",
            }}
          >
            {WEEKDAYS.map(({ key, label }) => (
              <span
                key={key}
                className="flex items-center justify-end pr-1 font-mono text-[9px] leading-none text-muted-foreground"
              >
                {label}
              </span>
            ))}

            {weeks.flatMap((week) =>
              week.map((cell) => {
                if (!cell.inYear) {
                  return (
                    <span
                      key={cell.day.date}
                      className="aspect-square"
                      aria-hidden
                    />
                  );
                }
                const { day } = cell;
                const isPrivate = day.privateCount > day.publicCount;
                const ramp = isPrivate ? PRIVATE_RAMP : PUBLIC_RAMP;
                return (
                  <span
                    key={day.date}
                    // `title` carries the detail for pointer and screen reader
                    // alike, so the swatch needs no interaction handlers.
                    title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}${
                      isPrivate ? " (private)" : ""
                    }`}
                    className={cn(
                      "aspect-square rounded-[2px]",
                      day.count === 0 ? EMPTY : ramp[intensity(day.count)],
                    )}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-[2px]", PUBLIC_RAMP[2])} />
          Public
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-[2px]", PRIVATE_RAMP[2])} />
          Private
        </span>
        <span>
          {year.attributed
            ? `${year.activeDays} active days in ${year.year}`
            : `${year.activeDays} active days in ${year.year} · archived totals, no public/private split`}
        </span>
      </div>
    </div>
  );
}
