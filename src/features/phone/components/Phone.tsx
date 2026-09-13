"use client";

/* eslint-disable react-hooks/immutability -- three.js objects (texture, OS
   canvas) are mutated imperatively every frame; the React Compiler immutability
   rule does not model this valid r3f pattern. */

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import * as THREE from "three";
import { PhoneOS } from "../os/PhoneOS";
import type { PhoneMode } from "../os/types";
import { FlappyApp } from "../apps/flappy/FlappyApp";
import { EmailApp } from "../apps/email/EmailApp";
import { drawGithubIcon, drawLinkedinIcon } from "../os/socialIcons";
import { profile } from "@/lib/data";

const SCREEN_W = 2.15;
const SCREEN_H = 4.3;
const BODY_W = SCREEN_W + 0.12;
const BODY_H = SCREEN_H + 0.12;
const CANVAS_W = 300;
const CANVAS_H = 600;

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function Phone({ stateRef }: { stateRef: RefObject<PhoneMode> }) {
  // The phone's screen: a 2D canvas driven by the phone OS, uploaded as a texture.
  const { texture, os, ctx } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const context = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    const openLink = (url: string) => {
      if (/^https?:/.test(url)) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url; // mailto: / tel:
      }
    };

    const apps = [
      new FlappyApp(CANVAS_W, CANVAS_H),
      new EmailApp(CANVAS_W, CANVAS_H, { to: profile.email, send: openLink }),
    ];

    const phoneOs = new PhoneOS(CANVAS_W, CANVAS_H, apps, {
      theme: {
        isDark: () => document.documentElement.classList.contains("dark"),
        toggle: () => {
          const next = !document.documentElement.classList.contains("dark");
          document.documentElement.classList.toggle("dark", next);
          try {
            localStorage.setItem("theme", next ? "dark" : "light");
          } catch {}
        },
      },
      openLink,
      links: [
        { id: "github", label: "GitHub", url: profile.socials.github, draw: drawGithubIcon },
        { id: "linkedin", label: "LinkedIn", url: profile.socials.linkedin, draw: drawLinkedinIcon },
      ],
    });
    return { texture: tex, os: phoneOs, ctx: context };
  }, []);

  // Modern slim body: extruded rounded rectangle + flat black glass front.
  const { bodyGeo, bezelGeo, frontZ } = useMemo(() => {
    const shape = roundedRectShape(BODY_W, BODY_H, 0.5);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.035,
      bevelSegments: 4,
      steps: 1,
      curveSegments: 24,
    });
    geo.center();
    geo.computeBoundingBox();
    const front = geo.boundingBox!.max.z;
    const bez = new THREE.ShapeGeometry(
      roundedRectShape(SCREEN_W + 0.05, SCREEN_H + 0.05, 0.44)
    );
    return { bodyGeo: geo, bezelGeo: bez, frontZ: front };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // only capture keys while an app is focused, so the page scrolls normally
      // otherwise; never hijack browser shortcuts.
      if (os.mode !== "app" || e.metaKey || e.ctrlKey || e.altKey) return;
      const consume =
        e.key.length === 1 ||
        ["Backspace", "Enter", "Space", "ArrowUp", "ArrowDown"].includes(e.code);
      if (consume) e.preventDefault();
      os.onKey(e.code, e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [os]);

  useEffect(() => {
    return () => {
      texture.dispose();
      bodyGeo.dispose();
      bezelGeo.dispose();
    };
  }, [texture, bodyGeo, bezelGeo]);

  useFrame((_, delta) => {
    os.update(Math.min(delta, 0.033));
    os.draw(ctx);
    texture.needsUpdate = true;
    stateRef.current = os.mode;
  });

  // Map a tap on the screen plane to canvas pixel coordinates for the OS.
  const onScreenDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!e.uv) return;
    os.pointerDown(e.uv.x * CANVAS_W, (1 - e.uv.y) * CANVAS_H);
  };
  const hoverIn = () => {
    document.body.style.cursor = "pointer";
  };
  const hoverOut = () => {
    document.body.style.cursor = "";
  };

  return (
    <group onPointerOver={hoverIn} onPointerOut={hoverOut} rotation={[0.02, -0.05, 0]}>
      {/* slim extruded body with beveled titanium edge */}
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial color="#26251f" roughness={0.32} metalness={0.9} />
      </mesh>

      {/* black glass front (thin uniform bezels) */}
      <mesh geometry={bezelGeo} position={[0, 0, frontZ + 0.006]}>
        <meshBasicMaterial color="#050506" />
      </mesh>

      {/* screen — OS canvas texture with rounded, transparent corners */}
      <mesh position={[0, 0, frontZ + 0.016]} onPointerDown={onScreenDown}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>

      {/* dynamic island (pill) */}
      <mesh
        position={[0, SCREEN_H / 2 - 0.26, frontZ + 0.045]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <capsuleGeometry args={[0.05, 0.38, 6, 16]} />
        <meshStandardMaterial color="#060608" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* camera lens in the island */}
      <mesh position={[0.19, SCREEN_H / 2 - 0.26, frontZ + 0.11]}>
        <circleGeometry args={[0.024, 20]} />
        <meshStandardMaterial color="#0b1a24" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* side buttons */}
      <mesh position={[-(BODY_W / 2 + 0.01), 0.78, 0]}>
        <boxGeometry args={[0.03, 0.26, 0.1]} />
        <meshStandardMaterial color="#16171b" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-(BODY_W / 2 + 0.01), 0.44, 0]}>
        <boxGeometry args={[0.03, 0.26, 0.1]} />
        <meshStandardMaterial color="#16171b" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* sage power button */}
      <mesh position={[BODY_W / 2 + 0.01, 0.92, 0]}>
        <boxGeometry args={[0.03, 0.46, 0.1]} />
        <meshStandardMaterial color="#8bbb92" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}
