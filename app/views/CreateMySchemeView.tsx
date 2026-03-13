'use client';

import { useEffect, useMemo, useState } from 'react';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

type WardrobeItem = { wardrobe_item_id: string; name: string; piece_type: string };

const sections = ['Scheme Data', 'Manual Builder', 'AI Generation', 'Slots', 'Save'];

export default function CreateMySchemeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Minimal');
  const [occasion, setOccasion] = useState('Daily');
  const [visibility, setVisibility] = useState<'private' | 'public'>('public');
  const [slots, setSlots] = useState<Record<string, string | null>>({ upper: null, lower: null, shoes: null, accessory: null });

  useEffect(() => {
    fetch('/api/wardrobe-items/user/user_1').then((res) => res.json()).then((data) => setItems(data));
  }, []);

  const schemeItems = useMemo(
    () =>
      Object.entries(slots)
        .filter(([, id]) => id)
        .map(([slot, id], idx) => ({ wardrobe_item_id: String(id), slot, sort_order: idx + 1 })),
    [slots],
  );

  const saveScheme = async (creation_mode: 'manual' | 'ai') => {
    await fetch('/api/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'user_1', title, style, occasion, visibility, creation_mode, items: schemeItems }),
    });
    alert('Scheme saved successfully.');
  };

  const optionsByType = (type: string) => items.filter((item) => item.piece_type === type);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ContextSectionMenu title="Create My Scheme" sections={sections} />
      <div className="space-y-6">
        <PageHeader title="Create My Scheme" subtitle="Manual composition and AI-assisted generation." />

        <SectionBlock title="Scheme Metadata" subtitle="Title, style, occasion and visibility.">
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="sa-premium-gradient-surface-soft rounded-xl border border-white/30 px-3 py-2" />
            <input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Style" className="sa-premium-gradient-surface-soft rounded-xl border border-white/30 px-3 py-2" />
            <input value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="Occasion" className="sa-premium-gradient-surface-soft rounded-xl border border-white/30 px-3 py-2" />
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'private' | 'public')} className="sa-premium-gradient-surface-soft rounded-xl border border-white/30 px-3 py-2">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </SectionBlock>

        <SectionBlock title="Visual Slot Editor" subtitle="Assign wardrobe pieces to slots.">
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(['upper', 'lower', 'shoes', 'accessory'] as const).map((slot) => (
              <div key={slot} className="sa-premium-gradient-surface-soft rounded-xl border border-white/25 p-3">
                <p className="text-sm font-semibold text-white capitalize">{slot} piece</p>
                <select
                  value={slots[slot] ?? ''}
                  onChange={(e) => setSlots((prev) => ({ ...prev, [slot]: e.target.value || null }))}
                  className="mt-2 w-full rounded-lg border border-white/30 bg-transparent px-3 py-2"
                >
                  <option value="">Select item</option>
                  {optionsByType(slot).map((item) => (
                    <option key={item.wardrobe_item_id} value={item.wardrobe_item_id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => saveScheme('manual')} className="rounded-xl border border-white/35 bg-white px-4 py-2 text-sm font-semibold text-black">Save Scheme</button>
            <button onClick={() => saveScheme('ai')} className="rounded-xl border border-white/35 px-4 py-2 text-sm font-semibold text-white">Generate with AI + Save</button>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
