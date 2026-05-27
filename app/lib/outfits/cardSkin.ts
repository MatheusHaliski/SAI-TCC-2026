'use client';

import { db } from '@/app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export type CardSkinId = 'atelier' | 'spread' | 'index' | 'trading' | 'fai_max' | 'stub' | 'specimen';

export const DEFAULT_CARD_SKIN: CardSkinId = 'atelier';

export async function updateCardSkin(outfitId: string, skinId: CardSkinId): Promise<void> {
  await updateDoc(doc(db, 'outfits', outfitId), { cardSkin: skinId });
}
