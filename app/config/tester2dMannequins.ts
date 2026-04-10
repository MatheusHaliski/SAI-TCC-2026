export type Tester2DSlot = 'upper' | 'lower' | 'shoes' | 'accessory';

export type Tester2DAnchor = { x: number; y: number; width: number; height: number };

export type Tester2DMannequin = {
  id: 'male' | 'female';
  label: string;
  imageUrl: string;
  sprite?: { scaleX: number; offsetXPercent: number };
  canvasWidth: number;
  canvasHeight: number;
  anchors: Record<Tester2DSlot, Tester2DAnchor>;
};

export const TESTER_2D_MANNEQUINS: Tester2DMannequin[] = [
  {
    id: 'male',
    label: 'Male mannequin',
    imageUrl: '/tester2d/mannequins/male-default.png',
    sprite: { scaleX: 2, offsetXPercent: 0 },
    canvasWidth: 900,
    canvasHeight: 1600,
    anchors: {
      upper: { x: 180, y: 190, width: 540, height: 560 },
      lower: { x: 210, y: 640, width: 480, height: 540 },
      shoes: { x: 220, y: 1140, width: 460, height: 320 },
      accessory: { x: 100, y: 220, width: 700, height: 900 },
    },
  },
  {
    id: 'female',
    label: 'Female mannequin',
    imageUrl: '/tester2d/mannequins/female-default.png',
    sprite: { scaleX: 2, offsetXPercent: 100 },
    canvasWidth: 900,
    canvasHeight: 1600,
    anchors: {
      upper: { x: 190, y: 200, width: 520, height: 560 },
      lower: { x: 230, y: 640, width: 440, height: 550 },
      shoes: { x: 230, y: 1140, width: 440, height: 320 },
      accessory: { x: 120, y: 220, width: 660, height: 900 },
    },
  },
];

export const getTester2DMannequinById = (id: Tester2DMannequin['id']) =>
  TESTER_2D_MANNEQUINS.find((item) => item.id === id) ?? TESTER_2D_MANNEQUINS[0];
