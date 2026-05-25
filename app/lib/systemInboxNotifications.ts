const STORAGE_KEY = 'sai-system-inbox-unread-count';
const MESSAGES_STORAGE_KEY = 'sai-system-inbox-messages';
const EVENT_NAME = 'sai-system-inbox-unread-change';
const MAX_MESSAGES = 50;

export interface SystemInboxMessage {
  id: string;
  title: string;
  summary: string;
  level: 'info' | 'success' | 'error';
  timestamp: number;
}

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

export function getSystemInboxMessages(): SystemInboxMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushSystemInboxMessage(msg: Omit<SystemInboxMessage, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const messages = getSystemInboxMessages();
  const next: SystemInboxMessage = {
    ...msg,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
  };
  const updated = [next, ...messages].slice(0, MAX_MESSAGES);
  window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
  incrementSystemInboxUnreadCount(1);
}

export function clearSystemInboxMessages(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(MESSAGES_STORAGE_KEY);
}

export { EVENT_NAME as SYSTEM_INBOX_UNREAD_EVENT };
