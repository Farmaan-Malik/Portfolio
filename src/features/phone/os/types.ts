// The phone can be showing its home screen or a running app.
export type PhoneMode = "home" | "app";

// A home tile that redirects to an external link (opens in a new tab, or
// mailto:/tel:). Shows an "external" badge.
export interface LinkTile {
  id: string;
  label: string;
  url: string;
  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}

// A tile on the home grid. Apps open (with a splash); other tiles (e.g. the
// theme switch) just run an instant action on tap.
export interface HomeIcon {
  id: string;
  label: string;
  drawIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    t: number
  ): void;
  onTap(): void;
}

// Handle the OS passes to a running app so it can drive the OS (e.g. exit).
export interface AppHost {
  /** return to the home screen */
  exit(): void;
}

// Every app the phone can run implements this. Apps render into the shared
// 300x600 screen canvas and receive input in canvas pixel coordinates.
export interface PhoneApp {
  /** stable id */
  id: string;
  /** label shown under the home-screen icon */
  name: string;
  /** per-frame update (dt in seconds) */
  update(dt: number): void;
  /** draw the running app, filling the screen rect */
  draw(ctx: CanvasRenderingContext2D): void;
  /** draw the home-screen icon inside the square (x, y, size) */
  drawIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    t: number
  ): void;
  /** called when the app is opened (with a host) / closed */
  onOpen?(host: AppHost): void;
  onClose?(): void;
  /** tap inside the app (canvas px) */
  onPointerDown?(x: number, y: number): void;
  /** key while the app is focused (KeyboardEvent.code + printable key) */
  onKey?(code: string, key: string): void;
}
