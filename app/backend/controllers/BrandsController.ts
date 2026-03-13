import { BrandsService } from '@/app/backend/services/BrandsService';

export class BrandsController {
  constructor(private readonly brandsService = new BrandsService()) {}

  async listActive() {
    return this.brandsService.listActive();
  }
}
