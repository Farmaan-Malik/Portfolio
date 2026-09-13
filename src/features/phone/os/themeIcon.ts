import { roundRectPath } from "./canvas";

// Home-screen tile for the theme switch. Shows the *target* mode: a moon on a
// night tile while the site is light, a sun on a day tile while it's dark.
export function drawThemeIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  dark: boolean
) {
  roundRectPath(ctx, x, y, size, size, size * 0.28);
  const g = ctx.createLinearGradient(x, y, x, y + size);
  if (dark) {
    g.addColorStop(0, "#ffd27a");
    g.addColorStop(1, "#ff9e5e");
  } else {
    g.addColorStop(0, "#3b4a6b");
    g.addColorStop(1, "#1e2540");
  }
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const cx = x + size / 2;
  const cy = y + size / 2;
  const R = size * 0.22;

  if (dark) {
    // sun (tap to go light)
    const col = "#7a3d12";
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = size * 0.045;
    ctx.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.lineTo(cx + Math.cos(a) * R * 1.35, cy + Math.sin(a) * R * 1.35);
      ctx.stroke();
    }
  } else {
    // crescent moon (tap to go dark) - lune between two same-radius circles
    ctx.fillStyle = "#eef2ff";
    ctx.beginPath();
    ctx.arc(cx - R * 0.2, cy, R, Math.PI * 0.5, Math.PI * 1.5, false);
    ctx.arc(cx + R * 0.35, cy, R, Math.PI * 1.5, Math.PI * 0.5, true);
    ctx.closePath();
    ctx.fill();
  }
}
