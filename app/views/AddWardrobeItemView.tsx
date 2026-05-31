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

const SEASON_LABEL_PT: Record<string, string> = {
  summer: 'Verão',
  winter: 'Inverno',
  spring: 'Primavera',
  autumn: 'Outono',
  'all-season': 'Todas as Estações',
};
const GENDER_LABEL_PT: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
  unisex: 'Unissex',
  masculino: 'Masculino',
  feminino: 'Feminino',
};

interface TryOnPrewarmContext {
  pieceId: string;
  garmentImageUrl: string;
  garmentCategory: 'tops' | 'bottoms' | 'full-body';
}

function resolveBrandLogoUrl(brand: Brand): string | null {
  if (brand.logo_url?.trim()) {
    return brand.logo_url;
  }

  const normalizedName = (brand.name ?? '').trim().toLowerCase();
  const compactName = normalizedName.replace(/[^a-z0-9&]/g, '');
  const normalizedId = (brand.brand_id ?? '').trim().toLowerCase().replace(/^brand_/, '');

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
  const lastAutoDetectedBrandRef = useRef<string>(DEFAULT_BRAND_ID);

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
        const name = normalizeToken(brand.name ?? '');
        const id = normalizeToken(brand.brand_id ?? '').replace(/^brand_/, '');
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

  useEffect(() => {
    const available = brandsRef.current;
    if (!available.length) return;
    const token = (form.name ?? '').trim().toLowerCase();
    const detected = available.find((brand) => {
      const name = (brand.name ?? '').trim().toLowerCase();
      return name.length >= 3 && token.includes(name);
    });
    const detectedId = detected?.brand_id ?? DEFAULT_BRAND_ID;
    setForm((prev) => {
      const canOverride =
        prev.brand_id === DEFAULT_BRAND_ID ||
        prev.brand_id === lastAutoDetectedBrandRef.current;
      if (!canOverride) return prev;
      lastAutoDetectedBrandRef.current = detectedId;
      if (prev.brand_id === detectedId) return prev;
      return { ...prev, brand_id: detectedId };
    });
  }, [form.name]);

  const marketLabel = useMemo(
    () =>
      new Map(
        markets.map((market) => {
          const season = SEASON_LABEL_PT[market.season?.toLowerCase()] ?? market.season;
          const gender = GENDER_LABEL_PT[market.gender?.toLowerCase()] ?? market.gender;
          return [market.market_id, `${season} • ${gender}`];
        }),
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
      console.debug('[add-piece] create success', { createdWardrobeItemId });

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

      const bodyRegionMap: Record<string, string> = {
        upper: 'upper_piece',
        lower: 'lower_piece',
        shoes: 'shoes_piece',
        accessory: 'accessory_piece',
      };
      const mappedPieceType = bodyRegionMap[data.bodyRegion] ?? form.piece_type;

      const mappedGender =
        data.gender === 'male' ? 'masculino' :
        data.gender === 'female' ? 'feminino' :
        form.gender;

      const resolvedColor = (() => {
        const primary = data.primaryColor || '';
        if (!primary || isGenericToken(primary)) return '';
        const direct = resolveOptionValue(primary, COLOR_OPTIONS);
        if (direct) return direct;
        for (const word of primary.split(/[\s-]+/).reverse()) {
          const wordMatch = resolveOptionValue(word, COLOR_OPTIONS);
          if (wordMatch) return wordMatch;
        }
        return '';
      })();

      const resolvedMaterial = (() => {
        const candidates: string[] = Array.isArray(data.materials) ? data.materials : [];
        for (const mat of candidates) {
          const match = resolveOptionValue(mat, MATERIAL_OPTIONS);
          if (match) return match;
        }
        return '';
      })();

      const resolvedStyleTag = (() => {
        const candidates: string[] = Array.isArray(data.styles) ? data.styles : [];
        for (const style of candidates) {
          const match = resolveOptionValue(style, STYLE_TAG_OPTIONS);
          if (match) return match;
        }
        return '';
      })();

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

      const resolvedBrandId = resolveBrandIdFromAI(data.brand, brandsRef.current, [
        data.pieceName || '',
        data.shortDescription || '',
        ...(Array.isArray(data.semanticTags) ? data.semanticTags : []),
      ]);

      const resolvedMarketId = resolveMarketIdFromAI(data.season, data.gender, markets);

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
        brand_id: resolvedBrandId,
        market_id: resolvedMarketId || prev.market_id,
      }));

      const detectedBrandLabel = brandWasDetected
        ? (brandsRef.current.find((b) => b.brand_id === resolvedBrandId)?.name ?? resolvedBrandId)
        : (data.brand && !isGenericToken(data.brand) ? `"${data.brand}" (não cadastrada)` : null);
      const brandNote = detectedBrandLabel ? ` Marca: ${detectedBrandLabel}.` : ' Marca definida como padrão.';
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          <form className="fai-form-grid" style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da peça"
              className="fai-input"
            />

            <label className="fai-file-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="fai-file-input"
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

            <div className="fai-info-box" style={{ gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                {selectedImageName
                  ? `Arquivo selecionado: ${selectedImageName}`
                  : 'Selecione um arquivo de imagem para continuar.'}
              </p>

              {imagePreview ? (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Image
                    src={imagePreview}
                    alt="Pré-visualização da peça selecionada"
                    width={512}
                    height={320}
                    style={{ height: '10rem', width: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border)', objectFit: 'cover' }}
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleAnalyzeWithAI}
                    disabled={isAnalyzing || uploadingImage}
                    className="fai-analyze-btn"
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
              className="fai-submit-btn"
              style={{ gridColumn: '1 / -1' }}
            >
              {uploadingImage ? 'Enviando imagem...' : submitting ? 'Salvando...' : 'Adicionar peça'}
            </button>

            {submitting ? (
              <div role="status" aria-live="polite" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ height: '0.5rem', width: '100%', overflow: 'hidden', borderRadius: '9999px', background: 'var(--muted)' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '9999px',
                      background: 'linear-gradient(90deg, #7c3aed, #db2777)',
                      transition: 'width 0.2s',
                      width: `${submitProgress}%`,
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Adicionando peça... {submitProgress}%</p>
              </div>
            ) : null}

            {uvJobId ? (
              <p style={{ gridColumn: '1 / -1', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
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
