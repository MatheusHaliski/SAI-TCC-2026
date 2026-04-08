'use client';

import { useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import {
  OutfitBackgroundConfig,
  OutfitCardData,
  buildBackgroundCssStyle,
  resolveOutfitBackgroundForRender,
} from '@/app/lib/outfit-card';
import { BackgroundGenerationMode } from '@/app/lib/background-ai';
import type {
  ArtworkAsset,
  ArtworkContrastLevel,
  ArtworkGenerationResponse,
  ArtworkPaletteMode,
  ArtworkShapeLanguage,
  ArtworkStudioInput,
  ArtworkStylePreset,
  ArtworkVariation,
} from '@/app/backend/types/artwork-studio';
import { applyArtworkToOutfitCard } from '@/app/lib/artwork-studio';

type StudioTab = 'color' | 'gradient' | 'ai_artwork';

type RecommendedPreset = {
  label: string;
  description: string;
  config: OutfitBackgroundConfig;
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
];

const STYLE_PRESETS: ArtworkStylePreset[] = ['editorial_fashion', 'luxury_minimal', 'futuristic_sport', 'streetwear', 'monochrome_premium'];
const PALETTE_MODES: ArtworkPaletteMode[] = ['monochrome', 'cool_luxury', 'warm_neutral', 'custom'];
const SHAPE_LANGUAGES: ArtworkShapeLanguage[] = ['diamond', 'orb', 'mesh', 'panels', 'mixed'];
const COMPOSITION_TYPES: Array<ArtworkStudioInput['compositionType']> = ['background', 'shape_pack', 'overlay', 'frame'];
const CONTRAST_LEVELS: ArtworkContrastLevel[] = ['low', 'medium', 'high'];
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

function getRecommendedPresets(metadata?: OutfitMetadata): RecommendedPreset[] {
  const palette = metadata?.palette?.toLowerCase() || '';
  if (palette.includes('black') || palette.includes('silver') || palette.includes('mono')) {
    return [
      { label: 'Silver Mist', description: 'High-fashion monochrome depth', config: GRADIENT_PRESETS[2].config },
      { label: 'Monochrome Editorial', description: 'Clean silver-black art direction', config: { ...GRADIENT_PRESETS[2].config, shape: 'none' } },
      { label: 'Black Luxury Fade', description: 'Safe contrast for text-heavy cards', config: { background_mode: 'solid', solid_color: '#0f172a', shape: 'none' } },
    ];
  }

  return [
    { label: 'Editorial Dark', description: 'Premium dark runway finish', config: GRADIENT_PRESETS[0].config },
    { label: 'Emerald Luxury', description: 'Fashion-tech pop with depth', config: GRADIENT_PRESETS[1].config },
    { label: 'Soft Runway', description: 'Warm-neutral studio background', config: GRADIENT_PRESETS[4].config },
  ];
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
  const [aiNegativePrompt, setAiNegativePrompt] = useState('');
  const [aiDensity, setAiDensity] = useState(50);
  const [aiContrast, setAiContrast] = useState<ArtworkContrastLevel>('medium');
  const [aiBlur, setAiBlur] = useState(24);
  const [aiGlow, setAiGlow] = useState(40);
  const [aiLayerDepth, setAiLayerDepth] = useState(5);
  const [aiSafeArea, setAiSafeArea] = useState(true);
  const [aiReferenceImageUrl, setAiReferenceImageUrl] = useState('');
  const [aiGenerationMode, setAiGenerationMode] = useState<BackgroundGenerationMode>('hybrid');
  const [aiResults, setAiResults] = useState<ArtworkVariation[]>([]);
  const [savedAssets, setSavedAssets] = useState<ArtworkAsset[]>([]);
  const [aiGradientResults, setAiGradientResults] = useState<OutfitBackgroundConfig[]>([]);
  const [selectedAiResult, setSelectedAiResult] = useState<ArtworkVariation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGenerationPlan, setAiGenerationPlan] = useState<Record<string, unknown> | null>(null);
  const [backendWarning, setBackendWarning] = useState<string | null>(null);

  const recommendedPresets = useMemo(() => getRecommendedPresets(outfitMetadata), [outfitMetadata]);

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
      negativePrompt: aiNegativePrompt,
      compositionType: aiCompositionType,
      stylePreset: aiStylePreset,
      paletteMode: aiPaletteMode,
      shapeLanguage: aiShapeLanguage,
      density: aiDensity,
      contrastLevel: aiContrast,
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

    setAiResults(payload.data.variations);
    if (payload.data.warnings?.length) setBackendWarning(payload.data.warnings[0]);
    if (payload.data.variations.length) setSelectedAiResult(payload.data.variations[0]);
    setAiGenerationPlan({
      generationMode: aiGenerationMode,
      compositionType: aiCompositionType,
      stylePreset: aiStylePreset,
      paletteMode: aiPaletteMode,
      shapeLanguage: aiShapeLanguage,
      safeAreaMode: aiSafeArea,
      provider: payload.data.provider,
      fallbackUsed: payload.data.fallbackUsed ?? false,
    });
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
    }));
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-7xl rounded-3xl border border-white/20 bg-[linear-gradient(150deg,rgba(15,23,42,0.9),rgba(34,12,64,0.88))] p-5 text-white shadow-[0_30px_120px_rgba(15,23,42,0.7)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Background Studio</p>
            <h2 className="text-2xl font-semibold">Customize the visual surface of your outfit card</h2>
          </div>
          <button type="button" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold" onClick={onClose}>Close ✕</button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <section className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-4">
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
                <textarea value={aiNegativePrompt} onChange={(event) => setAiNegativePrompt(event.target.value)} placeholder="Optional negative prompt..." className="min-h-16 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiCompositionType} onChange={(event) => setAiCompositionType(event.target.value as ArtworkStudioInput['compositionType'])}>
                    {COMPOSITION_TYPES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiStylePreset} onChange={(event) => setAiStylePreset(event.target.value as ArtworkStylePreset)}>
                    {STYLE_PRESETS.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
                  </select>
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiPaletteMode} onChange={(event) => setAiPaletteMode(event.target.value as ArtworkPaletteMode)}>
                    {PALETTE_MODES.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
                  </select>
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiShapeLanguage} onChange={(event) => setAiShapeLanguage(event.target.value as ArtworkShapeLanguage)}>
                    {SHAPE_LANGUAGES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiContrast} onChange={(event) => setAiContrast(event.target.value as ArtworkContrastLevel)}>
                    {CONTRAST_LEVELS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <input value={aiReferenceImageUrl} onChange={(event) => setAiReferenceImageUrl(event.target.value)} placeholder="Reference image URL (optional)" className="rounded-xl border border-white/20 bg-white/10 px-2 py-2 text-xs" />
                </div>
                <label className="text-xs">Density ({aiDensity})</label>
                <input type="range" min={0} max={100} value={aiDensity} onChange={(event) => setAiDensity(Number(event.target.value))} />
                <label className="text-xs">Blur ({aiBlur})</label>
                <input type="range" min={0} max={100} value={aiBlur} onChange={(event) => setAiBlur(Number(event.target.value))} />
                <label className="text-xs">Glow ({aiGlow})</label>
                <input type="range" min={0} max={100} value={aiGlow} onChange={(event) => setAiGlow(Number(event.target.value))} />
                <label className="text-xs">Layering depth ({aiLayerDepth})</label>
                <input type="range" min={1} max={10} value={aiLayerDepth} onChange={(event) => setAiLayerDepth(Number(event.target.value))} />
                <select className="w-full rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiGenerationMode} onChange={(event) => setAiGenerationMode(event.target.value as BackgroundGenerationMode)}>
                  {AI_GENERATION_MODES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
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
                {aiGenerationPlan ? (
                  <details className="rounded-lg border border-white/20 bg-black/20 p-2 text-[11px] text-white/80">
                    <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">Interpreted generation plan</summary>
                    <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{JSON.stringify(aiGenerationPlan, null, 2)}</pre>
                  </details>
                ) : null}

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
                  {aiResults.map((result) => (
                    <button
                      key={result.variation_id}
                      type="button"
                      className={`h-20 rounded-xl border ${selectedAiResult?.variation_id === result.variation_id ? 'border-violet-300 shadow-[0_0_0_1px_rgba(196,181,253,0.5)]' : 'border-white/20'}`}
                      style={{ backgroundImage: `url(${result.preview_url})`, backgroundSize: 'cover' }}
                      onClick={() => {
                        setSelectedAiResult(result);
                        applyVariationToDraft(result);
                      }}
                    />
                  ))}
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
                          negativePrompt: aiNegativePrompt.trim() || undefined,
                          compositionType: aiCompositionType,
                          stylePreset: aiStylePreset,
                          paletteMode: aiPaletteMode,
                          shapeLanguage: aiShapeLanguage,
                          density: aiDensity,
                          contrastLevel: aiContrast,
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
                {recommendedPresets.map((preset) => (
                  <button key={preset.label} type="button" className="rounded-lg border border-white/20 bg-white/10 p-2 text-left" onClick={() => setDraft(preset.config)}>
                    <p className="text-xs font-semibold">{preset.label}</p>
                    <p className="mt-1 text-[11px] text-white/70">{preset.description}</p>
                  </button>
                ))}
              </div>
            </section>
          </section>

          <section className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/65">Live Preview</p>
            <OutfitCard data={previewData} variant="default" />
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white/85">
              <p>Contrast recommendation: <span className="font-semibold">Use {recommendTextTone} text/icons</span>.</p>
              {shouldShowContrastWarning ? <p className="mt-1 text-amber-200">Warning: high-luminance solid background may reduce metadata readability.</p> : null}
            </div>
          </section>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-4">
          <p className="text-xs uppercase tracking-[0.12em] text-white/70">Selected shape</p>
          {(['none', 'orb', 'diamond', 'mesh'] as const).map((shape) => (
            <button
              key={shape}
              type="button"
              className={`rounded-lg border px-2 py-1 text-[11px] ${draft.shape === shape ? 'border-violet-300 bg-violet-500/35' : 'border-white/25 bg-white/10'}`}
              onClick={() => setDraft((prev) => ({ ...prev, shape }))}
            >
              {shape}
            </button>
          ))}
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
