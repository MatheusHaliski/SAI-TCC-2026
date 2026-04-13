'use client';

import { useEffect, useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import {
  BackgroundStudioStyleConfig,
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
type BackgroundPresetId =
  | 'selection_tiled_motif'
  | 'selection_editorial_logo'
  | 'selection_tonal_geometry'
  | 'selection_logo_image_fusion'
  | 'selection_tech_amber_energy'
  | 'selection_metallic_sport_identity'
  | 'selection_neon_motion_grid'
  | 'selection_luxury_fabric_monogram'
  | 'selection_editorial_collage'
  | 'selection_soft_premium_minimal';

type PresetCategory = 'pattern_surface' | 'editorial_branding' | 'tech_energy' | 'hybrid_fusion';

type RecommendedPreset = {
  id: BackgroundPresetId;
  category: PresetCategory;
  label: string;
  description: string;
  recipe: (context: PresetContext, recipe: CompositionRecipe, uploadedReferenceImage?: string | null) => OutfitBackgroundConfig;
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

type ReferenceIntent = 'logo_pure' | 'logo_with_background' | 'symbol_texture' | 'editorial_image' | 'product_photo' | 'abstract_image' | 'fabric_pattern';

type CompositionRecipe = {
  presetId: BackgroundPresetId;
  compositionMode: 'pattern' | 'hero' | 'fusion' | 'tech' | 'editorial' | 'minimal';
  colorStory: string;
  motifDensity: 'low' | 'medium' | 'high';
  logoWeight: number;
  imageWeight: number;
  geometryWeight: number;
  glowWeight: number;
  repeatMode?: 'grid' | 'staggered' | 'diagonal';
  safeAreaBias: 'high' | 'medium' | 'low';
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
const LUXURY_MONOGRAM_BACKGROUND_IMAGE = `/${encodeURIComponent('Firefly_Flux_Consegue adicionar quebras de linha tech ao gradiente (adicionar ranhuras) 3787887.jpg')}`;
const TONAL_GEOMETRY_BACKGROUND_IMAGE = `/${encodeURIComponent('Sem título (32).png')}`;
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
  motifWidth: number;
  motifHeight: number;
  spacingX: number;
  spacingY: number;
  columns: number;
  rows: number;
  canvasWidth: number;
  canvasHeight: number;
  repeatMode: 'grid' | 'staggered' | 'diagonal' | 'scattered-balanced';
  minScale: number;
  maxScale: number;
  minOpacity: number;
  maxOpacity: number;
  maxRotationDeg: number;
  safeArea: { x: number; y: number; width: number; height: number };
  offsetX?: number;
  offsetY?: number;
};

type MotifSeed = {
  source: string;
  aspectRatio: number;
  dominantColor: string;
  brandName: string;
};

type CanvasTiledMotifOptions = {
  canvasWidth: number;
  canvasHeight: number;
  gridColumns: number;
  gridRows: number;
  tileOpacity: number;
};

function createOffscreenCanvas(width: number, height: number) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

async function loadImageFromSource(source: string): Promise<HTMLImageElement> {
  if (typeof window === 'undefined') {
    throw new Error('window_unavailable');
  }
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('image_load_failed'));
    image.src = source;
  });
}

function createReferenceTile(image: HTMLImageElement, tileSize: number, tilePadding: number): HTMLCanvasElement {
  const tileCanvas = createOffscreenCanvas(tileSize, tileSize);
  if (!tileCanvas) throw new Error('canvas_unavailable');
  const tileCtx = tileCanvas.getContext('2d');
  if (!tileCtx) throw new Error('canvas_context_unavailable');
  const contentSize = Math.max(4, tileSize - tilePadding * 2);
  const scale = Math.min(contentSize / image.naturalWidth, contentSize / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const offsetX = (tileSize - drawWidth) / 2;
  const offsetY = (tileSize - drawHeight) / 2;
  tileCtx.clearRect(0, 0, tileSize, tileSize);
  tileCtx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  return tileCanvas;
}

function renderRepeatedTileGrid(
  ctx: CanvasRenderingContext2D,
  tileCanvas: HTMLCanvasElement,
  options: CanvasTiledMotifOptions,
) {
  const stepX = options.canvasWidth / options.gridColumns;
  const stepY = options.canvasHeight / options.gridRows;
  const baseDrawSize = Math.min(stepX, stepY) * 0.88;
  for (let row = 0; row < options.gridRows; row += 1) {
    for (let col = 0; col < options.gridColumns; col += 1) {
      const seed = row * 157 + col * 89 + 17;
      const scale = 0.94 + seededRandom(seed) * 0.13;
      const localOpacity = options.tileOpacity + seededRandom(seed + 3) * 0.14;
      const offsetX = (seededRandom(seed + 5) - 0.5) * stepX * 0.18;
      const offsetY = (seededRandom(seed + 7) - 0.5) * stepY * 0.18;
      const rotation = (seededRandom(seed + 11) - 0.5) * 0.18;
      const drawSize = baseDrawSize * scale;
      const centerX = stepX * (col + 0.5) + offsetX + (row % 2 ? stepX * 0.08 : 0);
      const centerY = stepY * (row + 0.5) + offsetY;
      ctx.save();
      ctx.globalAlpha = Math.min(0.85, Math.max(0.2, localOpacity));
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.drawImage(tileCanvas, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      ctx.restore();
    }
  }
}

async function buildTiledMotifFromReferenceImage(
  referenceImage: string,
  context: PresetContext,
  baseGradient?: OutfitBackgroundConfig['gradient'],
): Promise<OutfitBackgroundConfig> {
  const image = await loadImageFromSource(referenceImage);
  const canvasWidth = 1200;
  const canvasHeight = 800;
  const ratio = image.naturalWidth / Math.max(1, image.naturalHeight);
  const gridColumns = ratio > 1.4 ? 6 : ratio < 0.8 ? 5 : 4;
  const gridRows = ratio > 1.4 ? 4 : 5;
  const tileSize = Math.max(120, Math.round(Math.min(canvasWidth / gridColumns, canvasHeight / gridRows) * 0.9));
  const canvas = createOffscreenCanvas(canvasWidth, canvasHeight);
  if (!canvas) throw new Error('canvas_unavailable');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas_context_unavailable');
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  const gradientStops = baseGradient?.stops?.length
    ? baseGradient.stops
    : [
        { color: '#020617', position: 0 },
        { color: '#0f172a', position: 50 },
        { color: context.heroColor, position: 100 },
      ];
  gradientStops.forEach((stop) => gradient.addColorStop(Math.min(1, Math.max(0, stop.position / 100)), stop.color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const tileCanvas = createReferenceTile(image, tileSize, Math.round(tileSize * 0.14));
  renderRepeatedTileGrid(ctx, tileCanvas, {
    canvasWidth,
    canvasHeight,
    gridColumns,
    gridRows,
    tileOpacity: 0.34,
  });
  ctx.fillStyle = 'rgba(2,6,23,0.14)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const outputUrl = canvas.toDataURL('image/png');
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} repeated motif surface from uploaded logo via canvas tiled composition`,
      image_url: outputUrl,
      generation_status: 'done',
    },
    shape: 'none',
    texture_overlay: false,
    gradient: {
      type: 'linear',
      angle: 132,
      intensity: 104,
      stops: gradientStops,
    },
  };
}

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function createRepeatedImagePattern(referenceImage: string, options: RepeatedImagePatternOptions) {
  const stepX = options.motifWidth + options.spacingX;
  const stepY = options.motifHeight + options.spacingY;
  const startX = options.offsetX ?? 24;
  const startY = options.offsetY ?? 24;
  const diagonalShift = Math.round(stepX * 0.32);
  const safeX2 = options.safeArea.x + options.safeArea.width;
  const safeY2 = options.safeArea.y + options.safeArea.height;

  return Array.from({ length: options.rows }).map((_, row) =>
    Array.from({ length: options.columns }).map((__, col) => {
      let x = startX + col * stepX;
      let y = startY + row * stepY;
      if (options.repeatMode === 'staggered' && row % 2 !== 0) x += Math.round(stepX * 0.48);
      if (options.repeatMode === 'diagonal') x += row * diagonalShift;
      if (options.repeatMode === 'scattered-balanced') {
        x += Math.round((seededRandom((row + 2) * 17 + (col + 5) * 29) - 0.5) * (options.spacingX * 0.65));
        y += Math.round((seededRandom((row + 11) * 31 + (col + 7) * 13) - 0.5) * (options.spacingY * 0.65));
      }

      const variationSeed = row * 97 + col * 53 + options.columns * 11;
      const scale = options.minScale + seededRandom(variationSeed + 1) * (options.maxScale - options.minScale);
      const opacity = options.minOpacity + seededRandom(variationSeed + 2) * (options.maxOpacity - options.minOpacity);
      const rotation = (seededRandom(variationSeed + 3) * 2 - 1) * options.maxRotationDeg;
      const motifW = Math.round(options.motifWidth * scale);
      const motifH = Math.round(options.motifHeight * scale);
      const motifX = Math.round(x - (motifW - options.motifWidth) / 2);
      const motifY = Math.round(y - (motifH - options.motifHeight) / 2);
      const centerX = motifX + motifW / 2;
      const centerY = motifY + motifH / 2;
      const inSafeArea = centerX >= options.safeArea.x && centerX <= safeX2 && centerY >= options.safeArea.y && centerY <= safeY2;
      const safeAreaOpacity = inSafeArea ? 0.35 : 1;

      return `<g transform='translate(${centerX} ${centerY}) rotate(${rotation.toFixed(2)}) translate(${-centerX} ${-centerY})' opacity='${(opacity * safeAreaOpacity).toFixed(3)}'>
        <image href='${referenceImage}' x='${motifX}' y='${motifY}' width='${motifW}' height='${motifH}' preserveAspectRatio='xMidYMid meet'/>
      </g>`;
    }).join('')
  ).join('');
}

function extractMotifSeed(referenceImage: string, context: PresetContext, imageAspectRatio = 1): MotifSeed {
  return {
    source: referenceImage,
    aspectRatio: Number.isFinite(imageAspectRatio) && imageAspectRatio > 0 ? imageAspectRatio : 1,
    dominantColor: context.heroColor,
    brandName: context.brandName,
  };
}

function generateRepeatedPattern(motifSeed: MotifSeed, repeatMode: RepeatedImagePatternOptions['repeatMode']) {
  const safeAspectRatio = motifSeed.aspectRatio;
  const motifScale: 'tiny' | 'small' | 'medium' = safeAspectRatio > 1.8 ? 'tiny' : safeAspectRatio < 0.7 ? 'medium' : 'small';
  const density: 'low' | 'medium' | 'high' = 'high';
  const motifHeightByScale = { tiny: 54, small: 68, medium: 84 } as const;
  const densityRows = { low: 6, medium: 7, high: 9 } as const;
  const densityCols = { low: 10, medium: 12, high: 15 } as const;
  const motifHeight = motifHeightByScale[motifScale];
  const motifWidth = Math.round(Math.min(138, Math.max(40, motifHeight * safeAspectRatio)));
  return createRepeatedImagePattern(motifSeed.source, {
    motifWidth,
    motifHeight,
    spacingX: 16,
    spacingY: 18,
    columns: densityCols[density],
    rows: densityRows[density],
    canvasWidth: 1200,
    canvasHeight: 800,
    repeatMode,
    minScale: 0.92,
    maxScale: 1.08,
    minOpacity: 0.26,
    maxOpacity: 0.52,
    maxRotationDeg: 7,
    safeArea: { x: 110, y: 90, width: 550, height: 360 },
    offsetX: 16,
    offsetY: 20,
  });
}

function compositeMotifSurface(
  motifSeed: MotifSeed,
  repeatedPattern: string,
  repeatMode: RepeatedImagePatternOptions['repeatMode'],
  baseGradient?: OutfitBackgroundConfig['gradient'],
) {
  const gradientStops = baseGradient?.stops?.length
    ? baseGradient.stops
    : [
        { color: '#020617', position: 0 },
        { color: '#0f172a', position: 50 },
        { color: motifSeed.dominantColor, position: 100 },
      ];
  const stopMarkup = gradientStops.map((stop) => (
    `<stop offset='${Math.min(100, Math.max(0, stop.position))}%' stop-color='${stop.color}'/>`
  )).join('');
  return asDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='surface' x1='0%' y1='0%' x2='100%' y2='100%'>
          ${stopMarkup}
        </linearGradient>
        <radialGradient id='safeAreaMask' cx='30%' cy='28%' r='42%'>
          <stop offset='0%' stop-color='rgba(15,23,42,0.70)'/>
          <stop offset='75%' stop-color='rgba(15,23,42,0.22)'/>
          <stop offset='100%' stop-color='rgba(15,23,42,0)'/>
        </radialGradient>
        <pattern id='microGrid' width='20' height='20' patternUnits='userSpaceOnUse'>
          <path d='M20 0H0V20' fill='none' stroke='rgba(148,163,184,0.08)' stroke-width='1'/>
        </pattern>
        <filter id='softShadow' x='-12%' y='-12%' width='124%' height='124%'>
          <feGaussianBlur stdDeviation='2.8'/>
        </filter>
      </defs>
      <rect width='1200' height='800' fill='url(#surface)'/>
      <rect width='1200' height='800' fill='url(#microGrid)'/>
      <rect width='1200' height='800' fill='rgba(248,250,252,0.03)'/>
      <g filter='url(#softShadow)' opacity='0.28'>
        ${repeatedPattern}
      </g>
      ${repeatedPattern}
      <rect x='60' y='60' width='610' height='390' rx='44' fill='url(#safeAreaMask)'/>
      <rect width='1200' height='800' fill='rgba(2,6,23,0.12)'/>
      <text x='66' y='760' font-size='22' font-family='Inter, Arial, sans-serif' fill='rgba(148,163,184,0.55)' letter-spacing='3'>${escapeSvgAttribute(motifSeed.brandName.toUpperCase())} MOTIF SURFACE · ${repeatMode.toUpperCase()}</text>
    </svg>`,
  );
}

function buildTiledMotifFromReference(
  referenceImage: string,
  context: PresetContext,
  imageAspectRatio = 1,
  baseGradient?: OutfitBackgroundConfig['gradient'],
): OutfitBackgroundConfig {
  const motifSeed = extractMotifSeed(referenceImage, context, imageAspectRatio);
  const repeatModes: RepeatedImagePatternOptions['repeatMode'][] = ['grid', 'staggered', 'diagonal', 'scattered-balanced'];
  const repeatMode = repeatModes[Math.abs(context.brandName.length) % repeatModes.length];
  const repeatedPattern = generateRepeatedPattern(motifSeed, repeatMode);
  const tiledBrandSurface = compositeMotifSurface(motifSeed, repeatedPattern, repeatMode, baseGradient);
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} repeated motif surface from uploaded logo, ${repeatMode} layout, premium editorial texture`,
      image_url: tiledBrandSurface,
      generation_status: 'done',
    },
    shape: 'none',
    texture_overlay: false,
    gradient: {
      type: 'linear',
      angle: 132,
      intensity: 104,
      stops: [
        { color: '#020617', position: 0 },
        { color: '#0f172a', position: 50 },
        { color: context.heroColor, position: 100 },
      ],
    },
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

function analyzeReferenceIntent(referenceImage?: string | null): ReferenceIntent {
  if (!referenceImage) return 'logo_pure';
  if (referenceImage.includes('logo') || referenceImage.includes('brand')) return 'logo_pure';
  if (referenceImage.includes('pattern') || referenceImage.includes('fabric')) return 'fabric_pattern';
  if (referenceImage.includes('product')) return 'product_photo';
  if (referenceImage.includes('editorial') || referenceImage.includes('campaign')) return 'editorial_image';
  if (referenceImage.includes('texture')) return 'symbol_texture';
  return 'abstract_image';
}

function extractPrimaryVisualSubject(referenceImage?: string | null) {
  if (!referenceImage) return 'brand_mark';
  if (referenceImage.includes('data:image/')) return 'uploaded_symbol';
  if (referenceImage.includes('blob:')) return 'uploaded_photo';
  return 'asset_subject';
}

function detectLogoLikeSubject(referenceImage?: string | null) {
  const subject = extractPrimaryVisualSubject(referenceImage);
  const intent = analyzeReferenceIntent(referenceImage);
  return subject === 'uploaded_symbol' || intent === 'logo_pure' || intent === 'logo_with_background';
}

function buildCompositionRecipe(input: {
  presetId: BackgroundPresetId;
  referenceIntent: ReferenceIntent;
  gradient?: OutfitBackgroundConfig['gradient'];
}): CompositionRecipe {
  const common = {
    colorStory: input.gradient?.stops?.map((stop) => stop.color).join(' → ') || 'selection-premium',
    motifDensity: 'medium' as const,
    logoWeight: input.referenceIntent === 'logo_pure' ? 0.9 : 0.7,
    imageWeight: input.referenceIntent === 'editorial_image' ? 0.9 : 0.65,
    geometryWeight: 0.45,
    glowWeight: 0.3,
    safeAreaBias: 'high' as const,
  };
  const recipeByPreset: Record<BackgroundPresetId, CompositionRecipe> = {
    selection_tiled_motif: { ...common, presetId: input.presetId, compositionMode: 'pattern', motifDensity: 'high', repeatMode: 'staggered', geometryWeight: 0.3, glowWeight: 0.2 },
    selection_editorial_logo: { ...common, presetId: input.presetId, compositionMode: 'hero', motifDensity: 'low', repeatMode: 'grid', logoWeight: 0.98, imageWeight: 0.35 },
    selection_tonal_geometry: { ...common, presetId: input.presetId, compositionMode: 'editorial', motifDensity: 'medium', repeatMode: 'diagonal', geometryWeight: 0.8 },
    selection_logo_image_fusion: { ...common, presetId: input.presetId, compositionMode: 'fusion', motifDensity: 'medium', logoWeight: 0.72, imageWeight: 0.88, geometryWeight: 0.6, glowWeight: 0.48 },
    selection_tech_amber_energy: { ...common, presetId: input.presetId, compositionMode: 'tech', motifDensity: 'high', repeatMode: 'diagonal', logoWeight: 0.78, imageWeight: 0.66, geometryWeight: 0.86, glowWeight: 0.82, safeAreaBias: 'medium' },
    selection_metallic_sport_identity: { ...common, presetId: input.presetId, compositionMode: 'tech', motifDensity: 'medium', repeatMode: 'grid', logoWeight: 0.72, imageWeight: 0.62, geometryWeight: 0.76, glowWeight: 0.46 },
    selection_neon_motion_grid: { ...common, presetId: input.presetId, compositionMode: 'tech', motifDensity: 'high', repeatMode: 'diagonal', logoWeight: 0.7, imageWeight: 0.7, geometryWeight: 0.9, glowWeight: 0.88, safeAreaBias: 'medium' },
    selection_luxury_fabric_monogram: { ...common, presetId: input.presetId, compositionMode: 'pattern', motifDensity: 'medium', repeatMode: 'staggered', logoWeight: 0.84, imageWeight: 0.48, geometryWeight: 0.26, glowWeight: 0.14 },
    selection_editorial_collage: { ...common, presetId: input.presetId, compositionMode: 'editorial', motifDensity: 'low', repeatMode: 'grid', logoWeight: 0.66, imageWeight: 0.92, geometryWeight: 0.52, glowWeight: 0.4 },
    selection_soft_premium_minimal: { ...common, presetId: input.presetId, compositionMode: 'minimal', motifDensity: 'low', repeatMode: 'grid', logoWeight: 0.56, imageWeight: 0.35, geometryWeight: 0.2, glowWeight: 0.08 },
  };
  return recipeByPreset[input.presetId];
}

function buildSurfaceFromRecipe(
  recipe: CompositionRecipe,
  context: PresetContext,
  referenceImage?: string | null,
): OutfitBackgroundConfig {
  const brand = escapeSvgAttribute(context.brandName);
  const commonGradient = {
    type: 'linear' as const,
    angle: 130,
    intensity: 105,
    stops: [{ color: '#0b1120', position: 0 }, { color: context.heroColor, position: 54 }, { color: '#f8fafc', position: 100 }],
  };
  const buildImageSurface = (
    svg: string,
    shape: NonNullable<OutfitBackgroundConfig['shape']> = 'mesh',
    studioStyleConfig?: BackgroundStudioStyleConfig,
  ): OutfitBackgroundConfig => ({
    background_mode: 'ai_artwork',
    ai_artwork: { prompt: `${context.brandName} ${recipe.presetId} composition`, image_url: asDataUri(svg), generation_status: 'done' },
    gradient: commonGradient,
    shape,
    studioStyleConfig,
  });
  const safeReferenceImage = referenceImage || context.brandLogoUrl || null;
  if (recipe.presetId === 'selection_tiled_motif' && safeReferenceImage) return buildTiledMotifFromReference(safeReferenceImage, context, 1, commonGradient);
  if (recipe.presetId === 'selection_editorial_logo' && safeReferenceImage) return buildEditorialLogoComposition(safeReferenceImage, context);
  if (recipe.presetId === 'selection_tonal_geometry') {
    return {
      background_mode: 'ai_artwork',
      ai_artwork: {
        prompt: `${context.brandName} selection tonal geometry premium surface`,
        image_url: TONAL_GEOMETRY_BACKGROUND_IMAGE,
        generation_status: 'done',
      },
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
      studioStyleConfig: {
        presetId: 'selection_tonal_geometry',
        family: 'geometry',
        styleMode: 'tonal_geometry_image_base',
        material: 'tonal_panel',
        paletteMode: 'cool_luxury',
        referenceImageUrl: safeReferenceImage,
      },
    };
  }
  if (recipe.presetId === 'selection_luxury_fabric_monogram') {
    // TODO: replace this procedural SVG with higher-fidelity material synthesis when image generation pipeline supports deterministic layering.
    console.info('[background-studio] applying luxury fabric monogram', { presetId: recipe.presetId, hasReferenceImage: Boolean(safeReferenceImage) });
    const monogramLayer = safeReferenceImage
      ? Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 9 }).map((__, col) => {
            const x = col * 138 + (row % 2 ? 58 : 8);
            const y = row * 128 + 20;
            return `<image href='${safeReferenceImage}' x='${x}' y='${y}' width='78' height='78' opacity='0.085' preserveAspectRatio='xMidYMid meet'/>`;
          }).join(''),
        ).join('')
      : '';
    const glassSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='glassBase' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='#c8dcff'/>
          <stop offset='42%' stop-color='#8cb4f4'/>
          <stop offset='100%' stop-color='#5b7fb8'/>
        </linearGradient>
        <radialGradient id='edgeGlow' cx='15%' cy='12%' r='86%'>
          <stop offset='0%' stop-color='rgba(255,255,255,0.42)'/>
          <stop offset='100%' stop-color='rgba(255,255,255,0)'/>
        </radialGradient>
      </defs>
      <image href='${LUXURY_MONOGRAM_BACKGROUND_IMAGE}' x='0' y='0' width='1200' height='800' preserveAspectRatio='xMidYMid slice' opacity='0.72'/>
      <rect width='1200' height='800' fill='url(#glassBase)' opacity='0.8'/>
      <rect x='40' y='38' width='1120' height='724' rx='56' fill='rgba(255,255,255,0.12)' stroke='rgba(255,255,255,0.26)' stroke-width='2'/>
      <path d='M-40,590 C170,458 450,678 720,612 C982,544 1140,356 1290,300 V800 H-40 Z' fill='rgba(215,234,255,0.3)'/>
      <path d='M70,120 C360,18 860,58 1130,200 C930,270 560,300 240,244 Z' fill='rgba(255,255,255,0.22)'/>
      <rect width='1200' height='800' fill='url(#edgeGlow)'/>
      ${monogramLayer}
      <rect x='28' y='24' width='1144' height='752' rx='60' fill='none' stroke='rgba(234,245,255,0.5)' stroke-width='1.3'/>
    </svg>`;
    return buildImageSurface(glassSvg, 'none', {
      presetId: 'selection_luxury_fabric_monogram',
      family: 'pattern_surface',
      styleMode: 'glass_monogram',
      material: 'translucent_glass',
      paletteMode: 'cool_luxury',
      referenceImageUrl: safeReferenceImage,
      overlays: [
        { type: 'glass_reflection', opacity: 0.2, density: 'low', blendMode: 'screen' },
        { type: 'glow', opacity: 0.18, density: 'low', blendMode: 'screen' },
        { type: 'monogram', opacity: 0.08, density: 'low', blendMode: 'soft-light' },
      ],
      metadata: {
        monogramMode: safeReferenceImage ? 'embedded_soft_repeat' : 'no_reference_fallback_glass_only',
        reflectionSweep: true,
        edgeHighlight: true,
        blurStrength: 0.22,
        backgroundImageSrc: LUXURY_MONOGRAM_BACKGROUND_IMAGE,
      },
    });
  }
  if (recipe.presetId === 'selection_soft_premium_minimal') {
    // TODO: evolve this preset into physically based brushed-metal rendering once premium texture generator is available.
    console.info('[background-studio] applying soft premium minimal', { presetId: recipe.presetId, hasReferenceImage: Boolean(safeReferenceImage) });
    const goldenSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='goldBase' x1='0%' y1='10%' x2='100%' y2='90%'>
          <stop offset='0%' stop-color='#f6ead1'/>
          <stop offset='44%' stop-color='#e6c894'/>
          <stop offset='100%' stop-color='#b98754'/>
        </linearGradient>
      </defs>
      <rect width='1200' height='800' fill='url(#goldBase)'/>
      <path d='M-20,560 C260,510 560,620 880,560 C1030,532 1140,474 1220,430 V800 H-20 Z' fill='rgba(121,72,34,0.16)'/>
      ${Array.from({ length: 10 }).map((_, i) => `<line x1='0' y1='${96 + i * 54}' x2='1200' y2='${96 + i * 54}' stroke='rgba(255,252,244,0.13)' stroke-width='1'/>`).join('')}
      <rect width='1200' height='800' fill='rgba(17,12,8,0.06)'/>
    </svg>`;
    return buildImageSurface(goldenSvg, 'none', {
      presetId: 'selection_soft_premium_minimal',
      family: 'minimal_luxury',
      styleMode: 'golden_minimal',
      material: 'soft_metallic_gradient',
      paletteMode: 'authview_gold',
      referenceImageUrl: safeReferenceImage,
      overlays: [
        { type: 'gradient_sweep', opacity: 0.2, density: 'minimal', blendMode: 'soft-light' },
        { type: 'linework', opacity: 0.12, density: 'minimal', blendMode: 'overlay' },
      ],
      metadata: {
        linework: 'refined_horizontal',
        glowIntensity: 0.05,
        blurStrength: 0.08,
        density: 'minimal',
      },
    });
  }

  const generators: Record<Exclude<BackgroundPresetId, 'selection_tiled_motif' | 'selection_editorial_logo' | 'selection_tonal_geometry'>, () => OutfitBackgroundConfig> = {
    selection_logo_image_fusion: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='1200' height='800' fill='#020617'/><image href='${safeReferenceImage || ''}' x='0' y='0' width='1200' height='800' preserveAspectRatio='xMidYMid slice' opacity='0.58'/><path d='M0,640 C250,560 520,730 860,620 C1030,565 1130,500 1200,440 V800 H0 Z' fill='rgba(15,23,42,0.64)'/><image href='${safeReferenceImage || ''}' x='730' y='120' width='350' height='430' preserveAspectRatio='xMidYMid meet' opacity='0.88'/><text x='90' y='690' font-size='74' font-family='Arial Black,Arial,sans-serif' fill='rgba(255,255,255,0.86)'>${brand}</text></svg>`, 'orb'),
    selection_tech_amber_energy: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='amber' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#2b1202'/><stop offset='46%' stop-color='#f97316'/><stop offset='100%' stop-color='#fde047'/></linearGradient><filter id='glow'><feGaussianBlur stdDeviation='8'/></filter></defs><rect width='1200' height='800' fill='url(#amber)'/><image href='${safeReferenceImage || ''}' x='0' y='0' width='1200' height='800' opacity='0.18' preserveAspectRatio='xMidYMid slice'/><g stroke='rgba(255,214,10,0.45)' stroke-width='2'>${Array.from({ length: 10 }).map((_, i) => `<line x1='${i * 130}' y1='0' x2='${i * 130 + 220}' y2='800'/>`).join('')}</g><rect x='730' y='120' width='360' height='460' rx='34' fill='rgba(15,23,42,0.45)'/><image href='${safeReferenceImage || ''}' x='760' y='150' width='300' height='330' opacity='0.94' preserveAspectRatio='xMidYMid meet'/><circle cx='360' cy='320' r='170' fill='rgba(255,224,110,0.32)' filter='url(#glow)'/><text x='80' y='716' font-size='56' fill='rgba(17,24,39,0.78)' font-family='Arial Black,Arial,sans-serif'>${brand} · TECH AMBER ENERGY</text></svg>`, 'beams'),
    selection_metallic_sport_identity: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='metal' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#020617'/><stop offset='42%' stop-color='#374151'/><stop offset='100%' stop-color='#cbd5e1'/></linearGradient></defs><rect width='1200' height='800' fill='url(#metal)'/><path d='M0,560 L1200,190 L1200,380 L0,760 Z' fill='rgba(148,163,184,0.24)'/><image href='${safeReferenceImage || ''}' x='100' y='120' width='420' height='420' opacity='0.22' preserveAspectRatio='xMidYMid meet'/><image href='${safeReferenceImage || ''}' x='760' y='170' width='330' height='330' opacity='0.92' preserveAspectRatio='xMidYMid meet'/><rect x='742' y='150' width='366' height='366' rx='34' fill='none' stroke='rgba(226,232,240,0.62)' stroke-width='4'/><text x='84' y='716' font-size='52' fill='rgba(248,250,252,0.8)' font-family='Arial Black,Arial,sans-serif'>METALLIC SPORT IDENTITY</text></svg>`, 'diamond'),
    selection_neon_motion_grid: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='neon' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#020617'/><stop offset='55%' stop-color='#0f172a'/><stop offset='100%' stop-color='#1d4ed8'/></linearGradient></defs><rect width='1200' height='800' fill='url(#neon)'/>${Array.from({ length: 12 }).map((_, i) => `<line x1='${i * 110}' y1='-50' x2='${i * 110 + 320}' y2='850' stroke='rgba(34,211,238,0.22)' stroke-width='2'/>`).join('')}<image href='${safeReferenceImage || ''}' x='720' y='150' width='370' height='430' opacity='0.88' preserveAspectRatio='xMidYMid meet'/><rect x='702' y='132' width='406' height='466' rx='36' fill='none' stroke='rgba(56,189,248,0.64)' stroke-width='3'/></svg>`, 'arrows'),
    selection_luxury_fabric_monogram: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='1200' height='800' fill='#1f2937'/></svg>`, 'none'),
    selection_editorial_collage: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='1200' height='800' fill='#111827'/><image href='${safeReferenceImage || ''}' x='0' y='0' width='620' height='800' opacity='0.66' preserveAspectRatio='xMidYMid slice'/><image href='${safeReferenceImage || ''}' x='540' y='110' width='610' height='540' opacity='0.84' preserveAspectRatio='xMidYMid slice'/><rect x='520' y='90' width='640' height='570' fill='none' stroke='rgba(248,250,252,0.32)' stroke-width='3'/><text x='560' y='706' font-size='58' fill='rgba(248,250,252,0.9)' font-family='Arial Black,Arial,sans-serif'>EDITORIAL COLLAGE</text></svg>`, 'mesh'),
    selection_soft_premium_minimal: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='1200' height='800' fill='#e2c28c'/></svg>`, 'none'),
  };
  return generators[recipe.presetId as keyof typeof generators]();
}

function getRecommendedPresets(): RecommendedPreset[] {
  return [
    { id: 'selection_tiled_motif', category: 'pattern_surface', label: 'Selection tiled motif', description: 'Turns the uploaded logo into a repeated premium motif surface.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
    { id: 'selection_luxury_fabric_monogram', category: 'pattern_surface', label: 'Selection luxury fabric monogram', description: 'Builds a refined fashion surface with repeated branded monogram texture.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || null) },
    { id: 'selection_tonal_geometry', category: 'pattern_surface', label: 'Selection tonal geometry', description: 'Combines tonal palette extraction with subtle geometric paneling.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
    { id: 'selection_editorial_logo', category: 'editorial_branding', label: 'Selection editorial logo', description: 'Uses the uploaded logo as a hero element in a clean campaign-style composition.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
    { id: 'selection_editorial_collage', category: 'editorial_branding', label: 'Selection editorial collage', description: 'Fuses cropped logo and treated imagery into a depth-rich editorial card.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
    { id: 'selection_soft_premium_minimal', category: 'editorial_branding', label: 'Selection soft premium minimal', description: 'Minimal, high-readability premium composition with restrained visual weight.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || null) },
    { id: 'selection_tech_amber_energy', category: 'tech_energy', label: 'Selection tech amber energy', description: 'Fuses uploaded logo with high-energy amber/orange AI-tech visual treatment.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
    { id: 'selection_neon_motion_grid', category: 'tech_energy', label: 'Selection neon motion grid', description: 'Adds diagonal neon movement, digital grid rhythm, and logo anchoring.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
    { id: 'selection_metallic_sport_identity', category: 'tech_energy', label: 'Selection metallic sport identity', description: 'Applies silver/graphite highlights for premium sport-tech brand identity.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
    { id: 'selection_logo_image_fusion', category: 'hybrid_fusion', label: 'Selection logo + stylized image fusion', description: 'Blends uploaded logo with stylized image composition for richer hero surfaces.', recipe: (ctx, recipe, uploaded) => buildSurfaceFromRecipe(recipe, ctx, uploaded || (ctx.brandLogoUrl || FLOWER_PICKER_IMAGE)) },
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
  const [aiReferenceImageDataUrl, setAiReferenceImageDataUrl] = useState('');
  const [aiReferenceFileName, setAiReferenceFileName] = useState('');
  const [aiGenerationMode, setAiGenerationMode] = useState<BackgroundGenerationMode>('hybrid');
  const [aiResults, setAiResults] = useState<ArtworkVariation[]>([]);
  const [savedAssets, setSavedAssets] = useState<ArtworkAsset[]>([]);
  const [aiGradientResults, setAiGradientResults] = useState<OutfitBackgroundConfig[]>([]);
  const [selectedAiResult, setSelectedAiResult] = useState<ArtworkVariation | null>(null);
  const [selectedRecommendedPreset, setSelectedRecommendedPreset] = useState<BackgroundPresetId | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [backendWarning, setBackendWarning] = useState<string | null>(null);
  const [presetRequirementMessage, setPresetRequirementMessage] = useState<string | null>(null);

  const presetContext = useMemo<PresetContext>(() => {
    const metadataBrand = outfitMetadata?.brandIdentity || outfitMetadata?.brands?.[0] || previewCardData.pieces?.[0]?.brand || 'SELECTION';
    const brandName = metadataBrand.trim() || 'SELECTION';
    const brandLogoUrl = resolveBrandLogoUrlByName(brandName) || null;
    const heroColor = previewCardData.outfitBackground && 'background_mode' in previewCardData.outfitBackground && previewCardData.outfitBackground.background_mode === 'solid'
      ? previewCardData.outfitBackground.solid_color || '#1d4ed8'
      : '#1d4ed8';
    return { brandName, brandLogoUrl, heroColor };
  }, [outfitMetadata, previewCardData]);
  const recommendedPresets = useMemo(() => getRecommendedPresets(), []);
  const groupedPresets = useMemo(() => ({
    pattern_surface: recommendedPresets.filter((item) => item.category === 'pattern_surface'),
    editorial_branding: recommendedPresets.filter((item) => item.category === 'editorial_branding'),
    tech_energy: recommendedPresets.filter((item) => item.category === 'tech_energy'),
    hybrid_fusion: recommendedPresets.filter((item) => item.category === 'hybrid_fusion'),
  }), [recommendedPresets]);
  const isUploadedReferenceImage = (value: string) => value.startsWith('data:image/') || value.startsWith('blob:');
  const getUploadedReferenceImage = () => (isUploadedReferenceImage(aiReferenceImageUrl) ? aiReferenceImageUrl : null);
  const getReferenceImageForApi = () => {
    const candidate = aiReferenceImageDataUrl.trim();
    if (!candidate) return undefined;
    const MAX_REFERENCE_BYTES = 1_500_000;
    return candidate.length <= MAX_REFERENCE_BYTES ? candidate : undefined;
  };

  useEffect(() => () => {
    if (aiReferenceImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(aiReferenceImageUrl);
    }
  }, [aiReferenceImageUrl]);

  const applyRecommendedPresetFromReferenceImage = async (
    presetId: BackgroundPresetId,
    uploadedReferenceImage: string | null,
    context: PresetContext,
  ) => {
    console.info('[background-studio] preset selected', { presetId, hasReferenceImage: Boolean(uploadedReferenceImage) });
    setPresetRequirementMessage(null);
    const preset = recommendedPresets.find((item) => item.id === presetId);
    if (!preset) return;
    if (presetId === 'selection_tiled_motif' && !uploadedReferenceImage) {
      setPresetRequirementMessage('Selection Tiled Motif requires a REFERENCE IMAGE UPLOAD to generate the repeated mosaic.');
      return;
    }
    const referenceIntent = analyzeReferenceIntent(uploadedReferenceImage);
    if (uploadedReferenceImage) {
      console.info('[background-studio] reference image detected', { presetId, referenceIntent });
    }
    console.info('[background-studio] building preview config', { presetId, referenceIntent });
    let recipe = buildCompositionRecipe({ presetId, referenceIntent, gradient: draft.gradient });
    if (detectLogoLikeSubject(uploadedReferenceImage)) {
      recipe = { ...recipe, logoWeight: Math.min(1, recipe.logoWeight + 0.08) };
    }
    let config = preset.recipe(context, recipe, uploadedReferenceImage);
    if (presetId === 'selection_tiled_motif' && uploadedReferenceImage) {
      try {
        config = await buildTiledMotifFromReferenceImage(uploadedReferenceImage, context, draft.gradient);
      } catch {
        setPresetRequirementMessage('Unable to process the uploaded image for Selection Tiled Motif. Please upload a valid image and try again.');
        return;
      }
    }
    setSelectedRecommendedPreset(presetId);
    setDraft((prev) => ({
      ...prev,
      ...config,
    }));
    console.info('[background-studio] applied to card', {
      presetId,
      hasReferenceImage: Boolean(uploadedReferenceImage),
      previewUpdated: true,
      studioStyleConfig: config.studioStyleConfig ?? null,
    });
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

  const applyDraftToCard = () => {
    console.info('[background-studio] applied to card', {
      presetId: draft.studioStyleConfig?.presetId ?? selectedRecommendedPreset ?? null,
      hasReferenceImage: Boolean(getUploadedReferenceImage()),
      styleConfig: draft.studioStyleConfig ?? null,
      previewUpdated: true,
    });
    onApply(draft);
  };

  const saveBackgroundConfig = () => {
    console.info('[background-studio] saving background config', {
      presetId: draft.studioStyleConfig?.presetId ?? selectedRecommendedPreset ?? null,
      hasReferenceImage: Boolean(getUploadedReferenceImage()),
      styleConfig: draft.studioStyleConfig ?? null,
    });
    onApply(draft);
  };

  const generateAiBackground = async () => {
    setAiLoading(true);
    setAiError(null);
    setBackendWarning(null);
    setPresetRequirementMessage(null);
    const uploadedReferenceImage = getUploadedReferenceImage();

    if (selectedRecommendedPreset === 'selection_tiled_motif') {
      if (!uploadedReferenceImage) {
        setAiLoading(false);
        setAiError('Selection Tiled Motif depends on REFERENCE IMAGE UPLOAD. Upload an image before generating.');
        return;
      }
      let tiledSurface: OutfitBackgroundConfig;
      try {
        tiledSurface = await buildTiledMotifFromReferenceImage(uploadedReferenceImage, presetContext, draft.gradient);
      } catch {
        setAiLoading(false);
        setAiError('Could not build tiled motif from the uploaded reference image.');
        return;
      }
      const outputUrl = tiledSurface.ai_artwork?.image_url || uploadedReferenceImage;
      const variation: ArtworkVariation = {
        variation_id: `tiled_motif_${Date.now()}`,
        preview_url: outputUrl,
        output_url: outputUrl,
        thumbnail_url: outputUrl,
        provider: 'procedural',
        provider_job_id: null,
        provider_model: 'selection-tiled-motif',
        metadata: {
          source: 'selection_tiled_motif',
          fallback: false,
          repeat_mode: 'canvas_grid',
        },
      };
      setAiLoading(false);
      setDraft((prev) => ({ ...prev, ...tiledSurface }));
      setAiResults([variation]);
      setSelectedAiResult(variation);
      setAiGradientResults([]);
      return;
    }

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
      referenceImageUrl: getReferenceImageForApi(),
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
                          if (aiReferenceImageUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(aiReferenceImageUrl);
                          }
                          setAiReferenceImageUrl('');
                          setAiReferenceImageDataUrl('');
                          setAiReferenceFileName('');
                          return;
                        }

                        const previewUrl = URL.createObjectURL(file);
                        if (aiReferenceImageUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(aiReferenceImageUrl);
                        }
                        setAiReferenceImageUrl(previewUrl);
                        setAiReferenceImageDataUrl('');
                        setBackendWarning(null);

                        if (file.size > 1_500_000) {
                          setBackendWarning('Large reference image detected. Local presets will work, but server-side reference upload was skipped to keep generation stable.');
                          setAiReferenceFileName(file.name);
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = typeof reader.result === 'string' ? reader.result : '';
                          setAiReferenceImageDataUrl(result);
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
                {presetRequirementMessage ? <p className="text-xs text-amber-200">{presetRequirementMessage}</p> : null}
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
                          referenceImageUrl: getReferenceImageForApi(),
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
              <div className="mt-2 space-y-3">
                {([
                  { key: 'pattern_surface' as const, label: 'Pattern / Surface', presets: groupedPresets.pattern_surface },
                  { key: 'editorial_branding' as const, label: 'Editorial / Branding', presets: groupedPresets.editorial_branding },
                  { key: 'tech_energy' as const, label: 'Tech / Energy', presets: groupedPresets.tech_energy },
                  { key: 'hybrid_fusion' as const, label: 'Hybrid / Fusion', presets: groupedPresets.hybrid_fusion },
                ]).map((group) => (
                  <div key={group.key}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65">{group.label}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.presets.map((preset) => {
                        const uploadedReferenceImage = getUploadedReferenceImage();
                        const requiresUploadedReference = preset.id === 'selection_tiled_motif';
                        const isDisabled = requiresUploadedReference && !uploadedReferenceImage;
                        const previewRecipe = buildCompositionRecipe({
                          presetId: preset.id,
                          referenceIntent: analyzeReferenceIntent(uploadedReferenceImage),
                          gradient: draft.gradient,
                        });
                        const previewConfig = preset.recipe(presetContext, previewRecipe, uploadedReferenceImage);
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            disabled={isDisabled}
                            className="rounded-xl border border-white/20 bg-gradient-to-br from-white/15 via-white/8 to-transparent p-2 text-left transition enabled:hover:border-fuchsia-300/60 enabled:hover:shadow-[0_10px_30px_rgba(192,132,252,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => void applyRecommendedPresetFromReferenceImage(preset.id, uploadedReferenceImage, presetContext)}
                          >
                            <p className="text-xs font-semibold">{preset.label}</p>
                            <p className="mt-1 text-[11px] text-white/70">{preset.description}</p>
                            {isDisabled ? <p className="mt-1 text-[10px] text-amber-200">Requires REFERENCE IMAGE UPLOAD</p> : null}
                            <span
                              className="mt-2 block h-9 rounded-lg border border-white/15"
                              style={buildBackgroundCssStyle(resolveOutfitBackgroundForRender(previewConfig))}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
          <button type="button" className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm" onClick={saveBackgroundConfig}>Save Background</button>
          <button type="button" className="rounded-xl border border-violet-300/70 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold" onClick={applyDraftToCard}>Apply to Card · {draft.shape || 'none'}</button>
        </footer>
      </div>
    </div>
  );
}
