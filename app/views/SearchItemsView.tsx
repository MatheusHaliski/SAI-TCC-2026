'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

type Item = {
  piece_item_id: string;
  image_url: string;
  gender: string;
  brand: string;
  name: string;
  season: string;
  piece_type: string;
};

const defaultFilters = { season: '', gender: '', brand: '', piece_type: '' };

export default function SearchItemsView() {
  const [filters, setFilters] = useState(defaultFilters);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    fetch(`/api/piece-items?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, [filters]);

  return (
    <div className="space-y-6">
      <PageHeader title="Search Items" subtitle="Filter catalog by season, gender, brand and piece type." />

      <SectionBlock title="Search Items" subtitle="Use the compact filter panel and browse piece item results below.">
        <div className="mt-4 space-y-5 rounded-2xl border-2 border-black bg-green-500 p-4">
          <div>
            <h3 className="text-lg font-semibold text-black">Filters</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              {Object.keys(defaultFilters).map((filter) => (
                <div key={filter} className="rounded-xl border border-black bg-white px-2 py-1">
                  <input
                    value={filters[filter as keyof typeof defaultFilters]}
                    placeholder={filter}
                    onChange={(event) => setFilters((prev) => ({ ...prev, [filter]: event.target.value }))}
                    className="w-full bg-transparent px-1 py-1 text-black placeholder:text-black/60 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black">Piece Items</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article key={item.piece_item_id} className="sa-premium-gradient-surface-soft rounded-2xl border border-black p-4">
                  <img src={item.image_url} alt={item.name} className="h-36 w-full rounded-xl object-cover" />
                  <h4 className="mt-3 font-semibold text-white">{item.name}</h4>
                  <p className="text-sm text-white/70">Gender: {item.gender}</p>
                  <p className="text-sm text-white/70">Brand: {item.brand}</p>
                  <p className="text-sm text-white/70">Season: {item.season}</p>
                  <p className="text-sm text-white/70">Type: {item.piece_type}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
