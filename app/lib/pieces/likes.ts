'use client';

import { db } from '@/app/lib/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { COLLECTIONS } from '@/app/lib/collections';

/** Firestore path: saiUserSavedSchemes/{schemeId}/pieceLikes/{pieceId} */
function pieceLikesDoc(schemeId: string, pieceId: string) {
  return doc(db, COLLECTIONS.USER_SAVED_SCHEMES, schemeId, 'pieceLikes', pieceId);
}

/** Firestore path: …/pieceLikes/{pieceId}/likedBy/{userId} */
function likedByDoc(schemeId: string, pieceId: string, userId: string) {
  return doc(
    collection(pieceLikesDoc(schemeId, pieceId), 'likedBy'),
    userId,
  );
}

export type ToggleLikeResult = { liked: boolean; likes: number };

/**
 * Idempotent like/unlike toggle.
 * Uses a Firestore transaction to guarantee atomic read-modify-write of the
 * likedBy sentinel doc and the aggregated likes counter simultaneously.
 */
export async function toggleLikePiece(
  schemeId: string,
  pieceId: string,
  userId: string,
): Promise<ToggleLikeResult> {
  const likeRef = pieceLikesDoc(schemeId, pieceId);
  const sentinelRef = likedByDoc(schemeId, pieceId, userId);

  return runTransaction(db, async (tx: import('firebase/firestore').Transaction) => {
    const sentinelSnap = await tx.get(sentinelRef);
    const alreadyLiked = sentinelSnap.exists();

    if (alreadyLiked) {
      tx.delete(sentinelRef);
      tx.set(likeRef, { likes: increment(-1) }, { merge: true });
    } else {
      tx.set(sentinelRef, { createdAt: serverTimestamp() });
      tx.set(likeRef, { likes: increment(1) }, { merge: true });
    }

    const likeSnap = await tx.get(likeRef);
    const prevCount: number = likeSnap.exists() ? (likeSnap.data()?.likes ?? 0) : 0;
    const nextCount = Math.max(0, prevCount + (alreadyLiked ? -1 : 1));

    return { liked: !alreadyLiked, likes: nextCount };
  });
}

/** Returns whether the current user has liked a specific piece. */
export async function isPieceLikedBy(
  schemeId: string,
  pieceId: string,
  userId: string,
): Promise<boolean> {
  const snap = await getDoc(likedByDoc(schemeId, pieceId, userId));
  return snap.exists();
}

/** Returns the aggregated like count for a piece (0 if no document yet). */
export async function getPieceLikes(schemeId: string, pieceId: string): Promise<number> {
  const snap = await getDoc(pieceLikesDoc(schemeId, pieceId));
  return snap.exists() ? (snap.data()?.likes ?? 0) : 0;
}
