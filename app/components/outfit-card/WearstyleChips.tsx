import { getWearstyleIconPath, inferWearstylesByPieceType, normalizeWearstyles } from '@/app/lib/outfit-card';
import { FILTER_GLOW_LINE } from '@/app/lib/uiToken';

interface WearstyleChipsProps {
  wearstyles?: string[];
  pieceType?: string;
}

const getWearstyleTone = (wearstyle: string) => {
  const normalizedName = wearstyle.trim().toLowerCase();

  if (normalizedName.includes('statement')) {
    return {
      pill: 'border-amber-300/40 bg-amber-400/10 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.22)]',
      iconBox: 'border-amber-300/45 bg-amber-400/15 shadow-[0_0_16px_rgba(251,191,36,0.26)]',
      fallback: '🔥',
    };
  }

  if (normalizedName.includes('visual anchor')) {
    return {
      pill: 'border-blue-300/40 bg-blue-400/10 text-blue-100 shadow-[0_0_18px_rgba(59,130,246,0.22)]',
      iconBox: 'border-blue-300/45 bg-blue-400/15 shadow-[0_0_16px_rgba(59,130,246,0.26)]',
      fallback: '🎯',
    };
  }

  if (normalizedName.includes('street energy')) {
    return {
      pill: 'border-fuchsia-300/35 bg-fuchsia-400/12 text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.24)]',
      iconBox: 'border-rose-300/45 bg-rose-400/14 shadow-[0_0_16px_rgba(251,113,133,0.28)]',
      fallback: '⚡',
    };
  }

  if (normalizedName.includes('style accent')) {
    return {
      pill: 'border-cyan-300/45 bg-cyan-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.24)]',
      iconBox: 'border-cyan-300/45 bg-cyan-400/15 shadow-[0_0_16px_rgba(34,211,238,0.28)]',
      fallback: '✨',
    };
  }

  return {
    pill: 'border-white/20 bg-white/8 text-white/85 shadow-[0_0_12px_rgba(148,163,184,0.18)]',
    iconBox: 'border-white/25 bg-white/10 shadow-[0_0_12px_rgba(148,163,184,0.20)]',
    fallback: '✦',
  };
};

export default function WearstyleChips({ wearstyles, pieceType }: WearstyleChipsProps) {
  const normalized = normalizeWearstyles(wearstyles);
  const resolvedWearstyles = normalized.length ? normalized : inferWearstylesByPieceType(pieceType);

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">WearStyles</p>
      <div className="flex flex-wrap gap-2">
        {resolvedWearstyles.map((wearstyle) => {
          const tone = getWearstyleTone(wearstyle);

          return (
            <span
              key={wearstyle}
              className={`relative inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${tone.pill} ${FILTER_GLOW_LINE}`}
            >
              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-[10px] border ${tone.iconBox}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getWearstyleIconPath(wearstyle)}
                  alt={`${wearstyle} icon`}
                  className="h-[22px] w-[22px] object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-base leading-none" aria-hidden>
                  {tone.fallback}
                </span>
              </span>
              <span>{wearstyle}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
