import {
  FashionAIProvider,
  AnalyzeImageInput,
  AnalyzeImageOutput,
  CardDescriptionInput,
  CardDescriptionOutput,
  TesterFitInput,
  TesterFitOutput,
  BackgroundPromptInput,
  BackgroundPromptOutput,
  SearchIntentInput,
  SearchIntentOutput,
} from './types';

async function chatCompletion(messages: object[], systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '{}';
}

export class OpenAIProvider implements FashionAIProvider {
  async analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
    const userContent = input.imageUrl
      ? [{ type: 'image_url', image_url: { url: input.imageUrl } }]
      : [{ type: 'text', text: 'No image provided.' }];

    const raw = JSON.parse(
      await chatCompletion(
        [{ role: 'user', content: userContent }],
        'You are a fashion AI. Analyze the clothing item and return a JSON object with keys: pieceName, category, bodyRegion (upper|lower|shoes|accessory|unknown), primaryColor (hex), secondaryColors (array), materials (array), styles (array), season (summer|winter|spring|autumn|all-season|unknown), gender (male|female|unisex|unknown), brand, brandConfidence (High|Medium|Low), semanticTags (array), shortDescription, outfitSuggestions (array).',
      ),
    );
    return {
      pieceName: raw.pieceName ?? 'Unknown Piece',
      category: raw.category ?? 'T-Shirt',
      bodyRegion: raw.bodyRegion ?? 'unknown',
      primaryColor: raw.primaryColor ?? '#000000',
      secondaryColors: raw.secondaryColors ?? [],
      materials: raw.materials ?? [],
      styles: raw.styles ?? [],
      season: raw.season ?? 'unknown',
      gender: raw.gender ?? 'unknown',
      brand: raw.brand,
      brandConfidence: raw.brandConfidence,
      semanticTags: raw.semanticTags ?? [],
      shortDescription: raw.shortDescription ?? '',
      outfitSuggestions: raw.outfitSuggestions ?? [],
    };
  }

  async generateCardDescription(input: CardDescriptionInput): Promise<CardDescriptionOutput> {
    const raw = JSON.parse(
      await chatCompletion(
        [{ role: 'user', content: JSON.stringify(input) }],
        'You are a fashion editorial AI. Return a JSON with keys: editorialTitle, shortDescription, longDescription, dominantStyle, colorHarmony, strongPoints (array), anchorPiece, idealBackgroundSuggestion, category (Standard|Premium|Limited Edition), wearstyles (array of {pieceName, styles[]}).',
      ),
    );
    return {
      editorialTitle: raw.editorialTitle ?? 'Essential Look',
      shortDescription: raw.shortDescription ?? '',
      longDescription: raw.longDescription ?? '',
      dominantStyle: raw.dominantStyle ?? input.dominantStyle,
      colorHarmony: raw.colorHarmony ?? 'Neutral',
      strongPoints: raw.strongPoints ?? [],
      anchorPiece: raw.anchorPiece ?? input.pieces[0]?.name ?? '',
      idealBackgroundSuggestion: raw.idealBackgroundSuggestion ?? '',
      category: raw.category ?? 'Standard',
      wearstyles: raw.wearstyles ?? [],
    };
  }

  async generateTesterFitInstructions(input: TesterFitInput): Promise<TesterFitOutput> {
    const raw = JSON.parse(
      await chatCompletion(
        [{ role: 'user', content: JSON.stringify(input) }],
        'You are a fashion fitting AI. Return a JSON with keys: targetBodyRegion, suggestedLayer, fitType (slim|regular|oversized|cropped|long|unknown), alignmentHint, scaleHint, warnings (array).',
      ),
    );
    return {
      targetBodyRegion: raw.targetBodyRegion ?? input.bodyRegion,
      suggestedLayer: raw.suggestedLayer ?? 'base',
      fitType: raw.fitType ?? 'regular',
      alignmentHint: raw.alignmentHint ?? '',
      scaleHint: raw.scaleHint ?? '',
      warnings: raw.warnings ?? [],
    };
  }

  async generateBackgroundPrompt(input: BackgroundPromptInput): Promise<BackgroundPromptOutput> {
    const raw = JSON.parse(
      await chatCompletion(
        [{ role: 'user', content: input.userPrompt }],
        'You are a UI background design AI. Return a JSON with keys: backgroundType (gradient|fabric|metallic|liquidGlass|tiledMotif|editorial|unknown), palette (array of hex), texture, composition, cssSuggestion, promptForImageGeneration, uiSafety ({textColor: white|black, contrastWarning: boolean}).',
      ),
    );
    return {
      backgroundType: raw.backgroundType ?? 'gradient',
      palette: raw.palette ?? ['#1a1a1a', '#333333'],
      texture: raw.texture ?? 'smooth',
      composition: raw.composition ?? '',
      cssSuggestion: raw.cssSuggestion ?? '',
      promptForImageGeneration: raw.promptForImageGeneration ?? '',
      uiSafety: raw.uiSafety ?? { textColor: 'white', contrastWarning: false },
    };
  }

  async parseSearchIntent(input: SearchIntentInput): Promise<SearchIntentOutput> {
    const raw = JSON.parse(
      await chatCompletion(
        [{ role: 'user', content: input.query }],
        'You are a fashion search intent parser. Return a JSON with keys: colors (array), style (array), occasion (array), season (array), piece_item (array), brand (array), gender (array), semanticTags (array).',
      ),
    );
    return {
      colors: raw.colors ?? [],
      style: raw.style ?? [],
      occasion: raw.occasion ?? [],
      season: raw.season ?? [],
      piece_item: raw.piece_item ?? [],
      brand: raw.brand ?? [],
      gender: raw.gender ?? [],
      semanticTags: raw.semanticTags ?? [],
    };
  }
}
