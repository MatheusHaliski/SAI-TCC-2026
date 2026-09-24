import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import {
  buildIdentityPhrase,
  computeCamada1,
  computeDnaMarkers,
  DNA_MIN_LOOKS,
  DNA_MIN_PIECES,
  emptyLife,
  StyleDnaLife,
} from '@/app/lib/style-dna';
import { NextResponse } from 'next/server';

const wardrobeRepository = new WardrobeItemsRepository();
const schemesRepository = new SchemesRepository();
const schemeItemsRepository = new SchemeItemsRepository();

const DNA_DOC = (userId: string) =>
  getAdminFirestore().collection(COLLECTIONS.USERS).doc(userId).collection('styleDNA').doc('current');

const LIFE_LIMITS: Record<keyof Omit<StyleDnaLife, 'hidden'>, number> = {
  lugares: 3,
  pessoas: 3,
  animais: 2,
  objetos: 4,
};

function sanitizeList(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v).trim().slice(0, 30)) // RN05: 30 chars per entry
    .filter(Boolean)
    .slice(0, limit);
}

async function loadLife(userId: string): Promise<StyleDnaLife> {
  const snap = await DNA_DOC(userId).get();
  if (!snap.exists) return emptyLife();
  const data = snap.data() as Partial<StyleDnaLife> | undefined;
  return {
    lugares: sanitizeList(data?.lugares, LIFE_LIMITS.lugares),
    pessoas: sanitizeList(data?.pessoas, LIFE_LIMITS.pessoas),
    animais: sanitizeList(data?.animais, LIFE_LIMITS.animais),
    objetos: sanitizeList(data?.objetos, LIFE_LIMITS.objetos),
    hidden: Array.isArray(data?.hidden) ? data!.hidden!.map(String) : [],
  };
}

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const [autopilotItems, schemes] = await Promise.all([
    wardrobeRepository.findRichForAutopilot(userId),
    schemesRepository.findByUser(userId),
  ]);

  const wardrobe = autopilotItems.map((i) => ({
    wardrobe_item_id: i.wardrobe_item_id,
    name: i.name,
    piece_type: i.piece_type,
    color: i.color,
    style_tags: i.style_tags ?? [],
    image_url: i.image_url,
    brand: i.brand,
  }));

  const usage = await schemeItemsRepository.getUsageByWardrobeItemIds(wardrobe.map((w) => w.wardrobe_item_id));
  const life = await loadLife(userId);
  const camada1 = computeCamada1(wardrobe, schemes, usage);
  const identityPhrase = buildIdentityPhrase(camada1, life);
  const markers = computeDnaMarkers(wardrobe, usage);

  const pieces = wardrobe.length;
  const looks = schemes.length;

  return NextResponse.json({
    ok: true,
    prerequisitesMet: pieces >= DNA_MIN_PIECES && looks >= DNA_MIN_LOOKS,
    progress: {
      pieces,
      looks,
      neededPieces: Math.max(0, DNA_MIN_PIECES - pieces),
      neededLooks: Math.max(0, DNA_MIN_LOOKS - looks),
      minPieces: DNA_MIN_PIECES,
      minLooks: DNA_MIN_LOOKS,
    },
    dna: { camada1, life, identityPhrase, markers },
  });
}

// HU20 Critério 4/7: save the life identity (Camada 2) and per-field visibility.
export async function PUT(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const incoming = (body?.life ?? {}) as Partial<StyleDnaLife>;
    const validHidden = new Set(['lugares', 'pessoas', 'animais', 'objetos']);

    const life: StyleDnaLife = {
      lugares: sanitizeList(incoming.lugares, LIFE_LIMITS.lugares),
      pessoas: sanitizeList(incoming.pessoas, LIFE_LIMITS.pessoas),
      animais: sanitizeList(incoming.animais, LIFE_LIMITS.animais),
      objetos: sanitizeList(incoming.objetos, LIFE_LIMITS.objetos),
      hidden: Array.isArray(incoming.hidden) ? incoming.hidden.map(String).filter((k) => validHidden.has(k)) : [],
    };

    await DNA_DOC(userId).set({ ...life, updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true, life });
  } catch {
    return NextResponse.json({ error: 'Unable to save style DNA' }, { status: 500 });
  }
}
