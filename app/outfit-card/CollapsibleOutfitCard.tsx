'use client';

import { useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import type { OutfitCardData } from '@/app/lib/outfit-card';

type FilterKey = 'favorites' | 'available' | 'unavailable';

interface CollapsibleOutfitCardProps {
  card: OutfitCardData;
  defaultExpanded?: boolean;
  showActions?: boolean;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onUseInDressTester?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
}

const isPortuguese = () =>
  typeof window !== 'undefined' &&
  (window.localStorage.getItem('sai-site-language') ?? 'pt').startsWith('pt');

export function getSchemeFilterValue(
  card: OutfitCardData,
  favorites: Record<string, boolean>,
  availability: Record<string, 'available' | 'unavailable'>,
): FilterKey {
  const id = card.schemeId ?? card.outfitName;

  if (favorites[id]) {
    return 'favorites';
  }

  return availability[id] ?? 'available';
}

export default function CollapsibleOutfitCard({
  card,
  defaultExpanded = false,
  showActions = true,
  onViewDetails,
  onEdit,
  onUseInDressTester,
  onDelete,
  onToggleFavorite,
}: CollapsibleOutfitCardProps) {
  const [expanded, setExpanded] =
    useState(defaultExpanded);

  const pt = isPortuguese();

  const actions = useMemo(
    () =>
      showActions
        ? [
            {
              label: pt
                ? 'Ver detalhes'
                : 'View details',
              onClick: onViewDetails,
              tone: 'accent' as const,
            },
            {
              label: pt ? 'Editar' : 'Edit',
              onClick: onEdit,
            },
            {
              label: pt
                ? 'Usar no Provador 2D'
                : 'Use in Dress Tester',
              onClick: onUseInDressTester,
            },
            {
              label: pt
                ? 'Favoritar'
                : 'Favorite',
              onClick: onToggleFavorite,
            },
            {
              label: pt ? 'Excluir' : 'Delete',
              onClick: onDelete,
              tone: 'danger' as const,
            },
          ]
        : undefined,
    [
      onDelete,
      onEdit,
      onToggleFavorite,
      onUseInDressTester,
      onViewDetails,
      pt,
      showActions,
    ],
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] shadow-[0_8px_28px_rgba(15,23,42,0.18)] backdrop-blur-md transition-all">
      {/* Header UX do segundo */}
      <div
        onClick={() => setExpanded((v) => !v)}
        className={`
          flex cursor-pointer items-center justify-between
          px-4 py-3 transition-colors
          hover:bg-white/[0.04]
          ${expanded ? 'border-b border-white/10' : ''}
        `}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {card.outfitName}
          </p>

          {!expanded && (
            <p className="truncate text-xs text-white/60">
              {card.outfitStyleLine} ·{' '}
              {card.pieces?.length ?? 0}{' '}
              {pt ? 'peças' : 'pieces'}
            </p>
          )}
        </div>

        <button
          type="button"
          className="
            ml-3 rounded-lg border border-white/20
            bg-white/[0.04]
            px-3 py-1.5 text-xs
            font-semibold text-white/80
            transition hover:bg-white/[0.08]
          "
        >
          {expanded
            ? `▲ ${pt ? 'Minimizar' : 'Minimize'}`
            : `▼ ${pt ? 'Expandir' : 'Expand'}`}
        </button>
      </div>

      {/* UX preview do segundo */}
      {!expanded && (
        <div className="flex items-center gap-3 p-3">
          {card.heroImageUrl ? (
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.heroImageUrl}
                alt={card.outfitName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {card.outfitName}
            </p>

            <p className="truncate text-xs text-white/60">
              {card.outfitStyleLine}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="
              flex-shrink-0 rounded-lg
              bg-gradient-to-r
              from-violet-600 to-fuchsia-600
              px-3 py-1.5 text-xs
              font-bold text-white
              transition hover:scale-[1.03]
            "
          >
            {pt ? 'Ver' : 'View'}
          </button>
        </div>
      )}

      {/* Mantém a lógica do primeiro */}
      {expanded && (
        <div className="p-2">
          <OutfitCard
            data={card}
            variant="default"
            actions={actions}
          />
        </div>
      )}
    </article>
  );
}
