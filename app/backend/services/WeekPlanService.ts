import { AutopilotWardrobeItem, GenerateWeekRequest, Occasion, OutfitPreferences, WeatherInfo, WeekPlan } from '@/app/backend/types/entities';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { OutfitPreferencesRepository } from '@/app/backend/repositories/OutfitPreferencesRepository';
import { WeekPlansRepository } from '@/app/backend/repositories/WeekPlansRepository';
import { OutfitRankingService } from './OutfitRankingService';
import { WeatherService } from './WeatherService';
import { ServiceError } from './errors';

const MIN_PIECES = Number(process.env.AUTOPILOT_MIN_WARDROBE_PIECES ?? 3);

export class WeekPlanService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly prefsRepo = new OutfitPreferencesRepository(),
    private readonly weekPlansRepo = new WeekPlansRepository(),
    private readonly rankingService = new OutfitRankingService(),
    private readonly weatherService = new WeatherService(),
  ) {}

  async generateWeekPlan(userId: string, request: GenerateWeekRequest, city: string): Promise<WeekPlan> {
    const wardrobe = await this.wardrobeRepo.findRichForAutopilot(userId);
    const prefs = await this.prefsRepo.findOrCreate(userId);

    let weather: WeatherInfo;
    try {
      weather = await this.weatherService.getCurrentWeather(city);
    } catch {
      weather = { temp_c: 20, condition: 'partly_cloudy', city };
    }

    const usedItemIds = new Set<string>();
    const workingPrefs: OutfitPreferences = JSON.parse(JSON.stringify(prefs));

    const days = await Promise.all(
      request.days.map(async (dayInput) => {
        const availableWardrobe = wardrobe.filter((item) => !usedItemIds.has(item.wardrobe_item_id));
        const suggestions = availableWardrobe.length >= MIN_PIECES
          ? this.rankingService.generateTop3(availableWardrobe, {
              occasion: dayInput.occasion as Occasion,
              mood: 'disposto',
              weather,
              preferences: workingPrefs,
            })
          : [];

        const best = suggestions[0] ?? null;

        if (best) {
          for (const item of best.items) {
            usedItemIds.add(item.wardrobe_item_id);
            workingPrefs.piece_weights[item.wardrobe_item_id] =
              (workingPrefs.piece_weights[item.wardrobe_item_id] ?? 0) + 2;
          }
        }

        const gapHints = best ? [] : await this.suggestGapFills(dayInput.occasion as Occasion, wardrobe);

        return {
          date: dayInput.date,
          occasion: dayInput.occasion as Occasion,
          scheme_id: best ? best.scheme_id : null,
          gap_hints: gapHints,
        };
      }),
    );

    const plan = await this.weekPlansRepo.create({
      user_id: userId,
      week_start: request.week_start,
      days,
      created_at: new Date().toISOString(),
    });

    return plan;
  }

  private async suggestGapFills(occasion: Occasion, wardrobe: AutopilotWardrobeItem[]): Promise<string[]> {
    const hasUpper = wardrobe.some((i) => i.piece_type.includes('upper') || i.piece_type === 'top');
    const hasLower = wardrobe.some((i) => i.piece_type.includes('lower') || i.piece_type === 'bottom');
    const hasShoes = wardrobe.some((i) => i.piece_type.includes('shoes') || i.piece_type === 'shoe');

    const hints: string[] = [];
    if (!hasUpper) hints.push(`Add an upper piece suitable for ${occasion}`);
    if (!hasLower) hints.push(`Add a lower piece suitable for ${occasion}`);
    if (!hasShoes) hints.push(`Add shoes suitable for ${occasion}`);
    return hints;
  }
}
