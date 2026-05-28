'use client';

import { useState } from 'react';
import type { FlairDeck, DuelRound } from '@/app/lib/flair';
import { simulateDuel, DUEL_STAT_SEQUENCE } from '@/app/lib/flair';

const STAT_LABELS: Record<string, string> = {
  edge:  '⚡ EDGE',
  range: '🎯 RANGE',
  clout: '👑 CLOUT',
  glow:  '✨ GLOW',
  art:   '🎨 ART',
};

interface DuelRoundRowProps {
  round: DuelRound;
  revealed: boolean;
}

function DuelRoundRow({ round, revealed }: DuelRoundRowProps) {
  const cWins = round.winner === 'challenger';
  const oWins = round.winner === 'opponent';

  return (
    <div
      className={`
        grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2 rounded-lg
        transition-all duration-300
        ${!revealed ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
        ${round.winner === 'draw' ? 'bg-white/5' : cWins ? 'bg-orange-500/10' : 'bg-purple-500/10'}
      `}
    >
      <div className={`text-right font-black text-lg ${cWins ? 'text-orange-400' : 'text-white/40'}`}>
        {revealed ? round.challengerScore : '??'}
      </div>
      <div className="text-center">
        <div className="text-[9px] text-white/40 font-mono mb-0.5">R{round.round}</div>
        <div className="text-[10px] font-bold text-white/70">{STAT_LABELS[round.stat]}</div>
        {revealed && round.winner !== 'draw' && (
          <div className="text-[8px] mt-0.5 font-black"
            style={{ color: cWins ? '#f97316' : '#a855f7' }}>
            {cWins ? '← WIN' : 'WIN →'}
          </div>
        )}
        {revealed && round.winner === 'draw' && (
          <div className="text-[8px] mt-0.5 text-white/30 font-bold">DRAW</div>
        )}
      </div>
      <div className={`text-left font-black text-lg ${oWins ? 'text-purple-400' : 'text-white/40'}`}>
        {revealed ? round.opponentScore : '??'}
      </div>
    </div>
  );
}

interface Props {
  challengerDeck: FlairDeck;
  opponentDeck: FlairDeck;
  challengerName: string;
  opponentName: string;
  onDuelEnd?: (winner: 'challenger' | 'opponent' | 'draw') => void;
}

export function DuelArena({
  challengerDeck,
  opponentDeck,
  challengerName,
  opponentName,
  onDuelEnd,
}: Props) {
  const [revealedRounds, setRevealedRounds] = useState(0);
  const [duelResult] = useState(() => simulateDuel(challengerDeck, opponentDeck));
  const [started, setStarted] = useState(false);

  function revealNext() {
    if (!started) { setStarted(true); revealNextRound(0); return; }
    revealNextRound(revealedRounds);
  }

  function revealNextRound(current: number) {
    if (current >= DUEL_STAT_SEQUENCE.length) {
      onDuelEnd?.(duelResult.winner);
      return;
    }
    setRevealedRounds(current + 1);
    if (current + 1 < DUEL_STAT_SEQUENCE.length) {
      setTimeout(() => revealNextRound(current + 1), 900);
    } else {
      setTimeout(() => onDuelEnd?.(duelResult.winner), 600);
    }
  }

  const cScore = duelResult.finalScore.challenger;
  const oScore = duelResult.finalScore.opponent;
  const isDone = revealedRounds >= DUEL_STAT_SEQUENCE.length;

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden select-none">
      {/* Arena header */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 bg-gradient-to-r from-orange-950/60 via-neutral-900 to-purple-950/60 border-b border-white/5">
        <div>
          <p className="text-xs font-black text-orange-400 uppercase">{challengerName}</p>
          <p className="text-[10px] text-white/40 truncate">{challengerDeck.title}</p>
          <p className="font-black text-2xl text-white mt-1">{challengerDeck.deckPower}</p>
          <p className="text-[9px] text-white/30">DECK POWER</p>
        </div>
        <div className="px-4 flex flex-col items-center gap-1">
          <span className="text-2xl">⚔️</span>
          <span className="text-[9px] font-black text-white/40 tracking-widest">VS</span>
          {isDone && (
            <div className="text-center mt-1">
              <span className="font-black text-lg text-white">{cScore}–{oScore}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-purple-400 uppercase">{opponentName}</p>
          <p className="text-[10px] text-white/40 truncate">{opponentDeck.title}</p>
          <p className="font-black text-2xl text-white mt-1">{opponentDeck.deckPower}</p>
          <p className="text-[9px] text-white/30">DECK POWER</p>
        </div>
      </div>

      {/* Rounds */}
      <div className="px-3 py-3 flex flex-col gap-1.5">
        {duelResult.rounds.map((round, i) => (
          <DuelRoundRow key={round.round} round={round} revealed={i < revealedRounds} />
        ))}
      </div>

      {/* Winner announcement */}
      {isDone && (
        <div className="px-4 py-3 border-t border-white/5 text-center">
          {duelResult.winner === 'draw' ? (
            <p className="font-black text-white text-sm">EMPATE! Cada um recupera suas apostas.</p>
          ) : (
            <p
              className="font-black text-sm"
              style={{ color: duelResult.winner === 'challenger' ? '#f97316' : '#a855f7' }}
            >
              {duelResult.winner === 'challenger' ? challengerName : opponentName} VENCEU!
            </p>
          )}
          <p className="text-[10px] text-white/40 mt-0.5">{duelResult.highlight}</p>
        </div>
      )}

      {/* Action */}
      {!isDone && (
        <div className="px-4 pb-3 flex justify-center">
          <button
            onClick={revealNext}
            disabled={started && revealedRounds > 0}
            className="rounded-xl px-6 py-2 font-black text-sm bg-white text-black
              hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
          >
            {!started ? 'INICIAR DUELO' : 'Revelando…'}
          </button>
        </div>
      )}
    </div>
  );
}
