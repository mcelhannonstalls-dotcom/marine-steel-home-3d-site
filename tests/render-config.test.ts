import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { SHADOW_MAP_TYPE } from "../src/render-config";

describe("Three.js render configuration", () => {
  it("uses the supported PCF shadow-map mode", () => {
    expect(SHADOW_MAP_TYPE).toBe(THREE.PCFShadowMap);
  });
});
