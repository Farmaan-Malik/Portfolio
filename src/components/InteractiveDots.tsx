"use client";

import { useEffect, useRef } from "react";

// A calm dot field with a warm glow that follows the cursor: nearby dots grow,
// brighten, tint sage → clay, and nudge outward. Flat 2D canvas - light-weight
// and controlled. Falls back to a faint static grid on touch / reduced-motion.
export function InteractiveDots({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const GAP = 40;
    const RADIUS = 150;
    const BASE_R = 1.1;
    const BASE_A = 0.16;

    let w = 0;
    let h = 0;
    let dots: { x: number; y: number; v: number }[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      const offX = (w - (cols - 1) * GAP) / 2;
      const offY = (h - (rows - 1) * GAP) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: offX + c * GAP, y: offY + r * GAP, v: 0 });
        }
      }
      if (reduce) drawStatic();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(139,187,146,${BASE_A})`;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, BASE_R, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const target = mouse.active && dist < RADIUS ? 1 - dist / RADIUS : 0;
        d.v += (target - d.v) * 0.15;

        const nd = dist || 1;
        const push = d.v * 8;
        const px = d.x + (dx / nd) * push;
        const py = d.y + (dy / nd) * push;
        const rr = BASE_R + d.v * 2.4;
        const a = BASE_A + d.v * 0.5;
        // sage → clay near the cursor
        const cr = Math.round(139 + (201 - 139) * d.v);
        const cg = Math.round(187 + (120 - 187) * d.v);
        const cb = Math.round(146 + (78 - 146) * d.v);

        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
        ctx.beginPath();
        ctx.arc(px, py, rr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    if (!reduce) {
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
