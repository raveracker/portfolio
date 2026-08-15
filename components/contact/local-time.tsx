"use client";

import { useEffect, useState } from "react";

/**
 * Rendered client-side only. Reading the clock on the server would make the
 * whole page dynamic, and the value would be stale the moment it arrived.
 */
export function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <span className="font-mono tabular-nums">
      {time ?? "--:--"}
      <span className="ml-1.5 text-muted-foreground">local</span>
    </span>
  );
}
