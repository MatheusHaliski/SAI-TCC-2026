import { normalizeWearstyles } from '@/app/lib/outfit-card';

interface WearstyleChipsProps {
  wearstyles?: string[];
}

export default function WearstyleChips({ wearstyles }: WearstyleChipsProps) {
  const normalized = normalizeWearstyles(wearstyles);

  if (!normalized.length) {
    return <span className="text-xs text-slate-500">Unclassified</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {normalized.map((wearstyle) => (
        <span
          key={wearstyle}
          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
        >
          {wearstyle}
        </span>
      ))}
    </div>
  );
}
