import { describe, expect, it } from "vitest";
import { DESIGN_CONFIG } from "../src/design-config";
import { mm, validateDesign } from "../src/plan-math";

describe("approved apartment design contract", () => {
  it("converts plan millimetres to scene metres", () => {
    expect(mm(1600)).toBe(1.6);
  });

  it("keeps the kitchen and bathroom swapped", () => {
    expect(DESIGN_CONFIG.rooms.kitchen.sourceRoom).toBe("原卫生间");
    expect(DESIGN_CONFIG.rooms.bathroom.sourceRoom).toBe("原厨房");
  });

  it("keeps the island freestanding and correctly sized", () => {
    expect(DESIGN_CONFIG.island).toMatchObject({
      widthMm: 1600,
      depthMm: 780,
      heightMm: 900,
      freestanding: true,
    });
  });

  it("passes circulation and field-review validation", () => {
    const result = validateDesign(DESIGN_CONFIG);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining("排污"),
        expect.stringContaining("承重"),
      ]),
    );
    expect(result.valid).toBe(true);
  });
});
