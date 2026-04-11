'use client';

import { useEffect, useMemo, useState } from 'react';
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

type Brand = { brand_id: string; name: string; logo_url?: string | null };
type Market = { market_id: string; season: string; gender: string };

const DEFAULT_BRAND_ID = 'default';
const FALLBACK_BRANDS: Brand[] = [
  {
    brand_id: 'lacoste',
    name: 'Lacoste',
    logo_url: '/lacoste.jpg',
  },
];
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
const COLOR_OPTIONS = [
  'Blue',
  'Red',
  'Green',
  'Yellow',
  'Black',
  'White',
  'Gray',
  'Brown',
  'Beige',
  'Purple',
];

const MATERIAL_OPTIONS = [
  'Leather',
  'Cotton',
  'Denim',
  'Wool',
  'Linen',
  'Polyester',
  'Silk',
  'Nylon',
];

const STYLE_TAG_OPTIONS = ['Urban', 'day', 'night', 'outdoors'];
const OCCASION_TAG_OPTIONS = ['Party', 'Formal', 'Casual', 'Work'];
const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
];

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
  const [selectedImageName, setSelectedImageName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

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
      if (createdWardrobeItemId && form.piece_type === 'upper_piece') {
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
      setAlertMessage(workerSubmitError ?? 'Piece added to your wardrobe successfully.');
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
    const timer = window.setInterval(async () => {
      try {
        const payload = await pollBlenderWorkerJob(uvJobId);
        if (!payload?.status || cancelled) return;
        const nextStatus = String(payload.status);
        console.log('[3d-worker] poll', {
          jobId: uvJobId,
          status: nextStatus,
        });
        setUvJobStatus(nextStatus);
        if (nextStatus === 'completed' || nextStatus === 'failed' || nextStatus === 'cancelled') {
          window.clearInterval(timer);
        }
      } catch (pollError) {
        if (!cancelled) {
          setUvJobStatus('failed');
          setAlertMessage(pollError instanceof Error ? pollError.message : 'Could not poll 3D job status.');
        }
        window.clearInterval(timer);
      }
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [uvJobId]);

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setForm((prev) => ({ ...prev, image_url: '' }));
      setSelectedImageName('');
      setImagePreview('');
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

  return (
    <>
      <div className="space-y-6">
        {mode === 'page' ? (
          <PageHeader
            title="Add Piece"
            subtitle="Add new items to your wardrobe. Brand can be left as default."
          />
        ) : null}

        <SectionBlock
          title="Wardrobe Piece Form"
          subtitle="Register a piece and classify it with tags and metadata."
        >
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Piece name"
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
                { value: 'upper_piece', label: 'Upper piece', icon: { type: 'emoji', value: '👕', alt: 'T-shirt' } },
                { value: 'lower_piece', label: 'Lower piece', icon: { type: 'emoji', value: '👖', alt: 'Pants' } },
                { value: 'shoes_piece', label: 'Shoes', icon: { type: 'emoji', value: '👟', alt: 'Shoes' } },
                { value: 'accessory_piece', label: 'Accessory', icon: { type: 'emoji', value: '🧢', alt: 'Accessory' } },
              ]}
            />

            <FancySelect
              value={form.market_id}
              onChange={(marketId) => setForm((prev) => ({ ...prev, market_id: marketId }))}
              placeholder="Select market"
              options={markets.map((market) => ({
                value: market.market_id,
                label: marketLabel.get(market.market_id) ?? market.market_id,
              }))}
            />

            <FancySelect
              value={form.brand_id}
              onChange={(brandId) => setForm((prev) => ({ ...prev, brand_id: brandId }))}
              options={[
                { value: DEFAULT_BRAND_ID, label: 'Default brand', icon: { type: 'emoji', value: '🏷️', alt: 'Default brand' } },
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
              placeholder="Color"
              options={COLOR_OPTIONS.map((color) => ({ value: color, label: color, group: 'Color' }))}
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
              placeholder="Style tag"
              options={STYLE_TAG_OPTIONS.map((styleTag) => ({
                value: styleTag,
                label: styleTag,
                group: 'Style Tags',
              }))}
            />

            <FancySelect
              value={form.occasion_tags}
              onChange={(occasionTag) => setForm((prev) => ({ ...prev, occasion_tags: occasionTag }))}
              placeholder="Occasion tag"
              options={OCCASION_TAG_OPTIONS.map((occasionTag) => ({
                value: occasionTag,
                label: occasionTag,
                group: 'Occasion Tags',
              }))}
            />

            <div className={`${infoBoxClassName} md:col-span-2`}>
              <p className="text-sm text-white/80">
                {selectedImageName
                  ? `Selected file: ${selectedImageName}`
                  : 'Select an image file to continue.'}
              </p>

              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Selected clothing piece preview"
                  width={512}
                  height={320}
                  className="mt-3 h-40 w-auto rounded-xl border border-white/20 object-cover"
                  unoptimized
                />
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className={`${submitButtonClassName} md:col-span-2`}
            >
              {uploadingImage ? 'Uploading image...' : submitting ? 'Saving...' : 'Add piece'}
            </button>

            {submitting ? (
              <div className="md:col-span-2 space-y-1" role="status" aria-live="polite">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-[width] duration-200"
                    style={{ width: `${submitProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white/80">Adding piece... {submitProgress}%</p>
              </div>
            ) : null}

            {uvJobId ? (
              <p className="md:col-span-2 text-xs text-white/80">
                UV job <span className="font-mono">{uvJobId}</span> status: {uvJobStatus ?? 'pending'}
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
