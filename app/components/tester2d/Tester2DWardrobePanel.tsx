'use client';

import Image from 'next/image';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';

export type OutfitSlot = 'upper' | 'lower' | 'shoes' | 'accessory';

export interface Tester2DWardrobeItem {
  pieceId: string;
  name: string;
  imageUrl: string;
  garmentCategory: 'tops' | 'bottoms' | 'full-body' | 'shoes' | 'accessory';
  slotType: OutfitSlot;
  fitProfile?: WardrobeFitProfile | null;
  tryOn2dImageUrl?: string | null;
}

const SLOT_LABELS: Record<OutfitSlot, string> = {
  upper: 'Upper',
  lower: 'Lower',
  shoes: 'Shoes',
  accessory: 'Acc',
};

interface Props {
  items: Tester2DWardrobeItem[];
  activePieceId: string | null;
  processingPieceId: string | null;
  activeSlot: OutfitSlot;
  onSlotChange: (slot: OutfitSlot) => void;
  onApply: (item: Tester2DWardrobeItem) => void;
}

export default function Tester2DWardrobePanel({ items, activePieceId, processingPieceId, activeSlot, onSlotChange, onApply }: Props) {
  const filtered = items.filter((item) => item.slotType === activeSlot);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        {(['upper', 'lower', 'shoes', 'accessory'] as OutfitSlot[]).map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onSlotChange(slot)}
            className={`flex-1 rounded-lg py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${
              activeSlot === slot
                ? 'bg-fuchsia-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {SLOT_LABELS[slot]}
          </button>
        ))}
      </div>
      <div className="grid max-h-[640px] gap-2 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-white/40">No {SLOT_LABELS[activeSlot].toLowerCase()} items in wardrobe</p>
        ) : (
          filtered.map((item) => {
            const active = activePieceId === item.pieceId;
            const loading = processingPieceId === item.pieceId;
            return (
              <button
                key={item.pieceId}
                type="button"
                onClick={() => onApply(item)}
                className={`relative flex items-center gap-2 rounded-xl border p-2 text-left transition ${
                  active
                    ? 'border-fuchsia-300/70 bg-fuchsia-400/10 shadow-md'
                    : 'border-white/20 bg-black/25 hover:bg-white/10'
                }`}
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-black/35">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-contain" unoptimized />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">{item.garmentCategory}</p>
                </div>
                {loading ? (
                  <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border border-white/30 border-t-white" />
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
