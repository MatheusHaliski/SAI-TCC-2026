import { useState } from 'react';
import { getWearstyleIconPath, normalizeWearstyles } from '@/app/lib/outfit-card';

interface WearstyleChipsProps {
  wearstyles?: string[];
}

export default function WearstyleChips({ wearstyles }: WearstyleChipsProps) {
  const normalized = normalizeWearstyles(wearstyles);
  const [failedIcons, setFailedIcons] = useState<Record<string, boolean>>({});

  const fallbackIcon = (wearstyle: string) => {
    const normalizedName = wearstyle.toLowerCase();
    if (normalizedName.includes('statement')) return '🔥';
    if (normalizedName.includes('street')) return '⚡';
    if (normalizedName.includes('anchor')) return '⚓';
    return '✨';
  };

  if (!normalized.length) {
    return <span className="text-xs text-slate-500">Unclassified</span>;
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">WearStyles:</p>
      {normalized.map((wearstyle) => (
        <div
          key={wearstyle}
          className="flex items-center gap-2 text-xs font-medium text-slate-700"
        >
          {!failedIcons[wearstyle] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getWearstyleIconPath(wearstyle)}
              alt={`${wearstyle} icon`}
              className="h-4 w-4 object-contain"
              onError={() => setFailedIcons((prev) => ({ ...prev, [wearstyle]: true }))}
            />
          ) : (
            <span aria-hidden>{fallbackIcon(wearstyle)}</span>
          )}
          <span>{wearstyle}</span>
        </div>
      ))}
    </div>
  );
}
