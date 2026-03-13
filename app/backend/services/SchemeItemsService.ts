import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';

export class SchemeItemsService {
  constructor(
    private readonly schemeItemsRepo = new SchemeItemsRepository(),
    private readonly schemesRepo = new SchemesRepository(),
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
  ) {}

  async createMany(items: Array<{ scheme_id: string; wardrobe_item_id: string; slot: 'upper' | 'lower' | 'shoes' | 'accessory'; sort_order: number }>) {
    await Promise.all(
      items.map(async (item) => {
        const [scheme, wardrobe] = await Promise.all([
          this.schemesRepo.getById(item.scheme_id),
          this.wardrobeRepo.getById(item.wardrobe_item_id),
        ]);

        if (!scheme) throw new Error(`Invalid scheme_id reference: ${item.scheme_id}`);
        if (!wardrobe) throw new Error(`Invalid wardrobe_item_id reference: ${item.wardrobe_item_id}`);
      }),
    );

    return this.schemeItemsRepo.createMany(items);
  }
}
