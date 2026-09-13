import type { AppHost, PhoneApp } from "../../os/types";
import { roundRectPath } from "../../os/canvas";
import { FlappyEngine } from "./engine";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const inRect = (px: number, py: number, r: Rect) =>
  px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;

// Flappy Rocket, packaged as a phone app with an in-game pause menu.
export class FlappyApp implements PhoneApp {
  readonly id = "flappy";
  readonly name = "Flappy Rocket";
  private engine: FlappyEngine;
  private host?: AppHost;
  private paused = false;

  private hb: Rect;
  private card: Rect;
  private resumeBtn: Rect;
  private exitBtn: Rect;

  constructor(
    private w: number,
    private h: number
  ) {
    this.engine = new FlappyEngine(w, h);
    this.hb = { x: 16, y: 24, w: 32, h: 28 };
    const cw = 210;
    const ch = 190;
    const cx = (w - cw) / 2;
    const cy = 185;
    this.card = { x: cx, y: cy, w: cw, h: ch };
    this.resumeBtn = { x: cx + 22, y: cy + 78, w: cw - 44, h: 42 };
    this.exitBtn = { x: cx + 22, y: cy + 130, w: cw - 44, h: 42 };
  }

  onOpen(host: AppHost) {
    this.host = host;
    this.paused = false;
    this.engine.reset();
  }

  update(dt: number) {
    if (!this.paused) this.engine.update(dt);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.engine.draw(ctx);
    if (this.paused) this.drawPauseMenu(ctx);
    else this.drawHamburger(ctx);
  }

  onPointerDown(x: number, y: number) {
    if (this.paused) {
      if (inRect(x, y, this.resumeBtn)) this.paused = false;
      else if (inRect(x, y, this.exitBtn)) this.host?.exit();
      return;
    }
    if (inRect(x, y, this.hb)) {
      this.paused = true;
      return;
    }
    this.engine.flap();
  }

  onKey(code: string) {
    if (this.paused) return;
    if (code === "Space" || code === "ArrowUp") this.engine.flap();
  }

  private drawHamburger(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.hb;
    ctx.fillStyle = "rgba(20,28,22,0.35)";
    roundRectPath(ctx, x, y, w, h, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const ly = y + 9 + i * 5;
      ctx.beginPath();
      ctx.moveTo(x + 9, ly);
      ctx.lineTo(x + w - 9, ly);
      ctx.stroke();
    }
  }

  private drawPauseMenu(ctx: CanvasRenderingContext2D) {
    const { w: W } = this;
    // dim
    ctx.fillStyle = "rgba(6,12,8,0.55)";
    ctx.fillRect(0, 0, this.w, this.h);

    // card
    const c = this.card;
    roundRectPath(ctx, c.x, c.y, c.w, c.h, 18);
    ctx.fillStyle = "rgba(24,32,26,0.97)";
    ctx.fill();
    ctx.strokeStyle = "rgba(139,187,146,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // title
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "800 24px system-ui, sans-serif";
    ctx.fillText("Paused", W / 2, c.y + 40);

    // resume (filled sage)
    const r = this.resumeBtn;
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.fillStyle = "#8bbb92";
    ctx.fill();
    ctx.fillStyle = "#16201a";
    ctx.font = "700 16px system-ui, sans-serif";
    ctx.fillText("Resume", W / 2, r.y + r.h / 2 + 1);

    // exit (outlined)
    const e = this.exitBtn;
    roundRectPath(ctx, e.x, e.y, e.w, e.h, 12);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText("Exit to home", W / 2, e.y + e.h / 2 + 1);
  }

  drawIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    t: number
  ) {
    // squircle tile with a soft sky gradient
    roundRectPath(ctx, x, y, size, size, size * 0.28);
    const g = ctx.createLinearGradient(x, y, x, y + size);
    g.addColorStop(0, "#bfe8f2");
    g.addColorStop(1, "#e8f5ff");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(32,42,35,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // little rocket, bobbing
    const cx = x + size / 2;
    const cy = y + size / 2 + Math.sin(t * 2) * 1.5;
    const s = size / 44;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 4);
    ctx.scale(s, s);

    // flame
    ctx.fillStyle = "#ffb020";
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();

    // body
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#9aa0ad";
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, -10, -8, 20, 16, 7);
    ctx.fill();
    ctx.stroke();

    // nose
    ctx.fillStyle = "#c9784e";
    ctx.beginPath();
    ctx.moveTo(9, -8);
    ctx.quadraticCurveTo(22, 0, 9, 8);
    ctx.closePath();
    ctx.fill();

    // window
    ctx.fillStyle = "#8fd0ec";
    ctx.beginPath();
    ctx.arc(1, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
