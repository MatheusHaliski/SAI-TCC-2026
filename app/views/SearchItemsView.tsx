'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { FILTER_GLOW_BAR, FILTER_GLOW_LINE } from '@/app/lib/uiToken';

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

const seasonOptions = ['winter', 'summer', 'autumn', 'spring'];
const genderOptions = ['male', 'female'];
const brandOptions = ['Adidas', 'Nike', 'Zara', 'C&A', 'Puma', 'Levis'];
const pieceTypeOptions = ['upper_piece', 'shoes_piece', 'lower_piece', 'accessory_piece'];

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

      <SectionBlock title="Search Items" subtitle="Use the SAI fashion filter panel and browse piece item cards below.">
        <div className="relative mt-4 overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 shadow-[0_14px_45px_rgba(16,185,129,0.25)]">
          <div className="pointer-events-none absolute -left-20 top-6 h-56 w-56 rounded-full bg-[#22c55e]/20 blur-[120px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#38bdf8]/20 blur-[160px]" />

          <section className={["relative z-10 rounded-3xl border-4 border-white px-5 py-4","bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 ",
    "shadow-[0_14px_45px_rgba(16,185,129,0.25)]"].join(' ')}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { key: 'season', label: 'Season', options: seasonOptions },
                { key: 'gender', label: 'Gender', options: genderOptions },
                { key: 'brand', label: 'Brand', options: brandOptions },
                { key: 'piece_type', label: 'Piece Type', options: pieceTypeOptions },
              ].map((field) => (
                <label key={field.key} className="space-y-2 font-sharetech">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{field.label}</span>
                  <select
                    value={filters[field.key as keyof typeof defaultFilters]}
                    onChange={(event) =>
                      setFilters((prev) => ({ ...prev, [field.key]: event.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-white/14 bg-white/[0.08] px-3 text-white backdrop-blur-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300/35"
                  >
                    <option value="" className="text-black">
                      All {field.label}
                    </option>
                    {field.options.map((value) => (
                      <option key={value} value={value} className="text-black">
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>

          <div className="relative z-10 mt-5">
            <h3 className="text-lg font-semibold text-white">Piece Items</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article key={item.piece_item_id} className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
                  <img src={item.image_url} alt={item.name} className="h-48 w-full object-cover" />
                  <div className="space-y-1 px-4 py-3 text-white">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-white/80">Season: {item.season}</p>
                    <p className="text-sm text-white/80">Gender: {item.gender}</p>
                    <p className="text-sm text-white/80">Brand: {item.brand}</p>
                    <p className="text-sm text-white/80">Type: {item.piece_type}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
