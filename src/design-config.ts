export type CameraPreset = {
  id: string;
  label: string;
  position: readonly [number, number, number];
  target: readonly [number, number, number];
};

export const DESIGN_CONFIG = {
  project: {
    name: "海洋板与不锈钢之家",
    subtitle: "厨卫互换 · 开放式厨房 · 独立中岛",
    ceilingHeightMm: 2700,
    conceptualNotice: "概念设计展示｜施工前须复核承重、排污、烟道与物业许可",
  },
  rooms: {
    kitchen: {
      label: "开放式厨房",
      sourceRoom: "原卫生间",
      widthMm: 1873,
      depthMm: 2528,
    },
    bathroom: {
      label: "卫生间",
      sourceRoom: "原厨房",
      widthMm: 2289,
      depthMm: 2528,
    },
    living: { label: "客厅", widthMm: 4282, depthMm: 3184 },
    bedroom: { label: "卧室", widthMm: 4282, depthMm: 3475 },
    balcony: { label: "阳台", widthMm: 4282, depthMm: 1319 },
  },
  island: {
    label: "独立中岛",
    widthMm: 1600,
    depthMm: 780,
    heightMm: 900,
    freestanding: true,
    kitchenAisleMm: 980,
    primaryAisleMm: 920,
    seating: 2,
  },
  storage: {
    livingWallDepthMm: 340,
    fullHeight: true,
  },
  materials: {
    cabinetry: "18mm 海洋板（所有切口封闭防水）",
    counter: "拉丝 304 不锈钢台面",
    walls: "暖白耐擦洗墙面",
    floor: "暖灰哑光连续地面",
    lighting: "3000–3500K 暖色照明",
  },
  fieldChecks: [
    "复核原卫生间排污立管与新马桶排污坡度",
    "拆墙前确认厨卫朝客厅隔墙为非承重墙",
    "复核公共烟道位置及新厨房排烟路径",
    "复核卫生间防水、闭水试验及楼板开孔限制",
    "向物业确认厨卫互换、电磁灶和管线改造许可",
  ],
  cameras: [
    { id: "overview", label: "全屋俯瞰", position: [6.7, 9.2, 7.8], target: [0, 0, -3.1] },
    { id: "kitchen", label: "厨房中岛", position: [1.5, 1.72, 1.12], target: [0.44, 0.78, -1.18] },
    { id: "living", label: "客厅储物", position: [1.55, 1.72, -1.08], target: [-0.72, 0.86, 0.58] },
    { id: "bathroom", label: "新卫生间", position: [-1.1, 1.65, -1.4], target: [-1.15, 1.0, -3.65] },
    { id: "bedroom", label: "卧室", position: [1.6, 1.65, 4.1], target: [0, 1.0, 2.3] },
  ] satisfies readonly CameraPreset[],
} as const;
