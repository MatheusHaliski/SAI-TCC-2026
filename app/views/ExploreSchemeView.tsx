'use client';

import { useEffect, useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { OutfitCardData } from '@/app/lib/outfit-card';

type Scheme = {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  cover_image_url: string | null;
  user_id: string;
};

export default function ExploreSchemeView() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [availability, setAvailability] = useState<Record<string, 'available' | 'unavailable'>>({});

  useEffect(() => {
    fetch('/api/schemes/public').then((res) => res.json()).then((data) => setSchemes(Array.isArray(data) ? data : []));
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

    return {
      outfitName: scheme.title || 'Untitled Outfit',
      outfitStyleLine: styleLine,
      outfitDescription: `Strong ${scheme.style?.toLowerCase() || 'style'} identity with curated piece selection.`,
      heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
      pieces: [
        {
          id: `${scheme.scheme_id}-upper`,
          name: 'Primary Layer',
          brand: 'Brand not specified',
          pieceType: 'Garment',
          category: 'Premium',
          wearstyles: ['Statement Piece', 'Visual Anchor'],
        },
        {
          id: `${scheme.scheme_id}-base`,
          name: 'Base Composition',
          brand: 'Brand not specified',
          pieceType: 'Core Piece',
          category: 'Standard',
          wearstyles: ['Balanced Fit'],
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
