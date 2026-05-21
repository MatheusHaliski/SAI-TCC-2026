const PROXY_HOSTNAMES = new Set([
  'assets.meshy.ai',
  'firebasestorage.googleapis.com',
]);

function needsProxy(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      PROXY_HOSTNAMES.has(parsed.hostname) ||
      parsed.hostname.endsWith('.meshy.ai') ||
      parsed.hostname.endsWith('.firebasestorage.app')
    );
  } catch {
    return false;
  }
}

export function toProxiedModelUrl(url: string): string {
  const safe = url.startsWith('http://') ? url.replace('http://', 'https://') : url;
  return needsProxy(safe) ? `/api/model-proxy?url=${encodeURIComponent(safe)}` : safe;
}

export interface WardrobeModelUrlFields {
  model_3d_url?: string | null;
  model_branded_3d_url?: string | null;
  model_base_3d_url?: string | null;
}

function isRenderableHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function normalizeUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('file://')) return null;
  return isRenderableHttpUrl(trimmed) ? trimmed : null;
}

export function resolveWardrobeModelUrl(item: WardrobeModelUrlFields): string | null {
  return (
    normalizeUrl(item.model_3d_url)
    ?? normalizeUrl(item.model_branded_3d_url)
    ?? normalizeUrl(item.model_base_3d_url)
    ?? null
  );
}

export function resolveWardrobeModelCandidateUrls(item: WardrobeModelUrlFields): string[] {
  const candidates = [
    normalizeUrl(item.model_3d_url),
    normalizeUrl(item.model_branded_3d_url),
    normalizeUrl(item.model_base_3d_url),
  ].filter((url): url is string => Boolean(url));

  return [...new Set(candidates)];
}
