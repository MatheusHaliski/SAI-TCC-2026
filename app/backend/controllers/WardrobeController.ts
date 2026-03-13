import { WardrobeService } from '@/app/backend/services/WardrobeService';

export class WardrobeController {
  constructor(private readonly wardrobeService = new WardrobeService()) {}

<<<<<<< HEAD
  async listByUser(userId: string) {
    return this.wardrobeService.listUserWardrobe(userId);
  }

  async analysisByUser(userId: string) {
=======
  async listByUser(userId: number) {
    return this.wardrobeService.listUserWardrobe(userId);
  }

  async analysisByUser(userId: number) {
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
    return this.wardrobeService.getWardrobeAnalysis(userId);
  }
}
