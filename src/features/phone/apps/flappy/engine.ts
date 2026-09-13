// Self-contained "Flappy" engine with a rocket instead of a bird.
// Renders to a 2D canvas context. Framerate-independent (delta seconds).
// No React / three deps.

export type GameState = "ready" | "playing" | "dead";

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

export class FlappyEngine {
  readonly W: number;
  readonly H: number;

  private groundH = 74;
  private craftX: number;
  private craftY: number;
  private vel = 0;
  private radius = 15;
  private thrust = 0;

  private gravity = 1500;
  private flapV = -430;
  private pipeSpeed = 132;
  private pipeGap = 182;
  private pipeW = 58;
  private spawnEvery = 1.5;
  private spawnTimer = 0;

  private pipes: Pipe[] = [];
  private t = 0;
  private groundScroll = 0;
  private flash = 0;

  state: GameState = "ready";
  score = 0;
  best = 0;

  constructor(w: number, h: number) {
    this.W = w;
    this.H = h;
    this.craftX = Math.round(w * 0.32);
    this.craftY = h * 0.45;
    this.reset();
  }

  reset() {
    this.craftY = this.H * 0.45;
    this.vel = 0;
    this.pipes = [];
    this.spawnTimer = 0;
    this.score = 0;
    this.flash = 0;
    this.thrust = 0;
    this.state = "ready";
  }

  flap() {
    if (this.state === "dead") {
      this.reset();
      return;
    }
    if (this.state === "ready") this.state = "playing";
    this.vel = this.flapV;
    this.thrust = 1;
  }

  private spawn() {
    const margin = 56;
    const minY = margin + this.pipeGap / 2;
    const maxY = this.H - this.groundH - margin - this.pipeGap / 2;
    const gapY = minY + Math.random() * (maxY - minY);
    this.pipes.push({ x: this.W + this.pipeW, gapY, passed: false });
  }

  update(dt: number) {
    this.t += dt;
    this.thrust = Math.max(0, this.thrust - dt * 3.5);
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 3);
    if (this.state === "playing")
      this.groundScroll = (this.groundScroll + this.pipeSpeed * dt) % 26;

    if (this.state === "ready") {
      this.craftY = this.H * 0.45 + Math.sin(this.t * 3) * 9;
      return;
    }

    if (this.state === "dead") {
      this.vel += this.gravity * dt;
      this.craftY = Math.min(
        this.craftY + this.vel * dt,
        this.H - this.groundH - this.radius
      );
      return;
    }

    // playing
    this.vel += this.gravity * dt;
    this.craftY += this.vel * dt;

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnEvery) {
      this.spawnTimer -= this.spawnEvery;
      this.spawn();
    }
    for (const p of this.pipes) p.x -= this.pipeSpeed * dt;
    this.pipes = this.pipes.filter((p) => p.x + this.pipeW > -12);

    for (const p of this.pipes) {
      if (!p.passed && p.x + this.pipeW < this.craftX) {
        p.passed = true;
        this.score++;
        this.best = Math.max(this.best, this.score);
      }
    }

    if (this.craftY - this.radius < 0) {
      this.craftY = this.radius;
      this.vel = 0;
    }
    if (this.craftY + this.radius >= this.H - this.groundH) {
      this.craftY = this.H - this.groundH - this.radius;
      this.die();
    }
    if (this.collides()) this.die();
  }

  private die() {
    if (this.state === "playing") {
      this.state = "dead";
      this.flash = 1;
    }
  }

  private collides(): boolean {
    for (const p of this.pipes) {
      const withinX =
        this.craftX + this.radius > p.x &&
        this.craftX - this.radius < p.x + this.pipeW;
      if (!withinX) continue;
      const gapTop = p.gapY - this.pipeGap / 2;
      const gapBot = p.gapY + this.pipeGap / 2;
      if (
        this.craftY - this.radius < gapTop ||
        this.craftY + this.radius > gapBot
      )
        return true;
    }
    return false;
  }

  // ---- rendering ----

  // Draws the game filling the whole screen rect. The phone OS owns the
  // rounded-corner screen clip, so this no longer clips itself.
  draw(ctx: CanvasRenderingContext2D) {
    const { W, H, groundH } = this;

    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#bfe8f2");
    sky.addColorStop(0.6, "#d6ecfb");
    sky.addColorStop(1, "#e8f5ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // sun glow
    const sun = ctx.createRadialGradient(W * 0.78, 96, 8, W * 0.78, 96, 90);
    sun.addColorStop(0, "rgba(226,244,255,0.95)");
    sun.addColorStop(1, "rgba(226,244,255,0)");
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, W, H);

    // parallax clouds
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (let i = 0; i < 3; i++) {
      const cx =
        (((i * 130 - this.t * 12) % (W + 90)) + W + 90) % (W + 90) - 45;
      this.cloud(ctx, cx, 78 + i * 62, 24 + i * 5);
    }

    // pipes
    for (const p of this.pipes) {
      const gapTop = p.gapY - this.pipeGap / 2;
      const gapBot = p.gapY + this.pipeGap / 2;
      this.pipe(ctx, p.x, 0, gapTop, true);
      this.pipe(ctx, p.x, gapBot, H - groundH - gapBot, false);
    }

    // ground
    const gy = H - groundH;
    ctx.fillStyle = "#7ed957";
    ctx.fillRect(0, gy, W, 15);
    ctx.fillStyle = "#57b83f";
    ctx.fillRect(0, gy + 11, W, 5);
    ctx.fillStyle = "#e9cf94";
    ctx.fillRect(0, gy + 16, W, groundH - 16);
    ctx.strokeStyle = "rgba(120,90,40,0.18)";
    ctx.lineWidth = 2;
    for (let x = -this.groundScroll; x < W; x += 26) {
      ctx.beginPath();
      ctx.moveTo(x, gy + 16);
      ctx.lineTo(x + 13, H);
      ctx.stroke();
    }

    // rocket
    this.rocket(ctx);

    // HUD
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (this.state !== "ready") {
      ctx.font = "800 48px system-ui, sans-serif";
      this.outlinedText(ctx, String(this.score), W / 2, 66, 6);
    }

    if (this.state === "ready") {
      ctx.font = "800 30px system-ui, sans-serif";
      this.outlinedText(ctx, "TAP TO FLY", W / 2, H * 0.26, 4);
      const pulse = 0.5 + 0.5 * Math.sin(this.t * 4);
      ctx.globalAlpha = pulse;
      ctx.font = "700 16px system-ui, sans-serif";
      this.outlinedText(ctx, "click  ·  space", W / 2, H * 0.26 + 38, 3);
      ctx.globalAlpha = 1;
    }

    if (this.state === "dead") {
      ctx.fillStyle = `rgba(255,255,255,${this.flash * 0.55})`;
      ctx.fillRect(0, 0, W, H);

      const pw = W * 0.8;
      const ph = 176;
      const px = (W - pw) / 2;
      const py = H * 0.3;
      this.roundRectPath(ctx, px, py, pw, ph, 18);
      ctx.fillStyle = "rgba(32,42,35,0.92)";
      ctx.fill();
      ctx.strokeStyle = "rgba(139,187,146,0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#c9784e";
      ctx.font = "800 25px system-ui, sans-serif";
      ctx.fillText("GAME OVER", W / 2, py + 36);

      ctx.fillStyle = "#fff";
      ctx.font = "700 19px system-ui, sans-serif";
      ctx.fillText(`Score  ${this.score}`, W / 2, py + 80);
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "600 15px system-ui, sans-serif";
      ctx.fillText(`Best  ${this.best}`, W / 2, py + 108);

      const pulse = 0.5 + 0.5 * Math.sin(this.t * 4);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = "#a9d3ae";
      ctx.font = "700 15px system-ui, sans-serif";
      ctx.fillText("TAP TO RESTART", W / 2, py + ph - 26);
      ctx.globalAlpha = 1;
    }
  }

  private rocket(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.craftX, this.craftY);
    const angle =
      this.state === "ready"
        ? Math.sin(this.t * 3) * 0.08
        : Math.max(-0.45, Math.min(1.2, this.vel / 520));
    ctx.rotate(angle);

    // flame (tail points left)
    const flameLen = 12 + this.thrust * 26 + Math.abs(Math.sin(this.t * 40)) * 4;
    const g = ctx.createLinearGradient(-12, 0, -12 - flameLen, 0);
    g.addColorStop(0, "#ffcf3f");
    g.addColorStop(0.5, "#ff8a1a");
    g.addColorStop(1, "rgba(255,90,47,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-11, -6);
    ctx.lineTo(-11 - flameLen, 0);
    ctx.lineTo(-11, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,240,180,0.9)";
    ctx.beginPath();
    ctx.moveTo(-11, -3);
    ctx.lineTo(-11 - flameLen * 0.5, 0);
    ctx.lineTo(-11, 3);
    ctx.closePath();
    ctx.fill();

    // fins
    ctx.fillStyle = "#c9784e";
    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-14, -15);
    ctx.lineTo(-2, -8);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, 8);
    ctx.lineTo(-14, 15);
    ctx.lineTo(-2, 8);
    ctx.closePath();
    ctx.fill();

    // body
    const body = ctx.createLinearGradient(0, -9, 0, 9);
    body.addColorStop(0, "#ffffff");
    body.addColorStop(1, "#c9ccd6");
    ctx.fillStyle = body;
    ctx.strokeStyle = "#9aa0ad";
    ctx.lineWidth = 1.5;
    this.roundRectPath(ctx, -12, -9, 24, 18, 8);
    ctx.fill();
    ctx.stroke();

    // nose cone
    ctx.fillStyle = "#c9784e";
    ctx.beginPath();
    ctx.moveTo(11, -9);
    ctx.quadraticCurveTo(24, 0, 11, 9);
    ctx.closePath();
    ctx.fill();

    // window
    ctx.fillStyle = "#8fd0ec";
    ctx.strokeStyle = "#5b97b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(2, 0, 4.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(0.6, -1.4, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private pipe(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    h: number,
    top: boolean
  ) {
    if (h <= 0) return;
    const w = this.pipeW;
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, "#7ad06a");
    grad.addColorStop(0.35, "#54bd57");
    grad.addColorStop(0.55, "#67c56a");
    grad.addColorStop(1, "#3c9e42");
    ctx.fillStyle = grad;
    ctx.strokeStyle = "#2f7d34";
    ctx.lineWidth = 2.5;

    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    // lip
    const lipH = 22;
    const lipY = top ? y + h - lipH : y;
    this.roundRectPath(ctx, x - 5, lipY, w + 10, lipH, 5);
    ctx.fill();
    ctx.stroke();

    // highlight
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(x + 6, y, 5, h);
  }

  private cloud(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r, y + 4, r * 0.8, 0, Math.PI * 2);
    ctx.arc(x - r * 0.9, y + 5, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  private outlinedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lw: number
  ) {
    ctx.lineWidth = lw;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(10,22,40,0.5)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "#fff";
    ctx.fillText(text, x, y);
  }

  private roundRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
