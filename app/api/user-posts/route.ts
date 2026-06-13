import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';

const COLLECTION = 'sai-userPosts';
const FREE_SEAL_PUBLISH_THRESHOLD = 50;

/**
 * RF: after publishing more than FREE_SEAL_PUBLISH_THRESHOLD times a scheme
 * carrying a free brand seal, the user is automatically upgraded to the
 * premium seal and notified in the UI.
 */
async function maybeUpgradeToPremiumSeal(db: FirebaseFirestore.Firestore, userId: string, schemeId?: string) {
  if (!schemeId) return false;

  const schemeSnap = await db.collection(COLLECTIONS.USER_SAVED_SCHEMES).doc(schemeId).get();
  if (!schemeSnap.exists) return false;
  if ((schemeSnap.data()?.seal_tier ?? 'none') !== 'free') return false;

  const userSnap = await db.collection(COLLECTIONS.USERS).doc(userId).get();
  if ((userSnap.data()?.brandSealTier ?? 'none') === 'premium') return false;

  const publishedSnapshot = await db
    .collection(COLLECTION)
    .where('user_id', '==', userId)
    .where('status', '==', 'published')
    .get();

  const schemeIds = Array.from(new Set(
    publishedSnapshot.docs
      .map((doc) => doc.data().scheme_id as string | undefined)
      .filter((value): value is string => Boolean(value)),
  ));

  const schemeDocs = await Promise.all(schemeIds.map((id) => db.collection(COLLECTIONS.USER_SAVED_SCHEMES).doc(id).get()));
  const freeSchemeIds = new Set(
    schemeDocs.filter((doc) => (doc.data()?.seal_tier ?? 'none') === 'free').map((doc) => doc.id),
  );

  const freePublishCount = publishedSnapshot.docs.filter((doc) => freeSchemeIds.has(doc.data().scheme_id)).length;
  if (freePublishCount <= FREE_SEAL_PUBLISH_THRESHOLD) return false;

  const now = new Date().toISOString();
  const sealPayload = {
    user_id: userId,
    seal_tier: 'premium' as const,
    status: 'active' as const,
    label: 'Selo Premium',
    official_feed_eligible: true,
    official_feed_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Concedido automaticamente por engajamento: mais de 50 publicações com selo gratuito.',
    updatedAt: now,
    createdAt: now,
  };

  await db.collection(COLLECTIONS.BRAND_SEALS).doc(userId).set(sealPayload, { merge: true });
  await db.collection(COLLECTIONS.USERS).doc(userId).set(
    {
      brandSealTier: 'premium',
      brandSealStatus: 'active',
      officialFeedEligible: true,
      officialFeedUntil: sealPayload.official_feed_until,
      updatedAt: now,
    },
    { merge: true },
  );

  await db.collection(COLLECTIONS.NOTIFICATIONS).add({
    user_id: userId,
    actor_id: 'sai-brand-seals',
    type: 'premium_seal_awarded',
    title: 'Você recebeu o Selo Premium!',
    body: 'Suas publicações com o selo gratuito geraram engajamento suficiente. O Selo Premium já está disponível em Criar Look.',
    is_read: false,
    createdAt: now,
  });

  return true;
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')?.trim();
  if (!userId) return NextResponse.json({ error: 'user_id is required' }, { status: 400 });

  const db = getAdminFirestore();
  const snapshot = await db.collection(COLLECTION).where('user_id', '==', userId).orderBy('createdAt', 'desc').get();
  const posts = snapshot.docs.map((doc) => ({ post_id: doc.id, ...doc.data() }));
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.user_id || !body?.outfit_id || !body?.title) {
    return NextResponse.json({ error: 'Missing post payload fields' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const db = getAdminFirestore();
  const record = {
    user_id: String(body.user_id),
    outfit_id: String(body.outfit_id),
    scheme_id: body.scheme_id ? String(body.scheme_id) : undefined,
    title: String(body.title),
    caption: String(body.caption || ''),
    platforms: Array.isArray(body.platforms) ? body.platforms.map(String) : ['internal'],
    primary_platform: String(body.primary_platform || 'internal'),
    status: body.status || 'draft',
    preview_image_url: String(body.preview_image_url || '/welcome-newcomers.png'),
    export_image_url: body.export_image_url ? String(body.export_image_url) : undefined,
    visibility: body.visibility || 'private',
    platform_metadata: body.platform_metadata || {},
    createdAt: now,
    updatedAt: now,
    published_at: body.published_at ? String(body.published_at) : undefined,
  };

  const created = await db.collection(COLLECTION).add(record);

  let premium_seal_awarded = false;
  if (record.status === 'published') {
    premium_seal_awarded = await maybeUpgradeToPremiumSeal(db, record.user_id, record.scheme_id);
  }

  return NextResponse.json({ post_id: created.id, ...record, premium_seal_awarded }, { status: 201 });
}
