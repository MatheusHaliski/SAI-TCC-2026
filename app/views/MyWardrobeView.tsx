'use client';

import { useEffect, useState } from 'react';
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

interface SavedScheme {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  visibility: 'private' | 'public';
  created_at: string;
}

interface Analysis {
  total_items: number;
  by_brand: Record<string, number>;
  by_season: Record<string, number>;
  by_gender: Record<string, number>;
  by_piece_type: Record<string, number>;
}

const sections = ['Wardrobe Items', 'Saved Schemes', 'Analysis', 'By Brand', 'By Season', 'By Piece Type'];

const renderGroup = (group?: Record<string, number> | null) =>
  Object.entries(group ?? {}).map(([key, value]) => (
    <li key={key} className="sa-premium-gradient-surface-soft rounded-xl border border-white/25 px-3 py-2 text-sm text-white/90">
      {key}: {value}
    </li>
  ));

export default function MyWardrobeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<SavedScheme[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/wardrobe-items/user/1').then((res) => res.json()),
      fetch('/api/wardrobe-items/user/1/analysis').then((res) => res.json()),
      fetch('/api/schemes/user/1').then((res) => res.json()),
    ]).then(([wardrobeItems, wardrobeAnalysis, userSavedSchemes]) => {
      setItems(Array.isArray(wardrobeItems) ? wardrobeItems : []);
      setAnalysis(wardrobeAnalysis && !Array.isArray(wardrobeAnalysis) ? wardrobeAnalysis : null);
      setSavedSchemes(Array.isArray(userSavedSchemes) ? userSavedSchemes : []);
    });
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ContextSectionMenu title="My Wardrobe" sections={sections} />
      <div className="space-y-6">
        <PageHeader title="My Wardrobe" subtitle="Visualize all pieces and monitor your wardrobe composition." />

        <SectionBlock title="Wardrobe Items" subtitle="Your saved pieces.">
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.wardrobe_item_id} className="sa-premium-gradient-surface-soft rounded-2xl border border-white/25 p-4">
                <img src={item.image_url} alt={item.name} className="h-36 w-full rounded-xl object-cover" />
                <h3 className="mt-3 text-base font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-white/70">Brand: {item.brand}</p>
                <p className="text-sm text-white/70">Season: {item.season}</p>
                <p className="text-sm text-white/70">Gender: {item.gender}</p>
                <p className="text-sm text-white/70">Type: {item.piece_type}</p>
              </article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Saved Schemes" subtitle="Schemes saved from the Create My Scheme form.">
          <div className="mt-4 space-y-2">
            {savedSchemes.length ? (
              savedSchemes.map((scheme) => (
                <article key={scheme.scheme_id} className="sa-premium-gradient-surface-soft rounded-xl border border-white/25 px-4 py-3 text-white">
                  <p className="font-semibold">{scheme.title}</p>
                  <p className="text-sm text-white/75">Style: {scheme.style} • Occasion: {scheme.occasion} • Visibility: {scheme.visibility}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-white/75">No saved schemes yet.</p>
            )}
          </div>
        </SectionBlock>

        <SectionBlock title="Wardrobe Analysis" subtitle="Distribution snapshot by metadata groups.">
          {analysis ? (
            <div className="mt-4 space-y-4">
              <p className="text-white">Total pieces: {analysis.total_items}</p>
              <div>
                <p className="text-sm font-semibold text-white">By Brand</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">{renderGroup(analysis.by_brand)}</ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">By Season</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">{renderGroup(analysis.by_season)}</ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">By Gender</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">{renderGroup(analysis.by_gender)}</ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">By Piece Type</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">{renderGroup(analysis.by_piece_type)}</ul>
              </div>
            </div>
          ) : null}
        </SectionBlock>
      </div>
    </div>
  );
}
