"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: BorderBeamProps) {
  // Local addition. The beam is a JavaScript-driven loop, so the CSS
  // reduced-motion kill switch in globals.css cannot reach it. It is purely
  // decorative, so the honest answer is not to draw it at all.
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:var(--border-width)_solid_transparent]",
        // The registry ships Tailwind v3's leading-`!` important modifier,
        // which v4 does not recognise - the mask silently vanishes and the beam
        // paints as a slab across the whole card. v4 puts the `!` at the end.
        "[mask-clip:padding-box,border-box]! [mask-composite:intersect]! [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        className,
      )}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          offsetAnchor: `${anchor}% 50%`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute aspect-square"
      />
    </div>
  );
}
