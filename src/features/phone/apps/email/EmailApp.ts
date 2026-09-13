import type { AppHost, PhoneApp } from "../../os/types";
import { roundRectPath } from "../../os/canvas";
import { drawMailIcon } from "../../os/socialIcons";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
const inRect = (px: number, py: number, r: Rect) =>
  px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;

const SUBJECT = "Hello from your portfolio";
const TOP = 52; // reserve the top for the dynamic island

// A tiny mail compose app: the "To" is prefilled, the user types a message,
// and Send opens a prefilled email addressed to the owner.
export class EmailApp implements PhoneApp {
  readonly id = "email";
  readonly name = "Email";

  private body = "";
  private t = 0;
  private host?: AppHost;

  private cancelBtn: Rect;
  private sendBtn: Rect;
  private msgArea: Rect;

  constructor(
    private w: number,
    private h: number,
    private opts: { to: string; send: (mailtoUrl: string) => void }
  ) {
    this.cancelBtn = { x: 10, y: TOP + 8, w: 70, h: 30 };
    this.sendBtn = { x: w - 84, y: TOP + 6, w: 72, h: 34 };
    this.msgArea = { x: 16, y: TOP + 128, w: w - 32, h: h - (TOP + 128) - 48 };
  }

  onOpen(host: AppHost) {
    this.host = host;
    this.body = "";
    this.t = 0;
  }

  update(dt: number) {
    this.t += dt;
  }

  onKey(code: string, key: string) {
    if (code === "Backspace") this.body = this.body.slice(0, -1);
    else if (code === "Enter") this.body += "\n";
    else if (key.length === 1) this.body += key;
  }

  onPointerDown(x: number, y: number) {
    if (inRect(x, y, this.cancelBtn)) {
      this.host?.exit();
      return;
    }
    if (inRect(x, y, this.sendBtn) && this.body.trim()) this.send();
  }

  private send() {
    const url = `mailto:${this.opts.to}?subject=${encodeURIComponent(
      SUBJECT
    )}&body=${encodeURIComponent(this.body)}`;
    this.opts.send(url);
    this.host?.exit();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { w: W, h: H } = this;

    // paper
    ctx.fillStyle = "#f7f8f4";
    ctx.fillRect(0, 0, W, H);

    // top bar (below the island reserve)
    const barY = TOP + 44;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, barY);
    ctx.strokeStyle = "rgba(28,38,31,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, barY);
    ctx.lineTo(W, barY);
    ctx.stroke();

    const barMid = TOP + 22;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(28,38,31,0.6)";
    ctx.font = "600 15px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Cancel", this.cancelBtn.x + 8, barMid);

    ctx.fillStyle = "rgba(28,38,31,0.92)";
    ctx.font = "700 16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("New Message", W / 2, barMid);

    // send button
    const canSend = this.body.trim().length > 0;
    const s = this.sendBtn;
    roundRectPath(ctx, s.x, s.y, s.w, s.h, 17);
    ctx.fillStyle = canSend ? "#8bbb92" : "rgba(28,38,31,0.12)";
    ctx.fill();
    ctx.fillStyle = canSend ? "#16201a" : "rgba(28,38,31,0.4)";
    ctx.font = "700 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Send", s.x + s.w / 2, s.y + s.h / 2 + 1);

    // fields
    this.field(ctx, "To", this.opts.to, barY);
    this.field(ctx, "Subject", SUBJECT, barY + 36);

    // message
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const m = this.msgArea;
    const lh = 20;
    ctx.font = "15px system-ui, sans-serif";

    if (!this.body) {
      ctx.fillStyle = "rgba(28,38,31,0.35)";
      ctx.fillText("Type your message…", m.x + 4, m.y + 2);
    }

    ctx.fillStyle = "rgba(28,38,31,0.9)";
    const lines = this.wrap(ctx, this.body, m.w - 8);
    let ly = m.y + 2;
    for (const line of lines) {
      ctx.fillText(line, m.x + 4, ly);
      ly += lh;
    }

    // blinking cursor at the end of the last line
    if (Math.floor(this.t * 2) % 2 === 0) {
      const last = lines[lines.length - 1] ?? "";
      const cx = m.x + 4 + (this.body ? ctx.measureText(last).width : 0);
      const cy = (this.body ? ly - lh : m.y + 2) - 1;
      ctx.fillStyle = "#8bbb92";
      ctx.fillRect(cx + 1, cy, 2, 17);
    }
  }

  private field(
    ctx: CanvasRenderingContext2D,
    label: string,
    value: string,
    y: number
  ) {
    const { w: W } = this;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(28,38,31,0.45)";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText(label, 18, y + 18);
    ctx.fillStyle = "rgba(28,38,31,0.9)";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(value, 74, y + 18, W - 90);
    ctx.strokeStyle = "rgba(28,38,31,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, y + 36);
    ctx.lineTo(W - 16, y + 36);
    ctx.stroke();
  }

  private wrap(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxW: number
  ): string[] {
    const lines: string[] = [];
    for (const para of text.split("\n")) {
      const words = para.split(" ");
      let line = "";
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  drawIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    drawMailIcon(ctx, x, y, size);
  }
}
