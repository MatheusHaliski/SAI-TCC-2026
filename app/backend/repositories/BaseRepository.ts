import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

export class BaseRepository {
  protected db() {
    return getAdminFirestore();
  }

  protected nowIso() {
    return new Date().toISOString();
  }
}
