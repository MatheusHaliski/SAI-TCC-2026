'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import BrandBadge from '@/app/components/outfit-card/BrandBadge';
import { resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';

// Static curated enrichment — brand entity only stores name/logo_url/is_active
const BRAND_PROFILES: Record<
  string,
  {
    category: string;
    segment: string;
    targetAudience: string;
    origin: string;
    founded: number;
    positioning: string;
    tags: string[];
    accentColor: string;
  }
> = {
  adidas: {
    category: 'Esportivo & Streetwear',
    segment: 'Performance / Lifestyle',
    targetAudience: 'Atletas e entusiastas de cultura urbana, 16–35 anos',
    origin: 'Alemanha',
    founded: 1949,
    positioning: 'Impossible is Nothing — fusão de alto desempenho com estilo de rua.',
    tags: ['Sportswear', 'Streetwear', 'Sneaker Culture', 'Collaborations'],
    accentColor: 'rgba(125,211,252,0.85)',
  },
  nike: {
    category: 'Esportivo & Lifestyle',
    segment: 'Performance / Premium Casual',
    targetAudience: 'Atletas e consumidores de moda esportiva, 14–40 anos',
    origin: 'Estados Unidos',
    founded: 1964,
    positioning: 'Just Do It — motivação, superação e estilo de vida ativo.',
    tags: ['Sportswear', 'Running', 'Basketball', 'Sneaker Culture'],
    accentColor: 'rgba(251,113,133,0.85)',
  },
  zara: {
    category: 'Fast Fashion Premium',
    segment: 'High-Street Fashion',
    targetAudience: 'Consumidores de moda contemporânea, 18–45 anos',
    origin: 'Espanha',
    founded: 1975,
    positioning: 'Tendências de passarela a preços acessíveis, renovadas a cada semana.',
    tags: ['Fast Fashion', 'Contemporary', 'Minimalist', 'Trend-Driven'],
    accentColor: 'rgba(203,213,225,0.85)',
  },
  puma: {
    category: 'Esportivo & Streetwear',
    segment: 'Lifestyle / Performance',
    targetAudience: 'Jovens urbanos e apreciadores de cultura pop, 16–32 anos',
    origin: 'Alemanha',
    founded: 1948,
    positioning: 'Forever Faster — velocidade, ousadia e expressão cultural.',
    tags: ['Streetwear', 'Sportswear', 'Motorsport', 'Pop Culture'],
    accentColor: 'rgba(251,146,60,0.85)',
  },
  lacoste: {
    category: 'Casual Premium',
    segment: 'Preppy / Sport-Chic',
    targetAudience: 'Consumidores de estilo clássico e elegância casual, 22–50 anos',
    origin: 'França',
    founded: 1933,
    positioning: 'Life is a Beautiful Sport — sofisticação com raízes no tênis clássico.',
    tags: ['Classic', 'Sport-Chic', 'Premium Casual', 'Polo'],
    accentColor: 'rgba(52,211,153,0.85)',
  },
  'levi\'s': {
    category: 'Denim & Casual',
    segment: 'Heritage / Everyday',
    targetAudience: 'Todos os perfis, foco em adultos que valorizam autenticidade, 18–50 anos',
    origin: 'Estados Unidos',
    founded: 1853,
    positioning: 'Live in Levi\'s — autenticidade, durabilidade e história americana.',
    tags: ['Denim', 'Heritage', 'Casual', 'Americana'],
    accentColor: 'rgba(147,197,253,0.85)',
  },
  'c&a': {
    category: 'Fast Fashion Popular',
    segment: 'Acessível / Família',
    targetAudience: 'Famílias e consumidores de moda acessível, todas as idades',
    origin: 'Países Baixos',
    founded: 1841,
    positioning: 'Moda para todos — preço justo, variedade e inclusão.',
    tags: ['Fast Fashion', 'Family', 'Affordable', 'Basics'],
    accentColor: 'rgba(167,243,208,0.85)',
  },
};

interface BrandData {
  brand_id: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
}

interface WardrobePreviewItem {
  wardrobe_item_id: string;
  name: string;
  piece_type: string;
  image_url?: string | null;
  color?: string;
}

interface BrandPanelProps {
  brand: BrandData;
  onClose: () => void;
}

function BrandPanel({ brand, onClose }: BrandPanelProps) {
  const nameKey = brand.name.toLowerCase();
  const profile = BRAND_PROFILES[nameKey];
  const logoUrl = brand.logo_url || resolveBrandLogoUrlByName(brand.name) || undefined;
  const [pieces, setPieces] = useState<WardrobePreviewItem[]>([]);
  const [loadingPieces, setLoadingPieces] = useState(true);

  useEffect(() => {
    setLoadingPieces(true);
    fetch(`/api/wardrobe-items?brand_id=${encodeURIComponent(brand.brand_id)}&limit=12`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setPieces(items.slice(0, 12));
      })
      .catch(() => setPieces([]))
      .finally(() => setLoadingPieces(false));
  }, [brand.brand_id]);

  const accentColor = profile?.accentColor ?? 'rgba(203,213,225,0.8)';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 bg-white/5 shadow-lg"
            style={{ borderColor: accentColor }}
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={`${brand.name} logo`} className="h-12 w-12 rounded-xl object-contain" />
            ) : (
              <span className="text-2xl font-black text-white/60">
                {brand.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{brand.name}</h2>
            {profile && (
              <p className="text-xs text-white/55">
                {profile.origin} · Est. {profile.founded}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/40 hover:text-white"
        >
          ← Voltar
        </button>
      </div>

      {/* Positioning quote */}
      {profile?.positioning && (
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: `${accentColor.replace('0.85', '0.3')}`, background: `${accentColor.replace('0.85', '0.07')}` }}
        >
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">Posicionamento</p>
          <p className="text-sm italic leading-relaxed text-white/80">&ldquo;{profile.positioning}&rdquo;</p>
        </div>
      )}

      {/* Profile grid */}
      {profile && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Categoria</p>
            <p className="text-sm font-semibold text-white/90">{profile.category}</p>
            <p className="mt-0.5 text-xs text-white/55">{profile.segment}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Público-Alvo</p>
            <p className="text-sm leading-snug text-white/85">{profile.targetAudience}</p>
          </div>
        </div>
      )}

      {/* Style tags */}
      {profile?.tags && (
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">Identidade de Estilo</p>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium text-white/75"
                style={{ borderColor: accentColor.replace('0.85', '0.4'), background: accentColor.replace('0.85', '0.1') }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pieces from platform */}
      <div>
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/40">
          Peças desta Marca na Plataforma
        </p>
        {loadingPieces ? (
          <p className="text-xs text-white/50">Carregando peças...</p>
        ) : pieces.length === 0 ? (
          <p className="text-xs text-white/50">Nenhuma peça registrada para esta marca ainda.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {pieces.map((piece) => (
              <div
                key={piece.wardrobe_item_id}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-2.5"
              >
                {piece.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={piece.image_url}
                    alt={piece.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-lg">
                    🧥
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white/90">{piece.name}</p>
                  <p className="text-[10px] text-white/50">{piece.piece_type}{piece.color ? ` · ${piece.color}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MaisonView() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBrands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, searchQuery]);

  const enrichedCount = useMemo(
    () => brands.filter((b) => BRAND_PROFILES[b.name.toLowerCase()]).length,
    [brands],
  );

  if (selectedBrand) {
    return (
      <div className="space-y-6">
        <PageHeader title="Maison" subtitle={`Perfil da marca: ${selectedBrand.name}`} />
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <BrandPanel brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maison"
        subtitle="Feed dedicado às marcas da plataforma — categoria, público-alvo, posicionamento e muito mais."
      />

      <SectionBlock title="Marcas Registradas" subtitle="Todas as marcas ativas na plataforma SAI.">
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar marca..."
            className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
          />
        </label>

        {loading ? (
          <p className="mt-4 text-sm text-white/60">Carregando marcas...</p>
        ) : filteredBrands.length === 0 ? (
          <p className="mt-4 text-sm text-white/60">Nenhuma marca encontrada.</p>
        ) : (
          <>
            <p className="mt-3 text-xs text-white/40">
              {filteredBrands.length} marca{filteredBrands.length !== 1 ? 's' : ''} · {enrichedCount} com perfil completo
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBrands.map((brand) => {
                const nameKey = brand.name.toLowerCase();
                const profile = BRAND_PROFILES[nameKey];
                const logoUrl = brand.logo_url || resolveBrandLogoUrlByName(brand.name) || undefined;
                const accentColor = profile?.accentColor ?? 'rgba(203,213,225,0.8)';

                return (
                  <button
                    key={brand.brand_id}
                    type="button"
                    onClick={() => setSelectedBrand(brand)}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-left transition hover:border-white/30 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <BrandBadge brandName={brand.name} brandLogoUrl={logoUrl} variant="default" />
                    </div>

                    {profile ? (
                      <>
                        <p className="text-xs leading-snug text-white/60 line-clamp-2">{profile.category} · {profile.origin}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white/65"
                              style={{ borderWidth: 1, borderStyle: 'solid', borderColor: accentColor.replace('0.85', '0.35'), background: accentColor.replace('0.85', '0.08') }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-white/40">Perfil em construção</p>
                    )}

                    <span
                      className="self-start rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60 transition group-hover:text-white"
                      style={{ borderColor: accentColor.replace('0.85', '0.3'), background: accentColor.replace('0.85', '0.06') }}
                    >
                      Ver Maison →
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </SectionBlock>

      <SectionBlock title="Sobre o Maison" subtitle="O feed de identidade das marcas do Fashion AI.">
        <div className="mt-3 space-y-2 text-sm text-white/65 leading-relaxed">
          <p>
            O <span className="font-semibold text-white/85">Maison</span> é o espaço dedicado às marcas que compõem o universo do SAI.
            Aqui você encontra o perfil completo de cada grife: categoria de moda, segmento de mercado, público-alvo, posicionamento e identidade de estilo.
          </p>
          <p>
            Clique em qualquer marca para acessar seu feed exclusivo e descobrir as peças daquela marca registradas na plataforma.
          </p>
        </div>
      </SectionBlock>
    </div>
  );
}
