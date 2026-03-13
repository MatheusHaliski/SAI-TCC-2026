import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';

export class SchemeItemsController {
  constructor(private readonly schemeItemsRepository = new SchemeItemsRepository()) {}

  async createMany(items: Array<{ scheme_id: number; wardrobe_item_id: number; slot: 'upper' | 'lower' | 'shoes' | 'accessory'; sort_order: number }>) {
    return this.schemeItemsRepository.createMany(items);
  }
}
