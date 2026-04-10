export type Tester2DSlot = 'upper' | 'lower' | 'shoes' | 'accessory';

export type Tester2DSlotBounds = { x: number; y: number; width: number; height: number };

export type Tester2DMannequin = {
  id: 'male' | 'female';
  label: string;
  imageUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  slots: {
    upper: Tester2DSlotBounds;
    lower: Tester2DSlotBounds;
    shoes: Tester2DSlotBounds;
    accessory?: Tester2DSlotBounds;
  };
};

export const TESTER_2D_MANNEQUINS: Tester2DMannequin[] = [
  {
    id: 'male',
    label: 'Male mannequin',
    imageUrl: '/tester2d/mannequins/male-default.png',
    canvasWidth: 1200,
    canvasHeight: 2000,
    slots: {
      upper: { x: 315, y: 430, width: 570, height: 600 },
      lower: { x: 330, y: 980, width: 540, height: 770 },
      shoes: { x: 360, y: 1700, width: 480, height: 210 },
      accessory: { x: 250, y: 340, width: 700, height: 1200 },
    },
  },
  {
    id: 'female',
    label: 'Female mannequin',
    imageUrl: '/tester2d/mannequins/female-default.png',
    canvasWidth: 1200,
    canvasHeight: 2000,
    slots: {
      upper: { x: 330, y: 420, width: 540, height: 610 },
      lower: { x: 345, y: 965, width: 510, height: 790 },
      shoes: { x: 370, y: 1710, width: 460, height: 205 },
      accessory: { x: 260, y: 330, width: 680, height: 1220 },
    },
  },
];

export const getTester2DMannequinById = (id: Tester2DMannequin['id']) =>
  TESTER_2D_MANNEQUINS.find((item) => item.id === id) ?? TESTER_2D_MANNEQUINS[0];
