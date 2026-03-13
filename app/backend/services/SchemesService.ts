import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';
import { UsersRepository } from '@/app/backend/repositories/UsersRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { CreateSchemeInput, SchemeWithItems } from '@/app/backend/types/entities';

export class SchemesService {
  constructor(
    private readonly schemesRepo = new SchemesRepository(),
    private readonly schemeItemsRepo = new SchemeItemsRepository(),
    private readonly usersRepo = new UsersRepository(),
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
  ) {}

  private async validateCreateInput(input: CreateSchemeInput) {
    const user = await this.usersRepo.getById(input.user_id);
    if (!user) throw new Error('Invalid user_id reference');

    await Promise.all(
      input.items.map(async (item) => {
        const wardrobe = await this.wardrobeRepo.getById(item.wardrobe_item_id);
        if (!wardrobe) throw new Error(`Invalid wardrobe_item_id reference: ${item.wardrobe_item_id}`);
      }),
    );
  }

  async createManualScheme(input: CreateSchemeInput) {
    await this.validateCreateInput(input);

    const scheme = await this.schemesRepo.create({
      user_id: input.user_id,
      title: input.title,
      description: input.description ?? null,
      creation_mode: 'manual',
      style: input.style,
      occasion: input.occasion,
      visibility: input.visibility,
      community_indexed: input.community_indexed ?? input.visibility === 'public',
      cover_image_url: input.cover_image_url ?? null,
    });

    const items = await this.schemeItemsRepo.createMany(
      input.items.map((item) => ({ ...item, scheme_id: scheme.scheme_id })),
    );

    return { scheme, items };
  }

  async createAiScheme(input: CreateSchemeInput) {
    const aiSuggestedItems = input.items.length
      ? input.items
      : [
          { wardrobe_item_id: 'wardrobe_demo_upper', slot: 'upper' as const, sort_order: 1 },
          { wardrobe_item_id: 'wardrobe_demo_lower', slot: 'lower' as const, sort_order: 2 },
          { wardrobe_item_id: 'wardrobe_demo_shoes', slot: 'shoes' as const, sort_order: 3 },
        ];

    await this.validateCreateInput({ ...input, items: aiSuggestedItems });

    const scheme = await this.schemesRepo.create({
      user_id: input.user_id,
      title: input.title,
      description: input.description ?? null,
      creation_mode: 'ai',
      style: input.style,
      occasion: input.occasion,
      visibility: input.visibility,
      community_indexed: input.community_indexed ?? input.visibility === 'public',
      cover_image_url: input.cover_image_url ?? null,
    });

    const items = await this.schemeItemsRepo.createMany(
      aiSuggestedItems.map((item) => ({ ...item, scheme_id: scheme.scheme_id })),
    );

    return { scheme, items, ai_note: 'AI mock applied a balanced smart-casual composition.' };
  }

  async listPublicSchemes() {
    return this.schemesRepo.findPublic();
  }

  async getSchemeDetails(schemeId: string): Promise<SchemeWithItems | null> {
    const scheme = await this.schemesRepo.getById(schemeId);
    if (!scheme) return null;

    const author = await this.usersRepo.getById(scheme.user_id);
    const items = await this.schemeItemsRepo.findBySchemeId(schemeId);

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const wardrobe = await this.wardrobeRepo.getById(item.wardrobe_item_id);
        return {
          ...item,
          wardrobe_name: wardrobe?.name ?? 'Unknown',
          image_url: wardrobe?.image_url ?? '',
        };
      }),
    );

    return {
      scheme,
      items: enrichedItems,
      author: author?.name ?? 'Unknown',
    };
  }
}
