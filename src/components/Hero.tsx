"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { profile } from "@/lib/data";

const Scene3D = dynamic(() => import("@/features/phone/PhoneScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-accent/20 blur-2xl" />
    </div>
  ),
});


const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Only mount the (heavy) 3D phone on desktop - on small screens the nexus
  // moves to the About background instead.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Mouse-driven parallax for the text layer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const tx = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const ty = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const onMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden py-24"
    >
      {/* readability wash over text side - desktop only */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-r from-background via-background/70 to-transparent lg:block" />

      {/* 3D phone - desktop only, fills the right half at full height.
          z-20 so the (transparent) text column doesn't intercept its taps. */}
      <div className="hidden lg:absolute lg:inset-y-0 lg:right-0 lg:z-20 lg:block lg:w-1/2">
        {isDesktop && <Scene3D />}
      </div>

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ x: tx, y: ty }}
          className="max-w-xl"
        >
          <motion.p
            variants={item}
            className="font-mono text-sm text-accent-2"
          >
            In case we haven&apos;t met,
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display mt-3 text-6xl font-light leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 flex items-center font-mono text-sm uppercase tracking-[0.35em] text-accent sm:text-base"
          >
            {profile.role}
            <span className="animate-blink ml-2 inline-block h-[0.95em] w-[3px] bg-accent-2" />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base leading-relaxed text-muted"
          >
            I build apps for small screens, and if you look closely, you might
            catch a game hiding in one.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
