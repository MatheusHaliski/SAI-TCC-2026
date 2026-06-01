'use client';

import { useEffect, useRef, useState } from 'react';

export interface FitScoreResult {
  score: number;
  occasions: string[];
  tip: string;
  missingSlots: string[];
  colorHarmony: number;
  styleCoherence: number;
  seasonalFit: number;
  lookName: string;
}

interface FitScorePiece {
  name: string;
  brand: string;
  pieceType: string;
  slotType: string;
}

interface Props {
  pieces: FitScorePiece[];
  filledSlots: string[];
  mannequin: string;
  onScoreReady?: (result: FitScoreResult) => void;
}

const RING_R = 38;
const RING_C = 2 * Math.PI * RING_R;

function ScoreRing({ animated }: { animated: number }) {
  const offset = RING_C * (1 - animated / 100);
  const color = animated >= 85 ? '#c084fc' : animated >= 70 ? '#34d399' : '#fbbf24';
  return (
    <svg width={96} height={96} className="-rotate-90" aria-hidden>
      <circle cx={48} cy={48} r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
      <circle
        cx={48}
        cy={48}
        r={RING_R}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.04s linear, stroke 0.4s ease' }}
      />
    </svg>
  );
}

function SubScoreBar({ label, value }: { label: string; value: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-white/55">{label}</span>
        <span className="font-semibold text-white/80">{value}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400"
          style={{ width: `${width}%`, transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </div>
    </div>
  );
}

export default function FitScorePanel({ pieces, filledSlots, mannequin, onScoreReady }: Props) {
  const [result, setResult] = useState<FitScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const animFrame = useRef<number | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current || pieces.length === 0) return;
    fetched.current = true;

    fetch('/api/dress-tester/fit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pieces, filledSlots, mannequin }),
    })
      .then((r) => r.json())
      .then((data: FitScoreResult) => {
        setResult(data);
        setLoading(false);
        onScoreReady?.(data);
      })
      .catch(() => {
        setErrored(true);
        setLoading(false);
      });
  }, [pieces, filledSlots, mannequin, onScoreReady]);

  useEffect(() => {
    if (!result) return;
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    let current = 0;
    const target = result.score;
    const step = () => {
      current = Math.min(current + 1.4, target);
      setAnimatedScore(Math.round(current));
      if (current < target) animFrame.current = requestAnimationFrame(step);
    };
    animFrame.current = requestAnimationFrame(step);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [result]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.10),transparent_60%)]" />

      <div className="relative z-[1]">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-300">Fashion AI</span>
          <span className="text-white/20">·</span>
          <span className="text-[10px] text-white/45">Análise do Look</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-2.5 py-5">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-fuchsia-400/30 border-t-fuchsia-400" />
            <p className="text-[11px] text-white/40">Analisando combinação...</p>
          </div>
        ) : errored ? (
          <p className="py-3 text-center text-[11px] text-rose-300/70">Não foi possível analisar o look.</p>
        ) : result ? (
          <div className="space-y-3">
            {/* Ring + look name + occasions */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <ScoreRing animated={animatedScore} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold leading-none text-white">{animatedScore}</span>
                  <span className="text-[9px] leading-none text-white/35">/ 100</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">{result.lookName}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {result.occasions.map((o) => (
                    <span key={o} className="rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-[10px] font-medium text-fuchsia-200 ring-1 ring-fuchsia-400/20">
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-score bars */}
            <div className="space-y-2 rounded-xl bg-white/[0.04] p-2.5">
              <SubScoreBar label="Harmonia de Cores" value={result.colorHarmony} />
              <SubScoreBar label="Coerência de Estilo" value={result.styleCoherence} />
              <SubScoreBar label="Fit Sazonal" value={result.seasonalFit} />
            </div>

            {/* AI tip */}
            <div className="flex gap-2 rounded-xl border border-cyan-300/15 bg-cyan-500/10 p-2.5">
              <span className="mt-0.5 shrink-0 text-[13px] text-cyan-300">✦</span>
              <p className="text-[11px] leading-relaxed text-cyan-100/90">{result.tip}</p>
            </div>

            {/* Missing slots */}
            {result.missingSlots.length > 0 && (
              <p className="text-center text-[10px] text-white/30">
                Faltando: {result.missingSlots.join(', ')}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
