'use client';

import Image from 'next/image';
import type { OutfitSlot, Tester2DWardrobeItem } from './Tester2DWardrobePanel';

const SLOT_LABELS: Record<OutfitSlot, string> = {
  upper: 'Upper',
  lower: 'Lower',
  shoes: 'Shoes',
  accessory: 'Accessory',
};

const SLOT_ICONS: Record<OutfitSlot, string> = {
  upper: 'T',
  lower: 'B',
  shoes: 'S',
  accessory: 'A',
};

const SLOT_ORDER: OutfitSlot[] = ['upper', 'lower', 'shoes', 'accessory'];

interface Props {
  outfit: Partial<Record<OutfitSlot, Tester2DWardrobeItem>>;
  activeSlot: OutfitSlot;
  onSelectSlot: (slot: OutfitSlot) => void;
  onRemovePiece: (slot: OutfitSlot) => void;
  onTryOn: () => void;
  processing: boolean;
}

export default function OutfitSlotsPanel({ outfit, activeSlot, onSelectSlot, onRemovePiece, onTryOn, processing }: Props) {
  const aiSlots: OutfitSlot[] = ['upper', 'lower', 'shoes'];
  const filledAiSlots = aiSlots.filter((s) => outfit[s]).length;
  const totalFilled = SLOT_ORDER.filter((s) => outfit[s]).length;
  const canTryOn = filledAiSlots >= 1 && !processing;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {SLOT_ORDER.map((slot) => {
          const piece = outfit[slot];
          const isActive = activeSlot === slot;
          const isAccessory = slot === 'accessory';

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition ${
                isActive
                  ? 'border-fuchsia-300/70 bg-fuchsia-400/10 ring-1 ring-fuchsia-300/30 shadow-md'
                  : 'border-white/20 bg-black/25 hover:bg-white/10'
              }`}
            >
              <div className="flex w-full items-center justify-between px-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">
                  {SLOT_LABELS[slot]}
                </span>
                {isAccessory && (
                  <span className="rounded bg-white/10 px-1 py-px text-[8px] uppercase tracking-widest text-white/35">
                    overlay
                  </span>
                )}
              </div>

              {piece ? (
                <>
                  <div className="relative h-14 w-10 overflow-hidden rounded-lg bg-black/35">
                    <Image src={piece.imageUrl} alt={piece.name} fill className="object-contain" unoptimized />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onRemovePiece(slot); }}
                      className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[10px] font-bold text-white hover:bg-rose-700 transition"
                      aria-label={`Remove ${SLOT_LABELS[slot]}`}
                    >
                      ×
                    </button>
                  </div>
                  <p className="w-full truncate text-[10px] text-white/70">{piece.name}</p>
                </>
              ) : (
                <div className="flex h-14 w-10 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/25 bg-black/20">
                  <span className="text-xs font-bold text-white/25">{SLOT_ICONS[slot]}</span>
                  <span className="text-[9px] text-white/30">Add</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onTryOn}
        disabled={!canTryOn}
        className="w-full rounded-xl bg-fuchsia-600 py-2.5 text-sm font-semibold text-white transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {processing
          ? 'Fitting outfit with AI...'
          : totalFilled === 0
          ? 'Select pieces to try on'
          : `Try On Outfit (${totalFilled} piece${totalFilled !== 1 ? 's' : ''})`}
      </button>

      {totalFilled > 0 && !processing && (
        <p className="text-center text-[10px] leading-relaxed text-white/35">
          Upper, lower &amp; shoes are processed via Fashn.ai.
          {outfit.accessory ? ' Accessory shown as overlay.' : ''}
        </p>
      )}
    </div>
  );
}
