'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SaiModalAlert from '@/app/components/shared/SaiModalAlert';
import SectionBlock from '@/app/components/shared/SectionBlock';

type WardrobeItem = { wardrobe_item_id: string; name: string; piece_type: string };

const SLOT_TYPE_ALIASES: Record<'upper' | 'lower' | 'shoes' | 'accessory', string[]> = {
  upper: ['upper', 'upper piece', 'top', 'tops'],
  lower: ['lower', 'lower piece', 'bottom', 'bottoms'],
  shoes: ['shoes', 'shoes piece', 'shoe', 'footwear'],
  accessory: ['accessory', 'accessories'],
};

const normalizePieceType = (value: string) => value.trim().toLowerCase();

const sections = ['Scheme Data', 'Manual Builder', 'AI Generation', 'Slots', 'Save'];

export default function CreateMySchemeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Minimal');
  const [occasion, setOccasion] = useState('Daily');
  const [visibility, setVisibility] = useState<'private' | 'public'>('public');
  const [slots, setSlots] = useState<Record<string, string | null>>({ upper: null, lower: null, shoes: null, accessory: null });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loadSessionAndItems = async () => {
      const localProfile = getAuthSessionProfile();
      let resolvedUserId = localProfile.user_id?.trim() || '';

      if (!resolvedUserId) {
        const serverProfile = await getServerSession();
        resolvedUserId = serverProfile?.user_id?.trim() || '';
      }

      if (!resolvedUserId) {
        setAlertMessage('User session not found. Please sign in again.');
        setItems([]);
        return;
      }

      setUserId(resolvedUserId);

      const response = await fetch(`/api/wardrobe-items/user/${resolvedUserId}`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    };

    loadSessionAndItems().catch(() => {
      setAlertMessage('Unable to load user session. Please sign in again.');
      setItems([]);
    });
  }, []);

  const schemeItems = useMemo(
    () =>
      Object.entries(slots ?? {})
        .filter(([, id]) => id)
        .map(([slot, id], idx) => ({ wardrobe_item_id: String(id), slot, sort_order: idx + 1 })),
    [slots],
  );

  const saveScheme = async (creation_mode: 'manual' | 'ai') => {
    if (!userId) {
      setAlertMessage('User session not found. Please sign in again.');
      return;
    }

    const response = await fetch('/api/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        title: title.trim() || 'My New Scheme',
        style: style.trim() || 'Minimal',
        occasion: occasion.trim() || 'Daily',
        visibility,
        creation_mode,
        items: schemeItems,
      }),
    });

    if (!response.ok) {
      setAlertMessage('Unable to save scheme. Please try again.');
      return;
    }

    setAlertMessage('Scheme saved successfully.');
  };

  const optionsByType = (slot: 'upper' | 'lower' | 'shoes' | 'accessory') => {
    const aliases = SLOT_TYPE_ALIASES[slot];
    return items.filter((item) => aliases.includes(normalizePieceType(item.piece_type)));
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ContextSectionMenu title="Create My Scheme" sections={sections} />
        <div className="space-y-6">
          <PageHeader title="Create My Scheme" subtitle="Manual composition and AI-assisted generation." />

          <SectionBlock
            title="Scheme Metadata + Visual Slot Editor"
            subtitle="Define metadata and assign wardrobe pieces in one compact form."
            className="sa-surface-header h-auto border-black/70"
          >
            <form
              className="sa-premium-gradient-surface-soft mt-4 grid gap-3 rounded-2xl border border-black p-4 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveScheme('manual');
              }}
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="rounded-xl border border-black bg-white/90 px-3 py-2 text-black placeholder:text-black"
              />
              <input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Style"
                className="rounded-xl border border-black bg-white/90 px-3 py-2 text-black placeholder:text-black"
              />
              <input
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Occasion"
                className="rounded-xl border border-black bg-white/90 px-3 py-2 text-black placeholder:text-black"
              />
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'private' | 'public')}
                className="rounded-xl border border-black bg-white/90 px-3 py-2 text-black"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              {(['upper', 'lower', 'shoes', 'accessory'] as const).map((slot) => (
                <div key={slot} className="rounded-xl border border-black bg-white/80 p-3 text-black">
                  <p className="text-sm font-semibold capitalize">{slot} piece</p>
                  <select
                    value={slots[slot] ?? ''}
                    onChange={(e) => setSlots((prev) => ({ ...prev, [slot]: e.target.value || null }))}
                    className="mt-2 w-full rounded-lg border border-black bg-white px-3 py-2 text-black"
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

              <div className="mt-1 flex gap-3 md:col-span-2">
                <button type="submit" className="rounded-xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white">Save Scheme</button>
                <button type="button" onClick={() => saveScheme('ai')} className="rounded-xl border border-black bg-white px-4 py-2 text-sm font-semibold text-black">Generate with AI + Save</button>
              </div>
            </form>
          </SectionBlock>
        </div>
      </div>

      {alertMessage ? <SaiModalAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} /> : null}
    </>
  );
}
