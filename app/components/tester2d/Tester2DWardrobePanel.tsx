'use client';

import Image from 'next/image';

export interface Tester2DWardrobeItem {
  piece_id: string;
  name: string;
  piece_type: string;
  image_url: string;
  assetSource?: string;
}

interface Props {
  items: Tester2DWardrobeItem[];
  onApply: (item: Tester2DWardrobeItem) => void;
}

export default function Tester2DWardrobePanel({ items, onApply }: Props) {
  return (
    <div className="grid max-h-[720px] gap-2 overflow-y-auto pr-1">
      {items.map((item) => (
        <button key={item.piece_id} onClick={() => onApply(item)} className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/25 p-2 text-left hover:bg-white/10">
          <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-black/35">
            <Image src={item.image_url} alt={item.name} fill className="object-contain" unoptimized />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{item.name}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">{item.piece_type}</p>
            {item.assetSource ? <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">asset: {item.assetSource}</p> : null}
          </div>
        </button>
      ))}
    </div>
  );
}
