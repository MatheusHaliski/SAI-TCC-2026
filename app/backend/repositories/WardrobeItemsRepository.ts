import { ModelGenerationStatus, WardrobeAnalysis, WardrobeViewItem } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';
import { BrandsRepository } from './BrandsRepository';
import { MarketsRepository } from './MarketsRepository';

const WARDROBE_ITEMS_COLLECTION = 'sai-wardrobeItems';

function aggregate(items: WardrobeViewItem[], key: keyof Pick<WardrobeViewItem, 'brand' | 'season' | 'gender' | 'piece_type'>) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
}

export class WardrobeItemsRepository extends BaseRepository {
  constructor(
    private readonly brandsRepository = new BrandsRepository(),
    private readonly marketsRepository = new MarketsRepository(),
  ) {
    super();
  }

  async findByUser(userId: string): Promise<WardrobeViewItem[]> {
    const brandMap = await this.brandsRepository.getNameMap();
    const marketsMap = await this.marketsRepository.getByIdMap();

    const snapshot = await this.db.collection(WARDROBE_ITEMS_COLLECTION).where('user_id', '==', userId).get();
    return snapshot.docs.map((doc) => {
      const item = doc.data() as Record<string, string | number | boolean | null>;
      const market = marketsMap.get(String(item.market_id ?? ''));
      return {
        wardrobe_item_id: doc.id,
        name: String(item.name ?? ''),
        image_url: String(item.image_url ?? ''),
        model_3d_url: (item.model_3d_url as string | null) ?? null,
        model_preview_url: (item.model_preview_url as string | null) ?? null,
        model_base_3d_url: (item.model_base_3d_url as string | null) ?? null,
        model_branded_3d_url: (item.model_branded_3d_url as string | null) ?? null,
        model_status: (item.model_status as ModelGenerationStatus) ?? 'queued_base',
        model_generation_error: (item.model_generation_error as string | null) ?? null,
        brand: brandMap.get(String(item.brand_id ?? '')) ?? (item.brand_id === 'default' ? 'Default brand' : 'Unknown'),
        brand_detection_confidence: Number(item.brand_detection_confidence ?? 0) || null,
        brand_detection_source: (item.brand_detection_source as WardrobeViewItem['brand_detection_source']) ?? null,
        brand_applied: Boolean(item.brand_applied),
        placement_profile_id: (item.placement_profile_id as string | null) ?? null,
        branding_pass_version: (item.branding_pass_version as string | null) ?? null,
        season: market?.season ?? 'Unknown',
        gender: market?.gender ?? 'Unknown',
        piece_type: String(item.piece_type ?? ''),
      };
    });
  }

  async create(input: {
    user_id: string;
    brand_id: string;
    market_id: string;
    name: string;
    image_url: string;
    model_3d_url: string | null;
    model_preview_url: string | null;
    model_base_3d_url: string | null;
    model_branded_3d_url: string | null;
    model_status: ModelGenerationStatus;
    model_generation_error: string | null;
    brand_id_selected: string;
    brand_id_detected: string | null;
    brand_detection_confidence: number | null;
    brand_detection_source: string | null;
    brand_applied: boolean;
    placement_profile_id: string | null;
    branding_pass_version: string | null;
    piece_type: string;
    color: string;
    material: string;
    style_tags: string[];
    occasion_tags: string[];
  }): Promise<{ wardrobe_item_id: string }> {
    const now = new Date().toISOString();
    const payload = {
      ...input,
      is_favorite: false,
      created_at: now,
      updated_at: now,
    };
    const ref = await this.db.collection(WARDROBE_ITEMS_COLLECTION).add(payload);
    return { wardrobe_item_id: ref.id };
  }

  async existsById(wardrobeItemId: string): Promise<boolean> {
    const snap = await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).get();
    return snap.exists;
  }

  async updatePipelineStatus(wardrobeItemId: string, status: ModelGenerationStatus, modelGenerationError: string | null = null): Promise<void> {
    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      model_status: status,
      model_generation_error: modelGenerationError,
      updated_at: new Date().toISOString(),
    });
  }

  async updateModelAssets(
    wardrobeItemId: string,
    input: {
      model_3d_url: string;
      model_preview_url: string | null;
      model_base_3d_url: string;
      model_branded_3d_url: string;
      placement_profile_id: string;
      brand_applied: boolean;
      branding_pass_version: string;
    },
  ): Promise<void> {
    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      ...input,
      model_status: 'done',
      updated_at: new Date().toISOString(),
    });
  }

  async getAnalysisByUser(userId: string): Promise<WardrobeAnalysis> {
    const items = await this.findByUser(userId);
    return {
      total_items: items.length,
      by_brand: aggregate(items, 'brand'),
      by_season: aggregate(items, 'season'),
      by_gender: aggregate(items, 'gender'),
      by_piece_type: aggregate(items, 'piece_type'),
    };
  }
}
