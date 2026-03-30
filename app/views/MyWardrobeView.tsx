'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

interface WardrobeItem {
  wardrobe_item_id: string;
  name: string;
  image_url: string;
  brand: string;
  season: string;
  gender: string;
  piece_type: string;
}

const sections = ['Available', 'Unavailable', 'Favorites'];

export default function MyWardrobeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [availability, setAvailability] = useState<Record<string, 'available' | 'unavailable'>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadWardrobeData = async () => {
      const localProfile = getAuthSessionProfile();
      let resolvedUserId = localProfile.user_id?.trim() || '';

      if (!resolvedUserId) {
        const serverProfile = await getServerSession();
        resolvedUserId = serverProfile?.user_id?.trim() || '';
      }

      if (!resolvedUserId) {
        setItems([]);
        return;
      }

      const wardrobeResponse = await fetch(`/api/wardrobe-items/user/${resolvedUserId}`);
      const wardrobeItems = await wardrobeResponse.json().catch(() => []);
      setItems(wardrobeResponse.ok && Array.isArray(wardrobeItems) ? wardrobeItems : []);
    };

    loadWardrobeData().catch(() => setItems([]));
  }, []);

  const grouped = useMemo(() => {
    const available = items.filter((item) => (availability[item.wardrobe_item_id] ?? 'available') === 'available');
    const unavailable = items.filter((item) => (availability[item.wardrobe_item_id] ?? 'available') === 'unavailable');
    const favorite = items.filter((item) => favorites[item.wardrobe_item_id]);
    return { available, unavailable, favorite };
  }, [availability, favorites, items]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ContextSectionMenu title="Virtual Wardrobe" sections={sections} />
      <div className="space-y-6">
        <PageHeader title="Virtual Wardrobe" subtitle="Classify pieces as available, unavailable, and favorites." />

        {([
          { key: 'available', title: 'Available Pieces', data: grouped.available },
          { key: 'unavailable', title: 'Unavailable Pieces', data: grouped.unavailable },
          { key: 'favorite', title: 'Favorite Pieces', data: grouped.favorite },
        ] as const).map((group) => (
          <SectionBlock key={group.key} title={group.title} subtitle="Manage list status for each wardrobe item.">
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.data.map((item) => (
                <article key={item.wardrobe_item_id} className="rounded-2xl border border-white/25 p-4">
                  <img src={item.image_url} alt={item.name} className="h-36 w-full rounded-xl object-cover" />
                  <h3 className="mt-3 text-base font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-white/70">Brand: {item.brand}</p>
                  <p className="text-sm text-white/70">Type: {item.piece_type}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'available' }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Available</button>
                    <button type="button" onClick={() => setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'unavailable' }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Unavailable</button>
                    <button type="button" onClick={() => setFavorites((prev) => ({ ...prev, [item.wardrobe_item_id]: !prev[item.wardrobe_item_id] }))} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">★ Favorite</button>
                  </div>
                </article>
              ))}
              {!group.data.length ? <p className="text-sm text-white/70">No pieces in this list.</p> : null}
            </div>
          </SectionBlock>
        ))}
      </div>
    </div>
  );
}
