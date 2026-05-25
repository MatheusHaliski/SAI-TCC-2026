'use client';

import Image from 'next/image';
import { getBest2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';

type CardState =
  | 'ready'
  | 'generating'
  | 'queued'
  | 'failed'
  | 'not_started';

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
  onClick: () => void;
  onAvailable: () => void;
  onUnavailable: () => void;
  onToggleFavorite: () => void;
}

const STYLE_BY_STATE: Record<
  CardState,
  {
    border: string;
    badge: string;
    text: string;
    hover: string;
  }
> = {
  ready: {
    border: '#10b981',
    badge: 'rgba(16,185,129,0.12)',
    text: '#10b981',
    hover: 'hover:border-emerald-300/70',
  },
  generating: {
    border: '#f59e0b',
    badge: 'rgba(245,158,11,0.12)',
    text: '#f59e0b',
    hover: 'hover:border-amber-300/70',
  },
  queued: {
    border: '#f59e0b',
    badge: 'rgba(245,158,11,0.12)',
    text: '#f59e0b',
    hover: 'hover:border-amber-300/70',
  },
  failed: {
    border: '#ef4444',
    badge: 'rgba(239,68,68,0.12)',
    text: '#ef4444',
    hover: 'hover:border-rose-300/70',
  },
  not_started: {
    border: 'rgba(255,255,255,0.2)',
    badge: 'var(--accent)',
    text: 'var(--muted-foreground)',
    hover: 'hover:border-white/40',
  },
};

export default function WardrobeItemCard(props: Props) {
  const preview2D =
    getBest2DAssetForWardrobeItem({
      image_url: props.imageUrl,
      image_assets: props.imageAssets,
    });

  const colors =
    STYLE_BY_STATE[props.state];

  return (
    <article
      onClick={props.onClick}
      className={`
        cursor-pointer rounded-2xl border
        p-4 transition-all duration-200
        shadow-sm hover:shadow-md
        ${colors.hover}
      `}
      style={{
        borderColor: colors.border,
        background: 'var(--card)',
      }}
    >
      {/* Image */}
      <div
        className="
          relative overflow-hidden
          rounded-xl
        "
        style={{
          background: 'var(--accent)',
          height: '10rem',
        }}
      >
        <Image
          src={preview2D}
          alt={props.name}
          width={640}
          height={360}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="mt-3.5">
        <h3 className="mb-1 text-[15px] font-bold text-[var(--foreground)]">
          {props.name}
        </h3>

        <p className="text-sm text-[var(--muted-foreground)]">
          {props.brand} · {props.pieceType}
        </p>

        {/* Status badge */}
        <span
          className="mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
          style={{
            background: colors.badge,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          {props.statusLabel}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            props.onAvailable();
          }}
          className="
            rounded-lg border px-2.5 py-1
            text-xs font-medium
            transition hover:brightness-110
          "
          style={{
            borderColor: 'var(--border)',
            background: 'var(--accent)',
            color: 'var(--foreground)',
          }}
        >
          Available
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            props.onUnavailable();
          }}
          className="
            rounded-lg border px-2.5 py-1
            text-xs font-medium
            transition hover:brightness-110
          "
          style={{
            borderColor: 'var(--border)',
            background: 'var(--accent)',
            color: 'var(--foreground)',
          }}
        >
          Unavailable
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            props.onToggleFavorite();
          }}
          className="
            rounded-lg border px-2.5 py-1
            text-xs font-medium
            transition hover:brightness-110
          "
          style={{
            borderColor: 'var(--border)',
            background: 'var(--accent)',
            color: 'var(--foreground)',
          }}
        >
          ★ Favorite
        </button>
      </div>
    </article>
  );
}
