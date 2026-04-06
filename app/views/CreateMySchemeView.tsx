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
import DescriptionModeSelector from '@/app/components/create-scheme/DescriptionModeSelector';
import GenerationModePanel from '@/app/components/create-scheme/GenerationModePanel';
import SaveSummaryPanel from '@/app/components/create-scheme/SaveSummaryPanel';
import SchemeStepCard from '@/app/components/create-scheme/SchemeStepCard';
import SlotReviewCard from '@/app/components/create-scheme/SlotReviewCard';
import {
  OutfitCardData,
  OutfitPiece,
  buildOutfitDescriptionRich,
  resolveBrandLogoUrlByName,
} from '@/app/lib/outfit-card';

type Brand = { brand_id: string; name: string; logo_url?: string | null };
type SchemePieceSnapshot = {
  id: string;
  slot: SlotKey;
  sourceType: 'wardrobe' | 'suggested';
  sourceId: string;
  name: string;
  brand: string;
  brandLogoUrl?: string;
  pieceType: string;
  category: NonNullable<OutfitPiece['category']>;
  wearstyles: string[];
};

type SlotKey = 'upper' | 'lower' | 'shoes' | 'accessory';
type DescriptionMode = 'ai' | 'manual' | 'none';
type GenerationMode = 'manual' | 'ai';

type WardrobeItem = { wardrobe_item_id: string; name: string; piece_type: string };

const SLOT_TYPE_ALIASES: Record<SlotKey, string[]> = {
  upper: ['upper', 'upper piece', 'top', 'tops'],
  lower: ['lower', 'lower piece', 'bottom', 'bottoms'],
  shoes: ['shoes', 'shoes piece', 'shoe', 'footwear'],
  accessory: ['accessory', 'accessories'],
};

const normalizeSchemePieceType = (value: string) => value.trim().toLowerCase();

const DEFAULT_SLOT_SUGGESTIONS: Record<
  SlotKey,
  Array<{ value: string; label: string }>
> = {
  upper: [
    { value: 'suggested:upper:classic-white-tee', label: 'Classic White Tee' },
    { value: 'suggested:upper:slim-oxford-shirt', label: 'Slim Oxford Shirt' },
    { value: 'suggested:upper:oversized-hoodie', label: 'Oversized Hoodie' },
    { value: 'suggested:upper:bomber-jacket', label: 'Bomber Jacket' },
    { value: 'suggested:upper:tailored-blazer', label: 'Tailored Blazer' },
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

const sections = ['Scheme Data', 'Manual Builder', 'AI Generation', 'Slots Review', 'Save & Generate'];
const STYLE_OPTIONS = ['Urban', 'Casual', 'Formal', 'Outdoors'];
const OCCASION_OPTIONS = ['Shift', 'Work', 'Daily', 'Night', 'Party'];
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
const SLOT_DEFAULT_CATEGORIES: Record<SlotKey, NonNullable<OutfitPiece['category']>> = {
  upper: 'Premium',
  lower: 'Standard',
  shoes: 'Rare',
  accessory: 'Limited Edition',
};
const SLOT_ICONS: Record<SlotKey, string> = {
  upper: '🧥',
  lower: '👖',
  shoes: '👟',
  accessory: '👜',
};

const DEFAULT_BRAND_ID = 'default';
const FALLBACK_BRANDS: Brand[] = [
  {
    brand_id: 'lacoste',
    name: 'Lacoste',
    logo_url: '/lacoste.jpg',
  },
];

const OUTFIT_BACKGROUND_PRESETS: Array<{ value: string; label: string }> = [
  { value: 'gradient|linear-gradient(135deg,#0f172a,#4c1d95)', label: 'Deep Violet Gradient' },
  { value: 'solid|#111827', label: 'Midnight Solid' },
  { value: 'gradient|linear-gradient(140deg,#0b132b,#1c2541,#3a506b)', label: 'Aurora Navy' },
  { value: 'image|/models/model-default.jpeg', label: 'Default Photo Background' },
];
const OUTFIT_BACKGROUND_SHAPES: Array<{ value: 'none' | 'orb' | 'diamond' | 'mesh'; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'orb', label: 'Orb' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'mesh', label: 'Mesh' },
];

const formatDisplayName = (value?: string) =>
  String(value || '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((chunk) => `${chunk.charAt(0).toUpperCase()}${chunk.slice(1)}`)
    .join(' ');

export default function CreateMySchemeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Minimal');
  const [occasion, setOccasion] = useState('Daily');
  const [visibility, setVisibility] = useState<'private' | 'public'>('public');
  const [selectedBrandId, setSelectedBrandId] = useState(DEFAULT_BRAND_ID);
  const [slotBrandIds, setSlotBrandIds] = useState<Record<SlotKey, string>>({
    upper: DEFAULT_BRAND_ID,
    lower: DEFAULT_BRAND_ID,
    shoes: DEFAULT_BRAND_ID,
    accessory: DEFAULT_BRAND_ID,
  });
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [outfitBackgroundPreset, setOutfitBackgroundPreset] = useState(OUTFIT_BACKGROUND_PRESETS[0].value);
  const [outfitBackgroundShape, setOutfitBackgroundShape] = useState<'none' | 'orb' | 'diamond' | 'mesh'>('orb');
  const [aiBackgroundImageUrl, setAiBackgroundImageUrl] = useState('');
  const [descriptionMode, setDescriptionMode] = useState<DescriptionMode>('ai');
  const [manualDescription, setManualDescription] = useState('');
  const [palette, setPalette] = useState('Neutral');
  const [mood, setMood] = useState('Urban Premium');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('manual');
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [slots, setSlots] = useState<Record<SlotKey, string | null>>({
    upper: null,
    lower: null,
    shoes: null,
    accessory: null,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
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

      const parsedItems = Array.isArray(itemsData) ? itemsData : [];
      const apiBrands = Array.isArray(brandsData) ? (brandsData as Brand[]) : [];

      setItems(parsedItems);
      setBrands([
        ...apiBrands,
        ...FALLBACK_BRANDS.filter(
          (fallback) => !apiBrands.some((brand) => brand.brand_id === fallback.brand_id),
        ),
      ]);
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

  const resolvedBrands = useMemo(() => ({
    defaultBrand: selectedBrand,
    byId: new Map(brands.map((brand) => [brand.brand_id, brand])),
  }), [brands, selectedBrand]);

  const filledSlotsCount = useMemo(() => Object.values(slots).filter(Boolean).length, [slots]);

  const isFormValid = useMemo(
    () =>
      Boolean(title.trim()) &&
      Boolean(style.trim()) &&
      Boolean(occasion.trim()) &&
      Object.values(slots).some(Boolean),
    [title, style, occasion, slots],
  );

  const schemeItems = useMemo(
    () =>
      Object.entries(slots)
        .filter(([, id]) => Boolean(id))
        .map(([slot, id], idx) => ({
          wardrobe_item_id: String(id),
          slot,
          sort_order: idx + 1,
        })),
    [slots],
  );

  const resolveSlotSelectionLabel = (slot: SlotKey) => {
    const selectedValue = slots[slot];
    if (!selectedValue) return 'No piece selected';
    const suggested = DEFAULT_SLOT_SUGGESTIONS[slot].find((option) => option.value === selectedValue);
    if (suggested) return suggested.label;
    const selectedItem = items.find((item) => item.wardrobe_item_id === selectedValue);
    return selectedItem?.name || 'Custom selection';
  };

  const resolveBrandForSlot = (slot: SlotKey) => {
    const configuredBrandId = slotBrandIds[slot] || DEFAULT_BRAND_ID;
    if (configuredBrandId === DEFAULT_BRAND_ID) return resolvedBrands.defaultBrand;
    return resolvedBrands.byId.get(configuredBrandId) ?? resolvedBrands.defaultBrand;
  };

  const buildOutfitBackgroundConfig = () => {
    const [backgroundType, presetValue] = outfitBackgroundPreset.split('|', 2) as [
      'solid' | 'gradient' | 'image',
      string,
    ];

    const resolvedBackgroundValue =
      backgroundType === 'image' ? aiBackgroundImageUrl.trim() || presetValue : presetValue;

    return {
      type: backgroundType,
      value: resolvedBackgroundValue,
      shape: outfitBackgroundShape,
    } as const;
  };

  const buildGeneratedOutfitCardData = (): OutfitCardData => {
    const defaultBrandName = selectedBrand?.name || 'SELECTION';

    const pieces = (Object.keys(slots) as SlotKey[])
      .map((slot) => {
        const selectedValue = slots[slot];
        if (!selectedValue) return null;

        const inventoryItem = items.find((item) => item.wardrobe_item_id === selectedValue);
        const suggestedItem = DEFAULT_SLOT_SUGGESTIONS[slot].find((suggestion) => suggestion.value === selectedValue);
        const derivedName = inventoryItem?.name || suggestedItem?.label || `${formatDisplayName(slot)} Piece`;
        const pieceType = formatDisplayName(inventoryItem?.piece_type || SLOT_DEFAULT_PIECE_TYPES[slot]);
        const resolvedSlotBrand = resolveBrandForSlot(slot);
        const slotBrandName = resolvedSlotBrand?.name || defaultBrandName;

        return {
          id: selectedValue,
          name: derivedName,
          brand: slotBrandName,
          brandLogoUrl: resolveBrandLogoUrlByName(slotBrandName) || resolvedSlotBrand?.logo_url || undefined,
          pieceType,
          category: SLOT_DEFAULT_CATEGORIES[slot],
          wearstyles: SLOT_AUTO_WEARSTYLE[slot],
        } as OutfitPiece;
      })
      .filter(Boolean) as OutfitPiece[];

    const description =
      descriptionMode === 'manual'
        ? manualDescription.trim() || undefined
        : descriptionMode === 'none'
          ? ''
          : buildOutfitDescriptionRich({
              outfitName: title.trim() || 'My New Scheme',
              style,
              occasion,
              visibility,
              brand: selectedBrand?.name || 'Selection',
              palette,
              mood,
              pieces,
            });

    return {
      outfitName: title.trim() || 'My New Scheme',
      outfitStyleLine: `${style.trim() || 'Minimal'} · ${occasion.trim() || 'Daily'}`,
      outfitDescription: description,
      heroImageUrl: heroImageUrl.trim() || '/models/model-default.jpeg',
      outfitBackground: buildOutfitBackgroundConfig(),
      metaBadges: [
        { icon: '👕', label: style.trim() || 'Casual' },
        { icon: '📆', label: occasion.trim() || 'Daily' },
        { icon: visibility === 'public' ? '🌐' : '🔒', label: visibility === 'public' ? 'Public' : 'Private' },
        { icon: generationMode === 'manual' ? '✍️' : '✨', label: generationMode === 'manual' ? 'Manual' : 'AI' },
        palette.trim() ? { icon: '🎨', label: palette.trim() } : null,
      ].filter(Boolean) as NonNullable<OutfitCardData['metaBadges']>,
      pieces,
    };
  };

  const buildSchemePieceSnapshots = (pieces: OutfitPiece[]): SchemePieceSnapshot[] =>
    pieces.map((piece) => {
      const slot = (Object.keys(slots) as SlotKey[]).find((slotKey) => slots[slotKey] === piece.id) || 'upper';
      const sourceType = piece.id.startsWith('suggested:') ? 'suggested' : 'wardrobe';
      return {
        id: piece.id,
        slot,
        sourceType,
        sourceId: piece.id,
        name: piece.name,
        brand: piece.brand,
        brandLogoUrl: piece.brandLogoUrl,
        pieceType: piece.pieceType,
        category: piece.category || 'Standard',
        wearstyles: piece.wearstyles || [],
      };
    });

  const uploadHeroImage = (file: File) => {
    setHeroImageUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setHeroImageUrl(result);
      setHeroImageUploading(false);
    };
    reader.onerror = () => {
      setAlertMessage('Unable to process image. Please try another file.');
      setHeroImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const saveScheme = async (
    creationMode: GenerationMode,
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
          description: JSON.stringify({
            outfitBackground: selectedBackground,
            descriptionMode,
            descriptionText: descriptionMode === 'manual' ? manualDescription.trim() : null,
            mood,
            palette,
          }),
          style: style.trim() || 'Minimal',
          occasion: occasion.trim() || 'Daily',
          cover_image_url: heroImageUrl.trim() || null,
          visibility,
          creation_mode: creationMode,
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
    return items.filter((item) => aliases.includes(normalizeSchemePieceType(item.piece_type)));
  };

  const generateFromAiPrompt = () => {
    const normalizedPrompt = aiPrompt.toLowerCase();
    if (!normalizedPrompt.trim()) {
      setAlertMessage('Write a prompt before running AI generation.');
      return;
    }

    const matchingBrand = brands.find((brand) => normalizedPrompt.includes(brand.name.toLowerCase()));
    if (matchingBrand) {
      setSelectedBrandId(matchingBrand.brand_id);
    }

    const nextSlots: Record<SlotKey, string | null> = { upper: null, lower: null, shoes: null, accessory: null };

    (Object.keys(nextSlots) as SlotKey[]).forEach((slot) => {
      const wardrobeOptions = optionsByType(slot);
      const matched = wardrobeOptions.find((item) => normalizedPrompt.includes(item.name.toLowerCase()));
      nextSlots[slot] = matched?.wardrobe_item_id || wardrobeOptions[0]?.wardrobe_item_id || null;
    });

    setSlots(nextSlots);
    setGenerationMode('ai');

    if (!title.trim()) {
      setTitle(`AI ${style} ${occasion} Outfit`);
    }
  };

  const handleFinalSave = async () => {
    if (!isFormValid) {
      setAlertMessage('Fill title, style, occasion, and assign at least one slot before saving.');
      return;
    }

    const nextGeneratedCardData = buildGeneratedOutfitCardData();
    const pieceSnapshots = buildSchemePieceSnapshots(nextGeneratedCardData.pieces);
    const isSaved = await saveScheme(generationMode, pieceSnapshots);
    if (!isSaved) return;
    setGeneratedCardData(nextGeneratedCardData);
    setSelectedSection('Save & Generate');
  };

  const renderManualBuilder = () => (
    <SectionBlock
      title="Manual Builder"
      subtitle="Define metadata, description behavior, and slot assignment manually."
      className="sa-surface-header h-auto border-white/20"
    >
      <form className="mt-4 grid gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.14)] backdrop-blur-md md:grid-cols-2">
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
          onChange={(selectedVisibility) => setVisibility(selectedVisibility as 'private' | 'public')}
          options={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]}
        />

        <input value={palette} onChange={(e) => setPalette(e.target.value)} placeholder="Palette (e.g. Blue / Neutral)" className={inputClassName} />
        <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="Mood / aesthetic" className={inputClassName} />

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
          <span className="block text-[11px] uppercase tracking-[0.12em] text-white/60">Hero image upload</span>
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

        <DescriptionModeSelector value={descriptionMode} onChange={setDescriptionMode} />

        {descriptionMode === 'manual' ? (
          <textarea
            value={manualDescription}
            onChange={(e) => setManualDescription(e.target.value)}
            placeholder="Write the description for this outfit card..."
            className={`${inputClassName} min-h-24 md:col-span-2`}
          />
        ) : null}

        {(['upper', 'lower', 'shoes', 'accessory'] as const).map((slot) => (
          <div key={slot} className={`${slotCardClassName} relative overflow-visible`}>
            <p className="text-sm font-semibold capitalize text-white">{slot} piece</p>

            <div className="mt-2">
              <FancySelect
                value={slots[slot] ?? ''}
                onChange={(selectedValue) =>
                  setSlots((prev) => ({
                    ...prev,
                    [slot]: selectedValue || null,
                  }))
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

            <div className="mt-2">
              <FancySelect
                value={slotBrandIds[slot] ?? DEFAULT_BRAND_ID}
                onChange={(selectedSlotBrandId) =>
                  setSlotBrandIds((prev) => ({
                    ...prev,
                    [slot]: selectedSlotBrandId || DEFAULT_BRAND_ID,
                  }))
                }
                placeholder="Brand for this piece"
                options={[
                  {
                    value: DEFAULT_BRAND_ID,
                    label: 'Use default outfit brand',
                    hint: selectedBrand?.name || 'SELECTION',
                  },
                  ...brands.map((brand) => ({
                    value: brand.brand_id,
                    label: brand.name,
                  })),
                ]}
              />
            </div>

            <div className="mt-3 rounded-lg border border-white/20 bg-white/5 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">Selected</p>
              <p className="mt-1 text-sm font-semibold text-white">{resolveSlotSelectionLabel(slot)}</p>
            </div>
          </div>
        ))}
      </form>
    </SectionBlock>
  );

  const renderSchemeData = () => (
    <SectionBlock
      title="Scheme Data Overview"
      subtitle="Understand the full fashion-tech flow before creating your outfit card."
      className="sa-surface-header h-auto border-white/20"
    >
      <div className="mt-4 space-y-4">
        <GenerationModePanel mode={generationMode} onChange={setGenerationMode} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <SchemeStepCard step="Step 1" icon="🧬" title="Define outfit identity" description="Set title, style, occasion, visibility, palette, and mood for the card." />
          <SchemeStepCard step="Step 2" icon="🎛️" title="Choose generation method" description="Use Manual Builder for precise control or AI Generation for prompt-driven composition." />
          <SchemeStepCard step="Step 3" icon="📝" title="Provide metadata or prompt" description="Write manual data or a natural-language prompt tied to wardrobe inventory." />
          <SchemeStepCard step="Step 4" icon="🧩" title="Review slots" description="Validate upper, lower, shoes, and accessories in a tactical lineup screen." />
          <SchemeStepCard step="Step 5" icon="🚀" title="Save & generate" description="Run final checks and save the premium outfit card with consistent structure." />
        </div>
      </div>
    </SectionBlock>
  );

  const renderAiGeneration = () => (
    <SectionBlock
      title="AI Generation"
      subtitle="Prompt-based outfit composition using wardrobe pieces already in your database."
      className="sa-surface-header h-auto border-white/20"
    >
      <div className="mt-4 space-y-3">
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Create a premium casual daily outfit with a visual anchor in blue tones."
          className={`${inputClassName} min-h-28`}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={primaryButtonClassName}
            onClick={() => {
              generateFromAiPrompt();
              setSelectedSection('Slots Review');
            }}
          >
            Generate from Prompt
          </button>
          <button type="button" className={secondaryButtonClassName} onClick={() => setGenerationMode('ai')}>
            Set as AI Mode
          </button>
        </div>
      </div>
    </SectionBlock>
  );

  const renderSlotsReview = () => (
    <SectionBlock
      title="Slots Review"
      subtitle="Loadout-style review for each slot with completeness feedback."
      className="sa-surface-header h-auto border-white/20"
    >
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(Object.keys(slots) as SlotKey[]).map((slot) => (
          <SlotReviewCard
            key={slot}
            slot={slot}
            icon={SLOT_ICONS[slot]}
            selected={resolveSlotSelectionLabel(slot)}
            status={slots[slot] ? 'filled' : 'empty'}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-white/75">
        Composition status: <span className="font-semibold text-white">{filledSlotsCount} of 4 slots filled</span>.
      </p>
    </SectionBlock>
  );

  const renderSaveGenerate = () => (
    <SectionBlock
      title="Save & Generate"
      subtitle="Final preview, validation, and generation confirmation."
      className="sa-surface-header h-auto border-white/20"
    >
      <div className="mt-4 space-y-4">
        <SaveSummaryPanel
          mode={generationMode}
          descriptionMode={descriptionMode}
          filledSlots={filledSlotsCount}
          totalSlots={4}
        />
        {!isFormValid ? (
          <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-3 text-sm text-amber-100">
            Quality check warning: title, style, occasion, and at least one slot are required before saving.
          </div>
        ) : null}
        <button type="button" className={primaryButtonClassName} disabled={heroImageUploading} onClick={handleFinalSave}>
          {generationMode === 'manual' ? 'Save Outfit Card' : 'Generate Outfit Card'}
        </button>
      </div>
    </SectionBlock>
  );

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ContextSectionMenu
          title="Create My Scheme"
          sections={sections}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
        />

        <div className="space-y-6">
          <PageHeader
            title="Create My Scheme"
            subtitle="Premium manual and AI generation paths for outfit cards."
          />

          <GenerationModePanel mode={generationMode} onChange={setGenerationMode} />

          {selectedSection === 'Scheme Data' ? renderSchemeData() : null}
          {selectedSection === 'Manual Builder' ? renderManualBuilder() : null}
          {selectedSection === 'AI Generation' ? renderAiGeneration() : null}
          {selectedSection === 'Slots Review' ? renderSlotsReview() : null}
          {selectedSection === 'Save & Generate' ? renderSaveGenerate() : null}

          {generatedCardData ? (
            <SectionBlock
              title="Generated Outfit Card"
              subtitle="Rendered after the final save & generate action."
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
