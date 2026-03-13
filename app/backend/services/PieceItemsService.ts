import { PieceItemsRepository } from '@/app/backend/repositories/PieceItemsRepository';

export class PieceItemsService {
  constructor(private readonly pieceRepo = new PieceItemsRepository()) {}

  async search(filters: { season?: string; gender?: string; brand?: string; piece_type?: string }) {
    return this.pieceRepo.search(filters);
  }
}
