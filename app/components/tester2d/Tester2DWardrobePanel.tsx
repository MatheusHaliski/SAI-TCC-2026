'use client';

import Image from 'next/image';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';

export interface Tester2DWardrobeItem {
  pieceId: string;
  name: string;
  imageUrl: string;
  fitProfile?: WardrobeFitProfile | null;
}

interface Props {
  items: Tester2DWardrobeItem[];
  onApply: (item: Tester2DWardrobeItem) => void;
}

const statusLabel = (status?: WardrobeFitProfile['preparationStatus']) => {
  if (status === 'ready') return 'READY FOR TRY-ON';
  if (status === 'processing') return 'PROCESSING';
  if (status === 'pending') return 'PROCESSING REQUIRED';
  if (status === 'preview_only') return 'PREVIEW ONLY';
  if (status === 'failed') return 'FAILED';
  return 'PROCESSING REQUIRED';
};

export default function Tester2DWardrobePanel({ items, onApply }: Props) {
  return (
    <div className="grid max-h-[720px] gap-2 overflow-y-auto pr-1">
      {items.map((item) => {
        const fit = item.fitProfile;
        const slot = fit?.pieceType ?? 'unknown';
        const gender = fit?.targetGender ?? 'unisex';
        const canApply = fit?.preparationStatus === 'ready';
        return (
          <button
            key={item.pieceId}
            onClick={() => onApply(item)}
            disabled={!canApply}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/25 p-2 text-left hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-black/35">
              <Image src={fit?.preparedAssetUrl || item.imageUrl} alt={item.name} fill className="object-contain" unoptimized />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">
                {slot} · {gender} · {statusLabel(fit?.preparationStatus)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
