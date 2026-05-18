#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const BATCH_LIMIT = 500;
const BATCH_DELAY_MS = 100;
const DRY_RUN = process.argv.includes('--dry-run');

const SOURCE_KEY_PATH = process.env.SOURCE_KEY;
const DEST_KEY_PATH = process.env.DEST_KEY;

if (!SOURCE_KEY_PATH || !DEST_KEY_PATH) {
  console.error('❌ Missing SOURCE_KEY or DEST_KEY in environment variables.');
  process.exit(1);
}

function loadServiceAccount(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Service account file not found: ${resolvedPath}`);
  }
  return JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
}

const sourceServiceAccount = loadServiceAccount(SOURCE_KEY_PATH);
const destServiceAccount = loadServiceAccount(DEST_KEY_PATH);

const sourceApp = admin.initializeApp(
  { credential: admin.credential.cert(sourceServiceAccount) },
  'source-app'
);
const destApp = admin.initializeApp(
  { credential: admin.credential.cert(destServiceAccount) },
  'dest-app'
);

const sourceDb = sourceApp.firestore();
const destDb = destApp.firestore();

const collectionMappings = {
  'sai-brands': 'saiBrands',
  'sai-markets': 'saiMarkets',
  'sai-pieceItems': 'saiPieceItems',
  'sai-pipelineJobs': 'saiPipelineJobs',
  'sai-scheme': 'saiSchemes',
  'sai-schemeitem': 'saiSchemeItems',
  'sai-usercontrol': 'saiUsers',
  VSupsercontrol: 'saiUsers',
  'sai-usersavedschemes': 'saiUserSavedSchemes',
  'sai-wardrobeItems': 'saiWardrobeItems',
  outfit_selection_2d: 'outfitSelections',
};

const report = {
  startedAt: new Date().toISOString(),
  dryRun: DRY_RUN,
  collections: {},
  conversions: {
    dateFieldsConverted: 0,
    nullFieldsRemoved: 0,
    booleansNormalized: 0,
    numbersNormalized: 0,
    credentialsMoved: 0,
    slugAdded: 0,
  },
  errors: [],
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isLikelyAutoId(id) {
  return /^[A-Za-z0-9_-]{20,}$/.test(id);
}

function normalizeDocData(data, sourceCollection) {
  const normalized = { ...data };

  const dateFields = ['created_at', 'updated_at', 'createdAt'];
  for (const field of dateFields) {
    const value = normalized[field];
    if (typeof value === 'string') {
      const parsedDate = new Date(value);
      if (!Number.isNaN(parsedDate.getTime())) {
        normalized[field] = admin.firestore.Timestamp.fromDate(parsedDate);
        report.conversions.dateFieldsConverted += 1;
      }
    }
  }

  if (sourceCollection === 'sai-brands') {
    if (normalized.logo_url === null) {
      delete normalized.logo_url;
      report.conversions.nullFieldsRemoved += 1;
    }
    if (typeof normalized.is_active === 'string') {
      const normalizedBool = normalized.is_active.toLowerCase() === 'true';
      normalized.is_active = normalizedBool;
      report.conversions.booleansNormalized += 1;
    }
  }

  if (
    (sourceCollection === 'sai-usercontrol' || sourceCollection === 'VSupsercontrol') &&
    typeof normalized.passwordIterations === 'string'
  ) {
    const parsed = Number(normalized.passwordIterations);
    if (!Number.isNaN(parsed)) {
      normalized.passwordIterations = parsed;
      report.conversions.numbersNormalized += 1;
    }
  }

  return normalized;
}

async function writeInBatches(ops) {
  for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
    const chunk = ops.slice(i, i + BATCH_LIMIT);
    if (!DRY_RUN) {
      const batch = destDb.batch();
      for (const op of chunk) {
        batch.set(op.ref, op.data, { merge: true });
      }
      await batch.commit();
    }
    await delay(BATCH_DELAY_MS);
  }
}

async function migrateCollection(sourceCollection, targetCollection) {
  const snapshot = await sourceDb.collection(sourceCollection).get();
  const total = snapshot.size;

  report.collections[targetCollection] = {
    sourceCollection,
    targetCollection,
    total,
    migrated: 0,
    skippedExisting: 0,
    failures: 0,
  };

  const writeOps = [];

  let processed = 0;
  for (const doc of snapshot.docs) {
    try {
      const sourceData = normalizeDocData(doc.data(), sourceCollection);
      const targetDocRef = destDb.collection(targetCollection).doc(doc.id);
      const targetExists = await targetDocRef.get();

      if (targetExists.exists) {
        report.collections[targetCollection].skippedExisting += 1;
        processed += 1;
        console.log(`[${targetCollection}] ${processed}/${total} documentos migrados`);
        continue;
      }

      if (sourceCollection === 'sai-brands' && !isLikelyAutoId(doc.id)) {
        sourceData.slug = doc.id;
        report.conversions.slugAdded += 1;
      }

      if (targetCollection === 'saiUsers') {
        const {
          passwordHash,
          passwordSalt,
          passwordHashAlgorithm,
          passwordIterations,
          ...publicUserData
        } = sourceData;

        writeOps.push({ ref: targetDocRef, data: publicUserData });

        const hasCredentials =
          passwordHash || passwordSalt || passwordHashAlgorithm || passwordIterations;

        if (hasCredentials) {
          const credentialsRef = targetDocRef
            .collection('credentials')
            .doc('primary');

          writeOps.push({
            ref: credentialsRef,
            data: {
              passwordHash,
              passwordSalt,
              passwordHashAlgorithm,
              passwordIterations,
              migratedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
          });
          report.conversions.credentialsMoved += 1;
        }
      } else {
        writeOps.push({ ref: targetDocRef, data: sourceData });
      }

      processed += 1;
      report.collections[targetCollection].migrated += 1;
      console.log(`[${targetCollection}] ${processed}/${total} documentos migrados`);
    } catch (error) {
      processed += 1;
      report.collections[targetCollection].failures += 1;
      report.errors.push({
        collection: sourceCollection,
        documentId: doc.id,
        message: error.message,
      });
      console.error(
        `❌ Erro ao migrar ${sourceCollection}/${doc.id}: ${error.message}`
      );
      console.log(`[${targetCollection}] ${processed}/${total} documentos migrados`);
    }
  }

  await writeInBatches(writeOps);
}

const firestoreIndexes = {
  indexes: [
    {
      collectionGroup: 'saiBrands',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'is_active', order: 'ASCENDING' },
        { fieldPath: 'name', order: 'ASCENDING' },
      ],
    },
    {
      collectionGroup: 'saiUsers',
      queryScope: 'COLLECTION',
      fields: [{ fieldPath: 'email', order: 'ASCENDING' }],
    },
    {
      collectionGroup: 'saiUsers',
      queryScope: 'COLLECTION',
      fields: [{ fieldPath: 'createdAt', order: 'DESCENDING' }],
    },
    {
      collectionGroup: 'saiPipelineJobs',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'saiWardrobeItems',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'saiUserSavedSchemes',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'userId', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' },
      ],
    },
  ],
  fieldOverrides: [],
};

async function run() {
  const startedAtMs = Date.now();

  try {
    const collections = Object.entries(collectionMappings);

    await Promise.all(
      collections.map(([sourceCollection, targetCollection]) =>
        migrateCollection(sourceCollection, targetCollection)
      )
    );

    fs.writeFileSync(
      path.resolve('firestore.indexes.json'),
      JSON.stringify(firestoreIndexes, null, 2)
    );

    report.finishedAt = new Date().toISOString();
    report.durationMs = Date.now() - startedAtMs;

    fs.writeFileSync(
      path.resolve('migration-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n✅ Migração finalizada com sucesso.');
    console.log(`Dry run: ${DRY_RUN}`);
    console.log(`Duração: ${report.durationMs} ms`);
    console.log('Relatório: migration-report.json');
    console.log('Índices: firestore.indexes.json');
  } catch (error) {
    report.finishedAt = new Date().toISOString();
    report.durationMs = Date.now() - startedAtMs;
    report.errors.push({
      collection: 'global',
      documentId: null,
      message: error.message,
    });

    fs.writeFileSync(
      path.resolve('migration-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.error('❌ Erro fatal na migração:', error);
    process.exitCode = 1;
  } finally {
    await Promise.allSettled([sourceApp.delete(), destApp.delete()]);
  }
}

run();
