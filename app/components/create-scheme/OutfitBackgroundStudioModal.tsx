'use client';

import { useEffect, useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import {
  OutfitBackgroundConfig,
  OutfitCardData,
  buildBackgroundCssStyle,
  resolveBrandLogoUrlByName,
  resolveOutfitBackgroundForRender,
} from '@/app/lib/outfit-card';
import { BackgroundGenerationMode } from '@/app/lib/background-ai';
import type {
  ArtworkAsset,
  ArtworkColorIntent,
  ArtworkContrastLevel,
  ArtworkGenerationResponse,
  ArtworkPaletteMode,
  ArtworkShapeLanguage,
  ArtworkStudioInput,
  ArtworkStylePreset,
  ArtworkVariation,
} from '@/app/backend/types/artwork-studio';
import { applyArtworkToOutfitCard } from '@/app/lib/artwork-studio';
import FancySelect from '@/app/components/ui/fancy-select';

type StudioTab = 'color' | 'gradient' | 'ai_artwork';

type RecommendedPreset = {
  id: string;
  label: string;
  description: string;
  recipe: (context: PresetContext, uploadedReferenceImage?: string | null) => OutfitBackgroundConfig;
};

type OutfitMetadata = {
  style?: string;
  occasion?: string;
  visibility?: string;
  title?: string;
  brandIdentity?: string;
  palette?: string;
  mood?: string;
  wearstyles?: string[];
  brands?: string[];
};

type PresetContext = {
  brandName: string;
  brandLogoUrl: string | null;
  heroColor: string;
};

const asDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

function escapeSvgAttribute(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll('\'', '&apos;');
}

interface OutfitBackgroundStudioModalProps {
  value: OutfitBackgroundConfig;
  previewCardData: OutfitCardData;
  outfitMetadata?: OutfitMetadata;
  onClose: () => void;
  onApply: (value: OutfitBackgroundConfig) => void;
}

const COLOR_SWATCHES = ['#0a0a0a', '#ffffff', '#c0c0c0', '#2e1065', '#047857', '#ddc7a1', '#1d4ed8', '#fff8dc'];

const GRADIENT_PRESETS: Array<{ label: string; config: OutfitBackgroundConfig }> = [
  {
    label: 'Deep Violet Gradient',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'linear', angle: 135, intensity: 100, stops: [{ color: '#0f172a', position: 0 }, { color: '#6d28d9', position: 100 }] },
      shape: 'orb',
    },
  },
  {
    label: 'Emerald Glow',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'radial', intensity: 110, stops: [{ color: '#022c22', position: 5 }, { color: '#10b981', position: 100 }] },
      shape: 'mesh',
    },
  },
  {
    label: 'Silver Mist',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'linear', angle: 145, intensity: 80, stops: [{ color: '#0f172a', position: 0 }, { color: '#cbd5e1', position: 100 }] },
      shape: 'diamond',
    },
  },
  {
    label: 'Sunset Editorial',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'linear', angle: 150, intensity: 105, stops: [{ color: '#7c2d12', position: 0 }, { color: '#f97316', position: 60 }, { color: '#fde68a', position: 100 }] },
      shape: 'orb',
    },
  },
  {
    label: 'Luxury Warm Fade',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'linear', angle: 125, intensity: 85, stops: [{ color: '#d6c2a5', position: 0 }, { color: '#f7f0e4', position: 100 }] },
      shape: 'none',
    },
  },
  {
    label: 'Blue-to-Green Premium',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'linear', angle: 120, intensity: 105, stops: [{ color: '#1d4ed8', position: 0 }, { color: '#059669', position: 100 }] },
      shape: 'mesh',
    },
  },
  {
    label: 'Night Runway',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'conic', angle: 180, intensity: 100, stops: [{ color: '#020617', position: 0 }, { color: '#0f172a', position: 45 }, { color: '#7e22ce', position: 100 }] },
      shape: 'diamond',
    },
  },
  {
    label: 'Graphite Pulse',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'linear', angle: 110, intensity: 108, stops: [{ color: '#020617', position: 0 }, { color: '#1e293b', position: 52 }, { color: '#334155', position: 100 }] },
      shape: 'mesh',
    },
  },
];
const SEGMENTED_GRADIENT_OPTIONS = GRADIENT_PRESETS.slice(0, 8);
const FLOWER_PICKER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <rect width='1200' height='800' fill='#e5e7eb'/>
    ${Array.from({ length: 10 }).map((_, row) =>
      Array.from({ length: 14 }).map((__, col) => {
        const x = col * 90 + (row % 2 === 0 ? 0 : 8);
        const y = row * 82 + 6;
        return `<g transform='translate(${x} ${y})'>
          <ellipse cx='40' cy='24' rx='10' ry='17' fill='#b49cf1'/>
          <ellipse cx='53' cy='35' rx='10' ry='17' transform='rotate(50 53 35)' fill='#b49cf1'/>
          <ellipse cx='49' cy='53' rx='10' ry='17' transform='rotate(104 49 53)' fill='#b49cf1'/>
          <ellipse cx='31' cy='53' rx='10' ry='17' transform='rotate(154 31 53)' fill='#b49cf1'/>
          <ellipse cx='27' cy='35' rx='10' ry='17' transform='rotate(206 27 35)' fill='#b49cf1'/>
          <circle cx='40' cy='40' r='8.5' fill='#f7d665'/>
        </g>`;
      }).join('')
    ).join('')}
  </svg>`,
)}`;
const SHAPE_SEGMENT_OPTIONS: Array<NonNullable<OutfitBackgroundConfig['shape']>> = [
  'none',
  'orb',
  'diamond',
  'mesh',
  'stars',
  'circles',
  'triangles',
  'waves',
  'beams',
  'flowers',
  'arrows',
];

const STYLE_PRESETS: ArtworkStylePreset[] = ['editorial_fashion', 'luxury_minimal', 'futuristic_sport', 'streetwear', 'monochrome_premium'];
const PALETTE_MODES: ArtworkPaletteMode[] = ['monochrome', 'cool_luxury', 'warm_neutral', 'custom'];
const SHAPE_LANGUAGES: ArtworkShapeLanguage[] = ['diamond', 'orb', 'mesh', 'panels', 'mixed'];
const COMPOSITION_TYPES: Array<ArtworkStudioInput['compositionType']> = ['background', 'shape_pack', 'overlay', 'frame'];
const CONTRAST_LEVELS: ArtworkContrastLevel[] = ['low', 'medium', 'high'];
const COLOR_INTENTS: Array<{ value: ArtworkColorIntent; label: string }> = [
  { value: 'prompt_driven', label: 'Prompt driven' },
  { value: 'cool_blue', label: 'Cool blue' },
  { value: 'emerald_luxury', label: 'Emerald luxury' },
  { value: 'sunset_warm', label: 'Sunset warm' },
  { value: 'mono_chrome', label: 'Monochrome' },
  { value: 'neon_pop', label: 'Neon pop' },
];
const AI_GENERATION_MODES: Array<{ value: BackgroundGenerationMode; label: string }> = [
  { value: 'preset_assisted', label: 'Preset Assisted' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'text_prompt_pure', label: 'Text Prompt (Pure AI Mode)' },
];

const DEFAULT_BACKGROUND: OutfitBackgroundConfig = {
  background_mode: 'gradient',
  gradient: {
    type: 'linear',
    angle: 135,
    intensity: 100,
    stops: [
      { color: '#0f172a', position: 0 },
      { color: '#4c1d95', position: 100 },
    ],
  },
  shape: 'orb',
};

function getRelativeLuminance(hexColor: string) {
  const safeColor = /^#([0-9A-F]{6})$/i.test(hexColor) ? hexColor : '#111827';
  const rgb = [
    parseInt(safeColor.slice(1, 3), 16),
    parseInt(safeColor.slice(3, 5), 16),
    parseInt(safeColor.slice(5, 7), 16),
  ].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

type RepeatedImagePatternOptions = {
  tileWidth: number;
  tileHeight: number;
  gapX: number;
  gapY: number;
  columns: number;
  rows: number;
  offsetX?: number;
  offsetY?: number;
  staggerOffset?: number;
  frameRadius?: number;
};

function createRepeatedImagePattern(referenceImage: string, options: RepeatedImagePatternOptions) {
  const frameRadius = options.frameRadius ?? 18;
  const framePadding = Math.max(10, Math.round(Math.min(options.tileWidth, options.tileHeight) * 0.12));
  const frameWidth = options.tileWidth + framePadding * 2;
  const frameHeight = options.tileHeight + framePadding * 2;
  const stepX = frameWidth + options.gapX;
  const stepY = frameHeight + options.gapY;
  const startX = options.offsetX ?? 12;
  const startY = options.offsetY ?? 24;
  const staggerOffset = options.staggerOffset ?? Math.round(stepX * 0.42);

  return Array.from({ length: options.rows }).map((_, row) =>
    Array.from({ length: options.columns }).map((__, col) => {
      const x = startX + col * stepX + (row % 2 ? staggerOffset : 0);
      const y = startY + row * stepY;
      return `<g transform='translate(${x} ${y})'>
        <rect x='0' y='0' width='${frameWidth}' height='${frameHeight}' rx='${frameRadius + 4}' fill='rgba(15,23,42,0.34)'/>
        <rect x='1' y='1' width='${frameWidth - 2}' height='${frameHeight - 2}' rx='${frameRadius + 4}' fill='rgba(2,6,23,0.22)' stroke='rgba(248,250,252,0.24)' stroke-width='1.3'/>
        <rect x='${framePadding}' y='${framePadding}' width='${options.tileWidth}' height='${options.tileHeight}' rx='${frameRadius}' fill='rgba(248,250,252,0.96)'/>
        <image href='${referenceImage}' x='${framePadding + 6}' y='${framePadding + 6}' width='${Math.max(12, options.tileWidth - 12)}' height='${Math.max(12, options.tileHeight - 12)}' preserveAspectRatio='xMidYMid meet' opacity='0.98'/>
      </g>`;
    }).join('')
  ).join('');
}

function buildTiledMotifComposition(referenceImage: string, context: PresetContext, imageAspectRatio = 1): OutfitBackgroundConfig {
  const safeAspectRatio = Number.isFinite(imageAspectRatio) && imageAspectRatio > 0 ? imageAspectRatio : 1;
  const tileHeight = 96;
  const tileWidth = Math.round(Math.min(156, Math.max(68, tileHeight * safeAspectRatio)));
  const repeatedPattern = createRepeatedImagePattern(referenceImage, {
    tileWidth,
    tileHeight,
    gapX: 20,
    gapY: 22,
    columns: 8,
    rows: 6,
    offsetX: 14,
    offsetY: 28,
    staggerOffset: 38,
    frameRadius: 14,
  });
  const tiledBrandSurface = asDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='surface' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='#020617'/>
          <stop offset='52%' stop-color='#0f172a'/>
          <stop offset='100%' stop-color='#172554'/>
        </linearGradient>
        <filter id='softShadow' x='-12%' y='-12%' width='124%' height='124%'>
          <feGaussianBlur stdDeviation='2.8'/>
        </filter>
      </defs>
      <rect width='1200' height='800' fill='url(#surface)'/>
      <rect width='1200' height='800' fill='rgba(248,250,252,0.04)'/>
      <g filter='url(#softShadow)' opacity='0.28'>
        ${repeatedPattern}
      </g>
      ${repeatedPattern}
      <rect width='1200' height='800' fill='rgba(2,6,23,0.09)'/>
      <text x='66' y='760' font-size='22' font-family='Inter, Arial, sans-serif' fill='rgba(148,163,184,0.55)' letter-spacing='3'>${escapeSvgAttribute(context.brandName.toUpperCase())} MOTIF SURFACE</text>
    </svg>`,
  );
  return {
    background_mode: 'ai_artwork',
    ai_artwork: { prompt: `${context.brandName} tiled motif from uploaded reference`, image_url: tiledBrandSurface, generation_status: 'done' },
    shape: 'none',
    texture_overlay: false,
  };
}

function buildEditorialLogoComposition(referenceImage: string, context: PresetContext): OutfitBackgroundConfig {
  const safeBrand = escapeSvgAttribute(context.brandName);
  const editorialLogoField = asDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='base' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='#1e3a8a'/>
          <stop offset='58%' stop-color='#2563eb'/>
          <stop offset='100%' stop-color='#facc15'/>
        </linearGradient>
        <radialGradient id='fabric' cx='18%' cy='20%' r='68%'>
          <stop offset='0%' stop-color='rgba(250,204,21,0.35)'/>
          <stop offset='100%' stop-color='rgba(30,58,138,0.02)'/>
        </radialGradient>
        <filter id='soft' x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation='16'/>
        </filter>
      </defs>
      <rect width='1200' height='800' fill='url(#base)'/>
      <path d='M0,116 C220,18 462,98 640,188 C782,258 970,286 1200,220 V0 H0 Z' fill='rgba(250,204,21,0.24)'/>
      <rect width='1200' height='800' fill='url(#fabric)'/>
      <ellipse cx='920' cy='564' rx='340' ry='198' fill='rgba(2,6,23,0.38)' filter='url(#soft)'/>
      <text x='126' y='126' font-size='66' font-family='Arial Black, Arial, sans-serif' fill='rgba(255,255,255,0.16)'>${safeBrand}</text>
      <g transform='translate(698 176)'>
        <rect x='0' y='0' width='354' height='448' rx='38' fill='rgba(255,255,255,0.08)'/>
        <rect x='20' y='20' width='314' height='408' rx='26' fill='rgba(15,23,42,0.3)'/>
        <image href='${referenceImage}' x='42' y='58' width='270' height='292' preserveAspectRatio='xMidYMid meet'/>
        <rect x='70' y='360' width='214' height='30' rx='15' fill='rgba(250,204,21,0.68)'/>
      </g>
    </svg>`,
  );
  return {
    background_mode: 'ai_artwork',
    ai_artwork: { prompt: `${context.brandName} editorial logo composition from uploaded reference`, image_url: editorialLogoField, generation_status: 'done' },
    gradient: GRADIENT_PRESETS[5].config.gradient,
    shape: 'orb',
  };
}

function buildTonalGeometryComposition(referenceImage: string, context: PresetContext): OutfitBackgroundConfig {
  const tonalField = asDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='tone' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='${context.heroColor}'/>
          <stop offset='60%' stop-color='#0f172a'/>
          <stop offset='100%' stop-color='#020617'/>
        </linearGradient>
        <filter id='blurSoft'><feGaussianBlur stdDeviation='9'/></filter>
      </defs>
      <rect width='1200' height='800' fill='url(#tone)'/>
      ${Array.from({ length: 3 }).map((_, idx) => {
        const opacity = 0.13 - idx * 0.03;
        const size = 440 - idx * 70;
        const x = 220 + idx * 210;
        const y = 160 + idx * 70;
        return `<image href='${referenceImage}' x='${x}' y='${y}' width='${size}' height='${size}' preserveAspectRatio='xMidYMid meet' opacity='${opacity.toFixed(2)}' filter='url(#blurSoft)'/>`;
      }).join('')}
      <path d='M0,630 C230,560 410,720 648,650 C842,592 1000,470 1200,520 V800 H0 Z' fill='rgba(148,163,184,0.12)'/>
      ${Array.from({ length: 8 }).map((_, idx) => `<line x1='${idx * 170}' y1='0' x2='${idx * 170 + 180}' y2='800' stroke='rgba(255,255,255,0.04)' stroke-width='1'/>`).join('')}
    </svg>`,
  );

  return {
    background_mode: 'ai_artwork',
    ai_artwork: { prompt: `${context.brandName} tonal geometry from uploaded reference`, image_url: tonalField, generation_status: 'done' },
    gradient: {
      type: 'linear',
      angle: 132,
      intensity: 104,
      stops: [
        { color: context.heroColor, position: 0 },
        { color: '#0f172a', position: 52 },
        { color: '#1f2937', position: 100 },
      ],
    },
    shape: 'mesh',
  };
}

function getRecommendedPresets(context: PresetContext): RecommendedPreset[] {
  const safeBrand = context.brandName.replace(/[<>&]/g, '');
  const logoTag = context.brandLogoUrl
    ? `<image href='${context.brandLogoUrl}' x='0' y='0' width='56' height='56' opacity='0.9' preserveAspectRatio='xMidYMid meet'/>`
    : `<text x='28' y='34' text-anchor='middle' font-size='16' font-family='Arial, sans-serif' fill='white'>${context.brandName.slice(0, 1).toUpperCase()}</text>`;
  const tiledBrandSurface = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <rect width='1200' height='800' fill='#0f172a'/>
      ${Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 12 }).map((__, col) => {
          const x = col * 96 + (row % 2 ? 22 : 0);
          const y = row * 92 + 8;
          return `<g transform='translate(${x} ${y})'>${logoTag}</g>`;
        }).join('')
      ).join('')}
    </svg>`,
  )}`;
  const editorialLogoField = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='base' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='#1d4ed8'/>
          <stop offset='62%' stop-color='#0ea5e9'/>
          <stop offset='100%' stop-color='#facc15'/>
        </linearGradient>
      </defs>
      <rect width='1200' height='800' fill='url(#base)'/>
      <circle cx='920' cy='430' r='250' fill='rgba(15,23,42,0.2)'/>
      <text x='870' y='460' font-size='140' font-family='Arial Black, Arial, sans-serif' fill='rgba(2,6,23,0.3)'>${safeBrand}</text>
    </svg>`,
  )}`;

  return [
    {
      id: 'brand_tiled_grid',
      label: 'Selection tiled motif',
      description: 'Transforms uploaded reference into repeated motif tiles on a premium surface.',
      recipe: (_, uploadedReferenceImage) => (
        uploadedReferenceImage
          ? buildTiledMotifComposition(uploadedReferenceImage, context)
          : {
              background_mode: 'ai_artwork',
              ai_artwork: { prompt: `${context.brandName} motif tiled grid`, image_url: tiledBrandSurface, generation_status: 'done' },
              gradient: GRADIENT_PRESETS[7].config.gradient,
              shape: 'diamond',
            }
      ),
    },
    {
      id: 'brand_editorial_logo',
      label: 'Selection editorial logo',
      description: 'Uses uploaded logo as the hero element over a blue-yellow editorial background.',
      recipe: (_, uploadedReferenceImage) => (
        uploadedReferenceImage
          ? buildEditorialLogoComposition(uploadedReferenceImage, context)
          : {
              background_mode: 'ai_artwork',
              ai_artwork: { prompt: `${context.brandName} editorial background`, image_url: editorialLogoField, generation_status: 'done' },
              gradient: GRADIENT_PRESETS[5].config.gradient,
              shape: 'orb',
            }
      ),
    },
    {
      id: 'brand_tonal_geometry',
      label: 'Selection tonal geometry',
      description: 'Builds a subtle tonal geometry treatment derived from the uploaded reference.',
      recipe: (_, uploadedReferenceImage) => (
        uploadedReferenceImage
          ? buildTonalGeometryComposition(uploadedReferenceImage, context)
          : {
              background_mode: 'gradient',
              gradient: {
                type: 'linear',
                angle: 132,
                intensity: 104,
                stops: [
                  { color: context.heroColor, position: 0 },
                  { color: '#0f172a', position: 52 },
                  { color: '#1f2937', position: 100 },
                ],
              },
              shape: 'mesh',
            }
      ),
    },
  ];
}

const EMERALD_LUXURY_ASSET_CANDIDATES = ['png', 'jpg', 'jpeg', 'webp'].map((ext) => `/${encodeURIComponent(`Sem título (25).${ext}`)}`);

const encodeDataUri = (value: string) => value
  .replaceAll('%', '%25')
  .replaceAll('#', '%23')
  .replaceAll('<', '%3C')
  .replaceAll('>', '%3E')
  .replaceAll('"', '\'');

async function resolveEmeraldLuxuryAssetPath(): Promise<string | null> {
  for (const candidate of EMERALD_LUXURY_ASSET_CANDIDATES) {
    try {
      const response = await fetch(candidate, { method: 'HEAD', cache: 'no-store' });
      if (response.ok) return candidate;
    } catch {
      // keep trying remaining candidates
    }
  }
  return null;
}

function buildEmeraldLuxuryComposition(uploadedReferenceImage: string | null, builtInAssetUrl: string): OutfitBackgroundConfig {
  const uploadedImageMarkup = uploadedReferenceImage
    ? `
      <defs>
        <radialGradient id='emeraldGlow' cx='18%' cy='22%' r='65%'>
          <stop offset='0%' stop-color='rgba(16,185,129,0.35)'/>
          <stop offset='100%' stop-color='rgba(16,185,129,0)'/>
        </radialGradient>
      </defs>
      <image href='${uploadedReferenceImage}' x='0' y='0' width='1200' height='800' preserveAspectRatio='xMidYMid slice' opacity='0.18'/>
      <rect width='1200' height='800' fill='url(#emeraldGlow)'/>
      <g transform='translate(150 120)'>
        <rect x='0' y='0' width='420' height='560' rx='34' fill='rgba(2,6,23,0.5)'/>
        <rect x='14' y='14' width='392' height='532' rx='28' fill='rgba(16,185,129,0.16)'/>
        <image href='${uploadedReferenceImage}' x='28' y='28' width='364' height='504' preserveAspectRatio='xMidYMid slice' opacity='0.86'/>
      </g>`
    : '';
  const composedSvg = `data:image/svg+xml;utf8,${encodeDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <rect width='1200' height='800' fill='#021712'/>
      <image href='${builtInAssetUrl}' x='0' y='0' width='1200' height='800' preserveAspectRatio='xMidYMid slice'/>
      <rect width='1200' height='800' fill='rgba(2,44,34,0.44)'/>
      ${uploadedImageMarkup}
      <rect width='1200' height='800' fill='url(#vignette)'/>
      <defs>
        <radialGradient id='vignette' cx='50%' cy='45%' r='75%'>
          <stop offset='45%' stop-color='rgba(6,95,70,0)'/>
          <stop offset='100%' stop-color='rgba(2,6,23,0.64)'/>
        </radialGradient>
      </defs>
    </svg>`,
  )}`;

  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: uploadedReferenceImage
        ? 'emerald luxury layered composition with uploaded reference and premium preset asset'
        : 'emerald luxury preset asset composition',
      image_url: composedSvg,
      generation_status: 'done',
    },
    gradient: GRADIENT_PRESETS[1].config.gradient,
    shape: 'mesh',
  };
}

export default function OutfitBackgroundStudioModal({
  value,
  previewCardData,
  outfitMetadata,
  onClose,
  onApply,
}: OutfitBackgroundStudioModalProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('color');
  const [draft, setDraft] = useState<OutfitBackgroundConfig>(resolveOutfitBackgroundForRender(value));
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStylePreset, setAiStylePreset] = useState<ArtworkStylePreset>('editorial_fashion');
  const [aiPaletteMode, setAiPaletteMode] = useState<ArtworkPaletteMode>('cool_luxury');
  const [aiShapeLanguage, setAiShapeLanguage] = useState<ArtworkShapeLanguage>('mesh');
  const [aiCompositionType, setAiCompositionType] = useState<ArtworkStudioInput['compositionType']>('background');
  const [aiDensity, setAiDensity] = useState(50);
  const [aiContrast, setAiContrast] = useState<ArtworkContrastLevel>('medium');
  const [aiColorIntent, setAiColorIntent] = useState<ArtworkColorIntent>('prompt_driven');
  const [aiBlur, setAiBlur] = useState(24);
  const [aiGlow, setAiGlow] = useState(40);
  const [aiLayerDepth, setAiLayerDepth] = useState(5);
  const [aiSafeArea, setAiSafeArea] = useState(true);
  const [aiReferenceImageUrl, setAiReferenceImageUrl] = useState('');
  const [aiReferenceFileName, setAiReferenceFileName] = useState('');
  const [aiGenerationMode, setAiGenerationMode] = useState<BackgroundGenerationMode>('hybrid');
  const [aiResults, setAiResults] = useState<ArtworkVariation[]>([]);
  const [savedAssets, setSavedAssets] = useState<ArtworkAsset[]>([]);
  const [aiGradientResults, setAiGradientResults] = useState<OutfitBackgroundConfig[]>([]);
  const [selectedAiResult, setSelectedAiResult] = useState<ArtworkVariation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [backendWarning, setBackendWarning] = useState<string | null>(null);

  const presetContext = useMemo<PresetContext>(() => {
    const metadataBrand = outfitMetadata?.brandIdentity || outfitMetadata?.brands?.[0] || previewCardData.pieces?.[0]?.brand || 'SELECTION';
    const brandName = metadataBrand.trim() || 'SELECTION';
    const brandLogoUrl = resolveBrandLogoUrlByName(brandName) || null;
    const heroColor = previewCardData.outfitBackground && 'background_mode' in previewCardData.outfitBackground && previewCardData.outfitBackground.background_mode === 'solid'
      ? previewCardData.outfitBackground.solid_color || '#1d4ed8'
      : '#1d4ed8';
    return { brandName, brandLogoUrl, heroColor };
  }, [outfitMetadata, previewCardData]);
  const recommendedPresets = useMemo(() => getRecommendedPresets(presetContext), [presetContext]);
  const displayedPresets = useMemo(() => recommendedPresets.slice(0, 6), [recommendedPresets]);
  const isUploadedReferenceImage = (value: string) => value.startsWith('data:image/') || value.startsWith('blob:');
  const getUploadedReferenceImage = () => (isUploadedReferenceImage(aiReferenceImageUrl) ? aiReferenceImageUrl : null);
  const probeReferenceImageDimensions = async (source: string): Promise<{ width: number; height: number } | null> => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (typeof window === 'undefined') return null;
    return new Promise((resolve) => {
      const image = new window.Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => resolve(null);
      image.src = source;
    });
  };

  const applyRecommendedPresetFromReferenceImage = async (
    presetId: string,
    uploadedReferenceImage: string | null,
    context: PresetContext,
  ) => {
    const preset = displayedPresets.find((item) => item.id === presetId);
    if (!preset) return;
    let config = preset.recipe(context, uploadedReferenceImage);
    if (presetId === 'brand_tiled_grid' && uploadedReferenceImage) {
      const dimensions = await probeReferenceImageDimensions(uploadedReferenceImage);
      if (!dimensions || !dimensions.width || !dimensions.height) {
        console.warn('background-studio: failed to load uploaded reference image for tiled motif preset; applying fallback preset.');
      } else {
        config = buildTiledMotifComposition(uploadedReferenceImage, context, dimensions.width / dimensions.height);
      }
    }
    setDraft((prev) => ({
      ...prev,
      ...config,
    }));
  };

  const previewData: OutfitCardData = {
    ...previewCardData,
    outfitBackground: draft,
  };

  const dominantColor =
    draft.background_mode === 'solid'
      ? draft.solid_color || '#111827'
      : draft.background_mode === 'gradient'
        ? draft.gradient?.stops?.[0]?.color || '#111827'
        : '#111827';

  const recommendTextTone = getRelativeLuminance(dominantColor) > 0.4 ? 'dark' : 'light';
  const shouldShowContrastWarning =
    draft.background_mode === 'solid' && getRelativeLuminance(draft.solid_color || '#111827') > 0.55;

  const toGradientConfig = (gradient?: OutfitBackgroundConfig['gradient']): NonNullable<OutfitBackgroundConfig['gradient']> => ({
    ...(DEFAULT_BACKGROUND.gradient as NonNullable<OutfitBackgroundConfig['gradient']>),
    ...gradient,
    stops: gradient?.stops || (DEFAULT_BACKGROUND.gradient as NonNullable<OutfitBackgroundConfig['gradient']>).stops,
  });

  const switchTab = (nextTab: StudioTab) => {
    const nextMode: OutfitBackgroundConfig['background_mode'] = nextTab === 'color' ? 'solid' : nextTab;

    setActiveTab(nextTab);
    setDraft((prev) => ({
      ...prev,
      background_mode: nextMode,
      solid_color: nextTab === 'color' ? prev.solid_color || '#111827' : prev.solid_color,
      gradient: nextTab === 'gradient' ? prev.gradient || DEFAULT_BACKGROUND.gradient : prev.gradient,
      ai_artwork: nextTab === 'ai_artwork'
        ? prev.ai_artwork || { prompt: '', generation_status: 'idle' }
        : prev.ai_artwork,
    }));
  };

  const addRecentColor = (color: string) => {
    setRecentColors((prev) => [color, ...prev.filter((item) => item !== color)].slice(0, 6));
  };

  const generateAiBackground = async () => {
    setAiLoading(true);
    setAiError(null);
    setBackendWarning(null);

    const studioInput: ArtworkStudioInput = {
      user_id: previewCardData.creatorId || 'anonymous',
      prompt: aiPrompt.trim() || 'premium editorial fashion artwork',
      compositionType: aiCompositionType,
      stylePreset: aiStylePreset,
      paletteMode: aiPaletteMode,
      shapeLanguage: aiShapeLanguage,
      density: aiDensity,
      contrastLevel: aiContrast,
      colorIntent: aiColorIntent,
      blurStrength: aiBlur,
      glowIntensity: aiGlow,
      layeringDepth: aiLayerDepth,
      safeAreaMode: aiSafeArea,
      referenceImageUrl: aiReferenceImageUrl.trim() || undefined,
      variationCount: 4,
    };

    const response = await fetch('/api/artwork-studio/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studioInput),
    });
    const payload = (await response.json().catch(() => ({ success: false, error: 'Invalid response' }))) as
      | { success: true; data: ArtworkGenerationResponse }
      | { success: false; error: string };
    setAiLoading(false);

    if (!response.ok || !payload.success) {
      setAiError(payload.success ? 'AI artwork failed.' : payload.error || 'AI artwork failed.');
      return;
    }

    console.debug('artwork_studio.normalized_response', payload.data);
    const uploadedReferenceVariation = isUploadedReferenceImage(aiReferenceImageUrl)
      ? [{
          variation_id: `reference_upload_${Date.now()}`,
          preview_url: aiReferenceImageUrl,
          output_url: aiReferenceImageUrl,
          thumbnail_url: aiReferenceImageUrl,
          provider: 'procedural' as const,
          provider_job_id: null,
          provider_model: 'uploaded-reference',
          metadata: { source: 'uploaded_reference' },
        } satisfies ArtworkVariation]
      : [];
    const mergedVariations = [...uploadedReferenceVariation, ...payload.data.variations];
    setAiResults(mergedVariations);
    if (payload.data.warnings?.length) setBackendWarning(payload.data.warnings[0]);
    if (mergedVariations.length) setSelectedAiResult(mergedVariations[0]);
    setAiGradientResults([]);
  };

  const applyVariationToDraft = (variation: ArtworkVariation) => {
    setDraft((prev) => ({
      ...prev,
      ...applyArtworkToOutfitCard({
        artwork_id: variation.variation_id,
        user_id: previewCardData.creatorId || 'anonymous',
        prompt: aiPrompt,
        normalized_prompt: aiPrompt.toLowerCase(),
        composition_type: aiCompositionType,
        style_preset: aiStylePreset,
        palette_mode: aiPaletteMode,
        shape_language: aiShapeLanguage,
        provider: variation.provider,
        provider_model: variation.provider_model ?? null,
        preview_url: variation.preview_url,
        output_url: variation.output_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, aiCompositionType === 'overlay' ? 'overlay' : aiCompositionType === 'frame' ? 'frame' : aiCompositionType === 'shape_pack' ? 'shape_pack' : 'background'),
      // preserve user-selected decorative controls when replacing the AI source image
      shape: prev.shape,
      gradient: prev.gradient,
    }));
  };

  useEffect(() => {
    if (!aiResults.length) return;
    console.debug('artwork_studio.slot_grid_props', {
      slotCount: aiResults.length,
      firstSlot: aiResults[0],
      selectedVariationId: selectedAiResult?.variation_id ?? null,
    });
  }, [aiResults, selectedAiResult]);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[linear-gradient(150deg,rgba(15,23,42,0.9),rgba(34,12,64,0.88))] p-5 text-white shadow-[0_30px_120px_rgba(15,23,42,0.7)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Background Studio</p>
            <h2 className="text-2xl font-semibold">Customize the visual surface of your outfit card</h2>
          </div>
          <button type="button" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold" onClick={onClose}>Close ✕</button>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[1fr_1.1fr]">
          <section className="min-h-0 space-y-4 overflow-y-auto rounded-2xl border border-white/15 bg-white/5 p-4">
            <div className="inline-flex rounded-xl border border-white/20 bg-white/5 p-1">
              {([
                ['color', 'Color'],
                ['gradient', 'Gradient'],
                ['ai_artwork', 'AI Artwork'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${activeTab === key ? 'bg-violet-500/45 text-white shadow-[0_10px_30px_rgba(139,92,246,0.45)]' : 'text-white/80 hover:bg-white/10'}`}
                  onClick={() => switchTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'color' ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Solid Color</label>
                <input
                  type="color"
                  value={draft.solid_color || '#111827'}
                  className="h-12 w-full cursor-pointer rounded-lg border border-white/25 bg-transparent"
                  onChange={(event) => {
                    const color = event.target.value;
                    setDraft((prev) => ({ ...prev, background_mode: 'solid', solid_color: color }));
                    addRecentColor(color);
                  }}
                />
                <input
                  value={draft.solid_color || '#111827'}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm"
                  onChange={(event) => setDraft((prev) => ({ ...prev, background_mode: 'solid', solid_color: event.target.value }))}
                />
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={draft.opacity ?? 100}
                  className="w-full"
                  onChange={(event) => setDraft((prev) => ({ ...prev, opacity: Number(event.target.value) }))}
                />
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-8 w-8 rounded-full border border-white/30"
                      style={{ background: color }}
                      onClick={() => {
                        setDraft((prev) => ({ ...prev, background_mode: 'solid', solid_color: color }));
                        addRecentColor(color);
                      }}
                    />
                  ))}
                </div>
                {recentColors.length ? (
                  <div>
                    <p className="text-xs text-white/70">Recent colors</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recentColors.map((color) => (
                        <button key={`recent-${color}`} type="button" className="h-7 w-7 rounded-full border border-white/30" style={{ background: color }} onClick={() => setDraft((prev) => ({ ...prev, background_mode: 'solid', solid_color: color }))} />
                      ))}
                    </div>
                  </div>
                ) : null}
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={Boolean(draft.texture_overlay)} onChange={(event) => setDraft((prev) => ({ ...prev, texture_overlay: event.target.checked }))} />
                  Subtle texture overlay
                </label>
              </div>
            ) : null}

            {activeTab === 'gradient' ? (
              <div className="space-y-3">
                {aiError ? <p className="text-xs text-amber-200">{aiError}</p> : null}
                <div className="grid grid-cols-3 gap-2">
                  {(['linear', 'radial', 'conic'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`rounded-xl border px-2 py-2 text-xs ${draft.gradient?.type === type ? 'border-violet-300 bg-violet-500/35' : 'border-white/25 bg-white/10'}`}
                      onClick={() => setDraft((prev) => ({
                        ...prev,
                        background_mode: 'gradient',
                        gradient: {
                          ...toGradientConfig(prev.gradient),
                          type,
                        },
                      }))}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {[0, 1, 2].map((index) => (
                  <label key={`stop-${index}`} className="flex items-center gap-3 text-xs">
                    <span className="w-16">Stop {index + 1}</span>
                    <input
                      type="color"
                      value={draft.gradient?.stops[index]?.color || '#ffffff'}
                      onChange={(event) => {
                        const nextStops = [...(draft.gradient?.stops || DEFAULT_BACKGROUND.gradient!.stops)];
                        nextStops[index] = { color: event.target.value, position: nextStops[index]?.position ?? index * 50 };
                        setDraft((prev) => ({
                          ...prev,
                          background_mode: 'gradient',
                          gradient: { ...toGradientConfig(prev.gradient), stops: nextStops.slice(0, 3) },
                        }));
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={draft.gradient?.stops[index]?.position ?? (index === 0 ? 0 : index === 1 ? 50 : 100)}
                      onChange={(event) => {
                        const nextStops = [...(draft.gradient?.stops || DEFAULT_BACKGROUND.gradient!.stops)];
                        nextStops[index] = { color: nextStops[index]?.color || '#ffffff', position: Number(event.target.value) };
                        setDraft((prev) => ({ ...prev, background_mode: 'gradient', gradient: { ...toGradientConfig(prev.gradient), stops: nextStops.slice(0, 3) } }));
                      }}
                    />
                  </label>
                ))}

                <label className="text-xs">Angle ({draft.gradient?.angle ?? 135}°)</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={draft.gradient?.angle ?? 135}
                  className="w-full"
                  onChange={(event) => setDraft((prev) => ({
                    ...prev,
                    background_mode: 'gradient',
                    gradient: { ...toGradientConfig(prev.gradient), angle: Number(event.target.value) },
                  }))}
                />

                <label className="text-xs">Intensity ({draft.gradient?.intensity ?? 100}%)</label>
                <input
                  type="range"
                  min={30}
                  max={120}
                  value={draft.gradient?.intensity ?? 100}
                  className="w-full"
                  onChange={(event) => setDraft((prev) => ({
                    ...prev,
                    background_mode: 'gradient',
                    gradient: { ...toGradientConfig(prev.gradient), intensity: Number(event.target.value) },
                  }))}
                />

                <div className="grid gap-2 sm:grid-cols-2">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button key={preset.label} type="button" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left text-xs" onClick={() => setDraft(preset.config)}>
                      <span className="font-semibold">{preset.label}</span>
                      <span className="mt-2 block h-8 rounded-lg" style={buildBackgroundCssStyle(preset.config)} />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs"
                    onClick={() => {
                      const stops = [...(draft.gradient?.stops || DEFAULT_BACKGROUND.gradient!.stops)].reverse();
                      setDraft((prev) => ({ ...prev, background_mode: 'gradient', gradient: { ...toGradientConfig(prev.gradient), stops } }));
                    }}
                  >
                    Reverse
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs"
                    onClick={() => {
                      const randomStops = [0, 1, 2].map((idx) => ({
                        color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`,
                        position: idx * 50,
                      }));
                      setDraft((prev) => ({ ...prev, background_mode: 'gradient', gradient: { type: prev.gradient?.type || 'linear', angle: Math.floor(Math.random() * 360), intensity: 100, stops: randomStops } }));
                    }}
                  >
                    Randomize
                  </button>
                </div>
              </div>
            ) : null}

            {activeTab === 'ai_artwork' ? (
              <div className="space-y-3">
                <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="Premium editorial fashion background with geometric layers and elegant negative space." className="min-h-24 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <FancySelect value={aiCompositionType} onChange={(value) => setAiCompositionType(value as ArtworkStudioInput['compositionType'])} placeholder="Composition type" options={COMPOSITION_TYPES.map((option) => ({ value: option, label: option.replaceAll('_', ' ') }))} />
                  <FancySelect value={aiStylePreset} onChange={(value) => setAiStylePreset(value as ArtworkStylePreset)} placeholder="Style preset" options={STYLE_PRESETS.map((option) => ({ value: option, label: option.replaceAll('_', ' ') }))} />
                  <FancySelect value={aiPaletteMode} onChange={(value) => setAiPaletteMode(value as ArtworkPaletteMode)} placeholder="Palette mode" options={PALETTE_MODES.map((option) => ({ value: option, label: option.replaceAll('_', ' ') }))} />
                  <FancySelect value={aiShapeLanguage} onChange={(value) => setAiShapeLanguage(value as ArtworkShapeLanguage)} placeholder="Shape language" options={SHAPE_LANGUAGES.map((option) => ({ value: option, label: option }))} />
                  <FancySelect value={aiContrast} onChange={(value) => setAiContrast(value as ArtworkContrastLevel)} placeholder="Contrast" options={CONTRAST_LEVELS.map((option) => ({ value: option, label: option }))} />
                  <FancySelect value={aiColorIntent} onChange={(value) => setAiColorIntent(value as ArtworkColorIntent)} placeholder="Color intent" options={COLOR_INTENTS.map((option) => ({ value: option.value, label: option.label }))} />
                  <label className="rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-[11px] text-white/80">
                    <span className="block pb-1 text-[10px] uppercase tracking-[0.08em] text-white/60">Reference image (upload)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-[11px]"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) {
                          setAiReferenceImageUrl('');
                          setAiReferenceFileName('');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = typeof reader.result === 'string' ? reader.result : '';
                          setAiReferenceImageUrl(result);
                          setAiReferenceFileName(file.name);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {aiReferenceFileName ? <span className="mt-1 block truncate text-[10px] text-cyan-100">{aiReferenceFileName}</span> : null}
                  </label>
                </div>
                <label className="text-xs">Density ({aiDensity})</label>
                <input type="range" min={0} max={100} value={aiDensity} onChange={(event) => setAiDensity(Number(event.target.value))} />
                <label className="text-xs">Blur ({aiBlur})</label>
                <input type="range" min={0} max={100} value={aiBlur} onChange={(event) => setAiBlur(Number(event.target.value))} />
                <label className="text-xs">Glow ({aiGlow})</label>
                <input type="range" min={0} max={100} value={aiGlow} onChange={(event) => setAiGlow(Number(event.target.value))} />
                <label className="text-xs">Layering depth ({aiLayerDepth})</label>
                <input type="range" min={1} max={10} value={aiLayerDepth} onChange={(event) => setAiLayerDepth(Number(event.target.value))} />
                <FancySelect value={aiGenerationMode} onChange={(value) => setAiGenerationMode(value as BackgroundGenerationMode)} placeholder="Generation mode" options={AI_GENERATION_MODES.map((option) => ({ value: option.value, label: option.label }))} />
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={aiSafeArea} onChange={(event) => setAiSafeArea(event.target.checked)} />
                  Safe area mode for text and subject
                </label>
                <div className="flex flex-wrap gap-2">
                  <button disabled={aiLoading} type="button" className="rounded-lg border border-violet-300/60 bg-violet-500/40 px-3 py-2 text-xs font-semibold disabled:opacity-60" onClick={() => void generateAiBackground()}>{aiLoading ? 'Generating...' : 'Generate Artwork'}</button>
                  <button disabled={aiLoading} type="button" className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs disabled:opacity-60" onClick={() => void generateAiBackground()}>Retry</button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs"
                    onClick={() => {
                      if (!selectedAiResult) return;
                      applyVariationToDraft(selectedAiResult);
                    }}
                  >
                    Apply to outfit card
                  </button>
                </div>
                {aiError ? <p className="text-xs text-amber-200">{aiError}</p> : null}
                {backendWarning ? <p className="text-xs text-cyan-200">{backendWarning}</p> : null}
                {aiResults.length ? <p className="text-[11px] text-white/60">Provider: {aiResults[0]?.provider} {aiResults[0]?.provider_model ? `· ${aiResults[0].provider_model}` : ''}</p> : null}
                {aiGradientResults.length ? (
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.12em] text-cyan-100">AI Gradient Options</p>
                    <div className="grid grid-cols-3 gap-2">
                      {aiGradientResults.map((result, index) => (
                        <button
                          key={`ai-gradient-${index}`}
                          type="button"
                          className={`h-20 rounded-xl border ${draft.background_mode === 'gradient' && JSON.stringify(draft.gradient) === JSON.stringify(result.gradient) ? 'border-violet-300 shadow-[0_0_0_1px_rgba(196,181,253,0.5)]' : 'border-white/20'}`}
                          style={buildBackgroundCssStyle(resolveOutfitBackgroundForRender(result))}
                          onClick={() => setDraft((prev) => ({ ...prev, ...resolveOutfitBackgroundForRender(result), background_mode: 'gradient' }))}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-3 gap-2">
                  {aiResults.map((result) => {
                    const previewSource = result.thumbnail_url || result.preview_url || result.output_url;
                    return (
                    <button
                      key={result.variation_id}
                      type="button"
                      className={`h-20 rounded-xl border ${selectedAiResult?.variation_id === result.variation_id ? 'border-violet-300 shadow-[0_0_0_1px_rgba(196,181,253,0.5)]' : 'border-white/20'}`}
                      style={{ backgroundImage: previewSource ? `url(${previewSource})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      onClick={() => {
                        setSelectedAiResult(result);
                        applyVariationToDraft(result);
                        console.debug('artwork_studio.selected_variation', result);
                      }}
                    />
                    );
                  })}
                </div>
                {selectedAiResult ? (
                  <button
                    type="button"
                    className="rounded-lg border border-emerald-300/70 bg-emerald-500/30 px-3 py-2 text-xs font-semibold"
                    onClick={async () => {
                      const payload = {
                        user_id: previewCardData.creatorId || 'anonymous',
                        input: {
                          user_id: previewCardData.creatorId || 'anonymous',
                          prompt: aiPrompt.trim(),
                          compositionType: aiCompositionType,
                          stylePreset: aiStylePreset,
                          paletteMode: aiPaletteMode,
                          shapeLanguage: aiShapeLanguage,
                          density: aiDensity,
                          contrastLevel: aiContrast,
                          colorIntent: aiColorIntent,
                          blurStrength: aiBlur,
                          glowIntensity: aiGlow,
                          layeringDepth: aiLayerDepth,
                          safeAreaMode: aiSafeArea,
                          referenceImageUrl: aiReferenceImageUrl.trim() || undefined,
                        },
                        variation: selectedAiResult,
                      };
                      const response = await fetch('/api/artwork-studio/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                      const json = await response.json().catch(() => null);
                      if (!response.ok || !json?.asset) {
                        setAiError('Could not save artwork asset.');
                        return;
                      }
                      setSavedAssets((prev) => [json.asset as ArtworkAsset, ...prev].slice(0, 8));
                    }}
                  >
                    Save asset
                  </button>
                ) : null}
                {savedAssets.length ? <p className="text-[11px] text-white/75">Saved assets in this session: {savedAssets.length}</p> : null}
              </div>
            ) : null}

            <section className="rounded-xl border border-white/20 bg-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-white/65">Recommended presets based on current outfit</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {displayedPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="rounded-xl border border-white/20 bg-gradient-to-br from-white/15 via-white/8 to-transparent p-2 text-left transition hover:border-fuchsia-300/60 hover:shadow-[0_10px_30px_rgba(192,132,252,0.24)]"
                    onClick={() => void applyRecommendedPresetFromReferenceImage(preset.id, getUploadedReferenceImage(), presetContext)}
                  >
                    <p className="text-xs font-semibold">{preset.label}</p>
                    <p className="mt-1 text-[11px] text-white/70">{preset.description}</p>
                    <span
                      className="mt-2 block h-7 rounded-lg border border-white/15"
                      style={buildBackgroundCssStyle(resolveOutfitBackgroundForRender(preset.recipe(presetContext, getUploadedReferenceImage())))}
                    />
                  </button>
                ))}
              </div>
            </section>
          </section>

          <section className="min-h-0 space-y-3 overflow-y-auto rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/65">Live Preview</p>
            <OutfitCard data={previewData} variant="default" />
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white/85">
              <p>Contrast recommendation: <span className="font-semibold">Use {recommendTextTone} text/icons</span>.</p>
              {shouldShowContrastWarning ? <p className="mt-1 text-amber-200">Warning: high-luminance solid background may reduce metadata readability.</p> : null}
            </div>
          </section>
        </div>

        <div className="mt-4 grid gap-3 border-t border-white/15 pt-4 md:grid-cols-2">
          <FancySelect
            value={draft.shape ?? 'none'}
            onChange={(value) => setDraft((prev) => ({ ...prev, shape: value as NonNullable<OutfitBackgroundConfig['shape']> }))}
            label="Selected shape"
            options={SHAPE_SEGMENT_OPTIONS.map((shape) => ({
              value: shape,
              label: shape === 'none' ? 'None (no overlay)' : shape[0].toUpperCase() + shape.slice(1),
              hint: 'Updates geometry in preview',
            }))}
          />
          <FancySelect
            value={SEGMENTED_GRADIENT_OPTIONS.find((preset) => JSON.stringify(draft.gradient) === JSON.stringify(preset.config.gradient))?.label ?? ''}
            onChange={(value) => {
              if (value === 'Flower') {
                setDraft((prev) => ({
                  ...prev,
                  background_mode: 'ai_artwork',
                  ai_artwork: {
                    prompt: 'flower grid pattern',
                    image_url: FLOWER_PICKER_IMAGE,
                    generation_status: 'done',
                  },
                  shape: 'flowers',
                }));
                return;
              }
              const selectedPreset = SEGMENTED_GRADIENT_OPTIONS.find((preset) => preset.label === value);
              if (!selectedPreset) return;
              setDraft((prev) => {
                if (prev.background_mode === 'ai_artwork' && prev.ai_artwork?.image_url) {
                  return {
                    ...prev,
                    gradient: selectedPreset.config.gradient,
                    shape: prev.shape || selectedPreset.config.shape,
                    background_mode: 'ai_artwork',
                  };
                }
                return { ...prev, ...selectedPreset.config, background_mode: 'gradient' };
              });
            }}
            label="Gradient picker"
            options={[
              ...SEGMENTED_GRADIENT_OPTIONS.map((preset) => ({ value: preset.label, label: preset.label, hint: 'Applies gradient + geometry recipe' })),
              { value: 'Flower', label: 'Flower', hint: 'Applies flower motif artwork surface' },
            ]}
          />
        </div>

        <footer className="mt-2 flex flex-wrap justify-end gap-2 border-t border-white/15 pt-4">
          <button type="button" className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm" onClick={onClose}>Cancel / Close</button>
          <button type="button" className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm" onClick={() => setDraft(DEFAULT_BACKGROUND)}>Reset</button>
          <button type="button" className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm" onClick={() => onApply(draft)}>Save Background</button>
          <button type="button" className="rounded-xl border border-violet-300/70 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold" onClick={() => onApply(draft)}>Apply to Card · {draft.shape || 'none'}</button>
        </footer>
      </div>
    </div>
  );
}
