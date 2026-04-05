'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import SaiModalAlert from '@/app/components/shared/SaiModalAlert';
import SectionBlock from '@/app/components/shared/SectionBlock';
import FancySelect from '@/app/components/ui/fancy-select';
import { OutfitCardData, OutfitPiece, PieceCategory, buildOutfitDescriptionFallback, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';

type WardrobeItem = { wardrobe_item_id: string; name: string; piece_type: string };
type Brand = { brand_id: string; name: string; logo_url?: string | null };
type SlotKey = 'upper' | 'lower' | 'shoes' | 'accessory';
type SchemePieceSnapshot = {
  id: string;
  slot: SlotKey;
  sourceType: 'wardrobe' | 'suggested';
  sourceId: string;
  name: string;
  brand: string;
  brandLogoUrl?: string;
  category: PieceCategory;
  pieceType: string;
  wearstyles: string[];
};

const DEFAULT_BRAND_ID = 'default';
const FALLBACK_BRANDS: Brand[] = [
  {
    brand_id: 'lacoste',
    name: 'Lacoste',
    logo_url: '/lacoste.jpg',
  },
];

const SLOT_TYPE_ALIASES: Record<SlotKey, string[]> = {
  upper: [
    'upper',
    'upper piece',
    'top',
    'tops',
    'upper_body',
    'upper body',
    'shirt',
    't-shirt',
    'tee',
    'blouse',
    'sweater',
    'sweatshirt',
    'hoodie',
    'jacket',
    'coat',
    'blazer',
    'dress',
    'mini dress',
    'midi dress',
    'maxi dress',
  ],
  lower: [
    'lower',
    'lower piece',
    'bottom',
    'bottoms',
    'pants',
    'trousers',
    'jeans',
    'shorts',
    'skirt',
    'mini skirt',
    'midi skirt',
    'maxi skirt',
    'leggings',
  ],
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
    { value: 'suggested:upper:cropped-sweatshirt', label: 'Cropped Sweatshirt' },
    { value: 'suggested:upper:zip-up-sweatshirt', label: 'Zip-Up Sweatshirt' },
    { value: 'suggested:upper:bomber-jacket', label: 'Bomber Jacket' },
    { value: 'suggested:upper:denim-jacket', label: 'Denim Jacket' },
    { value: 'suggested:upper:leather-jacket', label: 'Leather Jacket' },
    { value: 'suggested:upper:tailored-blazer', label: 'Tailored Blazer' },
    { value: 'suggested:upper:trench-coat', label: 'Trench Coat' },
    { value: 'suggested:upper:slip-dress', label: 'Slip Dress' },
    { value: 'suggested:upper:mini-dress', label: 'Mini Dress' },
    { value: 'suggested:upper:midi-dress', label: 'Midi Dress' },
    { value: 'suggested:upper:maxi-dress', label: 'Maxi Dress' },
    { value: 'suggested:upper:bodycon-dress', label: 'Bodycon Dress' },
    { value: 'suggested:upper:shirt-dress', label: 'Shirt Dress' },
    { value: 'suggested:upper:wrap-dress', label: 'Wrap Dress' },
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
const STYLE_OPTIONS = ['Urban', 'Casual', 'Formal', 'Outdoors'];
const OCCASION_OPTIONS = ['Shift', 'Work', 'Daily', 'Night', 'Party'];
const OUTFIT_BACKGROUND_PRESETS = [
  { value: 'solid|#f8fafc', label: 'Solid · Soft Silver' },
  { value: 'solid|#e2e8f0', label: 'Solid · Cool Gray' },
  { value: 'gradient|linear-gradient(135deg, #f8fafc 0%, #dbeafe 42%, #e9d5ff 100%)', label: 'Gradient · Aurora Soft' },
  { value: 'gradient|linear-gradient(135deg, #cffafe 0%, #dbeafe 45%, #fce7f3 100%)', label: 'Gradient · Sky Rose' },
  { value: 'image|/ai-special-bg.png', label: 'AI Image · Dreamscape' },
];
const OUTFIT_BACKGROUND_SHAPES = [
  { value: 'none', label: 'No shape' },
  { value: 'orb', label: 'Orb glow' },
  { value: 'diamond', label: 'Diamond light' },
  { value: 'mesh', label: 'Mesh pattern' },
];
const SLOT_DEFAULT_CATEGORIES: Record<SlotKey, PieceCategory> = {
  upper: 'Premium',
  lower: 'Premium',
  shoes: 'Rare',
  accessory: 'Limited Edition',
};
const SLOT_AUTO_WEARSTYLE: Record<SlotKey, string[]> = {
  upper: ['Statement Piece'],
  lower: ['Visual Anchor'],
  shoes: ['Street Energy'],
  accessory: ['Style Accent'],
};
const SLOT_DEFAULT_PIECE_TYPES: Record<SlotKey, string> = {
  upper: 'Jacket',
  lower: 'Pants',
  shoes: 'Footwear',
  accessory: 'Accessory',
};

export default function CreateMySchemeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState(DEFAULT_BRAND_ID);
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Minimal');
  const [occasion, setOccasion] = useState('Daily');
  const [visibility, setVisibility] = useState<'private' | 'public'>('public');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [outfitBackgroundPreset, setOutfitBackgroundPreset] = useState(OUTFIT_BACKGROUND_PRESETS[2].value);
  const [outfitBackgroundShape, setOutfitBackgroundShape] = useState<'none' | 'orb' | 'diamond' | 'mesh'>('orb');
  const [aiBackgroundImageUrl, setAiBackgroundImageUrl] = useState('');
  const [slots, setSlots] = useState<Record<string, string | null>>({
    upper: null,
    lower: null,
    shoes: null,
    accessory: null,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [generatedCardData, setGeneratedCardData] = useState<OutfitCardData | null>(null);

  const inputClassName =
    'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40';

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

      const [itemsResponse, brandsResponse] = await Promise.all([
        fetch(`/api/wardrobe-items/user/${resolvedUserId}`),
        fetch('/api/brands'),
      ]);
      const itemsData = await itemsResponse.json().catch(() => []);
      const brandsData = await brandsResponse.json().catch(() => []);

      setItems(Array.isArray(itemsData) ? itemsData : []);

      const apiBrands = Array.isArray(brandsData) ? (brandsData as Brand[]) : [];
      const mergedBrands = [
        ...apiBrands,
        ...FALLBACK_BRANDS.filter(
          (fallback) => !apiBrands.some((brand) => brand.brand_id === fallback.brand_id),
        ),
      ];
      setBrands(mergedBrands);
    };

    loadSessionAndItems().catch(() => {
      setAlertMessage('Unable to load user session. Please sign in again.');
      setItems([]);
      setBrands(FALLBACK_BRANDS);
    });
  }, []);

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.brand_id === selectedBrandId) ?? null,
    [brands, selectedBrandId],
  );

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

  const buildOutfitBackgroundConfig = () => {
    const [backgroundType, presetValue] = outfitBackgroundPreset.split('|', 2) as ['solid' | 'gradient' | 'image', string];
    const resolvedBackgroundValue =
      backgroundType === 'image' ? aiBackgroundImageUrl.trim() || presetValue : presetValue;

    return {
      type: backgroundType,
      value: resolvedBackgroundValue,
      shape: outfitBackgroundShape,
    } as const;
  };

  const saveScheme = async (
    creation_mode: 'manual' | 'ai',
    pieceSnapshots: SchemePieceSnapshot[],
  ) => {
    if (!userId) {
      setAlertMessage('User session not found. Please sign in again.');
      return false;
    }

    if (schemeItems.length === 0) {
      setAlertMessage('Select at least one wardrobe item before saving.');
      return false;
    }

    try {
      const selectedBackground = buildOutfitBackgroundConfig();
      const response = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: title.trim() || 'My New Scheme',
          description: JSON.stringify({ outfitBackground: selectedBackground }),
          style: style.trim() || 'Minimal',
          occasion: occasion.trim() || 'Daily',
          cover_image_url: heroImageUrl.trim() || null,
          visibility,
          creation_mode,
          pieces: pieceSnapshots,
          items: schemeItems,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setAlertMessage(payload?.error || 'Unable to save scheme. Please try again.');
        return false;
      }

      setAlertMessage('Scheme saved successfully.');
      return true;
    } catch {
      setAlertMessage('Unable to save scheme. Please try again.');
      return false;
    }
  };

  const optionsByType = (slot: SlotKey) => {
    const aliases = SLOT_TYPE_ALIASES[slot];
    return items.filter((item) => aliases.includes(normalizePieceType(item.piece_type)));
  };

  const uploadHeroImage = async (file: File) => {
    setHeroImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as { image_url?: string; error?: string } | null;

      if (!response.ok || !payload?.image_url) {
        setAlertMessage(payload?.error || 'Unable to upload hero image.');
        return;
      }

      setHeroImageUrl(payload.image_url);
    } catch {
      setAlertMessage('Unable to upload hero image.');
    } finally {
      setHeroImageUploading(false);
    }
  };

  const isFormValid = useMemo(() => {
    return Boolean(title.trim()) && Boolean(style.trim()) && Boolean(occasion.trim()) && schemeItems.length > 0;
  }, [occasion, schemeItems.length, style, title]);

  const getPieceById = (wardrobeItemId: string | null) =>
    items.find((item) => item.wardrobe_item_id === wardrobeItemId);

  const resolveSlotSelectionLabel = (slot: SlotKey) => {
    const selectedValue = slots[slot];
    if (!selectedValue) return 'No piece selected';

    const suggestedOption = DEFAULT_SLOT_SUGGESTIONS[slot].find((suggestion) => suggestion.value === selectedValue);
    if (suggestedOption) return suggestedOption.label;

    const wardrobeOption = items.find((item) => item.wardrobe_item_id === selectedValue);
    return wardrobeOption?.name?.trim() || 'Selected piece';
  };

  const toReadablePieceName = (value: string) =>
    value
      .split(' ')
      .filter(Boolean)
      .map((chunk) => `${chunk[0]?.toUpperCase() ?? ''}${chunk.slice(1)}`)
      .join(' ')
      .trim();

  const resolveSlotPieceName = (slot: SlotKey, selectedId: string) => {
    const selectedItem = getPieceById(selectedId);
    if (selectedItem?.name?.trim()) {
      return toReadablePieceName(selectedItem.name.trim());
    }

    const suggestedOption = DEFAULT_SLOT_SUGGESTIONS[slot].find((suggestion) => suggestion.value === selectedId);
    if (suggestedOption?.label?.trim()) {
      return suggestedOption.label.trim();
    }

    if (selectedId.startsWith('suggested:')) {
      const [, , slug = ''] = selectedId.split(':');
      return toReadablePieceName(slug.replaceAll('-', ' ')) || `${slot[0].toUpperCase()}${slot.slice(1)} Piece`;
    }

    return `${slot[0].toUpperCase()}${slot.slice(1)} Piece`;
  };

  const buildOutfitPiece = (slot: SlotKey, selectedId: string): OutfitPiece => {
    const selectedItem = getPieceById(selectedId);
    const resolvedPieceType = selectedItem?.piece_type?.trim() || SLOT_DEFAULT_PIECE_TYPES[slot];
    const resolvedBrandName = selectedBrand?.name?.trim() || 'Selection Default Brand';
    const resolvedBrandLogoUrl = selectedBrand
      ? resolveBrandLogoUrlByName(selectedBrand.name) || selectedBrand.logo_url || undefined
      : undefined;

    return {
      id: `${slot}:${selectedId}`,
      name: resolveSlotPieceName(slot, selectedId),
      brand: resolvedBrandName,
      brandLogoUrl: resolvedBrandLogoUrl,
      pieceType: resolvedPieceType,
      category: SLOT_DEFAULT_CATEGORIES[slot],
      wearstyles: SLOT_AUTO_WEARSTYLE[slot],
    };
  };

  const buildSchemePieceSnapshots = (pieces: OutfitPiece[]): SchemePieceSnapshot[] =>
    pieces.map((piece) => {
      const [slot, ...sourceParts] = piece.id.split(':');
      const sourceId = sourceParts.join(':');
      const normalizedSlot = (slot as SlotKey) || 'upper';
      const sourceType = sourceId.startsWith('suggested:') ? 'suggested' : 'wardrobe';

      return {
        id: piece.id,
        slot: normalizedSlot,
        sourceType,
        sourceId,
        name: piece.name,
        brand: piece.brand,
        brandLogoUrl: piece.brandLogoUrl,
        category: piece.category ?? SLOT_DEFAULT_CATEGORIES[normalizedSlot],
        pieceType: piece.pieceType,
        wearstyles: piece.wearstyles ?? SLOT_AUTO_WEARSTYLE[normalizedSlot],
      };
    });

  const buildGeneratedOutfitCardData = () => {
    const pieces = (Object.entries(slots) as Array<[SlotKey, string | null]>)
      .filter((entry): entry is [SlotKey, string] => Boolean(entry[1]))
      .map(([slot, selectedId]) => buildOutfitPiece(slot, selectedId));
    const selectedBackground = buildOutfitBackgroundConfig();

    const outfitStyleLine = `${style || 'Streetwear'} • ${occasion || 'Daily'}`;
    return {
      outfitName: title.trim() || 'Untitled Outfit',
      outfitStyleLine,
      outfitDescription: buildOutfitDescriptionFallback({ pieces, outfitStyleLine }),
      heroImageUrl: heroImageUrl.trim() || '/welcome-newcomers.png',
      outfitBackground: selectedBackground,
      pieces,
    } satisfies OutfitCardData;
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
              onSubmit={async (e) => {
                e.preventDefault();
                if (!isFormValid) {
                  setAlertMessage('Fill title, style, occasion, and select at least one piece before generating the outfit card.');
                  return;
                }

                const nextGeneratedCardData = buildGeneratedOutfitCardData();
                const pieceSnapshots = buildSchemePieceSnapshots(nextGeneratedCardData.pieces);
                const isSaved = await saveScheme('manual', pieceSnapshots);
                if (!isSaved) return;
                console.log('[CreateMySchemeView] Submit snapshot', {
                  slots,
                  schemeItems,
                  'generatedCardData.pieces': nextGeneratedCardData.pieces,
                });
                setGeneratedCardData(nextGeneratedCardData);
              }}
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className={inputClassName}
              />

              <FancySelect
                value={style}
                onChange={setStyle}
                placeholder="Style"
                options={STYLE_OPTIONS.map((option) => ({
                  value: option,
                  label: option,
                  group: 'Style',
                }))}
              />

              <FancySelect
                value={occasion}
                onChange={setOccasion}
                placeholder="Occasion"
                options={OCCASION_OPTIONS.map((option) => ({
                  value: option,
                  label: option,
                  group: 'Occasion',
                }))}
              />

              <FancySelect
                value={visibility}
                onChange={(selectedVisibility) =>
                  setVisibility(selectedVisibility as 'private' | 'public')
                }
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'private', label: 'Private' },
                ]}
              />

              <FancySelect
                value={selectedBrandId}
                onChange={setSelectedBrandId}
                placeholder="SELECTION Default Brand"
                options={[
                  {
                    value: DEFAULT_BRAND_ID,
                    label: 'SELECTION Default Brand',
                    icon: { type: 'emoji', value: '🏷️', alt: 'Default brand' },
                  },
                  ...brands.map((brand) => {
                    const logoUrl = resolveBrandLogoUrlByName(brand.name) || brand.logo_url || null;
                    return {
                      value: brand.brand_id,
                      label: brand.name,
                      icon: logoUrl
                        ? { type: 'image' as const, value: logoUrl, alt: `${brand.name} logo` }
                        : { type: 'emoji' as const, value: '🏷️', alt: `${brand.name} brand` },
                    };
                  }),
                ]}
              />

              <FancySelect
                value={outfitBackgroundPreset}
                onChange={setOutfitBackgroundPreset}
                placeholder="Outfit card background"
                options={OUTFIT_BACKGROUND_PRESETS.map((option) => ({
                  value: option.value,
                  label: option.label,
                  group: 'Card Background',
                }))}
              />

              <FancySelect
                value={outfitBackgroundShape}
                onChange={(value) => setOutfitBackgroundShape(value as 'none' | 'orb' | 'diamond' | 'mesh')}
                placeholder="Background shape"
                options={OUTFIT_BACKGROUND_SHAPES.map((option) => ({
                  value: option.value,
                  label: option.label,
                  group: 'Shape',
                }))}
              />

              {outfitBackgroundPreset.startsWith('image|') ? (
                <input
                  value={aiBackgroundImageUrl}
                  onChange={(e) => setAiBackgroundImageUrl(e.target.value)}
                  placeholder="AI background image URL (optional)"
                  className={inputClassName}
                />
              ) : null}

              <label className={`${inputClassName} block cursor-pointer`}>
                <span className="block text-[11px] uppercase tracking-[0.12em] text-white/60">
                  Hero image upload
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs text-white file:mr-3 file:rounded-lg file:border-0 file:bg-white/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/30"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    uploadHeroImage(file);
                  }}
                />
                <span className="mt-1 block text-xs text-white/65">
                  {heroImageUploading
                    ? 'Uploading image...'
                    : heroImageUrl
                      ? 'Hero image uploaded successfully.'
                      : 'Upload a photo of the person wearing the outfit.'}
                </span>
              </label>

              {(['upper', 'lower', 'shoes', 'accessory'] as const).map((slot) => (
                <div key={slot} className={`${slotCardClassName} relative overflow-visible`}>
                  <p className="text-sm font-semibold capitalize text-white">
                    {slot} piece
                  </p>

                  <div className="mt-2">
                    <FancySelect
                      value={slots[slot] ?? ''}
                      onChange={(selectedValue) =>
                        setSlots((prev) => ({ ...prev, [slot]: selectedValue || null }))
                      }
                      placeholder="Select item"
                      options={[
                        { value: '', label: 'Select item' },
                        ...DEFAULT_SLOT_SUGGESTIONS[slot].map((suggestion) => ({
                          value: suggestion.value,
                          label: suggestion.label,
                          hint: 'Suggested',
                        })),
                        ...optionsByType(slot).map((item) => ({
                          value: item.wardrobe_item_id,
                          label: item.name,
                        })),
                      ]}
                    />
                  </div>

                  {slot === 'upper' || slot === 'lower' ? (
                    <div className="mt-3 rounded-lg border border-white/20 bg-white/5 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">
                        {slot === 'upper' ? 'Upper body piece' : 'Lower body piece'}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {resolveSlotSelectionLabel(slot)}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}

              <div className="mt-1 flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={heroImageUploading} className={primaryButtonClassName}>
                  Save Scheme
                </button>

                <button
                  type="button"
                  disabled={heroImageUploading}
                  onClick={() => {
                    const nextGeneratedCardData = buildGeneratedOutfitCardData();
                    const pieceSnapshots = buildSchemePieceSnapshots(nextGeneratedCardData.pieces);
                    saveScheme('ai', pieceSnapshots);
                  }}
                  className={secondaryButtonClassName}
                >
                  Generate with AI + Save
                </button>
              </div>
            </form>
          </SectionBlock>

          {generatedCardData ? (
            <SectionBlock
              title="Generated Outfit Card"
              subtitle="Rendered automatically after a successful form submit."
              className="sa-surface-header h-auto border-white/20"
            >
              <OutfitCard data={generatedCardData} />
            </SectionBlock>
          ) : null}
        </div>
      </div>

      {alertMessage ? (
        <SaiModalAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} />
      ) : null}
    </>
  );
}
