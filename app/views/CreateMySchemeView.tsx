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

const DEFAULT_SLOT_SUGGESTIONS: Record<
  'upper' | 'lower' | 'shoes' | 'accessory',
  Array<{ value: string; label: string }>
> = {
  upper: [
    { value: 'suggested:upper:classic-white-tee', label: 'Classic White Tee' },
    { value: 'suggested:upper:slim-oxford-shirt', label: 'Slim Oxford Shirt' },
    { value: 'suggested:upper:oversized-hoodie', label: 'Oversized Hoodie' },
  ],
  lower: [
    { value: 'suggested:lower:black-tailored-pants', label: 'Black Tailored Pants' },
    { value: 'suggested:lower:straight-blue-jeans', label: 'Straight Blue Jeans' },
    { value: 'suggested:lower:cargo-utility-pants', label: 'Cargo Utility Pants' },
  ],
  shoes: [
    { value: 'suggested:shoes:white-sneakers', label: 'White Sneakers' },
    { value: 'suggested:shoes:leather-loafers', label: 'Leather Loafers' },
    { value: 'suggested:shoes:chelsea-boots', label: 'Chelsea Boots' },
  ],
  accessory: [
    { value: 'suggested:accessory:minimal-watch', label: 'Minimal Watch' },
    { value: 'suggested:accessory:crossbody-bag', label: 'Crossbody Bag' },
    { value: 'suggested:accessory:silver-chain', label: 'Silver Chain' },
  ],
};

const sections = ['Scheme Data', 'Manual Builder', 'AI Generation', 'Slots', 'Save'];

export default function CreateMySchemeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Minimal');
  const [occasion, setOccasion] = useState('Daily');
  const [visibility, setVisibility] = useState<'private' | 'public'>('public');
  const [slots, setSlots] = useState<Record<string, string | null>>({
    upper: null,
    lower: null,
    shoes: null,
    accessory: null,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  const inputClassName =
    'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40';

  const selectClassName =
    'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40';

  const slotCardClassName =
    'rounded-xl border border-white/20 bg-white/10 p-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md';

  const primaryButtonClassName =
    'rounded-xl border border-white/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition hover:scale-[1.01] hover:brightness-110';

  const secondaryButtonClassName =
    'rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-white/15';

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
        .map(([slot, id], idx) => ({
          wardrobe_item_id: String(id),
          slot,
          sort_order: idx + 1,
        })),
    [slots],
  );

  const saveScheme = async (creation_mode: 'manual' | 'ai') => {
    if (!userId) {
      setAlertMessage('User session not found. Please sign in again.');
      return;
    }

    if (schemeItems.length === 0) {
      setAlertMessage('Select at least one wardrobe item before saving.');
      return;
    }

    try {
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

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setAlertMessage(payload?.error || 'Unable to save scheme. Please try again.');
        return;
      }

      setAlertMessage('Scheme saved successfully.');
    } catch {
      setAlertMessage('Unable to save scheme. Please try again.');
    }
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
          <PageHeader
            title="Create My Scheme"
            subtitle="Manual composition and AI-assisted generation."
          />

          <SectionBlock
            title="Scheme Metadata + Visual Slot Editor"
            subtitle="Define metadata and assign wardrobe pieces in one compact form."
            className="sa-surface-header h-auto border-white/20"
          >
            <form
              className="mt-4 grid gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.14)] backdrop-blur-md md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveScheme('manual');
              }}
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className={inputClassName}
              />

              <input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Style"
                className={inputClassName}
              />

              <input
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Occasion"
                className={inputClassName}
              />

              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'private' | 'public')}
                className={selectClassName}
              >
                <option value="public" className="bg-slate-900 text-white">
                  Public
                </option>
                <option value="private" className="bg-slate-900 text-white">
                  Private
                </option>
              </select>

              {(['upper', 'lower', 'shoes', 'accessory'] as const).map((slot) => (
                <div key={slot} className={slotCardClassName}>
                  <p className="text-sm font-semibold capitalize text-white">
                    {slot} piece
                  </p>

                  <select
                    value={slots[slot] ?? ''}
                    onChange={(e) =>
                      setSlots((prev) => ({ ...prev, [slot]: e.target.value || null }))
                    }
                    className={`mt-2 ${selectClassName}`}
                  >
                    <option value="" className="bg-slate-900 text-white">
                      Select item
                    </option>

                    {DEFAULT_SLOT_SUGGESTIONS[slot].map((suggestion) => (
                      <option
                        key={suggestion.value}
                        value={suggestion.value}
                        className="bg-slate-900 text-white"
                      >
                        Suggested: {suggestion.label}
                      </option>
                    ))}

                    {optionsByType(slot).map((item) => (
                      <option
                        key={item.wardrobe_item_id}
                        value={item.wardrobe_item_id}
                        className="bg-slate-900 text-white"
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="mt-1 flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" className={primaryButtonClassName}>
                  Save Scheme
                </button>

                <button
                  type="button"
                  onClick={() => saveScheme('ai')}
                  className={secondaryButtonClassName}
                >
                  Generate with AI + Save
                </button>
              </div>
            </form>
          </SectionBlock>
        </div>
      </div>

      {alertMessage ? (
        <SaiModalAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} />
      ) : null}
    </>
  );
}
