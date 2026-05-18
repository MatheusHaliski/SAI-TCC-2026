import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query, Timestamp } from 'firebase/firestore';
import { COLLECTIONS, LEGACY_COLLECTIONS } from '../app/lib/collections';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

async function main() {
  const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  const db = getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || 'newsaidb');
  console.log('Database:', process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || 'newsaidb');
  for (const name of Object.values(COLLECTIONS)) {
    const snap = await getDocs(query(collection(db, name), limit(1)));
    console.log(`${name}: ${snap.size} doc(s)`);
    const data = snap.docs[0]?.data();
    if (data?.createdAt && !(data.createdAt instanceof Timestamp)) throw new Error(`${name}.createdAt is not Timestamp`);
    if (data?.is_active !== undefined && typeof data.is_active !== 'boolean') throw new Error(`${name}.is_active is not boolean`);
  }
  console.log('Legacy collection names (must not be used in app code):', LEGACY_COLLECTIONS.join(', '));
}

main().catch((e) => { console.error(e); process.exit(1); });
