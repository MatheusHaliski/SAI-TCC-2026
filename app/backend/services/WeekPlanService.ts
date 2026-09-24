import { AutopilotWardrobeItem, GenerateWeekRequest, Occasion, OutfitPreferences, WeatherInfo, WeekPlan } from '@/app/backend/types/entities';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { OutfitPreferencesRepository } from '@/app/backend/repositories/OutfitPreferencesRepository';
import { WeekPlansRepository } from '@/app/backend/repositories/WeekPlansRepository';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';
import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { OutfitRankingService } from './OutfitRankingService';
import { WeatherService } from './WeatherService';
import { ServiceError } from './errors';

const MIN_PIECES = Number(process.env.AUTOPILOT_MIN_WARDROBE_PIECES ?? 3);

const DAY_LABELS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
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

export class WeekPlanService {
  constructor(
    private readonly wardrobeRepo = new WardrobeItemsRepository(),
    private readonly prefsRepo = new OutfitPreferencesRepository(),
    private readonly weekPlansRepo = new WeekPlansRepository(),
    private readonly rankingService = new OutfitRankingService(),
    private readonly weatherService = new WeatherService(),
    private readonly schemesRepo = new SchemesRepository(),
    private readonly schemeItemsRepo = new SchemeItemsRepository(),
  ) {}

  async generateWeekPlan(userId: string, request: GenerateWeekRequest, city: string): Promise<WeekPlan> {
    const wardrobe = await this.wardrobeRepo.findRichForAutopilot(userId);
    const prefs = await this.prefsRepo.findByUser(userId);

    let weather: WeatherInfo;
    try {
      weather = await this.weatherService.getCurrentWeather(city);
    } catch {
      weather = { temp_c: 20, condition: 'partly_cloudy', city };
    }

    const usedItemIds = new Set<string>();
    const workingPrefs: OutfitPreferences = JSON.parse(JSON.stringify(prefs));

    const days = await Promise.all(
      request.days.map(async (dayInput, index) => {
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

        let savedSchemeId: string | null = null;
        let schemeTitle: string | undefined;
        let schemeItems: AutopilotWardrobeItem[] | undefined;

        if (best) {
          const dayLabel = DAY_LABELS[index] ?? `Dia ${index + 1}`;
          const occasionLabel = OCCASION_LABEL_MAP[dayInput.occasion] ?? dayInput.occasion;
          schemeTitle = `${dayLabel} — ${occasionLabel}`;
          schemeItems = best.items;

          const itemsForScheme = best.items.map((item, i) => ({
            wardrobe_item_id: item.wardrobe_item_id,
            slot: pieceTypeToSlot(item.piece_type),
            sort_order: i + 1,
          }));

          const scheme = await this.schemesRepo.create({
            user_id: userId,
            title: schemeTitle,
            creation_mode: 'ai',
            style: 'Autopiloto',
            occasion: dayInput.occasion,
            visibility: 'private',
            pieces: [],
            items: itemsForScheme,
          });

          await this.schemeItemsRepo.createMany(
            itemsForScheme.map((item) => ({ ...item, scheme_id: scheme.scheme_id })),
          );

          savedSchemeId = scheme.scheme_id;
        }

        const gapHints = best ? [] : await this.suggestGapFills(dayInput.occasion as Occasion, wardrobe);

        return {
          date: dayInput.date,
          occasion: dayInput.occasion as Occasion,
          scheme_id: savedSchemeId,
          gap_hints: gapHints,
          scheme_title: schemeTitle,
          scheme_items: schemeItems,
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
    if (!hasUpper) hints.push(`Adicione uma peça superior para ${OCCASION_LABEL_MAP[occasion] ?? occasion}`);
    if (!hasLower) hints.push(`Adicione uma peça inferior para ${OCCASION_LABEL_MAP[occasion] ?? occasion}`);
    if (!hasShoes) hints.push(`Adicione um calçado para ${OCCASION_LABEL_MAP[occasion] ?? occasion}`);
    return hints;
  }
}
