'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface Point { x: number; y: number }
const LABELS = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'];

interface Props {
  mannequinImageUrl: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

export default function QuadCalibrator({ mannequinImageUrl, canvasWidth = 1200, canvasHeight = 1800 }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (points.length >= 4) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / rect.width  * canvasWidth);
    const y = Math.round((e.clientY - rect.top)  / rect.height * canvasHeight);
    setPoints((prev) => [...prev, { x, y }]);
  };

  const output = points.length === 4 ? {
    topLeft:     points[0],
    topRight:    points[1],
    bottomLeft:  points[2],
    bottomRight: points[3],
  } : null;

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.16em] text-amber-300/80">
        Quad Calibrator — click in order: {points.length < 4 ? LABELS[points.length] : 'Done'}
      </p>
      <div
        ref={containerRef}
        className="relative cursor-crosshair select-none overflow-hidden rounded-xl border border-white/20"
        onClick={handleClick}
      >
        <Image
          src={mannequinImageUrl}
          alt="Calibrate mannequin torso quad"
          width={400}
          height={600}
          className="pointer-events-none w-full"
          unoptimized
        />
        {points.map((p, i) => (
          <div
            key={i}
            className="absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-400 text-[8px] font-bold text-black ring-2 ring-black"
            style={{ left: `${(p.x / canvasWidth) * 100}%`, top: `${(p.y / canvasHeight) * 100}%` }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {output ? (
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-400">
            Paste into MANNEQUIN_TORSO_QUADS in app/lib/mannequin-quads.ts:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-black/60 p-3 text-xs text-emerald-300">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-[11px] text-white/40">
          {4 - points.length} point{4 - points.length !== 1 ? 's' : ''} remaining
        </p>
      )}

      {points.length > 0 && (
        <button
          type="button"
          onClick={() => setPoints([])}
          className="text-xs text-white/40 underline hover:text-white/70"
        >
          Reset points
        </button>
      )}
    </div>
  );
}
