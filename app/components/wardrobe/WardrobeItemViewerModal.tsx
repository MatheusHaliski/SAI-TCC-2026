'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { getBest2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';

interface WardrobeViewerItem {
  name: string;
  image_url: string;
  model_preview_url?: string | null;
  model_3d_url?: string | null;
  model_status?: string;
  brand_applied?: boolean;
  image_assets?: {
    raw_upload_image_url?: string | null;
    normalized_2d_preview_url?: string | null;
    approved_catalog_2d_url?: string | null;
  };
}

interface Props {
  open: boolean;
  item: WardrobeViewerItem | null;
  onClose: () => void;
  onOpen3D: () => void;
}

export default function WardrobeItemViewerModal({ open, item, onClose, onOpen3D }: Props) {
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d');

  const image2d = useMemo(() => {
    if (!item) return '';
    return getBest2DAssetForWardrobeItem(item);
  }, [item]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-3xl border border-white/25 bg-[#0d0f14] p-5" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{item.name}</h3>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/30 px-3 py-1 text-xs text-white">Close</button>
        </div>

        <div className="mb-4 flex gap-2">
          <button onClick={() => setActiveTab('2d')} className={`rounded-xl px-4 py-2 text-xs uppercase tracking-[0.2em] ${activeTab === '2d' ? 'bg-white text-black' : 'border border-white/25 text-white'}`}>
            2D (default)
          </button>
          <button onClick={() => setActiveTab('3d')} className={`rounded-xl px-4 py-2 text-xs uppercase tracking-[0.2em] ${activeTab === '3d' ? 'bg-white text-black' : 'border border-white/25 text-white'}`}>
            3D
          </button>
        </div>

        {activeTab === '2d' ? (
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-black/25">
            <Image src={image2d} alt={`${item.name} 2D view`} fill className="object-contain" unoptimized />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/15 bg-black/35 p-5">
            <p className="mb-3 text-sm text-white/75">Open the immersive model viewer for this item.</p>
            {String(item.model_status ?? '').trim().toLowerCase() === 'completed' && item.brand_applied === false ? (
              <p className="mb-3 rounded-lg border border-amber-300/50 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                3D model generated without logo branding.
              </p>
            ) : null}
            <button onClick={onOpen3D} className="rounded-xl bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
              Open 3D viewer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
