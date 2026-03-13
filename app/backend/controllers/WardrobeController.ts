import { WardrobeService } from '@/app/backend/services/WardrobeService';

export class WardrobeController {
  constructor(private readonly wardrobeService = new WardrobeService()) {}

  async listByUser(userId: string) {
    return this.wardrobeService.listUserWardrobe(userId);
  }

  async analysisByUser(userId: string) {
  async listByUser(userId: string) {
    return this.wardrobeService.listUserWardrobe(userId);
  }
}
