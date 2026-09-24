// RF21 — classify a clothing piece's gender pattern (masculino/feminino/unissex)
// as an EDITABLE suggestion. Deterministic heuristic used as the baseline and as
// the fallback when the AI provider is unavailable.

export type GenderPattern = 'masculino' | 'feminino' | 'unissex';

export interface GenderClassification {
  gender: GenderPattern;
  confidence: number; // 0–1
  source: 'ai' | 'heuristic';
}

const FEMININE = ['vestido', 'dress', 'saia', 'skirt', 'blusa', 'cropped', 'salto', 'heel', 'scarpin', 'bolsa', 'lingerie', 'sutiã', 'legging', 'macaquinho', 'bata'];
const MASCULINE = ['gravata', 'tie', 'terno', 'suit', 'cueca', 'boxer', 'barba', 'masculin', 'bermudão'];

export function classifyGenderHeuristic(input: {
  name?: string;
  pieceType?: string;
  styleTags?: string[];
}): GenderClassification {
  const haystack = [input.name, input.pieceType, ...(input.styleTags ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const femHits = FEMININE.filter((kw) => haystack.includes(kw)).length;
  const mascHits = MASCULINE.filter((kw) => haystack.includes(kw)).length;

  if (femHits > mascHits) {
    return { gender: 'feminino', confidence: Math.min(0.9, 0.55 + femHits * 0.12), source: 'heuristic' };
  }
  if (mascHits > femHits) {
    return { gender: 'masculino', confidence: Math.min(0.9, 0.55 + mascHits * 0.12), source: 'heuristic' };
  }
  return { gender: 'unissex', confidence: 0.5, source: 'heuristic' };
}

export const isGenderPattern = (value: unknown): value is GenderPattern =>
  value === 'masculino' || value === 'feminino' || value === 'unissex';
