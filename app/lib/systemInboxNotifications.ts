const STORAGE_KEY = 'sai-system-inbox-unread-count';
const EVENT_NAME = 'sai-system-inbox-unread-change';

function sanitizeCount(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}

export function getSystemInboxUnreadCount(): number {
  if (typeof window === 'undefined') return 0;
  return sanitizeCount(window.localStorage.getItem(STORAGE_KEY));
}

export function setSystemInboxUnreadCount(nextCount: number): number {
  if (typeof window === 'undefined') return 0;
  const normalized = sanitizeCount(nextCount);
  window.localStorage.setItem(STORAGE_KEY, String(normalized));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { unreadCount: normalized } }));
  return normalized;
}

export function incrementSystemInboxUnreadCount(step = 1): number {
  const current = getSystemInboxUnreadCount();
  return setSystemInboxUnreadCount(current + sanitizeCount(step));
}

export function clearSystemInboxUnreadCount(): number {
  return setSystemInboxUnreadCount(0);
}

export { EVENT_NAME as SYSTEM_INBOX_UNREAD_EVENT };
