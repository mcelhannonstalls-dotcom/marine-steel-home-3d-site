import { describe, expect, it } from "vitest";
import { DESIGN_CONFIG } from "../src/design-config";
import { clampTarget, getPreset } from "../src/navigation";

describe("walkthrough navigation", () => {
  it("provides every room preset", () => {
    for (const id of ["overview", "kitchen", "living", "bathroom", "bedroom"]) {
      const preset = getPreset(DESIGN_CONFIG, id);
      expect(preset.id).toBe(id);
      expect(preset.position).toHaveLength(3);
      expect(preset.target).toHaveLength(3);
    }
  });

  it("rejects an unknown room preset", () => {
    expect(() => getPreset(DESIGN_CONFIG, "garage")).toThrow(/未知视角/);
  });

  it("keeps orbit targets inside apartment bounds", () => {
    const bounds = { minX: -2.141, maxX: 2.141, minZ: -4.12, maxZ: 6.386 };
    expect(clampTarget([12, 1, -20], bounds)).toEqual([2.141, 1, -4.12]);
    expect(clampTarget([0.5, 1.2, 2.2], bounds)).toEqual([0.5, 1.2, 2.2]);
  });

  it("keeps interior camera positions clear of exterior walls", () => {
    const bounds = { minX: -2.141, maxX: 2.141 };
    for (const id of ["kitchen", "living", "bathroom", "bedroom"]) {
      const preset = getPreset(DESIGN_CONFIG, id);
      expect(preset.position[0]).toBeGreaterThanOrEqual(bounds.minX + 0.3);
      expect(preset.position[0]).toBeLessThanOrEqual(bounds.maxX - 0.3);
    }
  });

  it("frames the kitchen by aiming at the freestanding island centre", () => {
    const kitchen = getPreset(DESIGN_CONFIG, "kitchen");
    expect(kitchen.position[2]).toBeGreaterThanOrEqual(0.8);
    expect(kitchen.target[0]).toBeCloseTo(0.44, 1);
    expect(kitchen.target[2]).toBeGreaterThanOrEqual(-1.6);
    expect(kitchen.target[2]).toBeLessThanOrEqual(-0.4);
  });

  it("frames the living room from the kitchen side across the seating zone", () => {
    const living = getPreset(DESIGN_CONFIG, "living");
    expect(living.position[2]).toBeLessThanOrEqual(-0.6);
    expect(living.target[2]).toBeGreaterThanOrEqual(0.2);
  });
});
