import type { CardSkinId } from '@/app/lib/outfit-card';
import CardAtelier from './CardAtelier';
import CardSpread from './CardSpread';
import CardIndex from './CardIndex';
import CardTrading from './CardTrading';
import CardFAIMax from './CardFAIMax';
import CardStub from './CardStub';
import CardSpecimen from './CardSpecimen';

export type SkinEntry = {
  id: CardSkinId;
  labelPt: string;
  labelEn: string;
  Component: React.ComponentType<{ data: import('@/app/lib/outfit-card').OutfitCardData; showHero?: boolean }>;
  thumbHint: string;
};

export const SKIN_REGISTRY: SkinEntry[] = [
  {
    id: 'atelier',
    labelPt: 'Atelier',
    labelEn: 'Atelier',
    Component: CardAtelier,
    thumbHint: 'Minimal refinado, branco puro',
  },
  {
    id: 'spread',
    labelPt: 'Spread',
    labelEn: 'Spread',
    Component: CardSpread,
    thumbHint: 'Editorial de magazine',
  },
  {
    id: 'index',
    labelPt: 'Índice',
    labelEn: 'Index',
    Component: CardIndex,
    thumbHint: 'Cartão de referência',
  },
  {
    id: 'trading',
    labelPt: 'Trading',
    labelEn: 'Trading',
    Component: CardTrading,
    thumbHint: 'Card colecionável',
  },
  {
    id: 'fai_max',
    labelPt: 'FAI Max',
    labelEn: 'FAI Max',
    Component: CardFAIMax,
    thumbHint: 'Maximalista laranja FAI',
  },
  {
    id: 'stub',
    labelPt: 'Stub',
    labelEn: 'Stub',
    Component: CardStub,
    thumbHint: 'Recibo / ticket',
  },
  {
    id: 'specimen',
    labelPt: 'Specimen',
    labelEn: 'Specimen',
    Component: CardSpecimen,
    thumbHint: 'Ficha técnica',
  },
];

export function getSkinById(id: CardSkinId): SkinEntry {
  return SKIN_REGISTRY.find((s) => s.id === id) ?? SKIN_REGISTRY[0]!;
}
