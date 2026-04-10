'use client';

import Image from 'next/image';
import { Tester2DMannequin } from '@/app/config/tester2dMannequins';
import { Tester2DOverlayLayer as Layer } from '@/app/services/Tester2DOverlayService';
import Tester2DOverlayLayer from './Tester2DOverlayLayer';

interface Props {
  mannequin: Tester2DMannequin;
  layers: Layer[];
  zoom: number;
  showDebug: boolean;
  selectedSlot: string | null;
}

const toPct = (value: number, total: number) => `${(value / total) * 100}%`;

export default function Tester2DStage({ mannequin, layers, zoom, showDebug, selectedSlot }: Props) {
  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 p-4">
      <div className="mx-auto w-full max-w-[720px] overflow-hidden rounded-2xl bg-black/30">
        <div className="relative w-full" style={{ aspectRatio: `${mannequin.canvasWidth} / ${mannequin.canvasHeight}` }}>
          <div
            className="absolute inset-0 origin-center"
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 180ms ease-out',
            }}
          >
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
              <Image
                src={mannequin.imageUrl}
                alt={mannequin.label}
                fill
                className="object-contain"
                // Assets atuais são pequenos (male 232x649 e female 203x646).
                // Mantemos compatibilidade e evitamos upscale agressivo no layout.
                // Trocar por PNGs HD (ex.: >= 1200x2000) melhora nitidez de forma definitiva.
                sizes="(max-width: 1024px) 92vw, 720px"
                priority
                unoptimized
              />
            </div>

            {layers.map((layer) => <Tester2DOverlayLayer key={layer.pieceId} layer={layer} debug={showDebug} />)}

            {showDebug ? Object.entries(mannequin.slots).map(([slot, anchor]) => (
              <div
                key={slot}
                className="absolute border border-cyan-300/60 bg-cyan-400/10"
                style={{
                  left: toPct(anchor.x, mannequin.canvasWidth),
                  top: toPct(anchor.y, mannequin.canvasHeight),
                  width: toPct(anchor.width, mannequin.canvasWidth),
                  height: toPct(anchor.height, mannequin.canvasHeight),
                  zIndex: 99,
                }}
              >
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cyan-100">{slot}</span>
              </div>
            )) : null}
            {showDebug ? (
              <div className="absolute left-2 top-2 z-[120] rounded-lg bg-black/70 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-white/90">
                Selected: {selectedSlot ?? 'none'}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
