import { Brand } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

const BRANDS_COLLECTION = 'sai-brands';

export class BrandsRepository extends BaseRepository {
  async listActive(): Promise<Brand[]> {
    const snapshot = await this.db.collection(BRANDS_COLLECTION).where('is_active', '==', true).get();
    return snapshot.docs.map((doc) => ({ brand_id: doc.id, ...(doc.data() as Omit<Brand, 'brand_id'>) }));
  }


  async getById(brandId: string): Promise<Brand | null> {
    const snap = await this.db.collection(BRANDS_COLLECTION).doc(brandId).get();
    if (!snap.exists) return null;
    return { brand_id: snap.id, ...(snap.data() as Omit<Brand, 'brand_id'>) };
  }

  async existsById(brandId: string): Promise<boolean> {
    const snap = await this.db.collection(BRANDS_COLLECTION).doc(brandId).get();
    return snap.exists;
  }

  async getNameMap(): Promise<Map<string, string>> {
    const active = await this.listActive();
    return new Map(active.map((brand) => [brand.brand_id, brand.name]));
  }
}
