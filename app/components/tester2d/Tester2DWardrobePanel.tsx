'use client';

import Image from 'next/image';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';

export interface Tester2DWardrobeItem {
  pieceId: string;
  name: string;
  imageUrl: string;
  renderImageUrl?: string | null;
  fitProfile?: WardrobeFitProfile | null;
}

interface Props {
  items: Tester2DWardrobeItem[];
  onApply: (item: Tester2DWardrobeItem) => void;
}

const statusLabel = (status?: WardrobeFitProfile['preparationStatus']) => {
  if (status === 'ready') return 'READY';
  if (status === 'processing') return 'PROCESSING';
  if (status === 'pending') return 'PENDING';
  if (status === 'preview_only') return 'PREVIEW ONLY';
  if (status === 'failed') return 'FAILED';
  return 'PENDING';
};

export default function Tester2DWardrobePanel({ items, onApply }: Props) {
  return (
    <div className="grid max-h-[720px] gap-2 overflow-y-auto pr-1">
      {items.map((item) => {
        const fit = item.fitProfile;
        const slot = fit?.pieceType ?? 'unknown';
        const gender = fit?.targetGender ?? 'unisex';
        const thumbnailUrl = item.renderImageUrl ?? fit?.preparedAssetUrl ?? item.imageUrl;
        return (
          <button
            key={item.pieceId}
            onClick={() => onApply(item)}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/25 p-2 text-left hover:bg-white/10"
          >
            <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-black/35">
              <Image src={thumbnailUrl} alt={item.name} fill className="object-contain" unoptimized />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{item.name}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">
                {slot === 'unknown' ? 'UNKNOWN' : slot} · {gender.toUpperCase()} · {statusLabel(fit?.preparationStatus)}
              </p>
              {item.renderImageUrl ? (
                <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-400/80">TRY-ON READY</p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
