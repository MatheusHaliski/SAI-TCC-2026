'use client';

import { useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import {
  OutfitBackgroundConfig,
  OutfitCardData,
  buildBackgroundCssStyle,
  resolveOutfitBackgroundForRender,
} from '@/app/lib/outfit-card';

type StudioTab = 'color' | 'gradient' | 'ai_artwork';

type RecommendedPreset = {
  label: string;
  description: string;
  config: OutfitBackgroundConfig;
};

type OutfitMetadata = {
  style?: string;
  occasion?: string;
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

const AI_STYLES = ['editorial fashion', 'luxury minimal', 'futuristic', 'streetwear energy', 'soft abstract', 'glossy premium', 'magazine backdrop', 'runway lighting', 'artistic studio'];
const AI_MOODS = ['elegant', 'bold', 'dreamy', 'sporty', 'urban', 'experimental', 'premium', 'romantic'];
const AI_PALETTES = ['monochrome', 'warm neutral', 'cool luxury', 'vibrant neon', 'soft pastel', 'gold accent', 'black + silver', 'emerald + cyan'];

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

function createMockAiImage(seed: string, palette: string) {
  const encodedSeed = encodeURIComponent(seed.slice(0, 140));
  const [start, end] = palette.includes('emerald')
    ? ['#022c22', '#22d3ee']
    : palette.includes('black')
      ? ['#09090b', '#d1d5db']
      : palette.includes('warm')
        ? ['#78350f', '#fde68a']
        : ['#0f172a', '#8b5cf6'];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
  <defs>
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='${start}' />
      <stop offset='100%' stop-color='${end}' />
    </linearGradient>
    <radialGradient id='glow' cx='0.7' cy='0.2' r='0.65'>
      <stop offset='0%' stop-color='rgba(255,255,255,0.26)' />
      <stop offset='100%' stop-color='rgba(255,255,255,0)' />
    </radialGradient>
  </defs>
  <rect width='1200' height='800' fill='url(#g)'/>
  <rect width='1200' height='800' fill='url(#glow)'/>
  <ellipse cx='220' cy='650' rx='360' ry='130' fill='rgba(255,255,255,0.08)'/>
  <ellipse cx='980' cy='220' rx='300' ry='130' fill='rgba(255,255,255,0.05)'/>
  <text x='70' y='730' fill='rgba(255,255,255,0.42)' font-size='28' font-family='Arial, sans-serif'>${encodedSeed}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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
  const [aiStyle, setAiStyle] = useState(AI_STYLES[0]);
  const [aiMood, setAiMood] = useState(AI_MOODS[0]);
  const [aiPalette, setAiPalette] = useState(AI_PALETTES[0]);
  const [useMetadataBoost, setUseMetadataBoost] = useState(true);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [selectedAiResult, setSelectedAiResult] = useState<string | null>(null);

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

  const switchTab = (nextTab: StudioTab) => {
    setActiveTab(nextTab);
    setDraft((prev) => ({
      ...prev,
      background_mode: nextTab,
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

  const generateAiBackground = () => {
    const basePrompt = aiPrompt.trim() || 'luxury editorial abstract background';
    const metadataAddition = useMetadataBoost
      ? [outfitMetadata?.style, outfitMetadata?.occasion, outfitMetadata?.palette, outfitMetadata?.mood, outfitMetadata?.brands?.join(', ')]
          .filter(Boolean)
          .join(', ')
      : '';

    const mergedPrompt = `${basePrompt}, ${aiStyle}, ${aiMood}, ${aiPalette}${metadataAddition ? `, ${metadataAddition}` : ''}, supportive backdrop, avoid faces, low visual noise`;

    const generated = [
      createMockAiImage(mergedPrompt, aiPalette),
      createMockAiImage(`${mergedPrompt} variation one`, aiPalette),
      createMockAiImage(`${mergedPrompt} variation two`, aiPalette),
    ];

    setAiResults(generated);
    setSelectedAiResult(generated[0]);
    setDraft((prev) => ({
      ...prev,
      background_mode: 'ai_artwork',
      ai_artwork: {
        prompt: mergedPrompt,
        style: aiStyle,
        mood: aiMood,
        palette: aiPalette,
        image_url: generated[0],
        generation_status: 'done',
      },
      texture_overlay: true,
      shape: 'none',
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
                          ...(prev.gradient || DEFAULT_BACKGROUND.gradient),
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
                          gradient: { ...(prev.gradient || DEFAULT_BACKGROUND.gradient), stops: nextStops.slice(0, 3) },
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
                        setDraft((prev) => ({ ...prev, background_mode: 'gradient', gradient: { ...(prev.gradient || DEFAULT_BACKGROUND.gradient), stops: nextStops.slice(0, 3) } }));
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
                    gradient: { ...(prev.gradient || DEFAULT_BACKGROUND.gradient), angle: Number(event.target.value) },
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
                    gradient: { ...(prev.gradient || DEFAULT_BACKGROUND.gradient), intensity: Number(event.target.value) },
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
                      setDraft((prev) => ({ ...prev, background_mode: 'gradient', gradient: { ...(prev.gradient || DEFAULT_BACKGROUND.gradient), stops } }));
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
                <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="luxury editorial abstract background with silver and black flowing shapes" className="min-h-24 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
                <div className="grid gap-2 sm:grid-cols-3">
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiStyle} onChange={(event) => setAiStyle(event.target.value)}>
                    {AI_STYLES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiMood} onChange={(event) => setAiMood(event.target.value)}>
                    {AI_MOODS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <select className="rounded-xl border border-white/20 bg-slate-900 px-2 py-2 text-xs" value={aiPalette} onChange={(event) => setAiPalette(event.target.value)}>
                    {AI_PALETTES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={useMetadataBoost} onChange={(event) => setUseMetadataBoost(event.target.checked)} />
                  Use my outfit metadata to improve prompt
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-lg border border-violet-300/60 bg-violet-500/40 px-3 py-2 text-xs font-semibold" onClick={generateAiBackground}>Generate Background</button>
                  <button type="button" className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs" onClick={generateAiBackground}>Regenerate</button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs"
                    onClick={() => {
                      if (!selectedAiResult) return;
                      setDraft((prev) => ({
                        ...prev,
                        background_mode: 'ai_artwork',
                        ai_artwork: {
                          ...(prev.ai_artwork || { prompt: aiPrompt }),
                          image_url: selectedAiResult,
                          generation_status: 'done',
                        },
                      }));
                    }}
                  >
                    Use This Result
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {aiResults.map((result) => (
                    <button
                      key={result.slice(0, 30)}
                      type="button"
                      className={`h-20 rounded-xl border ${selectedAiResult === result ? 'border-violet-300 shadow-[0_0_0_1px_rgba(196,181,253,0.5)]' : 'border-white/20'}`}
                      style={{ backgroundImage: `url(${result})`, backgroundSize: 'cover' }}
                      onClick={() => {
                        setSelectedAiResult(result);
                        setDraft((prev) => ({ ...prev, background_mode: 'ai_artwork', ai_artwork: { ...(prev.ai_artwork || { prompt: aiPrompt }), image_url: result, generation_status: 'done' } }));
                      }}
                    />
                  ))}
                </div>
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

        <footer className="mt-4 flex flex-wrap justify-end gap-2 border-t border-white/15 pt-4">
          <button type="button" className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button type="button" className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm" onClick={() => setDraft(DEFAULT_BACKGROUND)}>Reset</button>
          <button type="button" className="rounded-xl border border-violet-300/70 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold" onClick={() => onApply(draft)}>Apply Background</button>
        </footer>
      </div>
    </div>
  );
}
