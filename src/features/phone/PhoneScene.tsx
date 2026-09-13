"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import { Phone } from "./components/Phone";
import { FitCamera } from "./components/FitCamera";
import type { PhoneMode } from "./os/types";

// Just the interactive phone. The hero's ambient backdrop lives separately
// (an interactive dot field behind the whole section).
export default function PhoneScene() {
  const stateRef = useRef<PhoneMode>("home");

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <FitCamera radius={2.6} />

      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} color="#eef6ff" />
      <pointLight position={[-5, -2, 3]} intensity={22} color="#8bbb92" />
      <pointLight position={[4, 3, -2]} intensity={14} color="#c9784e" />

      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.6}>
        <Phone stateRef={stateRef} />
      </Float>
    </Canvas>
  );
}
