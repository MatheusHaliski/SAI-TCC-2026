import { FittedGarmentLayer, MannequinProfile } from '@/app/lib/fashion-ai/types/mannequin';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';
import { isPieceCompatibleWithMannequin } from '@/app/lib/fashion-ai/utils/garment-compatibility';

export class MannequinFitService {
  buildFittedGarmentLayer(args: {
    mannequin: MannequinProfile;
    fitProfile: WardrobeFitProfile;
  }): FittedGarmentLayer {
    const { mannequin, fitProfile } = args;

    if (!isPieceCompatibleWithMannequin(fitProfile, mannequin.id, mannequin)) {
      throw new Error('Incompatible piece for mannequin or piece is not ready.');
    }

    const slot = mannequin.slots[fitProfile.pieceType];
    if (!slot) throw new Error(`Slot ${fitProfile.pieceType} not available for mannequin ${mannequin.id}.`);

    const bbox = slot.bbox;
    const normalizedBBox = fitProfile.normalizedBBox;
    const hasUsableNormalizedBBox =
      Boolean(normalizedBBox) &&
      (normalizedBBox?.w ?? 0) > 0.01 &&
      (normalizedBBox?.h ?? 0) > 0.01 &&
      (normalizedBBox?.w ?? 0) <= 1 &&
      (normalizedBBox?.h ?? 0) <= 1;

    // When the prepared garment image still contains extra transparent/white padding,
    // normalizedBBox describes where the garment content sits inside that image.
    // We project the full image so that the garment bbox fits exactly into the mannequin slot.
    const width = hasUsableNormalizedBBox ? bbox.w / (normalizedBBox?.w ?? 1) : bbox.w;
    const height = hasUsableNormalizedBBox ? bbox.h / (normalizedBBox?.h ?? 1) : bbox.h;
    const x = hasUsableNormalizedBBox ? bbox.x - (normalizedBBox?.x ?? 0) * width : bbox.x;
    const y = hasUsableNormalizedBBox ? bbox.y - (normalizedBBox?.y ?? 0) * height : bbox.y;

    return {
      assetUrl: fitProfile.preparedAssetUrl!,
      x,
      y,
      width,
      height,
      clipMaskUrl: slot.clipMaskUrl ?? fitProfile.preparedMaskUrl ?? null,
      slot: fitProfile.pieceType,
    };
  }
}
