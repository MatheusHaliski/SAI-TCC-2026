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
    const width = bbox.w;
    const height = bbox.h;

    return {
      assetUrl: fitProfile.preparedAssetUrl!,
      x: bbox.x,
      y: bbox.y,
      width,
      height,
      clipMaskUrl: slot.clipMaskUrl ?? fitProfile.preparedMaskUrl ?? null,
      slot: fitProfile.pieceType,
    };
  }
}
