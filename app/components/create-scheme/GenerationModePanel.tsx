type GenerationMode = 'manual' | 'ai';

interface GenerationModePanelProps {
  mode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

const options = [
  { value: 'manual' as const, title: 'Manual Builder', subtitle: 'Controle total por slot e composição.', helper: 'Manual = controle total', icon: '🎛️' },
  { value: 'ai' as const, title: 'AI Assist', subtitle: 'Sugestões criativas com base nos seus itens.', helper: 'AI = agilidade criativa', icon: '✨' },
];

export default function GenerationModePanel({ mode, onChange }: GenerationModePanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-accent p-3 backdrop-blur-md">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Generation Mode</p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border p-3 text-left transition ${mode === option.value ? 'border-violet-300/80 bg-gradient-to-r from-purple-600/35 to-pink-500/35 shadow-[0_0_26px_rgba(139,92,246,0.3)]' : 'border-border bg-accent hover:-translate-y-[1px]'}`}
          >
            <p className="text-sm font-semibold text-foreground">{option.icon} {option.title}</p>
            <p className="mt-1 text-xs text-foreground">{option.subtitle}</p>
            <p className="mt-2 text-[11px] text-cyan-100">{option.helper}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
