import { getLS, setLS } from '@/app/lib/SafeStorage';

export type PageBackgroundShape = 'none' | 'orb' | 'diamond' | 'mesh';

export interface PageBackgroundConfig {
  gradient: string;
  shape: PageBackgroundShape;
}

const PAGE_BACKGROUND_KEY = 'sai_page_background_config';
export const OFFICIAL_WEBSITE_BACKGROUND_GRADIENT = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'>
    <defs>
      <linearGradient id='base' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f973c9'/>
        <stop offset='26%' stop-color='#a855f7'/>
        <stop offset='58%' stop-color='#7c3aed'/>
        <stop offset='100%' stop-color='#f59e0b'/>
      </linearGradient>
      <radialGradient id='glowA' cx='25%' cy='20%' r='60%'>
        <stop offset='0%' stop-color='rgba(255,224,138,0.85)'/>
        <stop offset='100%' stop-color='rgba(255,224,138,0)'/>
      </radialGradient>
      <radialGradient id='glowB' cx='72%' cy='28%' r='62%'>
        <stop offset='0%' stop-color='rgba(96,165,250,0.68)'/>
        <stop offset='100%' stop-color='rgba(96,165,250,0)'/>
      </radialGradient>
    </defs>
    <rect width='1600' height='1000' fill='url(#base)'/>
    <path d='M0,540 C220,430 420,650 650,560 C860,485 980,360 1250,420 C1420,458 1530,580 1600,660 L1600,1000 L0,1000 Z' fill='rgba(255,118,117,0.45)'/>
    <path d='M0,280 C210,170 410,380 650,300 C870,230 1030,80 1290,135 C1425,165 1525,255 1600,330 L1600,620 C1500,515 1380,440 1210,430 C970,416 830,532 600,600 C360,670 170,505 0,600 Z' fill='rgba(147,197,253,0.32)'/>
    <rect width='1600' height='1000' fill='url(#glowA)'/>
    <rect width='1600' height='1000' fill='url(#glowB)'/>
  </svg>`,
)}")`;

export const DEFAULT_PAGE_BACKGROUND_CONFIG: PageBackgroundConfig = {
  gradient: OFFICIAL_WEBSITE_BACKGROUND_GRADIENT,
  shape: 'orb',
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
