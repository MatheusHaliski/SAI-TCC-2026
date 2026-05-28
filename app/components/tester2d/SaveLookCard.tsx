'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { FitScoreResult } from './FitScorePanel';
import type { Tester2DWardrobeItem, OutfitSlot } from './Tester2DWardrobePanel';

type Outfit = Partial<Record<OutfitSlot, Tester2DWardrobeItem>>;

interface Props {
  stageImageUrl: string;
  outfit: Outfit;
  fitScore: FitScoreResult;
}

const SLOT_ORDER: OutfitSlot[] = ['upper', 'lower', 'shoes', 'accessory'];

export default function SaveLookCard({ stageImageUrl, outfit, fitScore }: Props) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const pieces = SLOT_ORDER.filter((s) => outfit[s]).map((s) => outfit[s]!);
  const { lookName, score, occasions } = fitScore;

  const scoreColor = score >= 85 ? 'text-violet-300' : score >= 70 ? 'text-emerald-300' : 'text-amber-300';

  const handleShare = async () => {
    const text = `${lookName} — montado no Provador 2D Fashion AI ✦ (${score}/100)`;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: lookName, text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch { /* user cancelled or clipboard unavailable */ }
    setShared(true);
    setTimeout(() => setShared(false), 2200);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-fuchsia-400/15 bg-gradient-to-b from-fuchsia-950/50 to-black/55 p-4 backdrop-blur-xl">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.10),transparent_55%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-[1px] rounded-[inherit] border border-white/[0.06]" />

      <div className="relative z-[1] space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-fuchsia-300">Salvar Look</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-white">{lookName}</p>
          </div>
          <div className="flex shrink-0 flex-col items-center rounded-xl border border-fuchsia-300/20 bg-fuchsia-500/15 px-2.5 py-1.5">
            <span className={`text-sm font-bold leading-none ${scoreColor}`}>{score}</span>
            <span className="text-[8px] leading-none text-white/35">pts</span>
          </div>
        </div>

        {/* Preview + pieces */}
        <div className="flex gap-3">
          <div className="relative h-[88px] w-[60px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <Image src={stageImageUrl} alt={lookName} fill className="object-contain" unoptimized />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            {pieces.map((p) => (
              <div key={p.pieceId} className="flex items-center gap-2">
                <div className="relative h-[22px] w-[16px] shrink-0 overflow-hidden rounded bg-black/20">
                  <Image src={p.imageUrl} alt={p.name} fill className="object-contain" unoptimized />
                </div>
                <span className="truncate text-[11px] text-white/65">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occasions */}
        {occasions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {occasions.map((o) => (
              <span key={o} className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/50 ring-1 ring-white/10">
                {o}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => setSaved(true)}
            disabled={saved}
            className={`flex-1 rounded-xl py-2 text-[11px] font-semibold transition-all duration-300 ${
              saved
                ? 'border border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
                : 'border border-fuchsia-400/35 bg-fuchsia-500/15 text-fuchsia-200 hover:bg-fuchsia-500/25'
            }`}
          >
            {saved ? '✓ Salvo!' : 'Salvar Look'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-xl border border-cyan-400/30 bg-cyan-500/12 py-2 text-[11px] font-semibold text-cyan-200 transition hover:bg-cyan-500/22"
          >
            {shared ? 'Copiado!' : 'Compartilhar ✦'}
          </button>
        </div>
      </div>
    </div>
  );
}
