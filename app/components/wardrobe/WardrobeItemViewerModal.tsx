'use client';

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
  size?: string;
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

/**
 * RF6 — Critério de Aceitação 4: ao clicar para visualizar um esquema de peça de
 * roupa na aba "Guarda-Roupa", o sistema exibe o esquema como um MODAL ÚNICO E
 * PADRONIZADO (o PieceIdentityCard) e NÃO o exibe como fotografia dentro do
 * modal. Por isso este modal renderiza exclusivamente o esquema padronizado —
 * sem abas de "foto 2D" nem visualização do esquema como fotografia.
 */
export default function WardrobeItemViewerModal({ open, item, onClose, userId }: Props) {
  if (!open || !item) return null;

  const cardItem: PieceCardItem = {
    wardrobe_item_id: item.wardrobe_item_id ?? 'unknown',
    name: item.name,
    brand: item.brand ?? '',
    piece_type: item.piece_type ?? '',
    color: item.color,
    material: item.material,
    size: item.size,
    style_tags: item.style_tags,
    occasion_tags: item.occasion_tags,
    is_favorite: item.is_favorite,
    image_url: item.image_url,
    isolated_piece_image_url: item.isolated_piece_image_url,
    description: item.description,
    image_assets: item.image_assets,
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-3 right-0 z-10 inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/18 bg-white/12 px-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18 sm:-right-3"
        >
          Close
        </button>
        <div className="max-h-[88vh] overflow-y-auto overflow-x-hidden">
          <PieceIdentityCard item={cardItem} userId={userId} />
        </div>
      </div>
    </div>
  );
}
