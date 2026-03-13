import { BaseRepository } from './BaseRepository';

export class BrandsRepository extends BaseRepository {
  async listActive(): Promise<Brand[]> {
    if (this.useFirestore) {
      const snapshot = await this.db!.collection('brands').where('is_active', '==', true).get();
      return snapshot.docs.map((doc) => ({ brand_id: doc.id, ...(doc.data() as Omit<Brand, 'brand_id'>) }));
    }

    return this.getMockData().brands.filter((brand) => brand.is_active);
  }

  async existsById(brandId: string): Promise<boolean> {
    if (this.useFirestore) {
      const snap = await this.db!.collection('brands').doc(brandId).get();
      return snap.exists;
    }
    return this.getMockData().brands.some((brand) => brand.brand_id === brandId);
  }

  async getNameMap(): Promise<Map<string, string>> {
    const active = await this.listActive();
    return new Map(active.map((brand) => [brand.brand_id, brand.name]));
  }
}
