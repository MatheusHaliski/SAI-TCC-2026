'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import SaiModalAlert from '@/app/components/shared/SaiModalAlert';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';

type Brand = { brand_id: string; name: string };
type Market = { market_id: string; season: string; gender: string };

const DEFAULT_BRAND_ID = 'default';

export default function AddWardrobeItemView() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  const [form, setForm] = useState({
    name: '',
    image_url: '',
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

      const [brandsResponse, marketsResponse] = await Promise.all([fetch('/api/brands'), fetch('/api/markets')]);
      const brandsData = await brandsResponse.json().catch(() => []);
      const marketsData = await marketsResponse.json().catch(() => []);

      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setMarkets(Array.isArray(marketsData) ? marketsData : []);
      setForm((prev) => ({ ...prev, market_id: Array.isArray(marketsData) && marketsData[0]?.market_id ? marketsData[0].market_id : '' }));
    };

    loadDependencies().catch(() => setAlertMessage('Unable to load form data. Please try again.'));
  }, []);

  useEffect(() => () => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const marketLabel = useMemo(
    () => new Map(markets.map((market) => [market.market_id, `${market.season} • ${market.gender}`])),
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

      setSubmitProgress(100);
      setAlertMessage('Piece added to your wardrobe successfully.');
      setForm((prev) => ({ ...prev, name: '', image_url: '', color: '', material: '', style_tags: '', occasion_tags: '' }));
      setSelectedImageName('');
      setImagePreview('');
    } finally {
      setSubmitting(false);
    }
  };

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
        const uploadError = (await uploadResponse?.json().catch(() => null)) as { error?: string } | null;
        setAlertMessage(uploadError?.error || 'Unable to upload selected image. Please try another file.');
        setForm((prev) => ({ ...prev, image_url: '' }));
        setSelectedImageName('');
        setImagePreview('');
        return;
      }

      const uploadBody = (await uploadResponse.json().catch(() => null)) as { image_url?: string } | null;
      if (!uploadBody?.image_url) {
        setAlertMessage('Upload succeeded but image URL is missing. Please try again.');
        setForm((prev) => ({ ...prev, image_url: '' }));
        return;
      }

     setForm((prev) => ({
  ...prev,
  image_url: uploadBody.image_url ?? "",
}));
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Add Piece" subtitle="Add new items to your wardrobe. Brand can be left as default." />
        <SectionBlock title="Wardrobe Piece Form" subtitle="Register a piece and classify it with tags and metadata.">
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Piece name" className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black" />
            <label className="flex items-center rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black">
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="w-full text-sm text-black file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-1 file:text-white" />
            </label>

            <select value={form.piece_type} onChange={(e) => setForm((prev) => ({ ...prev, piece_type: e.target.value }))} className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black">
              <option value="upper_piece">Upper piece</option>
              <option value="lower_piece">Lower piece</option>
              <option value="shoes_piece">Shoes</option>
              <option value="accessory_piece">Accessory</option>
            </select>

            <select value={form.market_id} onChange={(e) => setForm((prev) => ({ ...prev, market_id: e.target.value }))} className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black">
              {markets.map((market) => (
                <option key={market.market_id} value={market.market_id}>{marketLabel.get(market.market_id)}</option>
              ))}
            </select>

            <select value={form.brand_id} onChange={(e) => setForm((prev) => ({ ...prev, brand_id: e.target.value }))} className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black">
              <option value={DEFAULT_BRAND_ID}>Default brand</option>
              {brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>{brand.name}</option>
              ))}
            </select>

            <input value={form.color} onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))} placeholder="Color" className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black" />
            <input value={form.material} onChange={(e) => setForm((prev) => ({ ...prev, material: e.target.value }))} placeholder="Material" className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black" />
            <input value={form.style_tags} onChange={(e) => setForm((prev) => ({ ...prev, style_tags: e.target.value }))} placeholder="Style tags (comma separated)" className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black" />
            <input value={form.occasion_tags} onChange={(e) => setForm((prev) => ({ ...prev, occasion_tags: e.target.value }))} placeholder="Occasion tags (comma separated)" className="rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-3 py-2 text-black" />

            <div className="md:col-span-2 rounded-xl border border-purple-200/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 p-3 text-sm text-black/80">
              {selectedImageName ? `Selected file: ${selectedImageName}` : 'Select an image file to continue.'}
              {imagePreview ? <Image src={imagePreview} alt="Selected clothing piece preview" width={512} height={320} className="mt-2 h-40 w-auto rounded-lg object-cover" unoptimized /> : null}
            </div>

            <button type="submit" disabled={submitting || uploadingImage} className="md:col-span-2 rounded-xl border border-white/30 bg-black px-4 py-2 text-sm font-semibold text-white">
              {uploadingImage ? 'Uploading image...' : submitting ? 'Saving...' : 'Add piece'}
            </button>

            {submitting ? (
              <div className="md:col-span-2 space-y-1" role="status" aria-live="polite">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-[width] duration-200" style={{ width: `${submitProgress}%` }} />
                </div>
                <p className="text-xs text-white/80">Adding piece... {submitProgress}%</p>
              </div>
            ) : null}
          </form>
        </SectionBlock>
      </div>
      {alertMessage ? <SaiModalAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} /> : null}
    </>
  );
}
