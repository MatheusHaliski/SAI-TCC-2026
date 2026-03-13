import { Brand } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

export class BrandsRepository extends BaseRepository {
  async getById(brandId: string): Promise<Brand | null> {
    const snap = await this.db().collection('brands').doc(brandId).get();
    if (!snap.exists) return null;
    return { brand_id: snap.id, ...(snap.data() as Omit<Brand, 'brand_id'>) };
  }

  async listActive(): Promise<Brand[]> {
    const query = await this.db().collection('brands').where('is_active', '==', true).get();
    return query.docs.map((doc) => ({ brand_id: doc.id, ...(doc.data() as Omit<Brand, 'brand_id'>) }));
  }
}
