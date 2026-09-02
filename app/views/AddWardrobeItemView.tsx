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

const SIZE_OPTIONS = [
  'PP', 'P', 'M', 'G', 'GG', 'XG', 'Único',
];

const STYLE_TAG_OPTIONS = [
  'Casual',
  'Formal',
  'Streetwear',
  'Sport',
  'Luxury',
  'Classic',
  'Vintage',
  'Minimal',
];
const OCCASION_TAG_OPTIONS = [
  'Trabalho',
  'Casual',
  'Festa',
  'Academia',
  'Evento',
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
const SEASON_LABEL_EN: Record<string, string> = {
  summer: 'Summer',
  winter: 'Winter',
  spring: 'Spring',
  autumn: 'Autumn',
  'all-season': 'All Seasons',
};
const GENDER_LABEL_PT: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
  unisex: 'Unissex',
  masculino: 'Masculino',
  feminino: 'Feminino',
};
const GENDER_LABEL_EN: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  unisex: 'Unisex',
  masculino: 'Male',
  feminino: 'Female',
};

// ── Select option label translations (PT) ───────────────────────────────────
// Values stored in the form stay in English (used for matching/persistence);
// only the visible label is localized based on the active site language.
const COLOR_LABELS_PT: Record<string, string> = {
  Black: 'Preto', White: 'Branco', Gray: 'Cinza', Charcoal: 'Grafite', Silver: 'Prata',
  Navy: 'Azul-marinho', Blue: 'Azul', 'Light Blue': 'Azul-claro', 'Sky Blue': 'Azul-céu', Cobalt: 'Cobalto',
  Red: 'Vermelho', Burgundy: 'Bordô', Crimson: 'Carmesim', Maroon: 'Vinho',
  Pink: 'Rosa', Rose: 'Rosé', Coral: 'Coral',
  Green: 'Verde', Olive: 'Verde-oliva', 'Forest Green': 'Verde-floresta', Mint: 'Verde-menta', Teal: 'Azul-petróleo', Sage: 'Verde-sálvia',
  Yellow: 'Amarelo', Gold: 'Dourado', Mustard: 'Mostarda', Amber: 'Âmbar',
  Orange: 'Laranja', Rust: 'Ferrugem', Terracotta: 'Terracota',
  Brown: 'Marrom', Camel: 'Camelo', Tan: 'Bege-escuro', Beige: 'Bege', Cream: 'Creme', Ivory: 'Marfim',
  Purple: 'Roxo', Lavender: 'Lavanda', Violet: 'Violeta', Lilac: 'Lilás', Plum: 'Ameixa',
  Multicolor: 'Multicolorido',
};
const SIZE_LABELS_PT: Record<string, string> = {
  PP: 'PP (Extra pequeno)', P: 'P (Pequeno)', M: 'M (Médio)',
  G: 'G (Grande)', GG: 'GG (Extra grande)', XG: 'XG (Extra extra grande)',
  'Único': 'Tamanho único',
};
const SIZE_LABELS_EN: Record<string, string> = {
  PP: 'XS (Extra small)', P: 'S (Small)', M: 'M (Medium)',
  G: 'L (Large)', GG: 'XL (Extra large)', XG: 'XXL (Double extra large)',
  'Único': 'One size',
};
const MATERIAL_LABELS_PT: Record<string, string> = {
  Cotton: 'Algodão', Polyester: 'Poliéster', Wool: 'Lã', Linen: 'Linho',
  Denim: 'Jeans', Leather: 'Couro', Suede: 'Camurça', Velvet: 'Veludo',
  Silk: 'Seda', Satin: 'Cetim', Nylon: 'Náilon', Spandex: 'Elastano',
  Fleece: 'Fleece', Knit: 'Tricô', Jersey: 'Malha', Canvas: 'Lona',
  Cashmere: 'Cashmere', Modal: 'Modal', Rayon: 'Viscose', Tweed: 'Tweed',
};
const STYLE_LABELS_PT: Record<string, string> = {
  Casual: 'Casual',
  Formal: 'Formal',
  Streetwear: 'Streetwear',
  Sport: 'Esportivo',
  Luxury: 'Luxo',
  Classic: 'Clássico',
  Vintage: 'Vintage',
  Minimal: 'Minimalista',
};
const OCCASION_LABELS_PT: Record<string, string> = {
  Trabalho: 'Trabalho',
  Casual: 'Casual',
  Festa: 'Festa',
  Academia: 'Academia',
  Evento: 'Evento',
};
const PIECE_TYPE_LABELS: Record<string, { pt: string; en: string }> = {
  upper_piece: { pt: 'Parte de cima', en: 'Top' },
  lower_piece: { pt: 'Parte de baixo', en: 'Bottom' },
  shoes_piece: { pt: 'Calçados', en: 'Shoes' },
  accessory_piece: { pt: 'Acessório', en: 'Accessory' },
};
const GENDER_OPTION_LABELS: Record<string, { pt: string; en: string }> = {
  masculino: { pt: 'Masculino', en: 'Male' },
  feminino: { pt: 'Feminino', en: 'Female' },
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
  const [aiDetectedBrandId, setAiDetectedBrandId] = useState<string | null>(null);
  const [isPt, setIsPt] = useState(true);
  const [aiDetectedFields, setAiDetectedFields] = useState<Record<string, boolean>>({});
  const pending3dPieceNameRef = useRef<string>('');
  const brandsRef = useRef<Brand[]>([]);
  const lastAutoDetectedBrandRef = useRef<string>(DEFAULT_BRAND_ID);

  const normalizeToken = (value: string) => value.trim().toLowerCase();
  const normalizeBrandToken = (value: string) =>
    normalizeToken(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/^brand[_\s-]*/, '')
      .replace(/[^a-z0-9&]/g, '');
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
      const token = normalizeBrandToken(candidate);
      const matched = availableBrands.find((brand) => {
        const name = normalizeBrandToken(brand.name ?? '');
        const id = normalizeBrandToken(brand.brand_id ?? '');
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
    size: '',
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
    if (typeof window === 'undefined') return;
    const syncLanguage = () => {
      setIsPt(window.localStorage.getItem('sai-site-language') !== 'en');
    };
    syncLanguage();
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'sai-site-language') syncLanguage();
    };
    window.addEventListener('sai-language-change', syncLanguage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('sai-language-change', syncLanguage);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const pick = (pt: string, en: string) => (isPt ? pt : en);
  const aiHint = pick('Preenchido pela análise do Google IA', 'Filled by Google AI analysis');
  const detectedSuffix = pick(' (detectado)', ' (detected)');
  const localizeOptionLabel = (value: string, ptMap: Record<string, string>) =>
    isPt ? ptMap[value] ?? value : value;
  const localizeColor = (value: string) => localizeOptionLabel(value, COLOR_LABELS_PT);
  const localizeMaterial = (value: string) => localizeOptionLabel(value, MATERIAL_LABELS_PT);
  const localizeSize = (value: string) => (isPt ? SIZE_LABELS_PT[value] ?? value : SIZE_LABELS_EN[value] ?? value);
  const localizeStyle = (value: string) => localizeOptionLabel(value, STYLE_LABELS_PT);
  const localizeOccasion = (value: string) => localizeOptionLabel(value, OCCASION_LABELS_PT);
  const localizePieceType = (value: string) =>
    PIECE_TYPE_LABELS[value] ? pick(PIECE_TYPE_LABELS[value].pt, PIECE_TYPE_LABELS[value].en) : value;
  const localizeGender = (value: string) =>
    GENDER_OPTION_LABELS[value] ? pick(GENDER_OPTION_LABELS[value].pt, GENDER_OPTION_LABELS[value].en) : value;

  const clearAiDetectedField = (field: string) =>
    setAiDetectedFields((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

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
          const seasonKey = market.season?.toLowerCase();
          const genderKey = market.gender?.toLowerCase();
          const season = (isPt ? SEASON_LABEL_PT[seasonKey] : SEASON_LABEL_EN[seasonKey]) ?? market.season;
          const gender = (isPt ? GENDER_LABEL_PT[genderKey] : GENDER_LABEL_EN[genderKey]) ?? market.gender;
          return [market.market_id, `${season} • ${gender}`];
        }),
      ),
    [markets, isPt],
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
        size: '',
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
      setAiDetectedBrandId(null);
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
    setAiDetectedBrandId(null);
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
      setAlertMessage(pick('Selecione uma imagem primeiro.', 'Please select an image first.'));
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
        setAlertMessage(payload.message || pick('Erro ao analisar a imagem', 'Error analyzing image'));
        return;
      }

      if (payload.fallbackUsed) {
        setAlertMessage(
          'Análise em modo demonstração: nenhuma chave de IA está configurada no servidor, então valores genéricos foram preenchidos. Para análise real com o Google (Gemini), defina GOOGLE_AI_API_KEY no ambiente.',
        );
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

      // Scan a prioritized list of candidate strings (whole value first, then
      // individual words) against the available option list. Broadening the
      // candidate sources lets every form field — not just the brand — resolve
      // on the first analysis click.
      const matchFromCandidates = (candidates: Array<string | undefined | null>, options: string[]): string => {
        const list = candidates.filter((c): c is string => typeof c === 'string' && !isGenericToken(c));
        for (const candidate of list) {
          const direct = resolveOptionValue(candidate, options);
          if (direct) return direct;
        }
        for (const candidate of list) {
          for (const word of candidate.split(/[\s,/&-]+/)) {
            const match = resolveOptionValue(word, options);
            if (match) return match;
          }
        }
        return '';
      };

      const secondaryColors: string[] = Array.isArray(data.secondaryColors) ? data.secondaryColors : [];
      const materials: string[] = Array.isArray(data.materials) ? data.materials : [];
      const styles: string[] = Array.isArray(data.styles) ? data.styles : [];
      const semanticTags: string[] = Array.isArray(data.semanticTags) ? data.semanticTags : [];

      const resolvedColor = matchFromCandidates([data.primaryColor, ...secondaryColors], COLOR_OPTIONS);
      const resolvedMaterial = matchFromCandidates([...materials, ...semanticTags], MATERIAL_OPTIONS);
      const resolvedStyleTag = matchFromCandidates([...styles, ...semanticTags, data.category], STYLE_TAG_OPTIONS);
      const resolvedOccasion = matchFromCandidates([...styles, ...semanticTags, data.category, data.shortDescription], OCCASION_TAG_OPTIONS);

      const resolvedBrandId = resolveBrandIdFromAI(data.brand, brandsRef.current, [
        data.pieceName || '',
        data.shortDescription || '',
        ...semanticTags,
      ]);

      const resolvedMarketId = resolveMarketIdFromAI(data.season, data.gender, markets);

      const resolvedName = !isGenericToken(data.pieceName) ? data.pieceName : '';

      const pieceTypeWasDetected = Boolean(bodyRegionMap[data.bodyRegion]);
      const genderWasDetected = data.gender === 'male' || data.gender === 'female';
      const brandWasDetected = resolvedBrandId !== DEFAULT_BRAND_ID;

      setAiDetectedBrandId(brandWasDetected ? resolvedBrandId : null);
      lastAutoDetectedBrandRef.current = brandWasDetected ? resolvedBrandId : DEFAULT_BRAND_ID;
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

      // Flag every field actually filled by the AI so each select shows a
      // "(detected)" hint the first time the user opens it.
      setAiDetectedFields({
        ...(resolvedName ? { name: true } : {}),
        ...(resolvedColor ? { color: true } : {}),
        ...(resolvedMaterial ? { material: true } : {}),
        ...(resolvedStyleTag ? { style_tags: true } : {}),
        ...(resolvedOccasion ? { occasion_tags: true } : {}),
        ...(genderWasDetected ? { gender: true } : {}),
        ...(pieceTypeWasDetected ? { piece_type: true } : {}),
        ...(resolvedMarketId ? { market_id: true } : {}),
        ...(brandWasDetected ? { brand_id: true } : {}),
      });

      // Build a complete, localized summary of every detected field so the user
      // sees on the first click exactly what was filled in — not just the brand.
      const detectedBrandName = brandWasDetected
        ? (brandsRef.current.find((b) => b.brand_id === resolvedBrandId)?.name ?? resolvedBrandId)
        : null;
      const detectedParts: string[] = [];
      if (resolvedName) detectedParts.push(`${pick('Nome', 'Name')}: ${resolvedName}`);
      if (pieceTypeWasDetected) detectedParts.push(`${pick('Tipo', 'Type')}: ${localizePieceType(mappedPieceType)}`);
      if (genderWasDetected) detectedParts.push(`${pick('Gênero', 'Gender')}: ${localizeGender(mappedGender)}`);
      if (resolvedColor) detectedParts.push(`${pick('Cor', 'Color')}: ${localizeColor(resolvedColor)}`);
      if (resolvedMaterial) detectedParts.push(`${pick('Material', 'Material')}: ${localizeMaterial(resolvedMaterial)}`);
      if (resolvedStyleTag) detectedParts.push(`${pick('Estilo', 'Style')}: ${localizeStyle(resolvedStyleTag)}`);
      if (resolvedOccasion) detectedParts.push(`${pick('Ocasião', 'Occasion')}: ${localizeOccasion(resolvedOccasion)}`);
      if (resolvedMarketId) detectedParts.push(`${pick('Mercado', 'Market')}: ${marketLabel.get(resolvedMarketId) ?? resolvedMarketId}`);
      if (detectedBrandName) {
        detectedParts.push(`${pick('Marca', 'Brand')}: ${detectedBrandName}`);
      } else if (data.brand && !isGenericToken(data.brand)) {
        detectedParts.push(`${pick('Marca', 'Brand')}: "${data.brand}" (${pick('não cadastrada', 'not registered')})`);
      }

      const summaryMessage = detectedParts.length
        ? `${pick('Análise concluída! Campos detectados', 'Analysis complete! Detected fields')}: ${detectedParts.join(' • ')}.`
        : pick(
            'Análise concluída, mas nenhum campo pôde ser preenchido automaticamente.',
            'Analysis complete, but no field could be filled automatically.',
          );
      setAlertMessage(summaryMessage);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : pick('Erro durante a análise por IA.', 'Error during AI analysis.');
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
            title={pick('Adicionar peça', 'Add piece')}
            subtitle={pick(
              'Adicione novas peças ao seu guarda-roupa. A marca pode ser mantida como padrão.',
              'Add new pieces to your wardrobe. The brand can be kept as default.',
            )}
          />
        ) : null}

        <SectionBlock
          title={pick('Formulário de peça de guarda-roupa', 'Wardrobe piece form')}
          subtitle={pick('Cadastre uma peça e classifique com tags e metadados.', 'Register a piece and classify it with tags and metadata.')}
        >
          <form className="fai-form-grid" style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
            <input
              value={form.name}
              onChange={(e) => {
                clearAiDetectedField('name');
                setForm((prev) => ({ ...prev, name: e.target.value }));
              }}
              placeholder={pick('Nome da peça', 'Piece name')}
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
              onChange={(gender) => {
                clearAiDetectedField('gender');
                setForm((prev) => ({ ...prev, gender }));
              }}
              placeholder={pick('Gênero', 'Gender')}
              options={GENDER_OPTIONS.map((gender) => {
                const detected = Boolean(aiDetectedFields.gender) && form.gender === gender.value;
                return {
                  value: gender.value,
                  label: localizeGender(gender.value) + (detected ? detectedSuffix : ''),
                  hint: detected ? aiHint : undefined,
                  group: pick('Gênero da peça', 'Garment gender'),
                };
              })}
            />

            <FancySelect
              value={form.piece_type}
              onChange={(pieceType) => {
                clearAiDetectedField('piece_type');
                setForm((prev) => ({ ...prev, piece_type: pieceType }));
              }}
              options={[
                { value: 'upper_piece', icon: { type: 'emoji' as const, value: '👕', alt: pick('Camiseta', 'T-shirt') } },
                { value: 'lower_piece', icon: { type: 'emoji' as const, value: '👖', alt: pick('Calça', 'Trousers') } },
                { value: 'shoes_piece', icon: { type: 'emoji' as const, value: '👟', alt: pick('Calçados', 'Shoes') } },
                { value: 'accessory_piece', icon: { type: 'emoji' as const, value: '🧢', alt: pick('Acessório', 'Accessory') } },
              ].map((option) => {
                const detected = Boolean(aiDetectedFields.piece_type) && form.piece_type === option.value;
                return {
                  value: option.value,
                  label: localizePieceType(option.value) + (detected ? detectedSuffix : ''),
                  hint: detected ? aiHint : undefined,
                  icon: option.icon,
                };
              })}
            />

            <FancySelect
              value={form.market_id}
              onChange={(marketId) => {
                clearAiDetectedField('market_id');
                setForm((prev) => ({ ...prev, market_id: marketId }));
              }}
              placeholder={pick('Selecionar mercado', 'Select market')}
              options={markets.map((market) => {
                const detected = Boolean(aiDetectedFields.market_id) && form.market_id === market.market_id;
                const base = marketLabel.get(market.market_id) ?? market.market_id;
                return {
                  value: market.market_id,
                  label: base + (detected ? detectedSuffix : ''),
                  hint: detected ? aiHint : undefined,
                };
              })}
            />

            <FancySelect
              value={form.brand_id}
              onChange={(brandId) => {
                setAiDetectedBrandId(null);
                clearAiDetectedField('brand_id');
                setForm((prev) => ({ ...prev, brand_id: brandId }));
              }}
              placeholder={pick('Marca', 'Brand')}
              options={[
                { value: DEFAULT_BRAND_ID, label: pick('Marca padrão', 'Default brand'), icon: { type: 'emoji' as const, value: '🏷️', alt: pick('Marca padrão', 'Default brand') } },
                ...brands.map((brand) => {
                  const logoUrl = resolveBrandLogoUrl(brand);
                  const wasDetectedByAi = aiDetectedBrandId === brand.brand_id && form.brand_id === brand.brand_id;
                  return {
                    value: brand.brand_id,
                    label: wasDetectedByAi ? `${brand.name}${detectedSuffix}` : brand.name,
                    hint: wasDetectedByAi ? aiHint : undefined,
                    icon: logoUrl
                      ? { type: 'image' as const, value: logoUrl, alt: `${brand.name} logo` }
                      : { type: 'emoji' as const, value: '🏷️', alt: `${brand.name} brand` },
                  };
                }),
              ]}
            />

            <FancySelect
              value={form.color}
              onChange={(color) => {
                clearAiDetectedField('color');
                setForm((prev) => ({ ...prev, color }));
              }}
              placeholder={pick('Cor', 'Color')}
              options={COLOR_OPTIONS.map((color) => {
                const detected = Boolean(aiDetectedFields.color) && form.color === color;
                return {
                  value: color,
                  label: localizeColor(color) + (detected ? detectedSuffix : ''),
                  hint: detected ? aiHint : undefined,
                  group: pick('Cor', 'Color'),
                };
              })}
            />

            <FancySelect
              value={form.material}
              onChange={(material) => {
                clearAiDetectedField('material');
                setForm((prev) => ({ ...prev, material }));
              }}
              placeholder={pick('Material', 'Material')}
              options={MATERIAL_OPTIONS.map((material) => {
                const detected = Boolean(aiDetectedFields.material) && form.material === material;
                return {
                  value: material,
                  label: localizeMaterial(material) + (detected ? detectedSuffix : ''),
                  hint: detected ? aiHint : undefined,
                  group: pick('Material', 'Material'),
                };
              })}
            />

            <FancySelect
              value={form.size}
              onChange={(size) => setForm((prev) => ({ ...prev, size }))}
              placeholder={pick('Tamanho', 'Size')}
              options={SIZE_OPTIONS.map((size) => ({
                value: size,
                label: localizeSize(size),
                group: pick('Tamanho', 'Size'),
              }))}
            />

            <FancySelect
              value={form.style_tags}
              onChange={(styleTag) => {
                clearAiDetectedField('style_tags');
                setForm((prev) => ({ ...prev, style_tags: styleTag }));
              }}
              placeholder={pick('Tag de estilo', 'Style tag')}
              options={STYLE_TAG_OPTIONS.map((styleTag) => {
                const detected = Boolean(aiDetectedFields.style_tags) && form.style_tags === styleTag;
                return {
                  value: styleTag,
                  label: localizeStyle(styleTag) + (detected ? detectedSuffix : ''),
                  hint: detected ? aiHint : undefined,
                  group: pick('Tags de estilo', 'Style tags'),
                };
              })}
            />

            <FancySelect
              value={form.occasion_tags}
              onChange={(occasionTag) => {
                clearAiDetectedField('occasion_tags');
                setForm((prev) => ({ ...prev, occasion_tags: occasionTag }));
              }}
              placeholder={pick('Tag de ocasião', 'Occasion tag')}
              options={OCCASION_TAG_OPTIONS.map((occasionTag) => {
                const detected = Boolean(aiDetectedFields.occasion_tags) && form.occasion_tags === occasionTag;
                return {
                  value: occasionTag,
                  label: localizeOccasion(occasionTag) + (detected ? detectedSuffix : ''),
                  hint: detected ? aiHint : undefined,
                  group: pick('Tags de ocasião', 'Occasion tags'),
                };
              })}
            />

            <div className="fai-info-box" style={{ gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                {selectedImageName
                  ? `${pick('Arquivo selecionado', 'Selected file')}: ${selectedImageName}`
                  : pick('Selecione um arquivo de imagem para continuar.', 'Select an image file to continue.')}
              </p>

              {imagePreview ? (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Image
                    src={imagePreview}
                    alt={pick('Pré-visualização da peça selecionada', 'Selected piece preview')}
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
                    {isAnalyzing
                      ? pick('Analisando com Google IA...', 'Analyzing with Google AI...')
                      : pick('Analisar com Google IA', 'Analyze with Google AI')}
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
              {uploadingImage
                ? pick('Enviando imagem...', 'Uploading image...')
                : submitting
                  ? pick('Salvando...', 'Saving...')
                  : pick('Adicionar peça', 'Add piece')}
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
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{pick('Adicionando peça...', 'Adding piece...')} {submitProgress}%</p>
              </div>
            ) : null}

            {uvJobId ? (
              <p style={{ gridColumn: '1 / -1', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                {pick('Processo UV', 'UV process')} <span className="font-mono">{uvJobId}</span> status: {uvJobStatus ?? pick('pendente', 'pending')}
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