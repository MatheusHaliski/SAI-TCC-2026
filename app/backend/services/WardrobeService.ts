import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { ServiceError } from './errors';
import { MeshyService } from './MeshyService';

const DEFAULT_BRAND_ID = 'default';


export class WardrobeService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly meshyService = new MeshyService(),
  ) {}

  async listUserWardrobe(userId: string) {
    return this.wardrobeRepo.findByUser(userId);
  }

  async getWardrobeAnalysis(userId: string) {
    return this.wardrobeRepo.getAnalysisByUser(userId);
  }

  async createWardrobeItem(input: Record<string, unknown>) {
    const user_id = String(input.user_id ?? '').trim();
    const name = String(input.name ?? '').trim();
    const image_url = String(input.image_url ?? '').trim();
    const piece_type = String(input.piece_type ?? '').trim();
    const market_id = String(input.market_id ?? '').trim();
    if (!user_id || !name || !image_url || !piece_type || !market_id) {
      throw new ServiceError('Missing required fields to create wardrobe item.', 400);
    }

    const createdItem = await this.wardrobeRepo.create({
      user_id,
      name,
      image_url,
      model_3d_url: null,
      model_preview_url: null,
      piece_type,
      market_id,
      brand_id: String(input.brand_id ?? DEFAULT_BRAND_ID).trim() || DEFAULT_BRAND_ID,
      color: String(input.color ?? '').trim() || 'unspecified',
      material: String(input.material ?? '').trim() || 'unspecified',
      style_tags: Array.isArray(input.style_tags) ? input.style_tags.map((tag) => String(tag)) : [],
      occasion_tags: Array.isArray(input.occasion_tags) ? input.occasion_tags.map((tag) => String(tag)) : [],
    });

    void this.enrichWardrobeItemModel(createdItem.wardrobe_item_id, image_url);
    return createdItem;
  }

  private async enrichWardrobeItemModel(wardrobeItemId: string, imageUrl: string): Promise<void> {
    try {
      const generatedModel = await this.meshyService.generate3DModelFromImage(imageUrl);
      await this.wardrobeRepo.updateModelAssets(wardrobeItemId, {
        model_3d_url: generatedModel.model_3d_url,
        model_preview_url: generatedModel.model_preview_url,
      });
    } catch {
      // Model generation is best-effort; wardrobe item creation should still succeed.
    }
  }
}
