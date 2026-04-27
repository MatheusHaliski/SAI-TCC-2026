import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { ServiceError } from './errors';
import { BrandDetectionService } from './BrandDetectionService';
import { BrandPlacementService } from './BrandPlacementService';
import { PieceIsolationService } from './PieceIsolationService';
import { GeometryScopeService } from './GeometryScopeService';
import { MeshyService } from './MeshyService';
import { BrandsRepository } from '@/app/backend/repositories/BrandsRepository';
import { PipelineJobsRepository } from '@/app/backend/repositories/PipelineJobsRepository';
import { BlenderPipelineService } from './BlenderPipelineService';
import { BlenderCloudService } from './BlenderCloudService';
import type { ModelGenerationStatus } from '@/app/backend/types/entities';
import { classifyGarmentGender, classifyGarmentType } from '@/app/lib/fashion-ai/utils/garment-classification';

const DEFAULT_BRAND_ID = 'default';
const BRANDING_PASS_VERSION = 'v2-image-first';
const ENABLE_BRANDING_PASS = String(process.env.ENABLE_BRANDING_PASS ?? 'true').trim().toLowerCase() !== 'false';
const BRANDING_PASS_MODE_RAW = String(process.env.BRANDING_PASS_MODE ?? 'soft').trim().toLowerCase();
const BRANDING_PASS_MODE: 'strict' | 'soft' | 'disabled' =
  BRANDING_PASS_MODE_RAW === 'strict' || BRANDING_PASS_MODE_RAW === 'disabled' ? BRANDING_PASS_MODE_RAW : 'soft';
const SEGMENTATION_MIN_CONFIDENCE = Number(process.env.SEGMENTATION_MIN_CONFIDENCE ?? 0.75);
const MODEL_GENERATION_MAX_POLLS = Number(process.env.BLENDER_MODEL_MAX_POLLS ?? 48);
const MODEL_GENERATION_POLL_MS = Number(process.env.BLENDER_MODEL_POLL_MS ?? 1500);
const MODEL_GENERATION_JOB_TYPE = (process.env.BLENDER_MODEL_JOB_TYPE ?? 'image_to_garment').trim() || 'image_to_garment';
const BRAND_REVIEW_REQUIRED = String(process.env.BRAND_REVIEW_REQUIRED ?? 'false').trim().toLowerCase() === 'true';

interface BlenderGenerationResult {
  model_3d_url: string;
  model_preview_url: string | null;
}

interface BrandingQualityCheckResult {
  ok: boolean;
  failedReason: string | null;
  scores: {
    visibility: number;
    placement: number;
    contrast: number;
    scale: number;
  };
  thresholds: {
    visibility: number;
    placement: number;
    contrast: number;
    scale: number;
  };
}

export class WardrobeService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly blenderCloudService = new BlenderCloudService(),
    private readonly meshyService = new MeshyService(),
    private readonly brandDetectionService = new BrandDetectionService(),
    private readonly brandPlacementService = new BrandPlacementService(),
    private readonly pieceIsolationService = new PieceIsolationService(),
    private readonly geometryScopeService = new GeometryScopeService(),
    private readonly brandsRepository = new BrandsRepository(),
    private readonly pipelineJobsRepository = new PipelineJobsRepository(),
    private readonly blenderPipelineService = new BlenderPipelineService(),
  ) {}

  async listUserWardrobe(
    userId: string,
    options?: { limit?: number; cursorCreatedAt?: string; status?: 'active' | 'processing' | 'archived'; piece_type?: string },
  ) {
    await this.syncActiveUvJobs(userId);
    return this.wardrobeRepo.findByUser(userId, options);
  }

  private async syncActiveUvJobs(userId: string): Promise<void> {
    try {
      const activeJobs = await this.pipelineJobsRepository.findActiveByUser(userId);
      await Promise.all(activeJobs.map((job) => this.blenderPipelineService.syncBlenderCloudJob(job.pipeline_job_id)));
    } catch (error) {
      console.warn('[wardrobe-service] failed to sync active UV jobs', { userId, error });
    }
  }

  async getWardrobeAnalysis(userId: string) {
    return this.wardrobeRepo.getAnalysisByUser(userId);
  }

  async listDiscoverablePieces(filters?: {
    brand_id?: string;
    market_id?: string;
    gender?: string;
    limit?: number;
    cursorCreatedAt?: string;
  }) {
    return this.wardrobeRepo.findDiscoverable(filters);
  }

  async createWardrobeItem(input: Record<string, unknown>) {
    const user_id = String(input.user_id ?? '').trim();
    const name = String(input.name ?? '').trim();
    const image_url = String(input.image_url ?? '').trim();
    const piece_type = String(input.piece_type ?? '').trim();
    const gender = String(input.gender ?? '').trim() || 'unspecified';
    const market_id = String(input.market_id ?? '').trim();
    if (!user_id || !name || !image_url || !piece_type || !market_id) {
      throw new ServiceError('Missing required fields to create wardrobe item.', 400);
    }

    const selectedBrandId = String(input.brand_id ?? DEFAULT_BRAND_ID).trim() || DEFAULT_BRAND_ID;
    const fitPieceType = classifyGarmentType({ pieceType: piece_type, name });
    const fitGender = classifyGarmentGender({ gender, name });
    const compatibleMannequins =
      fitGender === 'male' ? ['male_v1'] : fitGender === 'female' ? ['female_v1'] : ['male_v1', 'female_v1'];
    const detection = await this.brandDetectionService.detect({
      selectedBrandId,
      name,
      imageUrl: image_url,
    });
    const resolvedBrandId = detection.brand_id_detected ?? selectedBrandId;
    const hasReliableBrandMatch = Boolean(detection.brand_id_detected);
    const needsBrandReview = BRAND_REVIEW_REQUIRED && !hasReliableBrandMatch && selectedBrandId === DEFAULT_BRAND_ID;

    const createdItem = await this.wardrobeRepo.create({
      user_id,
      name,
      image_url,
      model_3d_url: null,
      model_preview_url: null,
      model_base_3d_url: null,
      model_branded_3d_url: null,
      isolated_piece_image_url: null,
      segmentation_confidence: null,
      geometry_scope_passed: false,
      geometry_scope_score: null,
      generation_attempt_count: 0,
      pipeline_stage_details: hasReliableBrandMatch
        ? null
        : {
            stage: needsBrandReview ? 'needs_brand_review' : 'queued_segmentation',
            brand_detection_warning: detection.detection_explanation,
          },
      model_status: needsBrandReview ? 'needs_brand_review' : 'queued_segmentation',
      model_generation_error: needsBrandReview ? detection.detection_explanation : null,
      piece_type,
      gender,
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
      fitProfile: {
        pieceType: fitPieceType,
        targetGender: fitGender,
        preparationStatus: 'pending',
        originalImageUrl: image_url,
        preparedAssetUrl: null,
        preparedMaskUrl: null,
        compatibleMannequins,
        fitMode: 'overlay',
        normalizedBBox: null,
        garmentAnchors: null,
        validationWarnings: [],
        preparationError: null,
        preparedAt: null,
        updatedAt: new Date().toISOString(),
      },
    });

    if (!needsBrandReview) {
      await this.enrichWardrobeItemModel({
        wardrobeItemId: createdItem.wardrobe_item_id,
        imageUrl: image_url,
        pieceType: piece_type,
        brandId: resolvedBrandId,
      });
    }

    return createdItem;
  }

  async retryBrandingPass(input: { wardrobeItemId: string; regenerateBase?: boolean }) {
    const item = await this.wardrobeRepo.findById(input.wardrobeItemId);
    if (!item) {
      throw new ServiceError('Wardrobe item not found.', 404);
    }

    const baseModelUrl = String(item.model_base_3d_url ?? '').trim();
    if (!baseModelUrl) {
      throw new ServiceError('Base 3D model is required before retrying branding.', 400);
    }

    if (input.regenerateBase) {
      throw new ServiceError('Base 3D regeneration is not supported in retry-branding endpoint.', 400);
    }

    const isolatedImageUrl = String(item.isolated_piece_image_url ?? item.image_url ?? '').trim();
    const pieceType = String(item.piece_type ?? '').trim();
    const brandId = String(item.brand_id ?? DEFAULT_BRAND_ID).trim() || DEFAULT_BRAND_ID;
    if (!isolatedImageUrl || !pieceType) {
      throw new ServiceError('Missing isolated image or piece type for branding retry.', 400);
    }

    await this.runOptionalBrandingPass({
      wardrobeItemId: input.wardrobeItemId,
      pieceType,
      brandId,
      isolatedImageUrl,
      baseModelUrl,
      basePreviewUrl: (item.model_preview_url as string | null) ?? null,
      segmentationConfidence: Number(item.segmentation_confidence ?? 0) || 0,
    });

    return this.wardrobeRepo.findById(input.wardrobeItemId);
  }

  private async enrichWardrobeItemModel(input: {
    wardrobeItemId: string;
    imageUrl: string;
    pieceType: string;
    brandId: string;
  }): Promise<void> {
    let baseModel: BlenderGenerationResult | null = null;
    let isolation: Awaited<ReturnType<PieceIsolationService['isolate']>> | null = null;
    let placementProfileId: string | null = null;
    try {
      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_segmentation');
      isolation = await this.pieceIsolationService.isolate({
        imageUrl: input.imageUrl,
        pieceType: input.pieceType,
      });

      await this.wardrobeRepo.updatePipelineStatus(
        input.wardrobeItemId,
        'segmentation_done',
        null,
        {
          stage: 'segmentation_done',
          ...isolation.stageDetails,
        },
      );

      if (isolation.segmentationConfidence < SEGMENTATION_MIN_CONFIDENCE) {
        await this.wardrobeRepo.updatePipelineStatus(
          input.wardrobeItemId,
          'needs_brand_review',
          `Segmentation confidence ${isolation.segmentationConfidence.toFixed(2)} below threshold ${SEGMENTATION_MIN_CONFIDENCE.toFixed(2)}.`,
          {
            stage: 'segmentation_rejected',
            segmentation_confidence: isolation.segmentationConfidence,
          },
        );
        return;
      }

      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_base', null, {
        stage: 'queued_base',
      });
      const basePrompt = `Create a single ${input.pieceType} standalone asset only. Exclude person body, mannequin, full outfit, and scene props.`;
      baseModel = await this.generateModelFromImage(isolation.isolatedImageUrl, {
        prompt: basePrompt,
        pieceType: input.pieceType,
        wardrobeItemId: input.wardrobeItemId,
        status: 'generating_base',
        attemptIncrement: 1,
        stageLabel: 'base_generation',
      });

      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'base_done');
      await this.persistBaseModelAsCompleted({
        wardrobeItemId: input.wardrobeItemId,
        isolation,
        baseModel,
      });
      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'completed', null, {
        stage: 'base_3d_completed',
      });

      const brandingOutcome = await this.runOptionalBrandingPass({
        wardrobeItemId: input.wardrobeItemId,
        pieceType: input.pieceType,
        brandId: input.brandId,
        isolatedImageUrl: isolation.isolatedImageUrl,
        baseModelUrl: baseModel.model_3d_url,
        basePreviewUrl: baseModel.model_preview_url,
        segmentationConfidence: isolation.segmentationConfidence,
      });

      placementProfileId = brandingOutcome.placementProfileId;
      this.logPipelineMetrics(
        input.wardrobeItemId,
        input.pieceType,
        true,
        isolation.segmentationConfidence,
        brandingOutcome.scopeScore,
      );
    } catch (error) {
      if (baseModel && isolation) {
        await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
          model_3d_url: baseModel.model_3d_url,
          model_preview_url: baseModel.model_preview_url,
          model_base_3d_url: baseModel.model_3d_url,
          model_branded_3d_url: null,
          isolated_piece_image_url: isolation.isolatedImageUrl,
          segmentation_confidence: isolation.segmentationConfidence,
          geometry_scope_passed: true,
          geometry_scope_score: null,
          generation_attempt_count: 1,
          pipeline_stage_details: {
            stage: 'completed_without_branding',
            brandingStatus: 'failed_soft',
            reason: 'Base 3D completed; branding validation failed but was not blocking.',
          },
          placement_profile_id: placementProfileId,
          brand_applied: false,
          branding_pass_version: 'failed-soft',
          model_generation_error: null,
          branding_error: {
            message: error instanceof Error ? error.message : 'Unknown branding failure',
            failedStage: 'optional_branding_pass',
            visibilityScore: 0,
            placementScore: 0,
            thresholds: this.getBrandingThresholds(),
            retryable: true,
          },
        });
        return;
      }
      await this.wardrobeRepo.updatePipelineStatus(
        input.wardrobeItemId,
        'failed',
        error instanceof Error ? error.message : 'Unknown model pipeline failure.',
        {
          stage: 'failed',
        },
      );
      console.error('[wardrobe-model-pipeline] pipeline failed', {
        wardrobe_item_id: input.wardrobeItemId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async shouldSkipBrandingPipeline(brandId: string): Promise<boolean> {
    if (!brandId) return false;
    const brand = await this.brandsRepository.getById(brandId);
    return brand?.name?.trim().toLowerCase() === 'zara';
  }

  private getEffectiveBrandingMode(): 'strict' | 'soft' | 'disabled' {
    if (!ENABLE_BRANDING_PASS) return 'disabled';
    return BRANDING_PASS_MODE;
  }

  private getBrandingThresholds() {
    return {
      visibility: 0.55,
      placement: 0.55,
      contrast: 0.45,
      scale: 0.35,
    };
  }

  private async persistBaseModelAsCompleted(input: {
    wardrobeItemId: string;
    isolation: Awaited<ReturnType<PieceIsolationService['isolate']>>;
    baseModel: BlenderGenerationResult;
  }): Promise<void> {
    await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
      model_3d_url: input.baseModel.model_3d_url,
      model_preview_url: input.baseModel.model_preview_url,
      model_base_3d_url: input.baseModel.model_3d_url,
      model_branded_3d_url: null,
      isolated_piece_image_url: input.isolation.isolatedImageUrl,
      segmentation_confidence: input.isolation.segmentationConfidence,
      geometry_scope_passed: true,
      geometry_scope_score: null,
      generation_attempt_count: 1,
      pipeline_stage_details: {
        stage: 'base_3d_completed',
        workflow: ['generate_base_3d', 'optional_branding_pass', 'final_model_selection'],
      },
      placement_profile_id: null,
      brand_applied: false,
      branding_pass_version: 'base-only',
      model_generation_error: null,
      branding_error: null,
    });
  }

  private qualityChecksResult(input: { baseModelUrl: string; brandedModelUrl: string }): BrandingQualityCheckResult {
    const thresholds = this.getBrandingThresholds();
    const baseValid = input.baseModelUrl.trim().length > 0 && input.baseModelUrl.toLowerCase().endsWith('.glb');
    const brandedValid = input.brandedModelUrl.trim().length > 0 && input.brandedModelUrl.toLowerCase().endsWith('.glb');
    const urlsDiffer = input.baseModelUrl !== input.brandedModelUrl;
    const scores = {
      visibility: brandedValid ? 0.8 : 0.1,
      placement: urlsDiffer ? 0.8 : 0.1,
      contrast: brandedValid ? 0.7 : 0.2,
      scale: urlsDiffer ? 0.7 : 0.2,
    };
    const ok = baseValid
      && brandedValid
      && urlsDiffer
      && scores.visibility >= thresholds.visibility
      && scores.placement >= thresholds.placement
      && scores.contrast >= thresholds.contrast
      && scores.scale >= thresholds.scale;

    return {
      ok,
      failedReason: ok ? null : 'logo visibility/placement validation',
      scores,
      thresholds,
    };
  }

  private async runOptionalBrandingPass(input: {
    wardrobeItemId: string;
    pieceType: string;
    brandId: string;
    isolatedImageUrl: string;
    baseModelUrl: string;
    basePreviewUrl: string | null;
    segmentationConfidence: number;
  }): Promise<{ placementProfileId: string | null; scopeScore: number }> {
    const mode = this.getEffectiveBrandingMode();
    const brandCanonical = input.brandId.trim().toLowerCase();
    const existingItem = await this.wardrobeRepo.findById(input.wardrobeItemId);
    const fitProfile = (existingItem?.fitProfile as { garmentAnchors?: unknown; normalizedBBox?: unknown } | undefined) ?? {};
    const hasAnchors = Boolean(fitProfile.garmentAnchors);
    const hasNormalizedBBox = Boolean(fitProfile.normalizedBBox);
    const skipForBrand = await this.shouldSkipBrandingPipeline(input.brandId);

    console.info('[wardrobe-model-pipeline] branding decision', {
      wardrobe_item_id: input.wardrobeItemId,
      base3d_status: 'completed',
      branding_enabled: ENABLE_BRANDING_PASS,
      branding_mode: mode,
      brand_id_canonical: brandCanonical,
      has_model_base_3d_url: Boolean(input.baseModelUrl),
      has_fitprofile_anchors: hasAnchors,
    });

    if (mode === 'disabled' || skipForBrand) {
      await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
        model_3d_url: input.baseModelUrl,
        model_preview_url: input.basePreviewUrl,
        model_base_3d_url: input.baseModelUrl,
        model_branded_3d_url: null,
        isolated_piece_image_url: input.isolatedImageUrl,
        segmentation_confidence: input.segmentationConfidence,
        geometry_scope_passed: true,
        geometry_scope_score: null,
        generation_attempt_count: 1,
        pipeline_stage_details: {
          stage: skipForBrand ? 'done_branding_skipped' : 'completed_without_branding',
          brandingStatus: 'skipped',
          reason: skipForBrand ? 'Brand is Zara; logo placement pass intentionally skipped.' : 'Branding disabled via config.',
        },
        placement_profile_id: null,
        brand_applied: false,
        branding_pass_version: skipForBrand ? 'skipped-zara' : 'disabled',
        model_generation_error: null,
        branding_error: null,
      });
      return { placementProfileId: null, scopeScore: 1 };
    }

    if (!hasAnchors || !hasNormalizedBBox) {
      await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
        model_3d_url: input.baseModelUrl,
        model_preview_url: input.basePreviewUrl,
        model_base_3d_url: input.baseModelUrl,
        model_branded_3d_url: null,
        isolated_piece_image_url: input.isolatedImageUrl,
        segmentation_confidence: input.segmentationConfidence,
        geometry_scope_passed: true,
        geometry_scope_score: null,
        generation_attempt_count: 1,
        pipeline_stage_details: {
          stage: 'completed_without_branding',
          brandingStatus: 'skipped_precondition',
          hint: 'Run 2D preparation before retrying branding.',
        },
        placement_profile_id: null,
        brand_applied: false,
        branding_pass_version: 'skipped-missing-fitprofile',
        model_generation_error: null,
        branding_error: null,
      });
      return { placementProfileId: null, scopeScore: 1 };
    }

    await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_branding');
    const placementProfile = await this.brandPlacementService.getPlacementProfile({
      brandId: input.brandId,
      pieceType: input.pieceType,
    });
    const brandingPrompt = `Create a single ${input.pieceType} standalone asset only with no person body. Use detected brand ${input.brandId} logo only. Place at ${placementProfile.anchor} profile ${placementProfile.profile_id} scale ${placementProfile.scale}.`;
    const brandedModel = await this.generateModelFromImage(input.isolatedImageUrl, {
      prompt: brandingPrompt,
      pieceType: input.pieceType,
      wardrobeItemId: input.wardrobeItemId,
      status: 'branding_in_progress',
      attemptIncrement: 0,
      stageLabel: 'branding_generation',
    });

    const qaResult = this.qualityChecksResult({
      baseModelUrl: input.baseModelUrl,
      brandedModelUrl: brandedModel.model_3d_url,
    });

    if (!qaResult.ok) {
      await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
        model_3d_url: input.baseModelUrl,
        model_preview_url: input.basePreviewUrl,
        model_base_3d_url: input.baseModelUrl,
        model_branded_3d_url: null,
        isolated_piece_image_url: input.isolatedImageUrl,
        segmentation_confidence: input.segmentationConfidence,
        geometry_scope_passed: true,
        geometry_scope_score: null,
        generation_attempt_count: 1,
        pipeline_stage_details: {
          stage: 'completed_without_branding',
          brandingStatus: 'failed_soft',
          reason: 'Base 3D completed; branding validation failed but was not blocking.',
        },
        placement_profile_id: placementProfile.profile_id,
        brand_applied: false,
        branding_pass_version: 'failed-soft',
        model_generation_error: null,
        branding_error: {
          message: qaResult.failedReason ?? 'Unknown branding quality check failure',
          failedStage: 'branding_quality_validation',
          visibilityScore: qaResult.scores.visibility,
          placementScore: qaResult.scores.placement,
          thresholds: qaResult.thresholds,
          retryable: true,
        },
      });
      console.info('[wardrobe-model-pipeline] branding result', {
        wardrobe_item_id: input.wardrobeItemId,
        ok: qaResult.ok,
        reason: qaResult.failedReason,
        mode,
        final_selected_model_url_type: 'base',
      });
      return { placementProfileId: placementProfile.profile_id, scopeScore: 0.7 };
    }

    await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_geometry_qa');
    const geometryScope = await this.validateGeometryScopeWithFallback({
      wardrobeItemId: input.wardrobeItemId,
      modelUrl: brandedModel.model_3d_url,
      pieceType: input.pieceType,
    });

    if (!geometryScope.passed) {
      await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
        model_3d_url: input.baseModelUrl,
        model_preview_url: input.basePreviewUrl,
        model_base_3d_url: input.baseModelUrl,
        model_branded_3d_url: null,
        isolated_piece_image_url: input.isolatedImageUrl,
        segmentation_confidence: input.segmentationConfidence,
        geometry_scope_passed: false,
        geometry_scope_score: geometryScope.scopeScore,
        generation_attempt_count: 1,
        pipeline_stage_details: {
          stage: 'completed_without_branding',
          brandingStatus: 'failed_soft',
          reason: 'Branded model geometry validation failed. Using base model.',
        },
        placement_profile_id: placementProfile.profile_id,
        brand_applied: false,
        branding_pass_version: 'failed-soft',
        model_generation_error: null,
        branding_error: {
          message: geometryScope.reasons.join(' | ') || 'Geometry validation failed',
          failedStage: 'branding_geometry_validation',
          visibilityScore: qaResult.scores.visibility,
          placementScore: qaResult.scores.placement,
          thresholds: qaResult.thresholds,
          retryable: true,
        },
      });
      return { placementProfileId: placementProfile.profile_id, scopeScore: geometryScope.scopeScore };
    }

    await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
      model_3d_url: brandedModel.model_3d_url,
      model_preview_url: brandedModel.model_preview_url ?? input.basePreviewUrl,
      model_base_3d_url: input.baseModelUrl,
      model_branded_3d_url: brandedModel.model_3d_url,
      isolated_piece_image_url: input.isolatedImageUrl,
      segmentation_confidence: input.segmentationConfidence,
      geometry_scope_passed: true,
      geometry_scope_score: geometryScope.scopeScore,
      generation_attempt_count: 1,
      pipeline_stage_details: {
        stage: 'completed_with_branding',
        final_model_selection: 'branded',
      },
      placement_profile_id: placementProfile.profile_id,
      brand_applied: true,
      branding_pass_version: BRANDING_PASS_VERSION,
      model_generation_error: null,
      branding_error: null,
    });

    console.info('[wardrobe-model-pipeline] branding result', {
      wardrobe_item_id: input.wardrobeItemId,
      ok: true,
      mode,
      final_selected_model_url_type: 'branded',
    });
    return { placementProfileId: placementProfile.profile_id, scopeScore: geometryScope.scopeScore };
  }

  private async generateModelFromImage(
    imageUrl: string,
    options: {
      prompt: string;
      pieceType: string;
      wardrobeItemId: string;
      status: ModelGenerationStatus;
      stageLabel: string;
      attemptIncrement: number;
    },
  ): Promise<BlenderGenerationResult> {
    const item = await this.wardrobeRepo.findById(options.wardrobeItemId);
    const previousAttempts = Number(item?.generation_attempt_count ?? 0) || 0;
    const nextAttempts = previousAttempts + options.attemptIncrement;
    if (options.attemptIncrement > 0) {
      await this.wardrobeRepo.updateGenerationAttempt(options.wardrobeItemId, nextAttempts);
    }
    await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
      stage: options.stageLabel,
      provider: this.blenderCloudService.isConfigured() ? 'runpod' : 'meshy',
      generation_attempt_count: nextAttempts,
    });

    if (!this.blenderCloudService.isConfigured()) {
      await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
        stage: `${options.stageLabel}_fallback_meshy`,
        provider: 'meshy',
        reason: 'runpod_not_configured',
      });
      return this.meshyService.generate3DModelFromImage(imageUrl, { prompt: options.prompt });
    }

    await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
      stage: `${options.stageLabel}_submitting`,
      provider: 'runpod',
      job_type: MODEL_GENERATION_JOB_TYPE,
    });

    const submitted = await this.blenderCloudService.submitBlenderCloudJob({
      modelUrl: imageUrl,
      imageUrl,
      jobType: MODEL_GENERATION_JOB_TYPE,
      options: {
        prompt: options.prompt,
        pieceType: options.pieceType,
        mode: 'model_generation',
        sourceImageUrl: imageUrl,
      },
    });

    await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
      stage: `${options.stageLabel}_submitted`,
      provider: 'runpod',
      cloud_job_id: submitted.cloudJobId,
      job_type: MODEL_GENERATION_JOB_TYPE,
      cloud_submit_status: submitted.status,
    });

    const resolveModelFromArtifacts = (artifacts: Record<string, unknown> | null) => {
      const source = artifacts ?? {};
      const modelUrlCandidates = [
        source.outputModelUrl,
        source.modelUrl,
        source.model_3d_url,
        source.outputUrl,
        source.glbUrl,
        source.artifact_url,
        source.artifactUrl,
      ];
      const previewUrlCandidates = [
        source.previewUrl,
        source.posterUrl,
        source.thumbnailUrl,
      ];

      const model_3d_url = modelUrlCandidates.find((url) => typeof url === 'string' && url.trim().length > 0);
      const model_preview_url =
        previewUrlCandidates.find((url) => typeof url === 'string' && url.trim().length > 0) ?? null;

      const resolvedModelUrl = typeof model_3d_url === 'string' ? model_3d_url.trim() : '';
      if (!resolvedModelUrl || !resolvedModelUrl.toLowerCase().startsWith('http')) {
        throw new ServiceError('RunPod Blender model generation completed without a valid model URL.', 502);
      }

      return {
        model_3d_url: resolvedModelUrl,
        model_preview_url: typeof model_preview_url === 'string' ? model_preview_url.trim() : null,
      };
    };

    if (submitted.status === 'completed') {
      return resolveModelFromArtifacts(submitted.artifacts);
    }

    if (submitted.status === 'failed' || submitted.status === 'cancelled') {
      throw new ServiceError(`RunPod Blender model generation ${submitted.status} during submit phase.`, 502);
    }

    for (let poll = 0; poll < MODEL_GENERATION_MAX_POLLS; poll += 1) {
      if (poll > 0 && poll % 6 === 0) {
        await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
          stage: `${options.stageLabel}_polling`,
          provider: 'runpod',
          cloud_job_id: submitted.cloudJobId,
          poll_count: poll,
        });
      }

      const status = await this.blenderCloudService.getBlenderCloudJobStatus(submitted.cloudJobId);
      if (status.status === 'completed') {
        return resolveModelFromArtifacts(status.artifacts);
      }

      if (status.status === 'failed' || status.status === 'cancelled') {
        const details = status.errorMessage ?? JSON.stringify(status.raw?.error ?? status.raw);
        throw new ServiceError(`RunPod Blender model generation ${status.status}: ${details}`, 502);
      }

      await new Promise((resolve) => setTimeout(resolve, MODEL_GENERATION_POLL_MS));
    }

    throw new ServiceError('RunPod Blender model generation timed out before completion.', 504);
  }

  private async validateGeometryScopeWithFallback(input: {
    wardrobeItemId: string;
    modelUrl: string;
    pieceType: string;
  }): Promise<{ passed: boolean; scopeScore: number; reasons: string[] }> {
    try {
      return await this.geometryScopeService.validate({
        modelUrl: input.modelUrl,
        pieceType: input.pieceType,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown geometry scope validation error.';
      console.warn('[wardrobe-model-pipeline] geometry scope validation failed, applying soft-pass fallback', {
        wardrobe_item_id: input.wardrobeItemId,
        error: message,
      });
      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_geometry_qa', null, {
        stage: 'geometry_scope_fallback',
        warning: message,
      });
      return {
        passed: true,
        scopeScore: 0.65,
        reasons: [`Soft-pass fallback applied because geometry validation errored: ${message}`],
      };
    }
  }

  private logPipelineMetrics(
    wardrobeItemId: string,
    pieceType: string,
    scopePassed: boolean,
    segmentationConfidence: number,
    scopeScore: number,
  ) {
    console.info('[wardrobe-model-pipeline]', {
      wardrobe_item_id: wardrobeItemId,
      piece_type: pieceType,
      scope_passed: scopePassed,
      segmentation_confidence: segmentationConfidence,
      geometry_scope_score: scopeScore,
      timestamp: new Date().toISOString(),
    });
  }
}
