import { WardrobeService } from '@/app/backend/services/WardrobeService';
import { Clothing2DGenerationService } from '@/app/backend/services/Clothing2DGenerationService';
import { WardrobeRepository } from '@/app/backend/repositories/WardrobeRepository';

export class WardrobeController {
  constructor(
    private readonly wardrobeService = new WardrobeService(),
    private readonly clothing2dService = new Clothing2DGenerationService(),
    private readonly wardrobeRepository = new WardrobeRepository(),
  ) {}

  async listByUser(
    userId: string,
    options?: { limit?: number; cursorCreatedAt?: string; status?: 'active' | 'processing' | 'archived'; piece_type?: string },
  ) {
    return this.wardrobeService.listUserWardrobe(userId, options);
  }

  async analysisByUser(userId: string) {
    return this.wardrobeService.getWardrobeAnalysis(userId);
  }

  async create(input: Record<string, unknown>) {
    return this.wardrobeService.createWardrobeItem(input);
  }

  async listDiscoverable(filters?: {
    brand_id?: string;
    market_id?: string;
    gender?: string;
    limit?: number;
    cursorCreatedAt?: string;
  }) {
    return this.wardrobeService.listDiscoverablePieces(filters);
  }

  async process2D(input: Record<string, unknown>) {
    return this.clothing2dService.process({
      wardrobe_item_id: String(input.wardrobe_item_id ?? ''),
      raw_upload_image_url: String(input.raw_upload_image_url ?? ''),
      piece_type: String(input.piece_type ?? 'upper'),
    });
  }

  async getByIdWith2D(wardrobeItemId: string) {
    return this.wardrobeRepository.findWith2DAssetsById(wardrobeItemId);
  }

  async retry3D(wardrobeItemId: string) {
    return this.wardrobeService.retry3DGeneration(wardrobeItemId);
  }

  async retryBranding(wardrobeItemId: string, input?: Record<string, unknown>) {
    void input;
    return this.wardrobeService.retry3DGeneration(wardrobeItemId);
  }

  async getById(wardrobeItemId: string) {
    return this.wardrobeRepository.findById(wardrobeItemId);
  }

  async update(wardrobeItemId: string, fields: Record<string, unknown>) {
    await this.wardrobeRepository.updateFields(wardrobeItemId, {
      name: typeof fields.name === 'string' ? fields.name : undefined,
      piece_type: typeof fields.piece_type === 'string' ? fields.piece_type : undefined,
      color: typeof fields.color === 'string' ? fields.color : undefined,
      material: typeof fields.material === 'string' ? fields.material : undefined,
      style_tags: Array.isArray(fields.style_tags) ? fields.style_tags.map(String) : undefined,
      occasion_tags: Array.isArray(fields.occasion_tags) ? fields.occasion_tags.map(String) : undefined,
      brand_id: typeof fields.brand_id === 'string' ? fields.brand_id : undefined,
      image_url: typeof fields.image_url === 'string' ? fields.image_url : undefined,
      description: typeof fields.description === 'string' ? fields.description : undefined,
      is_favorite: typeof fields.is_favorite === 'boolean' ? fields.is_favorite : undefined,
    });
    return { ok: true };
  }

  async deleteById(wardrobeItemId: string) {
    await this.wardrobeRepository.deleteById(wardrobeItemId);
    return { ok: true };
  }
}
