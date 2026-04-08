export type BackgroundGenerationMode = 'preset_assisted' | 'hybrid' | 'text_prompt_pure';

export type BackgroundCompositionType =
  | 'radial_floral_cluster'
  | 'geometric_scatter'
  | 'layered_fog'
  | 'orbital_field'
  | 'wave_motion'
  | 'beam_directional'
  | 'structured_grid'
  | 'abstract_soft_gradient';

export type BackgroundShapeLanguage =
  | 'organic_floral'
  | 'triangular'
  | 'circles_orbs'
  | 'strokes_stripes'
  | 'stars'
  | 'diamonds'
  | 'waves'
  | 'beams'
  | 'abstract_blobs';

export type BackgroundDensity = 'minimal' | 'balanced' | 'rich';
export type BackgroundContrast = 'low' | 'medium' | 'high';
export type BackgroundMotion = 'horizontal' | 'vertical' | 'radial' | 'diagonal' | 'scattered';
export type BackgroundTexture = 'clean' | 'mist' | 'grain' | 'editorial_soft' | 'glossy';

export type BackgroundGenerationPlan = {
  generation_mode: BackgroundGenerationMode;
  detected_keywords: string[];
  detected_colors: string[];
  composition_type: BackgroundCompositionType;
  shape_language: BackgroundShapeLanguage;
  palette: [string, string, string];
  contrast_level: BackgroundContrast;
  density: BackgroundDensity;
  glow_intensity: number;
  blur_strength: number;
  layering_depth: number;
  motion_direction: BackgroundMotion;
  texture_mode: BackgroundTexture;
};

export type BackgroundGenerationInput = {
  prompt: string;
  style?: string;
  mood?: string;
  palette?: string;
  generationMode?: BackgroundGenerationMode;
  metadata?: {
    style?: string;
    occasion?: string;
    visibility?: string;
    title?: string;
    brandIdentity?: string;
    wearstyles?: string[];
    mood?: string;
    palette?: string;
    brands?: string[];
  };
};

const COLOR_MAP: Record<string, [string, string, string]> = {
  red: ['#450a0a', '#ef4444', '#fecaca'],
  orange: ['#7c2d12', '#f97316', '#fed7aa'],
  amber: ['#78350f', '#f59e0b', '#fde68a'],
  gold: ['#713f12', '#fbbf24', '#fef3c7'],
  silver: ['#030712', '#9ca3af', '#f3f4f6'],
  black: ['#020617', '#1f2937', '#9ca3af'],
  white: ['#111827', '#d1d5db', '#ffffff'],
  beige: ['#f5efe2', '#ddc7a1', '#8b6b4a'],
  cream: ['#fff7e6', '#f5deb3', '#c49a6c'],
  green: ['#052e16', '#22c55e', '#bbf7d0'],
  emerald: ['#022c22', '#10b981', '#99f6e4'],
  cyan: ['#083344', '#06b6d4', '#a5f3fc'],
  blue: ['#1e3a8a', '#3b82f6', '#bfdbfe'],
  purple: ['#3b0764', '#9333ea', '#e9d5ff'],
  violet: ['#3b0764', '#8b5cf6', '#ddd6fe'],
  pink: ['#4a044e', '#ec4899', '#fbcfe8'],
  magenta: ['#500724', '#db2777', '#fbcfe8'],
  neon: ['#09090b', '#22d3ee', '#e879f9'],
};

const STYLE_HINTS: Record<string, Partial<BackgroundGenerationPlan>> = {
  editorial: { texture_mode: 'editorial_soft', contrast_level: 'medium' },
  minimal: { density: 'minimal', contrast_level: 'low', blur_strength: 0.35 },
  geometric: { composition_type: 'structured_grid', shape_language: 'triangular' },
  runway: { composition_type: 'beam_directional', shape_language: 'beams', motion_direction: 'vertical' },
};

const MOOD_HINTS: Record<string, Partial<BackgroundGenerationPlan>> = {
  calm: { density: 'minimal', glow_intensity: 0.28, blur_strength: 0.55 },
  dreamy: { texture_mode: 'mist', blur_strength: 0.85, glow_intensity: 0.76 },
  energetic: { density: 'rich', contrast_level: 'high', glow_intensity: 0.92, motion_direction: 'diagonal' },
  bold: { contrast_level: 'high', glow_intensity: 0.8 },
  elegant: { density: 'minimal', texture_mode: 'glossy', glow_intensity: 0.35 },
};

const PALETTE_HINTS: Record<string, [string, string, string]> = {
  monochrome: ['#030712', '#4b5563', '#e5e7eb'],
  'warm neutral': ['#5b3a29', '#c8a27c', '#f5e7d1'],
  'cool luxury': ['#0b1020', '#1d4ed8', '#93c5fd'],
  'vibrant neon': ['#09090b', '#22d3ee', '#d946ef'],
  'soft pastel': ['#fbcfe8', '#bfdbfe', '#fde68a'],
  'gold accent': ['#3f2a12', '#f59e0b', '#fef3c7'],
  'black + silver': ['#020617', '#6b7280', '#f3f4f6'],
  'emerald + cyan': ['#022c22', '#06b6d4', '#99f6e4'],
};

const DEFAULT_PLAN: BackgroundGenerationPlan = {
  generation_mode: 'hybrid',
  detected_keywords: [],
  detected_colors: [],
  composition_type: 'abstract_soft_gradient',
  shape_language: 'abstract_blobs',
  palette: ['#111827', '#4f46e5', '#a78bfa'],
  contrast_level: 'medium',
  density: 'balanced',
  glow_intensity: 0.55,
  blur_strength: 0.45,
  layering_depth: 4,
  motion_direction: 'scattered',
  texture_mode: 'clean',
};

const SHAPE_KEYWORDS: Array<{ words: string[]; shape: BackgroundShapeLanguage }> = [
  { words: ['flower', 'flowers', 'floral', 'petal', 'nature', 'leaf'], shape: 'organic_floral' },
  { words: ['triangle', 'triangles'], shape: 'triangular' },
  { words: ['fruit', 'fruits', 'orb', 'sphere', 'circle', 'circles', 'dots', 'points'], shape: 'circles_orbs' },
  { words: ['line', 'lines', 'stroke', 'stripes'], shape: 'strokes_stripes' },
  { words: ['star', 'stars', 'cosmic', 'galaxy'], shape: 'stars' },
  { words: ['diamond', 'diamonds', 'gem'], shape: 'diamonds' },
  { words: ['wave', 'waves', 'flow', 'fluid'], shape: 'waves' },
  { words: ['beam', 'beams', 'light', 'streak'], shape: 'beams' },
];

const INTENSITY_KEYWORDS = ['dense', 'packed', 'layered', 'maximal', 'ultra', 'complex', 'chaotic', 'rich'];
const ATMOSPHERIC_KEYWORDS = ['cinematic', 'dramatic', 'glow', 'luminous', 'vivid', 'energetic'];

type ShapeLayerVariant = {
  dominant: BackgroundShapeLanguage;
  pool: BackgroundShapeLanguage[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createSeededRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hashText(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function normalize(prompt: string) {
  return prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function detectColors(words: string[]) {
  return Array.from(new Set(words.filter((word) => word in COLOR_MAP)));
}

export function inferCompositionFromPrompt(keywords: string[], shape: BackgroundShapeLanguage): BackgroundCompositionType {
  if (keywords.some((word) => ['flower', 'flowers', 'floral', 'petal', 'nature'].includes(word))) return 'radial_floral_cluster';
  if (keywords.some((word) => ['smoke', 'fog', 'mist', 'haze'].includes(word))) return 'layered_fog';
  if (keywords.some((word) => ['triangle', 'triangles', 'geometric', 'grid', 'structured'].includes(word))) return 'geometric_scatter';
  if (keywords.some((word) => ['wave', 'waves', 'flow', 'fluid', 'motion'].includes(word))) return 'wave_motion';
  if (keywords.some((word) => ['beam', 'beams', 'light', 'streak'].includes(word))) return 'beam_directional';
  if (keywords.some((word) => ['dense', 'packed', 'layered'].includes(word))) return 'structured_grid';
  if (shape === 'circles_orbs') return 'orbital_field';
  return 'abstract_soft_gradient';
}

function inferShapeFromPrompt(keywords: string[]): BackgroundShapeLanguage {
  const match = SHAPE_KEYWORDS.find((entry) => entry.words.some((word) => keywords.includes(word)));
  return match?.shape || 'abstract_blobs';
}

function inferDensityFromPrompt(keywords: string[]): BackgroundDensity {
  if (keywords.some((word) => ['minimal', 'clean', 'sparse', 'soft'].includes(word))) return 'minimal';
  if (keywords.some((word) => ['dense', 'rich', 'layered', 'busy'].includes(word))) return 'rich';
  return 'balanced';
}

function inferPaletteFromPrompt(words: string[], paletteSelector?: string): [string, string, string] {
  const colorHits = detectColors(words);
  if (colorHits.length) return COLOR_MAP[colorHits[0]];
  if (paletteSelector) {
    const key = Object.keys(PALETTE_HINTS).find((candidate) => paletteSelector.toLowerCase().includes(candidate));
    if (key) return PALETTE_HINTS[key];
  }
  return DEFAULT_PLAN.palette;
}

export function parseBackgroundPrompt(prompt: string) {
  const normalized = normalize(prompt);
  const words = normalized.split(/\s+/).filter(Boolean);
  const keywords = Array.from(new Set(words));
  return {
    normalized,
    words,
    keywords,
    colors: detectColors(words),
  };
}

export function buildBackgroundGenerationPlan(input: BackgroundGenerationInput): BackgroundGenerationPlan {
  const generationMode = input.generationMode || 'hybrid';
  const parsedPrompt = parseBackgroundPrompt(input.prompt);
  const metadataText = [
    input.metadata?.style,
    input.metadata?.occasion,
    input.metadata?.title,
    input.metadata?.brandIdentity,
    input.metadata?.wearstyles?.join(' '),
    input.metadata?.brands?.join(' '),
    input.metadata?.mood,
    input.metadata?.palette,
  ]
    .filter(Boolean)
    .join(' ');

  const parsedMetadata = parseBackgroundPrompt(metadataText);
  const promptKeywords = parsedPrompt.keywords;
  const styleKeywords = parseBackgroundPrompt(input.style || '').keywords;
  const moodKeywords = parseBackgroundPrompt(input.mood || '').keywords;
  const paletteKeywords = parseBackgroundPrompt(input.palette || '').keywords;

  const combinedKeywords = generationMode === 'text_prompt_pure'
    ? [...promptKeywords, ...styleKeywords, ...moodKeywords, ...paletteKeywords, ...parsedMetadata.keywords]
    : [...promptKeywords, ...parsedMetadata.keywords, ...styleKeywords, ...moodKeywords, ...paletteKeywords];

  const shapeLanguage = inferShapeFromPrompt(combinedKeywords);
  const compositionType = inferCompositionFromPrompt(combinedKeywords, shapeLanguage);
  const intenseDensityRequested = combinedKeywords.some((word) => INTENSITY_KEYWORDS.includes(word));
  const cinematicMoodRequested = combinedKeywords.some((word) => ATMOSPHERIC_KEYWORDS.includes(word));

  const plan: BackgroundGenerationPlan = {
    ...DEFAULT_PLAN,
    generation_mode: generationMode,
    detected_keywords: Array.from(new Set(combinedKeywords)).slice(0, 40),
    detected_colors: parsedPrompt.colors,
    composition_type: compositionType,
    shape_language: shapeLanguage,
    density: inferDensityFromPrompt(combinedKeywords),
    palette: inferPaletteFromPrompt(parsedPrompt.words, input.palette),
  };

  if (generationMode !== 'text_prompt_pure') {
    const styleMatch = input.style ? Object.keys(STYLE_HINTS).find((key) => input.style?.toLowerCase().includes(key)) : null;
    const moodMatch = input.mood ? Object.keys(MOOD_HINTS).find((key) => input.mood?.toLowerCase().includes(key)) : null;
    if (styleMatch) Object.assign(plan, STYLE_HINTS[styleMatch]);
    if (moodMatch) Object.assign(plan, MOOD_HINTS[moodMatch]);
  } else {
    const styleMatch = input.style ? Object.keys(STYLE_HINTS).find((key) => input.style?.toLowerCase().includes(key)) : null;
    const moodMatch = input.mood ? Object.keys(MOOD_HINTS).find((key) => input.mood?.toLowerCase().includes(key)) : null;
    const paletteMatch = input.palette ? Object.keys(PALETTE_HINTS).find((key) => input.palette?.toLowerCase().includes(key)) : null;

    if (styleMatch) Object.assign(plan, { ...STYLE_HINTS[styleMatch], composition_type: plan.composition_type, shape_language: plan.shape_language });
    if (moodMatch) Object.assign(plan, MOOD_HINTS[moodMatch]);
    if (!plan.detected_colors.length && paletteMatch) plan.palette = PALETTE_HINTS[paletteMatch];
  }

  if (combinedKeywords.some((word) => ['horizontal'].includes(word))) plan.motion_direction = 'horizontal';
  if (combinedKeywords.some((word) => ['vertical'].includes(word))) plan.motion_direction = 'vertical';
  if (combinedKeywords.some((word) => ['radial', 'cluster'].includes(word))) plan.motion_direction = 'radial';
  if (combinedKeywords.some((word) => ['diagonal', 'dynamic'].includes(word))) plan.motion_direction = 'diagonal';
  if (combinedKeywords.some((word) => ['smoke', 'mist', 'fog'].includes(word))) plan.texture_mode = 'mist';

  if (plan.density === 'minimal') {
    plan.layering_depth = 4;
    plan.glow_intensity = clamp(plan.glow_intensity - 0.12, 0.18, 0.95);
  } else if (plan.density === 'rich') {
    plan.layering_depth = 9;
    plan.glow_intensity = clamp(plan.glow_intensity + 0.24, 0.18, 0.98);
  } else {
    plan.layering_depth = 6;
  }

  if (intenseDensityRequested) {
    plan.density = 'rich';
    plan.layering_depth = clamp(plan.layering_depth + 3, 7, 12);
    plan.glow_intensity = clamp(plan.glow_intensity + 0.2, 0.35, 0.98);
    plan.blur_strength = clamp(plan.blur_strength + 0.15, 0.32, 0.95);
    plan.contrast_level = plan.contrast_level === 'low' ? 'medium' : 'high';
  }

  if (cinematicMoodRequested) {
    plan.glow_intensity = clamp(plan.glow_intensity + 0.12, 0.2, 0.98);
    plan.blur_strength = clamp(plan.blur_strength + 0.08, 0.18, 0.95);
  }

  if (!input.prompt.trim()) {
    plan.composition_type = 'abstract_soft_gradient';
    plan.shape_language = 'abstract_blobs';
  }

  return plan;
}

function gradientFromPlan(plan: BackgroundGenerationPlan, angle: number, type: 'linear' | 'radial' | 'conic') {
  return {
    background_mode: 'gradient' as const,
    gradient: {
      type,
      angle,
      intensity: Math.round((0.7 + plan.glow_intensity * 0.6) * 100),
      stops: [
        { color: plan.palette[0], position: 0 },
        { color: plan.palette[1], position: 54 },
        { color: plan.palette[2], position: 100 },
      ],
    },
    shape: ['triangular', 'diamonds'].includes(plan.shape_language) ? 'diamond' as const : plan.shape_language === 'circles_orbs' ? 'orb' as const : 'mesh' as const,
    label: `AI ${plan.shape_language} ${type}`,
  };
}

function resolveShapeMix(dominant: BackgroundShapeLanguage): ShapeLayerVariant {
  const fallback: BackgroundShapeLanguage[] = ['abstract_blobs', 'circles_orbs', 'stars', 'strokes_stripes'];
  const families: Record<BackgroundShapeLanguage, BackgroundShapeLanguage[]> = {
    organic_floral: ['circles_orbs', 'abstract_blobs', 'waves'],
    triangular: ['beams', 'diamonds', 'strokes_stripes'],
    circles_orbs: ['abstract_blobs', 'stars', 'waves'],
    strokes_stripes: ['beams', 'waves', 'triangular'],
    stars: ['diamonds', 'circles_orbs', 'beams'],
    diamonds: ['stars', 'triangular', 'beams'],
    waves: ['strokes_stripes', 'abstract_blobs', 'circles_orbs'],
    beams: ['triangular', 'strokes_stripes', 'diamonds'],
    abstract_blobs: ['circles_orbs', 'waves', 'stars'],
  };

  return {
    dominant,
    pool: [dominant, ...(families[dominant] || fallback)],
  };
}

function pickShapeLanguage(pool: BackgroundShapeLanguage[], random: () => number, dominance: number) {
  if (random() < dominance) return pool[0];
  const idx = 1 + Math.floor(random() * Math.max(1, pool.length - 1));
  return pool[idx] || pool[0];
}

function sampleShapeSize(random: () => number, baseScale: number) {
  const weighted = Math.pow(random(), 2.4); // muitos pequenos, poucos grandes
  let multiplier = 0.25 + weighted * 1.4;
  if (random() < 0.07) multiplier *= 1.6; // alguns grandes
  if (random() < 0.015) multiplier *= 2.2; // raros gigantes
  return Math.max(10, Math.round(baseScale * multiplier));
}

function buildShapeLayer(plan: BackgroundGenerationPlan, random: () => number, layerIndex: number, totalLayers: number) {
  const layerProgress = totalLayers <= 1 ? 1 : layerIndex / (totalLayers - 1);
  const baseCount = plan.density === 'minimal' ? 20 : plan.density === 'rich' ? 120 : 60;
  const layerMultiplier = 0.62 + (1 - layerProgress) * 0.95;
  const count = Math.round(baseCount * layerMultiplier + random() * baseCount * 0.2);
  const shapeMix = resolveShapeMix(plan.shape_language);
  const dominance = 0.58 + layerProgress * 0.28;
  const baseScale = (plan.density === 'rich' ? 220 : plan.density === 'balanced' ? 170 : 135) * (0.7 + layerProgress * 0.55);
  const clusterCount = 2 + Math.floor(random() * 3);
  const clusters = Array.from({ length: clusterCount }).map(() => ({
    x: 120 + random() * 960,
    y: 90 + random() * 620,
    radius: 140 + random() * 230,
  }));
  let out = '';

  for (let i = 0; i < count; i += 1) {
    const useCluster = random() < 0.42;
    const cluster = useCluster ? clusters[Math.floor(random() * clusters.length)] : null;
    const baseX = cluster ? cluster.x + (random() - 0.5) * cluster.radius : random() * 1200;
    const baseY = cluster ? cluster.y + (random() - 0.5) * cluster.radius : random() * 800;
    const driftX = (random() - 0.5) * (40 + (1 - layerProgress) * 120);
    const driftY = (random() - 0.5) * (40 + (1 - layerProgress) * 90);
    let x = clamp(Math.round(baseX + driftX), -140, 1340);
    let y = clamp(Math.round(baseY + driftY), -120, 920);
    if (plan.composition_type === 'structured_grid' && random() < 0.72) {
      const grid = 64 + Math.round((1 - layerProgress) * 26);
      x = Math.round(x / grid) * grid + Math.round((random() - 0.5) * 14);
      y = Math.round(y / grid) * grid + Math.round((random() - 0.5) * 14);
    }
    if (plan.composition_type === 'orbital_field' && random() < 0.6) {
      const radius = 90 + random() * (250 + (1 - layerProgress) * 240);
      const angle = random() * Math.PI * 2;
      x = Math.round(600 + Math.cos(angle) * radius + (random() - 0.5) * 40);
      y = Math.round(400 + Math.sin(angle) * radius * 0.76 + (random() - 0.5) * 40);
    }
    if (plan.composition_type === 'beam_directional' && random() < 0.7) {
      x = Math.round(120 + random() * 960);
      y = Math.round((random() ** 1.15) * 900) - 60;
    }

    const size = sampleShapeSize(random, baseScale);
    const opacityFloor = 0.05 + (layerProgress * 0.16);
    const opacityCeil = 0.34 + (layerProgress * 0.45);
    const opacity = (opacityFloor + random() * (opacityCeil - opacityFloor)).toFixed(3);
    const fill = plan.palette[Math.floor(random() * plan.palette.length)];
    const currentShape = pickShapeLanguage(shapeMix.pool, random, dominance);

    if (currentShape === 'organic_floral') {
      out += `<g opacity='${opacity}' transform='translate(${x} ${y})'><circle r='${Math.round(size / 8)}' fill='${fill}'/><ellipse rx='${Math.round(size / 10)}' ry='${Math.round(size / 4)}' fill='${fill}' transform='rotate(0)'/><ellipse rx='${Math.round(size / 10)}' ry='${Math.round(size / 4)}' fill='${fill}' transform='rotate(72)'/><ellipse rx='${Math.round(size / 10)}' ry='${Math.round(size / 4)}' fill='${fill}' transform='rotate(144)'/></g>`;
    } else if (currentShape === 'triangular') {
      out += `<polygon points='${x},${y - size / 2} ${x + size / 2},${y + size / 2} ${x - size / 2},${y + size / 2}' fill='${fill}' opacity='${opacity}' stroke='rgba(255,255,255,0.22)' stroke-width='2'/>`;
    } else if (currentShape === 'circles_orbs') {
      out += `<circle cx='${x}' cy='${y}' r='${Math.round(size / 2.8)}' fill='${fill}' opacity='${opacity}' stroke='rgba(255,255,255,0.18)' stroke-width='2'/>`;
    } else if (currentShape === 'strokes_stripes') {
      out += `<line x1='${x}' y1='${y}' x2='${x + size}' y2='${y + (random() - 0.5) * 80}' stroke='${fill}' stroke-width='${Math.round(size / 18)}' stroke-linecap='round' opacity='${opacity}'/>`;
    } else if (currentShape === 'stars') {
      out += `<polygon points='${x},${y - size / 3} ${x + size / 10},${y - size / 10} ${x + size / 3},${y - size / 10} ${x + size / 6},${y + size / 10} ${x + size / 5},${y + size / 3} ${x},${y + size / 6} ${x - size / 5},${y + size / 3} ${x - size / 6},${y + size / 10} ${x - size / 3},${y - size / 10} ${x - size / 10},${y - size / 10}' fill='${fill}' opacity='${opacity}'/>`;
    } else if (currentShape === 'diamonds') {
      out += `<rect x='${x}' y='${y}' width='${Math.round(size / 1.8)}' height='${Math.round(size / 1.8)}' transform='rotate(45 ${x} ${y})' fill='${fill}' opacity='${opacity}' rx='10' stroke='rgba(255,255,255,0.2)' stroke-width='2'/>`;
    } else if (currentShape === 'waves') {
      out += `<path d='M ${x} ${y} C ${x + size / 2} ${y - size / 2}, ${x + size} ${y + size / 2}, ${x + size * 1.4} ${y}' stroke='${fill}' stroke-width='${Math.round(size / 16)}' fill='none' opacity='${opacity}'/>`;
    } else if (currentShape === 'beams') {
      out += `<rect x='${x}' y='${y}' width='${Math.round(size / 6)}' height='${Math.round(size * 2)}' fill='${fill}' opacity='${opacity}' rx='10'/>`;
    } else {
      out += `<ellipse cx='${x}' cy='${y}' rx='${Math.round(size / 2)}' ry='${Math.round(size / 3)}' fill='${fill}' opacity='${opacity}'/>`;
    }
  }

  return out;
}

export function generateProceduralBackground(plan: BackgroundGenerationPlan, seed: number, prompt: string) {
  const random = createSeededRng(seed);
  const angle = Math.floor(random() * 360);
  const layerCount = clamp(
    plan.layering_depth + (plan.density === 'rich' ? 2 : plan.density === 'minimal' ? -1 : 1),
    plan.density === 'minimal' ? 3 : 5,
    12,
  );
  const layerDefinitions = Array.from({ length: layerCount }).map((_, layerIndex) => {
    const layerProgress = layerCount <= 1 ? 1 : layerIndex / (layerCount - 1);
    const blurBoost = plan.density === 'rich' ? 1.35 : 1;
    const blur = Math.round((plan.blur_strength * (10 + (1 - layerProgress) * 22) + 1.5) * blurBoost);
    const layerOpacity = clamp((0.2 + plan.glow_intensity * 0.72) * (0.62 + layerProgress * 0.58), 0.14, 0.98);
    const shapes = buildShapeLayer(plan, random, layerIndex, layerCount);
    return { blur, layerOpacity, layerProgress, shapes, id: `softBlur${layerIndex}` };
  });
  const textureOpacity = plan.texture_mode === 'grain' ? 0.23 : plan.texture_mode === 'mist' ? 0.34 : 0.12;
  const safePrompt = prompt.slice(0, 100).replace(/[<>]/g, '');

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs>
      <linearGradient id='base' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${plan.palette[0]}'/>
        <stop offset='55%' stop-color='${plan.palette[1]}'/>
        <stop offset='100%' stop-color='${plan.palette[2]}'/>
      </linearGradient>
      ${layerDefinitions.map((layer) => `<filter id='${layer.id}'><feGaussianBlur stdDeviation='${layer.blur}'/></filter>`).join('')}
      <pattern id='grain' width='40' height='40' patternUnits='userSpaceOnUse'>
        <circle cx='10' cy='8' r='1' fill='rgba(255,255,255,0.35)'/>
        <circle cx='24' cy='18' r='1' fill='rgba(0,0,0,0.25)'/>
      </pattern>
    </defs>
    <rect width='1200' height='800' fill='url(#base)'/>
    ${layerDefinitions.map((layer) => `<g filter='url(#${layer.id})' opacity='${layer.layerOpacity.toFixed(3)}'>${layer.shapes}</g>`).join('')}
    <rect width='1200' height='800' fill='rgba(255,255,255,0.04)' opacity='${clamp(plan.glow_intensity * 0.55, 0.06, 0.4)}'/>
    <rect width='1200' height='800' fill='url(#grain)' opacity='${textureOpacity}'/>
    <rect x='0' y='0' width='460' height='800' fill='rgba(15,23,42,0.12)'/>
    <rect width='1200' height='800' fill='rgba(255,255,255,0.06)' transform='rotate(${angle} 600 400)'/>
    <text x='48' y='742' fill='rgba(255,255,255,0.35)' font-size='22' font-family='Arial'>${safePrompt}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateBackgroundVariations(plan: BackgroundGenerationPlan, prompt: string, count = 4) {
  const baseSeed = hashText(`${prompt}-${plan.shape_language}-${plan.composition_type}-${plan.palette.join('-')}`);
  return Array.from({ length: count }).map((_, idx) => {
    const seed = baseSeed + idx * 7919;
    const gradientType = idx % 3 === 0 ? 'linear' : idx % 3 === 1 ? 'radial' : 'conic';
    return {
      image: generateProceduralBackground(plan, seed, prompt),
      gradient: gradientFromPlan(plan, (seed % 360) + idx * 17, gradientType),
      seed,
    };
  });
}
