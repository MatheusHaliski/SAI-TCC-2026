'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

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

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Outfits" subtitle="Manage outfits by occasion, preference, favorite, and availability." />

      {grouped.map(([occasion, occasionSchemes]) => (
        <SectionBlock key={occasion} title={`Occasion: ${occasion}`} subtitle="Outfits grouped by occasion.">
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {occasionSchemes.map((scheme) => (
              <article key={scheme.scheme_id} className="rounded-2xl border border-white/25 p-4">
                <div className="h-32 rounded-xl bg-black/20" style={{ backgroundImage: scheme.cover_image_url ? `url(${scheme.cover_image_url})` : undefined, backgroundSize: 'cover' }} />
                <h3 className="mt-3 font-semibold text-white">{scheme.title}</h3>
                <p className="text-sm text-white/75">Preference: {scheme.style}</p>
                <p className="text-sm text-white/75">Status: {availability[scheme.scheme_id] ?? 'available'}</p>
                <p className="text-sm text-white/75">Favorite: {favorites[scheme.scheme_id] ? 'yes' : 'no'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setFavorites((prev) => ({ ...prev, [scheme.scheme_id]: !prev[scheme.scheme_id] }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">★ Favorite</button>
                  <button type="button" onClick={() => setAvailability((prev) => ({ ...prev, [scheme.scheme_id]: 'available' }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Available</button>
                  <button type="button" onClick={() => setAvailability((prev) => ({ ...prev, [scheme.scheme_id]: 'unavailable' }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Unavailable</button>
                </div>
              </article>
            ))}
          </div>
        </SectionBlock>
      ))}
    </div>
  );
}
