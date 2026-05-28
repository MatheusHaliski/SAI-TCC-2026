'use client';

import type { DuelStat } from '@/app/lib/flair';

const STAT_META: Record<DuelStat | 'sync', { label: string; color: string; icon: string }> = {
  edge:  { label: 'EDGE',  color: '#f97316', icon: '⚡' },
  range: { label: 'RANGE', color: '#6366f1', icon: '🎯' },
  clout: { label: 'CLOUT', color: '#eab308', icon: '👑' },
  glow:  { label: 'GLOW',  color: '#ec4899', icon: '✨' },
  art:   { label: 'ART',   color: '#14b8a6', icon: '🎨' },
  sync:  { label: 'SYNC',  color: '#22c55e', icon: '🌿' },
};

interface Props {
  stat: DuelStat | 'sync';
  value: number;
  animate?: boolean;
}

export function FlairStatBar({ stat, value, animate = false }: Props) {
  const meta = STAT_META[stat];
  const pct = Math.min(100, value);

  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-sm" title={meta.label}>{meta.icon}</span>
      <span
        className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: meta.color }}
      >
        {meta.label}
      </span>
      <div className="relative flex-1 h-[5px] rounded-full bg-white/10 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${animate ? 'transition-all duration-700 ease-out' : ''}`}
          style={{ width: `${pct}%`, backgroundColor: meta.color }}
        />
      </div>
      <span className="w-8 text-right font-mono text-[11px] text-white/60">{value}</span>
    </div>
  );
}
