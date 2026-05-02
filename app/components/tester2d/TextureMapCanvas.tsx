'use client';

import { useEffect, useRef } from 'react';
import { applyTextureToQuad, Quad } from '@/app/lib/texture-map';

interface Props {
  mannequinImageUrl: string;
  garmentImageUrl: string;
  quad: Quad;
  blendMode?: GlobalCompositeOperation;
  opacity?: number;
}

export default function TextureMapCanvas({
  mannequinImageUrl,
  garmentImageUrl,
  quad,
  blendMode = 'multiply',
  opacity = 0.92,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    applyTextureToQuad({ canvas, mannequinImageUrl, garmentImageUrl, quad, blendMode, opacity })
      .catch((err) => {
        if (!cancelled) console.warn('[TextureMapCanvas] render failed:', err);
      });

    return () => { cancelled = true; };
  }, [mannequinImageUrl, garmentImageUrl, quad, blendMode, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ objectFit: 'contain' }}
    />
  );
}
