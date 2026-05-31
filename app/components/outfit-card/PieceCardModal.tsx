'use client';

import { useState } from 'react';
import type { OutfitPiece, PieceCategory } from '@/app/lib/outfit-card';
import { computeQualityStars } from '@/app/lib/pieces/quality';
import { formatLikes } from '@/app/lib/pieces/format';
import StarRow from '@/app/components/outfit-card/badges/StarRow';
import TierChip from '@/app/components/outfit-card/badges/TierChip';
import QualityRail from '@/app/components/outfit-card/badges/QualityRail';

interface PieceCardModalProps {
  piece: OutfitPiece;
  onClose: () => void;
}

type ActiveView = '2d' | 'card';

const TIER_BG: Record<string, string> = {
  Premium:           'linear-gradient(135deg,#451a03 0%,#78350f 100%)',
  'Limited Edition': 'linear-gradient(135deg,#4c0519 0%,#881337 100%)',
  Rare:              'linear-gradient(135deg,#2e1065 0%,#4c1d95 100%)',
  Standard:          'linear-gradient(135deg,#022c22 0%,#064e3b 100%)',
};

export default function PieceCardModal({ piece, onClose }: PieceCardModalProps) {
  const [view, setView] = useState<ActiveView>('2d');

  const tier          = piece.category ?? 'Standard';
  const baseQuality   = piece.baseQuality ?? 2.5;
  const likes         = piece.likes ?? 0;
  const computed      = computeQualityStars(baseQuality, likes);
  const ratingStars   = piece.ratingStars ?? computed;
  const ownersCount   = piece.ownersCount;
  const imageUrl      = piece.imageUrl || piece.brandLogoUrl;
  const occasion      = piece.occasion ?? piece.wearstyles?.join(' · ');
  const description   = piece.description ?? `${tier} ${piece.pieceType} da marca ${piece.brand}.`;

  const bgStyle = TIER_BG[tier] ?? TIER_BG['Standard'];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/25 bg-[#0b1120] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45">Peça</p>
            <h3 className="mt-0.5 text-lg font-semibold text-white">{piece.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/15"
          >
            Fechar ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10">
          {(['2d', 'card'] as ActiveView[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setView(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                view === tab
                  ? 'border-b-2 border-cyan-400 text-cyan-300'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab === '2d' ? 'Visualização 2D' : 'Card da Peça'}
            </button>
          ))}
        </div>

        {/* ── 2D view ── */}
        {view === '2d' ? (
          <div className="flex min-h-[320px] items-center justify-center p-6">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${piece.name} — visualização 2D`}
                className="max-h-[56vh] w-full rounded-2xl object-contain"
              />
            ) : (
              <div
                className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-white/10"
                style={{ background: bgStyle }}
              >
                <p className="font-mono text-2xl text-white/30">{piece.pieceType.toUpperCase()}</p>
                <p className="mt-2 text-sm text-white/50">{piece.brand}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                  Prévia 2D indisponível
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* ── Card da Peça ── */}
        {view === 'card' ? (
          <div className="space-y-0 overflow-y-auto" style={{ maxHeight: '72vh' }}>
            {/* Hero */}
            <div
              className="relative flex h-44 items-end px-5 pb-4"
              style={{ background: bgStyle }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={piece.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
              ) : null}
              <div className="relative z-[1] flex items-end justify-between w-full gap-2">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{piece.pieceType}</p>
                  <p className="text-xl font-bold text-white">{piece.name}</p>
                </div>
                <TierChip tier={tier} />
              </div>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              {/* Criado por + Ocasião */}
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">Criado por</p>
                  <p className="text-sm text-white/85">{piece.creatorName ?? piece.brand}</p>
                </div>
                {occasion ? (
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">Ocasião</p>
                    <p className="text-sm text-white/85">{occasion}</p>
                  </div>
                ) : null}
              </div>

              {/* Descrição */}
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">Descrição</p>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{description}</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Rating */}
                <div className="rounded-xl border border-white/12 bg-white/6 p-3 text-center">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/40">Avaliação</p>
                  <div className="mt-1.5 flex justify-center">
                    <StarRow value={ratingStars} size={13} />
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-amber-300">{ratingStars.toFixed(1)}</p>
                </div>

                {/* Donos */}
                <div className="rounded-xl border border-white/12 bg-white/6 p-3 text-center">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/40">Donos</p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {ownersCount !== undefined ? ownersCount.toLocaleString('pt-BR') : '—'}
                  </p>
                </div>

                {/* Curtidas */}
                <div className="rounded-xl border border-rose-300/20 bg-rose-500/8 p-3 text-center">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/40">Curtidas</p>
                  <p className="mt-2 text-lg font-bold text-rose-300">{formatLikes(likes)}</p>
                </div>
              </div>

              {/* Quality rail */}
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">
                  Qualidade da comunidade
                </p>
                <div className="mt-2">
                  <QualityRail baseQuality={baseQuality} likes={likes} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
