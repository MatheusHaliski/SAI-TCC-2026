'use client';

import { useEffect, useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { OutfitCardData } from '@/app/lib/outfit-card';

type Scheme = {
  scheme_id: string;
  title: string;
  description?: string | null;
  style: string;
  occasion: string;
  cover_image_url: string | null;
  user_id: string;
};
type SchemeDetailItem = {
  scheme_item_id: string;
  slot: 'upper' | 'lower' | 'shoes' | 'accessory';
  wardrobe_name: string;
  image_url: string;
};
type SchemeDetailsResponse = {
  scheme: Scheme;
  items: SchemeDetailItem[];
};

const SLOT_PREVIEW_DEFAULTS: Record<
  SchemeDetailItem['slot'],
  { pieceType: string; category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare'; wearstyles: string[] }
> = {
  upper: { pieceType: 'Jacket', category: 'Premium', wearstyles: ['Statement Piece', 'Visual Anchor'] },
  lower: { pieceType: 'Pants', category: 'Standard', wearstyles: ['Base Structure', 'Balanced Fit'] },
  shoes: { pieceType: 'Footwear', category: 'Rare', wearstyles: ['Trend Driver', 'Street Energy'] },
  accessory: { pieceType: 'Accessory', category: 'Limited Edition', wearstyles: ['Style Accent', 'Attention Grabber'] },
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
    let parsedBackground: OutfitCardData['outfitBackground'] = undefined;

    try {
      const parsedDescription = scheme.description ? JSON.parse(scheme.description) : null;
      if (parsedDescription?.outfitBackground) {
        parsedBackground = parsedDescription.outfitBackground;
      }
    } catch {
      parsedBackground = undefined;
    }

    return {
      outfitName: scheme.title || 'Untitled Outfit',
      outfitStyleLine: styleLine,
      outfitDescription: `Strong ${scheme.style?.toLowerCase() || 'style'} identity with curated piece selection.`,
      heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
      outfitBackground: parsedBackground,
      pieces: relatedItems.length
        ? relatedItems.map((item) => ({
            id: item.scheme_item_id,
            name: item.wardrobe_name || 'Unnamed Piece',
            brand: 'Brand not specified',
            pieceType: SLOT_PREVIEW_DEFAULTS[item.slot].pieceType,
            category: SLOT_PREVIEW_DEFAULTS[item.slot].category,
            wearstyles: SLOT_PREVIEW_DEFAULTS[item.slot].wearstyles,
            pieceTypeIconUrl: item.image_url || undefined,
          }))
        : [
            {
              id: `${scheme.scheme_id}-fallback`,
              name: 'Unnamed Piece',
              brand: 'Brand not specified',
              pieceType: 'Garment',
              category: 'Standard',
              wearstyles: ['Unclassified'],
            },
          ],
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Outfits" subtitle="Manage outfits by occasion, preference, favorite, and availability." />

      {grouped.map(([occasion, occasionSchemes]) => (
        <SectionBlock key={occasion} title={`Occasion: ${occasion}`} subtitle="Outfits grouped by occasion.">
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {occasionSchemes.map((scheme) => (
              <article key={scheme.scheme_id} className="space-y-3 rounded-2xl border border-white/25 p-3">
                <OutfitCard data={buildOutfitPreviewData(scheme)} />
                <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white/80">
                  <p>Status: {availability[scheme.scheme_id] ?? 'available'}</p>
                  <p>Favorite: {favorites[scheme.scheme_id] ? 'yes' : 'no'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setFavorites((prev) => ({ ...prev, [scheme.scheme_id]: !prev[scheme.scheme_id] }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">★ Favorite</button>
                    <button type="button" onClick={() => setAvailability((prev) => ({ ...prev, [scheme.scheme_id]: 'available' }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Available</button>
                    <button type="button" onClick={() => setAvailability((prev) => ({ ...prev, [scheme.scheme_id]: 'unavailable' }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Unavailable</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionBlock>
      ))}
    </div>
  );
}
