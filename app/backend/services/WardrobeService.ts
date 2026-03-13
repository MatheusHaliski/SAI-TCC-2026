import { UsersRepository } from '@/app/backend/repositories/UsersRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { ServiceError } from './errors';

export class WardrobeService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly usersRepo = new UsersRepository(),
  ) {}

  async listUserWardrobe(userId: string) {
    const user = await this.usersRepo.getById(userId);
    if (!user) throw new ServiceError('User not found', 404);
    return this.wardrobeRepo.findByUser(userId);
  }

  async getWardrobeAnalysis(userId: string) {
    const user = await this.usersRepo.getById(userId);
    if (!user) throw new ServiceError('User not found', 404);
    return this.wardrobeRepo.getAnalysisByUser(userId);
  }
}
