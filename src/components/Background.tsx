"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { InteractiveDots } from "./InteractiveDots";

export function Background() {
  const { scrollYProgress } = useScroll();
  // Each glow drifts a different amount as you scroll → layered parallax depth.
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      {/* sage + terracotta glows: scroll-parallax on the parent, slow drift on the child */}
      <motion.div style={{ y: y1 }} className="absolute -left-40 top-0">
        <div className="animate-drift-a h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(139,187,146,0.22),transparent_60%)] blur-3xl" />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute -right-52 top-1/2">
        <div className="animate-drift-b h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(201,120,78,0.16),transparent_60%)] blur-3xl" />
      </motion.div>
      <motion.div style={{ y: y3 }} className="absolute bottom-0 left-1/4">
        <div className="animate-drift-c h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(139,187,146,0.12),transparent_60%)] blur-3xl" />
      </motion.div>

      {/* app-wide interactive dot field (fixed → follows the cursor everywhere) */}
      <InteractiveDots className="absolute inset-0 h-full w-full" />

      {/* soft top highlight (theme-aware) */}
      <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(to_bottom,var(--top-highlight),transparent)]" />
    </div>
  );
}
