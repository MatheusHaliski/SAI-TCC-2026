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

const brandOptions = ['', 'Nike', 'Adidas', 'Guess', 'Levis', 'New Balance'];
const seasonOptions = ['', 'Winter', 'Summer', 'Autumn', 'Spring'];
const genderOptions = ['', 'Male', 'Female', 'Unisex'];
const pieceTypeOptions = ['', 'upper', 'lower', 'shoes', 'accessory'];

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
      <SectionBlock title="Filters" subtitle="Use the controls below to refine results.">
        <div className="mt-4 rounded-2xl border-4 border-black bg-green-500 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <select
              value={filters.brand}
              onChange={(event) => setFilters((prev) => ({ ...prev, brand: event.target.value }))}
              className="rounded-xl border-2 border-black bg-green-300 px-3 py-2 text-black"
            >
              {brandOptions.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All brands'}
                </option>
              ))}
            </select>

            <select
              value={filters.season}
              onChange={(event) => setFilters((prev) => ({ ...prev, season: event.target.value }))}
              className="rounded-xl border-2 border-black bg-green-300 px-3 py-2 text-black"
            >
              {seasonOptions.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All seasons'}
                </option>
              ))}
            </select>

            <select
              value={filters.gender}
              onChange={(event) => setFilters((prev) => ({ ...prev, gender: event.target.value }))}
              className="rounded-xl border-2 border-black bg-green-300 px-3 py-2 text-black"
            >
              {genderOptions.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All genders'}
                </option>
              ))}
            </select>

            <select
              value={filters.piece_type}
              onChange={(event) => setFilters((prev) => ({ ...prev, piece_type: event.target.value }))}
              className="rounded-xl border-2 border-black bg-green-300 px-3 py-2 text-black"
            >
              {pieceTypeOptions.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All piece types'}
                </option>
              ))}
            </select>
          </div>
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
