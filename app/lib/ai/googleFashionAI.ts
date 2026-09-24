import { FashionAIProvider, AnalyzeImageInput, CardDescriptionInput, TesterFitInput, BackgroundPromptInput, SearchIntentInput } from './providers/types';
import { GoogleProvider } from './providers/googleProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { FallbackProvider } from './providers/fallbackProvider';

export type FashionAIProviderName = 'google' | 'openai' | 'fallback';

class GoogleFashionAI {
  private provider: FashionAIProvider;
  /** Name of the active provider so callers/UI can distinguish real analysis from mock data. */
  public readonly providerName: FashionAIProviderName;

  constructor() {
    const hasGoogleKey = !!process.env.GOOGLE_AI_API_KEY?.trim();
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY?.trim();
    // Google is enabled whenever a key exists, unless it is explicitly turned off.
    // Previously this required GOOGLE_AI_PROVIDER_ENABLED === 'true', so providing only
    // the API key silently degraded to mock data — a confusing footgun.
    const googleExplicitlyDisabled = process.env.GOOGLE_AI_PROVIDER_ENABLED === 'false';
    const isGoogleEnabled = hasGoogleKey && !googleExplicitlyDisabled;

    if (isGoogleEnabled) {
      try {
        this.provider = new GoogleProvider();
        this.providerName = 'google';
        console.log('[FashionAI] Initialized with GoogleProvider');
        return;
      } catch (error) {
        console.error('[FashionAI] GoogleProvider failed, trying OpenAI...', error);
      }
    }

    if (hasOpenAIKey) {
      this.provider = new OpenAIProvider();
      this.providerName = 'openai';
      console.log('[FashionAI] Initialized with OpenAIProvider');
      return;
    }

    this.provider = new FallbackProvider();
    this.providerName = 'fallback';
    console.warn('[FashionAI] No AI provider configured — using mock data. Set GOOGLE_AI_API_KEY (or OPENAI_API_KEY) in .env.local');
  }

  /** True when no real AI provider is configured and responses are hardcoded mock data. */
  get isFallback(): boolean {
    return this.providerName === 'fallback';
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
