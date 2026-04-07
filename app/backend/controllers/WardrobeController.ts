import { WardrobeService } from '@/app/backend/services/WardrobeService';

export class WardrobeController {
  constructor(private readonly wardrobeService = new WardrobeService()) {}

  async listByUser(userId: string) {
    return this.wardrobeService.listUserWardrobe(userId);
  }

  async analysisByUser(userId: string) {
    return this.wardrobeService.getWardrobeAnalysis(userId);
  }

  async create(input: Record<string, unknown>) {
    return this.wardrobeService.createWardrobeItem(input);
  }

  async listDiscoverable(filters?: {
    query?: string;
    brand?: string;
    piece_type?: string;
    gender?: string;
    season?: string;
    material?: string;
    creator?: string;
    rarity?: string;
  }) {
    return this.wardrobeService.listDiscoverablePieces(filters);
  }
}
