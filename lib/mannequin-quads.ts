import { Quad } from './texture-map';

/**
 * Torso quad coordinates per mannequin ID, in pixels relative to the
 * mannequin's original canvas size (canvasWidth × canvasHeight).
 *
 * Use the QuadCalibrator component in AdminAssetStudio to click the four
 * torso corners and get the correct values for each mannequin image.
 * Click order: Top-Left → Top-Right → Bottom-Left → Bottom-Right.
 *
 * These are placeholder values — calibrate with the real mannequin images.
 */
export const MANNEQUIN_TORSO_QUADS: Record<string, Quad> = {
  male_v1: {
    topLeft:     { x: 340, y: 480 },
    topRight:    { x: 720, y: 480 },
    bottomLeft:  { x: 310, y: 980 },
    bottomRight: { x: 750, y: 980 },
  },
  female_v1: {
    topLeft:     { x: 350, y: 460 },
    topRight:    { x: 700, y: 460 },
    bottomLeft:  { x: 320, y: 940 },
    bottomRight: { x: 730, y: 940 },
  },
};

export function getQuadForMannequin(mannequinId: string): Quad | null {
  return MANNEQUIN_TORSO_QUADS[mannequinId] ?? null;
}
