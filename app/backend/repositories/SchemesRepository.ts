import { Scheme } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

export class SchemesRepository extends BaseRepository {
  async getById(schemeId: string): Promise<Scheme | null> {
    const snap = await this.db().collection('schemes').doc(schemeId).get();
    if (!snap.exists) return null;
    return { scheme_id: snap.id, ...(snap.data() as Omit<Scheme, 'scheme_id'>) };
  }

  async create(input: Omit<Scheme, 'scheme_id' | 'created_at' | 'updated_at'> & { scheme_id?: string }): Promise<Scheme> {
    const ref = input.scheme_id ? this.db().collection('schemes').doc(input.scheme_id) : this.db().collection('schemes').doc();
    const now = this.nowIso();
    const payload: Omit<Scheme, 'scheme_id'> = {
      user_id: input.user_id,
      title: input.title,
      description: input.description,
      creation_mode: input.creation_mode,
      style: input.style,
      occasion: input.occasion,
      visibility: input.visibility,
      community_indexed: input.community_indexed,
      cover_image_url: input.cover_image_url,
      created_at: now,
      updated_at: now,
    };
    await ref.set(payload);
    return { scheme_id: ref.id, ...payload };
  }

  async findPublic(): Promise<Scheme[]> {
    const query = await this.db().collection('schemes').where('visibility', '==', 'public').get();
    return query.docs.map((doc) => ({ scheme_id: doc.id, ...(doc.data() as Omit<Scheme, 'scheme_id'>) }));
  }
}
