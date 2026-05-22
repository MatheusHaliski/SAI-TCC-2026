'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import SaiModalAlert from '@/app/components/shared/SaiModalAlert';
import FancySelect from '@/app/components/ui/fancy-select';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import {
  buildBlenderWorkerSubmitPayload,
  pollBlenderWorkerJob,
  submitBlenderWorkerJob,
} from '@/app/services/blenderWorkerClient';
import { pushSystemInboxMessage } from '@/app/lib/systemInboxNotifications';

type Brand = { brand_id: string; name: string; logo_url?: string | null };
type Market = { market_id: string; season: string; gender: string };

const DEFAULT_BRAND_ID = 'default';
const BRAND_LOGO_FALLBACKS: Record<string, string> = {
  adidas: '/adidas.png',
  nike: '/nike.png',
  zara: '/zara.jpg',
  puma: '/puma.jpg',
  lacoste: '/lacoste.jpg',
  levis: '/levis.jpg',
  'c&a': '/cea.jpg',
  cea: '/cea.jpg',
};
const FALLBACK_BRANDS: Brand[] = [
  { brand_id: 'adidas', name: 'Adidas', logo_url: '/adidas.png' },
  { brand_id: 'nike', name: 'Nike', logo_url: '/nike.png' },
  { brand_id: 'zara', name: 'Zara', logo_url: '/zara.jpg' },
  { brand_id: 'puma', name: 'Puma', logo_url: '/puma.jpg' },
  { brand_id: 'lacoste', name: 'Lacoste', logo_url: '/lacoste.jpg' },
  { brand_id: 'levis', name: "Levi's", logo_url: '/levis.jpg' },
  { brand_id: 'cea', name: 'C&A', logo_url: '/cea.jpg' },
];
const COLOR_OPTIONS = [
  'Black', 'White', 'Gray', 'Charcoal', 'Silver',
  'Navy', 'Blue', 'Light Blue', 'Sky Blue', 'Cobalt',
  'Red', 'Burgundy', 'Crimson', 'Maroon',
  'Pink', 'Rose', 'Coral',
  'Green', 'Olive', 'Forest Green', 'Mint', 'Teal', 'Sage',
  'Yellow', 'Gold', 'Mustard', 'Amber',
  'Orange', 'Rust', 'Terracotta',
  'Brown', 'Camel', 'Tan', 'Beige', 'Cream', 'Ivory',
  'Purple', 'Lavender', 'Violet', 'Lilac', 'Plum',
  'Multicolor',
];

const MATERIAL_OPTIONS = [
  'Cotton', 'Polyester', 'Wool', 'Linen',
  'Denim', 'Leather', 'Suede', 'Velvet',
  'Silk', 'Satin', 'Nylon', 'Spandex',
  'Fleece', 'Knit', 'Jersey', 'Canvas',
  'Cashmere', 'Modal', 'Rayon', 'Tweed',
];

const STYLE_TAG_OPTIONS = [
  'Casual', 'Formal', 'Business', 'Smart Casual',
  'Urban', 'Streetwear', 'Sport', 'Athletic',
  'Luxury', 'Classic', 'Vintage', 'Minimal',
  'Bohemian', 'Preppy', 'Evening', 'Beach',
];
const OCCASION_TAG_OPTIONS = [
  'Casual', 'Formal', 'Work', 'Party',
  'Sport', 'Beach', 'Night Out', 'Date',
  'Business', 'Everyday', 'Travel', 'Wedding', 'Outdoors',
];
const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
];

interface TryOnPrewarmContext {
  pieceId: string;
  garmentImageUrl: string;
  garmentCategory: 'tops' | 'bottoms' | 'full-body';
}

function resolveBrandLogoUrl(brand: Brand): string | null {
  if (brand.logo_url?.trim()) {
    return brand.logo_url;
  }

  const normalizedName = brand.name.trim().toLowerCase();
  const compactName = normalizedName.replace(/[^a-z0-9&]/g, '');
  const normalizedId = brand.brand_id.trim().toLowerCase().replace(/^brand_/, '');

  return (
    BRAND_LOGO_FALLBACKS[normalizedName] ??
    BRAND_LOGO_FALLBACKS[compactName] ??
    BRAND_LOGO_FALLBACKS[normalizedId] ??
    null
  );
}

interface AddWardrobeItemViewProps {
  mode?: 'page' | 'modal';
  onPieceCreated?: () => void;
}

export default function AddWardrobeItemView({ mode = 'page', onPieceCreated }: AddWardrobeItemViewProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uvJobId, setUvJobId] = useState<string | null>(null);
  const [uvJobStatus, setUvJobStatus] = useState<string | null>(null);
  const [pendingTryOnPrewarm, setPendingTryOnPrewarm] = useState<TryOnPrewarmContext | null>(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const pending3dPieceNameRef = useRef<string>('');
  const brandsRef = useRef<Brand[]>([]);

  const normalizeToken = (value: string) => value.trim().toLowerCase();
  const isGenericToken = (value: string) => {
    const token = normalizeToken(value);
    return [
      '', 'selection', 'color', 'style', 'style tag', 'occasion', 'occasion tag',
      'material', 'brand', 'unknown', 'undefined', 'unknown piece', 'unnamed piece',
      'n/a', 'none', 'not applicable',
    ].includes(token);
  };
  const resolveOptionValue = (rawValue: string | undefined, options: string[]): string => {
    if (!rawValue || isGenericToken(rawValue)) return '';
    const token = normalizeToken(rawValue);
    const exact = options.find((option) => normalizeToken(option) === token);
    if (exact) return exact;
    const partial = options.find((option) => token.includes(normalizeToken(option)) || normalizeToken(option).includes(token));
    return partial || '';
  };
  const resolveMarketIdFromAI = (
    aiSeason: string | undefined,
    aiGender: string | undefined,
    availableMarkets: Market[],
  ): string => {
    if (!availableMarkets.length) return '';
    const season = (aiSeason || '').toLowerCase().replace('all-season', '');
    const genderKey = aiGender === 'male' ? ['masc', 'male', 'men', 'homem'] : aiGender === 'female' ? ['fem', 'female', 'wom', 'mulher'] : [];
    const scored = availableMarkets.map((market) => {
      const mSeason = (market.season || '').toLowerCase();
      const mGender = (market.gender || '').toLowerCase();
      let score = 0;
      if (season && season !== 'unknown' && (mSeason.includes(season) || season.includes(mSeason))) score += 2;
      if (genderKey.length && genderKey.some((k) => mGender.includes(k))) score += 2;
      return { market, score };
    });
    const best = scored.sort((a, b) => b.score - a.score)[0];
    return best && best.score > 0 ? best.market.market_id : '';
  };
  const resolveBrandIdFromAI = (
    rawBrand: string | undefined,
    availableBrands: Brand[],
    fallbackCandidates: string[] = [],
  ): string => {
    const candidates = [rawBrand || '', ...fallbackCandidates]
      .map((value) => value.trim())
      .filter((value) => value.length > 0 && !isGenericToken(value));

    for (const candidate of candidates) {
      const token = normalizeToken(candidate);
      const matched = availableBrands.find((brand) => {
        const name = normalizeToken(brand.name);
        const id = normalizeToken(brand.brand_id).replace(/^brand_/, '');
        return token === name || token === id || token.includes(name) || name.includes(token);
      });
      if (matched?.brand_id) return matched.brand_id;
    }

    return DEFAULT_BRAND_ID;
  };

  const [form, setForm] = useState({
    name: '',
    image_url: '',
    gender: 'masculino',
    piece_type: 'upper_piece',
    color: '',
    material: '',
    style_tags: '',
    occasion_tags: '',
    market_id: '',
    brand_id: DEFAULT_BRAND_ID,
  });

  const inputClassName =
    'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40';

  const fileInputClassName =
    'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-violet-600 file:to-fuchsia-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:brightness-110';

  const fileWrapperClassName =
    'flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md';

  const infoBoxClassName =
    'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md';

  const submitButtonClassName =
    'w-full rounded-xl border border-white/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60';

  useEffect(() => {
    const loadDependencies = async () => {
      const localProfile = getAuthSessionProfile();
      let resolvedUserId = localProfile.user_id?.trim() || '';
      if (!resolvedUserId) {
        const serverProfile = await getServerSession();
        resolvedUserId = serverProfile?.user_id?.trim() || '';
      }
      if (!resolvedUserId) {
        setAlertMessage('User session not found. Please sign in again.');
        return;
      }
      setUserId(resolvedUserId);

      const [brandsResponse, marketsResponse] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/markets'),
      ]);

      const brandsData = await brandsResponse.json().catch(() => []);
      const marketsData = await marketsResponse.json().catch(() => []);
      const apiBrands = Array.isArray(brandsData) ? (brandsData as Brand[]) : [];
      const mergedBrands = [
        ...FALLBACK_BRANDS.filter(
          (fallback) => !apiBrands.some((brand) => brand.brand_id === fallback.brand_id),
        ),
        ...apiBrands,
      ];

      setBrands(mergedBrands);
      brandsRef.current = mergedBrands;
      setMarkets(Array.isArray(marketsData) ? marketsData : []);
      setForm((prev) => ({
        ...prev,
        market_id:
          Array.isArray(marketsData) && marketsData[0]?.market_id
            ? marketsData[0].market_id
            : '',
      }));
    };

    loadDependencies().catch(() =>
      setAlertMessage('Unable to load form data. Please try again.'),
    );
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const marketLabel = useMemo(
    () =>
      new Map(
        markets.map((market) => [
          market.market_id,
          `${market.season} • ${market.gender}`,
        ]),
      ),
    [markets],
  );

  useEffect(() => {
    if (!submitting) {
      setSubmitProgress(0);
      return;
    }

    setSubmitProgress(12);
    const progressTimer = window.setInterval(() => {
      setSubmitProgress((current) => {
        if (current >= 90) return current;
        return Math.min(90, current + Math.ceil((100 - current) * 0.12));
      });
    }, 180);

    return () => window.clearInterval(progressTimer);
  }, [submitting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !form.market_id || !form.name.trim() || !form.image_url.trim()) {
      setAlertMessage('Please fill name, image file and market before saving.');
      return;
    }

    setSubmitting(true);
    try {
      let workerSubmitError: string | null = null;
      let localFitPreparationStatus: string | null = null;
      console.debug('[add-piece] create start', {
        name: form.name,
        piece_type: form.piece_type,
        gender: form.gender,
        hasImageUrl: Boolean(form.image_url),
      });
      const response = await fetch('/api/add-piece', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          ...form,
          brand_id: form.brand_id || DEFAULT_BRAND_ID,
          style_tags: form.style_tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          occasion_tags: form.occasion_tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setAlertMessage(payload?.error || 'Could not add the wardrobe piece.');
        return;
      }

      const createdPiece = (await response.json().catch(() => null)) as
        | { wardrobe_item_id?: string }
        | null;
      const createdWardrobeItemId = createdPiece?.wardrobe_item_id?.trim();
      console.debug('[add-piece] create success', {
        createdWardrobeItemId,
      });
      if (createdWardrobeItemId) {
        console.debug('[add-piece] process-piece call', { pieceId: createdWardrobeItemId });
        const processResponse = await fetch('/api/wardrobe/process-piece', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pieceId: createdWardrobeItemId }),
        });
        const processPayload = (await processResponse.json().catch(() => null)) as
          | { preparationStatus?: string; error?: string }
          | null;
        console.debug('[add-piece] process-piece response', {
          pieceId: createdWardrobeItemId,
          status: processResponse.status,
          body: processPayload,
        });
        if (!processResponse.ok) {
          setAlertMessage(`Piece created, but 2D processing failed (${processPayload?.error ?? 'unknown_error'}).`);
        }
        localFitPreparationStatus = processPayload?.preparationStatus ?? 'failed';
      }

      if (createdWardrobeItemId && form.piece_type === 'upper_piece') {
        pending3dPieceNameRef.current = form.name;
        setPendingTryOnPrewarm({
          pieceId: createdWardrobeItemId,
          garmentImageUrl: form.image_url,
          garmentCategory: 'tops',
        });
        try {
          const submitPayload = buildBlenderWorkerSubmitPayload({
            wardrobe_item_id: createdWardrobeItemId,
            name: form.name,
            piece_type: form.piece_type,
            image_url: form.image_url,
          });
          console.log('[3d-worker] submit:start', {
            pieceId: createdWardrobeItemId,
            pieceName: form.name,
            imageUrl: submitPayload.imageUrl,
            payload: submitPayload,
          });
          const submitResponse = await submitBlenderWorkerJob(submitPayload);
          const cloudJobId = String(submitResponse.jobId ?? submitResponse.job_id ?? submitResponse.id ?? '').trim();
          console.log('[3d-worker] submit:done', {
            pieceId: createdWardrobeItemId,
            pieceName: form.name,
            jobId: cloudJobId || null,
          });

          if (!cloudJobId) {
            setUvJobId(null);
            setUvJobStatus('failed_to_schedule');
            setAlertMessage('3D worker did not return a valid job id.');
          } else {
            setUvJobId(cloudJobId);
            setUvJobStatus(String(submitResponse.status ?? 'queued'));
          }
        } catch (workerError) {
          setUvJobId(null);
          setUvJobStatus('failed_to_schedule');
          workerSubmitError = workerError instanceof Error ? workerError.message : 'Could not submit 3D worker job.';
        }
      }

      setSubmitProgress(100);
      setAlertMessage(workerSubmitError ?? `Piece added to your wardrobe successfully. 2D prep status: ${localFitPreparationStatus ?? 'unknown'}.`);
      console.debug('[add-piece] ui refresh requested', { hasOnPieceCreated: Boolean(onPieceCreated) });
      onPieceCreated?.();
      setForm((prev) => ({
        ...prev,
        name: '',
        image_url: '',
        color: '',
        material: '',
        style_tags: '',
        occasion_tags: '',
      }));
      setSelectedImageName('');
      setImagePreview('');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!uvJobId) return;
    let cancelled = false;
    let attempts = 0;
    let consecutiveErrors = 0;
    const MAX_ATTEMPTS = 120;
    const MAX_CONSECUTIVE_ERRORS = 3;

    const timer = window.setInterval(async () => {
      if (cancelled) return;
      attempts += 1;
      if (attempts > MAX_ATTEMPTS) {
        window.clearInterval(timer);
        setUvJobStatus('failed');
        setAlertMessage('3D generation timed out. Please retry.');
        return;
      }
      try {
        const payload = await pollBlenderWorkerJob(uvJobId);
        if (cancelled) return;
        consecutiveErrors = 0;
        if (!payload?.status) return;
        const nextStatus = String(payload.status);
        console.log('[3d-worker] poll', { jobId: uvJobId, status: nextStatus });
        setUvJobStatus(nextStatus);
        if (nextStatus === 'completed' || nextStatus === 'failed' || nextStatus === 'cancelled') {
          window.clearInterval(timer);
        }
      } catch (pollError) {
        consecutiveErrors += 1;
        if (!cancelled && consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          setUvJobStatus('failed');
          setAlertMessage(pollError instanceof Error ? pollError.message : 'Could not poll 3D job status.');
          window.clearInterval(timer);
        }
      }
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [uvJobId]);

  useEffect(() => {
    if (uvJobStatus !== 'completed' || !pendingTryOnPrewarm) return;
    void fetch('/api/dress-tester/try-on-2d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        garmentId: pendingTryOnPrewarm.pieceId,
        garmentImageUrl: pendingTryOnPrewarm.garmentImageUrl,
        garmentCategory: pendingTryOnPrewarm.garmentCategory,
        mannequinImageUrl: '/tester2d/mannequins/female-default.png',
      }),
    });
    setPendingTryOnPrewarm(null);
  }, [uvJobStatus, pendingTryOnPrewarm]);

  useEffect(() => {
    if (uvJobStatus !== 'completed') return;
    const pieceName = pending3dPieceNameRef.current;
    if (!pieceName) return;
    pushSystemInboxMessage({
      title: '3D model ready',
      summary: `"${pieceName}" has been generated and is ready to view.`,
      level: 'success',
    });
    pending3dPieceNameRef.current = '';
  }, [uvJobStatus]);

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setForm((prev) => ({ ...prev, image_url: '' }));
      setSelectedImageName('');
      setImagePreview('');
      setSelectedFile(null);
      return;
    }

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      event.target.value = '';
      setAlertMessage('Please select a valid image file.');
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(nextPreview);
    setSelectedImageName(file.name);
    setSelectedFile(file);
    setUploadingImage(true);

    const payload = new FormData();
    payload.append('image', file);

    try {
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: payload,
      }).catch(() => null);

      if (!uploadResponse?.ok) {
        const uploadError = (await uploadResponse?.json().catch(() => null)) as
          | { error?: string }
          | null;
        setAlertMessage(uploadError?.error || 'Unable to upload selected image. Please try another file.');
        setForm((prev) => ({ ...prev, image_url: '' }));
        setSelectedImageName('');
        setImagePreview('');
        return;
      }

      const uploadBody = (await uploadResponse.json().catch(() => null)) as
        | { image_url?: string }
        | null;

      if (!uploadBody?.image_url) {
        setAlertMessage('Upload succeeded but image URL is missing. Please try again.');
        setForm((prev) => ({ ...prev, image_url: '' }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        image_url: uploadBody.image_url ?? '',
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!selectedFile && !form.image_url) {
      setAlertMessage('Please select an image first.');
      return;
    }
    setIsAnalyzing(true);
    try {
      let base64Image: string | undefined;
      let mimeType: string | undefined;

      if (selectedFile) {
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        mimeType = selectedFile.type;
      }

      const response = await fetch('/api/ai/fashion/analyze-piece', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, imageUrl: form.image_url, mimeType }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setAlertMessage(payload.message || 'Error analyzing image');
        return;
      }

      const data = payload.data;

      // piece_type: always derive from AI bodyRegion, fall back to current only if unknown
      const bodyRegionMap: Record<string, string> = {
        upper: 'upper_piece',
        lower: 'lower_piece',
        shoes: 'shoes_piece',
        accessory: 'accessory_piece',
      };
      const mappedPieceType = bodyRegionMap[data.bodyRegion] ?? form.piece_type;

      // gender
      const mappedGender =
        data.gender === 'male' ? 'masculino' :
        data.gender === 'female' ? 'feminino' :
        form.gender;

      // color: try each primaryColor word against expanded options
      const resolvedColor = (() => {
        const primary = data.primaryColor || '';
        if (!primary || isGenericToken(primary)) return '';
        const direct = resolveOptionValue(primary, COLOR_OPTIONS);
        if (direct) return direct;
        // Try each word in the color name (e.g. "Dark Navy Blue" → ["dark", "navy", "blue"])
        for (const word of primary.split(/[\s-]+/).reverse()) {
          const wordMatch = resolveOptionValue(word, COLOR_OPTIONS);
          if (wordMatch) return wordMatch;
        }
        return '';
      })();

      // material: try first few materials
      const resolvedMaterial = (() => {
        const candidates: string[] = Array.isArray(data.materials) ? data.materials : [];
        for (const mat of candidates) {
          const match = resolveOptionValue(mat, MATERIAL_OPTIONS);
          if (match) return match;
        }
        return '';
      })();

      // style_tags: try all returned styles against expanded options
      const resolvedStyleTag = (() => {
        const candidates: string[] = Array.isArray(data.styles) ? data.styles : [];
        for (const style of candidates) {
          const match = resolveOptionValue(style, STYLE_TAG_OPTIONS);
          if (match) return match;
        }
        return '';
      })();

      // occasion_tags: derive from styles + semanticTags (data.occasions does not exist in the type)
      const resolvedOccasion = (() => {
        const candidates: string[] = [
          ...(Array.isArray(data.styles) ? data.styles : []),
          ...(Array.isArray(data.semanticTags) ? data.semanticTags : []),
        ];
        for (const candidate of candidates) {
          const match = resolveOptionValue(candidate, OCCASION_TAG_OPTIONS);
          if (match) return match;
        }
        return '';
      })();

      // brand — use ref to guarantee latest brands list regardless of render timing
      const resolvedBrandId = resolveBrandIdFromAI(data.brand, brandsRef.current, [
        data.pieceName || '',
        data.shortDescription || '',
        ...(Array.isArray(data.semanticTags) ? data.semanticTags : []),
      ]);

      // market: match from AI season + gender
      const resolvedMarketId = resolveMarketIdFromAI(data.season, data.gender, markets);

      // name: reject generic AI fallback names
      const resolvedName = !isGenericToken(data.pieceName) ? data.pieceName : '';

      const brandWasDetected = resolvedBrandId !== DEFAULT_BRAND_ID;
      setForm((prev) => ({
        ...prev,
        name: resolvedName || prev.name || '',
        color: resolvedColor || prev.color || '',
        material: resolvedMaterial || prev.material || '',
        style_tags: resolvedStyleTag || prev.style_tags || '',
        occasion_tags: resolvedOccasion || prev.occasion_tags || '',
        gender: mappedGender,
        piece_type: mappedPieceType,
        brand_id: brandWasDetected ? resolvedBrandId : prev.brand_id,
        market_id: resolvedMarketId || prev.market_id,
      }));

      const detectedBrandLabel = brandWasDetected
        ? (brandsRef.current.find((b) => b.brand_id === resolvedBrandId)?.name ?? resolvedBrandId)
        : (data.brand && !isGenericToken(data.brand) ? `"${data.brand}" (não cadastrada)` : null);
      const brandNote = detectedBrandLabel ? ` Marca: ${detectedBrandLabel}.` : ' Marca não identificada.';
      setAlertMessage(`Análise concluída! Campos preenchidos automaticamente.${brandNote}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error during AI analysis.';
      setAlertMessage(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {mode === 'page' ? (
          <PageHeader
            title="Adicionar peça"
            subtitle="Adicione novas peças ao seu guarda-roupa. A marca pode ser mantida como padrão."
          />
        ) : null}

        <SectionBlock
          title="Formulário de peça de guarda-roupa"
          subtitle="Cadastre uma peça e classifique com tags e metadados."
        >
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da peça"
              className={inputClassName}
            />

            <label className={fileWrapperClassName}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className={fileInputClassName}
              />
            </label>

            <FancySelect
              value={form.gender}
              onChange={(gender) => setForm((prev) => ({ ...prev, gender }))}
              placeholder="Gênero"
              options={GENDER_OPTIONS.map((gender) => ({
                value: gender.value,
                label: gender.label,
                group: 'Gênero da peça',
              }))}
            />

            <FancySelect
              value={form.piece_type}
              onChange={(pieceType) => setForm((prev) => ({ ...prev, piece_type: pieceType }))}
              options={[
                { value: 'upper_piece', label: 'Parte de cima', icon: { type: 'emoji', value: '👕', alt: 'Camiseta' } },
                { value: 'lower_piece', label: 'Parte de baixo', icon: { type: 'emoji', value: '👖', alt: 'Calça' } },
                { value: 'shoes_piece', label: 'Calçados', icon: { type: 'emoji', value: '👟', alt: 'Calçados' } },
                { value: 'accessory_piece', label: 'Acessório', icon: { type: 'emoji', value: '🧢', alt: 'Acessório' } },
              ]}
            />

            <FancySelect
              value={form.market_id}
              onChange={(marketId) => setForm((prev) => ({ ...prev, market_id: marketId }))}
              placeholder="Selecionar mercado"
              options={markets.map((market) => ({
                value: market.market_id,
                label: marketLabel.get(market.market_id) ?? market.market_id,
              }))}
            />

            <FancySelect
              value={form.brand_id}
              onChange={(brandId) => setForm((prev) => ({ ...prev, brand_id: brandId }))}
              options={[
                { value: DEFAULT_BRAND_ID, label: 'Marca padrão', icon: { type: 'emoji', value: '🏷️', alt: 'Marca padrão' } },
                ...brands.map((brand) => {
                  const logoUrl = resolveBrandLogoUrl(brand);
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
              value={form.color}
              onChange={(color) => setForm((prev) => ({ ...prev, color }))}
              placeholder="Cor"
              options={COLOR_OPTIONS.map((color) => ({ value: color, label: color, group: 'Cor' }))}
            />

            <FancySelect
              value={form.material}
              onChange={(material) => setForm((prev) => ({ ...prev, material }))}
              placeholder="Material"
              options={MATERIAL_OPTIONS.map((material) => ({
                value: material,
                label: material,
                group: 'Material',
              }))}
            />

            <FancySelect
              value={form.style_tags}
              onChange={(styleTag) => setForm((prev) => ({ ...prev, style_tags: styleTag }))}
              placeholder="Tag de estilo"
              options={STYLE_TAG_OPTIONS.map((styleTag) => ({
                value: styleTag,
                label: styleTag,
                group: 'Tags de estilo',
              }))}
            />

            <FancySelect
              value={form.occasion_tags}
              onChange={(occasionTag) => setForm((prev) => ({ ...prev, occasion_tags: occasionTag }))}
              placeholder="Tag de ocasião"
              options={OCCASION_TAG_OPTIONS.map((occasionTag) => ({
                value: occasionTag,
                label: occasionTag,
                group: 'Tags de ocasião',
              }))}
            />

            <div className={`${infoBoxClassName} md:col-span-2`}>
              <p className="text-sm text-white/80">
                {selectedImageName
                  ? `Arquivo selecionado: ${selectedImageName}`
                  : 'Selecione um arquivo de imagem para continuar.'}
              </p>

              {imagePreview ? (
                <div className="mt-3 flex flex-col items-start gap-3">
                  <Image
                    src={imagePreview}
                    alt="Pré-visualização da peça selecionada"
                    width={512}
                    height={320}
                    className="h-40 w-auto rounded-xl border border-white/20 object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleAnalyzeWithAI}
                    disabled={isAnalyzing || uploadingImage}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:brightness-110 disabled:opacity-50"
                  >
                    <span>✨</span>
                    {isAnalyzing ? 'Analisando com Google IA...' : 'Analisar com Google IA'}
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className={`${submitButtonClassName} md:col-span-2`}
            >
              {uploadingImage ? 'Enviando imagem...' : submitting ? 'Salvando...' : 'Adicionar peça'}
            </button>

            {submitting ? (
              <div className="md:col-span-2 space-y-1" role="status" aria-live="polite">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-[width] duration-200"
                    style={{ width: `${submitProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white/80">Adicionando peça... {submitProgress}%</p>
              </div>
            ) : null}

            {uvJobId ? (
              <p className="md:col-span-2 text-xs text-white/80">
                Processo UV <span className="font-mono">{uvJobId}</span> status: {uvJobStatus ?? 'pendente'}
              </p>
            ) : null}
          </form>
        </SectionBlock>
      </div>

      {alertMessage ? (
        <SaiModalAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} />
      ) : null}
    </>
  );
}
