import { CreateSchemeInput, Scheme, SchemeVisibility, SchemeWithItems } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';
import { UsersRepository } from './UsersRepository';

const SCHEMES_COLLECTION = 'saiUserSavedSchemes';
const SCHEME_ITEMS_COLLECTION = 'saiSchemeItems';
const WARDROBE_ITEMS_COLLECTION = 'saiWardrobeItems';

const toReadableSuggestedName = (input: string) => {
  const [, , slug = 'selected-piece'] = input.split(':');
  return slug
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean)
    .map((token) => `${token[0]?.toUpperCase() ?? ''}${token.slice(1)}`)
    .join(' ');
};

export class SchemesRepository extends BaseRepository {
  constructor(private readonly usersRepository = new UsersRepository()) {
    super();
  }

  async create(input: CreateSchemeInput): Promise<Scheme> {
    const now = new Date().toISOString();
    const payload: Omit<Scheme, 'scheme_id'> = {
      user_id: input.user_id,
      title: input.title,
      description: input.description ?? null,
      creation_mode: input.creation_mode,
      style: input.style,
      occasion: input.occasion,
      visibility: input.visibility,
      community_indexed: input.community_indexed ?? false,
      cover_image_url: input.cover_image_url ?? null,
      pieces: input.pieces ?? [],
      seal_tier: input.seal_tier ?? 'none',
      celebrity_tribute: null,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await this.db.collection(SCHEMES_COLLECTION).add(payload);
    return { scheme_id: ref.id, ...payload };
  }

  async existsById(schemeId: string): Promise<boolean> {
    const snap = await this.db.collection(SCHEMES_COLLECTION).doc(schemeId).get();
    return snap.exists;
  }

  async findById(schemeId: string): Promise<Scheme | null> {
    const snap = await this.db.collection(SCHEMES_COLLECTION).doc(schemeId).get();
    if (!snap.exists) return null;
    return { scheme_id: snap.id, ...(snap.data() as Omit<Scheme, 'scheme_id'>) };
  }

  async updateVisibility(schemeId: string, visibility: SchemeVisibility): Promise<void> {
    await this.db.collection(SCHEMES_COLLECTION).doc(schemeId).set(
      { visibility, updatedAt: new Date().toISOString() },
      { merge: true },
    );
  }

  async findPublic(): Promise<Scheme[]> {
    const snapshot = await this.db.collection(SCHEMES_COLLECTION).where('visibility', '==', 'public').get();
    return snapshot.docs.map((doc) => ({ scheme_id: doc.id, ...(doc.data() as Omit<Scheme, 'scheme_id'>) }));
  }

  async findByUser(userId: string): Promise<Scheme[]> {
    const snapshot = await this.db
      .collection(SCHEMES_COLLECTION)
      .where('user_id', '==', userId)
      .get();
    const legacySnapshot = await this.db
      .collection(SCHEMES_COLLECTION)
      .where('userId', '==', userId)
      .get()
      .catch(() => null);

    const mergedDocs = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
    for (const doc of snapshot.docs) mergedDocs.set(doc.id, doc);
    for (const doc of legacySnapshot?.docs ?? []) mergedDocs.set(doc.id, doc);

    return Array.from(mergedDocs.values())
      .map((doc) => ({
        scheme_id: doc.id,
        ...(doc.data() as Omit<Scheme, 'scheme_id'>),
      }))
      .sort((a, b) => {
        const aTime = Date.parse(a.createdAt ?? '') || 0;
        const bTime = Date.parse(b.createdAt ?? '') || 0;
        return bTime - aTime;
      });
  }

  async findByIdWithItems(schemeId: string): Promise<SchemeWithItems | null> {
    const schemeSnap = await this.db.collection(SCHEMES_COLLECTION).doc(schemeId).get();
    if (!schemeSnap.exists) return null;

    const scheme = { scheme_id: schemeSnap.id, ...(schemeSnap.data() as Omit<Scheme, 'scheme_id'>) };
    const itemSnapshot = await this.db
      .collection(SCHEME_ITEMS_COLLECTION)
      .where('scheme_id', '==', schemeId)
      .orderBy('sort_order', 'asc')
      .get();

    const itemDocs = itemSnapshot.docs;
    const wardrobeRefs = await Promise.all(
      itemDocs.map((itemDoc) => this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(String(itemDoc.data().wardrobe_item_id)).get()),
    );

    const items = itemDocs.map((itemDoc, index) => {
      const wardrobeItemId = String(itemDoc.data().wardrobe_item_id);
      const isSuggested = wardrobeItemId.startsWith('suggested:');
      const wardrobe = wardrobeRefs[index].data() as Record<string, string> | undefined;
      return {
        scheme_item_id: itemDoc.id,
        scheme_id: schemeId,
        wardrobe_item_id: wardrobeItemId,
        slot: itemDoc.data().slot,
        sort_order: itemDoc.data().sort_order,
        createdAt: itemDoc.data().createdAt,
        wardrobe_name: wardrobe?.name ?? (isSuggested ? toReadableSuggestedName(wardrobeItemId) : 'Selected piece'),
        image_url: wardrobe?.image_url ?? '',
      };
    });

    const author = (await this.usersRepository.getById(scheme.user_id))?.name ?? 'Unknown';
    return { scheme, items, author };
  }

  /**
   * RF: Marcas — public schemes from users with an active premium seal,
   * created or updated during the current calendar month.
   */
  async findPremiumThisMonth(): Promise<Array<Scheme & { author: string }>> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const snapshot = await this.db
      .collection(SCHEMES_COLLECTION)
      .where('visibility', '==', 'public')
      .where('seal_tier', '==', 'premium')
      .get();

    const schemes = snapshot.docs
      .map((doc) => ({ scheme_id: doc.id, ...(doc.data() as Omit<Scheme, 'scheme_id'>) }))
      .filter((scheme) => (scheme.updatedAt ?? scheme.createdAt ?? '') >= monthStart);

    const authors = await Promise.all(schemes.map((scheme) => this.usersRepository.getById(scheme.user_id)));
    return schemes.map((scheme, index) => ({ ...scheme, author: authors[index]?.name ?? 'Unknown' }));
  }

  /**
   * RF: Tributos — public schemes whose celebrity tribute was accepted
   * during the current calendar month, for the celebrity feed.
   */
  async findCelebrityFeedThisMonth(): Promise<Array<Scheme & { author: string }>> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const snapshot = await this.db
      .collection(SCHEMES_COLLECTION)
      .where('visibility', '==', 'public')
      .get();

    const schemes = snapshot.docs
      .map((doc) => ({ scheme_id: doc.id, ...(doc.data() as Omit<Scheme, 'scheme_id'>) }))
      .filter((scheme) => scheme.celebrity_tribute?.awarded_at && scheme.celebrity_tribute.awarded_at >= monthStart);

    const authors = await Promise.all(schemes.map((scheme) => this.usersRepository.getById(scheme.user_id)));
    return schemes.map((scheme, index) => ({ ...scheme, author: authors[index]?.name ?? 'Unknown' }));
  }

  /**
   * RF: Tributos — all public schemes that ever received an accepted
   * celebrity tribute, for the "search by celebrity" tab.
   */
  async findCelebrityTributedSchemes(): Promise<Array<Scheme & { author: string }>> {
    const snapshot = await this.db
      .collection(SCHEMES_COLLECTION)
      .where('visibility', '==', 'public')
      .get();

    const schemes = snapshot.docs
      .map((doc) => ({ scheme_id: doc.id, ...(doc.data() as Omit<Scheme, 'scheme_id'>) }))
      .filter((scheme) => Boolean(scheme.celebrity_tribute?.celebrity_name));

    const authors = await Promise.all(schemes.map((scheme) => this.usersRepository.getById(scheme.user_id)));
    return schemes.map((scheme, index) => ({ ...scheme, author: authors[index]?.name ?? 'Unknown' }));
  }

  async assignCelebrityTribute(schemeId: string, celebrityName: string): Promise<void> {
    await this.db.collection(SCHEMES_COLLECTION).doc(schemeId).set(
      {
        celebrity_tribute: { celebrity_name: celebrityName, awarded_at: new Date().toISOString() },
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }
}
