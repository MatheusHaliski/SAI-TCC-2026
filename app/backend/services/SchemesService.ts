import { CreateSchemeInput } from '@/app/backend/types/entities';
import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';

export class SchemesService {
  constructor(
    private readonly schemesRepo = new SchemesRepository(),
    private readonly schemeItemsRepo = new SchemeItemsRepository(),
  ) {}

  async createManualScheme(input: CreateSchemeInput) {
    const scheme = await this.schemesRepo.create({ ...input, creation_mode: 'manual' });
    const items = await this.schemeItemsRepo.createMany(
      input.items.map((item) => ({ ...item, scheme_id: scheme.scheme_id })),
    );

    return { scheme, items };
  }

  async createAiScheme(input: CreateSchemeInput) {
    const aiSuggestedItems = input.items.length
      ? input.items
      : [
          { wardrobe_item_id: 1, slot: 'upper' as const, sort_order: 1 },
          { wardrobe_item_id: 3, slot: 'lower' as const, sort_order: 2 },
          { wardrobe_item_id: 4, slot: 'shoes' as const, sort_order: 3 },
        ];

    const scheme = await this.schemesRepo.create({ ...input, creation_mode: 'ai', items: aiSuggestedItems });
    const items = await this.schemeItemsRepo.createMany(
      aiSuggestedItems.map((item) => ({ ...item, scheme_id: scheme.scheme_id })),
    );

    return { scheme, items, ai_note: 'AI mock applied a balanced smart-casual composition.' };
  }

  async listPublicSchemes() {
    return this.schemesRepo.findPublic();
  }

  async getSchemeDetails(schemeId: number) {
    return this.schemesRepo.findByIdWithItems(schemeId);
  }
}
