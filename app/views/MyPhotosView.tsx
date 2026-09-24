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
  sourceId: string;
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

/* ── Edit/Detail Modal ── */
interface PhotoDetailModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onSave: (id: string, newLabel: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function PhotoDetailModal({ photo, onClose, onSave, onDelete }: PhotoDetailModalProps) {
  const [editLabel, setEditLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (photo) {
      setEditLabel(photo.label);
      setConfirmDelete(false);
    }
  }, [photo]);

  if (!photo) return null;

  const handleSave = async () => {
    if (!editLabel.trim() || editLabel.trim() === photo.label) return;
    setSaving(true);
    try {
      await onSave(photo.id, editLabel.trim());
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await onDelete(photo.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="sa-premium-gradient-surface w-full max-w-lg rounded-3xl border border-border p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Imagem */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
          <Image src={photo.url} alt={photo.label} fill className="object-cover" unoptimized />
        </div>

        {/* Badge de categoria */}
        <div className="mt-3 flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
            photo.category === 'pieces'
              ? 'border-violet-400/40 bg-violet-500/10 text-violet-200'
              : 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200'
          }`}>
            {photo.category === 'pieces' ? 'Peça' : 'Look'}
          </span>
        </div>

        {/* ── Editar nome ── */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-white/70 mb-1">
            Editar nome
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-violet-400/60"
              placeholder="Nome da foto..."
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !editLabel.trim() || editLabel.trim() === photo.label}
              className="rounded-xl border border-violet-400/50 bg-violet-500/20 px-3 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

        {/* ── Deletar ── */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              confirmDelete
                ? 'border-rose-400/70 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30'
                : 'border-border bg-white/5 text-white/60 hover:border-rose-400/40 hover:text-rose-300'
            } disabled:opacity-50`}
          >
            {deleting ? 'Removendo...' : confirmDelete ? '⚠️ Confirmar remoção da galeria' : '🗑 Remover da galeria'}
          </button>
          {confirmDelete && (
            <p className="mt-1 text-center text-[10px] text-white/40">
              Clique novamente para confirmar. Isso não apaga a peça ou o look.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyPhotosView() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const checkTheme = () => setIsDarkTheme(document.documentElement.getAttribute('data-theme') !== 'light');
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Carrega preferências salvas localmente
  useEffect(() => {
    try {
      const saved = localStorage.getItem('myphotos-hidden');
      if (saved) setHiddenIds(new Set(JSON.parse(saved) as string[]));
      const labels = localStorage.getItem('myphotos-labels');
      if (labels) setCustomLabels(JSON.parse(labels) as Record<string, string>);
    } catch { /* ignore */ }
  }, []);

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
            sourceId: item.wardrobe_item_id,
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
            sourceId: scheme.scheme_id,
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

  /* ── Handlers de edição ── */
  const handleSaveLabel = async (id: string, newLabel: string) => {
    const updated = { ...customLabels, [id]: newLabel };
    setCustomLabels(updated);
    localStorage.setItem('myphotos-labels', JSON.stringify(updated));

    // Atualiza o selectedPhoto para refletir o novo nome
    setSelectedPhoto((prev) => prev ? { ...prev, label: newLabel } : prev);
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, label: newLabel } : p));

    // Tenta salvar no banco (peça ou look)
    try {
      if (id.startsWith('piece-')) {
        const sourceId = id.replace('piece-', '');
        await fetch(`/api/wardrobe-items/${sourceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newLabel }),
        });
      } else if (id.startsWith('outfit-')) {
        const sourceId = id.replace('outfit-', '');
        await fetch(`/api/schemes/${sourceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newLabel }),
        });
      }
    } catch { /* fallback: salvo localmente */ }
  };

  const handleDelete = async (id: string) => {
    const updated = new Set(hiddenIds);
    updated.add(id);
    setHiddenIds(updated);
    localStorage.setItem('myphotos-hidden', JSON.stringify(Array.from(updated)));
    setSelectedPhoto(null);
  };

  /* ── Filtragem ── */
  const visiblePhotos = useMemo(
    () => photos.map((p) => ({ ...p, label: customLabels[p.id] ?? p.label }))
              .filter((p) => !hiddenIds.has(p.id)),
    [photos, hiddenIds, customLabels],
  );

  const filtered = useMemo(() => {
    let result = visiblePhotos;
    if (activeCategory !== 'all') result = result.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => p.label.toLowerCase().includes(q) || p.sublabel.toLowerCase().includes(q));
    }
    return result;
  }, [visiblePhotos, activeCategory, searchQuery]);

  const timelineGroups = useMemo(() => {
    const groups = new Map<string, { key: string; label: string; sortKey: number; items: PhotoItem[] }>();
    const fmt = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
    for (const photo of filtered) {
      const date = photo.createdAt ? new Date(photo.createdAt) : null;
      const valid = date && Number.isFinite(date.getTime());
      const key = valid ? `${date!.getFullYear()}-${String(date!.getMonth() + 1).padStart(2, '0')}` : 'sem-data';
      const label = valid ? fmt.format(date!) : 'Sem data';
      const sortKey = valid ? date!.getFullYear() * 100 + date!.getMonth() : -1;
      if (!groups.has(key)) groups.set(key, { key, label, sortKey, items: [] });
      groups.get(key)!.items.push(photo);
    }
    return Array.from(groups.values()).sort((a, b) => b.sortKey - a.sortKey);
  }, [filtered]);

  const pieceCount = visiblePhotos.filter((p) => p.category === 'pieces').length;
  const outfitCount = visiblePhotos.filter((p) => p.category === 'outfits').length;
  const statColor = isDarkTheme ? '#ffffff' : '#0f172a';

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
      <div className="absolute right-1.5 top-1.5 flex gap-1">
        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${photo.category === 'pieces' ? 'bg-violet-600/80 text-white' : 'bg-fuchsia-600/80 text-white'}`}>
          {photo.category === 'pieces' ? 'Peça' : 'Look'}
        </span>
      </div>
      {/* Ícone de editar no hover */}
      <div className="absolute left-1.5 top-1.5 opacity-0 transition group-hover:opacity-100">
        <span className="rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] text-white">✎ editar</span>
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
          { label: 'Total', value: visiblePhotos.length },
          { label: 'Peças', value: pieceCount },
          { label: 'Looks', value: outfitCount },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-accent p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: statColor }}>{value}</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <SectionBlock title="Explorar Fotos" subtitle="Filtre, busque e edite suas imagens cadastradas.">
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

          <p className="text-[11px] text-white/40">💡 Clique em qualquer foto para editar o nome ou removê-la da galeria.</p>
        </div>
      </SectionBlock>

      {/* Gallery */}
      <SectionBlock
        title={`${filtered.length} foto${filtered.length !== 1 ? 's' : ''}`}
        subtitle="Clique em uma imagem para ver detalhes e editar."
      >
        {loading ? (
          <div className="mt-6 flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Carregando galeria...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-accent py-12 text-center">
            {visiblePhotos.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6">
                <span className="text-3xl">📸</span>
                <p className="text-sm text-white/85">Sua memória visual de estilo começa aqui.</p>
                <p className="max-w-sm text-xs text-muted-foreground">Fotografe sua primeira peça e o SAI começa a montar sua linha do tempo de estilo automaticamente.</p>
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

      <PhotoDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onSave={handleSaveLabel}
        onDelete={handleDelete}
      />
    </div>
  );
}
