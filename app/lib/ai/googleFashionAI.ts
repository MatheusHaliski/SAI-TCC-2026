import { FashionAIProvider, AnalyzeImageInput, CardDescriptionInput, TesterFitInput, BackgroundPromptInput, SearchIntentInput } from './providers/types';
import { GoogleProvider } from './providers/googleProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { FallbackProvider } from './providers/fallbackProvider';

class GoogleFashionAI {
  private provider: FashionAIProvider;

  constructor() {
    const isGoogleEnabled = process.env.GOOGLE_AI_PROVIDER_ENABLED === 'true';
    const hasGoogleKey   = !!process.env.GOOGLE_AI_API_KEY?.trim();
    const hasOpenAIKey   = !!process.env.OPENAI_API_KEY?.trim();

    if (isGoogleEnabled && hasGoogleKey) {
      try {
        this.provider = new GoogleProvider();
        console.log('[FashionAI] Initialized with GoogleProvider');
      } catch (error) {
        console.error('[FashionAI] GoogleProvider failed, trying OpenAI...', error);
        if (hasOpenAIKey) {
          this.provider = new OpenAIProvider();
          console.log('[FashionAI] Initialized with OpenAIProvider (Google fallback)');
        } else {
          this.provider = new FallbackProvider();
          console.warn('[FashionAI] Initialized with FallbackProvider (mock data)');
        }
      }
    } else if (hasOpenAIKey) {
      this.provider = new OpenAIProvider();
      console.log('[FashionAI] Initialized with OpenAIProvider');
    } else {
      this.provider = new FallbackProvider();
      console.warn('[FashionAI] No AI provider configured — using mock data. Set GOOGLE_AI_API_KEY or OPENAI_API_KEY in .env.local');
    }
  }

  async analyzeFashionImage(input: AnalyzeImageInput) {
    return this.provider.analyzeImage(input);
  }

  async generateCardOutfitDescription(input: CardDescriptionInput) {
    return this.provider.generateCardDescription(input);
  }

  async generateTester2DFitInstructions(input: TesterFitInput) {
    return this.provider.generateTesterFitInstructions(input);
  }

  async generateBackgroundPrompt(input: BackgroundPromptInput) {
    return this.provider.generateBackgroundPrompt(input);
  }

  async parseSearchIntent(input: SearchIntentInput) {
    return this.provider.parseSearchIntent(input);
  }
}

export const googleFashionAI = new GoogleFashionAI();
