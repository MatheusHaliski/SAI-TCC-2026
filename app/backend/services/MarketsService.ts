import { MarketsRepository } from '@/app/backend/repositories/MarketsRepository';

export class MarketsService {
  constructor(private readonly marketsRepository = new MarketsRepository()) {}

  async listAll() {
    return this.marketsRepository.listAll();
  }
}
