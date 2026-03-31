import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { ServiceError } from './errors';
import { MeshyService } from './MeshyService';
import { BrandDetectionService } from './BrandDetectionService';
import { BrandPlacementService } from './BrandPlacementService';

const DEFAULT_BRAND_ID = 'default';
const BRANDING_PASS_VERSION = 'v2-image-first';

export class WardrobeService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly meshyService = new MeshyService(),
    private readonly brandDetectionService = new BrandDetectionService(),
    private readonly brandPlacementService = new BrandPlacementService(),
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

    const selectedBrandId = String(input.brand_id ?? DEFAULT_BRAND_ID).trim() || DEFAULT_BRAND_ID;
    const detection = await this.brandDetectionService.detect({
      selectedBrandId,
      name,
      imageUrl: image_url,
    });
    const resolvedBrandId = detection.brand_id_detected ?? selectedBrandId;
    const needsBrandReview = !detection.brand_id_detected;

    const createdItem = await this.wardrobeRepo.create({
      user_id,
      name,
      image_url,
      model_3d_url: null,
      model_preview_url: null,
      model_base_3d_url: null,
      model_branded_3d_url: null,
      model_status: needsBrandReview ? 'needs_brand_review' : 'queued_base',
      model_generation_error: needsBrandReview ? detection.detection_explanation : null,
      piece_type,
      market_id,
      brand_id: resolvedBrandId,
      brand_id_selected: selectedBrandId,
      brand_id_detected: detection.brand_id_detected,
      brand_detection_confidence: detection.brand_detection_confidence,
      brand_detection_source: detection.brand_detection_source,
      brand_applied: false,
      placement_profile_id: null,
      branding_pass_version: null,
      color: String(input.color ?? '').trim() || 'unspecified',
      material: String(input.material ?? '').trim() || 'unspecified',
      style_tags: Array.isArray(input.style_tags) ? input.style_tags.map((tag) => String(tag)) : [],
      occasion_tags: Array.isArray(input.occasion_tags) ? input.occasion_tags.map((tag) => String(tag)) : [],
    });

    if (!needsBrandReview) {
      void this.enrichWardrobeItemModel({
        wardrobeItemId: createdItem.wardrobe_item_id,
        imageUrl: image_url,
        pieceType: piece_type,
        brandId: resolvedBrandId,
      });
    }

    return createdItem;
  }

  private async enrichWardrobeItemModel(input: {
    wardrobeItemId: string;
    imageUrl: string;
    pieceType: string;
    brandId: string;
  }): Promise<void> {
    try {
      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_base');
      const baseModel = await this.meshyService.generate3DModelFromImage(input.imageUrl);

      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'base_done');
      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_branding');

      const placementProfile = await this.brandPlacementService.getPlacementProfile({
        brandId: input.brandId,
        pieceType: input.pieceType,
      });

      const brandingPrompt = `Use detected brand ${input.brandId} logo only. Place at ${placementProfile.anchor} profile ${placementProfile.profile_id} scale ${placementProfile.scale}.`; 
      const brandedModel = await this.meshyService.generate3DModelFromImage(input.imageUrl, { prompt: brandingPrompt });

      const qaPassed = this.qualityChecksPass({
        baseModelUrl: baseModel.model_3d_url,
        brandedModelUrl: brandedModel.model_3d_url,
      });

      if (!qaPassed) {
        throw new ServiceError('Branding quality checks failed (logo visibility/placement validation).', 502);
      }

      await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
        model_3d_url: brandedModel.model_3d_url,
        model_preview_url: brandedModel.model_preview_url ?? baseModel.model_preview_url,
        model_base_3d_url: baseModel.model_3d_url,
        model_branded_3d_url: brandedModel.model_3d_url,
        placement_profile_id: placementProfile.profile_id,
        brand_applied: true,
        branding_pass_version: BRANDING_PASS_VERSION,
      });
    } catch (error) {
      await this.wardrobeRepo.updatePipelineStatus(
        input.wardrobeItemId,
        'failed',
        error instanceof Error ? error.message : 'Unknown model pipeline failure.',
      );
    }
  }

  private qualityChecksPass(input: { baseModelUrl: string; brandedModelUrl: string }): boolean {
    const baseValid = input.baseModelUrl.trim().length > 0 && input.baseModelUrl.toLowerCase().endsWith('.glb');
    const brandedValid = input.brandedModelUrl.trim().length > 0 && input.brandedModelUrl.toLowerCase().endsWith('.glb');
    const urlsDiffer = input.baseModelUrl !== input.brandedModelUrl;

    return baseValid && brandedValid && urlsDiffer;
  }
}
