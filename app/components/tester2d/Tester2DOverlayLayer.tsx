'use client';

import Image from 'next/image';
import { Tester2DOverlayLayer as Layer } from '@/app/services/Tester2DOverlayService';

export default function Tester2DOverlayLayer({ layer }: { layer: Layer }) {
  return (
    <div
      className="absolute"
      style={{
        left: layer.style.left,
        top: layer.style.top,
        width: layer.style.width,
        height: layer.style.height,
        zIndex: layer.style.zIndex,
        transform: `rotate(${layer.style.rotate}deg)`,
      }}
    >
      <Image src={layer.imageUrl} alt={layer.pieceId} fill className="object-contain" unoptimized />
    </div>
  );
}
