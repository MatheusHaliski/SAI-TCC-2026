'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

type Item = {
  piece_item_id: number;
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
      .then((data) => setItems(data));
  }, [filters]);

  return (
    <div className="space-y-6">
      <PageHeader title="Search Items" subtitle="Filter catalog by season, gender, brand and piece type." />
      <SectionBlock title="Filters" subtitle="Use the controls below to refine results.">
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {Object.keys(defaultFilters).map((filter) => (
            <input
              key={filter}
              value={filters[filter as keyof typeof defaultFilters]}
              placeholder={filter}
              onChange={(event) => setFilters((prev) => ({ ...prev, [filter]: event.target.value }))}
              className="sa-premium-gradient-surface-soft rounded-xl border border-white/30 px-3 py-2 text-white placeholder:text-white/60"
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Piece Items" subtitle="Results from selected filters.">
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.piece_item_id} className="sa-premium-gradient-surface-soft rounded-2xl border border-white/25 p-4">
              <img src={item.image_url} alt={item.name} className="h-36 w-full rounded-xl object-cover" />
              <h3 className="mt-3 text-white font-semibold">{item.name}</h3>
              <p className="text-sm text-white/70">Gender: {item.gender}</p>
              <p className="text-sm text-white/70">Brand: {item.brand}</p>
              <p className="text-sm text-white/70">Season: {item.season}</p>
              <p className="text-sm text-white/70">Type: {item.piece_type}</p>
            </article>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
