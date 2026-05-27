#!/usr/bin/env node
/**
 * Migration: backfill cardSkin = 'atelier' on all saiUserSavedSchemes documents
 * that do not yet have a cardSkin field.
 *
 * Usage:
 *   npx tsx migrations/20260527-card-skin.ts [--dry-run]
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const COLLECTION = 'saiUserSavedSchemes';
const DEFAULT_SKIN = 'atelier';
const BATCH_SIZE = 400;
const BATCH_DELAY_MS = 150;

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

  console.log(`[card-skin migration] dryRun=${dryRun}`);

  const col = db.collection(COLLECTION);
  let cursor: admin.firestore.QueryDocumentSnapshot | null = null;
  let totalUpdated = 0;
  let totalSkipped = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = col.limit(BATCH_SIZE);
    if (cursor) query = query.startAfter(cursor);

    const snap = await query.get();
    if (snap.empty) break;

    const toUpdate = snap.docs.filter((d) => !('cardSkin' in d.data()));
    totalSkipped += snap.docs.length - toUpdate.length;

    if (toUpdate.length > 0 && !dryRun) {
      const batch = db.batch();
      for (const d of toUpdate) {
        batch.update(d.ref, { cardSkin: DEFAULT_SKIN });
      }
      await batch.commit();
      await sleep(BATCH_DELAY_MS);
    }

    totalUpdated += toUpdate.length;
    console.log(
      `  processed ${snap.docs.length} docs | updated ${toUpdate.length} | cumulative updated ${totalUpdated}`,
    );

    cursor = snap.docs[snap.docs.length - 1]!;
    if (snap.docs.length < BATCH_SIZE) break;
  }

  console.log(
    `[card-skin migration] DONE — updated: ${totalUpdated}, already set: ${totalSkipped}${dryRun ? ' (dry-run, no writes)' : ''}`,
  );
}

const dryRun = process.argv.includes('--dry-run');
run(dryRun).catch((err) => {
  console.error('[card-skin migration] FAILED', err);
  process.exit(1);
});
