import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { WardrobeFitProfile, WardrobeItemDocument } from '@/app/lib/fashion-ai/types/wardrobe-fit';

const COLLECTION = 'sai-wardrobeItems';

export class WardrobeRepository {
  async getById(pieceId: string): Promise<WardrobeItemDocument | null> {
    const snap = await getAdminFirestore().collection(COLLECTION).doc(pieceId).get();
    if (!snap.exists) return null;
    const data = snap.data() as Record<string, unknown>;

    return {
      id: snap.id,
      name: String(data.name ?? ''),
      image_url: String(data.image_url ?? ''),
      piece_type: typeof data.piece_type === 'string' ? data.piece_type : undefined,
      gender: typeof data.gender === 'string' ? data.gender : undefined,
      createdAt: typeof data.created_at === 'string' ? data.created_at : undefined,
      updatedAt: typeof data.updated_at === 'string' ? data.updated_at : undefined,
      fitProfile: (data.fitProfile as WardrobeFitProfile | undefined) ?? undefined,
    };
  }

  async updateFitProfile(pieceId: string, fitProfile: WardrobeFitProfile): Promise<void> {
    await getAdminFirestore().collection(COLLECTION).doc(pieceId).set({
      fitProfile,
      updated_at: new Date().toISOString(),
    }, { merge: true });
  }

  async markPending(pieceId: string, imageUrl: string, pieceType: string, gender: string): Promise<void> {
    const now = new Date().toISOString();
    await getAdminFirestore().collection(COLLECTION).doc(pieceId).set({
      fitProfile: {
        pieceType: pieceType as WardrobeFitProfile['pieceType'],
        targetGender: (gender as WardrobeFitProfile['targetGender']) || 'unisex',
        preparationStatus: 'pending',
        originalImageUrl: imageUrl,
        compatibleMannequins: ['male_v1', 'female_v1'],
        fitMode: 'overlay',
        validationWarnings: [],
        preparationError: null,
        preparedAt: null,
        updatedAt: now,
      },
      updated_at: now,
    }, { merge: true });
  }
}
