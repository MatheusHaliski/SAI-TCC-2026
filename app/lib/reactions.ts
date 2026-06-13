// RF24 (Loop Social): "Aprovar o look" with fashion reactions instead of a
// generic like. Each user has at most one reaction per outfit.

export type ReactionKey = 'fire' | 'elegant' | 'creative';

export interface ReactionMeta {
  key: ReactionKey;
  emoji: string;
  label: string;
}

export const REACTIONS: ReactionMeta[] = [
  { key: 'fire', emoji: '🔥', label: 'Trend' },
  { key: 'elegant', emoji: '✨', label: 'Elegante' },
  { key: 'creative', emoji: '💡', label: 'Criativo' },
];

export const REACTION_KEYS: ReactionKey[] = REACTIONS.map((r) => r.key);

export const isReactionKey = (value: unknown): value is ReactionKey =>
  typeof value === 'string' && (REACTION_KEYS as string[]).includes(value);

export type ReactionCounts = Record<ReactionKey, number>;

export const emptyReactionCounts = (): ReactionCounts => ({ fire: 0, elegant: 0, creative: 0 });
