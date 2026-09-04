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
import { ClaudeAutopilotService } from './ClaudeAutopilotService';

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
  private readonly claudeService = new ClaudeAutopilotService();

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

    // Tenta usar Claude IA primeiro
    let suggestions = null;
    if (this.claudeService.isAvailable) {
      try {
        suggestions = await this.claudeService.generateCombinations(
          wardrobe,
          request.occasion,
          request.mood,
          weather,
          Number(process.env.AUTOPILOT_TOP_N ?? 3),
        );
        console.log('[AutopilotService] Claude gerou', suggestions?.length ?? 0, 'combinações');
      } catch (e) {
        console.warn('[AutopilotService] Claude falhou, usando ranking local:', e);
      }
    } else {
      console.log('[AutopilotService] Claude não disponível, usando ranking local');
    }

    // Fallback: ranking local se Claude não disponível ou falhou
    if (!suggestions || suggestions.length === 0) {
      suggestions = this.rankingService.generateTop3(
        wardrobe,
        { occasion: request.occasion, mood: request.mood, weather, preferences: prefs },
        request.exclude_scheme_ids ?? [],
      );
      console.log('[AutopilotService] Ranking local gerou', suggestions.length, 'combinações');
    }

    return { suggestions, weather };
  }

  async confirmDailyLook(
    userId: string,
    input: { scheme_id: string; title?: string; occasion: Occasion; mood: Mood; weather: WeatherInfo; items?: Array<{ wardrobe_item_id: string; name: string; image_url?: string; piece_type?: string }> },
  ) {
    const today = new Date().toISOString().slice(0, 10);
    const dailyLook = await this.dailyLooksRepo.create({
      user_id: userId,
      date: today,
      scheme_id: input.scheme_id,
      title: input.title ?? '',
      occasion: input.occasion,
      mood: input.mood,
      weather_c: input.weather?.temp_c ?? null,
      city: input.weather?.city ?? '',
      scheme_items: input.items ?? [],
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