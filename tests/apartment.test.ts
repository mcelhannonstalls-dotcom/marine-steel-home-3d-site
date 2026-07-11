import { describe, expect, it } from "vitest";
import { DESIGN_CONFIG } from "../src/design-config";
import { createApartment, getInspectableObjects } from "../src/apartment";
import { createMaterials } from "../src/materials";

describe("procedural apartment model", () => {
  it("contains every approved room and focal element", () => {
    const apartment = createApartment(DESIGN_CONFIG, createMaterials());
    const names = apartment.root.children.map((child) => child.name);

    expect(names).toEqual(
      expect.arrayContaining([
        "architecture",
        "kitchen",
        "bathroom",
        "living",
        "bedroom",
        "balcony",
      ]),
    );
    expect(apartment.rooms.kitchen.getObjectByName("freestanding-island")).toBeTruthy();
    expect(apartment.rooms.living.getObjectByName("living-storage-wall")).toBeTruthy();
  });

  it("publishes useful inspection metadata", () => {
    const apartment = createApartment(DESIGN_CONFIG, createMaterials());
    const inspectables = getInspectableObjects(apartment);

    expect(inspectables.length).toBeGreaterThanOrEqual(10);
    expect(inspectables.map((object) => object.userData.label)).toEqual(
      expect.arrayContaining(["独立中岛", "海洋板厨房", "客厅储物墙", "壁挂马桶"]),
    );
  });

  it("exposes all camera anchors and apartment bounds", () => {
    const apartment = createApartment(DESIGN_CONFIG, createMaterials());
    expect(Object.keys(apartment.cameraAnchors)).toEqual(
      expect.arrayContaining(["overview", "kitchen", "living", "bathroom", "bedroom"]),
    );
    expect(apartment.bounds).toMatchObject({ minX: -2.141, maxX: 2.141 });
  });
});
