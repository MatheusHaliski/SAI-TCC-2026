import type { PieceCategory } from '@/app/lib/outfit-card';

const TIER_STYLES: Record<string, { border: string; text: string; bg: string }> = {
  Premium:           { border: 'rgba(252,211,77,0.55)',  text: '#92400e', bg: 'rgba(251,191,36,0.14)' },
  'Limited Edition': { border: 'rgba(253,164,175,0.55)', text: '#9f1239', bg: 'rgba(253,164,175,0.14)' },
  Rare:              { border: 'rgba(196,181,253,0.55)', text: '#4c1d95', bg: 'rgba(196,181,253,0.14)' },
  Standard:          { border: 'rgba(52,211,153,0.45)',  text: '#064e3b', bg: 'rgba(52,211,153,0.12)'  },
};

const FALLBACK = { border: 'rgba(148,163,184,0.4)', text: '#475569', bg: 'rgba(148,163,184,0.1)' };

interface TierChipProps {
  tier: PieceCategory | string;
}

export default function TierChip({ tier }: TierChipProps) {
  const s = TIER_STYLES[tier] ?? FALLBACK;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
      style={{ border: `1px solid ${s.border}`, color: s.text, background: s.bg }}
    >
      {tier}
    </span>
  );
}
