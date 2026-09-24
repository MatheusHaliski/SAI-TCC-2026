'use client';

import Image from 'next/image';
import { getBest2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';
import { resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';

type CardState = 'ready' | 'generating' | 'queued' | 'failed' | 'not_started';

interface Props {
  name: string;
  imageUrl: string;
  imageAssets?: {
    approved_catalog_2d_url?: string | null;
    segmented_png_url?: string | null;
    normalized_2d_preview_url?: string | null;
    raw_upload_image_url?: string | null;
  };
  isolatedPieceImageUrl?: string | null;
  description?: string | null;
  brand: string;
  pieceType: string;
  statusLabel: string;
  state: CardState;
  forSale?: boolean;
  listingPrice?: number;
  usageCount?: number;
  forgotten?: boolean;
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
  const preview2D = props.isolatedPieceImageUrl || getBest2DAssetForWardrobeItem({
    image_url: props.imageUrl,
    image_assets: props.imageAssets,
  });
  const brandLogoUrl = resolveBrandLogoUrlByName(props.brand);
  const personalDescription = props.description?.trim()
    || `Peça minimalista para expressar estilo pessoal em ${props.pieceType.replaceAll('_', ' ')}.`;

  const colors = STYLE_BY_STATE[props.state];

  return (
    <article
      onClick={props.onClick}
      className="cursor-pointer rounded-2xl border border-white/18 p-3 transition-all duration-200 shadow-sm hover:shadow-md"
      style={{
        backgroundColor: 'var(--piece-scheme-surface, #1e293b)',
        backgroundImage: 'var(--piece-scheme-gradient)',
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ background: 'rgba(0,0,0,0.12)', height: '10rem' }}
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
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/14">
            {brandLogoUrl ? (
              <Image src={brandLogoUrl} alt={`${props.brand} logo`} width={28} height={28} className="h-6 w-6 object-contain" unoptimized />
            ) : (
              <span className="text-xs font-black uppercase text-white">{props.brand.slice(0, 2)}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold text-white">{props.name}</h3>
            <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{props.brand}</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/76">{personalDescription}</p>

        {/* Status + usage badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
            style={{ background: colors.badge, borderColor: colors.border, color: colors.text }}
          >
            {props.statusLabel}
          </span>

          {props.usageCount !== undefined && (
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
              style={
                props.usageCount === 0
                  ? { background: 'rgba(148,163,184,0.12)', borderColor: 'rgba(148,163,184,0.5)', color: '#cbd5e1' }
                  : { background: 'rgba(124,58,237,0.14)', borderColor: 'rgba(124,58,237,0.5)', color: '#c4b5fd' }
              }
            >
              {props.usageCount === 0
                ? 'Nunca usada'
                : `Usada em ${props.usageCount} look${props.usageCount > 1 ? 's' : ''}`}
            </span>
          )}

          {props.forgotten && props.usageCount !== 0 && (
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
              style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.5)', color: '#fbbf24' }}
            >
              💤 Esquecida
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); props.onAvailable(); }}
          className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
          style={{ borderColor: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.10)', color: '#fff' }}
        >
          Disponível
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); props.onUnavailable(); }}
          className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
          style={{ borderColor: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.10)', color: '#fff' }}
        >
          Indisponível
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); props.onToggleFavorite(); }}
          className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:brightness-110"
          style={{ borderColor: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.10)', color: '#fff' }}
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
