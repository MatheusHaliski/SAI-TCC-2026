interface SaveSummaryPanelProps {
  mode: 'manual' | 'ai';
  filledSlots: number;
  totalSlots: number;
}

export default function SaveSummaryPanel({ mode, filledSlots, totalSlots }: SaveSummaryPanelProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-white/20 bg-white/10 p-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">Generation</p>
        <p className="mt-1 text-sm font-semibold text-white">{mode === 'manual' ? 'Manual Builder' : 'AI Builder'}</p>
      </div>
      <div className="rounded-xl border border-white/20 bg-white/10 p-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">Slots</p>
        <p className="mt-1 text-sm font-semibold text-white">{filledSlots}/{totalSlots} filled</p>
      </div>
    </div>
  );
}
