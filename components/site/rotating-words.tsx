"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type RotatingWordsProps = {
  words: string[];
  /** Milliseconds each word holds before the next one takes over. */
  interval?: number;
  className?: string;
};

/**
 * Componentry's flipping-word-swap only swaps between two fixed strings on
 * hover. The hero needs an unattended cycle through N taglines, so this is the
 * smallest thing that does that and nothing else.
 */
export function RotatingWords({
  words,
  interval = 2600,
  className,
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, reduceMotion, words.length]);

  return (
    <span className={cn("relative inline-grid", className)}>
      {/* An invisible copy of the longest word reserves the width, so the line
          after it never reflows mid-animation. */}
      <span aria-hidden className="invisible col-start-1 row-start-1 text-left">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: reduceMotion ? 0 : "0.4em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : "-0.4em" }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 text-left text-brand"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>

      {/* Screen readers get the full list once, not a word every 2.6 seconds. */}
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
