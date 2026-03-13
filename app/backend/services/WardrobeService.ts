import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';

export class WardrobeService {
  constructor(private readonly wardrobeRepo = new WardrobeItemsRepository()) {}

  async listUserWardrobe(userId: string) {
    return this.wardrobeRepo.findByUser(userId);
  }

  async getWardrobeAnalysis(userId: string) {
    return this.wardrobeRepo.getAnalysisByUser(userId);
  }
}
