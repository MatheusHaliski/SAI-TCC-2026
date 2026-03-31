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
  brand: string;
  season: string;
  gender: string;
  piece_type: string;
}

const sections = ['Available', 'Unavailable', 'Favorites'];

export default function MyWardrobeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [availability, setAvailability] = useState<Record<string, 'available' | 'unavailable'>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
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

  const safeModelUrl = useMemo(() => {
    const rawUrl = selectedItem?.model_3d_url?.trim();
    if (!rawUrl) return null;
    return rawUrl.startsWith('http://') ? rawUrl.replace('http://', 'https://') : rawUrl;
  }, [selectedItem]);

  useEffect(() => {
    if (!safeModelUrl || !modelViewerRef.current) return;

    const viewerElement = modelViewerRef.current;
    const handleLoad = () => {
      setViewerLoading(false);
      setViewerError(null);
    };
    const handleError = () => {
      setViewerLoading(false);
      setViewerError('Could not load this 3D model in the embedded viewer.');
    };

    viewerElement.addEventListener('load', handleLoad as EventListener);
    viewerElement.addEventListener('error', handleError as EventListener);

    return () => {
      viewerElement.removeEventListener('load', handleLoad as EventListener);
      viewerElement.removeEventListener('error', handleError as EventListener);
    };
  }, [safeModelUrl, selectedItem?.wardrobe_item_id]);

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
                      setViewerLoading(Boolean(item.model_3d_url));
                      setViewerError(null);
                    }}
                    className="cursor-pointer rounded-2xl border border-white/25 p-4 transition hover:border-cyan-300/60"
                  >
                    <Image src={item.image_url} alt={item.name} width={640} height={360} className="h-36 w-full rounded-xl object-cover" unoptimized />
                    <h3 className="mt-3 text-base font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-white/70">Brand: {item.brand}</p>
                    <p className="text-sm text-white/70">Type: {item.piece_type}</p>
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
              <button type="button" onClick={() => { setSelectedItem(null); setViewerLoading(false); setViewerError(null); }} className="rounded-lg border border-white/25 px-3 py-1 text-sm text-white">Close</button>
            </div>
            {safeModelUrl ? (
              <div className="relative">
                <model-viewer
                  ref={modelViewerRef}
                  src={safeModelUrl}
                  poster={selectedItem.model_preview_url ?? undefined}
                  ar={false}
                  camera-controls
                  touch-action="pan-y"
                  interaction-prompt="auto"
                  auto-rotate
                  exposure="1.15"
                  shadow-intensity="1"
                  className="h-[60vh] w-full rounded-xl bg-slate-900"
                />
                {viewerLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/55 text-sm text-white/90">
                    Loading 3D model...
                  </div>
                ) : null}
                {viewerError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/65 p-4 text-center text-sm text-white">
                    <p>{viewerError}</p>
                    <a href={safeModelUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-cyan-300/60 px-3 py-1 text-cyan-200">
                      Open model URL in new tab
                    </a>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-[60vh] items-center justify-center rounded-xl border border-white/20 bg-black/40 text-center text-sm text-white/80">
                This piece has no 3D model yet. Add it again after Meshy finishes processing.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
