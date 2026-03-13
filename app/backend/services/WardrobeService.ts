import { UsersRepository } from '@/app/backend/repositories/UsersRepository';
import { BrandsRepository } from '@/app/backend/repositories/BrandsRepository';
import { MarketsRepository } from '@/app/backend/repositories/MarketsRepository';
import { UsersRepository } from '@/app/backend/repositories/UsersRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { WardrobeAnalysis, WardrobeViewItem } from '@/app/backend/types/entities';

function aggregate(items: WardrobeViewItem[], key: keyof Pick<WardrobeViewItem, 'brand' | 'season' | 'gender' | 'piece_type'>) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
}

export class WardrobeService {
  constructor(
    private readonly usersRepo = new UsersRepository(),
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly brandsRepo = new BrandsRepository(),
    private readonly marketsRepo = new MarketsRepository(),
  ) {}

  async listUserWardrobe(userId: string): Promise<WardrobeViewItem[]> {
    const user = await this.usersRepo.getById(userId);
    if (!user) throw new Error('User not found');

    const items = await this.wardrobeRepo.findByUser(userId);
    const viewItems = await Promise.all(
      items.map(async (item) => {
        const [brand, market] = await Promise.all([
          this.brandsRepo.getById(item.brand_id),
          this.marketsRepo.getById(item.market_id),
        ]);

        return {
          wardrobe_item_id: item.wardrobe_item_id,
          name: item.name,
          image_url: item.image_url,
          brand: brand?.name ?? 'Unknown',
          season: market?.season ?? 'Unknown',
          gender: market?.gender ?? 'Unknown',
          piece_type: item.piece_type,
        };
      }),
    );

    return viewItems;
  }

  async getWardrobeAnalysis(userId: string): Promise<WardrobeAnalysis> {
    const items = await this.listUserWardrobe(userId);
    return {
      total_items: items.length,
      by_brand: aggregate(items, 'brand'),
      by_season: aggregate(items, 'season'),
      by_gender: aggregate(items, 'gender'),
      by_piece_type: aggregate(items, 'piece_type'),
    };
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
