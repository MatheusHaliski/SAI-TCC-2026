'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

/**
 * Art Celebrity — feed of verified celebrity profiles whose looks carry an exclusive
 * "Selo Premium" (premium seal). Each card opens an accessible profile showing the
 * celebrity's follower count (with a working follow incrementer) and the schemes they
 * consagraram (consecrated) with the premium seal.
 *
 * Celebrities are not regular network users, so follower deltas from the current viewer
 * are persisted locally — this is what powers the "incrementador" without a backend.
 */

interface FeaturedScheme {
  id: string;
  title: string;
  vibe: string;
  era: string;
  pieces: string[];
  gradient: string;
  likes: number;
}

interface Celebrity {
  id: string;
  name: string;
  handle: string;
  accent: string;
  baseFollowers: number;
  bio: string;
  styleTags: string[];
  signatureEra: string;
  featured: FeaturedScheme[];
}

const CELEBRITIES: Celebrity[] = [
  {
    id: 'rihanna',
    name: 'Rihanna',
    handle: '@badgalriri',
    accent: 'rgba(16,185,129,0.85)',
    baseFollowers: 151_000_000,
    bio: 'Fundadora da Fenty. Define o streetwear de luxo e a moda sem regras — do red carpet ao maternity style.',
    styleTags: ['Luxury Streetwear', 'Avant-Garde', 'Bold Layering', 'Fenty'],
    signatureEra: 'Fenty Era',
    featured: [
      { id: 'riri-1', title: 'Met Gala Bloom', vibe: 'Couture floral oversized', era: 'Met 2023', pieces: ['Casaco floral', 'Bota plataforma', 'Luvas de cetim'], gradient: 'linear-gradient(135deg,#064e3b 0%,#10b981 55%,#fef9c3 100%)', likes: 482_300 },
      { id: 'riri-2', title: 'Savage Night', vibe: 'All-black lingerie tailoring', era: 'Fenty Drop', pieces: ['Blazer estruturado', 'Corset', 'Coturno'], gradient: 'linear-gradient(135deg,#0f172a 0%,#334155 60%,#10b981 100%)', likes: 311_900 },
      { id: 'riri-3', title: 'Bridge Walk', vibe: 'Street maternity layering', era: 'Super Bowl', pieces: ['Macacão vermelho', 'Sobretudo', 'Óculos cat-eye'], gradient: 'linear-gradient(135deg,#7f1d1d 0%,#ef4444 55%,#fca5a5 100%)', likes: 528_100 },
    ],
  },
  {
    id: 'madonna',
    name: 'Madonna',
    handle: '@madonna',
    accent: 'rgba(244,114,182,0.85)',
    baseFollowers: 19_000_000,
    bio: 'A Rainha do Pop. Cada era é um manifesto de moda — do lace cone bra ao power dressing dos anos 90.',
    styleTags: ['Pop Icon', 'Corsetry', 'Reinvention', 'Retro Glam'],
    signatureEra: 'Blond Ambition',
    featured: [
      { id: 'mad-1', title: 'Cone Couture', vibe: 'Gaultier corset statement', era: 'Blond Ambition', pieces: ['Corset cônico', 'Calça alfaiataria', 'Luvas longas'], gradient: 'linear-gradient(135deg,#831843 0%,#ec4899 55%,#fbcfe8 100%)', likes: 274_500 },
      { id: 'mad-2', title: 'Vogue Noir', vibe: 'Monochrome power dressing', era: 'Vogue', pieces: ['Terno preto', 'Camisa branca', 'Joias art déco'], gradient: 'linear-gradient(135deg,#111827 0%,#6b7280 60%,#f9fafb 100%)', likes: 198_700 },
    ],
  },
  {
    id: 'ariana',
    name: 'Ariana Grande',
    handle: '@arianagrande',
    accent: 'rgba(167,139,250,0.85)',
    baseFollowers: 380_000_000,
    bio: 'Pop e pastel. Silhuetas femininas com oversized hoodies, thigh-high boots e a estética soft-glam.',
    styleTags: ['Soft Glam', 'Pastel', 'Thigh-High Boots', 'Oversized'],
    signatureEra: 'Eternal Sunshine',
    featured: [
      { id: 'ari-1', title: 'Sweetener Mist', vibe: 'Pastel oversized knit', era: 'Sweetener', pieces: ['Suéter oversized', 'Bota over-the-knee', 'Mini bolsa'], gradient: 'linear-gradient(135deg,#4c1d95 0%,#a78bfa 55%,#ede9fe 100%)', likes: 612_400 },
      { id: 'ari-2', title: 'Positions Satin', vibe: 'Lingerie satin layering', era: 'Positions', pieces: ['Slip dress de cetim', 'Sobretudo longo', 'Salto fino'], gradient: 'linear-gradient(135deg,#3b0764 0%,#c084fc 60%,#fae8ff 100%)', likes: 421_050 },
    ],
  },
  {
    id: 'beyonce',
    name: 'Beyoncé',
    handle: '@beyonce',
    accent: 'rgba(251,191,36,0.85)',
    baseFollowers: 310_000_000,
    bio: 'Renaissance em forma de moda. Glamour metálico, chrome couture e referências country-disco.',
    styleTags: ['Chrome Couture', 'Glam', 'Disco', 'Statement'],
    signatureEra: 'Renaissance',
    featured: [
      { id: 'bey-1', title: 'Chrome Rodeo', vibe: 'Metallic western couture', era: 'Cowboy Carter', pieces: ['Body metálico', 'Chapéu cromado', 'Botas western'], gradient: 'linear-gradient(135deg,#451a03 0%,#f59e0b 55%,#fef3c7 100%)', likes: 733_900 },
      { id: 'bey-2', title: 'Renaissance Mirror', vibe: 'Disco mirror bodysuit', era: 'Renaissance', pieces: ['Bodysuit espelhado', 'Luvas longas', 'Plataforma'], gradient: 'linear-gradient(135deg,#1e1b4b 0%,#a855f7 55%,#fde68a 100%)', likes: 689_200 },
    ],
  },
  {
    id: 'ladygaga',
    name: 'Lady Gaga',
    handle: '@ladygaga',
    accent: 'rgba(56,189,248,0.85)',
    baseFollowers: 56_000_000,
    bio: 'Arte vestível. Do meat dress ao Harlequin — a fronteira entre performance e alta-costura.',
    styleTags: ['Avant-Garde', 'Theatrical', 'Couture', 'Concept'],
    signatureEra: 'Chromatica',
    featured: [
      { id: 'gaga-1', title: 'Harlequin Mask', vibe: 'Theatrical couture drama', era: 'Joker', pieces: ['Vestido arlequim', 'Máscara', 'Luvas de ópera'], gradient: 'linear-gradient(135deg,#0c4a6e 0%,#38bdf8 55%,#e0f2fe 100%)', likes: 356_700 },
      { id: 'gaga-2', title: 'Chromatica Steel', vibe: 'Cyber-armor statement', era: 'Chromatica', pieces: ['Armadura metálica', 'Plataforma extrema', 'Headpiece'], gradient: 'linear-gradient(135deg,#082f49 0%,#0ea5e9 60%,#bae6fd 100%)', likes: 289_300 },
    ],
  },
  {
    id: 'taylor',
    name: 'Taylor Swift',
    handle: '@taylorswift',
    accent: 'rgba(248,113,113,0.85)',
    baseFollowers: 280_000_000,
    bio: 'Moda por eras. Cada álbum, uma paleta — do folklore terroso ao sparkle bodysuit das turnês.',
    styleTags: ['Era Dressing', 'Sparkle', 'Vintage', 'Romantic'],
    signatureEra: 'The Eras Tour',
    featured: [
      { id: 'tay-1', title: 'Lover Sparkle', vibe: 'Pastel sequin bodysuit', era: 'Lover', pieces: ['Bodysuit de paetês', 'Botas brilhantes', 'Blazer pastel'], gradient: 'linear-gradient(135deg,#9d174d 0%,#fb7185 55%,#fee2e2 100%)', likes: 544_800 },
      { id: 'tay-2', title: 'Folklore Mist', vibe: 'Cottagecore knit layering', era: 'Folklore', pieces: ['Cardigã de tricô', 'Vestido midi', 'Bota de couro'], gradient: 'linear-gradient(135deg,#1c1917 0%,#78716c 60%,#e7e5e4 100%)', likes: 401_600 },
    ],
  },
];

const FOLLOW_STORAGE_KEY = 'sai-celebrity-follows';

function formatFollowers(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return String(value);
}

function formatLikes(value: number): string {
  return value.toLocaleString('pt-BR');
}

type FollowMap = Record<string, boolean>;

function readFollows(): FollowMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(FOLLOW_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FollowMap) : {};
  } catch {
    return {};
  }
}

const PremiumSeal = ({ small }: { small?: boolean }) => (
  <span
    role="img"
    aria-label="Selo Premium verificado"
    className={`inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-400/15 font-semibold text-amber-200 ${small ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'}`}
  >
    <span aria-hidden>✦</span> Selo Premium
  </span>
);

export default function ArtCelebrityView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [follows, setFollows] = useState<FollowMap>({});
  const [isPortuguese, setIsPortuguese] = useState(true);

  useEffect(() => {
    // Read persisted follow deltas after mount (keeps SSR markup stable).
    const hydrateFollows = () => setFollows(readFollows());
    hydrateFollows();
  }, []);

  useEffect(() => {
    const refresh = () => setIsPortuguese(window.localStorage.getItem('sai-site-language') !== 'en');
    refresh();
    window.addEventListener('sai-language-change', refresh as EventListener);
    return () => window.removeEventListener('sai-language-change', refresh as EventListener);
  }, []);

  const persistFollows = useCallback((next: FollowMap) => {
    setFollows(next);
    try {
      window.localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const toggleFollow = useCallback(
    (id: string) => {
      const next = { ...follows, [id]: !follows[id] };
      persistFollows(next);
    },
    [follows, persistFollows],
  );

  const followerCountFor = useCallback(
    (celeb: Celebrity) => celeb.baseFollowers + (follows[celeb.id] ? 1 : 0),
    [follows],
  );

  const selected = useMemo(() => CELEBRITIES.find((c) => c.id === selectedId) ?? null, [selectedId]);

  // ── Celebrity profile (accessible) ──
  if (selected) {
    const isFollowing = Boolean(follows[selected.id]);
    const followers = followerCountFor(selected);
    return (
      <div className="space-y-6">
        <PageHeader
          title="Art Celebrity"
          subtitle={isPortuguese ? `Perfil de ${selected.name}` : `${selected.name} profile`}
        />

        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-sm text-white/85 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-300"
        >
          <span aria-hidden>←</span> {isPortuguese ? 'Voltar ao feed' : 'Back to feed'}
        </button>

        {/* Accessible profile header */}
        <section
          aria-label={`Cabeçalho do perfil de ${selected.name}`}
          className="overflow-hidden rounded-3xl border border-white/15 p-6"
          style={{ background: `linear-gradient(135deg, ${selected.accent.replace('0.85', '0.28')} 0%, rgba(15,23,42,0.78) 60%, rgba(15,23,42,0.95) 100%)` }}
        >
          <div className="flex flex-wrap items-center gap-5">
            <div
              aria-hidden
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 text-4xl font-black text-white"
              style={{ borderColor: selected.accent, background: 'rgba(15,23,42,0.55)' }}
            >
              {selected.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{selected.name}</h1>
                <span role="img" aria-label="Conta verificada" className="text-sky-300" title="Verificado">✔</span>
                <PremiumSeal />
              </div>
              <p className="mt-0.5 text-sm text-white/60">{selected.handle} · {selected.signatureEra}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">{selected.bio}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-2" aria-live="polite">
                  <span className="text-2xl font-black text-white">{formatFollowers(followers)}</span>
                  <span className="text-xs uppercase tracking-wide text-white/55">{isPortuguese ? 'seguidores' : 'followers'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollow(selected.id)}
                  aria-pressed={isFollowing}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 ${
                    isFollowing
                      ? 'border border-white/30 bg-white/5 text-white/85 hover:bg-white/10'
                      : 'border border-fuchsia-300/70 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:brightness-110'
                  }`}
                >
                  {isFollowing ? (isPortuguese ? 'Seguindo' : 'Following') : (isPortuguese ? 'Seguir' : 'Follow')}
                </button>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Estilos da celebridade">
                {selected.styleTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full px-3 py-1 text-[11px] font-medium text-white/75"
                    style={{ border: `1px solid ${selected.accent.replace('0.85', '0.35')}`, background: selected.accent.replace('0.85', '0.10') }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Premium-seal featured schemes */}
        <SectionBlock
          title={isPortuguese ? 'Esquemas em destaque · Selo Premium' : 'Featured schemes · Premium Seal'}
          subtitle={isPortuguese ? `Looks consagrados por ${selected.name} com o selo exclusivo da celebridade.` : `Looks consecrated by ${selected.name} with the exclusive celebrity seal.`}
        >
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selected.featured.map((scheme) => (
              <article
                key={scheme.id}
                aria-label={`Esquema ${scheme.title}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5"
              >
                <div
                  className="relative flex h-36 items-end p-3"
                  style={{ background: scheme.gradient }}
                >
                  <div className="absolute right-2 top-2"><PremiumSeal small /></div>
                  <div className="rounded-lg bg-black/35 px-2.5 py-1 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-wide text-white/70">{scheme.era}</p>
                    <h3 className="text-sm font-bold text-white">{scheme.title}</h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="text-xs text-white/65">{scheme.vibe}</p>
                  <ul className="flex flex-wrap gap-1.5" aria-label="Peças do esquema">
                    {scheme.pieces.map((piece) => (
                      <li key={piece} className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[10px] text-white/70">
                        {piece}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between pt-1 text-[11px] text-white/60">
                    <span>♡ {formatLikes(scheme.likes)} {isPortuguese ? 'curtidas' : 'likes'}</span>
                    <span className="font-semibold text-amber-200">{selected.name}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionBlock>
      </div>
    );
  }

  // ── Celebrity feed ──
  return (
    <div className="space-y-6">
      <PageHeader
        title="Art Celebrity"
        subtitle={isPortuguese
          ? 'Feed de celebridades verificadas. Cada perfil reúne os looks consagrados com o Selo Premium da artista.'
          : 'Feed of verified celebrities. Each profile gathers looks consecrated with the artist\'s Premium Seal.'}
      />

      <SectionBlock
        title={isPortuguese ? 'Celebridades em destaque' : 'Featured celebrities'}
        subtitle={isPortuguese ? 'Selecione uma celebridade para ver seu perfil e esquemas premium.' : 'Select a celebrity to view their profile and premium schemes.'}
      >
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CELEBRITIES.map((celeb) => {
            const followers = followerCountFor(celeb);
            const isFollowing = Boolean(follows[celeb.id]);
            return (
              <button
                key={celeb.id}
                type="button"
                onClick={() => setSelectedId(celeb.id)}
                aria-label={`Abrir perfil de ${celeb.name}, ${formatFollowers(followers)} seguidores`}
                className="group flex flex-col gap-3 rounded-2xl border border-white/15 p-4 text-left transition hover:border-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-300"
                style={{ background: `linear-gradient(135deg, ${celeb.accent.replace('0.85', '0.22')} 0%, rgba(15,23,42,0.74) 58%, rgba(88,28,135,0.30) 100%)` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-xl font-black text-white"
                    style={{ borderColor: celeb.accent, background: 'rgba(15,23,42,0.55)' }}
                  >
                    {celeb.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-base font-bold text-white">{celeb.name}</h3>
                      <span role="img" aria-label="Conta verificada" className="text-sky-300">✔</span>
                    </div>
                    <p className="truncate text-xs text-white/55">{celeb.handle}</p>
                  </div>
                  <PremiumSeal small />
                </div>

                <p className="text-sm leading-snug text-white/70 line-clamp-2">{celeb.bio}</p>

                <div className="flex flex-wrap gap-1.5">
                  {celeb.styleTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white/65"
                      style={{ border: `1px solid ${celeb.accent.replace('0.85', '0.35')}`, background: celeb.accent.replace('0.85', '0.08') }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-white">{formatFollowers(followers)}</span>
                    <span className="text-[11px] uppercase tracking-wide text-white/50">{isPortuguese ? 'seguidores' : 'followers'}</span>
                  </div>
                  <span className="text-[11px] text-white/55">
                    {celeb.featured.length} {isPortuguese ? 'looks premium' : 'premium looks'}{isFollowing ? ' · ✓' : ''}
                  </span>
                </div>

                <span
                  className="self-start rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60 transition group-hover:text-white"
                  style={{ borderColor: celeb.accent.replace('0.85', '0.3'), background: celeb.accent.replace('0.85', '0.06') }}
                >
                  {isPortuguese ? 'Ver perfil →' : 'View profile →'}
                </span>
              </button>
            );
          })}
        </div>
      </SectionBlock>
    </div>
  );
}
