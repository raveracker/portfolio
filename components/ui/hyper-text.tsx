"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  className?: string;
  duration?: number;
  text: string;
  animateOnLoad?: boolean;
}

const alphabets =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const HyperText = ({
  className,
  duration = 800,
  text,
  animateOnLoad = true,
}: HyperTextProps) => {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const iterations = useRef(0);
  const isFirstRender = useRef(true);
  // Local addition. The scramble is a JavaScript interval, so the CSS
  // reduced-motion kill switch in globals.css cannot stop it - the component
  // has to opt out itself and render the settled text.
  const reduceMotion = useReducedMotion();

  const triggerAnimation = () => {
    iterations.current = 0;
    setTrigger(true);
  };

  useEffect(() => {
    if (reduceMotion) return;

    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval);
          isFirstRender.current = false;
          return;
        }
        if (iterations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? l
                : i <= iterations.current
                  ? (text[i] ?? "")
                  : alphabets[Math.floor(Math.random() * alphabets.length)],
            ),
          );
          iterations.current = iterations.current + 0.1;
        } else {
          setTrigger(false);
          clearInterval(interval);
        }
      },
      duration / (text.length * 10),
    );
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [text, duration, trigger, animateOnLoad, reduceMotion]);

  return (
    <div
      className={cn(
        "flex cursor-default overflow-hidden py-2 font-mono",
        className,
      )}
      onMouseEnter={reduceMotion ? undefined : triggerAnimation}
    >
      {displayText.map((letter, i) => (
        // Local fix: each character is its own flex item, and a plain space
        // collapses to nothing there - multi-word text renders as one run.
        <span key={i} className="min-w-[0.1em]">
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </div>
  );
};
