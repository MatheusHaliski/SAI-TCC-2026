import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';

export class WardrobeService {
  constructor(private readonly wardrobeRepo = new WardrobeItemsRepository()) {}

  async listUserWardrobe(userId: number) {
    return this.wardrobeRepo.findByUser(userId);
  }

  async getWardrobeAnalysis(userId: number) {
    return this.wardrobeRepo.getAnalysisByUser(userId);
  }
}
