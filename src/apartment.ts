import * as THREE from "three";
import type { ApartmentMaterials } from "./materials";
import type { DESIGN_CONFIG } from "./design-config";

type Config = typeof DESIGN_CONFIG;

export type ApartmentModel = {
  root: THREE.Group;
  rooms: Record<"kitchen" | "bathroom" | "living" | "bedroom" | "balcony", THREE.Group>;
  inspectables: THREE.Object3D[];
  cameraAnchors: Record<string, { position: THREE.Vector3; target: THREE.Vector3 }>;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
};

type Meta = {
  label: string;
  detail: string;
  size?: string;
  warning?: string;
};

const box = (
  parent: THREE.Object3D,
  name: string,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  rotationY = 0,
) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.y = rotationY;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

const cylinder = (
  parent: THREE.Object3D,
  name: string,
  radius: number,
  height: number,
  position: [number, number, number],
  material: THREE.Material,
  radialSegments = 32,
) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, radialSegments), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

const markInspectable = (object: THREE.Object3D, meta: Meta, inspectables: THREE.Object3D[]) => {
  object.userData = { ...meta, inspectable: true };
  inspectables.push(object);
  return object;
};

const addCabinetDoors = (
  parent: THREE.Object3D,
  startX: number,
  y: number,
  z: number,
  count: number,
  width: number,
  height: number,
  material: THREE.Material,
) => {
  for (let index = 0; index < count; index += 1) {
    const x = startX + index * width;
    box(parent, `cabinet-door-${index}`, [width - 0.012, height, 0.025], [x, y, z], material);
  }
};

function createArchitecture(materials: ApartmentMaterials) {
  const group = new THREE.Group();
  group.name = "architecture";
  const minX = -2.141;
  const maxX = 2.141;
  const minZ = -4.12;
  const maxZ = 6.386;
  const height = 2.7;
  const thickness = 0.12;
  const centerZ = (minZ + maxZ) / 2;
  const totalDepth = maxZ - minZ;

  box(group, "floor-slab", [maxX - minX, 0.12, totalDepth], [0, -0.06, centerZ], materials.warmGreyFloor);
  box(group, "west-wall", [thickness, height, totalDepth], [minX + thickness / 2, height / 2, centerZ], materials.warmWhite);
  box(group, "east-wall", [thickness, height, totalDepth], [maxX - thickness / 2, height / 2, centerZ], materials.warmWhite);
  box(group, "north-wall", [maxX - minX, height, thickness], [0, height / 2, minZ + thickness / 2], materials.warmWhite);
  box(group, "balcony-rail", [maxX - minX, 1.02, thickness], [0, 0.51, maxZ - thickness / 2], materials.wallCut);
  box(group, "balcony-glass", [3.6, 1.05, 0.02], [0, 1.55, maxZ - thickness - 0.01], materials.glass);

  // Bright north-facing windows are layered inside the exterior wall to keep the model lightweight.
  box(group, "bathroom-window", [1.45, 1.18, 0.025], [-1.03, 1.62, minZ + thickness + 0.01], materials.glass);
  box(group, "kitchen-window", [1.25, 1.18, 0.025], [1.13, 1.62, minZ + thickness + 0.01], materials.glass);

  // Wet-zone split wall.
  box(group, "wet-zone-divider", [thickness, height, 2.528], [0.148, height / 2, -2.856], materials.warmWhite);

  // Bathroom wall to living room, leaving an 800 mm doorway near the centre.
  box(group, "bath-entry-wall-left", [0.76, height, thickness], [-1.761, height / 2, -1.532], materials.warmWhite);
  box(group, "bath-entry-wall-right", [0.73, height, thickness], [-0.217, height / 2, -1.532], materials.warmWhite);
  box(group, "bath-sliding-door", [0.79, 2.25, 0.035], [-0.96, 1.125, -1.49], materials.glass);

  // Living to bedroom, with an 860 mm opening on the left.
  box(group, "living-bedroom-wall-a", [0.72, height, thickness], [-1.78, height / 2, 1.652], materials.warmWhite);
  box(group, "living-bedroom-wall-b", [2.58, height, thickness], [0.85, height / 2, 1.652], materials.warmWhite);
  box(group, "bedroom-door", [0.82, 2.28, 0.04], [-0.95, 1.14, 1.61], materials.marinePlywood, -0.28);

  // Bedroom to balcony is visually open with a full-width glazed slider.
  box(group, "balcony-slider-frame", [4.02, 0.08, 0.08], [0, 2.48, 5.067], materials.darkSteel);
  box(group, "balcony-slider-left", [1.9, 2.35, 0.025], [-1.02, 1.23, 5.067], materials.glass);
  box(group, "balcony-slider-right", [1.9, 2.35, 0.025], [1.02, 1.23, 5.067], materials.glass);

  return { group, bounds: { minX, maxX, minZ, maxZ } };
}

function createKitchen(materials: ApartmentMaterials, inspectables: THREE.Object3D[]) {
  const room = new THREE.Group();
  room.name = "kitchen";

  const kitchenRun = new THREE.Group();
  kitchenRun.name = "marine-plywood-kitchen";
  room.add(kitchenRun);
  box(kitchenRun, "north-base", [1.58, 0.84, 0.58], [1.12, 0.42, -3.76], materials.marinePlywood);
  box(kitchenRun, "north-counter", [1.62, 0.05, 0.62], [1.12, 0.865, -3.76], materials.stainless);
  addCabinetDoors(kitchenRun, 0.58, 0.43, -3.455, 3, 0.53, 0.72, materials.plywoodEdge);
  box(kitchenRun, "upper-cabinet", [1.5, 0.72, 0.34], [1.12, 2.13, -3.91], materials.marinePlywood);

  // Integrated sink and faucet.
  box(kitchenRun, "sink-basin", [0.55, 0.08, 0.36], [1.17, 0.89, -3.72], materials.darkSteel);
  const faucet = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.018, 12, 28, Math.PI), materials.stainless);
  faucet.position.set(1.17, 1.07, -3.95);
  faucet.rotation.x = Math.PI / 2;
  kitchenRun.add(faucet);

  // East wall has fridge, oven, prep, hob and extractor.
  box(kitchenRun, "fridge", [0.58, 2.15, 0.68], [1.77, 1.075, -2.05], materials.stainless);
  box(kitchenRun, "east-base", [0.58, 0.84, 1.12], [1.77, 0.42, -3.05], materials.marinePlywood);
  box(kitchenRun, "east-counter", [0.62, 0.05, 1.15], [1.75, 0.865, -3.05], materials.stainless);
  box(kitchenRun, "induction-hob", [0.48, 0.025, 0.55], [1.72, 0.902, -2.93], materials.blackGlass);
  box(kitchenRun, "extractor", [0.5, 0.16, 0.46], [1.75, 1.88, -2.93], materials.darkSteel);
  box(kitchenRun, "stainless-backsplash", [0.025, 0.72, 1.12], [1.435, 1.25, -3.05], materials.stainless);
  markInspectable(kitchenRun, {
    label: "海洋板厨房",
    detail: "18mm 海洋板柜体、拉丝 304 不锈钢台面与挡水板；北窗下洗涤，东墙烹饪与高柜。",
    size: "约 1873 × 2528 mm",
    warning: "烟道、热水器与电磁灶回路需现场复核。",
  }, inspectables);

  const island = new THREE.Group();
  island.name = "freestanding-island";
  room.add(island);
  box(island, "island-base", [1.38, 0.84, 0.62], [0.44, 0.42, -0.62], materials.marinePlywood);
  box(island, "island-steel-top", [1.6, 0.06, 0.78], [0.44, 0.87, -0.62], materials.stainless);
  for (let index = 0; index < 3; index += 1) {
    box(island, `island-drawer-${index}`, [0.42, 0.22, 0.035], [-0.03 + index * 0.47, 0.61, -0.295], materials.plywoodEdge);
  }
  markInspectable(island, {
    label: "独立中岛",
    detail: "双面储物与两人简餐，不设置水槽或灶具，降低管线复杂度。",
    size: "1600 × 780 × 900 mm",
  }, inspectables);

  for (const [index, x] of [0.1, 0.78].entries()) {
    const stool = new THREE.Group();
    stool.name = `stool-${index}`;
    cylinder(stool, "seat", 0.19, 0.05, [x, 0.68, -0.1], materials.darkSteel);
    cylinder(stool, "leg", 0.025, 0.66, [x, 0.34, -0.1], materials.stainless, 16);
    room.add(stool);
  }

  return room;
}

function createBathroom(materials: ApartmentMaterials, inspectables: THREE.Object3D[]) {
  const room = new THREE.Group();
  room.name = "bathroom";
  box(room, "bathroom-floor", [2.18, 0.035, 2.42], [-1.0, 0.02, -2.84], materials.bathroomTile);

  const shower = new THREE.Group();
  shower.name = "walk-in-shower";
  room.add(shower);
  box(shower, "shower-tray", [0.94, 0.08, 1.12], [-1.54, 0.08, -3.45], materials.ceramic);
  box(shower, "shower-glass-a", [0.025, 2.05, 1.12], [-1.04, 1.05, -3.45], materials.glass);
  box(shower, "shower-glass-b", [0.94, 2.05, 0.025], [-1.54, 1.05, -2.88], materials.glass);
  cylinder(shower, "shower-pipe", 0.018, 1.45, [-1.93, 1.42, -3.75], materials.stainless, 16);
  markInspectable(shower, {
    label: "步入式淋浴",
    detail: "北侧采光下的干湿分离淋浴区，使用通透玻璃减少压迫感。",
    size: "约 940 × 1120 mm",
  }, inspectables);

  const toilet = new THREE.Group();
  toilet.name = "wall-hung-toilet";
  room.add(toilet);
  box(toilet, "carrier-box", [0.22, 1.08, 0.76], [-0.05, 0.54, -3.52], materials.wallCut);
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 18), materials.ceramic);
  bowl.scale.set(0.82, 0.42, 1.15);
  bowl.position.set(-0.34, 0.43, -3.52);
  toilet.add(bowl);
  box(toilet, "flush-plate", [0.025, 0.18, 0.28], [-0.168, 0.92, -3.52], materials.stainless, Math.PI / 2);
  markInspectable(toilet, {
    label: "壁挂马桶",
    detail: "靠近原卫生间一侧布置，使 110mm 排污支管尽可能短。",
    warning: "排污立管、坡度与局部抬高必须由现场专业人员确认。",
  }, inspectables);

  const vanity = new THREE.Group();
  vanity.name = "bathroom-vanity";
  room.add(vanity);
  box(vanity, "vanity-base", [0.82, 0.62, 0.48], [-1.5, 0.43, -2.0], materials.marinePlywood);
  box(vanity, "vanity-top", [0.86, 0.05, 0.52], [-1.5, 0.77, -2.0], materials.stainless);
  cylinder(vanity, "round-basin", 0.25, 0.13, [-1.5, 0.85, -2.0], materials.ceramic);
  box(vanity, "mirror", [0.7, 0.86, 0.025], [-1.5, 1.52, -1.75], materials.glass);
  markInspectable(vanity, {
    label: "海洋板浴室柜",
    detail: "入口侧悬空浴室柜，延续海洋板与不锈钢材料语言。",
    size: "宽约 820 mm",
  }, inspectables);

  return room;
}

function createLiving(materials: ApartmentMaterials, inspectables: THREE.Object3D[]) {
  const room = new THREE.Group();
  room.name = "living";

  const storage = new THREE.Group();
  storage.name = "living-storage-wall";
  room.add(storage);
  box(storage, "storage-body", [0.34, 2.55, 2.65], [-1.91, 1.275, 0.1], materials.marinePlywood);
  for (let index = 0; index < 4; index += 1) {
    box(storage, `storage-door-${index}`, [0.025, 1.16, 0.58], [-1.725, 0.72 + (index % 2) * 1.2, -0.78 + Math.floor(index / 2) * 1.18], materials.plywoodEdge);
  }
  box(storage, "tv-recess", [0.04, 0.82, 1.18], [-1.71, 1.26, 0.22], materials.darkSteel);
  markInspectable(storage, {
    label: "客厅储物墙",
    detail: "通顶柜整合电视、清洁工具、杂物、书籍与展示，减少零散家具。",
    size: "深 340 mm",
  }, inspectables);

  const sofa = new THREE.Group();
  sofa.name = "compact-sofa";
  room.add(sofa);
  box(sofa, "sofa-seat", [1.86, 0.36, 0.76], [1.02, 0.34, 0.72], materials.linen);
  box(sofa, "sofa-back", [1.86, 0.72, 0.2], [1.02, 0.73, 1.0], materials.linen);
  box(sofa, "sofa-arm-a", [0.16, 0.58, 0.76], [0.01, 0.46, 0.72], materials.linen);
  box(sofa, "sofa-arm-b", [0.16, 0.58, 0.76], [2.03, 0.46, 0.72], materials.linen);
  markInspectable(sofa, {
    label: "轻体量沙发",
    detail: "保持会客功能并给中岛与入口留出流动空间。",
    size: "约 1860 mm",
  }, inspectables);

  box(room, "living-rug", [1.52, 0.018, 1.18], [0.36, 0.025, 0.58], materials.fabricLight);
  cylinder(room, "side-table", 0.24, 0.48, [0.18, 0.25, 1.22], materials.darkSteel);
  return room;
}

function createBedroom(materials: ApartmentMaterials, inspectables: THREE.Object3D[]) {
  const room = new THREE.Group();
  room.name = "bedroom";

  const bed = new THREE.Group();
  bed.name = "bed";
  room.add(bed);
  box(bed, "bed-platform", [1.72, 0.28, 2.05], [0.52, 0.2, 3.65], materials.marinePlywood);
  box(bed, "mattress", [1.66, 0.28, 1.96], [0.52, 0.48, 3.62], materials.fabricLight);
  box(bed, "headboard", [1.82, 0.88, 0.12], [0.52, 0.79, 2.62], materials.marinePlywood);
  box(bed, "duvet", [1.5, 0.12, 1.32], [0.52, 0.68, 3.9], materials.linen);
  markInspectable(bed, {
    label: "卧室床组",
    detail: "保留舒适睡眠尺度，床下与床头结合封闭储物。",
    size: "床垫约 1600 × 1900 mm",
  }, inspectables);

  const wardrobe = new THREE.Group();
  wardrobe.name = "bedroom-wardrobe";
  room.add(wardrobe);
  box(wardrobe, "wardrobe-body", [0.58, 2.55, 2.55], [-1.78, 1.275, 3.55], materials.marinePlywood);
  markInspectable(wardrobe, {
    label: "卧室衣柜",
    detail: "沿实墙布置通顶衣柜，集中收纳换季衣物。",
    size: "深约 580 mm",
  }, inspectables);
  return room;
}

function createBalcony(materials: ApartmentMaterials, inspectables: THREE.Object3D[]) {
  const room = new THREE.Group();
  room.name = "balcony";
  box(room, "balcony-floor", [4.05, 0.04, 1.17], [0, 0.02, 5.72], materials.bathroomTile);

  for (const [index, x] of [-1.5, 1.5].entries()) {
    const planter = new THREE.Group();
    planter.name = `planter-${index}`;
    cylinder(planter, "pot", 0.22, 0.42, [x, 0.22, 5.78], materials.terracotta, 24);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 14), materials.plant);
    crown.scale.set(0.8, 1.35, 0.8);
    crown.position.set(x, 0.79, 5.78);
    planter.add(crown);
    room.add(planter);
  }
  markInspectable(room, {
    label: "阳台",
    detail: "保留采光与通风，以绿植和轻量设施为主。",
    size: "约 5.6㎡",
  }, inspectables);
  return room;
}

export function createApartment(config: Config, materials: ApartmentMaterials): ApartmentModel {
  const root = new THREE.Group();
  root.name = "apartment";
  const inspectables: THREE.Object3D[] = [];
  const architecture = createArchitecture(materials);
  root.add(architecture.group);

  const rooms = {
    kitchen: createKitchen(materials, inspectables),
    bathroom: createBathroom(materials, inspectables),
    living: createLiving(materials, inspectables),
    bedroom: createBedroom(materials, inspectables),
    balcony: createBalcony(materials, inspectables),
  };
  Object.values(rooms).forEach((room) => root.add(room));

  const cameraAnchors = Object.fromEntries(
    config.cameras.map((camera) => [
      camera.id,
      { position: new THREE.Vector3(...camera.position), target: new THREE.Vector3(...camera.target) },
    ]),
  );

  return { root, rooms, inspectables, cameraAnchors, bounds: architecture.bounds };
}

export const getInspectableObjects = (apartment: ApartmentModel) => apartment.inspectables;
