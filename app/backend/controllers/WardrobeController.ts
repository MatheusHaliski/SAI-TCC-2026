import { WardrobeService } from '@/app/backend/services/WardrobeService';

export class WardrobeController {
  constructor(private readonly wardrobeService = new WardrobeService()) {}

  async listByUser(userId: number) {
    return this.wardrobeService.listUserWardrobe(userId);
  }

  async analysisByUser(userId: number) {
    return this.wardrobeService.getWardrobeAnalysis(userId);
  }
}
