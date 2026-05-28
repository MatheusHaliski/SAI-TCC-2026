import { DailyLookFeedback, GenerateDailyRequest, GenerateDailyResponse, Mood, Occasion, WeatherInfo } from '@/app/backend/types/entities';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { OutfitPreferencesRepository } from '@/app/backend/repositories/OutfitPreferencesRepository';
import { DailyLooksRepository } from '@/app/backend/repositories/DailyLooksRepository';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';
import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { OutfitRankingService } from './OutfitRankingService';
import { WeatherService } from './WeatherService';
import { PreferenceLearningService } from './PreferenceLearningService';
import { ServiceError } from './errors';

const MIN_PIECES = Number(process.env.AUTOPILOT_MIN_WARDROBE_PIECES ?? 3);
const ENABLE_AUTOPILOT = String(process.env.ENABLE_AUTOPILOT ?? 'true').toLowerCase() !== 'false';

const OCCASION_LABEL_MAP: Record<string, string> = {
  trabalho: 'Trabalho',
  casual: 'Casual',
  festa: 'Festa',
  academia: 'Academia',
  evento: 'Evento',
};

function pieceTypeToSlot(pieceType: string): 'upper' | 'lower' | 'shoes' | 'accessory' {
  const t = pieceType.toLowerCase();
  if (t.includes('upper') || ['top', 'blouse', 'shirt', 'jacket', 'coat', 'outerwear', 'sweater', 'hoodie', 'camiseta', 'blusão', 'camisa', 'dress', 'jumpsuit', 'romper', 'vestido', 'macacão'].includes(t)) return 'upper';
  if (t.includes('lower') || ['bottom', 'pants', 'jeans', 'skirt', 'shorts', 'trousers', 'calça', 'saia', 'bermuda'].includes(t)) return 'lower';
  if (t.includes('shoes') || t.includes('shoe') || ['boots', 'sneakers', 'sandals', 'heels', 'sapatos', 'tênis', 'bota', 'sandália'].includes(t)) return 'shoes';
  return 'accessory';
}

export class AutopilotService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly prefsRepo = new OutfitPreferencesRepository(),
    private readonly dailyLooksRepo = new DailyLooksRepository(),
    private readonly rankingService = new OutfitRankingService(),
    private readonly weatherService = new WeatherService(),
    private readonly preferenceLearningService = new PreferenceLearningService(),
    private readonly schemesRepo = new SchemesRepository(),
    private readonly schemeItemsRepo = new SchemeItemsRepository(),
  ) {}

  async generateDaily(userId: string, request: GenerateDailyRequest): Promise<GenerateDailyResponse> {
    if (!ENABLE_AUTOPILOT) {
      throw new ServiceError('Autopilot feature is disabled.', 503);
    }

    const wardrobe = await this.wardrobeRepo.findRichForAutopilot(userId);
    if (wardrobe.length < MIN_PIECES) {
      throw new ServiceError(
        `At least ${MIN_PIECES} active wardrobe items are required to generate outfit suggestions.`,
        422,
      );
    }

    const prefs = await this.prefsRepo.findByUser(userId);

    let weather: WeatherInfo;
    try {
      weather = await this.weatherService.getCurrentWeather(request.city);
    } catch (error) {
      console.warn('[autopilot] weather fetch failed, using fallback', { city: request.city, error });
      weather = { temp_c: 20, condition: 'partly_cloudy', city: request.city };
    }

    const suggestions = this.rankingService.generateTop3(wardrobe, {
      occasion: request.occasion,
      mood: request.mood,
      weather,
      preferences: prefs,
    });

    const occasionLabel = OCCASION_LABEL_MAP[request.occasion] ?? request.occasion;

    const savedSuggestions = await Promise.all(
      suggestions.map(async (suggestion, index) => {
        const title = `Autopiloto — ${occasionLabel} #${index + 1}`;
        const schemeItems = suggestion.items.map((item, i) => ({
          wardrobe_item_id: item.wardrobe_item_id,
          slot: pieceTypeToSlot(item.piece_type),
          sort_order: i + 1,
        }));

        const scheme = await this.schemesRepo.create({
          user_id: userId,
          title,
          creation_mode: 'ai',
          style: 'Autopiloto',
          occasion: request.occasion,
          visibility: 'private',
          pieces: [],
          items: schemeItems,
        });

        await this.schemeItemsRepo.createMany(
          schemeItems.map((item) => ({ ...item, scheme_id: scheme.scheme_id })),
        );

        return { ...suggestion, scheme_id: scheme.scheme_id, title };
      }),
    );

    const filteredSuggestions = request.exclude_scheme_ids?.length
      ? savedSuggestions.filter((s) => !request.exclude_scheme_ids!.includes(s.scheme_id))
      : savedSuggestions;

    return { suggestions: filteredSuggestions, weather };
  }

  async confirmDailyLook(
    userId: string,
    input: { scheme_id: string; occasion: Occasion; mood: Mood; weather: WeatherInfo },
  ) {
    const today = new Date().toISOString().slice(0, 10);
    const dailyLook = await this.dailyLooksRepo.create({
      user_id: userId,
      date: today,
      scheme_id: input.scheme_id,
      occasion: input.occasion,
      mood: input.mood,
      weather_c: input.weather?.temp_c ?? null,
      city: input.weather?.city ?? '',
    });
    return dailyLook;
  }

  async applyFeedback(userId: string, dailyLookId: string, feedback: DailyLookFeedback) {
    await this.preferenceLearningService.applyFeedback(userId, dailyLookId, feedback);
    return { ok: true };
  }

  async getHistory(userId: string, limit = 30) {
    return this.dailyLooksRepo.findByUser(userId, limit);
  }
}
