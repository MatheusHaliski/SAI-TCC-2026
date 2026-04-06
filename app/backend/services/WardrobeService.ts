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

const DEFAULT_BRAND_ID = 'default';
const BRANDING_PASS_VERSION = 'v2-image-first';
const SEGMENTATION_MIN_CONFIDENCE = Number(process.env.SEGMENTATION_MIN_CONFIDENCE ?? 0.75);
const MODEL_GENERATION_MAX_POLLS = Number(process.env.BLENDER_MODEL_MAX_POLLS ?? 36);
const MODEL_GENERATION_POLL_MS = Number(process.env.BLENDER_MODEL_POLL_MS ?? 3000);
const MODEL_GENERATION_JOB_TYPE = (process.env.BLENDER_MODEL_JOB_TYPE ?? 'image_to_garment').trim() || 'image_to_garment';

interface BlenderGenerationResult {
  model_3d_url: string;
  model_preview_url: string | null;
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

  async listUserWardrobe(userId: string) {
    await this.syncActiveUvJobs(userId);
    return this.wardrobeRepo.findByUser(userId);
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
      isolated_piece_image_url: null,
      segmentation_confidence: null,
      geometry_scope_passed: false,
      geometry_scope_score: null,
      generation_attempt_count: 0,
      pipeline_stage_details: null,
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
      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_segmentation');
      const isolation = await this.pieceIsolationService.isolate({
        imageUrl: input.imageUrl,
        pieceType: input.pieceType,
      });

      await this.wardrobeRepo.updatePipelineStatus(
        input.wardrobeItemId,
        'segmentation_done',
        null,
        {
          stage: 'segmentation_done',
          segmentation_confidence: isolation.segmentationConfidence,
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

      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_base');
      const basePrompt = `Create a single ${input.pieceType} standalone asset only. Exclude person body, mannequin, full outfit, and scene props.`;
      const baseModel = await this.generateModelFromImage(isolation.isolatedImageUrl, {
        prompt: basePrompt,
        pieceType: input.pieceType,
        wardrobeItemId: input.wardrobeItemId,
        status: 'queued_base',
        stageLabel: 'base_generation',
      });

      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'base_done');

      const shouldSkipBrandingPipeline = await this.shouldSkipBrandingPipeline(input.brandId);
      if (shouldSkipBrandingPipeline) {
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
            stage: 'done_branding_skipped',
            reason: 'Brand is Zara; logo placement pass intentionally skipped.',
            segmentation: isolation.stageDetails,
          },
          placement_profile_id: null,
          brand_applied: false,
          branding_pass_version: 'skipped-zara',
        });
        this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, true, isolation.segmentationConfidence, 1);
        return;
      }

      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_branding');

      const placementProfile = await this.brandPlacementService.getPlacementProfile({
        brandId: input.brandId,
        pieceType: input.pieceType,
      });

      const brandingPrompt = `Create a single ${input.pieceType} standalone asset only with no person body. Use detected brand ${input.brandId} logo only. Place at ${placementProfile.anchor} profile ${placementProfile.profile_id} scale ${placementProfile.scale}.`;
      const brandedModel = await this.generateModelFromImage(isolation.isolatedImageUrl, {
        prompt: brandingPrompt,
        pieceType: input.pieceType,
        wardrobeItemId: input.wardrobeItemId,
        status: 'queued_branding',
        stageLabel: 'branding_generation',
      });

      const qaPassed = this.qualityChecksPass({
        baseModelUrl: baseModel.model_3d_url,
        brandedModelUrl: brandedModel.model_3d_url,
      });

      if (!qaPassed) {
        throw new ServiceError('Branding quality checks failed (logo visibility/placement validation).', 502);
      }

      await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_geometry_qa');
      const geometryScope = await this.geometryScopeService.validate({
        modelUrl: brandedModel.model_3d_url,
        pieceType: input.pieceType,
      });

      if (!geometryScope.passed) {
        const shouldRetry = geometryScope.scopeScore >= 0.35;
        if (shouldRetry) {
          await this.wardrobeRepo.updatePipelineStatus(
            input.wardrobeItemId,
            'retrying_generation',
            `Geometry scope failed first pass: ${geometryScope.reasons.join(' | ')}`,
            {
              stage: 'geometry_scope_retry',
              reasons: geometryScope.reasons,
              scopeScore: geometryScope.scopeScore,
            },
          );

          const retryModel = await this.generateModelFromImage(isolation.isolatedImageUrl, {
            prompt: `${brandingPrompt} Strictly output only the garment mesh with no humanoid rig.`,
            pieceType: input.pieceType,
            wardrobeItemId: input.wardrobeItemId,
            status: 'retrying_generation',
            stageLabel: 'retry_generation',
          });

          const retryScope = await this.geometryScopeService.validate({
            modelUrl: retryModel.model_3d_url,
            pieceType: input.pieceType,
          });

          if (!retryScope.passed) {
            await this.wardrobeRepo.updatePipelineStatus(
              input.wardrobeItemId,
              'failed_geometry_scope',
              retryScope.reasons.join(' | '),
              {
                stage: 'geometry_scope_failed_after_retry',
                reasons: retryScope.reasons,
                scopeScore: retryScope.scopeScore,
              },
            );
            return;
          }

          await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
            model_3d_url: retryModel.model_3d_url,
            model_preview_url: retryModel.model_preview_url ?? baseModel.model_preview_url,
            model_base_3d_url: baseModel.model_3d_url,
            model_branded_3d_url: retryModel.model_3d_url,
            isolated_piece_image_url: isolation.isolatedImageUrl,
            segmentation_confidence: isolation.segmentationConfidence,
            geometry_scope_passed: true,
            geometry_scope_score: retryScope.scopeScore,
            generation_attempt_count: 2,
            pipeline_stage_details: {
              stage: 'done_after_retry',
              segmentation: isolation.stageDetails,
              geometry: retryScope.reasons,
            },
            placement_profile_id: placementProfile.profile_id,
            brand_applied: true,
            branding_pass_version: BRANDING_PASS_VERSION,
          });
          this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, true, isolation.segmentationConfidence, retryScope.scopeScore);
          return;
        }

        await this.wardrobeRepo.updatePipelineStatus(
          input.wardrobeItemId,
          'failed_geometry_scope',
          geometryScope.reasons.join(' | '),
          {
            stage: 'geometry_scope_failed',
            reasons: geometryScope.reasons,
            scopeScore: geometryScope.scopeScore,
          },
        );
        this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, false, isolation.segmentationConfidence, geometryScope.scopeScore);
        return;
      }

      await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
        model_3d_url: brandedModel.model_3d_url,
        model_preview_url: brandedModel.model_preview_url ?? baseModel.model_preview_url,
        model_base_3d_url: baseModel.model_3d_url,
        model_branded_3d_url: brandedModel.model_3d_url,
        isolated_piece_image_url: isolation.isolatedImageUrl,
        segmentation_confidence: isolation.segmentationConfidence,
        geometry_scope_passed: true,
        geometry_scope_score: geometryScope.scopeScore,
        generation_attempt_count: 1,
        pipeline_stage_details: {
          stage: 'done',
          segmentation: isolation.stageDetails,
          geometry: geometryScope.reasons,
        },
        placement_profile_id: placementProfile.profile_id,
        brand_applied: true,
        branding_pass_version: BRANDING_PASS_VERSION,
      });
      this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, true, isolation.segmentationConfidence, geometryScope.scopeScore);
    } catch (error) {
      await this.wardrobeRepo.updatePipelineStatus(
        input.wardrobeItemId,
        'failed',
        error instanceof Error ? error.message : 'Unknown model pipeline failure.',
      );
    }
  }

  private async shouldSkipBrandingPipeline(brandId: string): Promise<boolean> {
    if (!brandId) return false;
    const brand = await this.brandsRepository.getById(brandId);
    return brand?.name?.trim().toLowerCase() === 'zara';
  }

  private async generateModelFromImage(
    imageUrl: string,
    options: { prompt: string; pieceType: string; wardrobeItemId: string; status: ModelGenerationStatus; stageLabel: string },
  ): Promise<BlenderGenerationResult> {
    if (!this.blenderCloudService.isConfigured()) {
      await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
        stage: `${options.stageLabel}_fallback_meshy`,
        provider: 'meshy',
        reason: 'runpod_not_configured',
      });
      return this.meshyService.generate3DModelFromImage(imageUrl, { prompt: options.prompt });
    }

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
    });

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
        const artifacts = status.artifacts ?? {};
        const modelUrlCandidates = [
          artifacts.outputModelUrl,
          artifacts.modelUrl,
          artifacts.outputUrl,
          artifacts.glbUrl,
        ];
        const previewUrlCandidates = [
          artifacts.previewUrl,
          artifacts.posterUrl,
          artifacts.thumbnailUrl,
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
      }

      if (status.status === 'failed') {
        const remoteError = status.raw?.error;
        const details = typeof remoteError === 'string' ? remoteError : JSON.stringify(remoteError ?? status.raw);
        throw new ServiceError(`RunPod Blender model generation failed: ${details}`, 502);
      }

      await new Promise((resolve) => setTimeout(resolve, MODEL_GENERATION_POLL_MS));
    }

    throw new ServiceError('RunPod Blender model generation timed out before completion.', 504);
  }

  private qualityChecksPass(input: { baseModelUrl: string; brandedModelUrl: string }): boolean {
    const baseValid = input.baseModelUrl.trim().length > 0 && input.baseModelUrl.toLowerCase().endsWith('.glb');
    const brandedValid = input.brandedModelUrl.trim().length > 0 && input.brandedModelUrl.toLowerCase().endsWith('.glb');
    const urlsDiffer = input.baseModelUrl !== input.brandedModelUrl;

    return baseValid && brandedValid && urlsDiffer;
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
