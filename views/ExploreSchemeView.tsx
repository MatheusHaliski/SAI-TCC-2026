'use client';

import { useEffect, useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { OutfitCardData, buildOutfitDescriptionFallback } from '@/app/lib/outfit-card';

type SlotKey = 'upper' | 'lower' | 'shoes' | 'accessory';
type Scheme = {
  scheme_id: string;
  title: string;
  description?: string | null;
  style: string;
  occasion: string;
  cover_image_url: string | null;
  user_id: string;
  pieces?: SchemePieceSnapshot[];
};
type SchemePieceSnapshot = {
  id: string;
  slot: SlotKey;
  sourceType: 'wardrobe' | 'suggested';
  sourceId: string;
  name: string;
  brand: string;
  brandLogoUrl?: string;
  category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare';
  pieceType: string;
  wearstyles: string[];
};
type SchemeDetailItem = {
  scheme_item_id: string;
  wardrobe_item_id: string;
  slot: SlotKey;
  wardrobe_name: string;
  image_url: string;
};
type SchemeDetailsResponse = {
  scheme: Scheme;
  items: SchemeDetailItem[];
};

const SLOT_PREVIEW_DEFAULTS: Record<
  SlotKey,
  { pieceType: string; category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare'; wearstyles: string[] }
> = {
  upper: { pieceType: 'Jacket', category: 'Premium', wearstyles: ['Statement Piece', 'Visual Anchor'] },
  lower: { pieceType: 'Pants', category: 'Standard', wearstyles: ['Base Structure', 'Balanced Fit'] },
  shoes: { pieceType: 'Footwear', category: 'Rare', wearstyles: ['Trend Driver', 'Street Energy'] },
  accessory: { pieceType: 'Accessory', category: 'Limited Edition', wearstyles: ['Style Accent', 'Attention Grabber'] },
};

const toReadableSuggestedName = (value: string) => {
  const [, , slug = 'selected-piece'] = value.split(':');
  return slug
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean)
    .map((token) => `${token[0]?.toUpperCase() ?? ''}${token.slice(1)}`)
    .join(' ');
};

export default function ExploreSchemeView() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [availability, setAvailability] = useState<Record<string, 'available' | 'unavailable'>>({});
  const [itemsBySchemeId, setItemsBySchemeId] = useState<Record<string, SchemeDetailItem[]>>({});

  useEffect(() => {
    const loadSchemesWithItems = async () => {
      const response = await fetch('/api/schemes/public');
      const data = await response.json();
      const safeSchemes = Array.isArray(data) ? (data as Scheme[]) : [];
      setSchemes(safeSchemes);

      const detailResponses = await Promise.all(
        safeSchemes.map((scheme) =>
          fetch(`/api/schemes/${scheme.scheme_id}`)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ),
      );

      const nextItemsBySchemeId: Record<string, SchemeDetailItem[]> = {};

      detailResponses.forEach((details, index) => {
        const currentScheme = safeSchemes[index];
        const detailPayload = details as SchemeDetailsResponse | null;
        nextItemsBySchemeId[currentScheme.scheme_id] = detailPayload?.items ?? [];
      });

      setItemsBySchemeId(nextItemsBySchemeId);
    };

    loadSchemesWithItems().catch(() => {
      setSchemes([]);
      setItemsBySchemeId({});
    });
  }, []);

  const grouped = useMemo(() => {
    const byOccasion = new Map<string, Scheme[]>();
    schemes.forEach((scheme) => {
      const key = scheme.occasion || 'General';
      byOccasion.set(key, [...(byOccasion.get(key) ?? []), scheme]);
    });
    return Array.from(byOccasion.entries());
  }, [schemes]);

  const buildOutfitPreviewData = (scheme: Scheme): OutfitCardData => {
    const styleLine = `${scheme.style || 'Streetwear'} • ${scheme.occasion || 'General'}`;
    const relatedItems = itemsBySchemeId[scheme.scheme_id] ?? [];
    const savedPieces = Array.isArray(scheme.pieces) ? scheme.pieces : [];
    let parsedBackground: OutfitCardData['outfitBackground'] = undefined;

    try {
      const parsedDescription = scheme.description ? JSON.parse(scheme.description) : null;
      if (parsedDescription?.outfitBackground) {
        parsedBackground = parsedDescription.outfitBackground;
      }
    } catch {
      parsedBackground = undefined;
    }

    const normalizedPieces = savedPieces.length
      ? savedPieces.map((piece, index) => ({
          id: (piece as { id?: string; piece_id?: string }).id
            || (piece as { id?: string; piece_id?: string }).piece_id
            || `${scheme.scheme_id}-piece-${index}`,
          name: (piece as { name?: string; piece_name?: string }).name
            || (piece as { name?: string; piece_name?: string }).piece_name
            || 'Selected piece',
          brand: (piece as { brand?: string; brand_name?: string }).brand
            || (piece as { brand?: string; brand_name?: string }).brand_name
            || 'Selection Default Brand',
          brandLogoUrl: (piece as { brandLogoUrl?: string; brand_logo_url?: string }).brandLogoUrl
            || (piece as { brandLogoUrl?: string; brand_logo_url?: string }).brand_logo_url,
          pieceType: (piece as { pieceType?: string; piece_type?: string }).pieceType
            || (piece as { pieceType?: string; piece_type?: string }).piece_type
            || 'Garment',
          category: piece.category,
          wearstyles: piece.wearstyles,
        }))
      : relatedItems.length
        ? relatedItems.map((item) => {
            const derivedName = item.wardrobe_name?.trim()
              || (item.wardrobe_item_id.startsWith('suggested:')
                ? toReadableSuggestedName(item.wardrobe_item_id)
                : 'Selected piece');
            return {
              id: item.scheme_item_id,
              name: derivedName,
              brand: 'Selection Default Brand',
              pieceType: SLOT_PREVIEW_DEFAULTS[item.slot].pieceType,
              category: SLOT_PREVIEW_DEFAULTS[item.slot].category,
              wearstyles: SLOT_PREVIEW_DEFAULTS[item.slot].wearstyles,
              pieceTypeIconUrl: item.image_url || undefined,
            };
          })
        : [];

    return {
      outfitName: scheme.title || 'Untitled Outfit',
      outfitStyleLine: styleLine,
      outfitDescription: buildOutfitDescriptionFallback({
        pieces: normalizedPieces,
        outfitStyleLine: `${scheme.style || 'Minimal'} ${scheme.occasion || 'General'}`,
        outfitName: scheme.title || 'Untitled Outfit',
      }),
      heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
      outfitBackground: parsedBackground,
      pieces: normalizedPieces,
    };
  };

  const renderContextualStatusMenu = (schemeId: string) => {
    const currentAvailability = availability[schemeId] ?? 'available';
    const isFavorite = Boolean(favorites[schemeId]);

    const baseButtonClass = 'rounded-lg border px-2.5 py-1 text-xs font-semibold transition';
    const activeClass = 'border-blue-300 bg-blue-600 text-white shadow shadow-blue-700/30';
    const idleClass = 'border-blue-200/50 bg-blue-900/20 text-blue-100 hover:bg-blue-700/30';

    return (
      <div className="rounded-xl border border-blue-200/30 bg-blue-950/20 p-2">
        <p className="text-[11px] text-blue-100/90">Classificação do card</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFavorites((prev) => ({ ...prev, [schemeId]: !prev[schemeId] }))}
            className={`${baseButtonClass} ${isFavorite ? activeClass : idleClass}`}
          >
            ★ Favorite
          </button>
          <button
            type="button"
            onClick={() => setAvailability((prev) => ({ ...prev, [schemeId]: 'available' }))}
            className={`${baseButtonClass} ${currentAvailability === 'available' ? activeClass : idleClass}`}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => setAvailability((prev) => ({ ...prev, [schemeId]: 'unavailable' }))}
            className={`${baseButtonClass} ${currentAvailability === 'unavailable' ? activeClass : idleClass}`}
          >
            Unavailable
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Outfit Cards" subtitle="Manage outfits by occasion, preference, favorite, and availability." />

      {grouped.map(([occasion, occasionSchemes]) => (
        <SectionBlock key={occasion} title={`Occasion: ${occasion}`} subtitle="Outfits grouped by occasion.">
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {occasionSchemes.map((scheme) => (
              <article key={scheme.scheme_id} className="space-y-3 rounded-2xl border border-white/25 p-3">
                {renderContextualStatusMenu(scheme.scheme_id)}
                <OutfitCard data={buildOutfitPreviewData(scheme)} />
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white/80">
                  <p>Status: {availability[scheme.scheme_id] ?? 'available'}</p>
                  <p>Favorite: {favorites[scheme.scheme_id] ? 'yes' : 'no'}</p>
                </div>
              </article>
            ))}
          </div>
        </SectionBlock>
      ))}
    </div>
  );
}
