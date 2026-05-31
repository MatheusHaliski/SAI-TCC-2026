import { computeQualityStars } from '@/app/lib/pieces/quality';

interface QualityRailProps {
  baseQuality: number;
  likes: number;
}

export default function QualityRail({ baseQuality, likes }: QualityRailProps) {
  const computed = computeQualityStars(baseQuality, likes);
  const basePct = (baseQuality / 5) * 100;
  const computedPct = (computed / 5) * 100;

  return (
    <div className="relative mt-1 w-full" aria-hidden>
      {/* Track */}
      <div className="h-[5px] w-full overflow-hidden rounded-full bg-white/15">
        {/* Community fill up to computed */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-[width] duration-500"
          style={{ width: `${computedPct}%` }}
        />
      </div>

      {/* BASE marker */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${basePct}%` }}
      >
        <div className="h-[9px] w-[2px] rounded-full bg-white/70" />
      </div>

      {/* BASE label */}
      <div
        className="absolute mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/45"
        style={{ left: `${basePct}%`, top: '100%', transform: 'translateX(-50%)' }}
      >
        base
      </div>
    </div>
  );
}
