"use client";

import {
  AnimatePresence,
  type MotionProps,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { type ElementType, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

interface TextAnimateProps extends MotionProps {
  /**
   * The text to animate
   */
  children: string;
  /**
   * The class name for the wrapper element
   */
  className?: string;
  /**
   * The class name for the segmented elements (words or characters)
   */
  segmentClassName?: string;
  /**
   * The base component to use for the wrapper
   */
  as?: ElementType;
  /**
   * The base delay for the animation
   */
  delay?: number;
  /**
   * The duration of the animation per item
   */
  duration?: number;
  /**
   * The type of animation to perform
   */
  animation?: AnimationType;
  /**
   * How to split the text
   */
  by?: "text" | "word" | "character";
  /**
   * Whether to start the animation when the element comes into view
   */
  startOnView?: boolean;
  /**
   * Whether to run the animation only once
   */
  once?: boolean;
  /**
   * Seconds between each segment. Local addition - the registry hard-codes
   * 0.1, which makes a paragraph-length string take several seconds to land.
   */
  stagger?: number;
}

export function TextAnimate({
  children,
  delay = 0,
  duration = 0.3,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = true,
  by = "word",
  animation = "fadeIn",
  stagger = 0.1,
  ...props
}: TextAnimateProps) {
  const reduceMotion = useReducedMotion();

  // Local addition. Framer writes the `hidden` variant into the server HTML,
  // so an h1 wrapped in this ships as opacity:0 and stays invisible until
  // hydration - permanently, with JavaScript off. Render the text plainly
  // until the client takes over, then let the animation run.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // A callback ref rather than framer's useInView: the animated element only
  // mounts on the second render, and useInView reads ref.current once in an
  // effect that never re-runs, so it would observe nothing and the text would
  // stay hidden forever.
  const [node, setNode] = useState<Element | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setIsInView(false);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, once]);

  const segments =
    by === "character"
      ? children.split("")
      : by === "word"
        ? children.split(" ")
        : [children];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Record<AnimationType, Variants> = {
    fadeIn: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { duration },
      },
    },
    blurIn: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration },
      },
    },
    blurInUp: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: { duration },
      },
    },
    blurInDown: {
      hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: { duration },
      },
    },
    slideUp: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration },
      },
    },
    slideDown: {
      hidden: { y: -20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration },
      },
    },
    slideLeft: {
      hidden: { x: 20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration },
      },
    },
    slideRight: {
      hidden: { x: -20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration },
      },
    },
    scaleUp: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: { duration },
      },
    },
    scaleDown: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: { duration },
      },
    },
  };

  const finalVariants = itemVariants[animation];

  // Use the 'as' prop to dynmically render the motion component.
  // Memoised locally: motion.create() returns a new component type on every
  // call, so calling it during render remounts the text and restarts the
  // animation each time isInView flips.
  const MotionComponent = useMemo(() => motion.create(Component), [Component]);

  // Local addition. Framer drives these transforms from JavaScript, so the
  // reduced-motion kill switch in globals.css cannot reach them - the text has
  // to be shown outright instead.
  const shown = reduceMotion || !startOnView || isInView;

  if (!hydrated) {
    return (
      <Component className={cn("whitespace-pre-wrap", className)}>
        {children}
      </Component>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        ref={setNode}
        className={cn("whitespace-pre-wrap", className)}
        initial={reduceMotion ? "show" : "hidden"}
        animate={shown ? "show" : "hidden"}
        exit="exit"
        variants={containerVariants}
        {...props}
      >
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${i}-${segment}`}
            className={cn("inline-block", segmentClassName)}
            variants={finalVariants}
          >
            {segment}
            {by === "word" && i < segments.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  );
}
