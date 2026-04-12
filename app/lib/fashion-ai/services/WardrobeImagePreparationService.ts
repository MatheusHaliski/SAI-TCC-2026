import { getAdminStorageBucket } from '@/app/lib/firebaseAdmin';
import { WardrobeRepository } from '@/app/lib/fashion-ai/repositories/WardrobeRepository';
import { classifyGarmentGender, classifyGarmentType } from '@/app/lib/fashion-ai/utils/garment-classification';
import { estimateGarmentAnchors } from '@/app/lib/fashion-ai/utils/garment-anchors';
import { normalizeGarmentAsset } from '@/app/lib/fashion-ai/utils/garment-normalization';
import { detectHumanoidPresence, extractGarmentOnly, validateSourceImage } from '@/app/lib/fashion-ai/utils/image-processing';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';
import { ServiceError } from '@/app/backend/services/errors';
import { ImageSegmentationService } from '@/app/backend/services/ImageSegmentationService';

export class WardrobeImagePreparationService {
  constructor(
    private readonly wardrobeRepository = new WardrobeRepository(),
    private readonly segmentationService = new ImageSegmentationService(),
  ) {}

  async processPieceForTester2D(pieceId: string): Promise<WardrobeFitProfile> {
    const piece = await this.wardrobeRepository.getById(pieceId);
    if (!piece) throw new ServiceError('Wardrobe piece not found.', 404);

    const sourceImage = piece.image_url?.trim();
    if (!sourceImage) throw new ServiceError('Wardrobe piece has no source image.', 400);

    const warnings: string[] = [];
    const validation = validateSourceImage(sourceImage);
    warnings.push(...validation.warnings);

    const inferredType = classifyGarmentType({ pieceType: piece.piece_type, name: piece.name });
    const inferredGender = classifyGarmentGender({ gender: piece.gender, name: piece.name });

    const baseProfile: WardrobeFitProfile = {
      pieceType: inferredType,
      targetGender: inferredGender,
      preparationStatus: 'processing',
      originalImageUrl: sourceImage,
      preparedAssetUrl: null,
      preparedMaskUrl: null,
      compatibleMannequins: inferredGender === 'male' ? ['male_v1'] : inferredGender === 'female' ? ['female_v1'] : ['male_v1', 'female_v1'],
      fitMode: 'masked-overlay',
      normalizedBBox: null,
      garmentAnchors: null,
      validationWarnings: warnings,
      preparationError: null,
      preparedAt: null,
      updatedAt: new Date().toISOString(),
    };

    await this.wardrobeRepository.updateFitProfile(pieceId, baseProfile);

    try {
      const segmentation = await this.segmentationService.segment({ imageUrl: sourceImage, pieceType: inferredType });
      const isolated = extractGarmentOnly(segmentation.segmentedPngUrl);
      const humanoid = detectHumanoidPresence(sourceImage);
      const normalization = normalizeGarmentAsset(isolated.preparedAssetUrl);

      let preparationStatus: WardrobeFitProfile['preparationStatus'] = 'ready';
      if (humanoid.detected && !isolated.confident) {
        warnings.push('human_model_detected', 'garment_isolation_uncertain');
        preparationStatus = 'preview_only';
      }

      if (!validation.isClothingLikely) {
        warnings.push('image_not_confidently_clothing');
        preparationStatus = 'failed';
      }

      const uploadedAssetUrl = await this.uploadPreparedAsset(pieceId, isolated.preparedAssetUrl, 'asset.png');
      const uploadedMaskUrl = segmentation.maskUrl
        ? await this.uploadPreparedAsset(pieceId, segmentation.maskUrl, 'mask.png')
        : null;

      const fitProfile: WardrobeFitProfile = {
        ...baseProfile,
        preparationStatus,
        preparedAssetUrl: uploadedAssetUrl,
        preparedMaskUrl: uploadedMaskUrl,
        fitMode: uploadedMaskUrl ? 'masked-overlay' : 'overlay',
        normalizedBBox: normalization.normalizedBBox,
        garmentAnchors: estimateGarmentAnchors(inferredType),
        validationWarnings: Array.from(new Set(warnings)),
        preparationError: preparationStatus === 'failed' ? 'Unable to verify clothing-only asset.' : null,
        preparedAt: preparationStatus === 'ready' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      };

      await this.wardrobeRepository.updateFitProfile(pieceId, fitProfile);
      return fitProfile;
    } catch (error) {
      const failedProfile: WardrobeFitProfile = {
        ...baseProfile,
        preparationStatus: 'failed',
        validationWarnings: Array.from(new Set([...warnings, 'processing_exception'])),
        preparationError: error instanceof Error ? error.message : 'Unknown preparation failure',
        updatedAt: new Date().toISOString(),
      };
      await this.wardrobeRepository.updateFitProfile(pieceId, failedProfile);
      return failedProfile;
    }
  }

  private async uploadPreparedAsset(pieceId: string, sourceUrl: string, filename: 'asset.png' | 'mask.png'): Promise<string> {
    const response = await fetch(sourceUrl);
    if (!response.ok) return sourceUrl;

    const contentType = response.headers.get('content-type') ?? 'image/png';
    const buffer = Buffer.from(await response.arrayBuffer());
    const bucket = getAdminStorageBucket();
    const objectPath = `fai/wardrobe/prepared/${pieceId}/${filename}`;
    const file = bucket.file(objectPath);

    await file.save(buffer, {
      contentType,
      resumable: false,
      metadata: { cacheControl: 'public,max-age=3600' },
    });

    return `https://storage.googleapis.com/${bucket.name}/${objectPath}`;
  }
}
