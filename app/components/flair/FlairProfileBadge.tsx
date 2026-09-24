'use client';

import type { FlairProfile, FlairRank } from '@/app/lib/flair';
import { computeRankProgress } from '@/app/lib/flair';

const RANK_META: Record<FlairRank, { icon: string; color: string; bg: string }> = {
  Rookie:              { icon: '🌱', color: '#94a3b8', bg: 'bg-slate-800' },
  Trendsetter:         { icon: '🔥', color: '#f97316', bg: 'bg-orange-950' },
  'Style Maven':       { icon: '💫', color: '#a855f7', bg: 'bg-purple-950' },
  'Fashion Architect': { icon: '🏛️', color: '#eab308', bg: 'bg-yellow-950' },
  Iconic:              { icon: '💎', color: '#14b8a6', bg: 'bg-teal-950' },
  Legend:              { icon: '👑', color: '#f43f5e', bg: 'bg-rose-950' },
};

interface Props {
  profile: FlairProfile;
  compact?: boolean;
}

export function FlairProfileBadge({ profile, compact = false }: Props) {
  const { rank, nextRank, progress, pointsToNext } = computeRankProgress(profile.rankPoints);
  const meta = RANK_META[rank];

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-neutral-900 border border-white/10">
        <span className="text-lg">{meta.icon}</span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: meta.color }}>
            {rank}
          </p>
          <p className="text-[9px] text-white/40 font-mono">{profile.flairCoins} 🪙</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-white/10 overflow-hidden ${meta.bg}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
          style={{ borderColor: meta.color }}
        >
          {meta.icon}
        </div>
        <div className="flex-1">
          <p className="font-black text-base" style={{ color: meta.color }}>{rank}</p>
          <p className="text-[11px] text-white/50">Nível {profile.level} · {profile.rankPoints} pts</p>
        </div>
        <div className="text-right">
          <p className="font-black text-xl text-white">{profile.flairCoins}</p>
          <p className="text-[9px] text-white/40">FLAIR Coins 🪙</p>
        </div>
      </div>

      {/* Rank progress */}
      {nextRank && (
        <div className="px-4 pb-3">
          <div className="flex justify-between text-[9px] text-white/40 mb-1">
            <span>{rank}</span>
            <span>{nextRank}</span>
          </div>
          <div className="h-[5px] rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, backgroundColor: meta.color }}
            />
          </div>
          <p className="text-[9px] text-white/30 mt-1 text-right">{pointsToNext} pts para {nextRank}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-px bg-white/5">
        {[
          { label: 'Cartas',     value: profile.totalCards },
          { label: 'Decks',      value: profile.totalDecks },
          { label: 'Duelos',     value: profile.duelsPlayed },
          { label: 'Vitórias',   value: profile.duelsWon },
          { label: 'Quests',     value: profile.questsCompleted },
          { label: 'R$ ganhos',  value: `R$${profile.totalBRLEarned}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-neutral-950/60 px-3 py-2">
            <p className="font-black text-sm text-white">{value}</p>
            <p className="text-[9px] text-white/40">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
