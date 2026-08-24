/**
 * ports.ts — Portas (interfaces) da arquitetura de persistência poliglota.
 *
 * Padrão Ports & Adapters (arquitetura hexagonal): os Services dependem
 * destas INTERFACES, nunca de um driver de banco. Cada store ganha um
 * adaptador concreto que implementa a porta correspondente (ver ./README.md).
 * Trocar de tecnologia = trocar de adaptador; os Services não mudam.
 *
 * Regra de ouro: o MySQL (fonte da verdade) é o único store que ESCREVE dado
 * canônico. Feed, contadores e busca são projeções — preenchidas por eventos
 * a partir da fonte da verdade (fan-out on write), portanto eventualmente
 * consistentes.
 *
 * Este arquivo contém apenas tipos/contratos (zero dependências de runtime).
 */

// ─── Barramento de eventos ────────────────────────────────────────────────
// A fonte da verdade emite eventos de domínio; os projetores consomem.

export type DomainEventType =
  | 'LookPublished'
  | 'LookLiked'
  | 'UserFollowed'
  | 'PieceRated';

export interface DomainEvent<T = Record<string, unknown>> {
  type: DomainEventType;
  /** Id do agregado dono do evento (ex.: schemeId, userId). */
  aggregateId: string;
  occurredAt: string; // ISO-8601
  payload: T;
}

export interface EventBusPort {
  /** Publica um evento para os projetores assíncronos. */
  publish(event: DomainEvent): Promise<void>;
}

// ─── Feed / timeline (DynamoDB) ───────────────────────────────────────────
// Wide-column: partição = dono da timeline; ordenação = tempo (desc).

export interface TimelineEntry {
  ownerUserId: string;   // partition key — de quem é a timeline
  schemeId: string;
  authorUserId: string;
  createdAt: string;     // sort key (desc)
  coverImageUrl: string | null;
  title: string;
}

export interface TimelinePage {
  items: TimelineEntry[];
  /** Cursor opaco para a próxima página (paginação por chave, não OFFSET). */
  nextCursor: string | null;
}

export interface FeedTimelinePort {
  /** Grava uma entrada na timeline de UM seguidor (usado no fan-out). */
  append(entry: TimelineEntry): Promise<void>;
  /** Fan-out: grava a entrada nas timelines de vários seguidores em lote. */
  fanOut(entries: TimelineEntry[]): Promise<void>;
  /** Lê a timeline de um usuário, paginada por cursor. */
  read(ownerUserId: string, limit: number, cursor?: string): Promise<TimelinePage>;
}

// ─── Contadores e cache (Redis) ───────────────────────────────────────────

export interface CounterStorePort {
  increment(key: string, delta?: number): Promise<number>;
  get(key: string): Promise<number>;
  /** Grava JSON serializável com TTL (cache). */
  cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  cacheGet<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
}

// ─── Busca (OpenSearch) ───────────────────────────────────────────────────

export interface SearchDocument {
  id: string;
  index: 'pieces' | 'users' | 'schemes';
  fields: Record<string, unknown>;
}

export interface SearchQuery {
  index: SearchDocument['index'];
  text: string;
  filters?: Record<string, string | number | boolean>;
  limit?: number;
}

export interface SearchIndexPort {
  index(doc: SearchDocument): Promise<void>;
  remove(index: SearchDocument['index'], id: string): Promise<void>;
  search(query: SearchQuery): Promise<Array<{ id: string; score: number }>>;
}

// ─── Object storage (MinIO / S3 / Vercel Blob) ────────────────────────────

export interface ObjectStorePort {
  put(key: string, body: Buffer | Uint8Array, contentType: string): Promise<{ url: string }>;
  getUrl(key: string): string;
  remove(key: string): Promise<void>;
}
