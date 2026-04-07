import { getLS, setLS } from '@/app/lib/SafeStorage';

export type PageBackgroundShape = 'none' | 'orb' | 'diamond' | 'mesh';

export interface PageBackgroundConfig {
  gradient: string;
  shape: PageBackgroundShape;
}

const PAGE_BACKGROUND_KEY = 'sai_page_background_config';

export const DEFAULT_PAGE_BACKGROUND_CONFIG: PageBackgroundConfig = {
  gradient: 'linear-gradient(135deg, #0b7a4a 0%, #075e39 45%, #05311f 100%)',
  shape: 'mesh',
};

export const readPageBackgroundConfig = (): PageBackgroundConfig => {
  const raw = getLS(PAGE_BACKGROUND_KEY);
  if (!raw) return DEFAULT_PAGE_BACKGROUND_CONFIG;
  try {
    const parsed = JSON.parse(raw) as Partial<PageBackgroundConfig>;
    return {
      gradient: parsed.gradient || DEFAULT_PAGE_BACKGROUND_CONFIG.gradient,
      shape: (parsed.shape as PageBackgroundShape) || DEFAULT_PAGE_BACKGROUND_CONFIG.shape,
    };
  } catch {
    return DEFAULT_PAGE_BACKGROUND_CONFIG;
  }
};

export const applyPageBackgroundConfig = (config: PageBackgroundConfig): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--home-shell-bg', config.gradient);
  document.documentElement.style.setProperty('--sidebar-gradient', config.gradient);
  document.documentElement.style.setProperty('--sidebar-gradient-soft', config.gradient);
  document.documentElement.setAttribute('data-home-shape', config.shape);
};

export const savePageBackgroundConfig = (config: PageBackgroundConfig): void => {
  setLS(PAGE_BACKGROUND_KEY, JSON.stringify(config));
  applyPageBackgroundConfig(config);
};
