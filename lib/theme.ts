export type SaiTheme = 'dark' | 'light';

export const SAI_THEME_KEY = 'sai_theme';

export const readSavedTheme = (): SaiTheme => {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(SAI_THEME_KEY);
  return saved === 'light' ? 'light' : 'dark';
};

export const applyTheme = (theme: SaiTheme): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(SAI_THEME_KEY, theme);
};


export const SAI_DIV_TINT_KEY = 'sai_div_tint';
export const DEFAULT_DIV_TINT = '#ffffff22';

export const readSavedDivTint = (): string => {
  if (typeof window === 'undefined') return DEFAULT_DIV_TINT;
  return window.localStorage.getItem(SAI_DIV_TINT_KEY) || DEFAULT_DIV_TINT;
};

export const applyDivTint = (color: string): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--card-tint', color || DEFAULT_DIV_TINT);
  window.localStorage.setItem(SAI_DIV_TINT_KEY, color || DEFAULT_DIV_TINT);
};
