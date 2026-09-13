import { roundRectPath } from "./canvas";
import type { HomeIcon } from "./types";

interface IconRect {
  icon: HomeIcon;
  x: number;
  y: number;
  size: number;
}

const COLS = 4;
const ICON = 52;
const PAD_X = 28;
const TOP = 156; // first icon row, below the clock header
const ROW_H = 84;

// The phone's home screen: wallpaper, status bar, clock, and a grid of tiles.
export class HomeScreen {
  private rects: IconRect[] = [];
  private gap: number;
  private t = 0;
  private secTimer = 1;
  private clockText = "";
  private statusTime = "";
  private dateText = "";

  constructor(
    private W: number,
    private H: number,
    icons: HomeIcon[]
  ) {
    this.gap = (W - PAD_X * 2 - COLS * ICON) / (COLS - 1);
    icons.forEach((icon, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      this.rects.push({
        icon,
        x: PAD_X + col * (ICON + this.gap),
        y: TOP + row * ROW_H,
        size: ICON,
      });
    });
    this.refreshTime();
  }

  private refreshTime() {
    const d = new Date();
    const h = d.getHours();
    const h12 = ((h + 11) % 12) + 1;
    const mm = String(d.getMinutes()).padStart(2, "0");
    this.clockText = `${h12}:${mm}`;
    this.statusTime = `${this.clockText} ${h < 12 ? "AM" : "PM"}`;
    this.dateText = d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  update(dt: number) {
    this.t += dt;
    this.secTimer += dt;
    if (this.secTimer >= 1) {
      this.secTimer = 0;
      this.refreshTime();
    }
  }

  hitTest(px: number, py: number): HomeIcon | null {
    for (const r of this.rects) {
      if (
        px >= r.x - 6 &&
        px <= r.x + r.size + 6 &&
        py >= r.y - 6 &&
        py <= r.y + r.size + 18
      ) {
        return r.icon;
      }
    }
    return null;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { W, H } = this;

    // wallpaper
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#e4efe6");
    g.addColorStop(1, "#c6dccd");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // soft ambient blobs
    this.blob(ctx, W * 0.2, H * 0.3, 120, "rgba(139,187,146,0.35)");
    this.blob(ctx, W * 0.85, H * 0.62, 150, "rgba(201,120,78,0.16)");

    this.statusBar(ctx);

    // clock header
    ctx.fillStyle = "rgba(28,38,31,0.92)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.font = "200 54px system-ui, sans-serif";
    ctx.fillText(this.clockText, W / 2, 88);
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillStyle = "rgba(28,38,31,0.55)";
    ctx.fillText(this.dateText, W / 2, 112);

    // tiles + labels
    for (const r of this.rects) {
      r.icon.drawIcon(ctx, r.x, r.y, r.size, this.t);
      ctx.fillStyle = "rgba(28,38,31,0.85)";
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(
        r.icon.label,
        r.x + r.size / 2,
        r.y + r.size + 7,
        r.size + this.gap
      );
    }

    // subtle hint (kept well above the home button)
    ctx.fillStyle = "rgba(28,38,31,0.4)";
    ctx.font = "500 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("Tap an app to open", W / 2, H - 62);
  }

  private statusBar(ctx: CanvasRenderingContext2D) {
    const { W } = this;
    ctx.fillStyle = "rgba(28,38,31,0.9)";
    ctx.textBaseline = "middle";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(this.statusTime, 20, 18);

    // battery on the right
    ctx.textAlign = "right";
    ctx.fillText("100%", W - 42, 18);
    ctx.strokeStyle = "rgba(28,38,31,0.7)";
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, W - 36, 12, 20, 11, 3);
    ctx.stroke();
    ctx.fillStyle = "rgba(28,38,31,0.9)";
    ctx.fillRect(W - 34, 14, 15, 7);
    ctx.fillRect(W - 15, 15, 2, 5);
  }

  private blob(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string
  ) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}
