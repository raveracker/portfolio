"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered entrance for arbitrary blocks. Componentry ships text-level
 * reveals (text-animate, kinetic-text-reveal) but nothing for a card or a
 * section, so this is the one primitive written by hand rather than the same
 * initial/whileInView pair copy-pasted onto every element.
 *
 * Reduced motion renders the plain tag with no motion wrapper at all - framer
 * drives transforms from JavaScript, so the CSS kill switch in globals.css
 * cannot reach it.
 */

/** Shared easing so every entrance on a page settles the same way. */
export const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MOTION_TAGS = { div: motion.div, li: motion.li } as const;

type RevealProps = {
  as?: keyof typeof MOTION_TAGS;
  delay?: number;
  className?: string;
  id?: string;
  children: ReactNode;
};

export function Reveal({
  as = "div",
  delay = 0,
  className,
  id,
  children,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return (
      <Tag className={className} id={id}>
        {children}
      </Tag>
    );
  }

  const Motion = MOTION_TAGS[as];

  return (
    <Motion
      id={id}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.55, delay, ease: REVEAL_EASE }}
    >
      {children}
    </Motion>
  );
}

/** Index-based delay, capped so a long list does not trail into next week. */
export function staggerDelay(index: number, step = 0.07, cap = 5) {
  return Math.min(index, cap) * step;
}
