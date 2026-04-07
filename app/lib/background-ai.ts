export type BackgroundCompositionType =
  | 'radial_cluster'
  | 'floating_shapes'
  | 'editorial_overlay'
  | 'soft_blobs'
  | 'geometric_runway'
  | 'light_beams'
  | 'mesh_gradient'
  | 'orbital_fields';

export type BackgroundShapeLanguage =
  | 'circles'
  | 'diamonds'
  | 'stars'
  | 'soft_blobs'
  | 'panels'
  | 'waves'
  | 'beams'
  | 'mixed';

export type BackgroundDensity = 'minimal' | 'balanced' | 'rich';
export type BackgroundContrast = 'low' | 'medium' | 'high';
export type BackgroundMotion = 'horizontal' | 'vertical' | 'radial' | 'diagonal' | 'scattered';
export type BackgroundTexture = 'clean' | 'mist' | 'grain' | 'editorial_soft' | 'glossy';
export type BackgroundHighlight = 'center_focus' | 'edge_focus' | 'distributed' | 'hero-safe';

export type BackgroundGenerationPlan = {
  detected_keywords: string[];
  composition_type: BackgroundCompositionType;
  palette: [string, string, string];
  contrast_level: BackgroundContrast;
  shape_language: BackgroundShapeLanguage;
  density: BackgroundDensity;
  glow_intensity: number;
  blur_strength: number;
  layering_depth: number;
  motion_direction: BackgroundMotion;
  texture_mode: BackgroundTexture;
  highlight_strategy: BackgroundHighlight;
};

export type BackgroundGenerationInput = {
  prompt: string;
  style?: string;
  mood?: string;
  palette?: string;
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

const KEYWORD_MAP: Array<{ words: string[]; updates: Partial<BackgroundGenerationPlan>; palette?: [string, string, string] }> = [
  { words: ['orange', 'amber', 'gold', 'sunset'], updates: { shape_language: 'circles', composition_type: 'orbital_fields' }, palette: ['#7c2d12', '#fb923c', '#ffedd5'] },
  { words: ['silver', 'smoke', 'mist', 'fog'], updates: { composition_type: 'soft_blobs', texture_mode: 'mist', shape_language: 'soft_blobs', density: 'minimal' }, palette: ['#05070f', '#6b7280', '#f3f4f6'] },
  { words: ['emerald', 'cyan', 'aqua', 'teal'], updates: { composition_type: 'geometric_runway', shape_language: 'diamonds' }, palette: ['#022c22', '#10b981', '#99f6e4'] },
  { words: ['beige', 'cream', 'studio', 'soft'], updates: { composition_type: 'editorial_overlay', texture_mode: 'editorial_soft', density: 'minimal' }, palette: ['#f5efe2', '#e7d9bf', '#b08968'] },
  { words: ['neon', 'streetwear', 'energy', 'electric'], updates: { contrast_level: 'high', glow_intensity: 0.9, composition_type: 'light_beams', shape_language: 'beams', density: 'rich' }, palette: ['#0b1020', '#22d3ee', '#d946ef'] },
  { words: ['diamond', 'geometric', 'runway'], updates: { shape_language: 'diamonds', composition_type: 'geometric_runway' } },
  { words: ['star', 'cosmic', 'galaxy'], updates: { shape_language: 'stars', composition_type: 'radial_cluster' }, palette: ['#111827', '#7c3aed', '#e0e7ff'] },
  { words: ['wave', 'flow', 'fluid'], updates: { shape_language: 'waves', composition_type: 'floating_shapes' } },
  { words: ['panel', 'editorial', 'magazine'], updates: { shape_language: 'panels', composition_type: 'editorial_overlay' } },
];

const PALETTES: Record<string, [string, string, string]> = {
  monochrome: ['#0b1120', '#4b5563', '#e5e7eb'],
  warm: ['#7c2d12', '#f59e0b', '#fef3c7'],
  sunset: ['#7c2d12', '#fb923c', '#fde68a'],
  cool: ['#082f49', '#0ea5e9', '#bae6fd'],
  emerald: ['#022c22', '#10b981', '#99f6e4'],
  violet: ['#2e1065', '#7c3aed', '#ddd6fe'],
  pastel: ['#fde68a', '#bfdbfe', '#fbcfe8'],
  luxury: ['#020617', '#6b7280', '#f8fafc'],
};

const STYLE_HINTS: Record<string, Partial<BackgroundGenerationPlan>> = {
  editorial: { composition_type: 'editorial_overlay', texture_mode: 'editorial_soft', shape_language: 'panels' },
  runway: { composition_type: 'light_beams', shape_language: 'beams', motion_direction: 'vertical' },
  abstract: { composition_type: 'floating_shapes', shape_language: 'mixed' },
  geometric: { composition_type: 'geometric_runway', shape_language: 'diamonds' },
  minimal: { density: 'minimal', contrast_level: 'low', highlight_strategy: 'hero-safe' },
};

const MOOD_HINTS: Record<string, Partial<BackgroundGenerationPlan>> = {
  calm: { glow_intensity: 0.25, density: 'minimal', contrast_level: 'low' },
  dreamy: { blur_strength: 0.8, texture_mode: 'mist', glow_intensity: 0.7 },
  energetic: { glow_intensity: 0.92, density: 'rich', contrast_level: 'high', motion_direction: 'diagonal' },
  dramatic: { contrast_level: 'high', texture_mode: 'glossy' },
  elegant: { density: 'minimal', texture_mode: 'clean', highlight_strategy: 'edge_focus' },
};

const DEFAULT_PLAN: BackgroundGenerationPlan = {
  detected_keywords: [],
  composition_type: 'mesh_gradient',
  palette: ['#0f172a', '#6366f1', '#a855f7'],
  contrast_level: 'medium',
  shape_language: 'mixed',
  density: 'balanced',
  glow_intensity: 0.55,
  blur_strength: 0.45,
  layering_depth: 4,
  motion_direction: 'scattered',
  texture_mode: 'clean',
  highlight_strategy: 'hero-safe',
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

function detectKeywords(prompt: string): string[] {
  const normalized = prompt.toLowerCase();
  const keywords = new Set<string>();
  KEYWORD_MAP.forEach((entry) => {
    entry.words.forEach((word) => {
      if (normalized.includes(word)) keywords.add(word);
    });
  });
  return Array.from(keywords);
}

export function parseBackgroundPrompt(prompt: string) {
  const normalized = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);
  return {
    normalized,
    words,
    keywords: detectKeywords(prompt),
  };
}

export function buildBackgroundGenerationPlan(input: BackgroundGenerationInput): BackgroundGenerationPlan {
  const parsed = parseBackgroundPrompt(input.prompt);
  const mergedText = [input.prompt, input.style, input.mood, input.palette, input.metadata?.style, input.metadata?.occasion, input.metadata?.title, input.metadata?.brandIdentity, input.metadata?.mood, input.metadata?.palette, input.metadata?.wearstyles?.join(' '), input.metadata?.brands?.join(' ')].filter(Boolean).join(' ').toLowerCase();

  const plan: BackgroundGenerationPlan = {
    ...DEFAULT_PLAN,
    detected_keywords: parsed.keywords,
  };

  KEYWORD_MAP.forEach((entry) => {
    const hit = entry.words.some((word) => mergedText.includes(word));
    if (hit) {
      Object.assign(plan, entry.updates);
      if (entry.palette) plan.palette = entry.palette;
    }
  });

  if (input.palette) {
    const paletteKey = input.palette.toLowerCase();
    const match = Object.keys(PALETTES).find((key) => paletteKey.includes(key));
    if (match) plan.palette = PALETTES[match];
  }

  if (input.style) {
    const styleKey = input.style.toLowerCase();
    const match = Object.keys(STYLE_HINTS).find((key) => styleKey.includes(key));
    if (match) Object.assign(plan, STYLE_HINTS[match]);
  }

  if (input.mood) {
    const moodKey = input.mood.toLowerCase();
    const match = Object.keys(MOOD_HINTS).find((key) => moodKey.includes(key));
    if (match) Object.assign(plan, MOOD_HINTS[match]);
  }

  plan.layering_depth = clamp(plan.layering_depth + Math.floor(parsed.words.length / 5), 3, 8);
  if (plan.density === 'minimal') {
    plan.layering_depth = clamp(plan.layering_depth - 2, 2, 5);
  } else if (plan.density === 'rich') {
    plan.layering_depth = clamp(plan.layering_depth + 1, 4, 9);
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
        { color: plan.palette[1], position: 52 },
        { color: plan.palette[2], position: 100 },
      ],
    },
    shape: plan.shape_language === 'diamonds' ? 'diamond' as const : plan.shape_language === 'circles' ? 'orb' as const : 'mesh' as const,
    label: `AI ${plan.shape_language} ${type}`,
  };
}

function buildShapeLayer(plan: BackgroundGenerationPlan, random: () => number) {
  const baseCount = plan.density === 'minimal' ? 6 : plan.density === 'rich' ? 24 : 14;
  const count = baseCount + Math.floor(random() * 6);
  let out = '';

  for (let i = 0; i < count; i += 1) {
    const x = Math.round(random() * 1200);
    const y = Math.round(random() * 800);
    const size = Math.round(16 + random() * 220);
    const opacity = (0.08 + random() * 0.28).toFixed(2);
    const fill = plan.palette[Math.floor(random() * plan.palette.length)];

    if (plan.shape_language === 'circles' || (plan.shape_language === 'mixed' && i % 3 === 0)) {
      out += `<circle cx='${x}' cy='${y}' r='${Math.round(size / 3)}' fill='${fill}' opacity='${opacity}'/>`;
    } else if (plan.shape_language === 'diamonds') {
      out += `<rect x='${x}' y='${y}' width='${Math.round(size / 2)}' height='${Math.round(size / 2)}' transform='rotate(45 ${x} ${y})' fill='${fill}' opacity='${opacity}' rx='8'/>`;
    } else if (plan.shape_language === 'stars') {
      out += `<polygon points='${x},${y - size / 3} ${x + size / 10},${y - size / 10} ${x + size / 3},${y - size / 10} ${x + size / 6},${y + size / 10} ${x + size / 5},${y + size / 3} ${x},${y + size / 6} ${x - size / 5},${y + size / 3} ${x - size / 6},${y + size / 10} ${x - size / 3},${y - size / 10} ${x - size / 10},${y - size / 10}' fill='${fill}' opacity='${opacity}'/>`;
    } else if (plan.shape_language === 'panels') {
      out += `<rect x='${x}' y='${y}' width='${Math.round(size)}' height='${Math.round(size / 2)}' fill='${fill}' opacity='${opacity}' rx='18'/>`;
    } else if (plan.shape_language === 'waves') {
      out += `<path d='M ${x} ${y} C ${x + size / 2} ${y - size / 2}, ${x + size} ${y + size / 2}, ${x + size * 1.4} ${y}' stroke='${fill}' stroke-width='${Math.round(size / 18)}' fill='none' opacity='${opacity}'/>`;
    } else if (plan.shape_language === 'beams') {
      out += `<rect x='${x}' y='${y}' width='${Math.round(size / 5)}' height='${Math.round(size * 2)}' fill='${fill}' opacity='${opacity}' rx='12'/>`;
    } else {
      out += `<ellipse cx='${x}' cy='${y}' rx='${Math.round(size / 2)}' ry='${Math.round(size / 3)}' fill='${fill}' opacity='${opacity}'/>`;
    }
  }

  return out;
}

export function generateProceduralBackground(plan: BackgroundGenerationPlan, seed: number, prompt: string) {
  const random = createSeededRng(seed);
  const angle = Math.floor(random() * 360);
  const shapeLayer = buildShapeLayer(plan, random);
  const textureOpacity = plan.texture_mode === 'grain' ? 0.2 : plan.texture_mode === 'mist' ? 0.34 : 0.12;
  const safePrompt = prompt.slice(0, 100).replace(/[<>]/g, '');

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs>
      <linearGradient id='base' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${plan.palette[0]}'/>
        <stop offset='55%' stop-color='${plan.palette[1]}'/>
        <stop offset='100%' stop-color='${plan.palette[2]}'/>
      </linearGradient>
      <filter id='softBlur'>
        <feGaussianBlur stdDeviation='${Math.round(plan.blur_strength * 18)}'/>
      </filter>
      <radialGradient id='heroSafe' cx='0.72' cy='0.4' r='0.72'>
        <stop offset='0%' stop-color='rgba(0,0,0,0)'/>
        <stop offset='100%' stop-color='rgba(0,0,0,0.28)'/>
      </radialGradient>
      <pattern id='grain' width='40' height='40' patternUnits='userSpaceOnUse'>
        <circle cx='10' cy='8' r='1' fill='rgba(255,255,255,0.35)'/>
        <circle cx='24' cy='18' r='1' fill='rgba(0,0,0,0.25)'/>
        <circle cx='35' cy='30' r='1' fill='rgba(255,255,255,0.26)'/>
      </pattern>
    </defs>
    <rect width='1200' height='800' fill='url(#base)'/>
    <g filter='url(#softBlur)' opacity='${clamp(plan.glow_intensity, 0.2, 1)}'>${shapeLayer}</g>
    <rect width='1200' height='800' fill='url(#grain)' opacity='${textureOpacity}'/>
    <rect x='0' y='0' width='500' height='800' fill='rgba(15,23,42,0.20)'/>
    <rect width='1200' height='800' fill='url(#heroSafe)' transform='rotate(${angle} 600 400)'/>
    <text x='48' y='742' fill='rgba(255,255,255,0.38)' font-size='22' font-family='Arial'>${safePrompt}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateBackgroundVariations(plan: BackgroundGenerationPlan, prompt: string, count = 4) {
  const baseSeed = hashText(`${prompt}-${plan.shape_language}-${plan.palette.join('-')}`);
  return Array.from({ length: count }).map((_, idx) => {
    const seed = baseSeed + idx * 7919;
    return {
      image: generateProceduralBackground(plan, seed, prompt),
      gradient: gradientFromPlan(plan, (seed % 360) + idx * 24, idx % 3 === 0 ? 'linear' : idx % 3 === 1 ? 'radial' : 'conic'),
      seed,
    };
  });
}
