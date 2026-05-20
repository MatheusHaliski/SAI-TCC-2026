'use client';

import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import {
  BackgroundStudioStyleConfig,
  OutfitBackgroundConfig,
  OutfitCardData,
  buildBackgroundCssStyle,
  resolveBrandLogoUrlByName,
  resolveOutfitBackgroundForRender,
} from '@/app/lib/outfit-card';
import { BackgroundGenerationMode, buildBackgroundGenerationPlan, generateBackgroundVariations } from '@/app/lib/background-ai';
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
import { MATERIAL_PRESETS, applyFabricMaterialToCard, buildFabricPresetConfig, type FabricMaterialConfig } from '@/app/lib/materialPresets';

type StudioTab = 'color' | 'gradient' | 'ai_artwork';
type GeometryFamily = 'arrows' | 'waves' | 'diamond' | 'mesh' | 'circles' | 'triangles' | 'stars' | 'flowers' | 'beams' | 'panels' | 'mixed';
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

type PresetRuntimeState = {
  hasReferenceImage: boolean;
  hasBrandLogo: boolean;
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
      gradient: { type: 'linear', angle: 135, intensity: 110, stops: [{ color: '#2e1065', position: 0 }, { color: '#7c3aed', position: 55 }, { color: '#a78bfa', position: 100 }] },
      shape: 'orb',
    },
  },
  {
    label: 'Emerald Glow',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'radial', intensity: 115, stops: [{ color: '#6ee7b7', position: 0 }, { color: '#059669', position: 45 }, { color: '#064e3b', position: 100 }] },
      shape: 'mesh',
    },
  },
  {
    label: 'Silver Mist',
    config: {
      background_mode: 'gradient',
      gradient: { type: 'linear', angle: 145, intensity: 95, stops: [{ color: '#64748b', position: 0 }, { color: '#cbd5e1', position: 50 }, { color: '#f1f5f9', position: 100 }] },
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
const TONAL_GEOMETRY_BACKGROUND_IMAGE = `/${encodeURIComponent('Sem título (32).png')}`;
const NEON_MOTION_GRID_IMAGE = '/neongrid.png';
const CURATED_IMAGE_PICKER_OPTIONS = [
  { fileName: 'Sem título (32).png', label: 'Urban Texture Grid' },
  { fileName: 'Sem título (33).png', label: 'Neon Pattern Overlay' },
  { fileName: 'Sem título (34).png', label: 'Editorial Surface III' },
  { fileName: 'Sem título (37).png', label: 'Dark Weave Pattern' },
  { fileName: 'Sem título (36).png', label: 'Premium Tonal Pattern' },
  { fileName: 'Sem título (35).png', label: 'Minimal Canvas Layer' },
  { fileName: 'Fart.png', label: 'Premium Fashion Artwork' },
  { fileName: 'Sem título (25).png', label: 'Abstract Surface' },
  { fileName: '208445B9-82BD-4AC7-863A-B177A4D187B0_4_5005_c.jpeg', label: 'LEGO Mini Logo' },
  { fileName: '642F71E8-FE96-4345-BB4B-0C4203032B5A.png', label: 'Brand Symbol Alpha' },
  { fileName: '6385F3BD-29DE-4841-A3E7-64079EB53F09.png', label: 'Geometric Artwork' },
  { fileName: 'newbirds.jpg', label: 'New Birds' },
  { fileName: 'streetvibes.jpg', label: 'Street Vibes' },
  { fileName: 'flw.jpg', label: 'Fashion Flow' },
  { fileName: 'mfui.jpg', label: 'Modern Fashion UI' },
].map(({ fileName, label }) => ({
  value: `image:${fileName}`,
  label: label || fileName,
  hint: `Applies ${label || fileName} as artwork surface`,
  imageUrl: `/${encodeURIComponent(fileName)}`,
}));
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
const STYLE_PRESET_DESCRIPTIONS: Record<ArtworkStylePreset, string> = {
  editorial_fashion: 'Creates a campaign/editorial fashion composition',
  luxury_minimal: 'Keeps the card elegant, minimal, and premium',
  futuristic_sport: 'Adds motion, tech energy, and performance-driven styling',
  streetwear: 'Creates a bolder, layered, urban visual direction',
  monochrome_premium: 'Focuses on restrained luxury with a controlled tonal palette',
};
const PALETTE_MODES: ArtworkPaletteMode[] = ['monochrome', 'cool_luxury', 'warm_neutral', 'custom'];
const COMPOSITION_TYPES: Array<ArtworkStudioInput['compositionType']> = ['background', 'shape_pack', 'overlay', 'frame'];
const CONTRAST_LEVELS: ArtworkContrastLevel[] = ['low', 'medium', 'high'];
const CONTRAST_LEVEL_DESCRIPTIONS: Record<ArtworkContrastLevel, string> = {
  low: 'Soft contrast with subtle transitions',
  medium: 'Balanced contrast for readability and depth',
  high: 'Strong contrast with bold highlights and separation',
};
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
const AI_GENERATION_MODE_DESCRIPTIONS: Record<BackgroundGenerationMode, string> = {
  preset_assisted: 'Uses preset logic with AI refinement',
  hybrid: 'Combines preset structure with prompt-driven composition',
  text_prompt_pure: 'Uses the written prompt as the main creative driver',
};
const COLOR_INTENT_TO_GRADIENT: Record<ArtworkColorIntent, NonNullable<OutfitBackgroundConfig['gradient']>> = {
  prompt_driven: { type: 'linear', angle: 135, intensity: 100, stops: [{ color: '#0f172a', position: 0 }, { color: '#4c1d95', position: 100 }] },
  cool_blue: { type: 'linear', angle: 130, intensity: 105, stops: [{ color: '#0c1a2e', position: 0 }, { color: '#1d4ed8', position: 55 }, { color: '#0ea5e9', position: 100 }] },
  emerald_luxury: { type: 'radial', angle: 0, intensity: 110, stops: [{ color: '#022c22', position: 0 }, { color: '#065f46', position: 55 }, { color: '#10b981', position: 100 }] },
  sunset_warm: { type: 'linear', angle: 150, intensity: 105, stops: [{ color: '#7c2d12', position: 0 }, { color: '#f97316', position: 60 }, { color: '#fde68a', position: 100 }] },
  mono_chrome: { type: 'linear', angle: 110, intensity: 108, stops: [{ color: '#020617', position: 0 }, { color: '#1e293b', position: 52 }, { color: '#334155', position: 100 }] },
  neon_pop: { type: 'linear', angle: 125, intensity: 110, stops: [{ color: '#1e1b4b', position: 0 }, { color: '#7c3aed', position: 50 }, { color: '#ec4899', position: 100 }] },
};

const PALETTE_MODE_TO_GRADIENT: Record<ArtworkPaletteMode, NonNullable<OutfitBackgroundConfig['gradient']>> = {
  monochrome: { type: 'linear', angle: 110, intensity: 108, stops: [{ color: '#020617', position: 0 }, { color: '#1e293b', position: 52 }, { color: '#334155', position: 100 }] },
  cool_luxury: { type: 'linear', angle: 135, intensity: 100, stops: [{ color: '#0f172a', position: 0 }, { color: '#1e3a8a', position: 55 }, { color: '#0c4a6e', position: 100 }] },
  warm_neutral: { type: 'linear', angle: 125, intensity: 85, stops: [{ color: '#1c1008', position: 0 }, { color: '#8a5c2e', position: 50 }, { color: '#d6c2a5', position: 100 }] },
  custom: { type: 'linear', angle: 135, intensity: 100, stops: [{ color: '#0f172a', position: 0 }, { color: '#4c1d95', position: 100 }] },
};

const COMPOSITION_TYPE_DESCRIPTIONS: Record<NonNullable<ArtworkStudioInput['compositionType']>, string> = {
  background: 'Full canvas surface — fills the entire card background',
  shape_pack: 'Geometry shapes only — transparent SVG pack, no background fill',
  overlay: 'Semi-transparent layer placed over the current background',
  frame: 'Editorial border/frame element around the card edges',
};

const COLOR_INTENT_SWATCHES: Record<ArtworkColorIntent, string> = {
  prompt_driven: 'linear-gradient(135deg, #0f172a, #4c1d95)',
  cool_blue: 'linear-gradient(130deg, #0c1a2e, #1d4ed8, #0ea5e9)',
  emerald_luxury: 'radial-gradient(circle, #022c22, #065f46, #10b981)',
  sunset_warm: 'linear-gradient(150deg, #7c2d12, #f97316, #fde68a)',
  mono_chrome: 'linear-gradient(110deg, #020617, #1e293b, #334155)',
  neon_pop: 'linear-gradient(125deg, #1e1b4b, #7c3aed, #ec4899)',
};

const GEOMETRY_DESCRIPTION_MAP: Record<GeometryFamily, string> = {
  arrows: 'Directional motifs and chevrons with motion guidance',
  waves: 'Flowing curved bands with elegant rhythm',
  diamond: 'Rhombus-based premium angular patterning',
  mesh: 'Tech lattice or woven net-like geometry',
  circles: 'Orbital circular nodes and ring accents',
  triangles: 'Angular triangular tessellation',
  stars: 'Premium star motifs and constellation accents',
  flowers: 'Decorative floral and petal-based patterning',
  beams: 'Linear streaks and luminous directional bars',
  panels: 'Segmented editorial framing blocks',
  mixed: 'Curated multi-geometry composition',
};
const GEOMETRY_PROMPT_MAP: Record<GeometryFamily, string> = {
  arrows: 'directional arrows, chevrons, premium sport vector flows, editorial guidance markers',
  waves: 'flowing wave bands, elegant ripple contours, current-like motion lines, layered drapery curves',
  diamond: 'diamond grid, rhombus tessellation, angular luxury pattern blocks',
  mesh: 'tech mesh, woven lattice, net-like geometric structure, performance fabric geometry',
  circles: 'circular nodes, ring clusters, orbital round accents',
  triangles: 'triangular tiling, angular shards, structured tessellation',
  stars: 'star field accents, luxury constellation geometry, refined celestial motifs',
  flowers: 'floral tile repetition, petal motifs, decorative bloom patterning',
  beams: 'light beams, luminous streak bars, directional editorial bars',
  panels: 'segmented editorial panels, magazine-like rectangular framing',
  mixed: 'controlled combination of two or three compatible geometry systems with premium spacing',
};
const GEOMETRY_NEGATIVE_PROMPT_MAP: Record<GeometryFamily, string> = {
  arrows: 'avoid wave bands, floral curves, soft ripple lines',
  waves: 'avoid arrowheads, rigid chevrons, diamond tiling',
  diamond: 'avoid soft waves, floral petals, random circular blobs',
  mesh: 'avoid floral petals, soft ribbons, starbursts',
  circles: 'avoid chevrons, rigid triangles, diamond tiling',
  triangles: 'avoid rounded ripple bands, floral motifs, circle clusters',
  stars: 'avoid heavy mesh nets, floral petals, rigid chevrons',
  flowers: 'avoid arrows, hard-edged chevrons, rigid grid shards',
  beams: 'avoid floral motifs, wave drapery lines, circular bubble clusters',
  panels: 'avoid organic wave ribbons, floral petals, random star clutter',
  mixed: 'avoid random clutter and incompatible geometry stacking',
};
const GEOMETRY_VARIATION_MAP: Record<GeometryFamily, string[]> = {
  arrows: ['layered sport arrows', 'angular chevrons', 'editorial directional markers', 'premium velocity vectors'],
  waves: ['soft luxury wave bands', 'rippling contour lines', 'ocean-current fashion curves', 'layered motion drapery lines'],
  diamond: ['monogram-like rhombus pattern', 'luxury diamond tessellation', 'subtle beveled diamond grid', 'sharp editorial diamond structure'],
  mesh: ['metallic mesh', 'woven performance mesh', 'luminous tech lattice', 'sport net geometry'],
  circles: ['orbital ring stacks', 'premium node halos', 'circular pulse clusters', 'editorial radial circles'],
  triangles: ['triangular panel shards', 'premium tessellated facets', 'angular sport triangles', 'structured pyramid tiling'],
  stars: ['constellation clusters', 'premium star trails', 'subtle luxury star accents', 'editorial celestial dots'],
  flowers: ['petal tile repeat', 'fashion bloom surface', 'ornamental floral geometry', 'soft decorative petals'],
  beams: ['diagonal light streaks', 'vertical luminous bars', 'editorial beam framing', 'premium glow beams'],
  panels: ['offset editorial blocks', 'magazine segmentation', 'rectangular framing grids', 'modular premium panels'],
  mixed: ['diamond + beams', 'mesh + circles', 'panels + arrows'],
};
const GEOMETRY_TO_SHAPE_LANGUAGE: Record<GeometryFamily, ArtworkShapeLanguage> = {
  arrows: 'panels',
  waves: 'orb',
  diamond: 'diamond',
  mesh: 'mesh',
  circles: 'orb',
  triangles: 'diamond',
  stars: 'mixed',
  flowers: 'mixed',
  beams: 'panels',
  panels: 'panels',
  mixed: 'mixed',
};
const GEOMETRY_TO_BACKGROUND_SHAPE: Record<GeometryFamily, NonNullable<OutfitBackgroundConfig['shape']>> = {
  arrows: 'arrows',
  waves: 'waves',
  diamond: 'diamond',
  mesh: 'mesh',
  circles: 'circles',
  triangles: 'triangles',
  stars: 'stars',
  flowers: 'flowers',
  beams: 'beams',
  panels: 'none',
  mixed: 'none',
};

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

function normalizeSvgDataUrl(source: string): string {
  if (!source.startsWith('data:image/svg+xml;utf8,')) return source;
  const encoded = source.split(',', 2)[1] ?? '';
  const svg = decodeURIComponent(encoded);
  const bytes = new TextEncoder().encode(svg);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return `data:image/svg+xml;base64,${btoa(binary)}`;
}

function buildDefaultVariations(count: number): ArtworkVariation[] {
  const configs: Array<{ geometry: GeometryFamily; color: string; variant: 0 | 1 | 2 }> = [
    { geometry: 'circles',   color: '#6d28d9', variant: 0 },
    { geometry: 'stars',     color: '#1d4ed8', variant: 1 },
    { geometry: 'waves',     color: '#0891b2', variant: 0 },
    { geometry: 'arrows',    color: '#d97706', variant: 2 },
    { geometry: 'diamond',   color: '#059669', variant: 1 },
    { geometry: 'triangles', color: '#b91c1c', variant: 0 },
    { geometry: 'mesh',      color: '#475569', variant: 2 },
  ];
  return Array.from({ length: count }, (_, i) => {
    const { geometry, color, variant } = configs[i % configs.length];
    const svgUrl = buildGeometryVariantSvg(geometry, variant, color);
    return {
      variation_id: `default_${i + 1}_${geometry}`,
      preview_url: svgUrl,
      output_url: svgUrl,
      thumbnail_url: svgUrl,
      provider: 'procedural' as const,
      provider_job_id: null,
      provider_model: `svg-${geometry}-v${variant}`,
      metadata: { seed: i, fallback: true, geometry },
    } satisfies ArtworkVariation;
  });
}

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

type ColorTokens = { light: string; mid: string; dark: string };
const COLOR_KEYWORD_MAP: Record<string, ColorTokens> = {
  amarelo:  { light: '#fef9c3', mid: '#eab308', dark: '#713f12' },
  dourado:  { light: '#fef3c7', mid: '#d97706', dark: '#78350f' },
  laranja:  { light: '#ffedd5', mid: '#f97316', dark: '#7c2d12' },
  vermelho: { light: '#fee2e2', mid: '#ef4444', dark: '#7f1d1d' },
  rosa:     { light: '#fce7f3', mid: '#ec4899', dark: '#831843' },
  roxo:     { light: '#f3e8ff', mid: '#a855f7', dark: '#3b0764' },
  violeta:  { light: '#ede9fe', mid: '#8b5cf6', dark: '#2e1065' },
  azul:     { light: '#dbeafe', mid: '#3b82f6', dark: '#1e3a5f' },
  ciano:    { light: '#cffafe', mid: '#06b6d4', dark: '#164e63' },
  verde:    { light: '#dcfce7', mid: '#22c55e', dark: '#14532d' },
  branco:   { light: '#f8fafc', mid: '#e2e8f0', dark: '#94a3b8' },
  cinza:    { light: '#f1f5f9', mid: '#64748b', dark: '#1e293b' },
  preto:    { light: '#334155', mid: '#1e293b', dark: '#020617' },
  prata:    { light: '#f8fafc', mid: '#94a3b8', dark: '#334155' },
  yellow:   { light: '#fef9c3', mid: '#eab308', dark: '#713f12' },
  gold:     { light: '#fef3c7', mid: '#d97706', dark: '#78350f' },
  orange:   { light: '#ffedd5', mid: '#f97316', dark: '#7c2d12' },
  red:      { light: '#fee2e2', mid: '#ef4444', dark: '#7f1d1d' },
  pink:     { light: '#fce7f3', mid: '#ec4899', dark: '#831843' },
  purple:   { light: '#f3e8ff', mid: '#a855f7', dark: '#3b0764' },
  violet:   { light: '#ede9fe', mid: '#8b5cf6', dark: '#2e1065' },
  blue:     { light: '#dbeafe', mid: '#3b82f6', dark: '#1e3a5f' },
  cyan:     { light: '#cffafe', mid: '#06b6d4', dark: '#164e63' },
  green:    { light: '#dcfce7', mid: '#22c55e', dark: '#14532d' },
  white:    { light: '#f8fafc', mid: '#e2e8f0', dark: '#94a3b8' },
  gray:     { light: '#f1f5f9', mid: '#64748b', dark: '#1e293b' },
  grey:     { light: '#f1f5f9', mid: '#64748b', dark: '#1e293b' },
  black:    { light: '#334155', mid: '#1e293b', dark: '#020617' },
  silver:   { light: '#f8fafc', mid: '#94a3b8', dark: '#334155' },
};

function detectColorFromPrompt(prompt: string): ColorTokens | null {
  const normalized = prompt.toLowerCase().trim();
  for (const [keyword, tokens] of Object.entries(COLOR_KEYWORD_MAP)) {
    if (normalized.includes(keyword)) return tokens;
  }
  return null;
}

function buildColorGradientVariations(t: ColorTokens): OutfitBackgroundConfig[] {
  const g = (angle: number, stops: Array<{ color: string; position: number }>, type: 'linear' | 'radial' = 'linear'): OutfitBackgroundConfig => ({
    background_mode: 'gradient',
    gradient: { type, angle, intensity: 100, stops },
  });
  return [
    g(135, [{ color: t.light, position: 0 }, { color: t.mid,  position: 100 }]),
    g(145, [{ color: t.dark,  position: 0 }, { color: t.mid,  position: 100 }]),
    g(0,   [{ color: t.mid,   position: 0 }, { color: t.dark, position: 100 }], 'radial'),
    g(60,  [{ color: t.light, position: 0 }, { color: t.mid,  position: 50 }, { color: t.dark,  position: 100 }]),
    g(180, [{ color: '#020617', position: 0 }, { color: t.dark, position: 40 }, { color: t.mid, position: 100 }]),
    g(120, [{ color: t.light, position: 0 }, { color: '#0f172a', position: 100 }]),
  ];
}

function detectGeometryFromPrompt(prompt: string): GeometryFamily | null {
  const normalized = prompt.toLowerCase();
  const entries: Array<{ geometry: GeometryFamily; aliases: string[] }> = [
    { geometry: 'arrows', aliases: ['arrow', 'arrows', 'chevron', 'chevrons', 'seta', 'setas', 'flecha', 'flechas'] },
    { geometry: 'waves', aliases: ['wave', 'waves', 'ripple', 'ripples', 'onda', 'ondas'] },
    { geometry: 'diamond', aliases: ['diamond', 'rhombus', 'diamante', 'losango'] },
    { geometry: 'mesh', aliases: ['mesh', 'lattice', 'net', 'malha', 'rede', 'grade'] },
    { geometry: 'circles', aliases: ['circle', 'circles', 'orbital', 'ring', 'circulo', 'circulos', 'anel', 'aneis'] },
    { geometry: 'triangles', aliases: ['triangle', 'triangles', 'triangulo', 'triangulos'] },
    { geometry: 'stars', aliases: ['star', 'stars', 'constellation', 'estrela', 'estrelas'] },
    { geometry: 'flowers', aliases: ['flower', 'flowers', 'petal', 'floral', 'flor', 'flores'] },
    { geometry: 'beams', aliases: ['beam', 'beams', 'streak', 'streaks', 'raio', 'raios', 'feixe', 'feixes'] },
    { geometry: 'panels', aliases: ['panel', 'panels', 'editorial block', 'segmented', 'painel', 'paineis'] },
    { geometry: 'mixed', aliases: ['mixed', 'hybrid geometry', 'misto', 'hibrido'] },
  ];
  const match = entries.find((entry) => entry.aliases.some((alias) => normalized.includes(alias)));
  return match?.geometry || null;
}

function buildGeometryVariantSvg(geometry: GeometryFamily, variant: 0 | 1 | 2, baseColor: string): string {
  const base = `<rect width='1200' height='800' fill='${baseColor}' opacity='0.92'/><rect width='1200' height='800' fill='#020617' opacity='0.30'/>`;

  const starPoly = (cx: number, cy: number, n: number, R: number, r: number, fill: string, stroke?: string, opacity = 0.85): string => {
    const pts = Array.from({ length: n * 2 }, (_, i) => {
      const ang = ((i * 180) / n - 90) * (Math.PI / 180);
      const rad = i % 2 === 0 ? R : r;
      return `${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`;
    }).join(' ');
    return `<polygon points='${pts}' fill='${fill}' ${stroke ? `stroke='${stroke}' stroke-width='2.5'` : ''} opacity='${opacity}'/>`;
  };

  const solidArrow = (x: number, y: number, w: number, h: number): string => {
    const notch = h * 0.28;
    return `<path d='M${x},${y + notch} L${x + w * 0.68},${y + notch} L${x + w * 0.68},${y} L${x + w},${y + h / 2} L${x + w * 0.68},${y + h} L${x + w * 0.68},${y + h - notch} L${x},${y + h - notch} Z' fill='rgba(226,232,240,0.28)' stroke='rgba(226,232,240,0.58)' stroke-width='1.5'/>`;
  };

  let markup = '';

  switch (geometry) {
    case 'circles':
      if (variant === 0) {
        // Concentric rings at multiple focal points
        markup = (
          [[240, 200, [44, 96, 158, 228]], [860, 330, [58, 116, 184, 262]], [1080, 90, [36, 78, 130]],
           [70, 610, [42, 92, 152]], [630, 660, [64, 128, 200, 280]]] as [number, number, number[]][]
        ).flatMap(([cx, cy, radii]) =>
          radii.map((rr, i) =>
            `<circle cx='${cx}' cy='${cy}' r='${rr}' fill='none' stroke='rgba(226,232,240,${(0.62 - i * 0.11).toFixed(2)})' stroke-width='${Math.max(0.8, 4.2 - i * 0.8).toFixed(1)}'/>`
          )
        ).join('');
      } else if (variant === 1) {
        // Uniform dot grid (staggered rows)
        markup = Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 12 }, (__, col) => {
            const stagger = row % 2 === 1 ? 55 : 0;
            const r = row % 2 === 0 ? 18 : 28;
            return `<circle cx='${50 + col * 110 + stagger}' cy='${55 + row * 118}' r='${r}' fill='rgba(226,232,240,${row % 2 === 0 ? 0.55 : 0.30})'/>`;
          }).join('')
        ).join('');
      } else {
        // Overlapping circle outlines of varied sizes
        markup = (
          [{ cx: 180, cy: 180, r: 130 }, { cx: 490, cy: 305, r: 185 }, { cx: 770, cy: 135, r: 105 },
           { cx: 1010, cy: 385, r: 165 }, { cx: 155, cy: 585, r: 92 }, { cx: 590, cy: 655, r: 145 },
           { cx: 960, cy: 655, r: 105 }, { cx: 345, cy: 710, r: 72 }, { cx: 1140, cy: 155, r: 84 }] as { cx: number; cy: number; r: number }[]
        ).map(({ cx, cy, r }) =>
          `<circle cx='${cx}' cy='${cy}' r='${r}' fill='none' stroke='rgba(226,232,240,0.50)' stroke-width='3'/><circle cx='${cx}' cy='${cy}' r='${Math.round(r * 0.52)}' fill='none' stroke='rgba(226,232,240,0.22)' stroke-width='1.5'/>`
        ).join('');
      }
      break;

    case 'stars':
      if (variant === 0) {
        // 5-pointed classic stars, filled grid
        markup = Array.from({ length: 18 }, (_, i) => {
          const cx = 90 + (i % 6) * 196;
          const cy = 112 + Math.floor(i / 6) * 242;
          return starPoly(cx, cy, 5, 46, 20, 'rgba(248,250,252,0.55)');
        }).join('');
      } else if (variant === 1) {
        // 8-pointed geometric stars, outline style
        markup = Array.from({ length: 12 }, (_, i) => {
          const cx = 110 + (i % 4) * 286;
          const cy = 140 + Math.floor(i / 4) * 242;
          return [
            starPoly(cx, cy, 8, 58, 25, 'none', 'rgba(226,232,240,0.65)', 1),
            starPoly(cx, cy, 8, 33, 15, 'rgba(226,232,240,0.20)', undefined, 0.8),
          ].join('');
        }).join('');
      } else {
        // 4-pointed sparkle (cross) stars, varying sizes
        markup = Array.from({ length: 20 }, (_, i) => {
          const cx = 60 + (i % 5) * 242;
          const cy = 88 + Math.floor(i / 5) * 172;
          const sz = i % 3 === 0 ? 48 : i % 3 === 1 ? 34 : 24;
          return starPoly(cx, cy, 4, sz, Math.round(sz * 0.13), 'rgba(248,250,252,0.58)');
        }).join('');
      }
      break;

    case 'arrows':
      if (variant === 0) {
        // Horizontal chevrons stacked (sport style)
        markup = Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 7 }, (__, col) =>
            `<path d='M${38 + col * 182},${66 + row * 150} L${148 + col * 182},${141 + row * 150} L${38 + col * 182},${216 + row * 150}' stroke='rgba(248,250,252,0.50)' stroke-width='22' fill='none' stroke-linejoin='round' stroke-linecap='round'/>`
          ).join('')
        ).join('');
      } else if (variant === 1) {
        // Solid right-pointing arrow blocks in grid
        markup = Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 6 }, (__, col) =>
            solidArrow(50 + col * 205, 75 + row * 185, 130, 108)
          ).join('')
        ).join('');
      } else {
        // Double chevron outlines
        markup = Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 6 }, (__, col) => {
            const x = 55 + col * 204;
            const y = 88 + row * 148;
            return [
              `<path d='M${x},${y} L${x + 72},${y + 74} L${x},${y + 148}' stroke='rgba(226,232,240,0.65)' stroke-width='18' fill='none' stroke-linejoin='round'/>`,
              `<path d='M${x + 46},${y} L${x + 118},${y + 74} L${x + 46},${y + 148}' stroke='rgba(226,232,240,0.30)' stroke-width='12' fill='none' stroke-linejoin='round'/>`,
            ].join('');
          }).join('')
        ).join('');
      }
      break;

    case 'waves':
      if (variant === 0) {
        // Classic horizontal sine waves
        markup = Array.from({ length: 7 }, (_, i) =>
          `<path d='M-40,${120 + i * 92} C180,${80 + i * 92} 360,${170 + i * 92} 560,${132 + i * 92} C760,${95 + i * 92} 950,${186 + i * 92} 1240,${142 + i * 92}' stroke='rgba(226,232,240,0.45)' stroke-width='12' fill='none'/>`
        ).join('');
      } else if (variant === 1) {
        // Concentric arch waves from bottom center
        markup = Array.from({ length: 10 }, (_, i) => {
          const r = 128 + i * 84;
          return `<circle cx='600' cy='900' r='${r}' fill='none' stroke='rgba(226,232,240,${(0.56 - i * 0.044).toFixed(3)})' stroke-width='${Math.max(2, 13 - i)}'/>`;
        }).join('');
      } else {
        // Diagonal wave bands (chevron fill)
        markup = Array.from({ length: 7 }, (_, i) => {
          const off = i * 190 - 200;
          return `<path d='M${off},800 C${off + 300},350 ${off + 500},350 ${off + 800},0 L${off + 880},0 C${off + 580},350 ${off + 380},350 ${off + 80},800 Z' fill='rgba(226,232,240,${i % 2 === 0 ? 0.15 : 0.08})'/>`;
        }).join('');
      }
      break;

    case 'diamond':
      if (variant === 0) {
        // Classic tiled diamonds
        markup = Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 9 }, (__, col) =>
            `<path d='M${65 + col * 132},${86 + row * 118} L${118 + col * 132},${142 + row * 118} L${65 + col * 132},${198 + row * 118} L${12 + col * 132},${142 + row * 118} Z' fill='rgba(226,232,240,0.24)'/>`
          ).join('')
        ).join('');
      } else if (variant === 1) {
        // Nested diamonds (outer + inner outline)
        markup = Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 7 }, (__, col) => {
            const cx = 86 + col * 172;
            const cy = 100 + row * 150;
            return [
              `<path d='M${cx},${cy - 58} L${cx + 54},${cy} L${cx},${cy + 58} L${cx - 54},${cy} Z' fill='rgba(226,232,240,0.18)' stroke='rgba(226,232,240,0.50)' stroke-width='2'/>`,
              `<path d='M${cx},${cy - 30} L${cx + 28},${cy} L${cx},${cy + 30} L${cx - 28},${cy} Z' fill='none' stroke='rgba(226,232,240,0.62)' stroke-width='1.5'/>`,
            ].join('');
          }).join('')
        ).join('');
      } else {
        // Rotated squares (45°) staggered grid
        markup = Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 8 }, (__, col) => {
            const cx = 76 + col * 157 + (row % 2 === 1 ? 79 : 0);
            const cy = 80 + row * 152;
            return `<rect x='${cx - 46}' y='${cy - 46}' width='92' height='92' fill='rgba(226,232,240,0.16)' stroke='rgba(226,232,240,0.52)' stroke-width='2' transform='rotate(45 ${cx} ${cy})'/>`;
          }).join('')
        ).join('');
      }
      break;

    case 'triangles':
      if (variant === 0) {
        // Upward pointing triangles grid
        markup = Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 10 }, (__, col) =>
            `<path d='M${30 + col * 120},${190 + row * 90} L${90 + col * 120},${70 + row * 90} L${150 + col * 120},${190 + row * 90} Z' fill='rgba(203,213,225,0.30)'/>`
          ).join('')
        ).join('');
      } else if (variant === 1) {
        // Tessellation: alternating up/down triangles
        markup = Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 10 }, (__, col) => {
            const up = (row + col) % 2 === 0;
            const x = col * 122;
            const y = row * 108;
            return up
              ? `<path d='M${x + 61},${y + 4} L${x + 122},${y + 108} L${x},${y + 108} Z' fill='rgba(203,213,225,0.32)'/>`
              : `<path d='M${x},${y + 4} L${x + 122},${y + 4} L${x + 61},${y + 108} Z' fill='rgba(203,213,225,0.18)'/>`;
          }).join('')
        ).join('');
      } else {
        // Large editorial concentric triangles
        markup = [
          `<path d='M600,28 L1185,795 L15,795 Z' fill='none' stroke='rgba(226,232,240,0.38)' stroke-width='3'/>`,
          `<path d='M600,172 L1055,752 L145,752 Z' fill='none' stroke='rgba(226,232,240,0.24)' stroke-width='2'/>`,
          `<path d='M600,316 L925,710 L275,710 Z' fill='none' stroke='rgba(226,232,240,0.14)' stroke-width='1.5'/>`,
          `<path d='M600,460 L795,668 L405,668 Z' fill='rgba(226,232,240,0.08)'/>`,
          `<path d='M140,48 L380,445 L-100,445 Z' fill='rgba(226,232,240,0.10)'/>`,
          `<path d='M1060,48 L1300,445 L820,445 Z' fill='rgba(226,232,240,0.10)'/>`,
        ].join('');
      }
      break;

    case 'flowers':
      if (variant === 0) {
        // 4-petal flowers (original)
        markup = Array.from({ length: 12 }, (_, i) => `<g transform='translate(${80 + (i % 4) * 280} ${96 + Math.floor(i / 4) * 220})'><circle cx='50' cy='52' r='14' fill='rgba(253,230,138,0.8)'/><ellipse cx='50' cy='24' rx='14' ry='24' fill='rgba(244,114,182,0.48)'/><ellipse cx='78' cy='52' rx='14' ry='24' fill='rgba(244,114,182,0.48)' transform='rotate(90 78 52)'/><ellipse cx='50' cy='80' rx='14' ry='24' fill='rgba(244,114,182,0.48)'/><ellipse cx='22' cy='52' rx='14' ry='24' fill='rgba(244,114,182,0.48)' transform='rotate(90 22 52)'/></g>`).join('');
      } else if (variant === 1) {
        // 6-petal flowers
        markup = Array.from({ length: 9 }, (_, i) => {
          const cx = 100 + (i % 3) * 360;
          const cy = 130 + Math.floor(i / 3) * 244;
          const petals = Array.from({ length: 6 }, (__, p) =>
            `<ellipse cx='${cx}' cy='${cy - 46}' rx='17' ry='40' fill='rgba(244,114,182,0.42)' transform='rotate(${p * 60} ${cx} ${cy})'/>`,
          ).join('');
          return `${petals}<circle cx='${cx}' cy='${cy}' r='20' fill='rgba(253,230,138,0.78)'/>`;
        }).join('');
      } else {
        // Dot-petal flowers (minimalist)
        markup = Array.from({ length: 12 }, (_, i) => {
          const cx = 80 + (i % 4) * 286;
          const cy = 100 + Math.floor(i / 4) * 222;
          const dots = Array.from({ length: 8 }, (__, p) => {
            const ang = p * 45 * (Math.PI / 180);
            return `<circle cx='${(cx + Math.cos(ang) * 46).toFixed(1)}' cy='${(cy + Math.sin(ang) * 46).toFixed(1)}' r='13' fill='rgba(244,114,182,0.52)'/>`;
          }).join('');
          return `${dots}<circle cx='${cx}' cy='${cy}' r='15' fill='rgba(253,230,138,0.82)'/>`;
        }).join('');
      }
      break;

    case 'mesh':
      if (variant === 0) {
        // Diagonal line mesh (original)
        markup = Array.from({ length: 18 }, (_, i) => `<line x1='${i * 70}' y1='0' x2='${i * 70 + 200}' y2='800' stroke='rgba(148,163,184,0.30)'/>`).join('')
          + Array.from({ length: 10 }, (_, i) => `<line x1='0' y1='${i * 90}' x2='1200' y2='${i * 90 + 90}' stroke='rgba(226,232,240,0.24)'/>`).join('');
      } else if (variant === 1) {
        // Hexagonal mesh
        markup = Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 9 }, (__, col) => {
            const cx = 60 + col * 162 + (row % 2 === 1 ? 81 : 0);
            const cy = 58 + row * 142;
            const R = 72;
            const pts = Array.from({ length: 6 }, (___, k) => {
              const ang = (k * 60 - 30) * (Math.PI / 180);
              return `${(cx + R * Math.cos(ang)).toFixed(0)},${(cy + R * Math.sin(ang)).toFixed(0)}`;
            }).join(' ');
            return `<polygon points='${pts}' fill='none' stroke='rgba(148,163,184,0.42)' stroke-width='2'/>`;
          }).join('')
        ).join('');
      } else {
        // Square grid
        markup = [
          ...Array.from({ length: 19 }, (_, i) => `<line x1='${i * 65}' y1='0' x2='${i * 65}' y2='800' stroke='rgba(148,163,184,0.26)' stroke-width='1'/>`),
          ...Array.from({ length: 13 }, (_, i) => `<line x1='0' y1='${i * 65}' x2='1200' y2='${i * 65}' stroke='rgba(148,163,184,0.26)' stroke-width='1'/>`),
        ].join('');
      }
      break;

    case 'beams':
      if (variant === 0) {
        // Diagonal beams (original)
        markup = Array.from({ length: 12 }, (_, i) => `<rect x='${i * 110}' y='0' width='24' height='800' fill='rgba(56,189,248,0.25)' transform='rotate(11 ${i * 110} 0)'/>`).join('');
      } else if (variant === 1) {
        // Radial beams from center
        markup = Array.from({ length: 16 }, (_, i) => {
          const ang = i * 22.5 * (Math.PI / 180);
          const x2 = (600 + Math.cos(ang) * 820).toFixed(0);
          const y2 = (400 + Math.sin(ang) * 820).toFixed(0);
          return `<line x1='600' y1='400' x2='${x2}' y2='${y2}' stroke='rgba(56,189,248,${i % 2 === 0 ? 0.32 : 0.18})' stroke-width='${i % 2 === 0 ? 6 : 3}'/>`;
        }).join('') + `<circle cx='600' cy='400' r='44' fill='rgba(56,189,248,0.20)'/>`;
      } else {
        // Cross-hatch diagonals
        markup = [
          ...Array.from({ length: 14 }, (_, i) => `<line x1='${i * 100}' y1='0' x2='${i * 100 + 800}' y2='800' stroke='rgba(56,189,248,0.22)' stroke-width='4'/>`),
          ...Array.from({ length: 14 }, (_, i) => `<line x1='${i * 100}' y1='800' x2='${i * 100 + 800}' y2='0' stroke='rgba(56,189,248,0.14)' stroke-width='2'/>`),
        ].join('');
      }
      break;

    case 'panels':
      if (variant === 0) {
        // Rectangle panels grid (original)
        markup = Array.from({ length: 8 }, (_, i) => `<rect x='${40 + (i % 4) * 280}' y='${70 + Math.floor(i / 4) * 330}' width='240' height='300' rx='24' fill='rgba(226,232,240,0.20)' stroke='rgba(226,232,240,0.42)'/>`).join('');
      } else if (variant === 1) {
        // Horizontal stripe panels
        markup = Array.from({ length: 6 }, (_, i) =>
          `<rect x='${40 + (i % 2 === 1 ? 84 : 0)}' y='${58 + i * 122}' width='${1120 - (i % 2 === 1 ? 84 : 0)}' height='82' rx='18' fill='rgba(226,232,240,${i % 2 === 0 ? 0.18 : 0.10})' stroke='rgba(226,232,240,0.36)' stroke-width='1'/>`
        ).join('');
      } else {
        // Diagonal sweep panels
        markup = Array.from({ length: 5 }, (_, i) => {
          const off = i * 264 - 200;
          return `<path d='M${off},800 C${off + 300},350 ${off + 500},350 ${off + 800},0 L${off + 880},0 C${off + 580},350 ${off + 380},350 ${off + 80},800 Z' fill='rgba(226,232,240,${i % 2 === 0 ? 0.17 : 0.09})'/>`;
        }).join('');
      }
      break;

    case 'mixed':
    default:
      markup = `<g opacity='0.72'>${Array.from({ length: 8 }, (_, i) => `<line x1='${i * 150}' y1='0' x2='${i * 150 + 150}' y2='800' stroke='rgba(56,189,248,0.22)'/>`).join('')}${Array.from({ length: 8 }, (_, i) => `<circle cx='${120 + i * 130}' cy='${220 + ((i % 3) * 120)}' r='26' stroke='rgba(248,250,252,0.42)' fill='none'/>`).join('')}</g>`;
      break;
  }

  return asDataUri(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>${base}${markup}<rect width='1200' height='800' fill='rgba(2,6,23,0.20)'/></svg>`);
}

function buildLocalGeometryVariations(geometry: GeometryFamily, heroColor: string): ArtworkVariation[] {
  const variantLabels = ['V1', 'V2', 'V3'];
  return ([0, 1, 2] as const).map((variant) => {
    const svgUrl = buildGeometryVariantSvg(geometry, variant, heroColor);
    return {
      variation_id: `local_${geometry}_v${variant}_${Date.now() + variant}`,
      preview_url: svgUrl,
      output_url: svgUrl,
      thumbnail_url: svgUrl,
      provider: 'procedural' as const,
      provider_job_id: null,
      provider_model: `svg-${geometry}-${variantLabels[variant]}`,
      metadata: { source: 'local_geometry', geometry, variant },
    } satisfies ArtworkVariation;
  });
}

function buildGeometryPreviewConfig(geometry: GeometryFamily, heroColor: string): OutfitBackgroundConfig {
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${geometry} deterministic preview`,
      image_url: buildGeometryVariantSvg(geometry, 0, heroColor),
      generation_status: 'done',
    },
    gradient: {
      type: 'linear',
      angle: 130,
      intensity: 100,
      stops: [{ color: '#0f172a', position: 0 }, { color: heroColor, position: 100 }],
    },
    shape: GEOMETRY_TO_BACKGROUND_SHAPE[geometry],
  };
}

// MotifSeed is kept as-is — still used by extractMotifSeed and compositeMotifSurface.
type MotifSeed = {
  source: string;
  aspectRatio: number;
  dominantColor: string;
  brandName: string;
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

function createLogoTile(image: HTMLImageElement, tileW: number, tileH: number): HTMLCanvasElement {
  const tileCanvas = createOffscreenCanvas(tileW, tileH);
  if (!tileCanvas) throw new Error('canvas_unavailable');
  const tileCtx = tileCanvas.getContext('2d');
  if (!tileCtx) throw new Error('canvas_context_unavailable');
  const scale = Math.min(tileW / image.naturalWidth, tileH / image.naturalHeight);
  const drawW = image.naturalWidth * scale;
  const drawH = image.naturalHeight * scale;
  tileCtx.clearRect(0, 0, tileW, tileH);
  tileCtx.drawImage(image, (tileW - drawW) / 2, (tileH - drawH) / 2, drawW, drawH);
  return tileCanvas;
}

function renderPreciseMotifGrid(
  ctx: CanvasRenderingContext2D,
  tileCanvas: HTMLCanvasElement,
  logoW: number,
  logoH: number,
  canvasW: number,
  canvasH: number,
  mode: 'grid' | 'staggered',
) {
  const cols = Math.ceil(canvasW / logoW) + (mode === 'staggered' ? 1 : 0);
  const rows = Math.ceil(canvasH / logoH) + 1;
  const safeX2 = 680;
  const safeY2 = 460;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const stagger = mode === 'staggered' && row % 2 === 1 ? -Math.round(logoW * 0.5) : 0;
      const x = col * logoW + stagger;
      const y = row * logoH;
      const inSafe = x + logoW / 2 <= safeX2 && y + logoH / 2 <= safeY2;
      ctx.globalAlpha = inSafe ? 0.18 : 0.58;
      ctx.drawImage(tileCanvas, x, y, logoW, logoH);
    }
  }
  ctx.globalAlpha = 1;
}

async function buildTiledMotifFromReferenceImage(
  referenceImage: string,
  context: PresetContext,
  baseGradient?: OutfitBackgroundConfig['gradient'],
): Promise<OutfitBackgroundConfig> {
  const image = await loadImageFromSource(referenceImage);
  const CW = 1200;
  const CH = 800;
  const ratio = image.naturalWidth / Math.max(1, image.naturalHeight);
  const targetCols = ratio > 2 ? 6 : ratio < 0.5 ? 10 : 8;
  const logoW = Math.round(CW / targetCols);
  const logoH = Math.max(24, Math.round(logoW / Math.max(0.25, ratio)));
  const canvas = createOffscreenCanvas(CW, CH);
  if (!canvas) throw new Error('canvas_unavailable');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas_context_unavailable');
  const bgGradient = ctx.createLinearGradient(0, 0, CW, CH);
  const gradientStops = baseGradient?.stops?.length
    ? baseGradient.stops
    : [{ color: '#020617', position: 0 }, { color: '#0f172a', position: 50 }, { color: context.heroColor, position: 100 }];
  gradientStops.forEach((s) => bgGradient.addColorStop(Math.min(1, Math.max(0, s.position / 100)), s.color));
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, CW, CH);
  const tileCanvas = createLogoTile(image, logoW, logoH);
  renderPreciseMotifGrid(ctx, tileCanvas, logoW, logoH, CW, CH, 'staggered');
  // Safe area vignette
  const vigGrad = ctx.createRadialGradient(0, 0, 10, 300, 220, 600);
  vigGrad.addColorStop(0, 'rgba(2,6,23,0.72)');
  vigGrad.addColorStop(0.6, 'rgba(2,6,23,0.24)');
  vigGrad.addColorStop(1, 'rgba(2,6,23,0)');
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, 680, 460);
  ctx.fillStyle = 'rgba(2,6,23,0.08)';
  ctx.fillRect(0, 0, CW, CH);
  const outputUrl = canvas.toDataURL('image/png');
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} precise staggered motif grid — canvas render`,
      image_url: outputUrl,
      generation_status: 'done',
    },
    shape: 'none',
    texture_overlay: false,
    gradient: baseGradient || {
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


function extractMotifSeed(referenceImage: string, context: PresetContext, imageAspectRatio = 1): MotifSeed {
  return {
    source: referenceImage,
    aspectRatio: Number.isFinite(imageAspectRatio) && imageAspectRatio > 0 ? imageAspectRatio : 1,
    dominantColor: context.heroColor,
    brandName: context.brandName,
  };
}

function compositeMotifSurface(
  motifSeed: MotifSeed,
  mode: 'grid' | 'staggered' | 'diagonal',
  baseGradient?: OutfitBackgroundConfig['gradient'],
): string {
  const CW = 1200;
  const CH = 800;
  const ar = Math.max(0.25, Math.min(4, motifSeed.aspectRatio));
  // Choose columns so each logo is ~100-160px wide
  const targetCols = ar > 2 ? 6 : ar < 0.5 ? 10 : 8;
  const logoW = Math.round(CW / targetCols);
  const logoH = Math.max(24, Math.round(logoW / ar));
  const baseCols = targetCols + (mode === 'staggered' ? 1 : mode === 'diagonal' ? 3 : 0);
  const baseRows = Math.ceil(CH / logoH) + (mode === 'staggered' ? 1 : 1);
  const safeX2 = 680;
  const safeY2 = 460;
  const tiles: string[] = [];
  for (let row = 0; row < baseRows; row++) {
    for (let col = 0; col < baseCols; col++) {
      let x = col * logoW;
      const y = row * logoH;
      if (mode === 'staggered' && row % 2 === 1) x -= Math.round(logoW * 0.5);
      if (mode === 'diagonal') x -= row * Math.round(logoW * 0.22);
      const cx = x + logoW / 2;
      const cy = y + logoH / 2;
      const inSafe = cx >= 0 && cx <= safeX2 && cy >= 0 && cy <= safeY2;
      const opacity = inSafe ? 0.14 : 0.52;
      tiles.push(
        `<image href='${motifSeed.source}' x='${Math.round(x)}' y='${Math.round(y)}' width='${logoW}' height='${logoH}' preserveAspectRatio='xMidYMid meet' opacity='${opacity}'/>`,
      );
    }
  }
  const gradientStops = baseGradient?.stops?.length
    ? baseGradient.stops
    : [{ color: '#020617', position: 0 }, { color: '#0f172a', position: 50 }, { color: motifSeed.dominantColor, position: 100 }];
  const stopMarkup = gradientStops.map((s) => `<stop offset='${Math.min(100, Math.max(0, s.position))}%' stop-color='${s.color}'/>`).join('');
  return asDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${CW}' height='${CH}'>
      <defs>
        <linearGradient id='surface' x1='0%' y1='0%' x2='100%' y2='100%'>${stopMarkup}</linearGradient>
        <radialGradient id='safeVignette' cx='28%' cy='26%' r='46%'>
          <stop offset='0%' stop-color='rgba(2,6,23,0.75)'/>
          <stop offset='65%' stop-color='rgba(2,6,23,0.28)'/>
          <stop offset='100%' stop-color='rgba(2,6,23,0)'/>
        </radialGradient>
      </defs>
      <rect width='${CW}' height='${CH}' fill='url(#surface)'/>
      ${tiles.join('')}
      <rect width='${safeX2}' height='${safeY2}' fill='url(#safeVignette)'/>
      <rect width='${CW}' height='${CH}' fill='rgba(2,6,23,0.08)'/>
      <text x='68' y='764' font-size='18' font-family='Inter,Arial,sans-serif' fill='rgba(148,163,184,0.50)' letter-spacing='3'>${escapeSvgAttribute(motifSeed.brandName.toUpperCase())}</text>
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
  const modes: Array<'grid' | 'staggered' | 'diagonal'> = ['grid', 'staggered', 'diagonal'];
  const mode = modes[Math.abs(context.brandName.length) % modes.length];
  const tiledBrandSurface = compositeMotifSurface(motifSeed, mode, baseGradient);
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} precise ${mode} motif grid — ${motifSeed.aspectRatio.toFixed(2)} aspect ratio`,
      image_url: tiledBrandSurface,
      generation_status: 'done',
    },
    shape: 'none',
    texture_overlay: false,
    gradient: baseGradient || {
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
        <filter id='softShadow' x='-18%' y='-18%' width='136%' height='136%'>
          <feGaussianBlur stdDeviation='10'/>
        </filter>
        <linearGradient id='editorialBg' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='#f8fafc'/>
          <stop offset='55%' stop-color='#f1f5f9'/>
          <stop offset='100%' stop-color='#e2e8f0'/>
        </linearGradient>
        <pattern id='editorialGrid' width='80' height='80' patternUnits='userSpaceOnUse'>
          <line x1='80' y1='0' x2='0' y2='0' stroke='rgba(148,163,184,0.18)' stroke-width='1'/>
          <line x1='0' y1='0' x2='0' y2='80' stroke='rgba(148,163,184,0.18)' stroke-width='1'/>
        </pattern>
      </defs>
      <rect width='1200' height='800' fill='url(#editorialBg)'/>
      <rect width='1200' height='800' fill='url(#editorialGrid)'/>
      <path d='M-60,370 C220,290 500,430 820,350 C980,308 1100,238 1260,168' stroke='rgba(148,163,184,0.28)' stroke-width='90' fill='none'/>
      <path d='M-60,520 C220,440 480,580 800,498' stroke='rgba(148,163,184,0.18)' stroke-width='60' fill='none'/>
      <rect width='1200' height='800' fill='rgba(255,255,255,0.54)'/>
      <g transform='translate(726 140)' filter='url(#softShadow)'>
        <rect x='0' y='0' width='332' height='486' rx='32' fill='rgba(255,255,255,0.90)'/>
        <rect x='18' y='18' width='296' height='450' rx='24' fill='rgba(148,163,184,0.10)'/>
        <image href='${referenceImage}' x='32' y='34' width='268' height='392' preserveAspectRatio='xMidYMid meet' opacity='0.94'/>
        <rect x='72' y='442' width='188' height='18' rx='9' fill='rgba(15,23,42,0.20)'/>
      </g>
      <text x='88' y='120' font-size='54' font-family='Arial Black, Arial, sans-serif' fill='rgba(15,23,42,0.30)'>${safeBrand}</text>
    </svg>`,
  );
  return {
    background_mode: 'ai_artwork',
    ai_artwork: { prompt: `${context.brandName} editorial logo composition from uploaded reference`, image_url: editorialLogoField, generation_status: 'done' },
    gradient: {
      type: 'linear',
      angle: 135,
      intensity: 100,
      stops: [{ color: '#ffffff', position: 0 }, { color: '#ffffff', position: 100 }],
    },
    shape: 'none',
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

function buildTonalGeometryConfig(context: PresetContext, referenceImage?: string | null): OutfitBackgroundConfig {
  const tonalReferenceImage = referenceImage || context.brandLogoUrl || null;
  const composedTonalGeometry = tonalReferenceImage
    ? asDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
          <defs>
            <linearGradient id='tonalBase' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stop-color='#0f172a'/>
              <stop offset='55%' stop-color='#1e293b'/>
              <stop offset='100%' stop-color='#334155'/>
            </linearGradient>
            <pattern id='tonalMesh' width='60' height='60' patternUnits='userSpaceOnUse'>
              <line x1='60' y1='0' x2='0' y2='60' stroke='rgba(148,163,184,0.14)' stroke-width='1'/>
              <line x1='0' y1='0' x2='60' y2='60' stroke='rgba(148,163,184,0.08)' stroke-width='1'/>
            </pattern>
          </defs>
          <rect width='1200' height='800' fill='url(#tonalBase)'/>
          <rect width='1200' height='800' fill='url(#tonalMesh)'/>
          <path d='M-80,800 L200,-40 L350,-40 L70,800 Z' fill='rgba(148,163,184,0.08)'/>
          <path d='M160,800 L440,-40 L590,-40 L310,800 Z' fill='rgba(148,163,184,0.10)'/>
          <path d='M400,800 L680,-40 L830,-40 L550,800 Z' fill='rgba(148,163,184,0.08)'/>
          <path d='M640,800 L920,-40 L1070,-40 L790,800 Z' fill='rgba(148,163,184,0.06)'/>
          <rect width='1200' height='800' fill='rgba(15,23,42,0.28)'/>
          <g transform='translate(710 128)'>
            <rect x='0' y='0' width='368' height='508' rx='38' fill='rgba(15,23,42,0.42)'/>
            <rect x='16' y='16' width='336' height='476' rx='28' fill='rgba(226,232,240,0.08)'/>
            <image href='${tonalReferenceImage}' x='28' y='32' width='312' height='438' preserveAspectRatio='xMidYMid slice' opacity='0.9'/>
          </g>
          <path d='M0,540 C240,500 430,630 680,578 C850,542 980,462 1200,384 V800 H0 Z' fill='rgba(15,23,42,0.28)'/>
        </svg>`,
      )
    : TONAL_GEOMETRY_BACKGROUND_IMAGE;
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} selection tonal geometry premium surface`,
      image_url: composedTonalGeometry,
      generation_status: 'done',
    },
    gradient: {
      type: 'linear',
      angle: 130,
      intensity: 102,
      stops: [
        { color: '#1e293b', position: 0 },
        { color: '#334155', position: 52 },
        { color: '#64748b', position: 100 },
      ],
    },
    shape: 'none',
    studioStyleConfig: {
      presetId: 'selection_tonal_geometry',
      family: 'geometry',
      styleMode: 'tonal_geometry_image_base',
      material: 'tonal_panel',
      paletteMode: 'cool_luxury',
      referenceImageUrl: tonalReferenceImage,
      metadata: {
        backgroundImageSrc: TONAL_GEOMETRY_BACKGROUND_IMAGE,
        composedWithReferenceImage: Boolean(tonalReferenceImage),
      },
    },
  };
}

// Tech Amber gradient matches the preset gradient tab values:
// angle 271° (nearly vertical top→bottom), intensity 120%,
// stops: #7c2d12 → #ea580c → #f59e0b → #fef3c7
const TECH_AMBER_GRADIENT: NonNullable<OutfitBackgroundConfig['gradient']> = {
  type: 'linear',
  angle: 271,
  intensity: 120,
  stops: [
    { color: '#7c2d12', position: 0 },
    { color: '#ea580c', position: 34 },
    { color: '#f59e0b', position: 68 },
    { color: '#fef3c7', position: 100 },
  ],
};

function buildTechAmberEnergyConfig(context: PresetContext, referenceImage?: string | null): OutfitBackgroundConfig {
  const safeReferenceImage = referenceImage || context.brandLogoUrl || '';
  const brand = escapeSvgAttribute(context.brandName);
  const amberSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs>
      <linearGradient id='amberBg' x1='0%' y1='0%' x2='0%' y2='100%'>
        <stop offset='0%' stop-color='#7c2d12'/>
        <stop offset='34%' stop-color='#ea580c'/>
        <stop offset='68%' stop-color='#f59e0b'/>
        <stop offset='100%' stop-color='#fef3c7'/>
      </linearGradient>
      <filter id='amberGlow' x='-20%' y='-20%' width='140%' height='140%'>
        <feGaussianBlur stdDeviation='14' result='blur'/>
        <feMerge><feMergeNode in='blur'/><feMergeNode in='SourceGraphic'/></feMerge>
      </filter>
      <clipPath id='imgClip'><rect x='694' y='88' width='448' height='612' rx='0'/></clipPath>
    </defs>
    <rect width='1200' height='800' fill='url(#amberBg)'/>
    <rect width='1200' height='800' fill='rgba(15,10,2,0.28)'/>
    ${Array.from({ length: 5 }, (_, i) => `<path d='M${-80 + i * 290},0 L${i * 290 + 80},800' stroke='rgba(253,186,116,0.22)' stroke-width='${3 - i * 0.4 > 0.5 ? (3 - i * 0.4).toFixed(1) : 0.8}'/>`).join('')}
    <path d='M0,0 L580,0 L440,800 L0,800 Z' fill='rgba(124,45,18,0.40)'/>
    <path d='M0,0 L560,0 L420,800 L0,800 Z' fill='rgba(234,88,12,0.18)'/>
    <circle cx='260' cy='300' r='220' fill='rgba(251,191,36,0.28)' filter='url(#amberGlow)'/>
    <circle cx='260' cy='300' r='110' fill='rgba(253,230,138,0.18)'/>
    ${Array.from({ length: 6 }, (_, i) => `<circle cx='260' cy='300' r='${55 + i * 48}' fill='none' stroke='rgba(253,186,116,${(0.40 - i * 0.05).toFixed(2)})' stroke-width='${2 - i * 0.25 > 0.3 ? (2 - i * 0.25).toFixed(1) : 0.3}'/>`).join('')}
    <path d='M0,520 L560,440 L440,800 L0,800 Z' fill='rgba(124,45,18,0.50)'/>
    <path d='M0,580 L530,510 L440,800 L0,800 Z' fill='rgba(120,53,15,0.62)'/>
    ${safeReferenceImage ? `
      <rect x='694' y='88' width='448' height='612' fill='rgba(124,45,18,0.55)'/>
      <image href='${safeReferenceImage}' x='694' y='88' width='448' height='612' preserveAspectRatio='xMidYMid meet' opacity='0.92' clip-path='url(#imgClip)'/>
      <rect x='694' y='88' width='448' height='612' fill='none' stroke='rgba(254,243,199,0.75)' stroke-width='3'/>
      <line x1='694' y1='88' x2='1142' y2='88' stroke='rgba(251,191,36,0.55)' stroke-width='6'/>
      <line x1='694' y1='700' x2='1142' y2='700' stroke='rgba(251,191,36,0.55)' stroke-width='6'/>
    ` : ''}
    <text x='56' y='718' font-size='48' fill='rgba(254,243,199,0.90)' font-family='Arial Black,Arial,sans-serif' letter-spacing='2'>${brand}</text>
    <text x='56' y='762' font-size='22' fill='rgba(253,186,116,0.70)' font-family='Arial,sans-serif' letter-spacing='8'>TECH AMBER ENERGY</text>
  </svg>`;
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} tech amber energy — amber gradient diagonal composition`,
      image_url: asDataUri(amberSvg),
      generation_status: 'done',
    },
    gradient: TECH_AMBER_GRADIENT,
    shape: 'none',
  };
}

function drawGradientOnCanvas(
  ctx: CanvasRenderingContext2D,
  CW: number,
  CH: number,
  gradient: OutfitBackgroundConfig['gradient'] | null | undefined,
) {
  if (!gradient?.stops?.length) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CW, CH);
    return;
  }
  const angle = ((gradient.angle ?? 135) * Math.PI) / 180;
  const cx = CW / 2, cy = CH / 2;
  const halfDiag = Math.sqrt(CW * CW + CH * CH) / 2;
  const x1 = cx - Math.cos(angle) * halfDiag;
  const y1 = cy - Math.sin(angle) * halfDiag;
  const x2 = cx + Math.cos(angle) * halfDiag;
  const y2 = cy + Math.sin(angle) * halfDiag;
  const grd = gradient.type === 'radial'
    ? ctx.createRadialGradient(cx, cy, 0, cx, cy, halfDiag)
    : ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.stops.forEach((stop) => grd.addColorStop(stop.position / 100, stop.color));
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, CW, CH);
}

async function buildTechAmberEnergyAsync(
  uploadedImage: string | null,
  context: PresetContext,
): Promise<OutfitBackgroundConfig> {
  const CW = 1200, CH = 800;
  const canvas = createOffscreenCanvas(CW, CH);
  if (!canvas) return buildTechAmberEnergyConfig(context, uploadedImage);
  const ctx = canvas.getContext('2d');
  if (!ctx) return buildTechAmberEnergyConfig(context, uploadedImage);

  // Amber gradient base
  drawGradientOnCanvas(ctx, CW, CH, TECH_AMBER_GRADIENT);

  // Dark overlay for depth
  ctx.fillStyle = 'rgba(15,10,2,0.28)';
  ctx.fillRect(0, 0, CW, CH);

  // Diagonal beam lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = 'rgba(253,186,116,0.28)';
    ctx.lineWidth = Math.max(0.8, 3 - i * 0.4);
    ctx.beginPath();
    ctx.moveTo(-80 + i * 290, 0);
    ctx.lineTo(i * 290 + 80, CH);
    ctx.stroke();
  }

  // Left diagonal overlay planes
  ctx.fillStyle = 'rgba(124,45,18,0.40)';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(580, 0); ctx.lineTo(440, CH); ctx.lineTo(0, CH);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(234,88,12,0.18)';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(560, 0); ctx.lineTo(420, CH); ctx.lineTo(0, CH);
  ctx.closePath(); ctx.fill();

  // Radial glow
  const glowGrd = ctx.createRadialGradient(260, 300, 0, 260, 300, 220);
  glowGrd.addColorStop(0, 'rgba(251,191,36,0.42)');
  glowGrd.addColorStop(0.6, 'rgba(251,191,36,0.12)');
  glowGrd.addColorStop(1, 'rgba(251,191,36,0)');
  ctx.fillStyle = glowGrd;
  ctx.beginPath();
  ctx.arc(260, 300, 220, 0, Math.PI * 2);
  ctx.fill();

  // Uploaded image panel — right side
  if (uploadedImage) {
    try {
      const img = await loadImageFromSource(uploadedImage);
      const PX = 694, PY = 88, PW = 448, PH = 612;
      // Amber tint behind image
      ctx.fillStyle = 'rgba(124,45,18,0.55)';
      ctx.fillRect(PX, PY, PW, PH);
      // Draw image
      ctx.drawImage(img, PX, PY, PW, PH);
      // Amber overlay on image
      ctx.fillStyle = 'rgba(120,45,18,0.30)';
      ctx.fillRect(PX, PY, PW, PH);
      // Frame border
      ctx.strokeStyle = 'rgba(254,243,199,0.75)';
      ctx.lineWidth = 3;
      ctx.strokeRect(PX, PY, PW, PH);
      // Top/bottom accent lines
      ctx.strokeStyle = 'rgba(251,191,36,0.60)';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(PX, PY + 3); ctx.lineTo(PX + PW, PY + 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PX, PY + PH - 3); ctx.lineTo(PX + PW, PY + PH - 3); ctx.stroke();
    } catch { /* no image loaded */ }
  }

  // Bottom vignette
  ctx.fillStyle = 'rgba(124,45,18,0.50)';
  ctx.beginPath();
  ctx.moveTo(0, 520); ctx.lineTo(560, 440); ctx.lineTo(440, CH); ctx.lineTo(0, CH);
  ctx.closePath(); ctx.fill();

  const imageUrl = canvas.toDataURL('image/png');
  return {
    background_mode: 'ai_artwork',
    ai_artwork: { prompt: 'tech amber energy canvas — amber gradient + uploaded image', image_url: imageUrl, generation_status: 'done' },
    gradient: TECH_AMBER_GRADIENT,
    shape: 'none',
  };
}

async function buildEditorialLogoAsync(
  referenceImage: string | null,
  context: PresetContext,
  currentDraft: OutfitBackgroundConfig,
  backgroundImageUrl?: string,
): Promise<OutfitBackgroundConfig> {
  const CW = 1200, CH = 800;
  const canvas = createOffscreenCanvas(CW, CH);
  if (!canvas) return buildEditorialLogoComposition(referenceImage || context.brandLogoUrl || '', context);
  const ctx = canvas.getContext('2d');
  if (!ctx) return buildEditorialLogoComposition(referenceImage || context.brandLogoUrl || '', context);

  // Step 1: background image — user-selected or default Premium Fashion Artwork
  const bgSrc = backgroundImageUrl ?? '/Fart.png';
  let bgLoaded = false;
  try {
    const bgImg = await loadImageFromSource(bgSrc);
    ctx.drawImage(bgImg, 0, 0, CW, CH);
    bgLoaded = true;
  } catch { /* fall through to gradient */ }
  if (!bgLoaded) {
    drawGradientOnCanvas(ctx, CW, CH, currentDraft.gradient ?? { type: 'linear', angle: 135, intensity: 100, stops: [{ color: '#f8fafc', position: 0 }, { color: '#e2e8f0', position: 100 }] });
  }

  // Editorial white overlay for brightness
  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  ctx.fillRect(0, 0, CW, CH);

  // Subtle editorial grid
  ctx.strokeStyle = 'rgba(148,163,184,0.22)';
  ctx.lineWidth = 1;
  for (let x = 0; x < CW; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  for (let y = 0; y < CH; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }

  // Flowing editorial curves
  ctx.strokeStyle = 'rgba(148,163,184,0.28)';
  ctx.lineWidth = 90;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-60, 370);
  ctx.bezierCurveTo(220, 290, 500, 430, 820, 350);
  ctx.bezierCurveTo(980, 308, 1100, 238, 1260, 168);
  ctx.stroke();

  // Extra white layer for editorial cleanliness
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.fillRect(0, 0, CW, CH);

  // Reference image in card frame
  if (referenceImage) {
    try {
      const logoImg = await loadImageFromSource(referenceImage);
      const CX = 726, CY = 140, CW2 = 332, CH2 = 486, RADIUS = 32;
      // Drop shadow
      ctx.fillStyle = 'rgba(15,23,42,0.18)';
      ctx.beginPath();
      ctx.roundRect(CX + 8, CY + 8, CW2, CH2, RADIUS);
      ctx.fill();
      // Card background
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      ctx.beginPath();
      ctx.roundRect(CX, CY, CW2, CH2, RADIUS);
      ctx.fill();
      // Clipped image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(CX + 32, CY + 34, 268, 392, 16);
      ctx.clip();
      ctx.drawImage(logoImg, CX + 32, CY + 34, 268, 392);
      ctx.restore();
      // Label bar below image
      ctx.fillStyle = 'rgba(15,23,42,0.18)';
      ctx.beginPath();
      ctx.roundRect(CX + 72, CY + 442, 188, 18, 9);
      ctx.fill();
    } catch { /* no image */ }
  }

  // Brand name
  ctx.font = 'bold 52px "Arial Black", Arial, sans-serif';
  ctx.fillStyle = 'rgba(15,23,42,0.30)';
  ctx.fillText(context.brandName || '', 88, 120);

  const imageUrl = canvas.toDataURL('image/png');
  return {
    background_mode: 'ai_artwork',
    ai_artwork: { prompt: 'editorial logo — Premium Fashion Artwork + uploaded reference', image_url: imageUrl, generation_status: 'done' },
    gradient: currentDraft.gradient,
    shape: 'none',
  };
}

async function buildEditorialCollageAsync(
  uploadedImage: string | null,
  context: PresetContext,
): Promise<OutfitBackgroundConfig> {
  const CW = 1200;
  const CH = 800;
  const canvas = createOffscreenCanvas(CW, CH);
  if (!canvas) throw new Error('canvas_unavailable');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas_context_unavailable');

  const SPLIT = 576; // pixel where streetvibes ends / upload begins

  // Dark editorial base
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, CW, CH);

  // LEFT PANEL — streetvibes.jpg
  let streetImg: HTMLImageElement | null = null;
  try { streetImg = await loadImageFromSource('/streetvibes.jpg'); } catch { /* no-op */ }

  if (streetImg) {
    ctx.drawImage(streetImg, 0, 0, SPLIT + 80, CH);
    const overlay = ctx.createLinearGradient(0, 0, SPLIT + 80, 0);
    overlay.addColorStop(0, 'rgba(2,6,23,0.15)');
    overlay.addColorStop(1, 'rgba(2,6,23,0.60)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, SPLIT + 80, CH);
  } else {
    // Geometric placeholder when asset unavailable
    const grd = ctx.createLinearGradient(0, 0, SPLIT, CH);
    grd.addColorStop(0, '#1e293b');
    grd.addColorStop(1, '#0f172a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, SPLIT, CH);
    ctx.strokeStyle = 'rgba(148,163,184,0.20)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 120); ctx.lineTo(SPLIT, i * 120 + 80);
      ctx.stroke();
    }
  }

  // Diagonal separator — two lines for editorial look
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(248,250,252,0.65)';
  ctx.beginPath(); ctx.moveTo(SPLIT - 30, 0); ctx.lineTo(SPLIT + 100, CH); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(248,250,252,0.25)';
  ctx.beginPath(); ctx.moveTo(SPLIT - 10, 0); ctx.lineTo(SPLIT + 120, CH); ctx.stroke();
  ctx.restore();

  // RIGHT PANEL — uploaded image
  let uploadedImg: HTMLImageElement | null = null;
  if (uploadedImage) {
    try { uploadedImg = await loadImageFromSource(uploadedImage); } catch { /* no-op */ }
  }

  if (uploadedImg) {
    const rx = SPLIT + 40;
    ctx.drawImage(uploadedImg, rx, 0, CW - rx, CH);
    const rightOverlay = ctx.createLinearGradient(rx, 0, CW, 0);
    rightOverlay.addColorStop(0, 'rgba(2,6,23,0.48)');
    rightOverlay.addColorStop(0.5, 'rgba(2,6,23,0.08)');
    rightOverlay.addColorStop(1, 'rgba(2,6,23,0.04)');
    ctx.fillStyle = rightOverlay;
    ctx.fillRect(rx, 0, CW - rx, CH);
  } else {
    // Diamond grid placeholder on right
    ctx.strokeStyle = 'rgba(226,232,240,0.20)';
    ctx.lineWidth = 1;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const cx = SPLIT + 80 + col * 120;
        const cy = 60 + row * 130;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 44); ctx.lineTo(cx + 56, cy);
        ctx.lineTo(cx, cy + 44); ctx.lineTo(cx - 56, cy);
        ctx.closePath(); ctx.stroke();
      }
    }
  }

  // Diamond frame border on the right panel
  ctx.strokeStyle = 'rgba(248,250,252,0.32)';
  ctx.lineWidth = 2;
  ctx.strokeRect(SPLIT + 80, 52, CW - SPLIT - 130, CH - 104);

  // Bottom vignette
  const vignette = ctx.createLinearGradient(0, CH - 200, 0, CH);
  vignette.addColorStop(0, 'rgba(2,6,23,0)');
  vignette.addColorStop(1, 'rgba(2,6,23,0.72)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, CH - 200, CW, 200);

  // Brand text
  ctx.fillStyle = 'rgba(248,250,252,0.88)';
  ctx.font = 'bold 48px Arial Black, Arial, sans-serif';
  ctx.fillText(`${context.brandName}`, 52, 726);
  ctx.fillStyle = 'rgba(203,213,225,0.65)';
  ctx.font = '22px Arial, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('EDITORIAL COLLAGE', 52, 764);

  const outputUrl = canvas.toDataURL('image/png');
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} editorial collage — streetvibes × uploaded reference`,
      image_url: outputUrl,
      generation_status: 'done',
    },
    gradient: {
      type: 'linear',
      angle: 135,
      intensity: 100,
      stops: [{ color: '#0f172a', position: 0 }, { color: '#1e293b', position: 100 }],
    },
    shape: 'mesh',
  };
}



function buildTonalGeometryPreset(context: PresetContext, referenceImage?: string | null): OutfitBackgroundConfig {
  return buildTonalGeometryConfig(context, referenceImage);
}

function buildLuxuryFabricMonogramPreset(context: PresetContext, referenceImage?: string | null): OutfitBackgroundConfig {
  const safeReferenceImage = referenceImage || context.brandLogoUrl || null;
  const monogramRaw = context.brandName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0] || '')
    .join('')
    .toUpperCase() || 'SL';
  const monogram = escapeSvgAttribute(monogramRaw);
  const composedMonogram = asDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <pattern id='mono' width='220' height='180' patternUnits='userSpaceOnUse'>
          <rect width='220' height='180' fill='rgba(8,47,73,0)'/>
          <text x='26' y='122' font-size='82' letter-spacing='5' font-family='Times New Roman, Georgia, serif' fill='rgba(191,219,254,0.2)'>${monogram}</text>
          <path d='M20 28 H200 M20 154 H200' stroke='rgba(186,230,253,0.18)' stroke-width='1.8'/>
        </pattern>
        <linearGradient id='fabricBase' x1='6%' y1='8%' x2='94%' y2='92%'>
          <stop offset='0%' stop-color='#0f172a'/>
          <stop offset='52%' stop-color='#1e3a8a'/>
          <stop offset='100%' stop-color='#0c4a6e'/>
        </linearGradient>
      </defs>
      <rect width='1200' height='800' fill='url(#fabricBase)'/>
      <rect width='1200' height='800' fill='url(#mono)'/>
      <rect width='1200' height='800' fill='rgba(15,23,42,0.24)'/>
      <path d='M0,610 C220,548 470,676 780,610 C960,568 1080,496 1200,430 V800 H0 Z' fill='rgba(2,6,23,0.34)'/>
      ${safeReferenceImage ? `<image href='${safeReferenceImage}' x='780' y='148' width='292' height='404' preserveAspectRatio='xMidYMid meet' opacity='0.86'/>` : ''}
      ${safeReferenceImage ? `<rect x='760' y='126' width='334' height='446' rx='34' fill='none' stroke='rgba(191,219,254,0.5)' stroke-width='2.5'/>` : ''}
      <text x='80' y='718' font-size='56' fill='rgba(219,234,254,0.82)' font-family='Arial Black,Arial,sans-serif'>${escapeSvgAttribute(context.brandName)} MONOGRAM</text>
    </svg>`,
  );
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} luxury fabric monogram branded surface`,
      image_url: composedMonogram,
      generation_status: 'done',
    },
    gradient: {
      type: 'linear',
      angle: 132,
      intensity: 104,
      stops: [
        { color: '#0f172a', position: 0 },
        { color: '#1e3a8a', position: 56 },
        { color: '#0c4a6e', position: 100 },
      ],
    },
    shape: 'mesh',
    studioStyleConfig: {
      presetId: 'selection_luxury_fabric_monogram',
      family: 'pattern_surface',
      styleMode: 'luxury_fabric_monogram',
      material: 'premium_fabric',
      paletteMode: 'cool_luxury',
      referenceImageUrl: safeReferenceImage,
      metadata: {
        monogram,
      },
    },
  };
}

function buildNeonMotionGridConfig(context: PresetContext, referenceImage?: string | null): OutfitBackgroundConfig {
  const safeReferenceImage = referenceImage || context.brandLogoUrl || '';
  const composedNeonGrid = asDataUri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='neonBase' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stop-color='#020617'/>
          <stop offset='48%' stop-color='#0f172a'/>
          <stop offset='100%' stop-color='#0c1e3d'/>
        </linearGradient>
        <filter id='neonGlow' x='-20%' y='-20%' width='140%' height='140%'>
          <feGaussianBlur stdDeviation='6' result='blur'/>
          <feMerge><feMergeNode in='blur'/><feMergeNode in='SourceGraphic'/></feMerge>
        </filter>
      </defs>
      <rect width='1200' height='800' fill='url(#neonBase)'/>
      ${Array.from({ length: 14 }).map((_, i) => `<line x1='${i * 95}' y1='0' x2='${i * 95 + 230}' y2='800' stroke='rgba(56,189,248,0.22)' stroke-width='1.5'/>`).join('')}
      ${Array.from({ length: 10 }).map((_, i) => `<line x1='0' y1='${i * 88}' x2='1200' y2='${i * 88 + 66}' stroke='rgba(56,189,248,0.15)' stroke-width='1'/>`).join('')}
      <circle cx='300' cy='280' r='220' fill='rgba(56,189,248,0.10)' filter='url(#neonGlow)'/>
      <circle cx='950' cy='520' r='170' fill='rgba(139,92,246,0.09)' filter='url(#neonGlow)'/>
      <rect width='1200' height='800' fill='rgba(15,23,42,0.22)'/>
      <path d='M0,620 C220,540 460,690 760,598 C930,546 1090,458 1200,396 V800 H0 Z' fill='rgba(2,6,23,0.36)'/>
      ${safeReferenceImage ? `<image href='${safeReferenceImage}' x='760' y='140' width='316' height='420' preserveAspectRatio='xMidYMid slice' opacity='0.9'/>` : ''}
      ${safeReferenceImage ? `<rect x='738' y='116' width='360' height='466' rx='36' fill='none' stroke='rgba(56,189,248,0.5)' stroke-width='2.5'/>` : ''}
    </svg>`,
  );
  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: `${context.brandName} neon motion grid premium tech rhythm`,
      image_url: composedNeonGrid,
      generation_status: 'done',
    },
    gradient: {
      type: 'linear',
      angle: 132,
      intensity: 100,
      stops: [
        { color: '#020617', position: 0 },
        { color: '#0f172a', position: 58 },
        { color: '#1d4ed8', position: 100 },
      ],
    },
    shape: 'none',
  };
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
    return buildTonalGeometryPreset(context, safeReferenceImage);
  }
  if (recipe.presetId === 'selection_luxury_fabric_monogram') {
    return buildLuxuryFabricMonogramPreset(context, safeReferenceImage);
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

  const generators: Partial<Record<BackgroundPresetId, () => OutfitBackgroundConfig>> = {
    selection_logo_image_fusion: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='1200' height='800' fill='#020617'/><image href='${safeReferenceImage || ''}' x='0' y='0' width='1200' height='800' preserveAspectRatio='xMidYMid slice' opacity='0.58'/><path d='M0,640 C250,560 520,730 860,620 C1030,565 1130,500 1200,440 V800 H0 Z' fill='rgba(15,23,42,0.64)'/><image href='${safeReferenceImage || ''}' x='730' y='120' width='350' height='430' preserveAspectRatio='xMidYMid meet' opacity='0.88'/><text x='90' y='690' font-size='74' font-family='Arial Black,Arial,sans-serif' fill='rgba(255,255,255,0.86)'>${brand}</text></svg>`, 'orb'),
    selection_tech_amber_energy: () => buildTechAmberEnergyConfig(context, safeReferenceImage),
    selection_metallic_sport_identity: () => buildImageSurface(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='metal' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#020617'/><stop offset='42%' stop-color='#374151'/><stop offset='100%' stop-color='#cbd5e1'/></linearGradient></defs><rect width='1200' height='800' fill='url(#metal)'/><path d='M0,560 L1200,190 L1200,380 L0,760 Z' fill='rgba(148,163,184,0.24)'/><image href='${safeReferenceImage || ''}' x='100' y='120' width='420' height='420' opacity='0.22' preserveAspectRatio='xMidYMid meet'/><image href='${safeReferenceImage || ''}' x='760' y='170' width='330' height='330' opacity='0.92' preserveAspectRatio='xMidYMid meet'/><rect x='742' y='150' width='366' height='366' rx='34' fill='none' stroke='rgba(226,232,240,0.62)' stroke-width='4'/><text x='84' y='716' font-size='52' fill='rgba(248,250,252,0.8)' font-family='Arial Black,Arial,sans-serif'>METALLIC SPORT IDENTITY</text></svg>`, 'diamond'),
    selection_neon_motion_grid: () => buildNeonMotionGridConfig(context, safeReferenceImage),
    selection_editorial_collage: () => {
      const collageSvg = safeReferenceImage
        ? `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
            <rect width='1200' height='800' fill='#111827'/>
            <image href='${safeReferenceImage}' x='0' y='0' width='620' height='800' opacity='0.62' preserveAspectRatio='xMidYMid slice'/>
            <rect x='0' y='0' width='620' height='800' fill='rgba(15,23,42,0.32)'/>
            <image href='${safeReferenceImage}' x='540' y='110' width='610' height='540' opacity='0.88' preserveAspectRatio='xMidYMid slice'/>
            <rect x='518' y='88' width='644' height='572' fill='none' stroke='rgba(248,250,252,0.35)' stroke-width='3'/>
            <path d='M0,660 C200,620 420,720 680,670 C880,638 1040,580 1200,540 V800 H0 Z' fill='rgba(2,6,23,0.48)'/>
            <text x='56' y='726' font-size='48' fill='rgba(248,250,252,0.85)' font-family='Arial Black,Arial,sans-serif'>${brand} · EDITORIAL</text>
          </svg>`
        : `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
            <defs>
              <linearGradient id='collageBase' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stop-color='#111827'/><stop offset='100%' stop-color='#1f2937'/>
              </linearGradient>
            </defs>
            <rect width='1200' height='800' fill='url(#collageBase)'/>
            ${Array.from({ length: 5 }).map((_, i) => `<rect x='${56 + i * 220}' y='${60 + (i % 2) * 80}' width='190' height='${280 + (i % 3) * 60}' rx='18' fill='rgba(255,255,255,0.06)' stroke='rgba(255,255,255,0.15)' stroke-width='1.5'/>`).join('')}
            <path d='M0,620 C260,560 520,700 820,630 C1000,590 1120,530 1200,480 V800 H0 Z' fill='rgba(2,6,23,0.42)'/>
            <text x='60' y='730' font-size='52' fill='rgba(248,250,252,0.8)' font-family='Arial Black,Arial,sans-serif'>${brand} · EDITORIAL COLLAGE</text>
          </svg>`;
      return buildImageSurface(collageSvg, 'mesh');
    },
  };
  const generator = generators[recipe.presetId];
  if (generator) return generator();
  return buildImageSurface(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='1200' height='800' fill='#0f172a'/><text x='80' y='700' font-size='52' fill='rgba(248,250,252,0.8)' font-family='Arial Black,Arial,sans-serif'>${brand}</text></svg>`,
    'none',
  );
}

function getPresetAvailabilityReason(
  presetId: BackgroundPresetId,
  context: PresetContext,
  referenceImage?: string | null,
): string | null {
  const hasReferenceImage = Boolean(referenceImage);
  const hasLogo = Boolean(context.brandLogoUrl);
  if (presetId === 'selection_tiled_motif' && !hasReferenceImage) return 'Requires image';
  if (presetId === 'selection_logo_image_fusion' && !hasReferenceImage) return 'Requires image';
  if (presetId === 'selection_editorial_logo' && !hasReferenceImage && !hasLogo) return 'Requires logo or image';
  return null;
}

function isPresetAvailable(
  presetId: BackgroundPresetId,
  context: PresetContext,
  referenceImage?: string | null,
): boolean {
  return getPresetAvailabilityReason(presetId, context, referenceImage) === null;
}

function applyPresetPreview(params: {
  presetId: BackgroundPresetId;
  context: PresetContext;
  referenceImage?: string | null;
  gradient?: OutfitBackgroundConfig['gradient'];
}): OutfitBackgroundConfig {
  const safeReferenceImage = params.referenceImage || params.context.brandLogoUrl || null;
  let recipe = buildCompositionRecipe({
    presetId: params.presetId,
    referenceIntent: analyzeReferenceIntent(safeReferenceImage),
    gradient: params.gradient,
  });
  if (detectLogoLikeSubject(safeReferenceImage)) {
    recipe = { ...recipe, logoWeight: Math.min(1, recipe.logoWeight + 0.08) };
  }
  return params.presetId === 'selection_tiled_motif' && safeReferenceImage
    ? buildTiledMotifFromReference(safeReferenceImage, params.context, 1, params.gradient)
    : buildSurfaceFromRecipe(recipe, params.context, safeReferenceImage);
}

async function applyPresetUnified(params: {
  presetId: BackgroundPresetId;
  context: PresetContext;
  referenceImage?: string | null;
  gradient?: OutfitBackgroundConfig['gradient'];
}): Promise<OutfitBackgroundConfig> {
  const availabilityReason = getPresetAvailabilityReason(params.presetId, params.context, params.referenceImage);
  if (availabilityReason) throw new Error(availabilityReason);
  const safeReferenceImage = params.referenceImage || params.context.brandLogoUrl || null;
  let recipe = buildCompositionRecipe({
    presetId: params.presetId,
    referenceIntent: analyzeReferenceIntent(safeReferenceImage),
    gradient: params.gradient,
  });
  if (detectLogoLikeSubject(safeReferenceImage)) {
    recipe = { ...recipe, logoWeight: Math.min(1, recipe.logoWeight + 0.08) };
  }
  console.log('[Preset Apply]', {
    presetId: params.presetId,
    hasReferenceImage: Boolean(params.referenceImage),
    hasLogo: Boolean(params.context.brandLogoUrl),
    recipe,
  });
  const config = params.presetId === 'selection_tiled_motif' && safeReferenceImage
    ? await buildTiledMotifFromReferenceImage(safeReferenceImage, params.context, params.gradient)
    : buildSurfaceFromRecipe(recipe, params.context, safeReferenceImage);
  return {
    ...config,
    background_mode: config.background_mode || 'ai_artwork',
    gradient: config.gradient || DEFAULT_BACKGROUND.gradient,
    shape: config.shape || 'none',
  };
}

function getRecommendedPresets(outfitMetadata: OutfitMetadata | undefined, runtimeState: PresetRuntimeState): RecommendedPreset[] {
  const allPresets: RecommendedPreset[] = [
    { id: 'selection_tiled_motif', category: 'pattern_surface', label: 'Selection tiled motif', description: 'Turns the uploaded logo into a repeated premium motif surface.' },
    { id: 'selection_luxury_fabric_monogram', category: 'pattern_surface', label: 'Selection luxury fabric monogram', description: 'Builds a refined fashion surface with repeated branded monogram texture.' },
    { id: 'selection_tonal_geometry', category: 'pattern_surface', label: 'Selection tonal geometry', description: 'Combines tonal palette extraction with subtle geometric paneling.' },
    { id: 'selection_editorial_logo', category: 'editorial_branding', label: 'Selection editorial logo', description: 'Uses the uploaded logo as a hero element in a clean campaign-style composition.' },
    { id: 'selection_editorial_collage', category: 'editorial_branding', label: 'Selection editorial collage', description: 'Fuses cropped logo and treated imagery into a depth-rich editorial card.' },
    { id: 'selection_soft_premium_minimal', category: 'editorial_branding', label: 'Selection soft premium minimal', description: 'Minimal, high-readability premium composition with restrained visual weight.' },
    { id: 'selection_tech_amber_energy', category: 'tech_energy', label: 'Selection tech amber energy', description: 'Fuses uploaded logo with high-energy amber/orange AI-tech visual treatment.' },
    { id: 'selection_neon_motion_grid', category: 'tech_energy', label: 'Selection neon motion grid', description: 'Adds diagonal neon movement, digital grid rhythm, and logo anchoring.' },
    { id: 'selection_metallic_sport_identity', category: 'tech_energy', label: 'Selection metallic sport identity', description: 'Applies silver/graphite highlights for premium sport-tech brand identity.' },
    { id: 'selection_logo_image_fusion', category: 'hybrid_fusion', label: 'Selection logo + stylized image fusion', description: 'Blends uploaded logo with stylized image composition for richer hero surfaces.' },
  ];
  const availablePresetIds = allPresets
    .filter((preset) => {
      if (preset.id === 'selection_tiled_motif') return runtimeState.hasReferenceImage;
      if (preset.id === 'selection_logo_image_fusion') return runtimeState.hasReferenceImage;
      if (preset.id === 'selection_editorial_logo') return runtimeState.hasReferenceImage || runtimeState.hasBrandLogo;
      return true;
    })
    .map((preset) => preset.id);
  const isTechSportDirection = [outfitMetadata?.style, outfitMetadata?.occasion, outfitMetadata?.mood, outfitMetadata?.title]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .match(/tech|sport|athle|performance|futur|street|active/);

  if (isTechSportDirection) {
    return allPresets
      .filter((preset) => availablePresetIds.includes(preset.id))
      .filter((preset) => ['selection_tonal_geometry', 'selection_tech_amber_energy', 'selection_neon_motion_grid'].includes(preset.id))
      .slice(0, 3);
  }

  const pickFirstByCategory = (category: PresetCategory) => allPresets.find((preset) => preset.category === category && availablePresetIds.includes(preset.id));
  return [
    pickFirstByCategory('pattern_surface'),
    pickFirstByCategory('editorial_branding'),
    pickFirstByCategory('tech_energy'),
  ].filter(Boolean).slice(0, 3) as RecommendedPreset[];
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
  const buildNoMaterialConfig = (baseColor: string): FabricMaterialConfig => ({
    ...buildFabricPresetConfig(baseColor),
    type: 'none',
    stitchBorder: false,
    premium: false,
  });

  const deriveMaterialConfigFromDraft = (source: OutfitBackgroundConfig): FabricMaterialConfig => {
    const baseColor = source.solid_color || source.gradient?.stops?.[0]?.color || '#334155';
    if (!source.materialLayer?.type || source.materialLayer.type === 'none') return buildNoMaterialConfig(baseColor);
    return buildFabricPresetConfig(baseColor, {
      type: source.materialLayer.type,
      density: source.materialLayer.density,
      threadDirection: source.materialLayer.threadDirection,
      threadThickness: source.materialLayer.threadThickness,
      embossIntensity: source.materialLayer.embossIntensity,
      surfaceContrast: source.materialLayer.surfaceContrast,
      finish: source.materialLayer.finish,
      scope: source.materialLayer.scope,
      stitchBorder: source.decorativeOverlayLayer?.stitchBorder,
      stitchColor: source.decorativeOverlayLayer?.stitchColor,
    });
  };

  const [activeTab, setActiveTab] = useState<StudioTab>('color');
  const [draft, setDraft] = useState<OutfitBackgroundConfig>(() => resolveOutfitBackgroundForRender(value));
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStylePreset, setAiStylePreset] = useState<ArtworkStylePreset>('editorial_fashion');
  const [aiPaletteMode, setAiPaletteMode] = useState<ArtworkPaletteMode>('cool_luxury');
  const [aiGeometry, setAiGeometry] = useState<GeometryFamily>('mesh');
  const [aiCompositionType, setAiCompositionType] = useState<ArtworkStudioInput['compositionType']>('background');
  const [aiContrast, setAiContrast] = useState<ArtworkContrastLevel>('medium');
  const [aiColorIntent, setAiColorIntent] = useState<ArtworkColorIntent>('prompt_driven');
  const [aiSafeArea, setAiSafeArea] = useState(true);
  const [aiReferenceImageUrl, setAiReferenceImageUrl] = useState('');
  const [aiReferenceImageDataUrl, setAiReferenceImageDataUrl] = useState('');
  const [aiReferenceFileName, setAiReferenceFileName] = useState('');
  const [editorialLogoBgUrl, setEditorialLogoBgUrl] = useState('/Fart.png');
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
  const [materialConfig, setMaterialConfig] = useState<FabricMaterialConfig>(() => deriveMaterialConfigFromDraft(resolveOutfitBackgroundForRender(value)));
  const showPresetToastError = (message: string) => {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      timer: 2600,
      showConfirmButton: false,
    });
  };

  const presetContext = useMemo<PresetContext>(() => {
    const metadataBrand = outfitMetadata?.brandIdentity || outfitMetadata?.brands?.[0] || previewCardData.pieces?.[0]?.brand || 'SELECTION';
    const brandName = metadataBrand.trim() || 'SELECTION';
    const brandLogoUrl = resolveBrandLogoUrlByName(brandName) || null;
    const heroColor = previewCardData.outfitBackground && 'background_mode' in previewCardData.outfitBackground && previewCardData.outfitBackground.background_mode === 'solid'
      ? previewCardData.outfitBackground.solid_color || '#1d4ed8'
      : '#1d4ed8';
    return { brandName, brandLogoUrl, heroColor };
  }, [outfitMetadata, previewCardData]);
  const isUploadedReferenceImage = (value: string) => value.startsWith('data:image/') || value.startsWith('blob:');
  const getUploadedReferenceImage = () => (isUploadedReferenceImage(aiReferenceImageUrl) ? aiReferenceImageUrl : null);
  const uploadedReferenceImage = getUploadedReferenceImage();
  const runtimeState = useMemo<PresetRuntimeState>(
    () => ({
      hasReferenceImage: Boolean(uploadedReferenceImage),
      hasBrandLogo: Boolean(presetContext.brandLogoUrl),
    }),
    [uploadedReferenceImage, presetContext.brandLogoUrl],
  );
  const recommendedPresets = useMemo(() => getRecommendedPresets(outfitMetadata, runtimeState), [outfitMetadata, runtimeState]);
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

  useEffect(() => {
    if (materialConfig.type === 'none') return;
    applyMaterialToDraft(materialConfig, draft);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.solid_color, draft.gradient?.stops?.[0]?.color]);

  const applyRecommendedPresetFromReferenceImage = async (
    presetId: BackgroundPresetId,
    uploadedReferenceImage: string | null,
    context: PresetContext,
  ) => {
    console.info('[background-studio] preset selected', { presetId, hasReferenceImage: Boolean(uploadedReferenceImage) });
    setPresetRequirementMessage(null);
    const preset = recommendedPresets.find((item) => item.id === presetId);
    if (!preset) return;
    if (!isPresetAvailable(presetId, context, uploadedReferenceImage)) {
      const requirementMessage = getPresetAvailabilityReason(presetId, context, uploadedReferenceImage) || 'Preset unavailable for current state.';
      if (presetId === 'selection_tiled_motif' && !uploadedReferenceImage) {
        showPresetToastError('Upload a reference image to use Tiled Motif');
      }
      setPresetRequirementMessage(requirementMessage);
      return;
    }
    let config: OutfitBackgroundConfig;
    try {
      config = await applyPresetUnified({
        presetId,
        context,
        referenceImage: uploadedReferenceImage,
        gradient: draft.gradient,
      });
    } catch {
      setPresetRequirementMessage('Unable to apply preset. Please validate logo/reference image requirements and retry.');
      return;
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

  const getMaterialBaseColor = (source: OutfitBackgroundConfig) =>
    source.solid_color || source.gradient?.stops?.[0]?.color || '#334155';

  const applyMaterialToDraft = (nextConfig: FabricMaterialConfig, source = draft) => {
    if (nextConfig.type === 'none') {
      setDraft((prev) => ({
        ...prev,
        materialLayer: undefined,
        decorativeOverlayLayer: undefined,
      }));
      return;
    }

    const merged = applyFabricMaterialToCard(source, buildFabricPresetConfig(getMaterialBaseColor(source), nextConfig));
    setDraft((prev) => ({
      ...prev,
      ...merged,
    }));
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

    if (selectedRecommendedPreset === 'selection_editorial_collage') {
      let collageConfig: OutfitBackgroundConfig;
      try {
        collageConfig = await buildEditorialCollageAsync(uploadedReferenceImage, presetContext);
      } catch {
        setAiLoading(false);
        setAiError('Could not build editorial collage.');
        return;
      }
      const collageUrl = collageConfig.ai_artwork?.image_url || '';
      const collageVariation: ArtworkVariation = {
        variation_id: `editorial_collage_${Date.now()}`,
        preview_url: collageUrl,
        output_url: collageUrl,
        thumbnail_url: collageUrl,
        provider: 'procedural',
        provider_job_id: null,
        provider_model: 'editorial-collage-canvas',
        metadata: { source: 'editorial_collage' },
      };
      setAiLoading(false);
      setDraft((prev) => ({ ...prev, ...collageConfig }));
      setAiResults([collageVariation]);
      setSelectedAiResult(collageVariation);
      setAiGradientResults([]);
      return;
    }

    if (selectedRecommendedPreset === 'selection_editorial_logo') {
      let logoConfig: OutfitBackgroundConfig;
      try {
        logoConfig = await buildEditorialLogoAsync(uploadedReferenceImage, presetContext, draft, editorialLogoBgUrl);
      } catch {
        setAiLoading(false);
        setAiError('Could not build editorial logo composition.');
        return;
      }
      const logoUrl = logoConfig.ai_artwork?.image_url || '';
      const logoVariation: ArtworkVariation = {
        variation_id: `editorial_logo_${Date.now()}`,
        preview_url: logoUrl, output_url: logoUrl, thumbnail_url: logoUrl,
        provider: 'procedural', provider_job_id: null, provider_model: 'editorial-logo-canvas',
        metadata: { source: 'editorial_logo' },
      };
      setAiLoading(false);
      setDraft((prev) => ({ ...prev, ...logoConfig }));
      setAiResults([logoVariation]);
      setSelectedAiResult(logoVariation);
      setAiGradientResults([]);
      return;
    }

    if (selectedRecommendedPreset === 'selection_tech_amber_energy') {
      let amberConfig: OutfitBackgroundConfig;
      try {
        amberConfig = await buildTechAmberEnergyAsync(uploadedReferenceImage, presetContext);
      } catch {
        setAiLoading(false);
        setAiError('Could not build Tech Amber Energy composition.');
        return;
      }
      const amberUrl = amberConfig.ai_artwork?.image_url || '';
      const amberVariation: ArtworkVariation = {
        variation_id: `tech_amber_${Date.now()}`,
        preview_url: amberUrl, output_url: amberUrl, thumbnail_url: amberUrl,
        provider: 'procedural', provider_job_id: null, provider_model: 'tech-amber-canvas',
        metadata: { source: 'tech_amber_energy' },
      };
      setAiLoading(false);
      setDraft((prev) => ({ ...prev, ...amberConfig }));
      setAiResults([amberVariation]);
      setSelectedAiResult(amberVariation);
      setAiGradientResults([]);
      return;
    }

    if (selectedRecommendedPreset === 'selection_tiled_motif') {
      if (!uploadedReferenceImage) {
        setAiLoading(false);
        showPresetToastError('Upload a reference image to use Tiled Motif');
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

    const typedGeometry = detectGeometryFromPrompt(aiPrompt);

    // When the user typed a geometry keyword, generate precise local SVG variants immediately.
    if (typedGeometry) {
      const localVariations = buildLocalGeometryVariations(typedGeometry, presetContext.heroColor);
      const firstSvg = localVariations[0].preview_url;
      setAiResults(localVariations);
      setSelectedAiResult(localVariations[0]);
      setDraft((prev) => ({
        ...prev,
        background_mode: 'ai_artwork',
        ai_artwork: { prompt: `${typedGeometry} variant 1`, image_url: firstSvg, generation_status: 'done' },
        shape: GEOMETRY_TO_BACKGROUND_SHAPE[typedGeometry],
      }));
      setAiLoading(false);
      return;
    }

    const effectiveGeometry = aiGeometry;
    const geometryVariation = GEOMETRY_VARIATION_MAP[effectiveGeometry][Date.now() % GEOMETRY_VARIATION_MAP[effectiveGeometry].length];
    const geometryPrompt = GEOMETRY_PROMPT_MAP[effectiveGeometry];
    const geometryNegativePrompt = GEOMETRY_NEGATIVE_PROMPT_MAP[effectiveGeometry];
    const userPrompt = aiPrompt.trim() || 'premium fashion background';
    const normalizedPrompt = [
      userPrompt,
      `Preserve geometry family: ${effectiveGeometry}.`,
      `Primary geometry direction: ${geometryPrompt}.`,
      `Premium variation direction: ${geometryVariation}.`,
    ].filter(Boolean).join(' ');
    const negativePrompt = `Avoid geometry drift. ${geometryNegativePrompt}.`;

    const studioInput: ArtworkStudioInput = {
      user_id: previewCardData.creatorId || 'anonymous',
      prompt: normalizedPrompt,
      negativePrompt,
      compositionType: aiCompositionType,
      stylePreset: aiStylePreset,
      paletteMode: aiPaletteMode,
      shapeLanguage: GEOMETRY_TO_SHAPE_LANGUAGE[effectiveGeometry],
      contrastLevel: aiContrast,
      colorIntent: aiColorIntent,
      safeAreaMode: aiSafeArea,
      generationMode: aiGenerationMode,
      referenceImageUrl: getReferenceImageForApi(),
      variationCount: 6,
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

  const generateWithGoogleAI = async () => {
    setAiLoading(true);
    setAiError(null);

    // Detect colour keywords first — instant local gradients, correct hues, no API.
    const colorTokens = detectColorFromPrompt(aiPrompt);
    if (colorTokens) {
      const variations = buildColorGradientVariations(colorTokens);
      setAiGradientResults(variations);
      setDraft((prev) => ({ ...prev, ...variations[0] }));

      // Populate the 3 artwork slots: 3 different geometry families for variety.
      const detectedGeometry = detectGeometryFromPrompt(aiPrompt) ?? 'circles';
      const GEOMETRY_FALLBACK_ORDER: GeometryFamily[] = ['circles', 'stars', 'triangles', 'arrows', 'waves', 'diamond'];
      const primaryGeo = detectedGeometry;
      // Pick two other distinct families
      const otherGeos = GEOMETRY_FALLBACK_ORDER.filter((g) => g !== primaryGeo);
      const secondGeo = otherGeos[0] ?? 'stars';
      const thirdGeo = otherGeos[1] ?? 'triangles';
      const slot1 = buildLocalGeometryVariations(primaryGeo, colorTokens.mid)[0];
      const slot2 = buildLocalGeometryVariations(secondGeo, colorTokens.mid)[0];
      const slot3 = buildLocalGeometryVariations(thirdGeo, colorTokens.mid)[0];
      const artworkSlots: ArtworkVariation[] = uploadedReferenceImage
        ? [
            {
              variation_id: `uploaded_${Date.now()}`,
              preview_url: uploadedReferenceImage,
              output_url: uploadedReferenceImage,
              thumbnail_url: uploadedReferenceImage,
              provider: 'procedural' as const,
              provider_job_id: null,
              provider_model: 'uploaded-reference',
              metadata: { source: 'uploaded_reference' },
            } satisfies ArtworkVariation,
            slot1,
            slot2,
          ]
        : [slot1, slot2, slot3];
      setAiResults(artworkSlots);
      setSelectedAiResult(artworkSlots[0] ?? null);
      setAiLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/ai/fashion/background-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: aiPrompt }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setAiError(payload.message || 'Google AI palette generation failed');
        return;
      }

      const data = payload.data;
      const rawColors: unknown[] = Array.isArray(data.palette) ? data.palette : [];
      const paletteColors = rawColors.filter((c): c is string => typeof c === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(c));

      if (!paletteColors.length) {
        setAiError('AI returned no valid palette colors. Try a more descriptive prompt.');
        return;
      }

      const c0 = paletteColors[0]!;
      const c1 = paletteColors[1] ?? c0;
      const c2 = paletteColors[2] ?? c1;
      const cLast = paletteColors[paletteColors.length - 1]!;

      // Extract angle from CSS suggestion string (e.g. "linear-gradient(135deg, ...)")
      const cssAngleMatch = typeof data.cssSuggestion === 'string' ? /(\d+)deg/.exec(data.cssSuggestion) : null;
      const suggestedAngle = cssAngleMatch ? Number(cssAngleMatch[1]) : 135;

      const paletteOptions: OutfitBackgroundConfig[] = [
        { background_mode: 'gradient', gradient: { type: 'linear', angle: suggestedAngle, intensity: 100, stops: [{ color: c0, position: 0 }, { color: cLast, position: 100 }] }, shape: 'none' },
        { background_mode: 'gradient', gradient: { type: 'linear', angle: (suggestedAngle + 45) % 360, intensity: 100, stops: [{ color: c0, position: 0 }, { color: c1, position: 50 }, { color: cLast, position: 100 }] }, shape: 'none' },
        { background_mode: 'gradient', gradient: { type: 'radial', angle: 0, intensity: 100, stops: [{ color: c1, position: 0 }, { color: c0, position: 100 }] }, shape: 'none' },
        { background_mode: 'gradient', gradient: { type: 'linear', angle: (suggestedAngle + 90) % 360, intensity: 100, stops: [{ color: c2, position: 0 }, { color: c1, position: 50 }, { color: c0, position: 100 }] }, shape: 'none' },
        { background_mode: 'gradient', gradient: { type: 'linear', angle: (suggestedAngle + 180) % 360, intensity: 100, stops: [{ color: c0, position: 0 }, { color: c2, position: 60 }, { color: cLast, position: 100 }] }, shape: 'none' },
      ];

      setAiGradientResults(paletteOptions);
      setDraft(prev => ({ ...prev, ...resolveOutfitBackgroundForRender(paletteOptions[0]) }));
    } catch {
      setAiError('Error running Google AI palette generation');
    } finally {
      setAiLoading(false);
    }
  };

  const applyVariationToDraft = (variation: ArtworkVariation) => {
    setDraft((prev) => ({
      ...prev,
      ...applyArtworkToOutfitCard({
        artwork_id: variation.variation_id,
        user_id: previewCardData.creatorId || 'anonymous',
        prompt: aiPrompt.trim() || GEOMETRY_PROMPT_MAP[aiGeometry],
        normalized_prompt: (aiPrompt.trim() || GEOMETRY_PROMPT_MAP[aiGeometry]).toLowerCase(),
        composition_type: aiCompositionType,
        style_preset: aiStylePreset,
        palette_mode: aiPaletteMode,
        shape_language: GEOMETRY_TO_SHAPE_LANGUAGE[aiGeometry],
        provider: variation.provider,
        provider_model: variation.provider_model ?? null,
        preview_url: variation.preview_url,
        output_url: variation.output_url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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

  // Live preview: when color intent changes, immediately apply matching gradient
  useEffect(() => {
    if (activeTab !== 'ai_artwork') return;
    setDraft((prev) => ({
      ...prev,
      gradient: COLOR_INTENT_TO_GRADIENT[aiColorIntent],
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiColorIntent, activeTab]);

  // Live preview: when palette mode changes (and color intent is prompt_driven), apply palette gradient
  useEffect(() => {
    if (activeTab !== 'ai_artwork' || aiColorIntent !== 'prompt_driven') return;
    setDraft((prev) => ({
      ...prev,
      gradient: PALETTE_MODE_TO_GRADIENT[aiPaletteMode],
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPaletteMode, activeTab, aiColorIntent]);

  // Generation mode switch: update preview approach
  useEffect(() => {
    if (activeTab !== 'ai_artwork') return;
    if (aiGenerationMode === 'text_prompt_pure') {
      // For pure text mode, keep current state but clear results to signal fresh start
      setAiResults([]);
      setSelectedAiResult(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiGenerationMode]);

  // Always keep 5 slots populated — generate procedural defaults when slots are empty
  useEffect(() => {
    if (activeTab !== 'ai_artwork' || aiResults.length > 0 || aiLoading) return;
    setAiResults(buildDefaultVariations(5));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, aiResults.length, aiLoading]);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-white/20 p-5 text-white shadow-[0_30px_120px_rgba(15,23,42,0.7)]"
        style={{ backgroundColor: 'var(--user-surface-solid)' }}
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
                <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/80">Visual Direction</p>
                  <p className="mt-1 text-[11px] text-white/65">Define composition and style behavior before generating.</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-white/85">Prompt</p>
                      <p className="mb-1 text-[10px] text-white/60">Use brand and mood details. Geometry control below has priority for structure.</p>
                      <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="Premium editorial fashion background with geometric layers and elegant negative space." className="min-h-20 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
                      <button type="button" onClick={generateWithGoogleAI} disabled={aiLoading || !aiPrompt.trim()} className="mt-2 w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50">✨ Generate Palette from Prompt</button>
                      <p className="mt-1 text-[9px] text-white/50">Generates a color palette and gradient from your text prompt.</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-white/85">Composition Type</p>
                      <p className="mb-1 text-[10px] text-white/60">Changes whether AI prioritizes full background, frame, overlay, or shape-pack output.</p>
                      <FancySelect value={aiCompositionType} onChange={(value) => setAiCompositionType(value as ArtworkStudioInput['compositionType'])} placeholder="Composition type" options={COMPOSITION_TYPES.map((option) => ({ value: option, label: option.replaceAll('_', ' '), hint: COMPOSITION_TYPE_DESCRIPTIONS[option] }))} />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-white/85">Style Preset</p>
                      <p className="mb-1 text-[10px] text-white/60">Controls campaign direction and visual tone.</p>
                      <FancySelect value={aiStylePreset} onChange={(value) => setAiStylePreset(value as ArtworkStylePreset)} placeholder="Style preset" options={STYLE_PRESETS.map((option) => ({ value: option, label: option.replaceAll('_', ' '), hint: STYLE_PRESET_DESCRIPTIONS[option] }))} />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-white/85">Palette Mode</p>
                      <p className="mb-1 text-[10px] text-white/60">Controls the dominant color family in generated artwork.</p>
                      <FancySelect value={aiPaletteMode} onChange={(value) => setAiPaletteMode(value as ArtworkPaletteMode)} placeholder="Palette mode" options={PALETTE_MODES.map((option) => ({
                        value: option,
                        label: option.replaceAll('_', ' '),
                        hint: `Applies ${option.replaceAll('_', ' ')} palette — updates preview instantly`,
                      }))} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/80">Color & Contrast</p>
                  <p className="mt-1 text-[11px] text-white/65">All controls below are wired to the generation payload.</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-white/85">Contrast</p>
                      <p className="mb-1 text-[10px] text-white/60">{CONTRAST_LEVEL_DESCRIPTIONS[aiContrast]}</p>
                      <FancySelect value={aiContrast} onChange={(value) => setAiContrast(value as ArtworkContrastLevel)} placeholder="Contrast" options={CONTRAST_LEVELS.map((option) => ({ value: option, label: option, hint: CONTRAST_LEVEL_DESCRIPTIONS[option] }))} />
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-white/85">Color Intent</p>
                      <p className="mb-1 text-[10px] text-white/60">Instantly applies the color palette to the preview.</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {COLOR_INTENTS.map((intent) => (
                          <button
                            key={intent.value}
                            type="button"
                            onClick={() => setAiColorIntent(intent.value as ArtworkColorIntent)}
                            className={`rounded-xl border px-2 py-2 text-left text-[10px] transition ${aiColorIntent === intent.value ? 'border-violet-300 bg-violet-500/30' : 'border-white/20 bg-white/8 hover:bg-white/15'}`}
                          >
                            <span
                              className="mb-1 block h-4 w-full rounded"
                              style={{ background: COLOR_INTENT_SWATCHES[intent.value as ArtworkColorIntent] }}
                            />
                            <span className="block truncate font-semibold text-white/90">{intent.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/80">Geometry</p>
                  <p className="mt-1 text-[11px] text-white/65">Selected geometry always wins if typed prompt conflicts.</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold text-white/85">Geometry Family</p>
                      <p className="mb-1 text-[10px] text-white/60">{GEOMETRY_DESCRIPTION_MAP[aiGeometry]}</p>
                      <FancySelect
                        value={aiGeometry}
                        onChange={(value) => {
                          const next = value as GeometryFamily;
                          setAiGeometry(next);
                          setDraft((prev) => ({ ...prev, ...buildGeometryPreviewConfig(next, presetContext.heroColor) }));
                        }}
                        placeholder="Geometry"
                        options={(Object.keys(GEOMETRY_DESCRIPTION_MAP) as GeometryFamily[]).map((option) => ({ value: option, label: option, hint: GEOMETRY_DESCRIPTION_MAP[option] }))}
                      />
                    </div>
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
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/80">Generation Mode</p>
                  <p className="mt-1 text-[11px] text-white/65">{AI_GENERATION_MODE_DESCRIPTIONS[aiGenerationMode]}</p>
                  <FancySelect value={aiGenerationMode} onChange={(value) => setAiGenerationMode(value as BackgroundGenerationMode)} placeholder="Generation mode" options={AI_GENERATION_MODES.map((option) => ({ value: option.value, label: option.label, hint: AI_GENERATION_MODE_DESCRIPTIONS[option.value] }))} />
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-2 text-[11px] text-white/75">
                  <p><span className="font-semibold text-white/85">Style preset:</span> {STYLE_PRESET_DESCRIPTIONS[aiStylePreset]}</p>
                  <p className="mt-1"><span className="font-semibold text-white/85">Contrast:</span> {CONTRAST_LEVEL_DESCRIPTIONS[aiContrast]}</p>
                  <p className="mt-1"><span className="font-semibold text-white/85">Geometry:</span> {GEOMETRY_DESCRIPTION_MAP[aiGeometry]}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button disabled={aiLoading} type="button" className="rounded-lg border border-violet-300/60 bg-violet-500/40 px-3 py-2 text-xs font-semibold disabled:opacity-60" onClick={() => void generateAiBackground()}>{aiLoading ? 'Generating...' : 'Generate AI Background'}</button>
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
                  {aiResults.map((result, index) => {
                    const previewSource = result.thumbnail_url || result.preview_url || result.output_url || '';
                    const fallbackPreviewStyle = `linear-gradient(145deg, #4c1d95, #1e40af, #0e7490)`;
                    const isSelected = selectedAiResult?.variation_id === result.variation_id;
                    return (
                    <button
                      key={result.variation_id}
                      type="button"
                      className={`relative h-20 overflow-hidden rounded-xl border transition ${isSelected ? 'border-violet-300 shadow-[0_0_0_2px_rgba(196,181,253,0.5)]' : 'border-white/20 hover:border-white/40'}`}
                      style={{
                        backgroundColor: '#0f172a',
                        backgroundImage: previewSource ? `url(${previewSource})` : fallbackPreviewStyle,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      title={`Variation ${index + 1}${result.provider ? ` · ${result.provider}` : ''}`}
                      onClick={() => {
                        setSelectedAiResult(result);
                        applyVariationToDraft(result);
                        console.debug('artwork_studio.selected_variation', result);
                      }}
                    >
                      <span className="absolute bottom-1 right-1.5 rounded bg-black/50 px-1 py-0.5 text-[9px] font-semibold text-white/80">{index + 1}</span>
                      {!previewSource && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white/40">Generating…</span>
                      )}
                    </button>
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
                          shapeLanguage: GEOMETRY_TO_SHAPE_LANGUAGE[aiGeometry],
                          contrastLevel: aiContrast,
                          colorIntent: aiColorIntent,
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

            <section className="rounded-xl border border-indigo-200/30 bg-indigo-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-indigo-100">Material Layer (Premium)</p>
              <p className="mt-1 text-[11px] text-indigo-100/80">Separate layer for textile rendering on top of color/gradient and below decorative overlays.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <FancySelect
                  value={materialConfig.type}
                  label="Material Type"
                  onChange={(value) => {
                    const preset = MATERIAL_PRESETS.find((item) => item.id === value);
                    const baseColor = draft.solid_color || draft.gradient?.stops?.[0]?.color || '#334155';
                    const next = preset && preset.id !== 'none'
                      ? preset.buildConfig(baseColor)
                      : { ...materialConfig, type: 'none' as const };
                    setMaterialConfig(next);
                    applyMaterialToDraft(next);
                  }}
                  options={MATERIAL_PRESETS.map((preset) => ({
                    value: preset.id,
                    label: preset.tier === 'premium' ? `${preset.label} · Premium` : preset.label,
                    hint: preset.description,
                  }))}
                />
                <FancySelect
                  value={materialConfig.scope}
                  label="Apply Scope"
                  onChange={(value) => {
                    const next = { ...materialConfig, scope: value as FabricMaterialConfig['scope'] };
                    setMaterialConfig(next);
                    applyMaterialToDraft(next);
                  }}
                  options={[
                    { value: 'card', label: 'Whole Card', hint: 'Applies material to complete card surface' },
                    { value: 'hero_block', label: 'Hero Block', hint: 'Applies material only on hero section' },
                    { value: 'content_block', label: 'Content Block', hint: 'Applies material on lower content area' },
                  ]}
                />
              </div>
              {materialConfig.type !== 'none' ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <label className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs">
                    Fabric Density: {materialConfig.density}
                    <input type="range" min={10} max={140} value={materialConfig.density} className="mt-1 w-full" onChange={(event) => {
                      const next = { ...materialConfig, density: Number(event.target.value) };
                      setMaterialConfig(next);
                      applyMaterialToDraft(next);
                    }} />
                  </label>
                  <label className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs">
                    Thread Thickness: {materialConfig.threadThickness.toFixed(1)}
                    <input type="range" min={0.4} max={5} step={0.1} value={materialConfig.threadThickness} className="mt-1 w-full" onChange={(event) => {
                      const next = { ...materialConfig, threadThickness: Number(event.target.value) };
                      setMaterialConfig(next);
                      applyMaterialToDraft(next);
                    }} />
                  </label>
                  <FancySelect
                    value={materialConfig.threadDirection}
                    label="Thread Direction"
                    onChange={(value) => {
                      const next = { ...materialConfig, threadDirection: value as FabricMaterialConfig['threadDirection'] };
                      setMaterialConfig(next);
                      applyMaterialToDraft(next);
                    }}
                    options={[
                      { value: 'cross', label: 'Cross Weave', hint: 'Diagonal + counter weave for textile look' },
                      { value: 'diagonal', label: 'Diagonal Weave', hint: 'Fashion-forward diagonal thread field' },
                      { value: 'horizontal', label: 'Horizontal Weave', hint: 'Horizontal stitching emphasis' },
                      { value: 'vertical', label: 'Vertical Weave', hint: 'Vertical stitching emphasis' },
                    ]}
                  />
                  <FancySelect
                    value={materialConfig.finish}
                    label="Matte / Satin Finish"
                    onChange={(value) => {
                      const next = { ...materialConfig, finish: value as FabricMaterialConfig['finish'] };
                      setMaterialConfig(next);
                      applyMaterialToDraft(next);
                    }}
                    options={[
                      { value: 'matte', label: 'Matte', hint: 'Soft low-sheen textile' },
                      { value: 'satin', label: 'Satin', hint: 'Subtle highlights and richer sheen' },
                    ]}
                  />
                  <label className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs">
                    Emboss Intensity: {materialConfig.embossIntensity}
                    <input type="range" min={0} max={100} value={materialConfig.embossIntensity} className="mt-1 w-full" onChange={(event) => {
                      const next = { ...materialConfig, embossIntensity: Number(event.target.value) };
                      setMaterialConfig(next);
                      applyMaterialToDraft(next);
                    }} />
                  </label>
                  <label className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs">
                    Surface Contrast: {materialConfig.surfaceContrast}
                    <input type="range" min={0} max={100} value={materialConfig.surfaceContrast} className="mt-1 w-full" onChange={(event) => {
                      const next = { ...materialConfig, surfaceContrast: Number(event.target.value) };
                      setMaterialConfig(next);
                      applyMaterialToDraft(next);
                    }} />
                  </label>
                </div>
              ) : null}
            </section>

            <section className="rounded-xl border border-white/20 bg-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-white/65">Recommended presets based on current outfit</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {recommendedPresets.map((preset) => {
                  const isAvailable = isPresetAvailable(preset.id, presetContext, uploadedReferenceImage);
                  const availabilityReason = getPresetAvailabilityReason(preset.id, presetContext, uploadedReferenceImage);
                  const previewConfig = applyPresetPreview({
                    presetId: preset.id,
                    context: presetContext,
                    referenceImage: uploadedReferenceImage,
                    gradient: draft.gradient,
                  });
                  const badgeLabel = !isAvailable
                    ? `🟡 ${availabilityReason}`
                    : ['selection_tech_amber_energy', 'selection_neon_motion_grid', 'selection_metallic_sport_identity'].includes(preset.id)
                      ? '🔵 AI enhanced'
                      : '🟢 Ready';

                  // Editorial logo card: div wrapper so file input can live inside
                  if (preset.id === 'selection_editorial_logo') {
                    return (
                      <div key={preset.id} className={`rounded-xl border border-white/20 bg-gradient-to-br from-white/15 via-white/8 to-transparent p-2 text-left transition ${isAvailable ? 'hover:border-fuchsia-300/60 hover:shadow-[0_10px_30px_rgba(192,132,252,0.24)]' : 'cursor-not-allowed opacity-40'}`}>
                        <button
                          type="button"
                          disabled={!isAvailable}
                          className="w-full text-left"
                          onClick={() => void applyRecommendedPresetFromReferenceImage(preset.id, uploadedReferenceImage, presetContext)}
                        >
                          <p className="text-[10px] uppercase tracking-[0.12em] text-white/60">{preset.category.replaceAll('_', ' / ')}</p>
                          <p className="text-xs font-semibold">{preset.label}</p>
                          <p className="mt-1 text-[11px] text-white/70">{preset.description}</p>
                          <p className={`mt-1 text-[10px] ${isAvailable ? 'text-emerald-200' : 'text-amber-200'}`}>{badgeLabel}</p>
                        </button>
                        <label
                          className="mt-2 flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-white/30 bg-white/8 px-2 py-1.5 text-[10px] text-white/70 transition hover:border-fuchsia-300/60 hover:text-white/90"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>📎</span>
                          <span className="truncate">{aiReferenceFileName || 'Upload reference image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const previewUrl = URL.createObjectURL(file);
                              if (aiReferenceImageUrl.startsWith('blob:')) URL.revokeObjectURL(aiReferenceImageUrl);
                              setAiReferenceImageUrl(previewUrl);
                              setAiReferenceImageDataUrl('');
                              setAiReferenceFileName(file.name);
                              setBackendWarning(null);
                            }}
                          />
                        </label>
                        <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
                          <p className="mb-1 text-[9px] uppercase tracking-[0.10em] text-white/50">Imagem de fundo</p>
                          <select
                            className="w-full rounded-lg border border-white/25 bg-white/10 px-2 py-1.5 text-[10px] text-white/80 outline-none transition focus:border-fuchsia-300/60 hover:border-white/40"
                            value={editorialLogoBgUrl}
                            onChange={(e) => setEditorialLogoBgUrl(e.target.value)}
                          >
                            {CURATED_IMAGE_PICKER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.imageUrl} className="bg-slate-900 text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span
                          className="mt-2 block h-14 rounded-lg border border-white/15"
                          style={{ ...buildBackgroundCssStyle(resolveOutfitBackgroundForRender(previewConfig)), backgroundColor: '#0f172a' }}
                        />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={!isAvailable}
                      className="rounded-xl border border-white/20 bg-gradient-to-br from-white/15 via-white/8 to-transparent p-2 text-left transition enabled:hover:border-fuchsia-300/60 enabled:hover:shadow-[0_10px_30px_rgba(192,132,252,0.24)] disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => void applyRecommendedPresetFromReferenceImage(preset.id, uploadedReferenceImage, presetContext)}
                    >
                      <p className="text-[10px] uppercase tracking-[0.12em] text-white/60">{preset.category.replaceAll('_', ' / ')}</p>
                      <p className="text-xs font-semibold">{preset.label}</p>
                      <p className="mt-1 text-[11px] text-white/70">{preset.description}</p>
                      <p className={`mt-1 text-[10px] ${isAvailable ? 'text-emerald-200' : 'text-amber-200'}`}>{badgeLabel}</p>
                      <span
                        className="mt-2 block h-14 rounded-lg border border-white/15"
                        style={{
                          ...buildBackgroundCssStyle(resolveOutfitBackgroundForRender(previewConfig)),
                          backgroundColor: '#0f172a',
                        }}
                      />
                    </button>
                  );
                })}
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
            value={(() => {
              const gradientLabel = SEGMENTED_GRADIENT_OPTIONS.find((preset) => JSON.stringify(draft.gradient) === JSON.stringify(preset.config.gradient))?.label;
              if (gradientLabel) return gradientLabel;
              if (draft.ai_artwork?.image_url === FLOWER_PICKER_IMAGE) return 'Flower';
              return CURATED_IMAGE_PICKER_OPTIONS.find((option) => option.imageUrl === draft.ai_artwork?.image_url)?.value ?? '';
            })()}
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
              if (value.startsWith('image:')) {
                const selectedImage = CURATED_IMAGE_PICKER_OPTIONS.find((option) => option.value === value);
                if (!selectedImage) return;
                setDraft((prev) => ({
                  ...prev,
                  background_mode: 'ai_artwork',
                  ai_artwork: {
                    prompt: `${selectedImage.label} curated artwork background`,
                    image_url: selectedImage.imageUrl,
                    generation_status: 'done',
                  },
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
              ...CURATED_IMAGE_PICKER_OPTIONS,
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
