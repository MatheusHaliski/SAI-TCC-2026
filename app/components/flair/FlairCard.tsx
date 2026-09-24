'use client';

import Image from 'next/image';
import type { FlairCard as FlairCardType } from '@/app/lib/flair';
import type { PieceCategory } from '@/app/lib/outfit-card';
import { FlairStatBar } from './FlairStatBar';

const CATEGORY_STYLES: Record<PieceCategory, { border: string; badge: string; label: string; glow: string }> = {
  Standard:         { border: '#64748b', badge: 'bg-slate-600',     label: 'STANDARD',        glow: 'shadow-slate-500/30' },
  Premium:          { border: '#f59e0b', badge: 'bg-amber-500',     label: 'PREMIUM',         glow: 'shadow-amber-400/40' },
  'Limited Edition':{ border: '#a855f7', badge: 'bg-purple-600',    label: 'LIMITED EDITION', glow: 'shadow-purple-500/50' },
  Rare:             { border: '#ef4444', badge: 'bg-gradient-to-r from-red-500 to-rose-600', label: 'RARE', glow: 'shadow-red-500/60' },
};

interface Props {
  card: FlairCardType;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

const SIZE_CLASSES = {
  sm:  'w-[140px]',
  md:  'w-[200px]',
  lg:  'w-[260px]',
};

export function FlairCard({ card, size = 'md', showStats = true, selected = false, onClick }: Props) {
  const style = CATEGORY_STYLES[card.category];
  const isRare = card.category === 'Rare';
  const isLimited = card.category === 'Limited Edition';

  return (
    <button
      onClick={onClick}
      className={`
        ${SIZE_CLASSES[size]} rounded-xl overflow-hidden flex flex-col
        transition-all duration-200 cursor-pointer text-left
        ${selected ? 'scale-105 ring-2 ring-white/60' : 'hover:scale-102'}
        shadow-xl ${style.glow}
        ${isRare ? 'animate-pulse-slow' : ''}
      `}
      style={{ border: `1.5px solid ${style.border}` }}
    >
      {/* Category banner */}
      <div className={`px-2 py-0.5 text-center text-[9px] font-black tracking-[0.2em] text-white ${style.badge}`}>
        {style.label}
      </div>

      {/* Card image area */}
      <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            className="object-contain p-2"
            sizes="260px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            👕
          </div>
        )}

        {/* Total power badge */}
        <div
          className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center
            bg-black/70 font-black text-sm border"
          style={{ borderColor: style.border, color: style.border }}
        >
          {card.totalPower}
        </div>

        {/* Rare holographic shimmer */}
        {isRare && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
        )}
        {isLimited && (
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Card content */}
      <div className="bg-neutral-900 px-2.5 pb-2.5 pt-2 flex flex-col gap-1.5 flex-1">
        {/* Title + brand */}
        <div>
          <p className="font-bold text-white text-[11px] leading-tight truncate">{card.title}</p>
          <p className="text-[9px] text-white/40 uppercase tracking-widest">{card.brand}</p>
        </div>

        {/* Stats */}
        {showStats && size !== 'sm' && (
          <div className="flex flex-col gap-0.5">
            <FlairStatBar stat="edge"  value={card.stats.edge}  animate />
            <FlairStatBar stat="range" value={card.stats.range} animate />
            <FlairStatBar stat="clout" value={card.stats.clout} animate />
            <FlairStatBar stat="glow"  value={card.stats.glow}  animate />
            <FlairStatBar stat="art"   value={card.stats.art}   animate />
            {card.stats.sync > 0 && (
              <FlairStatBar stat="sync" value={100} animate />
            )}
          </div>
        )}

        {/* Special ability */}
        {card.specialAbility && size === 'lg' && (
          <div
            className="mt-1 rounded px-1.5 py-1 text-[9px] leading-tight text-white/80 italic"
            style={{ backgroundColor: `${style.border}22`, borderLeft: `2px solid ${style.border}` }}
          >
            {card.specialAbility}
          </div>
        )}

        {/* Wear count indicator */}
        <div className="flex items-center gap-1 mt-auto pt-1 border-t border-white/5">
          <span className="text-[8px] text-white/30 font-mono">#{card.cardId.slice(-4).toUpperCase()}</span>
          <span className="ml-auto text-[8px] text-white/30">×{card.wearCount} worn</span>
        </div>
      </div>
    </button>
  );
}
