import type { OutfitBackgroundConfig } from '@/app/lib/outfit-card';

export type MaterialType = 'none' | 'embroidered_fabric';
export type ThreadDirection = 'diagonal' | 'cross' | 'horizontal' | 'vertical';
export type MaterialFinish = 'matte' | 'satin';
export type MaterialScope = 'card' | 'hero_block' | 'content_block';

export type FabricMaterialConfig = {
  type: MaterialType;
  density: number;
  threadDirection: ThreadDirection;
  threadThickness: number;
  embossIntensity: number;
  stitchBorder: boolean;
  stitchColor: string;
  surfaceContrast: number;
  finish: MaterialFinish;
  scope: MaterialScope;
  premium: boolean;
};

export type MaterialPresetDefinition = {
  id: MaterialType;
  label: string;
  tier: 'standard' | 'premium';
  description: string;
  buildConfig: (baseColor: string) => FabricMaterialConfig;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function buildFabricPresetConfig(baseColor: string, overrides: Partial<FabricMaterialConfig> = {}): FabricMaterialConfig {
  const stitched = overrides.stitchColor || '#1e3a8a';
  return {
    type: 'embroidered_fabric',
    density: clamp(overrides.density ?? 68, 20, 100),
    threadDirection: overrides.threadDirection ?? 'cross',
    threadThickness: clamp(overrides.threadThickness ?? 1.4, 0.8, 3.2),
    embossIntensity: clamp(overrides.embossIntensity ?? 42, 0, 100),
    stitchBorder: overrides.stitchBorder ?? true,
    stitchColor: /^#[0-9A-F]{6}$/i.test(stitched) ? stitched : '#1e3a8a',
    surfaceContrast: clamp(overrides.surfaceContrast ?? 48, 0, 100),
    finish: overrides.finish ?? 'matte',
    scope: overrides.scope ?? 'card',
    premium: true,
    ...overrides,
  };
}

export const MATERIAL_PRESETS: MaterialPresetDefinition[] = [
  {
    id: 'none',
    label: 'None',
    tier: 'standard',
    description: 'Color and gradient only.',
    buildConfig: () => ({
      type: 'none',
      density: 0,
      threadDirection: 'cross',
      threadThickness: 1,
      embossIntensity: 0,
      stitchBorder: false,
      stitchColor: '#1e3a8a',
      surfaceContrast: 0,
      finish: 'matte',
      scope: 'card',
      premium: false,
    }),
  },
  {
    id: 'embroidered_fabric',
    label: 'Embroidered Fabric / Textile Material',
    tier: 'premium',
    description: 'Premium woven textile with stitched details and soft embossed depth.',
    buildConfig: (baseColor) => buildFabricPresetConfig(baseColor),
  },
];

export function applyFabricMaterialToCard(background: OutfitBackgroundConfig, material: FabricMaterialConfig): OutfitBackgroundConfig {
  if (material.type !== 'embroidered_fabric') {
    return {
      ...background,
      materialLayer: undefined,
      decorativeOverlayLayer: undefined,
    };
  }
  return {
    ...background,
    materialLayer: {
      type: material.type,
      color: background.solid_color || background.gradient?.stops?.[0]?.color || '#374151',
      density: material.density,
      threadDirection: material.threadDirection,
      threadThickness: material.threadThickness,
      embossIntensity: material.embossIntensity,
      surfaceContrast: material.surfaceContrast,
      finish: material.finish,
      scope: material.scope,
      premium: true,
    },
    decorativeOverlayLayer: {
      stitchBorder: material.stitchBorder,
      stitchColor: material.stitchColor,
      opacity: 0.72,
    },
    studioStyleConfig: {
      ...background.studioStyleConfig,
      material: 'embroidered_fabric',
      metadata: {
        ...(background.studioStyleConfig?.metadata || {}),
        materialTier: 'premium',
      },
    },
  };
}
