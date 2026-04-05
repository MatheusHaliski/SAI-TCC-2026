import { getDefaultWearstyleIconDataUri, getWearstyleIconPath, normalizeWearstyles } from '@/app/lib/outfit-card';

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
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getWearstyleIconPath(wearstyle)}
            alt={`${wearstyle} icon`}
            className="h-3.5 w-3.5 object-contain"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getDefaultWearstyleIconDataUri();
            }}
          />
          {wearstyle}
        </span>
      ))}
    </div>
  );
}
