import { FollowsRepository } from '@/app/backend/repositories/FollowsRepository';
import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { CreateSchemeInput, SchemeVisibility } from '@/app/backend/types/entities';
import { ServiceError } from './errors';

const VALID_VISIBILITIES: SchemeVisibility[] = ['private', 'followers', 'public'];

export class SchemesService {
  constructor(
    private readonly schemesRepo = new SchemesRepository(),
    private readonly schemeItemsRepo = new SchemeItemsRepository(),
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly followsRepo = new FollowsRepository(),
  ) {}

  private async validateReferences(input: CreateSchemeInput) {
    for (const item of input.items) {
      if (item.wardrobe_item_id.startsWith('suggested:')) continue;

      const exists = await this.wardrobeRepo.existsById(item.wardrobe_item_id);
      if (!exists) throw new ServiceError(`Wardrobe item ${item.wardrobe_item_id} not found`, 404);
    }
  }

  async createManualScheme(input: CreateSchemeInput) {
    await this.validateReferences(input);
    const scheme = await this.schemesRepo.create({ ...input, creation_mode: 'manual' });
    const items = await this.schemeItemsRepo.createMany(input.items.map((item) => ({ ...item, scheme_id: scheme.scheme_id })));
    return { scheme, items };
  }

  async createAiScheme(input: CreateSchemeInput) {
    const aiSuggestedItems = input.items.length
      ? input.items
      : [
          { wardrobe_item_id: '1', slot: 'upper' as const, sort_order: 1 },
          { wardrobe_item_id: '3', slot: 'lower' as const, sort_order: 2 },
          { wardrobe_item_id: '4', slot: 'shoes' as const, sort_order: 3 },
        ];

    const aiInput = { ...input, creation_mode: 'ai' as const, items: aiSuggestedItems };
    await this.validateReferences(aiInput);

    const scheme = await this.schemesRepo.create(aiInput);
    const items = await this.schemeItemsRepo.createMany(aiSuggestedItems.map((item) => ({ ...item, scheme_id: scheme.scheme_id })));

    return { scheme, items, ai_note: 'AI mock applied a balanced smart-casual composition.' };
  }

  async listPublicSchemes() {
    return this.schemesRepo.findPublic();
  }

  async listSchemesByUser(userId: string) {
    return this.schemesRepo.findByUser(userId);
  }

  async getSchemeDetails(schemeId: string) {
    return this.schemesRepo.findByIdWithItems(schemeId);
  }

  /**
   * RF28: returns scheme details only if the viewer is allowed to see it.
   * Returns null both when the scheme does not exist and when access is denied,
   * so callers cannot distinguish a private scheme from a missing one.
   */
  async getSchemeDetailsForViewer(schemeId: string, viewerId?: string | null) {
    const details = await this.schemesRepo.findByIdWithItems(schemeId);
    if (!details) return null;

    const { visibility, user_id: ownerId } = details.scheme;
    const viewer = viewerId?.trim() || '';

    if (visibility === 'public') return details;
    if (viewer && viewer === ownerId) return details;
    if (visibility === 'followers' && viewer && (await this.followsRepo.isFollowing(viewer, ownerId))) {
      return details;
    }
    return null;
  }

  async updateSchemeVisibility(schemeId: string, userId: string, visibility: SchemeVisibility) {
    if (!VALID_VISIBILITIES.includes(visibility)) {
      throw new ServiceError(`Invalid visibility "${visibility}"`, 400);
    }
    const scheme = await this.schemesRepo.findById(schemeId);
    if (!scheme) throw new ServiceError('Scheme not found', 404);
    if (scheme.user_id !== userId) {
      throw new ServiceError('Only the owner can change visibility', 403);
    }
    await this.schemesRepo.updateVisibility(schemeId, visibility);
    return { scheme_id: schemeId, visibility };
  }
}
