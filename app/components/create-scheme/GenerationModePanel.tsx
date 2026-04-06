type GenerationMode = 'manual' | 'ai';

interface GenerationModePanelProps {
  mode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

export default function GenerationModePanel({ mode, onChange }: GenerationModePanelProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
      <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">Generation Mode</p>
      <div className="mt-2 flex gap-2">
        {[
          { value: 'manual' as const, icon: '🎛️', label: 'Manual' },
          { value: 'ai' as const, icon: '✨', label: 'AI' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              mode === option.value
                ? 'border-violet-300/80 bg-violet-500/25 text-white'
                : 'border-white/25 bg-white/5 text-white/80 hover:bg-white/15'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.icon} {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
