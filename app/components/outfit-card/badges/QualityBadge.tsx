import { computeQualityStars } from '@/app/lib/pieces/quality';
import StarRow from './StarRow';

interface QualityBadgeProps {
  baseQuality: number;
  likes: number;
}

export default function QualityBadge({ baseQuality, likes }: QualityBadgeProps) {
  const computed = computeQualityStars(baseQuality, likes);
  const delta = computed - baseQuality;
  const showDelta = delta >= 0.05;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        border: '1px solid rgba(251,191,36,0.55)',
        background: 'rgba(251,191,36,0.1)',
        color: '#92400e',
      }}
    >
      <StarRow value={computed} size={12} />
      <span>{computed.toFixed(1)}</span>
      {showDelta ? (
        <span className="text-[10px] font-semibold text-emerald-600">
          +{delta.toFixed(1)}
        </span>
      ) : null}
    </span>
  );
}
