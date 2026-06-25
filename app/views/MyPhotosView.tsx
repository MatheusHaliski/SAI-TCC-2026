'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';

type PhotoCategory = 'all' | 'pieces' | 'outfits';

interface PhotoItem {
  id: string;
  url: string;
  label: string;
  sublabel: string;
  category: 'pieces' | 'outfits';
  createdAt: string | null;
}

interface WardrobeItemRaw {
  wardrobe_item_id: string;
  name?: string;
  image_url?: string;
  piece_type?: string;
  brand?: string;
  createdAt?: string | null;
  image_assets?: {
    approved_catalog_2d_url?: string | null;
    normalized_2d_preview_url?: string | null;
  };
}

interface SchemeRaw {
  scheme_id: string;
  title?: string;
  cover_image_url?: string | null;
  style?: string;
  occasion?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const CATEGORY_TABS: Array<{ key: PhotoCategory; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: 'pieces', label: 'Peças' },
  { key: 'outfits', label: 'Looks' },
];

function bestImageUrl(item: WardrobeItemRaw): string {
  return (
    item.image_assets?.approved_catalog_2d_url ||
    item.image_assets?.normalized_2d_preview_url ||
    item.image_url ||
    ''
  );
}

interface PhotoDetailModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
}

function PhotoDetailModal({ photo, onClose }: PhotoDetailModalProps) {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-card p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="sa-premium-gradient-surface w-full max-w-lg rounded-3xl border border-border p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{photo.label}</h3>
            <p className="text-sm text-muted-foreground">{photo.sublabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-border px-3 py-1 text-sm text-white hover:border-fuchsia-300/60"
          >
            Fechar
          </button>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
          <Image
            src={photo.url}
            alt={photo.label}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
              photo.category === 'pieces'
                ? 'border-violet-400/40 bg-violet-500/10 text-violet-200'
                : 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200'
            }`}
          >
            {photo.category === 'pieces' ? 'Peça' : 'Look'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyPhotosView() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const localProfile = getAuthSessionProfile();
        let userId = localProfile.user_id?.trim() || '';
        if (!userId) {
          const serverProfile = await getServerSession();
          userId = serverProfile?.user_id?.trim() || '';
        }
        if (!userId) return;

        const [wardrobeResponse, schemesResponse] = await Promise.all([
          fetch(`/api/wardrobe-items/user/${encodeURIComponent(userId)}?status=active&limit=100`),
          fetch(`/api/schemes/user/${encodeURIComponent(userId)}`),
        ]);

        const wardrobeData = (await wardrobeResponse.json().catch(() => ({ items: [] }))) as { items?: WardrobeItemRaw[] };
        const schemesData = (await schemesResponse.json().catch(() => [])) as SchemeRaw[];

        const piecePhotos: PhotoItem[] = (wardrobeData.items ?? [])
          .filter((item) => Boolean(bestImageUrl(item)))
          .map((item) => ({
            id: `piece-${item.wardrobe_item_id}`,
            url: bestImageUrl(item),
            label: item.name || 'Peça sem nome',
            sublabel: [item.piece_type, item.brand].filter(Boolean).join(' · ') || 'Peça de roupa',
            category: 'pieces' as const,
            createdAt: item.createdAt ?? null,
          }));

        const outfitPhotos: PhotoItem[] = (Array.isArray(schemesData) ? schemesData : [])
          .filter((scheme) => Boolean(scheme.cover_image_url))
          .map((scheme) => ({
            id: `outfit-${scheme.scheme_id}`,
            url: scheme.cover_image_url!,
            label: scheme.title || 'Look sem nome',
            sublabel: [scheme.style, scheme.occasion].filter(Boolean).join(' · ') || 'Look',
            category: 'outfits' as const,
            createdAt: scheme.createdAt ?? scheme.updatedAt ?? null,
          }));

        setPhotos([...piecePhotos, ...outfitPhotos]);
      } finally {
        setLoading(false);
      }
    };

    load().catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = photos;

    if (activeCategory !== 'all') {
      result = result.filter((photo) => photo.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (photo) =>
          photo.label.toLowerCase().includes(query) ||
          photo.sublabel.toLowerCase().includes(query),
      );
    }

    return result;
  }, [photos, activeCategory, searchQuery]);

  // Memória Visual do Estilo — chronological timeline grouped by month.
  const timelineGroups = useMemo(() => {
    const groups = new Map<string, { key: string; label: string; sortKey: number; items: PhotoItem[] }>();
    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

    for (const photo of filtered) {
      const date = photo.createdAt ? new Date(photo.createdAt) : null;
      const valid = date && Number.isFinite(date.getTime());
      const key = valid ? `${date!.getFullYear()}-${String(date!.getMonth() + 1).padStart(2, '0')}` : 'sem-data';
      const label = valid ? monthFormatter.format(date!) : 'Sem data';
      const sortKey = valid ? date!.getFullYear() * 100 + date!.getMonth() : -1;
      if (!groups.has(key)) groups.set(key, { key, label, sortKey, items: [] });
      groups.get(key)!.items.push(photo);
    }

    return Array.from(groups.values()).sort((a, b) => b.sortKey - a.sortKey);
  }, [filtered]);

  const pieceCount = photos.filter((p) => p.category === 'pieces').length;
  const outfitCount = photos.filter((p) => p.category === 'outfits').length;

  const renderPhotoButton = (photo: PhotoItem) => (
    <button
      key={photo.id}
      type="button"
      onClick={() => setSelectedPhoto(photo)}
      className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-accent transition hover:border-violet-400/40 hover:shadow-[0_0_16px_rgba(139,92,246,0.15)]"
    >
      <Image src={photo.url} alt={photo.label} fill className="object-cover transition group-hover:scale-105" unoptimized />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-2 opacity-0 transition group-hover:opacity-100">
        <p className="truncate text-[11px] font-medium text-white leading-tight">{photo.label}</p>
        <p className="truncate text-[10px] text-muted-foreground leading-tight">{photo.sublabel}</p>
      </div>
      <div className="absolute right-1.5 top-1.5">
        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${photo.category === 'pieces' ? 'bg-violet-600/80 text-white' : 'bg-fuchsia-600/80 text-white'}`}>
          {photo.category === 'pieces' ? 'Peça' : 'Look'}
        </span>
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Minhas Fotos"
        subtitle="Galeria pessoal com imagens de peças e looks cadastrados no seu guarda-roupa virtual."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: photos.length, lightColor: '#0f172a', darkColor: '#ffffff' },
          { label: 'Peças', value: pieceCount, lightColor: '#7c3aed', darkColor: '#a78bfa' },
          { label: 'Looks', value: outfitCount, lightColor: '#db2777', darkColor: '#f0abfc' },
        ].map(({ label, value, lightColor, darkColor }) => {
          const isDarkTheme = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') !== 'light';
          return (
            <div key={label} className="rounded-2xl border border-border bg-accent p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: isDarkTheme ? darkColor : lightColor }}>{value}</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
            </div>
          );
        })}
      </div>

      {/* Search + Filter */}
      <SectionBlock title="Explorar Fotos" subtitle="Filtre e busque pelas suas imagens cadastradas.">
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 rounded-2xl border border-border bg-accent px-4 py-3">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou tipo..."
              className="w-full bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCategory(tab.key)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  activeCategory === tab.key
                    ? 'border-violet-400/70 bg-violet-500/20 text-violet-100 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                    : 'border-border bg-accent text-muted-foreground hover:border-white/35 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <span className="mx-1 h-4 w-px bg-border" />

            {([['grid', '▦ Grade'], ['timeline', '🕒 Linha do tempo']] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  viewMode === mode
                    ? 'border-fuchsia-400/70 bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_12px_rgba(217,70,239,0.2)]'
                    : 'border-border bg-accent text-muted-foreground hover:border-white/35 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </SectionBlock>

      {/* Gallery grid */}
      <SectionBlock
        title={`${filtered.length} foto${filtered.length !== 1 ? 's' : ''}`}
        subtitle="Clique em uma imagem para ver detalhes."
      >
        {loading ? (
          <div className="mt-6 flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Carregando galeria...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-accent py-12 text-center">
            {photos.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6">
                <span className="text-3xl">📸</span>
                <p className="text-sm text-white/85">Sua memória visual de estilo começa aqui.</p>
                <p className="max-w-sm text-xs text-muted-foreground">Fotografe sua primeira peça e o SAI começa a montar sua linha do tempo de estilo automaticamente.</p>
                <a
                  href="/add-wardrobe-item"
                  className="mt-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Fotografar primeira peça
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma foto corresponde aos filtros selecionados.</p>
            )}
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="mt-4 space-y-6">
            {timelineGroups.map((group) => (
              <div key={group.key}>
                <div className="mb-2 flex items-center gap-3">
                  <h4 className="text-sm font-semibold capitalize text-white">{group.label}</h4>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">{group.items.length} foto{group.items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {group.items.map(renderPhotoButton)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {filtered.map(renderPhotoButton)}
          </div>
        )}
      </SectionBlock>

      <PhotoDetailModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}