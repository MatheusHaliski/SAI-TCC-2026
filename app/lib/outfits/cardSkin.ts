'use client';

import { db } from '@/app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/app/lib/collections';

export type CardSkinId = 'atelier' | 'spread' | 'index' | 'trading' | 'fai_max' | 'stub' | 'specimen';

export const DEFAULT_CARD_SKIN: CardSkinId = 'atelier';

export async function updateCardSkin(schemeId: string, skinId: CardSkinId): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USER_SAVED_SCHEMES, schemeId), { cardSkin: skinId });
}
