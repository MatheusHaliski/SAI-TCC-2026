import { AutopilotWardrobeItem, Occasion, Mood, SchemeSuggestion, WeatherInfo } from '@/app/backend/types/entities';

interface ClaudeOutfitCombo {
  title: string;
  upper_id?: string;
  lower_id?: string;
  dress_id?: string;
  shoes_id?: string;
  justificativa: string;
}

const OCCASION_PT: Record<Occasion, string> = {
  trabalho: 'Trabalho / Escritório',
  casual: 'Casual / Dia a dia',
  festa: 'Festa / Evento social',
  academia: 'Academia / Esporte',
  evento: 'Evento especial',
};

const MOOD_PT: Record<Mood, string> = {
  disposto: 'Disposto e animado',
  cansado: 'Cansado, quer conforto',
  confiante: 'Confiante e marcante',
  criativo: 'Criativo e diferente',
};

export class ClaudeAutopilotService {
  private readonly apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY ?? '[REMOVED]';
    console.log('[ClaudeAutopilot] chave configurada:', this.apiKey ? this.apiKey.slice(0, 20) + '...' : 'NENHUMA');
  }

  get isAvailable(): boolean {
    return Boolean(this.apiKey);
  }

  async generateCombinations(
    wardrobe: AutopilotWardrobeItem[],
    occasion: Occasion,
    mood: Mood,
    weather: WeatherInfo,
    topN = 3,
  ): Promise<SchemeSuggestion[] | null> {
    if (!this.isAvailable) return null;

    // Classifica as peças por tipo
    const classify = (item: AutopilotWardrobeItem) => {
      const t = item.piece_type.toLowerCase();
      if (/upper_piece|upper|shirt|blouse|top|camisa|camiseta|blusa|casaco|jaqueta|suéter|moletom/.test(t)) return 'upper';
      if (/lower_piece|lower|pants|jeans|skirt|calça|saia|bermuda|shorts/.test(t)) return 'lower';
      if (/dress|jumpsuit|vestido|macacão/.test(t)) return 'dress';
      if (/shoes_piece|footwear|shoes|boot|sneaker|sandal|sapato|tênis|bota|sandália/.test(t)) return 'shoes';
      return 'other';
    };

    const uppers = wardrobe.filter((i) => classify(i) === 'upper').slice(0, 8);
    const lowers = wardrobe.filter((i) => classify(i) === 'lower').slice(0, 8);
    const dresses = wardrobe.filter((i) => classify(i) === 'dress').slice(0, 4);
    const shoes = wardrobe.filter((i) => classify(i) === 'shoes').slice(0, 6);

    console.log('[ClaudeAutopilot] peças classificadas:', { uppers: uppers.length, lowers: lowers.length, dresses: dresses.length, shoes: shoes.length });
    console.log('[ClaudeAutopilot] tags das peças:', wardrobe.map(i => ({ name: i.name, style_tags: i.style_tags, occasion_tags: i.occasion_tags })));
    if ((uppers.length + dresses.length) === 0) {
      console.log('[ClaudeAutopilot] sem peças superiores, abortando');
      return null;
    }

    const formatItem = (item: AutopilotWardrobeItem) =>
      `ID:${item.wardrobe_item_id} | ${item.name} | cor:${item.color || '?'} | ocasiao:[${item.occasion_tags.join(', ') || 'sem tag'}] | estilo:[${item.style_tags.join(', ') || 'sem tag'}]`;

    const prompt = `Você é um estilista de moda pessoal. Analise as peças do guarda-roupa abaixo e crie ${topN} combinações de looks.

CONTEXTO:
- Ocasião: ${OCCASION_PT[occasion]}
- Humor do usuário: ${MOOD_PT[mood]}
- Temperatura: ${weather.temp_c}°C em ${weather.city || 'local não informado'}

PEÇAS DISPONÍVEIS:
${uppers.length > 0 ? `\nPARTE SUPERIOR (uppers):\n${uppers.map(formatItem).join('\n')}` : ''}
${lowers.length > 0 ? `\nPARTE INFERIOR (lowers):\n${lowers.map(formatItem).join('\n')}` : ''}
${dresses.length > 0 ? `\nVESTIDOS/MACACÕES:\n${dresses.map(formatItem).join('\n')}` : ''}
${shoes.length > 0 ? `\nCALÇADOS:\n${shoes.map(formatItem).join('\n')}` : ''}

INSTRUÇÕES:
1. Crie exatamente ${topN} combinações diferentes
2. Cada combinação deve usar peças que combinem em cor, estilo e ocasião
3. Considere a temperatura: ${weather.temp_c}°C (${weather.temp_c < 15 ? 'frio, use peças mais pesadas' : weather.temp_c < 22 ? 'ameno, use camadas leves' : 'quente, prefira peças leves'})
4. Considere o humor: ${MOOD_PT[mood]}
5. As combinações devem ser DIFERENTES entre si (não repita as mesmas peças)
6. Use EXATAMENTE os IDs fornecidos
7. IMPORTANTE: Se não houver peças adequadas para a ocasião "${OCCASION_PT[occasion]}", escolha as peças MAIS PRÓXIMAS do estilo necessário e explique na justificativa que o guarda-roupa não tem peças ideais para essa ocasião
8. NUNCA invente IDs — use apenas os IDs listados acima
9. Prefira peças cujas tags incluam palavras relacionadas à ocasião. Para "Trabalho": formal, social, executivo, business. Para "Casual": casual, day, relax. Para "Festa": party, night, festivo. Para "Academia": sport, fitness, atlético

REGRAS OBRIGATÓRIAS:
- SEMPRE inclua shoes_id em TODAS as combinações — nunca deixe null se houver calçados disponíveis
- SEMPRE inclua upper_id + lower_id (ou dress_id) em TODAS as combinações
- Cada combinação DEVE ter pelo menos 3 peças: parte superior + inferior + calçado

Responda APENAS com JSON válido neste formato (sem texto antes ou depois):
{
  "combinations": [
    {
      "title": "Nome criativo do look",
      "upper_id": "ID da parte superior ou null se usar vestido",
      "lower_id": "ID da parte inferior ou null se usar vestido",
      "dress_id": "ID do vestido/macacão ou null",
      "shoes_id": "ID do calçado — OBRIGATÓRIO se houver calçados disponíveis",
      "justificativa": "Por que essa combinação funciona para a ocasião e humor (1 frase)"
    }
  ]
}`;

    try {
      console.log('[ClaudeAutopilot] Calling API with', wardrobe.length, 'wardrobe items');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[ClaudeAutopilot] API error:', response.status, errText);
        return null;
      }

      const data = await response.json();
      const text = data.content?.[0]?.text ?? '';
      
      // Parse JSON
      const clean = text.replace(/```json|```/g, '').trim();
      console.log('[ClaudeAutopilot] raw response:', clean);
      const parsed = JSON.parse(clean) as { combinations: ClaudeOutfitCombo[] };
      console.log('[ClaudeAutopilot] parsed combinations:', JSON.stringify(parsed.combinations, null, 2));

      console.log('[ClaudeAutopilot] combinations count:', parsed.combinations?.length);
      if (!Array.isArray(parsed.combinations)) return null;

      // Mapeia as combinações para SchemeSuggestion
      const wardrobeMap = new Map(wardrobe.map((i) => [i.wardrobe_item_id, i]));

      // Fallbacks por tipo para completar peças faltantes
      const classify = (item: AutopilotWardrobeItem) => {
        const t = item.piece_type.toLowerCase();
        // Inclui sufixos _piece usados no sistema
        if (/upper_piece|upper|shirt|blouse|top|camisa|camiseta|blusa|casaco|jaqueta/.test(t)) return 'upper';
        if (/lower_piece|lower|pants|jeans|skirt|calça|saia|bermuda|shorts/.test(t)) return 'lower';
        if (/dress|jumpsuit|vestido|macacão/.test(t)) return 'dress';
        if (/shoes_piece|footwear|shoes|boot|sneaker|sandal|sapato|tênis|bota|sandália/.test(t)) return 'shoes';
        return 'other';
      };

      const fallbackUpper = wardrobe.find((i) => classify(i) === 'upper');
      const fallbackLower = wardrobe.find((i) => classify(i) === 'lower');
      const fallbackShoes = wardrobe.find((i) => classify(i) === 'shoes');
      console.log('[ClaudeAutopilot] fallbacks:', { upper: fallbackUpper?.name, lower: fallbackLower?.name, shoes: fallbackShoes?.name });
      console.log('[ClaudeAutopilot] wardrobe types:', wardrobe.map(i => ({ name: i.name, type: i.piece_type, classified: classify(i) })));

      const suggestions: SchemeSuggestion[] = parsed.combinations
        .slice(0, topN)
        .map((combo, index) => {
          const items: AutopilotWardrobeItem[] = [];

          const upper = combo.upper_id ? wardrobeMap.get(combo.upper_id) : undefined;
          const lower = combo.lower_id ? wardrobeMap.get(combo.lower_id) : undefined;
          const dress = combo.dress_id ? wardrobeMap.get(combo.dress_id) : undefined;
          const shoe = combo.shoes_id ? wardrobeMap.get(combo.shoes_id) : undefined;

          if (dress) {
            items.push(dress);
          } else {
            // Usa fallback se Claude não incluiu upper ou lower
            const resolvedUpper = upper ?? fallbackUpper;
            const resolvedLower = lower ?? fallbackLower;
            if (resolvedUpper) items.push(resolvedUpper);
            if (resolvedLower) items.push(resolvedLower);
          }

          // Sempre inclui sapato — usa fallback se Claude não incluiu
          const resolvedShoe = shoe ?? fallbackShoes;
          if (resolvedShoe) items.push(resolvedShoe);

          if (items.length === 0) return null;

          const scheme_id = `claude-${items.map((i) => i.wardrobe_item_id).sort().join('_').slice(0, 40)}`;

          return {
            scheme_id,
            title: combo.title || `Look ${index + 1}`,
            items,
            weather_fit_note: combo.justificativa || '',
            score: 1.0 - index * 0.1,
          } as SchemeSuggestion;
        })
        .filter((s): s is SchemeSuggestion => s !== null);

      return suggestions.length > 0 ? suggestions : null;
    } catch (error) {
      console.error('[ClaudeAutopilot] Failed:', error);
      console.error('[ClaudeAutopilot] Error details:', JSON.stringify(error, null, 2));
      return null;
    }
  }
}