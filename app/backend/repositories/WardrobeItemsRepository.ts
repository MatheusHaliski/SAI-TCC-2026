import { ModelGenerationStatus, WardrobeAnalysis, WardrobeImageAnalysis, WardrobeViewItem } from '@/app/backend/types/entities';
import { resolveWardrobeModelUrl } from '@/app/lib/wardrobeModelUrl';
import { BaseRepository } from './BaseRepository';
import { BrandsRepository } from './BrandsRepository';
import { MarketsRepository } from './MarketsRepository';
import { UsersRepository } from './UsersRepository';

const WARDROBE_ITEMS_COLLECTION = 'sai-wardrobeItems';
const RECOMMENDED_ACTIONS: WardrobeImageAnalysis['recommended_action'][] = [
  'approve_catalog_2d',
  'refine_with_diffusion',
  'normalize_only',
  'request_reupload',
];

function normalizeRecommendedAction(value: unknown): WardrobeImageAnalysis['recommended_action'] {
  if (typeof value === 'string' && RECOMMENDED_ACTIONS.includes(value as WardrobeImageAnalysis['recommended_action'])) {
    return value as WardrobeImageAnalysis['recommended_action'];
  }
  return 'normalize_only';
}

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
    private readonly usersRepository = new UsersRepository(),
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
      const model3dUrl = resolveWardrobeModelUrl({
        model_3d_url: (item.model_3d_url as string | null) ?? null,
        model_branded_3d_url: (item.model_branded_3d_url as string | null) ?? null,
        model_base_3d_url: (item.model_base_3d_url as string | null) ?? null,
      });
      const modelBase3dUrl = (item.model_base_3d_url as string | null) ?? null;
      const modelBranded3dUrl = (item.model_branded_3d_url as string | null) ?? null;
      const hasAnyModelUrl = [model3dUrl, modelBase3dUrl, modelBranded3dUrl].some((url) => Boolean(url && url.trim().length > 0));
      const rawStatus = (item.model_status as ModelGenerationStatus | undefined) ?? 'queued_base';
      const shouldPromoteLegacyDone =
        hasAnyModelUrl
        && ['queued_segmentation', 'segmentation_done', 'queued_base', 'generating_base', 'base_done', 'queued_branding', 'branding_in_progress', 'queued_geometry_qa', 'retrying_generation', 'needs_brand_review'].includes(rawStatus);
      const normalizedStatus = shouldPromoteLegacyDone ? 'completed' : rawStatus;

      return {
        wardrobe_item_id: doc.id,
        name: String(item.name ?? ''),
        image_url: String(item.image_url ?? ''),
        image_assets: {
          raw_upload_image_url: String(item.raw_upload_image_url ?? item.image_url ?? ''),
          segmented_png_url: (item.segmented_png_url as string | null) ?? null,
          cleaned_png_url: (item.cleaned_png_url as string | null) ?? null,
          normalized_2d_preview_url: (item.normalized_2d_preview_url as string | null) ?? null,
          approved_catalog_2d_url: (item.approved_catalog_2d_url as string | null) ?? null,
          model_3d_url: model3dUrl,
        },
        image_analysis: {
          contains_human: Boolean(item.contains_human),
          rotation_z_degrees: Number(item.rotation_z_degrees ?? 0),
          fully_visible: Boolean(item.fully_visible),
          centered_score: Number(item.centered_score ?? 0),
          front_view_score: Number(item.front_view_score ?? 0),
          background_clean_score: Number(item.background_clean_score ?? 0),
          catalog_readiness_score: Number(item.catalog_readiness_score ?? 0),
          recommended_action: normalizeRecommendedAction(item.recommended_action),
        },
        model_3d_url: model3dUrl,
        model_preview_url: (item.model_preview_url as string | null) ?? null,
        model_base_3d_url: modelBase3dUrl,
        model_branded_3d_url: modelBranded3dUrl,
        isolated_piece_image_url: (item.isolated_piece_image_url as string | null) ?? null,
        segmentation_confidence: Number(item.segmentation_confidence ?? 0) || null,
        geometry_scope_passed:
          typeof item.geometry_scope_passed === 'boolean'
            ? item.geometry_scope_passed
            : null,
        geometry_scope_score: Number(item.geometry_scope_score ?? 0) || null,
        generation_attempt_count: Number(item.generation_attempt_count ?? 0) || 0,
        pipeline_stage_details: (item.pipeline_stage_details as Record<string, unknown> | null) ?? null,
        model_status: normalizedStatus,
        model_generation_error: (item.model_generation_error as string | null) ?? null,
        fitProfile: (item.fitProfile as WardrobeViewItem['fitProfile'] | undefined) ?? undefined,
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


  async findDiscoverable(filters?: {
    query?: string;
    brand?: string;
    piece_type?: string;
    gender?: string;
    season?: string;
    material?: string;
    creator?: string;
    rarity?: string;
  }) {
    const brandMap = await this.brandsRepository.getNameMap();
    const marketsMap = await this.marketsRepository.getByIdMap();
    const snapshot = await this.db.collection(WARDROBE_ITEMS_COLLECTION).get();
    const normalizedQuery = (filters?.query ?? '').trim().toLowerCase();

    const items = await Promise.all(snapshot.docs.map(async (doc) => {
      const item = doc.data() as Record<string, unknown>;
      const market = marketsMap.get(String(item.market_id ?? ''));
      const creator = await this.usersRepository.getById(String(item.user_id ?? ''));
      const brand = brandMap.get(String(item.brand_id ?? '')) ?? (item.brand_id === 'default' ? 'Default brand' : 'Unknown');
      const model3dUrl = resolveWardrobeModelUrl({
        model_3d_url: (item.model_3d_url as string | null) ?? null,
        model_branded_3d_url: (item.model_branded_3d_url as string | null) ?? null,
        model_base_3d_url: (item.model_base_3d_url as string | null) ?? null,
      });

      return {
        wardrobe_item_id: doc.id,
        user_id: String(item.user_id ?? ''),
        creator_name: creator?.name || 'Creator',
        name: String(item.name ?? ''),
        image_url: String(item.image_url ?? ''),
        image_assets: {
          raw_upload_image_url: String(item.raw_upload_image_url ?? item.image_url ?? ''),
          segmented_png_url: (item.segmented_png_url as string | null) ?? null,
          cleaned_png_url: (item.cleaned_png_url as string | null) ?? null,
          normalized_2d_preview_url: (item.normalized_2d_preview_url as string | null) ?? null,
          approved_catalog_2d_url: (item.approved_catalog_2d_url as string | null) ?? null,
          model_3d_url: model3dUrl,
        },
        image_analysis: {
          contains_human: Boolean(item.contains_human),
          rotation_z_degrees: Number(item.rotation_z_degrees ?? 0),
          fully_visible: Boolean(item.fully_visible),
          centered_score: Number(item.centered_score ?? 0),
          front_view_score: Number(item.front_view_score ?? 0),
          background_clean_score: Number(item.background_clean_score ?? 0),
          catalog_readiness_score: Number(item.catalog_readiness_score ?? 0),
          recommended_action: normalizeRecommendedAction(item.recommended_action),
        },
        piece_type: String(item.piece_type ?? ''),
        brand,
        color: String(item.color ?? ''),
        material: String(item.material ?? ''),
        rarity: String(item.rarity ?? 'Standard'),
        wearstyles: Array.isArray(item.style_tags) ? item.style_tags.map((tag) => String(tag)) : [],
        style_tags: Array.isArray(item.style_tags) ? item.style_tags.map((tag) => String(tag)) : [],
        occasion_tags: Array.isArray(item.occasion_tags) ? item.occasion_tags.map((tag) => String(tag)) : [],
        season: market?.season ?? 'Unknown',
        gender: market?.gender ?? 'Unknown',
        model_3d_url: (item.model_3d_url as string | null) ?? null,
        model_preview_url: (item.model_preview_url as string | null) ?? null,
        model_base_3d_url: (item.model_base_3d_url as string | null) ?? null,
        model_branded_3d_url: (item.model_branded_3d_url as string | null) ?? null,
        description: String(item.description ?? ''),
        is_public: Boolean(item.is_public ?? true),
        is_discoverable: Boolean(item.is_discoverable ?? true),
        published_in_search: Boolean(item.published_in_search ?? true),
      };
    }));

    return items
      .filter((item) => {
        if (!item.is_public || !item.is_discoverable || !item.published_in_search) return false;
        if (filters?.brand && item.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
        if (filters?.piece_type && item.piece_type.toLowerCase() !== filters.piece_type.toLowerCase()) return false;
        if (filters?.gender && item.gender.toLowerCase() !== filters.gender.toLowerCase()) return false;
        if (filters?.season && item.season.toLowerCase() !== filters.season.toLowerCase()) return false;
        if (filters?.material && item.material.toLowerCase() !== filters.material.toLowerCase()) return false;
        if (filters?.creator && !item.creator_name.toLowerCase().includes(filters.creator.toLowerCase())) return false;
        if (filters?.rarity && item.rarity.toLowerCase() !== filters.rarity.toLowerCase()) return false;
        if (!normalizedQuery) return true;

        const blob = [
          item.name,
          item.brand,
          item.piece_type,
          item.color,
          item.material,
          item.creator_name,
          item.description,
          ...item.wearstyles,
          ...item.style_tags,
          ...item.occasion_tags,
        ].join(' ').toLowerCase();

        return blob.includes(normalizedQuery);
      })
      .sort((a, b) => b.wardrobe_item_id.localeCompare(a.wardrobe_item_id));
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
    isolated_piece_image_url: string | null;
    segmentation_confidence: number | null;
    geometry_scope_passed: boolean;
    geometry_scope_score: number | null;
    generation_attempt_count: number;
    pipeline_stage_details: Record<string, unknown> | null;
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
    gender: string;
    color: string;
    material: string;
    style_tags: string[];
    occasion_tags: string[];
    fitProfile?: Record<string, unknown>;
  }): Promise<{ wardrobe_item_id: string }> {
    const now = new Date().toISOString();
    const payload = {
      ...input,
      is_favorite: false,
      is_public: true,
      is_discoverable: true,
      published_in_search: true,
      created_at: now,
      updated_at: now,
    };
    const ref = await this.db.collection(WARDROBE_ITEMS_COLLECTION).add(payload);
    return { wardrobe_item_id: ref.id };
  }


  async findById(wardrobeItemId: string): Promise<(Record<string, unknown> & { wardrobe_item_id: string }) | null> {
    const doc = await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).get();
    if (!doc.exists) return null;
    return {
      wardrobe_item_id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    };
  }


  async update2DAssets(
    wardrobeItemId: string,
    input: {
      image_assets: {
        raw_upload_image_url: string;
        segmented_png_url: string | null;
        normalized_2d_preview_url: string | null;
        approved_catalog_2d_url: string | null;
      };
      image_analysis: {
        contains_human: boolean;
        rotation_z_degrees: number;
        fully_visible: boolean;
        centered_score: number;
        front_view_score: number;
        background_clean_score: number;
        catalog_readiness_score: number;
        recommended_action: string;
      };
      stage_details: Record<string, unknown>;
    },
  ): Promise<void> {
    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      raw_upload_image_url: input.image_assets.raw_upload_image_url,
      segmented_png_url: input.image_assets.segmented_png_url,
      normalized_2d_preview_url: input.image_assets.normalized_2d_preview_url,
      approved_catalog_2d_url: input.image_assets.approved_catalog_2d_url,
      contains_human: input.image_analysis.contains_human,
      rotation_z_degrees: input.image_analysis.rotation_z_degrees,
      fully_visible: input.image_analysis.fully_visible,
      centered_score: input.image_analysis.centered_score,
      front_view_score: input.image_analysis.front_view_score,
      background_clean_score: input.image_analysis.background_clean_score,
      catalog_readiness_score: input.image_analysis.catalog_readiness_score,
      recommended_action: input.image_analysis.recommended_action,
      pipeline_stage_details: input.stage_details,
      updated_at: new Date().toISOString(),
    });
  }

  async findWith2DAssetsById(wardrobeItemId: string): Promise<(Record<string, unknown> & { wardrobe_item_id: string }) | null> {
    const item = await this.findById(wardrobeItemId);
    if (!item) return null;
    const model3dUrl = resolveWardrobeModelUrl({
      model_3d_url: (item.model_3d_url as string | null) ?? null,
      model_base_3d_url: (item.model_base_3d_url as string | null) ?? null,
      model_branded_3d_url: (item.model_branded_3d_url as string | null) ?? null,
    });

    return {
      ...item,
      image_assets: {
        raw_upload_image_url: String(item.raw_upload_image_url ?? item.image_url ?? ''),
        segmented_png_url: (item.segmented_png_url as string | null) ?? null,
        cleaned_png_url: (item.cleaned_png_url as string | null) ?? null,
        normalized_2d_preview_url: (item.normalized_2d_preview_url as string | null) ?? null,
        approved_catalog_2d_url: (item.approved_catalog_2d_url as string | null) ?? null,
        model_3d_url: model3dUrl,
      },
      image_analysis: {
        contains_human: Boolean(item.contains_human),
        rotation_z_degrees: Number(item.rotation_z_degrees ?? 0),
        fully_visible: Boolean(item.fully_visible),
        centered_score: Number(item.centered_score ?? 0),
        front_view_score: Number(item.front_view_score ?? 0),
        background_clean_score: Number(item.background_clean_score ?? 0),
        catalog_readiness_score: Number(item.catalog_readiness_score ?? 0),
        recommended_action: String(item.recommended_action ?? 'normalize_only'),
      },
    };
  }
  async existsById(wardrobeItemId: string): Promise<boolean> {
    const snap = await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).get();
    return snap.exists;
  }

  async updatePipelineStatus(
    wardrobeItemId: string,
    status: ModelGenerationStatus,
    modelGenerationError: string | null = null,
    stageDetails: Record<string, unknown> | null = null,
  ): Promise<void> {
    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      model_status: status,
      model_generation_error: modelGenerationError,
      ...(stageDetails ? { pipeline_stage_details: stageDetails } : {}),
      updated_at: new Date().toISOString(),
    });
  }

  async updateModelAssets(
    wardrobeItemId: string,
    input: {
      model_3d_url: string | null;
      model_preview_url: string | null;
      model_base_3d_url: string | null;
      model_branded_3d_url: string | null;
      isolated_piece_image_url: string;
      segmentation_confidence: number;
      geometry_scope_passed: boolean;
      geometry_scope_score: number | null;
      generation_attempt_count: number;
      pipeline_stage_details: Record<string, unknown>;
      placement_profile_id: string | null;
      brand_applied: boolean;
      branding_pass_version: string;
    },
  ): Promise<void> {
    const resolvedModel3dUrl = resolveWardrobeModelUrl(input);

    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      ...input,
      model_3d_url: resolvedModel3dUrl,
      model_status: 'completed',
      updated_at: new Date().toISOString(),
    });
  }

  async updateGenerationAttempt(wardrobeItemId: string, generationAttemptCount: number): Promise<void> {
    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      generation_attempt_count: generationAttemptCount,
      updated_at: new Date().toISOString(),
    });
  }


  async updateModel3dUrl(wardrobeItemId: string, model3dUrl: string): Promise<void> {
    const normalized = model3dUrl.trim();
    if (!normalized) return;

    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      model_3d_url: normalized,
      model_status: 'completed',
      model_generation_error: null,
      updated_at: new Date().toISOString(),
    });
  }

  async updateCleanedPngUrl(wardrobeItemId: string, cleanedPngUrl: string): Promise<void> {
    const normalized = cleanedPngUrl.trim();
    if (!normalized) return;

    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      cleaned_png_url: normalized,
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
