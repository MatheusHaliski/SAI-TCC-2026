import { GarmentAnchors, WardrobePieceType } from '@/app/lib/fashion-ai/types/wardrobe-fit';

export function estimateGarmentAnchors(pieceType: WardrobePieceType): GarmentAnchors | null {
  if (pieceType === 'top') {
    return {
      neckCenter: { x: 0.5, y: 0.12 },
      shoulderLeft: { x: 0.24, y: 0.18 },
      shoulderRight: { x: 0.76, y: 0.18 },
      waistLeft: { x: 0.3, y: 0.68 },
      waistRight: { x: 0.7, y: 0.68 },
      hemCenter: { x: 0.5, y: 0.82 },
    };
  }

  if (pieceType === 'bottom') {
    return {
      waistLeft: { x: 0.34, y: 0.12 },
      waistRight: { x: 0.66, y: 0.12 },
      hemCenter: { x: 0.5, y: 0.88 },
    };
  }

  return null;
}
