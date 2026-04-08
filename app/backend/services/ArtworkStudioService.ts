import { AdobeFireflyClient } from '@/app/backend/integrations/adobe/AdobeFireflyClient';
import { ArtworkAssetsRepository } from '@/app/backend/repositories/ArtworkAssetsRepository';
import {
  ArtworkAsset,
  ArtworkGenerationResponse,
  ArtworkPromptBuildResult,
  ArtworkStudioInput,
  ArtworkVariation,
  FireflyGenerationPayload,
  SaveArtworkRequest,
} from '@/app/backend/types/artwork-studio';
import { buildBackgroundGenerationPlan, generateBackgroundVariations } from '@/app/lib/background-ai';
import { ServiceError } from './errors';

const STYLE_DIRECTIONS = {
  editorial_fashion: 'editorial fashion composition, layered art direction, premium magazine-like background, decorative visual hierarchy',
  luxury_minimal: 'luxury editorial fashion background, refined premium composition, elegant negative space, subtle gradient transitions, high-end card-ready layout',
  futuristic_sport: 'futuristic sporty fashion artwork, dynamic motion layers, sleek graphic energy, modern premium composition',
  streetwear: 'streetwear-inspired fashion graphic background, bold layered shapes, contemporary composition, high visual attitude',
  monochrome_premium: 'monochrome premium fashion artwork, restrained black-white-silver visual language, elegant contrast and text-safe space',
} as const;

const SHAPE_DIRECTIONS = {
  diamond: 'geometric diamond accents, crystalline directional shapes',
  orb: 'soft orb-like volumetric shapes, circular accents',
  mesh: 'mesh-inspired gradients, fluid layered structures',
  panels: 'clean panel segmentation, geometric framed sections',
  mixed: 'mixed geometric editorial accents',
} as const;

const COMPOSITION_DIRECTIONS = {
  background: 'full background composition for outfit card design',
  shape_pack: 'decorative shape set, modular accent elements suitable for fashion card layering',
  overlay: 'transparent overlay-like decorative composition suitable for layering',
  frame: 'decorative premium frame/border composition for outfit card presentation',
} as const;

const PALETTE_DIRECTIONS = {
  monochrome: 'monochrome premium palette, black white silver tonal balance',
  cool_luxury: 'cool luxury palette, deep navy, cool steel and cyan-tinted highlights',
  warm_neutral: 'warm neutral palette, elegant beige, champagne and soft cocoa contrast',
  custom: 'custom color palette aligned with prompt direction',
} as const;

function ensureServerConfig() {
  const required = [
    'ADOBE_FIREFLY_CLIENT_ID',
    'ADOBE_FIREFLY_CLIENT_SECRET',
    'ADOBE_FIREFLY_ORG_ID',
    'ADOBE_FIREFLY_SCOPES',
    'ADOBE_FIREFLY_BASE_URL',
    'ADOBE_FIREFLY_TIMEOUT_MS',
    'ADOBE_FIREFLY_ENABLE_REFERENCE_IMAGE',
  ];

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new ServiceError(`Adobe Firefly is not configured. Missing: ${missing.join(', ')}`, 503);
  }
}

function normalizePrompt(input: string) {
  return input.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function buildArtworkPrompt(input: ArtworkStudioInput): ArtworkPromptBuildResult {
  const tags = [input.compositionType, input.stylePreset, input.paletteMode, input.shapeLanguage, 'fashion_ai', 'outfit_card'];
  const safeAreaText = input.safeAreaMode
    ? 'clear text-safe area, controlled visual density, preserved clean negative space for subject and typography'
    : 'balanced composition and premium editorial spacing';

  const controlText = [
    typeof input.density === 'number' ? `density ${Math.max(0, Math.min(100, input.density))}` : null,
    input.contrastLevel ? `contrast ${input.contrastLevel}` : null,
    typeof input.blurStrength === 'number' ? `blur strength ${input.blurStrength}` : null,
    typeof input.glowIntensity === 'number' ? `glow intensity ${input.glowIntensity}` : null,
    typeof input.layeringDepth === 'number' ? `layering depth ${input.layeringDepth}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const userPrompt = input.prompt.trim() || 'premium editorial fashion artwork';
  const normalizedPrompt = normalizePrompt(userPrompt);

  const finalPrompt = [
    STYLE_DIRECTIONS[input.stylePreset],
    COMPOSITION_DIRECTIONS[input.compositionType],
    SHAPE_DIRECTIONS[input.shapeLanguage],
    PALETTE_DIRECTIONS[input.paletteMode],
    safeAreaText,
    controlText,
    userPrompt,
  ]
    .filter(Boolean)
    .join(', ');

  const baseNegative = 'avoid faces, avoid full people, avoid chaotic clutter, avoid fantasy scene, avoid unreadable typography collisions, avoid noisy composition';
  const negativePrompt = [baseNegative, input.negativePrompt?.trim()].filter(Boolean).join(', ');

  return {
    normalizedPrompt,
    finalPrompt,
    negativePrompt,
    tags,
  };
}

function asVariationFromFallback(prompt: string, count: number): ArtworkVariation[] {
  const plan = buildBackgroundGenerationPlan({
    prompt,
    palette: 'cool luxury',
    style: 'editorial fashion',
    mood: 'premium',
  });

  return generateBackgroundVariations(plan, prompt, count).map((item, index) => ({
    variation_id: `fallback_${index + 1}`,
    preview_url: item.image,
    output_url: item.image,
    provider_job_id: null,
    width: 1200,
    height: 800,
    metadata: { seed: item.seed, fallback: true },
  }));
}

export class ArtworkStudioService {
  constructor(
    private readonly fireflyClient = new AdobeFireflyClient(),
    private readonly assetsRepository = new ArtworkAssetsRepository(),
  ) {}

  private validateInput(input: ArtworkStudioInput) {
    if (!input.user_id?.trim()) throw new ServiceError('Missing user_id.', 400);
    if (!input.prompt?.trim()) throw new ServiceError('Prompt is required.', 400);
  }

  async generate(input: ArtworkStudioInput): Promise<ArtworkGenerationResponse> {
    this.validateInput(input);

    const promptBuild = buildArtworkPrompt(input);
    const variationCount = Math.min(4, Math.max(3, Number(input.variationCount ?? 4)));
    const fireflyEnabled = process.env.NEXT_PUBLIC_ENABLE_ADOBE_FIREFLY_STUDIO === 'true';

    if (!fireflyEnabled) {
      return {
        provider: 'adobe_firefly',
        prompt: promptBuild,
        variations: asVariationFromFallback(promptBuild.finalPrompt, variationCount),
        fallbackUsed: true,
        warnings: ['Adobe Firefly studio is disabled. Showing local fallback results.'],
      };
    }

    ensureServerConfig();

    const useReferenceImage = process.env.ADOBE_FIREFLY_ENABLE_REFERENCE_IMAGE === 'true' && !!input.referenceImageUrl;

    const payload: FireflyGenerationPayload = {
      prompt: promptBuild.finalPrompt,
      negativePrompt: promptBuild.negativePrompt,
      width: 1200,
      height: 800,
      numVariations: variationCount,
      ...(useReferenceImage ? { referenceImageUrl: input.referenceImageUrl } : {}),
    };

    try {
      const result = await this.fireflyClient.generate(payload);
      if (!result.variations.length) {
        throw new ServiceError('Adobe Firefly returned no results. Please try a different prompt.', 502);
      }

      return {
        provider: 'adobe_firefly',
        prompt: promptBuild,
        variations: result.variations,
        warnings: useReferenceImage ? [] : input.referenceImageUrl ? ['Reference image skipped by configuration.'] : [],
      };
    } catch (error) {
      console.error('artwork-studio.generate error', error);
      throw error instanceof ServiceError
        ? error
        : new ServiceError(error instanceof Error ? error.message : 'Artwork generation failed.', 502);
    }
  }

  async saveSelection(request: SaveArtworkRequest): Promise<ArtworkAsset> {
    const promptBuild = buildArtworkPrompt(request.input);
    const now = new Date().toISOString();

    return this.assetsRepository.create({
      user_id: request.user_id,
      prompt: request.input.prompt,
      normalized_prompt: promptBuild.normalizedPrompt,
      negative_prompt: promptBuild.negativePrompt,
      composition_type: request.input.compositionType,
      style_preset: request.input.stylePreset,
      palette_mode: request.input.paletteMode,
      shape_language: request.input.shapeLanguage,
      density: request.input.density,
      contrast_level: request.input.contrastLevel,
      blur_strength: request.input.blurStrength,
      glow_intensity: request.input.glowIntensity,
      layering_depth: request.input.layeringDepth,
      safe_area_mode: request.input.safeAreaMode,
      reference_image_url: request.input.referenceImageUrl ?? null,
      provider: 'adobe_firefly',
      provider_job_id: request.variation.provider_job_id ?? null,
      preview_url: request.variation.preview_url,
      output_url: request.variation.output_url,
      thumbnail_url: request.variation.thumbnail_url ?? null,
      tags: promptBuild.tags,
      width: request.variation.width ?? null,
      height: request.variation.height ?? null,
      created_at: now,
      updated_at: now,
    });
  }

  async listByUser(userId: string) {
    if (!userId.trim()) throw new ServiceError('user_id is required.', 400);
    return this.assetsRepository.listByUser(userId.trim());
  }
}
