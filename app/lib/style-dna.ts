// HU20 — DNA de Estilo. Pure, deterministic computation of "Camada 1" (fashion
// identity inferred from the user's wardrobe + outfits) and the synthesis of the
// identity phrase that ties it to "Camada 2" (life identity declared by the user).
// The phrase synthesis is intentionally local/deterministic so the feature works
// without an LLM key; it can later be upgraded to an LLM call (see HU20 notes).

export interface StyleDnaLife {
  lugares: string[];
  pessoas: string[];
  animais: string[];
  objetos: string[];
  /** Camada-2 field keys the user marked private (excluded from shared cards). */
  hidden?: string[];
}

export interface StyleDnaPaletteColor {
  name: string;
  hex: string;
}

export interface StyleDnaCamada1 {
  archetype: string;
  palette: StyleDnaPaletteColor[];
  silhouette: string;
  boldnessIndex: number;
  iconPiece: { name: string; pieceType: string; imageUrl: string } | null;
}

export interface StyleDna {
  camada1: StyleDnaCamada1;
  life: StyleDnaLife;
  identityPhrase: string;
}

export interface DnaWardrobeItem {
  wardrobe_item_id: string;
  name: string;
  piece_type: string;
  color: string;
  style_tags: string[];
  image_url?: string;
}

export interface DnaScheme {
  style?: string;
  occasion?: string;
}

// RN01: controlled vocabulary (≤20 archetypes).
const ARCHETYPES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Minimalista Urbano', keywords: ['minimal', 'clean', 'urban', 'urbano', 'básico', 'neutro'] },
  { label: 'Streetwear Clássico', keywords: ['street', 'hype', 'oversized', 'sneaker', 'cap', 'hood'] },
  { label: 'Boho Romântico', keywords: ['boho', 'romant', 'flor', 'floral', 'flow', 'leve'] },
  { label: 'Esportivo Performance', keywords: ['sport', 'esport', 'perform', 'athle', 'gym', 'run'] },
  { label: 'Elegância Clássica', keywords: ['eleg', 'classic', 'clássic', 'formal', 'sobrio'] },
  { label: 'Glam Noturno', keywords: ['glam', 'night', 'noturn', 'brilho', 'festa', 'party'] },
  { label: 'Casual Despojado', keywords: ['casual', 'despoj', 'daily', 'dia', 'relax'] },
  { label: 'Vintage Retrô', keywords: ['vintage', 'retro', 'retrô', 'anos', 'old'] },
  { label: 'Tech Futurista', keywords: ['tech', 'futur', 'neon', 'metallic', 'digital'] },
  { label: 'Alfaiataria Moderna', keywords: ['alfaiat', 'tailor', 'blaz', 'suit', 'terno'] },
  { label: 'Athleisure', keywords: ['athleisure', 'legging', 'jogger', 'comfort', 'confort'] },
  { label: 'Denim Lover', keywords: ['denim', 'jean', 'jeans'] },
  { label: 'Maximalista Eclético', keywords: ['maxim', 'eclet', 'color', 'mix', 'print', 'estampa'] },
  { label: 'Preppy Refinado', keywords: ['preppy', 'refin', 'polo', 'náutic', 'listr'] },
  { label: 'Romântico Pastel', keywords: ['pastel', 'soft', 'delic', 'romântic'] },
];

const COLOR_HEX: Record<string, string> = {
  preto: '#111827', black: '#111827',
  branco: '#f8fafc', white: '#f8fafc',
  cinza: '#9ca3af', gray: '#9ca3af', grey: '#9ca3af',
  azul: '#3b82f6', blue: '#3b82f6',
  vermelho: '#ef4444', red: '#ef4444',
  verde: '#22c55e', green: '#22c55e',
  amarelo: '#eab308', yellow: '#eab308',
  rosa: '#ec4899', pink: '#ec4899',
  roxo: '#8b5cf6', purple: '#8b5cf6', lilás: '#a78bfa',
  marrom: '#92400e', brown: '#92400e',
  bege: '#d6c7a1', beige: '#d6c7a1', nude: '#e3c9b6',
  laranja: '#f97316', orange: '#f97316',
  dourado: '#d4af37', gold: '#d4af37',
  prata: '#cbd5e1', silver: '#cbd5e1',
};

const ACCESSORY_RE = /sock|meia|belt|cinto|cap|boné|hat|chapéu|scarf|cachecol|glove|luva|accessor|acess/i;

const tokenize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/i).filter(Boolean);

function pickArchetype(signals: string[]): string {
  const haystack = signals.join(' ').toLowerCase();
  let best = 'Casual Despojado';
  let bestScore = 0;
  for (const arch of ARCHETYPES) {
    const score = arch.keywords.reduce((acc, kw) => acc + (haystack.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = arch.label;
    }
  }
  return best;
}

function buildPalette(items: DnaWardrobeItem[]): StyleDnaPaletteColor[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const color = (item.color || '').trim().toLowerCase();
    if (!color) continue;
    counts.set(color, (counts.get(color) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      hex: COLOR_HEX[name] ?? '#64748b',
    }));
}

function deriveSilhouette(styleTagText: string): string {
  const t = styleTagText.toLowerCase();
  if (/oversized|baggy|amplo|solto/.test(t)) return 'Oversized';
  if (/fitted|slim|justo|ajustad/.test(t)) return 'Justa / Fitted';
  if (/layer|sobrepos|camada/.test(t)) return 'Layering';
  return 'Equilibrada';
}

export function computeCamada1(
  items: DnaWardrobeItem[],
  schemes: DnaScheme[],
  usage: Record<string, { count: number; lastUsedAt: string | null }>,
): StyleDnaCamada1 {
  const styleSignals = [
    ...items.flatMap((i) => i.style_tags ?? []),
    ...items.map((i) => i.piece_type ?? ''),
    ...schemes.map((s) => `${s.style ?? ''} ${s.occasion ?? ''}`),
  ];

  const archetype = pickArchetype(styleSignals);
  const palette = buildPalette(items);
  const silhouette = deriveSilhouette(styleSignals.join(' '));

  // Índice de Ousadia (0–100): diversity of colors and styles vs. closet size.
  const distinctColors = new Set(items.map((i) => (i.color || '').trim().toLowerCase()).filter(Boolean)).size;
  const distinctStyles = new Set(items.flatMap((i) => (i.style_tags ?? []).map((t) => t.toLowerCase()))).size;
  const boldnessIndex = Math.max(0, Math.min(100, Math.round(distinctColors * 9 + distinctStyles * 7)));

  // Peça Ícone: most-used non-accessory piece (RN04).
  let iconPiece: StyleDnaCamada1['iconPiece'] = null;
  let bestCount = -1;
  for (const item of items) {
    if (ACCESSORY_RE.test(`${item.piece_type} ${item.name}`)) continue;
    const count = usage[item.wardrobe_item_id]?.count ?? 0;
    if (count > bestCount) {
      bestCount = count;
      iconPiece = { name: item.name, pieceType: item.piece_type, imageUrl: item.image_url ?? '' };
    }
  }

  return { archetype, palette, silhouette, boldnessIndex, iconPiece };
}

function joinNatural(values: string[]): string {
  const clean = values.map((v) => v.trim()).filter(Boolean);
  if (clean.length === 0) return '';
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(', ')} e ${clean[clean.length - 1]}`;
}

/** RN07: hidden Camada-2 fields still influence the phrase but are referenced generically. */
export function buildIdentityPhrase(camada1: StyleDnaCamada1, life: StyleDnaLife): string {
  const parts: string[] = [];
  parts.push(camada1.archetype);

  if (camada1.iconPiece?.name) {
    parts.push(`que tem ${camada1.iconPiece.name.toLowerCase()} como assinatura`);
  }
  if (camada1.palette.length) {
    parts.push(`em tons de ${joinNatural(camada1.palette.slice(0, 3).map((c) => c.name.toLowerCase()))}`);
  }

  const hidden = new Set(life.hidden ?? []);
  const lifeClauses: string[] = [];
  if (!hidden.has('objetos') && life.objetos?.length) lifeClauses.push(`vive entre ${joinNatural(life.objetos.slice(0, 2))}`);
  if (!hidden.has('animais') && life.animais?.length) lifeClauses.push(`cuida de ${joinNatural(life.animais.slice(0, 2))}`);
  if (!hidden.has('pessoas') && life.pessoas?.length) lifeClauses.push(`anda com ${joinNatural(life.pessoas.slice(0, 2))}`);
  if (!hidden.has('lugares') && life.lugares?.length) lifeClauses.push(`tem ${joinNatural(life.lugares.slice(0, 2))} no horizonte`);

  let phrase = parts.join(', ');
  if (lifeClauses.length) phrase += `, que ${joinNatural(lifeClauses)}`;
  return `${phrase.charAt(0).toUpperCase()}${phrase.slice(1)}.`;
}

export const emptyLife = (): StyleDnaLife => ({ lugares: [], pessoas: [], animais: [], objetos: [], hidden: [] });

// HU20 Critério 1/3 prerequisites.
export const DNA_MIN_PIECES = 10;
export const DNA_MIN_LOOKS = 5;

export { tokenize as dnaTokenize };
