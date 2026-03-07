import { getLS, removeLS, setLS } from '@/app/lib/SafeStorage';
import { getAuthSessionToken } from '@/app/lib/authSession';
import { getDevSessionToken } from '@/app/lib/devSession';

export const STYLISTAI_ACCESS_TOKEN_KEY = 'stylistai_content_access_token';

export const getSharedAccessToken = (): string => {
  return getLS(STYLISTAI_ACCESS_TOKEN_KEY) ?? '';
};

export const setSharedAccessToken = (token: string): void => {
  if (!token) return;
  setLS(STYLISTAI_ACCESS_TOKEN_KEY, token);
};

export const clearSharedAccessToken = (): void => {
  removeLS(STYLISTAI_ACCESS_TOKEN_KEY);
};

export const resolveAnyAccessToken = (): string => {
  return getSharedAccessToken() || getAuthSessionToken() || getDevSessionToken();
};

export const ensureSharedAccessToken = (): string => {
  const resolved = resolveAnyAccessToken();
  if (resolved) {
    setSharedAccessToken(resolved);
  }
  return resolved;
};
