#!/usr/bin/env node
/**
 * Migration: backfill baseQuality on pieces inside saiUserSavedSchemes documents.
 * Pieces are stored as an array field (pieces[]) on each scheme document.
 *
 * Tier defaults:
 *   Premium        → 3.5
 *   Limited Edition → 3.2
 *   Rare           → 3.0
 *   Standard       → 2.5
 *   (unknown)      → 2.5
 *
 * Usage:
 *   npx tsx migrations/20260527-piece-base-quality.ts [--dry-run]
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const COLLECTION = 'saiUserSavedSchemes';
const BATCH_SIZE = 400;
const BATCH_DELAY_MS = 150;

const BASE_QUALITY_BY_TIER: Record<string, number> = {
  Premium: 3.5,
  'Limited Edition': 3.2,
  Rare: 3.0,
  Standard: 2.5,
};

function defaultBaseQuality(tier?: string): number {
  return BASE_QUALITY_BY_TIER[tier ?? ''] ?? 2.5;
}

function initAdmin(): admin.app.App {
  if (admin.apps.length) return admin.apps[0]!;
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run(dryRun: boolean) {
  const app = initAdmin();
  const db = app.firestore();
  db.settings({ databaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || 'newsaidb' });

  console.log(`[piece-base-quality migration] dryRun=${dryRun}`);

  const col = db.collection(COLLECTION);
  let cursor: admin.firestore.QueryDocumentSnapshot | null = null;
  let totalDocsUpdated = 0;
  let totalPiecesPatched = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = col.limit(BATCH_SIZE);
    if (cursor) query = query.startAfter(cursor);

    const snap = await query.get();
    if (snap.empty) break;

    const toUpdate: Array<{ ref: admin.firestore.DocumentReference; pieces: unknown[] }> = [];

    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const pieces: unknown[] = Array.isArray(data.pieces) ? data.pieces : [];

      let dirty = false;
      const patched = pieces.map((p) => {
        const piece = p as Record<string, unknown>;
        if (typeof piece.baseQuality !== 'number') {
          dirty = true;
          totalPiecesPatched++;
          return { ...piece, baseQuality: defaultBaseQuality(piece.category as string | undefined) };
        }
        return piece;
      });

      if (dirty) {
        toUpdate.push({ ref: docSnap.ref, pieces: patched });
      }
    }

    if (toUpdate.length > 0 && !dryRun) {
      const batch = db.batch();
      for (const { ref, pieces } of toUpdate) {
        batch.update(ref, { pieces });
      }
      await batch.commit();
      await sleep(BATCH_DELAY_MS);
    }

    totalDocsUpdated += toUpdate.length;
    console.log(
      `  processed ${snap.docs.length} docs | schemes patched ${toUpdate.length} | cumulative ${totalDocsUpdated}`,
    );

    cursor = snap.docs[snap.docs.length - 1]!;
    if (snap.docs.length < BATCH_SIZE) break;
  }

  console.log(
    `[piece-base-quality migration] DONE — schemes updated: ${totalDocsUpdated}, pieces patched: ${totalPiecesPatched}${dryRun ? ' (dry-run, no writes)' : ''}`,
  );
}

const dryRun = process.argv.includes('--dry-run');
run(dryRun).catch((err) => {
  console.error('[piece-base-quality migration] FAILED', err);
  process.exit(1);
});
