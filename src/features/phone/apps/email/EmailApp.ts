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
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "compose" | "sending" | "sent" | "error";
type Focus = "from" | "message";

// A mail compose app: the visitor enters their email (validated) and a message,
// and Send actually delivers it to the owner via the injected `send`.
export class EmailApp implements PhoneApp {
  readonly id = "email";
  readonly name = "Email";

  private from = "";
  private body = "";
  private focus: Focus = "from";
  private fromError: string | null = null;

  private t = 0;
  private status: Status = "compose";
  private sentTimer = 0;
  private host?: AppHost;

  private cancelBtn: Rect;
  private sendBtn: Rect;
  private plusBtn: Rect;
  private fromRow: Rect;
  private msgArea: Rect;
  private readonly barY = TOP + 44;

  constructor(
    private w: number,
    private h: number,
    private opts: {
      to: string;
      send: (msg: {
        subject: string;
        body: string;
        from: string;
      }) => Promise<void>;
    }
  ) {
    this.cancelBtn = { x: 10, y: TOP + 8, w: 70, h: 30 };
    this.sendBtn = { x: w - 84, y: TOP + 6, w: 72, h: 34 };
    this.plusBtn = { x: w - 42, y: this.barY + 4, w: 30, h: 28 };
    this.fromRow = { x: 0, y: this.barY + 36, w, h: 36 };
    this.msgArea = { x: 16, y: this.barY + 96, w: w - 32, h: h - (this.barY + 96) - 48 };
  }

  onOpen(host: AppHost) {
    this.host = host;
    this.from = "";
    this.body = "";
    this.focus = "from";
    this.fromError = null;
    this.status = "compose";
    this.sentTimer = 0;
    this.t = 0;
  }

  update(dt: number) {
    this.t += dt;
    if (this.status === "sent") {
      this.sentTimer += dt;
      if (this.sentTimer > 1.7) this.host?.exit();
    }
  }

  onKey(code: string, key: string) {
    if (this.status !== "compose") return;

    if (this.focus === "from") {
      this.fromError = null;
      if (code === "Backspace") this.from = this.from.slice(0, -1);
      else if (code === "Enter") this.focus = "message";
      else if (key.length === 1 && key !== " ") this.from += key;
      return;
    }

    if (code === "Backspace") this.body = this.body.slice(0, -1);
    else if (code === "Enter") this.body += "\n";
    else if (key.length === 1) this.body += key;
  }

  onPointerDown(x: number, y: number) {
    if (this.status === "sending" || this.status === "sent") return;
    if (this.status === "error") {
      this.status = "compose";
      return;
    }
    if (inRect(x, y, this.cancelBtn)) {
      this.host?.exit();
      return;
    }
    if (inRect(x, y, this.plusBtn)) {
      // open the visitor's own mail app with the owner address prefilled
      window.location.href = `mailto:${this.opts.to}?subject=${encodeURIComponent(
        SUBJECT
      )}`;
      return;
    }
    if (inRect(x, y, this.fromRow)) {
      this.focus = "from";
      return;
    }
    if (inRect(x, y, this.msgArea)) {
      this.focus = "message";
      return;
    }
    if (inRect(x, y, this.sendBtn) && this.body.trim()) this.trySend();
  }

  private trySend() {
    const email = this.from.trim();
    if (!email) {
      this.fromError = "Your email is required";
      this.focus = "from";
      return;
    }
    if (!EMAIL_RE.test(email)) {
      this.fromError = "Enter a valid email address";
      this.focus = "from";
      return;
    }
    if (email.toLowerCase() === this.opts.to.trim().toLowerCase()) {
      this.fromError = "Use your own email, not mine";
      this.focus = "from";
      return;
    }
    this.fromError = null;
    this.status = "sending";
    this.opts
      .send({ subject: SUBJECT, body: this.body, from: email })
      .then(() => {
        this.status = "sent";
        this.sentTimer = 0;
      })
      .catch(() => {
        this.status = "error";
      });
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { w: W, h: H } = this;
    const blink = Math.floor(this.t * 2) % 2 === 0;

    // paper
    ctx.fillStyle = "#f7f8f4";
    ctx.fillRect(0, 0, W, H);

    // top bar
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, this.barY);
    ctx.strokeStyle = "rgba(28,38,31,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.barY);
    ctx.lineTo(W, this.barY);
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

    // To (fixed) — reserve room for the "+" open-in-mail button
    this.fixedField(ctx, "To", this.opts.to, this.barY, 44);
    this.drawPlus(ctx);

    // From (editable, required)
    this.editableFromField(ctx, blink);

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

    if (this.status === "compose" && this.focus === "message" && blink) {
      const last = lines[lines.length - 1] ?? "";
      const cx = m.x + 4 + (this.body ? ctx.measureText(last).width : 0);
      const cy = (this.body ? ly - lh : m.y + 2) - 1;
      ctx.fillStyle = "#8bbb92";
      ctx.fillRect(cx + 1, cy, 2, 17);
    }

    if (this.status !== "compose") this.drawStatus(ctx);
  }

  private editableFromField(ctx: CanvasRenderingContext2D, blink: boolean) {
    const { w: W } = this;
    const y = this.barY + 36;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(28,38,31,0.45)";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText("From", 18, y + 18);

    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = this.from ? "rgba(28,38,31,0.9)" : "rgba(28,38,31,0.35)";
    ctx.fillText(this.from || "you@example.com", 74, y + 18, W - 90);

    if (this.status === "compose" && this.focus === "from" && blink) {
      const cw = this.from ? ctx.measureText(this.from).width : 0;
      ctx.fillStyle = "#8bbb92";
      ctx.fillRect(74 + cw + 2, y + 18 - 8, 2, 16);
    }

    ctx.strokeStyle = this.fromError
      ? "rgba(201,120,78,0.85)"
      : "rgba(28,38,31,0.1)";
    ctx.lineWidth = this.fromError ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(16, y + 36);
    ctx.lineTo(W - 16, y + 36);
    ctx.stroke();

    if (this.fromError) {
      ctx.fillStyle = "#c9784e";
      ctx.font = "500 12px system-ui, sans-serif";
      ctx.textBaseline = "top";
      ctx.fillText(this.fromError, 18, y + 42);
    }
  }

  private fixedField(
    ctx: CanvasRenderingContext2D,
    label: string,
    value: string,
    y: number,
    reserve = 0
  ) {
    const { w: W } = this;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(28,38,31,0.45)";
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText(label, 18, y + 18);
    ctx.fillStyle = "rgba(28,38,31,0.9)";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(value, 74, y + 18, W - 90 - reserve);
    ctx.strokeStyle = "rgba(28,38,31,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, y + 36);
    ctx.lineTo(W - 16, y + 36);
    ctx.stroke();
  }

  // "+" button that opens the visitor's own mail app with the owner prefilled.
  private drawPlus(ctx: CanvasRenderingContext2D) {
    const b = this.plusBtn;
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    ctx.fillStyle = "rgba(139,187,146,0.16)";
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5f9e79";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx, cy + 5);
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

  private drawStatus(ctx: CanvasRenderingContext2D) {
    const { w: W, h: H } = this;
    ctx.fillStyle = "rgba(247,248,244,0.9)";
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H * 0.42;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (this.status === "sending") {
      const a = this.t * 6;
      ctx.strokeStyle = "#8bbb92";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy - 12, 18, a, a + Math.PI * 1.4);
      ctx.stroke();
      ctx.fillStyle = "rgba(28,38,31,0.8)";
      ctx.font = "700 18px system-ui, sans-serif";
      ctx.fillText("Sending…", cx, cy + 26);
    } else if (this.status === "sent") {
      ctx.fillStyle = "#8bbb92";
      ctx.beginPath();
      ctx.arc(cx, cy - 12, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy - 12);
      ctx.lineTo(cx - 2, cy - 5);
      ctx.lineTo(cx + 10, cy - 20);
      ctx.stroke();
      ctx.fillStyle = "rgba(28,38,31,0.85)";
      ctx.font = "700 18px system-ui, sans-serif";
      ctx.fillText("Message sent", cx, cy + 26);
    } else {
      ctx.fillStyle = "#c9784e";
      ctx.font = "700 18px system-ui, sans-serif";
      ctx.fillText("Couldn't send", cx, cy - 8);
      ctx.fillStyle = "rgba(28,38,31,0.6)";
      ctx.font = "500 13px system-ui, sans-serif";
      ctx.fillText("Tap to try again", cx, cy + 18);
    }
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
