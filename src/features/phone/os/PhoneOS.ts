import { roundRectPath } from "./canvas";
import { HomeScreen } from "./HomeScreen";
import { drawThemeIcon } from "./themeIcon";
import { drawExternalBadge } from "./socialIcons";
import type {
  AppHost,
  HomeIcon,
  LinkTile,
  PhoneApp,
  PhoneMode,
} from "./types";

export interface PhoneOSOptions {
  theme?: { toggle: () => void; isDark: () => boolean };
  links?: LinkTile[];
  openLink?: (url: string) => void;
}

// Bottom strip that acts as the "swipe home" gesture while an app is open.
const HOME_ZONE = 42;
// Launch splash timing.
const SPLASH = 0.9;
const SPLASH_FADE = 0.28;

// Minimal phone OS: boots to a home screen, plays a launch splash, then runs
// the app. Returns home via the bottom home-indicator zone or the Escape key.
export class PhoneOS {
  mode: PhoneMode = "home";
  private active: PhoneApp | null = null;
  private home: HomeScreen;
  private t = 0;
  private splashT = 0;

  constructor(
    private W: number,
    private H: number,
    apps: PhoneApp[],
    opts: PhoneOSOptions = {}
  ) {
    const icons: HomeIcon[] = apps.map((app) => ({
      id: app.id,
      label: app.name,
      drawIcon: (ctx, x, y, s, t) => app.drawIcon(ctx, x, y, s, t),
      onTap: () => this.open(app),
    }));

    // Social / contact links: redirect out, marked with an external badge.
    for (const link of opts.links ?? []) {
      icons.push({
        id: link.id,
        label: link.label,
        drawIcon: (ctx, x, y, s) => {
          link.draw(ctx, x, y, s);
          drawExternalBadge(ctx, x, y, s);
        },
        onTap: () => opts.openLink?.(link.url),
      });
    }

    // Theme tile: sits in the app row but just toggles — no launch, no splash.
    if (opts.theme) {
      const theme = opts.theme;
      icons.push({
        id: "theme",
        label: "Switch theme",
        drawIcon: (ctx, x, y, s) => drawThemeIcon(ctx, x, y, s, theme.isDark()),
        onTap: () => theme.toggle(),
      });
    }

    this.home = new HomeScreen(W, H, icons);
  }

  private get splashing() {
    return this.mode === "app" && this.splashT < SPLASH;
  }

  update(dt: number) {
    this.t += dt;
    if (this.mode === "app" && this.active) {
      if (this.splashT < SPLASH) this.splashT += dt;
      else this.active.update(dt);
    } else {
      this.home.update(dt);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { W, H } = this;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    roundRectPath(ctx, 0, 0, W, H, 46);
    ctx.clip();

    if (this.mode === "app" && this.active) {
      this.active.draw(ctx);
      if (this.splashing) {
        // fade the splash out over the app in the last moments
        const fade =
          this.splashT > SPLASH - SPLASH_FADE
            ? (SPLASH - this.splashT) / SPLASH_FADE
            : 1;
        ctx.globalAlpha = fade;
        this.drawSplash(ctx, this.active);
        ctx.globalAlpha = 1;
      }
    } else {
      this.home.draw(ctx);
    }

    this.drawHomeButton(ctx);

    ctx.restore();
  }

  // Classic circular home button at the bottom-center of the screen.
  private drawHomeButton(ctx: CanvasRenderingContext2D) {
    const cx = this.W / 2;
    const cy = this.H - 26;
    const r = 14;
    const dark = this.mode === "app"; // over game/app content → light glyph
    const ink = dark ? "rgba(255,255,255,0.92)" : "rgba(28,38,31,0.6)";

    ctx.fillStyle = dark ? "rgba(255,255,255,0.14)" : "rgba(28,38,31,0.06)";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // inner rounded square glyph
    roundRectPath(ctx, cx - 4.5, cy - 4.5, 9, 9, 2.4);
    ctx.stroke();
  }

  // input in canvas pixel coordinates
  pointerDown(x: number, y: number) {
    if (this.mode === "home") {
      this.home.hitTest(x, y)?.onTap();
      return;
    }
    // in an app: bottom strip returns home
    if (y >= this.H - HOME_ZONE) {
      this.goHome();
      return;
    }
    if (this.splashing) return; // still launching
    this.active?.onPointerDown?.(x, y);
  }

  onKey(code: string, key: string) {
    if (code === "Escape") {
      if (this.mode === "app") this.goHome();
      return;
    }
    if (this.mode === "app" && !this.splashing) this.active?.onKey?.(code, key);
  }

  private host: AppHost = { exit: () => this.goHome() };

  private open(app: PhoneApp) {
    this.active = app;
    this.mode = "app";
    this.splashT = 0;
    app.onOpen?.(this.host);
  }

  private goHome() {
    this.active?.onClose?.();
    this.active = null;
    this.mode = "home";
    this.splashT = 0;
  }

  private drawSplash(ctx: CanvasRenderingContext2D, app: PhoneApp) {
    const { W, H } = this;
    const base = ctx.globalAlpha; // crossfade alpha set by the caller

    // launch background
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#243029");
    g.addColorStop(1, "#161e19");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // big app icon, easing in
    const p = Math.min(1, this.splashT / 0.32);
    const ease = 1 - Math.pow(1 - p, 3);
    const size = 96;
    ctx.save();
    ctx.translate(W / 2, H * 0.4);
    ctx.scale(0.8 + 0.2 * ease, 0.8 + 0.2 * ease);
    ctx.globalAlpha = ease * base;
    app.drawIcon(ctx, -size / 2, -size / 2, size, this.t);
    ctx.restore();

    // app name
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(app.name, W / 2, H * 0.4 + 92);

    // spinner
    const cx = W / 2;
    const cy = H * 0.72;
    const a = this.splashT * 6;
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, 15, a, a + Math.PI * 1.4);
    ctx.stroke();
  }
}
