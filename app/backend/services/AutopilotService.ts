import { DailyLookFeedback, GenerateDailyRequest, GenerateDailyResponse, Mood, Occasion, WeatherInfo } from '@/app/backend/types/entities';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { OutfitPreferencesRepository } from '@/app/backend/repositories/OutfitPreferencesRepository';
import { DailyLooksRepository } from '@/app/backend/repositories/DailyLooksRepository';
import { OutfitRankingService } from './OutfitRankingService';
import { WeatherService } from './WeatherService';
import { PreferenceLearningService } from './PreferenceLearningService';
import { ServiceError } from './errors';

const MIN_PIECES = Number(process.env.AUTOPILOT_MIN_WARDROBE_PIECES ?? 3);
const ENABLE_AUTOPILOT = String(process.env.ENABLE_AUTOPILOT ?? 'true').toLowerCase() !== 'false';

export class AutopilotService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly prefsRepo = new OutfitPreferencesRepository(),
    private readonly dailyLooksRepo = new DailyLooksRepository(),
    private readonly rankingService = new OutfitRankingService(),
    private readonly weatherService = new WeatherService(),
    private readonly preferenceLearningService = new PreferenceLearningService(),
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

    const suggestions = this.rankingService.generateTop3(
      wardrobe,
      { occasion: request.occasion, mood: request.mood, weather, preferences: prefs },
      request.exclude_scheme_ids ?? [],
    );

    return { suggestions, weather };
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
      weather_c: input.weather.temp_c,
      city: input.weather.city,
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
