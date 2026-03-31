'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

interface WardrobeItem {
  wardrobe_item_id: string;
  name: string;
  image_url: string;
  model_3d_url?: string | null;
  model_preview_url?: string | null;
  model_base_3d_url?: string | null;
  model_branded_3d_url?: string | null;
  isolated_piece_image_url?: string | null;
  segmentation_confidence?: number | null;
  geometry_scope_passed?: boolean | null;
  geometry_scope_score?: number | null;
  generation_attempt_count?: number;
  model_status?:
    | 'queued_segmentation'
    | 'segmentation_done'
    | 'queued_base'
    | 'base_done'
    | 'queued_branding'
    | 'queued_geometry_qa'
    | 'retrying_generation'
    | 'done'
    | 'failed_geometry_scope'
    | 'failed'
    | 'needs_brand_review';
  model_generation_error?: string | null;
  brand: string;
  season: string;
  gender: string;
  piece_type: string;
}

const sections = ['Available', 'Unavailable', 'Favorites'];

export default function MyWardrobeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [resolvedUserId, setResolvedUserId] = useState('');
  const [availability, setAvailability] = useState<Record<string, 'available' | 'unavailable'>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [viewerModelIndex, setViewerModelIndex] = useState(0);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [statusTick, setStatusTick] = useState(0);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const loadWardrobeData = async () => {
      const localProfile = getAuthSessionProfile();
      let resolvedUserId = localProfile.user_id?.trim() || '';

      if (!resolvedUserId) {
        const serverProfile = await getServerSession();
        resolvedUserId = serverProfile?.user_id?.trim() || '';
      }

      if (!resolvedUserId) {
        setItems([]);
        return;
      }

      setResolvedUserId(resolvedUserId);
      const wardrobeResponse = await fetch(`/api/wardrobe-items/user/${resolvedUserId}`);
      const wardrobeItems = await wardrobeResponse.json().catch(() => []);
      setItems(wardrobeResponse.ok && Array.isArray(wardrobeItems) ? wardrobeItems : []);
    };

    loadWardrobeData().catch(() => setItems([]));
  }, []);

  const grouped = useMemo(() => {
    const available = items.filter((item) => (availability[item.wardrobe_item_id] ?? 'available') === 'available');
    const unavailable = items.filter((item) => (availability[item.wardrobe_item_id] ?? 'available') === 'unavailable');
    const favorite = items.filter((item) => favorites[item.wardrobe_item_id]);
    return { available, unavailable, favorite };
  }, [availability, favorites, items]);

  const viewerCandidateUrls = useMemo(() => {
    if (!selectedItem) return [];

    const candidates = [
      selectedItem.model_branded_3d_url?.trim(),
      selectedItem.model_3d_url?.trim(),
      selectedItem.model_base_3d_url?.trim(),
    ]
      .filter((value): value is string => Boolean(value))
      .map((url) => (url.startsWith('http://') ? url.replace('http://', 'https://') : url));

    return [...new Set(candidates)];
  }, [selectedItem]);

  const safeModelUrl = viewerCandidateUrls[viewerModelIndex] ?? null;

  const viewerModelUrl = useMemo(() => {
    if (!safeModelUrl) return null;
    return safeModelUrl.includes('assets.meshy.ai')
      ? `/api/model-proxy?url=${encodeURIComponent(safeModelUrl)}`
      : safeModelUrl;
  }, [safeModelUrl]);

  const viewerPosterUrl = useMemo(() => {
    const rawPosterUrl = selectedItem?.model_preview_url?.trim();
    if (!rawPosterUrl) return undefined;
    const safePosterUrl = rawPosterUrl.startsWith('http://') ? rawPosterUrl.replace('http://', 'https://') : rawPosterUrl;
    return safePosterUrl.includes('assets.meshy.ai')
      ? `/api/model-proxy?url=${encodeURIComponent(safePosterUrl)}`
      : safePosterUrl;
  }, [selectedItem]);

  const selectedItemStatusMessage = useMemo(() => {
    if (!selectedItem) return '';
    const dots = '.'.repeat((statusTick % 3) + 1);

    switch (selectedItem.model_status) {
      case 'queued_segmentation':
        return `Isolating piece from source image${dots}`;
      case 'segmentation_done':
        return `Piece isolated. Preparing base model generation${dots}`;
      case 'queued_base':
      case 'base_done':
      case 'queued_branding':
        return `Generating 3D mesh asset${dots}`;
      case 'queued_geometry_qa':
        return `Running geometry scope QA checks${dots}`;
      case 'retrying_generation':
        return `Retrying 3D generation with stricter garment constraints${dots}`;
      case 'needs_brand_review':
        return selectedItem.model_generation_error || `Needs brand review before new branded model can be generated${dots}`;
      case 'failed_geometry_scope':
        return selectedItem.model_generation_error || 'Generated mesh failed scope QA.';
      case 'failed':
        return selectedItem.model_generation_error || '3D generation failed.';
      default:
        return viewerLoading ? `Loading model in viewer${dots}` : '';
    }
  }, [selectedItem, statusTick, viewerLoading]);

  useEffect(() => {
    if (!selectedItem) return;

    const timer = window.setInterval(() => {
      setStatusTick((value) => value + 1);
    }, 650);

    return () => window.clearInterval(timer);
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem || !resolvedUserId) return;
    const realtimeStatuses = new Set([
      'queued_segmentation',
      'segmentation_done',
      'queued_base',
      'base_done',
      'queued_branding',
      'queued_geometry_qa',
      'retrying_generation',
      'needs_brand_review',
    ]);
    if (!realtimeStatuses.has(selectedItem.model_status ?? '')) return;

    const poll = window.setInterval(async () => {
      const response = await fetch(`/api/wardrobe-items/user/${resolvedUserId}`).catch(() => null);
      if (!response?.ok) return;
      const data = (await response.json().catch(() => [])) as WardrobeItem[];
      if (!Array.isArray(data)) return;
      setItems(data);
      const refreshed = data.find((item) => item.wardrobe_item_id === selectedItem.wardrobe_item_id);
      if (refreshed) {
        setSelectedItem(refreshed);
      }
    }, 4500);

    return () => window.clearInterval(poll);
  }, [selectedItem, resolvedUserId]);

  useEffect(() => {
    if (!viewerModelUrl || !modelViewerRef.current) return;

    const viewerElement = modelViewerRef.current;
    const handleLoad = () => {
      setViewerLoading(false);
      setViewerError(null);
      setViewerLoaded(true);
      const viewerWithCamera = viewerElement as HTMLElement & { jumpCameraToGoal?: () => void };
      viewerWithCamera.jumpCameraToGoal?.();
    };
    const handleError = () => {
      if (viewerLoaded) return;
      if (viewerModelIndex < viewerCandidateUrls.length - 1) {
        setViewerModelIndex((index) => index + 1);
        setViewerLoading(true);
        setViewerError('Primary 3D asset failed. Trying fallback model...');
        return;
      }
      setViewerLoading(false);
      setViewerError('Could not load this 3D model in the embedded viewer.');
    };

    viewerElement.addEventListener('load', handleLoad as EventListener);
    viewerElement.addEventListener('error', handleError as EventListener);

    return () => {
      viewerElement.removeEventListener('load', handleLoad as EventListener);
      viewerElement.removeEventListener('error', handleError as EventListener);
    };
  }, [viewerModelUrl, selectedItem?.wardrobe_item_id, viewerLoaded, viewerModelIndex, viewerCandidateUrls.length]);

  return (
    <>
      <Script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ContextSectionMenu title="Virtual Wardrobe" sections={sections} />
        <div className="space-y-6">
          <PageHeader title="Virtual Wardrobe" subtitle="Classify pieces as available, unavailable, and favorites." />

          {([
            { key: 'available', title: 'Available Pieces', data: grouped.available },
            { key: 'unavailable', title: 'Unavailable Pieces', data: grouped.unavailable },
            { key: 'favorite', title: 'Favorite Pieces', data: grouped.favorite },
          ] as const).map((group) => (
            <SectionBlock key={group.key} title={group.title} subtitle="Manage list status for each wardrobe item.">
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.data.map((item) => (
                  <article
                    key={item.wardrobe_item_id}
                    onClick={() => {
                      setSelectedItem(item);
                      setViewerModelIndex(0);
                      setViewerLoading(Boolean(item.model_3d_url || item.model_base_3d_url || item.model_branded_3d_url));
                      setViewerError(null);
                      setViewerLoaded(false);
                    }}
                    className="cursor-pointer rounded-2xl border border-white/25 p-4 transition hover:border-cyan-300/60"
                  >
                    <Image src={item.image_url} alt={item.name} width={640} height={360} className="h-36 w-full rounded-xl object-cover" unoptimized />
                    <h3 className="mt-3 text-base font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-white/70">Brand: {item.brand}</p>
                    <p className="text-sm text-white/70">Type: {item.piece_type}</p>
                    <p className="text-xs text-cyan-200/90">3D status: {item.model_status ?? 'queued_base'}</p>
                    <p className="text-xs text-white/70">
                      Scope QA: {item.geometry_scope_passed === true
                        ? `Passed (${(item.geometry_scope_score ?? 0).toFixed(2)})`
                        : item.model_status === 'failed_geometry_scope'
                          ? 'Failed'
                          : item.model_3d_url || item.model_base_3d_url || item.model_branded_3d_url
                            ? 'Legacy model (not evaluated)'
                          : 'Pending'}
                    </p>
                    <p className="mt-1 text-xs text-cyan-200/90">Click to open 3D viewer</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={(event) => { event.stopPropagation(); setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'available' })); }} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Available</button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'unavailable' })); }} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Unavailable</button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); setFavorites((prev) => ({ ...prev, [item.wardrobe_item_id]: !prev[item.wardrobe_item_id] })); }} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">★ Favorite</button>
                    </div>
                  </article>
                ))}
                {!group.data.length ? <p className="text-sm text-white/70">No pieces in this list.</p> : null}
              </div>
            </SectionBlock>
          ))}
        </div>
      </div>
      {selectedItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-white/20 bg-slate-950 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{selectedItem.name} • 3D Viewer</h3>
              <button type="button" onClick={() => { setSelectedItem(null); setViewerModelIndex(0); setViewerLoading(false); setViewerError(null); setViewerLoaded(false); }} className="rounded-lg border border-white/25 px-3 py-1 text-sm text-white">Close</button>
            </div>
            {selectedItemStatusMessage ? (
              <p className="mb-3 rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
                Status: {selectedItemStatusMessage}
              </p>
            ) : null}
            {viewerModelUrl ? (
              <div className="relative">
                <model-viewer
                  ref={modelViewerRef}
                  src={viewerModelUrl}
                  poster={viewerPosterUrl}
                  ar={false}
                  camera-controls
                  disable-pan
                  touch-action="none"
                  interaction-prompt="auto"
                  auto-rotate
                  exposure="1.15"
                  shadow-intensity="1"
                  camera-target="auto auto auto"
                  camera-orbit="0deg 75deg 105%"
                  min-camera-orbit="auto auto 50%"
                  max-camera-orbit="auto auto 300%"
                  min-field-of-view="10deg"
                  max-field-of-view="45deg"
                  className="h-[60vh] w-full rounded-xl bg-slate-900"
                />
                {viewerLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/55 text-sm text-white/90">
                    Loading 3D model...
                  </div>
                ) : null}
                {viewerError && !viewerLoaded ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/65 p-4 text-center text-sm text-white">
                    <p>{viewerError}</p>
                    <a href={safeModelUrl ?? viewerModelUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-cyan-300/60 px-3 py-1 text-cyan-200">
                      Open model URL in new tab
                    </a>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-[60vh] items-center justify-center rounded-xl border border-white/20 bg-black/40 text-center text-sm text-white/80">
                {selectedItem.model_status === 'failed'
                  ? (selectedItem.model_generation_error || '3D generation failed for this item. Please retry.')
                  : selectedItem.model_status === 'failed_geometry_scope'
                    ? (selectedItem.model_generation_error || 'Generated model failed garment-only scope validation. Retry generation with cleaner piece photo.')
                  : selectedItem.model_status === 'needs_brand_review'
                    ? (selectedItem.model_generation_error || 'Brand could not be detected from the uploaded image. Please review brand/logo catalog data.')
                    : selectedItem.model_status === 'queued_segmentation' || selectedItem.model_status === 'segmentation_done'
                      ? 'Isolating designated piece before 3D generation...'
                      : selectedItem.model_status === 'queued_geometry_qa' || selectedItem.model_status === 'retrying_generation'
                        ? 'Running geometry scope checks to ensure garment-only model output...'
                    : 'This piece has no 3D model yet. Wait for base and branding passes to finish.'}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
