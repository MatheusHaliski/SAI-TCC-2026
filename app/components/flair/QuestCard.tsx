'use client';

import type { FlairQuest, QuestReward } from '@/app/lib/flair';
import { computeQuestProgress, isQuestExpired, conditionLabel } from '@/app/lib/flair';

const DIFFICULTY_META = {
  easy:      { label: 'Fácil',     color: '#22c55e', bg: 'bg-green-950/60' },
  medium:    { label: 'Médio',     color: '#f59e0b', bg: 'bg-amber-950/60' },
  hard:      { label: 'Difícil',   color: '#f97316', bg: 'bg-orange-950/60' },
  legendary: { label: 'Lendário',  color: '#a855f7', bg: 'bg-purple-950/60' },
};

const REWARD_ICON: Record<string, string> = {
  flair_coins:     '🪙',
  store_voucher:   '🛍️',
  card_skin:       '✨',
  background_pack: '🎨',
  exclusive_piece: '💎',
  brand_access:    '🏆',
  trophy:          '🏅',
};

const CATEGORY_ICON: Record<string, string> = {
  daily:          '☀️',
  weekly:         '📅',
  brand_quest:    '👑',
  seasonal_event: '🌟',
  community:      '🤝',
};

interface Props {
  quest: FlairQuest;
  onClaim?: (questId: string) => void;
}

export function QuestCard({ quest, onClaim }: Props) {
  const progress = computeQuestProgress(quest.conditions);
  const expired = isQuestExpired(quest);
  const isComplete = progress >= 100 && quest.status === 'completed';
  const difficulty = DIFFICULTY_META[quest.difficulty];

  const hoursLeft = Math.max(
    0,
    Math.round((new Date(quest.expiresAt).getTime() - Date.now()) / 3600000)
  );

  return (
    <div
      className={`
        rounded-xl border overflow-hidden transition-all
        ${expired ? 'opacity-50 grayscale' : ''}
        ${isComplete ? 'border-green-500/60 shadow-lg shadow-green-500/20' : 'border-white/10'}
      `}
      style={{ background: 'rgba(15,15,20,0.95)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <span className="text-base">{CATEGORY_ICON[quest.category]}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm truncate">{quest.title}</p>
          <p className="text-[10px] text-white/40">{quest.description}</p>
        </div>
        <span
          className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${difficulty.bg}`}
          style={{ color: difficulty.color }}
        >
          {difficulty.label}
        </span>
      </div>

      {/* Conditions */}
      <div className="px-3 py-2 flex flex-col gap-1.5">
        {quest.conditions.map((cond, i) => {
          const condPct = Math.min(100, Math.round((cond.currentValue / cond.targetValue) * 100));
          return (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/60">{conditionLabel(cond.type, cond.targetValue)}</span>
                <span className="text-white/40 font-mono">{cond.currentValue}/{cond.targetValue}</span>
              </div>
              <div className="h-[4px] rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${condPct}%`, backgroundColor: difficulty.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: reward + timer + action */}
      <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{REWARD_ICON[quest.reward.type]}</span>
          <div>
            <p className="text-[11px] font-bold text-white">{quest.reward.label}</p>
            {quest.reward.brandId && (
              <p className="text-[9px] text-white/40">loja parceira</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!expired && !isComplete && (
            <span className="text-[9px] font-mono text-white/30">
              {hoursLeft < 24 ? `${hoursLeft}h` : `${Math.ceil(hoursLeft / 24)}d`}
            </span>
          )}
          {isComplete && onClaim && quest.status === 'completed' && (
            <button
              onClick={() => onClaim(quest.questId)}
              className="rounded-lg px-3 py-1 text-[11px] font-black bg-green-500 text-black
                hover:bg-green-400 transition-colors"
            >
              RESGATAR
            </button>
          )}
          {quest.status === 'claimed' && (
            <span className="text-[10px] font-bold text-green-500">✓ Resgatado</span>
          )}
        </div>
      </div>
    </div>
  );
}
