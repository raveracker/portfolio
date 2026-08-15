"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SilkAurora } from "@/components/ui/silk-aurora";
import { auroraDark } from "@/lib/palette";

/**
 * The aurora shader only ever *adds* light to its base colour, so a pale base
 * blows straight out to white. Rather than fight that, dark mode gets the real
 * canvas and light mode gets a CSS twilight wash - an aurora on a white page
 * was arguing with its own metaphor anyway.
 */
export function HeroBackdrop() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Until the theme resolves, render the wash. It is the cheaper of the two and
  // costs nothing if it is replaced a frame later.
  if (!mounted || resolvedTheme !== "dark") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_78%_-10%,var(--twilight-sky)_0%,transparent_45%),radial-gradient(100%_80%_at_12%_8%,var(--twilight-orchid)_0%,transparent_42%),radial-gradient(90%_70%_at_50%_100%,var(--twilight-blueviolet)_0%,transparent_55%)] opacity-[0.26]"
      />
    );
  }

  return (
    <SilkAurora
      aria-hidden
      interactive
      baseColor={auroraDark.baseColor}
      midColor={auroraDark.midColor}
      sheenColor={auroraDark.sheenColor}
      accentColor={auroraDark.accentColor}
      // The shader scales time by 0.12 internally, so anything under ~2 reads
      // as a still image. At 2.6 a ribbon cycle lands around ten seconds.
      speed={2.6}
      // The sheen, veil and pearlescent terms all add on top of each other, so
      // anything near 1 clips the sky blue to white at the ribbon crossings.
      intensity={0.7}
      // Grain is driven by the same clock at 90x, so it has to come down as
      // speed goes up or the whole field boils.
      grain={0.3}
      vignette={0.9}
      className="pointer-events-none absolute inset-0 -z-20"
    />
  );
}
