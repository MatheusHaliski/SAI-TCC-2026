'use client';

import Image from 'next/image';
import { Tester2DMannequin } from '@/app/config/tester2dMannequins';
import { Tester2DOverlayLayer as Layer } from '@/app/services/Tester2DOverlayService';
import Tester2DOverlayLayer from './Tester2DOverlayLayer';

interface Props {
  mannequin: Tester2DMannequin;
  layers: Layer[];
  zoom: number;
  showAnchors: boolean;
}

export default function Tester2DStage({ mannequin, layers, zoom, showAnchors }: Props) {
  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 p-4">
      <div className="relative mx-auto overflow-hidden rounded-2xl bg-black/30" style={{ width: mannequin.canvasWidth * zoom, height: mannequin.canvasHeight * zoom }}>
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Image
            src={mannequin.imageUrl}
            alt={mannequin.label}
            fill
            className="object-cover"
            style={{
              objectPosition: `${mannequin.sprite?.offsetXPercent ?? 50}% center`,
              transform: `scaleX(${mannequin.sprite?.scaleX ?? 1})`,
              transformOrigin: mannequin.sprite?.offsetXPercent === 0 ? 'left center' : 'right center',
            }}
            priority
            unoptimized
          />
        </div>

        {layers.map((layer) => <Tester2DOverlayLayer key={layer.pieceId} layer={layer} />)}

        {showAnchors ? Object.entries(mannequin.anchors).map(([slot, anchor]) => (
          <div key={slot} className="absolute border border-cyan-300/60 bg-cyan-400/10" style={{ left: anchor.x, top: anchor.y, width: anchor.width, height: anchor.height, zIndex: 99 }} />
        )) : null}
      </div>
    </div>
  );
}
