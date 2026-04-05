import { getWearstyleIconPath, inferWearstylesByPieceType, normalizeWearstyles } from '@/app/lib/outfit-card';

interface WearstyleChipsProps {
  wearstyles?: string[];
  pieceType?: string;
}

export default function WearstyleChips({ wearstyles, pieceType }: WearstyleChipsProps) {
  const normalized = normalizeWearstyles(wearstyles);
  const resolvedWearstyles = normalized.length ? normalized : inferWearstylesByPieceType(pieceType);

  const fallbackIcon = (wearstyle: string) => {
    const normalizedName = wearstyle.toLowerCase();
    if (normalizedName.includes('statement')) return '🔥';
    if (normalizedName.includes('street')) return '⚡';
    if (normalizedName.includes('anchor')) return '⚓';
    return '✨';
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">WearStyles:</p>
      {resolvedWearstyles.map((wearstyle) => (
        <div
          key={wearstyle}
          className="flex items-center gap-2 text-xs font-medium text-slate-700"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getWearstyleIconPath(wearstyle)}
            alt={`${wearstyle} icon`}
            className="h-4 w-4 object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden" aria-hidden>{fallbackIcon(wearstyle)}</span>
          <span>{wearstyle}</span>
        </div>
      ))}
    </div>
  );
}
