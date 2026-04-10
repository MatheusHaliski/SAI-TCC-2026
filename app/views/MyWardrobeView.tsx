'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { resolveWardrobeModelUrl } from '@/app/lib/wardrobeModelUrl';
import ThreeDViewerModal from '@/app/components/wardrobe/ThreeDViewerModal';
import WardrobeItemViewerModal from '@/app/components/wardrobe/WardrobeItemViewerModal';
import ThreeDGenerationProgressModal from '@/app/components/wardrobe/ThreeDGenerationProgressModal';
import WardrobeItemCard from '@/app/components/wardrobe/WardrobeItemCard';
import { use3dAssetJob } from '@/app/hooks/use3dAssetJob';

interface WardrobeItem {
  wardrobe_item_id: string;
  name: string;
  image_url: string;
  image_assets?: { raw_upload_image_url?: string | null; segmented_png_url?: string | null; normalized_2d_preview_url?: string | null; approved_catalog_2d_url?: string | null; model_3d_url?: string | null };
  image_analysis?: { catalog_readiness_score?: number; recommended_action?: string };
  model_3d_url?: string | null;
  model_preview_url?: string | null;
  model_base_3d_url?: string | null;
  model_branded_3d_url?: string | null;
  model_status?: string;
  model_generation_error?: string | null;
  brand: string;
  season: string;
  gender: string;
  piece_type: string;
}

const sections = ['Available', 'Unavailable', 'Favorites'];

const READY_STATUSES = new Set(['done', 'ready', 'completed', 'asset_available']);
const FAILED_STATUSES = new Set(['failed', 'failed_geometry_scope']);
const QUEUE_STATUSES = new Set([
  'queued_segmentation',
  'queued_base',
  'queued_branding',
  'queued_geometry_qa',
  'segmentation_done',
]);
const PROGRESS_STATUSES = new Set(['generating_base', 'branding_in_progress', 'base_done', 'retrying_generation', 'in_progress']);

function mapItemState(item: WardrobeItem): 'ready' | 'failed' | 'queued' | 'generating' | 'not_started' {
  const normalized = String(item.model_status ?? '').trim().toLowerCase();
  if (resolveWardrobeModelUrl(item) || READY_STATUSES.has(normalized)) return 'ready';
  if (FAILED_STATUSES.has(normalized)) return 'failed';
  if (QUEUE_STATUSES.has(normalized)) return 'queued';
  if (PROGRESS_STATUSES.has(normalized)) return 'generating';
  return 'not_started';
}

function stateLabel(state: ReturnType<typeof mapItemState>, status?: string) {
  if (state === 'ready') return 'Ready for 3D Viewer';
  if (state === 'queued') return 'Queue pending';
  if (state === 'generating') return 'Generating asset';
  if (state === 'failed') return 'Failed (tap to retry)';
  return `Not started${status ? ` • ${status}` : ''}`;
}

export default function MyWardrobeView() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [selectedSection, setSelectedSection] = useState(sections[0]?.toLowerCase() ?? 'available');
  const [resolvedUserId, setResolvedUserId] = useState('');
  const [availability, setAvailability] = useState<Record<string, 'available' | 'unavailable'>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [viewerItem, setViewerItem] = useState<WardrobeItem | null>(null);
  const [modalItem, setModalItem] = useState<WardrobeItem | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [progressItem, setProgressItem] = useState<WardrobeItem | null>(null);

  const assetJob = use3dAssetJob({
    pollIntervalMs: 1200,
    timeoutMs: 90000,
    onCompleted: (artifactUrl) => {
      if (!progressItem) return;
      setViewerItem(progressItem);
      setViewerUrl(artifactUrl);
      setProgressItem(null);
    },
  });

  useEffect(() => {
    const loadWardrobeData = async () => {
      const localProfile = getAuthSessionProfile();
      let userId = localProfile.user_id?.trim() || '';

      if (!userId) {
        const serverProfile = await getServerSession();
        userId = serverProfile?.user_id?.trim() || '';
      }

      if (!userId) {
        setItems([]);
        return;
      }

      setResolvedUserId(userId);
      const wardrobeResponse = await fetch(`/api/wardrobe-items/user/${userId}`);
      const wardrobeItems = await wardrobeResponse.json().catch(() => []);
      setItems(wardrobeResponse.ok && Array.isArray(wardrobeItems) ? wardrobeItems : []);
    };

    void loadWardrobeData().catch(() => setItems([]));
  }, []);

  const refreshItem = async (itemId: string) => {
    if (!resolvedUserId) throw new Error('Session unavailable.');
    const response = await fetch(`/api/wardrobe-items/user/${resolvedUserId}`);
    if (!response.ok) throw new Error('Unable to sync 3D generation status.');
    const data = (await response.json().catch(() => [])) as WardrobeItem[];
    if (!Array.isArray(data)) throw new Error('Malformed wardrobe payload.');
    setItems(data);
    const fresh = data.find((item) => item.wardrobe_item_id === itemId);
    if (!fresh) throw new Error('Wardrobe item not found while polling.');

    const normalized = mapItemState(fresh);
    const modelUrl = resolveWardrobeModelUrl(fresh);

    if (normalized === 'ready' && modelUrl) {
      return { jobId: fresh.wardrobe_item_id, status: 'completed', artifacts: { model_3d_url: modelUrl } };
    }

    if (normalized === 'failed') {
      return { jobId: fresh.wardrobe_item_id, status: 'failed', error: fresh.model_generation_error ?? '3D generation failed.' };
    }

    return { jobId: fresh.wardrobe_item_id, status: normalized === 'queued' ? 'queued' : 'in_progress' };
  };

  const grouped = useMemo(() => {
    const available = items.filter((item) => (availability[item.wardrobe_item_id] ?? 'available') === 'available');
    const unavailable = items.filter((item) => (availability[item.wardrobe_item_id] ?? 'available') === 'unavailable');
    const favorite = items.filter((item) => favorites[item.wardrobe_item_id]);
    return { available, unavailable, favorite };
  }, [availability, favorites, items]);

  const activeGroups = useMemo(() => {
    const groups = [
      { key: 'available', title: 'Available Pieces', data: grouped.available },
      { key: 'unavailable', title: 'Unavailable Pieces', data: grouped.unavailable },
      { key: 'favorite', title: 'Favorite Pieces', data: grouped.favorite },
    ] as const;

    const sectionToGroupKey: Record<string, (typeof groups)[number]['key']> = {
      available: 'available',
      unavailable: 'unavailable',
      favorites: 'favorite',
    };

    const selectedGroup = groups.find((group) => group.key === (sectionToGroupKey[selectedSection] ?? 'available'));
    return selectedGroup ? [selectedGroup] : [groups[0]];
  }, [grouped, selectedSection]);

  const handleOpenViewerIntent = async (item: WardrobeItem) => {
    const existingModel = resolveWardrobeModelUrl(item);
    if (existingModel) {
      setViewerItem(item);
      setViewerUrl(existingModel);
      return;
    }

    setProgressItem(item);

    await assetJob.startJob({
      existingJobId: item.wardrobe_item_id,
      pollJob: () => refreshItem(item.wardrobe_item_id),
    });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ContextSectionMenu
          title="Virtual Wardrobe"
          sections={sections}
          selectedSection={sections.find((section) => section.toLowerCase() === selectedSection) ?? sections[0]}
          onSelectSection={(section) => setSelectedSection(section.toLowerCase())}
        />
        <div className="space-y-6">
          <PageHeader title="Virtual Wardrobe" subtitle="Classify pieces as available, unavailable, and favorites." />

          {activeGroups.map((group) => (
            <SectionBlock key={group.key} title={group.title} subtitle="Manage list status for each wardrobe item.">
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.data.map((item) => {
                  const cardState = mapItemState(item);
                  return (
                    <WardrobeItemCard
                      key={item.wardrobe_item_id}
                      name={item.name}
                      imageUrl={item.image_url}
                      imageAssets={item.image_assets}
                      brand={item.brand}
                      pieceType={item.piece_type}
                      state={cardState}
                      statusLabel={stateLabel(cardState, item.model_status)}
                      onClick={() => setModalItem(item)}
                      onAvailable={() => setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'available' }))}
                      onUnavailable={() => setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'unavailable' }))}
                      onToggleFavorite={() => setFavorites((prev) => ({ ...prev, [item.wardrobe_item_id]: !prev[item.wardrobe_item_id] }))}
                    />
                  );
                })}
                {!group.data.length ? <p className="text-sm text-white/70">No pieces in this list.</p> : null}
              </div>
            </SectionBlock>
          ))}
        </div>
      </div>


      <WardrobeItemViewerModal
        open={Boolean(modalItem)}
        item={modalItem}
        onClose={() => setModalItem(null)}
        onOpen3D={() => {
          if (!modalItem) return;
          setModalItem(null);
          void handleOpenViewerIntent(modalItem);
        }}
      />

      <ThreeDGenerationProgressModal
        open={Boolean(progressItem) && !viewerUrl}
        status={assetJob.status}
        progressPercent={assetJob.progressPercent}
        pollAttempts={assetJob.pollAttempts}
        error={assetJob.error}
        onClose={() => {
          assetJob.cancelPolling();
          setProgressItem(null);
        }}
        onRetry={() => {
          if (!progressItem) return;
          assetJob.retry();
        }}
      />

      {viewerItem && viewerUrl ? (
        <ThreeDViewerModal
          open
          title={`${viewerItem.name} • 3D Viewer`}
          modelUrl={viewerUrl}
          posterUrl={viewerItem.model_preview_url ?? undefined}
          onClose={() => {
            setViewerItem(null);
            setViewerUrl(null);
          }}
        />
      ) : null}
    </>
  );
}
