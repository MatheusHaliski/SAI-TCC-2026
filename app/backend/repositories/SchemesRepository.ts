import { CreateSchemeInput, Scheme, SchemeWithItems } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';
import { UsersRepository } from './UsersRepository';

export class SchemesRepository extends BaseRepository {
  constructor(private readonly usersRepository = new UsersRepository()) {
    super();
  }

  async create(input: CreateSchemeInput): Promise<Scheme> {
    const now = new Date().toISOString();
    const payload = {
      user_id: input.user_id,
      title: input.title,
      description: input.description ?? null,
      creation_mode: input.creation_mode,
      style: input.style,
      occasion: input.occasion,
      visibility: input.visibility,
      community_indexed: input.community_indexed ?? input.visibility === 'public',
      cover_image_url: input.cover_image_url ?? null,
      created_at: now,
      updated_at: now,
    };

    if (this.useFirestore) {
      const ref = await this.db!.collection('schemes').add(payload);
      return { scheme_id: ref.id, ...payload };
    }

    const { schemes } = this.getMockData();
    const scheme: Scheme = { scheme_id: String(schemes.length + 1), ...payload };
    schemes.push(scheme);
    return scheme;
  }

  async existsById(schemeId: string): Promise<boolean> {
    if (this.useFirestore) {
      const snap = await this.db!.collection('schemes').doc(schemeId).get();
      return snap.exists;
    }
    return this.getMockData().schemes.some((scheme) => scheme.scheme_id === schemeId);
  }

  async findPublic(): Promise<Scheme[]> {
    if (this.useFirestore) {
      const snapshot = await this.db!.collection('schemes').where('visibility', '==', 'public').get();
      return snapshot.docs.map((doc) => ({ scheme_id: doc.id, ...(doc.data() as Omit<Scheme, 'scheme_id'>) }));
    }

    return this.getMockData().schemes.filter((scheme) => scheme.visibility === 'public');
  }

  async findByIdWithItems(schemeId: string): Promise<SchemeWithItems | null> {
    if (this.useFirestore) {
      const schemeSnap = await this.db!.collection('schemes').doc(schemeId).get();
      if (!schemeSnap.exists) return null;

      const scheme = { scheme_id: schemeSnap.id, ...(schemeSnap.data() as Omit<Scheme, 'scheme_id'>) };
      const itemSnapshot = await this.db!.collection('schemes').doc(schemeId).collection('items').orderBy('sort_order', 'asc').get();

      const itemDocs = itemSnapshot.docs;
      const wardrobeRefs = await Promise.all(
        itemDocs.map((itemDoc) => this.db!.collection('wardrobe_items').doc(String(itemDoc.data().wardrobe_item_id)).get()),
      );

      const items = itemDocs.map((itemDoc, index) => {
        const wardrobe = wardrobeRefs[index].data() as Record<string, string> | undefined;
        return {
          scheme_item_id: itemDoc.id,
          scheme_id: schemeId,
          wardrobe_item_id: String(itemDoc.data().wardrobe_item_id),
          slot: itemDoc.data().slot,
          sort_order: itemDoc.data().sort_order,
          created_at: itemDoc.data().created_at,
          wardrobe_name: wardrobe?.name ?? 'Unknown',
          image_url: wardrobe?.image_url ?? '',
        };
      });

      const author = (await this.usersRepository.getById(scheme.user_id))?.name ?? 'Unknown';
      return { scheme, items, author };
    }

    const { schemes, schemeItems, wardrobeItems, users } = this.getMockData();
    const scheme = schemes.find((item) => item.scheme_id === schemeId);
    if (!scheme) return null;

    return {
      scheme,
      items: schemeItems
        .filter((item) => item.scheme_id === schemeId)
        .map((item) => {
          const wardrobe = wardrobeItems.find((w) => w.wardrobe_item_id === item.wardrobe_item_id);
          return { ...item, wardrobe_name: wardrobe?.name ?? 'Unknown', image_url: wardrobe?.image_url ?? '' };
        }),
      author: users.find((user) => user.user_id === scheme.user_id)?.name ?? 'Unknown',
    };
  }
}
