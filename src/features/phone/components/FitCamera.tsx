"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

// Pulls the camera back so a sphere of `radius` always fits BOTH axes of the
// canvas regardless of aspect ratio — the phone + nexus are never clipped.
export function FitCamera({ radius = 2.6 }: { radius?: number }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vFov = (cam.fov * Math.PI) / 180;
    const aspect = size.width / Math.max(1, size.height);
    const distV = radius / Math.tan(vFov / 2);
    const distH = radius / (Math.tan(vFov / 2) * aspect);
    cam.position.set(0, 0, Math.max(distV, distH) + 0.4);
    cam.updateProjectionMatrix();
  }, [camera, size, radius]);

  return null;
}
