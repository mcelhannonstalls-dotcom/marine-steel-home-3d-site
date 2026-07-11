import type { DESIGN_CONFIG } from "./design-config";

export const mm = (value: number) => value / 1000;

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

type DesignConfig = typeof DESIGN_CONFIG;

export function validateDesign(config: DesignConfig): ValidationResult {
  const errors: string[] = [];

  if (!config.island.freestanding) {
    errors.push("中岛必须保持独立，不能与墙体或橱柜相连");
  }
  if (config.island.widthMm !== 1600 || config.island.depthMm !== 780) {
    errors.push("中岛尺寸必须为 1600 × 780 mm");
  }
  if (config.island.kitchenAisleMm < 950) {
    errors.push("厨房操作面与中岛之间净距不得小于 950 mm");
  }
  if (config.island.primaryAisleMm < 900) {
    errors.push("主要通道净距不得小于 900 mm");
  }
  if (config.storage.livingWallDepthMm < 320 || config.storage.livingWallDepthMm > 350) {
    errors.push("客厅储物墙深度必须控制在 320–350 mm");
  }
  if (config.rooms.kitchen.sourceRoom !== "原卫生间" || config.rooms.bathroom.sourceRoom !== "原厨房") {
    errors.push("厨房与卫生间必须按照批准方案互换");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [...config.fieldChecks],
  };
}
