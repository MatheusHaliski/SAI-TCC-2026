import { GoogleGenAI } from '@google/genai';
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
  BrandLogoReference,
} from './types';

export class GoogleProvider implements FashionAIProvider {
  private ai: GoogleGenAI;
  private textModel: string;
  private visionModel: string;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is missing');
    }
    this.ai = new GoogleGenAI({ apiKey });
    this.textModel = process.env.GOOGLE_AI_MODEL_TEXT || 'gemini-2.5-pro';
    this.visionModel = process.env.GOOGLE_AI_MODEL_VISION || 'gemini-2.5-pro';
  }

  private async generateJson<T>(model: string, prompt: string, imageBase64?: string, imageMimeType?: string, imageUrl?: string): Promise<T> {
    try {
      const contents: any[] = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        contents.push({
          inlineData: {
            data: cleanBase64,
            mimeType: imageMimeType || 'image/jpeg',
          },
        });
      } else if (imageUrl) {
        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error(`Failed to fetch image from URL: ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const contentType = res.headers.get('content-type') || 'image/jpeg';
        contents.push({
          inlineData: {
            data: base64,
            mimeType: contentType.split(';')[0].trim(),
          },
        });
      }

      contents.push(prompt);

      const response = await this.ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '';
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      }
      return JSON.parse(cleanText) as T;
    } catch (error) {
      console.error('[GoogleProvider] Error generating JSON content:', error);
      throw error;
    }
  }

  private async generateJsonWithContents<T>(model: string, contents: any[]): Promise<T> {
    try {
      const response = await this.ai.models.generateContent({
        model,
        contents,
        config: { responseMimeType: 'application/json' },
      });

      const text = response.text || '';
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      }
      return JSON.parse(cleanText) as T;
    } catch (error) {
      console.error('[GoogleProvider] Error generating JSON with contents:', error);
      throw error;
    }
  }

  async analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
    const contents: any[] = [];

    // First image: the clothing item
    if (input.base64Image) {
      const cleanBase64 = input.base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: input.mimeType || 'image/jpeg',
        },
      });
    } else if (input.imageUrl) {
      const res = await fetch(input.imageUrl);
      if (!res.ok) throw new Error(`Failed to fetch image from URL: ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = res.headers.get('content-type') || 'image/jpeg';
      contents.push({
        inlineData: {
          data: base64,
          mimeType: contentType.split(';')[0].trim(),
        },
      });
    }

    // Reference brand logo images (if provided) — used for visual logo comparison
    const brandLogos: BrandLogoReference[] = input.brandLogos ?? [];
    for (const logo of brandLogos) {
      contents.push({
        inlineData: {
          data: logo.data,
          mimeType: logo.mimeType,
        },
      });
    }

    const brandLogoSection = brandLogos.length > 0
      ? `BRAND LOGO COMPARISON:
Image 1 is the clothing item to analyze.
Images 2 to ${brandLogos.length + 1} are reference brand logos in this order: ${brandLogos.map((l, i) => `Image ${i + 2} = ${l.name}`).join(', ')}.
Carefully examine any logo, emblem, symbol, or text visible in Image 1 and visually compare it against the provided reference logos.
- If the clothing logo clearly matches one of the reference logos, return that brand name with "High" confidence.
- If it partially matches or is inferred from design language (e.g. crocodile emblem → Lacoste), return it with "Medium" confidence.
- If no brand indicator is visible, return "Unknown".`
      : `BRAND DETECTION:
Carefully scan every part of the clothing image for brand identifiers: logos (embroidered, printed, or embossed), text on labels or patches, distinctive emblems or symbols.
Return the exact brand name. Return "Unknown" only if absolutely no brand indicator is visible.`;

    const prompt = `You are a high-end fashion AI expert and brand identification specialist. Analyze the provided clothing image with extreme attention to detail.

${brandLogoSection}

Return a strictly formatted JSON object with the following fields:
- pieceName: A premium, short name for the item.
- category: The exact type of item (e.g. "Blazer", "T-Shirt", "Sneakers").
- bodyRegion: Must be exactly one of: "upper", "lower", "shoes", "accessory", "unknown".
- primaryColor: The main color name (e.g. "Navy Blue").
- secondaryColors: Array of string colors.
- materials: Array of likely materials (e.g. ["Cotton", "Polyester"]).
- styles: Array of styles (e.g. ["casual", "streetwear", "formal", "luxury"]).
- season: Must be exactly one of: "summer", "winter", "spring", "autumn", "all-season", "unknown".
- gender: Must be exactly one of: "male", "female", "unisex", "unknown".
- brand: Brand name matched from logo comparison or text detection. Return "Unknown" only if no brand indicator is visible.
- brandConfidence: "High" if logo/name is clearly matched, "Medium" if partially matched or inferred, "Low" if speculative.
- semanticTags: Array of 5-8 descriptive tags useful for search.
- shortDescription: A 1-2 sentence premium description.
- outfitSuggestions: Array of 2-3 items that would pair well.

Only return the JSON.`;

    contents.push(prompt);

    return this.generateJsonWithContents<AnalyzeImageOutput>(this.visionModel, contents);
  }

  async generateCardDescription(input: CardDescriptionInput): Promise<CardDescriptionOutput> {
    const prompt = `You are a luxury fashion editorial director. Create a premium outfit description based on the following input:
${JSON.stringify(input, null, 2)}

Return a strictly formatted JSON object with the following fields:
- editorialTitle: A catchy, premium title for the look.
- shortDescription: 1-2 sentence summary.
- longDescription: A detailed, engaging editorial description explaining why it works. Focus on styling, not numerical scores.
- dominantStyle: The overall vibe.
- colorHarmony: Brief description of how the colors interact.
- strongPoints: Array of 3 string highlights.
- anchorPiece: The standout piece from the list.
- idealBackgroundSuggestion: Brief suggestion for a studio background.
- category: Exactly one of: "Standard", "Premium", "Limited Edition".
- wearstyles: Array of objects with "pieceName" and "styles" (max 3 styles per piece).

Only return the JSON.`;

    return this.generateJson<CardDescriptionOutput>(this.textModel, prompt);
  }

  async generateTesterFitInstructions(input: TesterFitInput): Promise<TesterFitOutput> {
    const prompt = `You are an expert virtual fitting AI. Given the following piece information:
${JSON.stringify(input, null, 2)}

Determine how it should be fit onto a 2D mannequin.
Return a strictly formatted JSON object with the following fields:
- targetBodyRegion: E.g., "upper", "lower".
- suggestedLayer: E.g., "base", "mid", "outer".
- fitType: Must be exactly one of: "slim", "regular", "oversized", "cropped", "long", "unknown".
- alignmentHint: Natural language hint for X/Y alignment.
- scaleHint: Natural language hint for scaling.
- warnings: Array of strings if the input might have issues (e.g. "Might clip with standard trousers").

Only return the JSON.`;

    return this.generateJson<TesterFitOutput>(this.textModel, prompt);
  }

  async generateBackgroundPrompt(input: BackgroundPromptInput): Promise<BackgroundPromptOutput> {
    const prompt = `You are an AI generating editorial fashion backgrounds. User request: "${input.userPrompt}"
Interpret the request and return a strictly formatted JSON object:
- backgroundType: Exactly one of: "gradient", "fabric", "metallic", "liquidGlass", "tiledMotif", "editorial", "unknown".
- palette: Array of hex colors or color names.
- texture: Short description of texture.
- composition: Short description of layout.
- cssSuggestion: A valid CSS background string (e.g. "linear-gradient(...)").
- promptForImageGeneration: A detailed prompt suitable for a text-to-image model (like Imagen).
- uiSafety: Object with "textColor" ("white" or "black") and "contrastWarning" (boolean).

Only return the JSON.`;

    return this.generateJson<BackgroundPromptOutput>(this.textModel, prompt);
  }

  async parseSearchIntent(input: SearchIntentInput): Promise<SearchIntentOutput> {
    const prompt = `You are a semantic search parser for a fashion wardrobe. User query: "${input.query}"
Extract intents into a strictly formatted JSON object with arrays of strings for:
- colors
- style
- occasion
- season
- piece_item
- brand
- gender
- semanticTags (any other keywords)

Return empty arrays if not found. Only return the JSON.`;

    return this.generateJson<SearchIntentOutput>(this.textModel, prompt);
  }
}
