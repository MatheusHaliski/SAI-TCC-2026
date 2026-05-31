'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import SaiModalAlert from '@/app/components/shared/SaiModalAlert';
import FancySelect from '@/app/components/ui/fancy-select';

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

const PIECE_TYPE_OPTIONS = [
  { value: 'upper_piece', label: 'Parte de Cima' },
  { value: 'lower_piece', label: 'Parte de Baixo' },
  { value: 'full_body', label: 'Roupa Inteira' },
  { value: 'footwear', label: 'Calçado' },
  { value: 'accessory', label: 'Acessório' },
  { value: 'outerwear', label: 'Agasalho' },
];

type Brand = { brand_id: string; name: string; logo_url?: string | null };

const FALLBACK_BRANDS: Brand[] = [
  { brand_id: 'adidas', name: 'Adidas', logo_url: '/adidas.png' },
  { brand_id: 'nike', name: 'Nike', logo_url: '/nike.png' },
  { brand_id: 'zara', name: 'Zara', logo_url: '/zara.jpg' },
  { brand_id: 'puma', name: 'Puma', logo_url: '/puma.jpg' },
  { brand_id: 'lacoste', name: 'Lacoste', logo_url: '/lacoste.jpg' },
  { brand_id: 'levis', name: "Levi's", logo_url: '/levis.jpg' },
  { brand_id: 'cea', name: 'C&A', logo_url: '/cea.jpg' },
];

interface EditWardrobeItemViewProps {
  itemId: string;
  mode?: 'page' | 'modal';
  onSaved?: () => void;
  onDeleted?: () => void;
}

interface FormState {
  name: string;
  piece_type: string;
  color: string;
  material: string;
  style_tags: string;
  occasion_tags: string;
  brand_id: string;
  description: string;
  is_favorite: boolean;
  image_url: string;
}

export default function EditWardrobeItemView({ itemId, mode = 'page', onSaved, onDeleted }: EditWardrobeItemViewProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [form, setForm] = useState<FormState>({
    name: '',
    piece_type: 'upper_piece',
    color: '',
    material: '',
    style_tags: '',
    occasion_tags: '',
    brand_id: 'default',
    description: '',
    is_favorite: false,
    image_url: '',
  });

  const inputClassName =
    'w-full rounded-xl border border-border bg-accent px-3 py-2 text-sm text-white placeholder:text-muted-foreground shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [itemResponse, brandsResponse] = await Promise.all([
          fetch(`/api/wardrobe-items/${encodeURIComponent(itemId)}`),
          fetch('/api/brands'),
        ]);

        if (!itemResponse.ok) {
          setAlertMessage('Peça não encontrada.');
          return;
        }

        const item = (await itemResponse.json()) as Record<string, unknown>;
        const brandsData = await brandsResponse.json().catch(() => []);
        const apiBrands = Array.isArray(brandsData) ? (brandsData as Brand[]) : [];
        const merged = [
          ...FALLBACK_BRANDS.filter((fb) => !apiBrands.some((b) => b.brand_id === fb.brand_id)),
          ...apiBrands,
        ];
        setBrands(merged);

        setForm({
          name: String(item.name ?? ''),
          piece_type: String(item.piece_type ?? 'upper_piece'),
          color: String(item.color ?? ''),
          material: String(item.material ?? ''),
          style_tags: Array.isArray(item.style_tags) ? item.style_tags.join(', ') : '',
          occasion_tags: Array.isArray(item.occasion_tags) ? item.occasion_tags.join(', ') : '',
          brand_id: String(item.brand_id ?? 'default'),
          description: String(item.description ?? ''),
          is_favorite: Boolean(item.is_favorite),
          image_url: String(item.image_url ?? ''),
        });
        setImagePreview(String(item.image_url ?? ''));
      } catch {
        setAlertMessage('Erro ao carregar dados da peça.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [itemId]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        setAlertMessage('Falha no upload da imagem. Tente novamente.');
        setImagePreview(form.image_url);
        return;
      }

      const uploadData = (await uploadResponse.json()) as { url?: string };
      if (uploadData.url) {
        setForm((prev) => ({ ...prev, image_url: uploadData.url! }));
      }
    } catch {
      setAlertMessage('Erro ao fazer upload da imagem.');
      setImagePreview(form.image_url);
    } finally {
      setUploadingImage(false);
    }
  };

  const parseTags = (raw: string): string[] =>
    raw
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setAlertMessage('O nome da peça é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        piece_type: form.piece_type,
        color: form.color,
        material: form.material,
        style_tags: parseTags(form.style_tags),
        occasion_tags: parseTags(form.occasion_tags),
        brand_id: form.brand_id,
        description: form.description.trim(),
        is_favorite: form.is_favorite,
        image_url: form.image_url,
      };

      const response = await fetch(`/api/wardrobe-items/${encodeURIComponent(itemId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setAlertMessage(data?.error ?? 'Erro ao salvar alterações.');
        return;
      }

      onSaved?.();
      if (mode === 'page') {
        setAlertMessage('Peça atualizada com sucesso!');
      }
    } catch {
      setAlertMessage('Erro de conexão. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/wardrobe-items/${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setAlertMessage('Erro ao remover a peça.');
        setConfirmDelete(false);
        return;
      }

      onDeleted?.();
    } catch {
      setAlertMessage('Erro de conexão ao tentar remover a peça.');
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">Carregando peça...</p>
      </div>
    );
  }

  const brandOptions = [
    { value: 'default', label: 'Marca Padrão' },
    ...brands.map((b) => ({ value: b.brand_id, label: b.name })),
  ];

  return (
    <div className="space-y-6">
      {mode === 'page' && (
        <PageHeader
          title="Editar Peça"
          subtitle="Atualize as informações visuais e descritivas desta peça do seu guarda-roupa."
        />
      )}

      {alertMessage && <SaiModalAlert message={alertMessage} onConfirm={() => setAlertMessage(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image section */}
        <SectionBlock title="Imagem da Peça" subtitle="Atualize a foto desta peça do guarda-roupa.">
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {imagePreview && (
              <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl border border-border">
                <Image
                  src={imagePreview}
                  alt={form.name || 'Peça'}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-xs text-white">Enviando...</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <label className="block text-sm text-muted-foreground">
                Substituir imagem
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="w-full rounded-xl border border-border bg-accent px-3 py-2 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:brightness-110 disabled:opacity-50"
              />
              <p className="text-xs text-white/40">Deixe em branco para manter a imagem atual.</p>
            </div>
          </div>
        </SectionBlock>

        {/* Basic info */}
        <SectionBlock title="Informações Básicas" subtitle="Nome, tipo e marca da peça.">
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-sm text-muted-foreground">Nome da Peça *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Jaqueta Preta Oversized"
                required
                className={inputClassName}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm text-muted-foreground">Tipo de Peça</label>
              <FancySelect
                options={PIECE_TYPE_OPTIONS}
                value={form.piece_type}
                onChange={(value) => setForm((prev) => ({ ...prev, piece_type: value }))}
                placeholder="Selecione o tipo"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm text-muted-foreground">Marca</label>
              <FancySelect
                options={brandOptions}
                value={form.brand_id}
                onChange={(value) => setForm((prev) => ({ ...prev, brand_id: value }))}
                placeholder="Selecione a marca"
              />
            </div>
          </div>
        </SectionBlock>

        {/* Attributes */}
        <SectionBlock title="Atributos Visuais" subtitle="Cor, material e tags de estilo da peça.">
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm text-muted-foreground">Cor</label>
              <FancySelect
                options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))}
                value={form.color}
                onChange={(value) => setForm((prev) => ({ ...prev, color: value }))}
                placeholder="Selecione a cor"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm text-muted-foreground">Material</label>
              <FancySelect
                options={MATERIAL_OPTIONS.map((m) => ({ value: m, label: m }))}
                value={form.material}
                onChange={(value) => setForm((prev) => ({ ...prev, material: value }))}
                placeholder="Selecione o material"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm text-muted-foreground">Tags de Estilo</label>
              <input
                type="text"
                value={form.style_tags}
                onChange={(e) => setForm((prev) => ({ ...prev, style_tags: e.target.value }))}
                placeholder={`Ex: ${STYLE_TAG_OPTIONS.slice(0, 3).join(', ')}`}
                className={inputClassName}
              />
              <p className="text-xs text-white/40">Separe por vírgula. Ex: Casual, Streetwear</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm text-muted-foreground">Ocasiões</label>
              <input
                type="text"
                value={form.occasion_tags}
                onChange={(e) => setForm((prev) => ({ ...prev, occasion_tags: e.target.value }))}
                placeholder={`Ex: ${OCCASION_TAG_OPTIONS.slice(0, 3).join(', ')}`}
                className={inputClassName}
              />
              <p className="text-xs text-white/40">Separe por vírgula. Ex: Work, Party</p>
            </div>
          </div>
        </SectionBlock>

        {/* Tags quick-fill */}
        <SectionBlock title="Sugestões de Tags" subtitle="Clique para adicionar rapidamente ao campo de estilos ou ocasiões.">
          <div className="mt-3 space-y-3">
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">Estilos</p>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setForm((prev) => {
                      const current = prev.style_tags ? prev.style_tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
                      if (current.includes(tag)) return prev;
                      return { ...prev, style_tags: [...current, tag].join(', ') };
                    })}
                    className="rounded-full border border-border bg-accent px-2 py-0.5 text-xs text-muted-foreground hover:border-violet-400/50 hover:text-white transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">Ocasiões</p>
              <div className="flex flex-wrap gap-1.5">
                {OCCASION_TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setForm((prev) => {
                      const current = prev.occasion_tags ? prev.occasion_tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
                      if (current.includes(tag)) return prev;
                      return { ...prev, occasion_tags: [...current, tag].join(', ') };
                    })}
                    className="rounded-full border border-border bg-accent px-2 py-0.5 text-xs text-muted-foreground hover:border-fuchsia-400/50 hover:text-white transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* Description & settings */}
        <SectionBlock title="Descrição e Preferências" subtitle="Notas adicionais e marcação de favorito.">
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm text-muted-foreground">Descrição</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Descreva detalhes adicionais desta peça..."
                className={`${inputClassName} resize-none`}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-accent px-4 py-3 hover:bg-accent transition">
              <input
                type="checkbox"
                checked={form.is_favorite}
                onChange={(e) => setForm((prev) => ({ ...prev, is_favorite: e.target.checked }))}
                className="h-4 w-4 rounded accent-violet-500"
              />
              <span className="text-sm text-foreground">★ Marcar como favorita</span>
            </label>
          </div>
        </SectionBlock>

        {/* Actions */}
        <SectionBlock title="Ações" subtitle="Salve as alterações ou remova esta peça do guarda-roupa.">
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex-1 rounded-xl border border-border bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
                confirmDelete
                  ? 'border-rose-400/60 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30'
                  : 'border-border bg-accent text-muted-foreground hover:border-rose-400/40 hover:text-rose-300'
              }`}
            >
              {deleting ? 'Removendo...' : confirmDelete ? 'Confirmar Remoção' : 'Remover Peça'}
            </button>

            {confirmDelete && !deleting && (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-border bg-accent px-4 py-2 text-sm text-muted-foreground hover:text-white transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </SectionBlock>
      </form>
    </div>
  );
}
