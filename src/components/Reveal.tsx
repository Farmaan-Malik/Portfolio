"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useRef, type ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

// Gently drifts its children as they scroll through the viewport (parallax).
export function Parallax({
  children,
  className,
  from = 24,
  to = -24,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [from, to]);
  const y = useSpring(yRaw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduce ? 0 : y }}>{children}</motion.div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <Parallax className="mb-12 md:mb-16">
      <Reveal>
        <span className="rule-label font-mono text-xs uppercase tracking-[0.3em] text-accent">
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display mt-4 text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </Reveal>
    </Parallax>
  );
}
