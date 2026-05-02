'use client';

import Image from 'next/image';
import { MannequinProfile } from '@/app/lib/fashion-ai/types/mannequin';
import { Tester2DLayer } from '@/app/lib/fashion-ai/services/Tester2DRenderService';

interface Props {
  mannequin: MannequinProfile;
  layers: Tester2DLayer[];
  zoom: number;
  showDebug: boolean;
  selectedSlot: string | null;
}

const toPct = (value: number, total: number) => `${(value / total) * 100}%`;

export default function Tester2DStage({ mannequin, layers, zoom, showDebug, selectedSlot }: Props) {
  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 p-4">
      <div className="mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl bg-gradient-to-b from-black/30 to-black/65 p-3">
        {/* White canvas so mix-blend-mode:multiply on garment images erases white product backgrounds */}
        <div className="relative mx-auto w-full overflow-hidden rounded-xl bg-white" style={{ aspectRatio: `${mannequin.canvasWidth} / ${mannequin.canvasHeight}` }}>
          <div className="absolute inset-0 origin-center" style={{ transform: `scale(${zoom})`, transition: 'transform 180ms ease-out' }}>
            {layers.map((layer, index) => {
              if (layer.type === 'mannequin-base') {
                return (
                  <Image
                    key={`${layer.type}-${index}`}
                    src={layer.imageUrl}
                    alt={mannequin.label}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 96vw, 860px"
                    priority
                    unoptimized
                  />
                );
              }

              return (
                <div
                  key={`${layer.slot}-${index}`}
                  className="absolute"
                  style={{
                    left: toPct(layer.x, mannequin.canvasWidth),
                    top: toPct(layer.y, mannequin.canvasHeight),
                    width: toPct(layer.width, mannequin.canvasWidth),
                    height: toPct(layer.height, mannequin.canvasHeight),
                    zIndex: 20 + index,
                    mixBlendMode: 'multiply',
                  }}
                >
                  {/* object-fill: the projection math in MannequinFitService sizes this div so the
                      garment content region fills the slot exactly — object-fill honours that. */}
                  {/* mix-blend-mode:multiply: moved to the wrapper div to avoid stacking context isolation. */}
                  <Image
                    src={layer.imageUrl}
                    alt={layer.slot}
                    fill
                    className="pointer-events-none"
                    style={{ objectFit: 'fill' }}
                    unoptimized
                  />
                </div>
              );
            })}

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
