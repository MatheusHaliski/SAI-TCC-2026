import { AutopilotService } from '@/app/backend/services/AutopilotService';
import { WeekPlanService } from '@/app/backend/services/WeekPlanService';
import { DailyLookFeedback, GenerateDailyRequest, GenerateWeekRequest, Mood, Occasion } from '@/app/backend/types/entities';
import { WeatherInfo } from '@/app/backend/types/entities';

export class AutopilotController {
  constructor(
    private readonly autopilotService = new AutopilotService(),
    private readonly weekPlanService = new WeekPlanService(),
  ) {}

  async generateDaily(userId: string, body: GenerateDailyRequest) {
    return this.autopilotService.generateDaily(userId, body);
  }

  async confirmDailyLook(
    userId: string,
    body: { scheme_id: string; occasion: Occasion; mood: Mood; weather: WeatherInfo },
  ) {
    return this.autopilotService.confirmDailyLook(userId, body);
  }

  async applyFeedback(userId: string, dailyLookId: string, feedback: DailyLookFeedback) {
    return this.autopilotService.applyFeedback(userId, dailyLookId, feedback);
  }

  async generateWeekPlan(userId: string, body: GenerateWeekRequest, city: string) {
    return this.weekPlanService.generateWeekPlan(userId, body, city);
  }

  async getHistory(userId: string, limit?: number) {
    return this.autopilotService.getHistory(userId, limit);
  }
}
