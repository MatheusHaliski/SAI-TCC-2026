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

export default function Tester2DStage({ mannequin, layers, zoom, showDebug, selectedSlot }: Props) {
  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 p-4">
      <div className="relative mx-auto overflow-hidden rounded-2xl bg-black/30" style={{ width: mannequin.canvasWidth * zoom, height: mannequin.canvasHeight * zoom }}>
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Image
            src={mannequin.imageUrl}
            alt={mannequin.label}
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>

        {layers.map((layer) => <Tester2DOverlayLayer key={layer.pieceId} layer={layer} debug={showDebug} />)}

        {showDebug ? Object.entries(mannequin.slots).map(([slot, anchor]) => (
          <div key={slot} className="absolute border border-cyan-300/60 bg-cyan-400/10" style={{ left: anchor.x, top: anchor.y, width: anchor.width, height: anchor.height, zIndex: 99 }}>
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
  );
}
