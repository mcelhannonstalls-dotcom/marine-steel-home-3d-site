import * as THREE from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DESIGN_CONFIG } from "./design-config";

type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };
type Config = typeof DESIGN_CONFIG;

export function getPreset(config: Config, id: string) {
  const preset = config.cameras.find((camera) => camera.id === id);
  if (!preset) throw new Error(`未知视角：${id}`);
  return preset;
}

export function clampTarget(
  point: readonly [number, number, number],
  bounds: Bounds,
): [number, number, number] {
  return [
    THREE.MathUtils.clamp(point[0], bounds.minX, bounds.maxX),
    point[1],
    THREE.MathUtils.clamp(point[2], bounds.minZ, bounds.maxZ),
  ];
}

export function createNavigation(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  bounds: Bounds,
  config: Config = DESIGN_CONFIG,
) {
  let animationFrame = 0;

  const goToPreset = (id: string, immediate = false) => {
    const preset = getPreset(config, id);
    const endPosition = new THREE.Vector3(...preset.position);
    const endTargetArray = clampTarget(preset.target, bounds);
    const endTarget = new THREE.Vector3(...endTargetArray);

    cancelAnimationFrame(animationFrame);
    if (immediate || typeof window === "undefined") {
      camera.position.copy(endPosition);
      controls.target.copy(endTarget);
      controls.update();
      return;
    }

    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const start = performance.now();
    const duration = id === "overview" ? 1050 : 820;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      camera.position.lerpVectors(startPosition, endPosition, eased);
      controls.target.lerpVectors(startTarget, endTarget, eased);
      controls.update();
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
  };

  const reset = () => goToPreset("overview");
  const dispose = () => cancelAnimationFrame(animationFrame);

  return { goToPreset, reset, dispose };
}
