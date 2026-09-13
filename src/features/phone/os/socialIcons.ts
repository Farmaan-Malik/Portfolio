import { roundRectPath } from "./canvas";

// Brand marks as 24x24 SVG path data (rendered via Path2D onto the canvas).
const GITHUB =
  "M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.28 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z";
const LINKEDIN =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z";
const PHONE =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";

function tile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  roundRectPath(ctx, x, y, size, size, size * 0.28);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function glyph(
  ctx: CanvasRenderingContext2D,
  d: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  pad = 0.26
) {
  const p = size * pad;
  const scale = (size - 2 * p) / 24;
  ctx.save();
  ctx.translate(x + p, y + p);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(d));
  ctx.restore();
}

export function drawGithubIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  tile(ctx, x, y, size, "#1b1f24");
  glyph(ctx, GITHUB, x, y, size, "#ffffff", 0.24);
}

export function drawLinkedinIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  tile(ctx, x, y, size, "#0a66c2");
  glyph(ctx, LINKEDIN, x, y, size, "#ffffff", 0.26);
}

export function drawPhoneIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  tile(ctx, x, y, size, "#3aa76d");
  glyph(ctx, PHONE, x, y, size, "#ffffff", 0.24);
}

export function drawMailIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  tile(ctx, x, y, size, "#c9784e");
  const p = size * 0.28;
  const ew = size - 2 * p;
  const eh = ew * 0.74;
  const ex = x + p;
  const ey = y + (size - eh) / 2;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = size * 0.05;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  roundRectPath(ctx, ex, ey, ew, eh, 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ex + 1.5, ey + 3);
  ctx.lineTo(ex + ew / 2, ey + eh * 0.55);
  ctx.lineTo(ex + ew - 1.5, ey + 3);
  ctx.stroke();
}

// Small "opens externally" badge in the tile's top-right corner.
export function drawExternalBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const r = size * 0.16;
  const bx = x + r * 0.6;
  const by = y + size - r * 0.6;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // up-right arrow
  const s = r * 0.5;
  ctx.strokeStyle = "rgba(24,32,26,0.9)";
  ctx.lineWidth = size * 0.035;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(bx - s * 0.6, by + s * 0.6);
  ctx.lineTo(bx + s * 0.6, by - s * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx - s * 0.1, by - s * 0.6);
  ctx.lineTo(bx + s * 0.6, by - s * 0.6);
  ctx.lineTo(bx + s * 0.6, by + s * 0.1);
  ctx.stroke();
}
