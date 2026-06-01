'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { getBest2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';
import PieceIdentityCard, { type PieceCardItem } from './PieceIdentityCard';

interface WardrobeViewerItem {
  name: string;
  image_url: string;
  model_preview_url?: string | null;
  model_3d_url?: string | null;
  model_status?: string;
  brand_applied?: boolean;
  image_assets?: {
    raw_upload_image_url?: string | null;
    segmented_png_url?: string | null;
    normalized_2d_preview_url?: string | null;
    approved_catalog_2d_url?: string | null;
  };
  // Piece card fields
  wardrobe_item_id?: string;
  brand?: string;
  piece_type?: string;
  color?: string;
  material?: string;
  style_tags?: string[];
  occasion_tags?: string[];
  is_favorite?: boolean;
  isolated_piece_image_url?: string | null;
  description?: string | null;
}

interface Props {
  open: boolean;
  item: WardrobeViewerItem | null;
  onClose: () => void;
  userId?: string;
}

export default function WardrobeItemViewerModal({ open, item, onClose, userId }: Props) {
  const [activeTab, setActiveTab] = useState<'2d' | 'card'>('2d');

  const image2d = useMemo(() => {
    if (!item) return '';
    return getBest2DAssetForWardrobeItem(item);
  }, [item]);

  if (!open || !item) return null;

  const cardItem: PieceCardItem = {
    wardrobe_item_id: item.wardrobe_item_id ?? 'unknown',
    name: item.name,
    brand: item.brand ?? '',
    piece_type: item.piece_type ?? '',
    color: item.color,
    material: item.material,
    style_tags: item.style_tags,
    occasion_tags: item.occasion_tags,
    is_favorite: item.is_favorite,
    image_url: item.image_url,
    isolated_piece_image_url: item.isolated_piece_image_url,
    description: item.description,
    image_assets: item.image_assets,
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:p-5" onClick={onClose}>
      <div
        className="max-h-[86vh] w-[94vw] overflow-y-auto overflow-x-hidden rounded-[28px] border border-white/18 p-4 shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur-[18px] backdrop-saturate-[160%] sm:max-h-[82vh] sm:w-[min(92vw,720px)] sm:p-5"
        style={{
          backgroundColor: 'var(--user-surface-solid, #1e293b)',
          backgroundImage: 'var(--liquid-glass-gradient)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="pr-2 text-xl font-semibold text-white">{item.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/18 bg-white/12 px-3 text-sm font-semibold text-white transition hover:bg-white/18"
          >
            Close
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('2d')}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              activeTab === '2d'
                ? 'border-indigo-400/60 bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white shadow-[0_10px_24px_rgba(79,70,229,0.32)]'
                : 'border-white/18 bg-white/12 text-white/78 hover:bg-white/18'
            }`}
          >
            2D (default)
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              activeTab === 'card'
                ? 'border-indigo-400/60 bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_100%)] text-white shadow-[0_10px_24px_rgba(79,70,229,0.32)]'
                : 'border-white/18 bg-white/12 text-white/78 hover:bg-white/18'
            }`}
          >
            ▲ Piece Card
          </button>
        </div>

        {activeTab === '2d' ? (
          <div
            className="relative mx-auto w-full overflow-hidden rounded-[18px] border border-white/16 bg-black/10 p-4"
            style={{ maxHeight: '52vh' }}
          >
            <div className="relative mx-auto aspect-[3/4] h-full w-full max-w-full sm:max-h-[58vh]">
              <Image src={image2d} alt={`${item.name} 2D view`} fill className="object-contain" unoptimized />
            </div>
          </div>
        ) : (
          <div className="py-2">
            <PieceIdentityCard item={cardItem} userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
}
