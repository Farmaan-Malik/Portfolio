"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { Reveal } from "./Reveal";
import { journey, type Milestone } from "@/lib/data";

const WORK = "#8bbb92";
const EDU = "#c9784e";

export function Journey() {
  // Horizontal-scroll timeline on desktop; simple vertical list on phones.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isDesktop ? <HorizontalTimeline /> : <VerticalTimeline />;
}

function Heading() {
  return (
    <>
      <span className="rule-label font-mono text-xs uppercase tracking-[0.3em] text-accent">
        Experience
      </span>
      <h2 className="font-display mt-4 text-4xl font-light tracking-tight text-foreground sm:text-5xl">
        The journey so far
      </h2>
    </>
  );
}

/* ---------- Desktop: vertical scroll drives a horizontal track ---------- */

function HorizontalTimeline() {
  const targetRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ distance: 0, vw: 0 });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, (p) => -dims.distance * p);
  const lineW = useTransform(
    scrollYProgress,
    (p) => dims.vw / 2 + dims.distance * p
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () =>
      setDims({
        vw: window.innerWidth,
        distance: Math.max(0, el.scrollWidth - window.innerWidth),
      });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="experience"
      ref={targetRef}
      style={{ height: `calc(100vh + ${dims.distance}px)` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 pt-24 sm:pt-28">
          <Heading />
        </div>

        <div className="relative flex-1">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="absolute left-0 top-1/2 flex h-[440px] -translate-y-1/2 items-center gap-4 px-[calc(50vw_-_150px)]"
          >
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-foreground/15" />
            <motion.div
              style={{ width: lineW }}
              className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-accent to-accent-2"
            />

            {journey.map((m, i) => (
              <Checkpoint key={i} m={m} up={i % 2 === 0} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Checkpoint({ m, up }: { m: Milestone; up: boolean }) {
  const color = m.kind === "work" ? WORK : EDU;

  const nodeV: Variants = {
    off: { scale: 0.5, backgroundColor: "rgba(255,255,255,0)", borderColor: "rgba(120,120,120,0.4)" },
    on: { scale: 1, backgroundColor: color, borderColor: color },
  };
  const cardV: Variants = {
    off: { opacity: 0.25, y: up ? -8 : 8, filter: "blur(2px)" },
    on: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <motion.div
      initial="off"
      whileInView="on"
      viewport={{ once: false, margin: "0px -40% 0px -40%" }}
      className="relative h-full w-[300px] shrink-0"
    >
      <div
        className={`absolute left-1/2 w-px -translate-x-1/2 bg-foreground/15 ${
          up ? "bottom-1/2 h-16" : "top-1/2 h-16"
        }`}
      />

      <motion.span
        variants={nodeV}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
      />

      <motion.div
        variants={cardV}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`glass absolute left-1/2 w-[280px] -translate-x-1/2 rounded-2xl p-5 ${
          up ? "bottom-[calc(50%+72px)]" : "top-[calc(50%+72px)]"
        }`}
      >
        <MilestoneBody m={m} color={color} />
      </motion.div>
    </motion.div>
  );
}

/* ---------- Mobile: plain vertical timeline ---------- */

function VerticalTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <section
      id="experience"
      className="mx-auto max-w-2xl scroll-mt-24 px-6 py-24"
    >
      <Heading />

      <div ref={ref} className="relative mt-12">
        {/* darker base line */}
        <div className="absolute left-0 top-2 h-full w-px bg-foreground/15" />
        {/* accent line that fills as you scroll checkpoint to checkpoint */}
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-0 top-2 h-full w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-accent to-accent-2"
        />

        <div className="space-y-8">
          {journey.map((m, i) => {
            const color = m.kind === "work" ? WORK : EDU;
            return (
              <div key={i} className="relative pl-8">
                <motion.span
                  initial={{
                    backgroundColor: "rgba(255,255,255,0)",
                    borderColor: "rgba(120,120,120,0.45)",
                    scale: 0.7,
                  }}
                  whileInView={{ backgroundColor: color, borderColor: color, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: false, margin: "-45% 0px -45% 0px" }}
                  className="absolute left-0 top-1.5 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 ring-4 ring-background"
                />
                <Reveal delay={0.05}>
                  <div className="glass rounded-2xl p-5">
                    <MilestoneBody m={m} color={color} />
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- shared card contents ---------- */

function MilestoneBody({ m, color }: { m: Milestone; color: string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-accent-2">{m.date}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            color,
            backgroundColor:
              m.kind === "work"
                ? "rgba(139,187,146,0.14)"
                : "rgba(201,120,78,0.14)",
          }}
        >
          {m.kind === "work" ? "Work" : "Education"}
        </span>
      </div>
      <h3 className="mt-2 font-display text-xl text-foreground">{m.title}</h3>
      <p className="text-sm text-accent">{m.org}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{m.detail}</p>
    </>
  );
}
