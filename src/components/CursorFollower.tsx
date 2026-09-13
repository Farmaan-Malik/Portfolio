"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// A soft ring that lags behind the cursor + a snappy dot. Grows over
// interactive elements. Skipped on touch devices and reduced-motion.
export function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });

  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // On touch / reduced-motion we simply never attach listeners, so the ring
    // and dot stay parked off-screen (invisible).
    if (!fine || reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("a, button, [data-cursor], input, textarea, label"));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        animate={{ scale: down ? 0.7 : hovering ? 2.2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 h-8 w-8 rounded-full border border-accent-2/70"
      />
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY }}
        animate={{ scale: hovering ? 0 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent"
      />
    </>
  );
}
