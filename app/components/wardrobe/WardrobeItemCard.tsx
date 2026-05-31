'use client';

import Image from 'next/image';
import { getBest2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';

type CardState = 'ready' | 'generating' | 'queued' | 'failed' | 'not_started';

interface Props {
  name: string;
  imageUrl: string;
  imageAssets?: {
    approved_catalog_2d_url?: string | null;
    normalized_2d_preview_url?: string | null;
    raw_upload_image_url?: string | null;
  };
  brand: string;
  pieceType: string;
  statusLabel: string;
  state: CardState;
  forSale?: boolean;
  listingPrice?: number;
  onClick: () => void;
  onAvailable: () => void;
  onUnavailable: () => void;
  onToggleFavorite: () => void;
  onEdit?: () => void;
}

const STYLE_BY_STATE: Record<CardState, { border: string; badge: string; text: string }> = {
  ready:       { border: '#10b981', badge: 'rgba(16,185,129,0.12)',  text: '#10b981' },
  generating:  { border: '#f59e0b', badge: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  queued:      { border: '#f59e0b', badge: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  failed:      { border: '#ef4444', badge: 'rgba(239,68,68,0.12)',  text: '#ef4444' },
  not_started: { border: 'rgba(255,255,255,0.2)', badge: 'var(--accent)', text: 'var(--muted-foreground)' },
};

export default function WardrobeItemCard(props: Props) {
  const preview2D = getBest2DAssetForWardrobeItem({
    image_url: props.imageUrl,
    image_assets: props.imageAssets,
  });

  const colors = STYLE_BY_STATE[props.state];

  return (
    <article
      onClick={props.onClick}
      className="cursor-pointer rounded-2xl border p-4 transition-all duration-200 shadow-sm hover:shadow-md"
      style={{ borderColor: colors.border, background: 'var(--card)' }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ background: 'var(--accent)', height: '10rem' }}
      >
        <Image
          src={preview2D}
          alt={props.name}
          width={640}
          height={360}
          className="h-full w-full object-cover"
          unoptimized
        />

        {/* For sale badge */}
        {props.forSale && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-500/90 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white shadow">
            Para vender
            {props.listingPrice !== undefined
              ? ` · R$ ${props.listingPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : ''}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3.5">
        <h3 className="mb-1 text-[15px] font-bold" style={{ color: 'var(--foreground)' }}>
          {props.name}
        </h3>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {props.brand} · {props.pieceType}
        </p>

        {/* Status badge */}
        <span
          className="mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
          style={{ background: colors.badge, borderColor: colors.border, color: colors.text }}
        >
          {props.statusLabel}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); props.onAvailable(); }}
          className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
          style={{ borderColor: 'var(--border)', background: 'var(--accent)', color: 'var(--foreground)' }}
        >
          Disponível
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); props.onUnavailable(); }}
          className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
          style={{ borderColor: 'var(--border)', background: 'var(--accent)', color: 'var(--foreground)' }}
        >
          Indisponível
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); props.onToggleFavorite(); }}
          className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
          style={{ borderColor: 'var(--border)', background: 'var(--accent)', color: 'var(--foreground)' }}
        >
          ★ Favorito
        </button>

        {props.onEdit && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); props.onEdit!(); }}
            className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
            style={{ borderColor: 'rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.1)', color: '#c4b5fd' }}
          >
            ✎ Editar
          </button>
        )}
      </div>
    </article>
  );
}