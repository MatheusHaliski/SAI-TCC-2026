import { WardrobePieceType, WardrobeTargetGender } from '@/app/lib/fashion-ai/types/wardrobe-fit';

const TOP_TOKENS = ['shirt', 'camisa', 't-shirt', 'tee', 'blouse', 'jacket', 'hoodie', 'coat', 'upper', 'top'];
const BOTTOM_TOKENS = ['pants', 'jeans', 'shorts', 'skirt', 'lower', 'bottom', 'calça'];
const SHOE_TOKENS = ['shoe', 'sneaker', 'boot', 'heel', 'sandals'];
const FULL_BODY_TOKENS = ['dress', 'jumpsuit', 'macacão', 'one-piece', 'full'];

export function classifyGarmentType(input: { pieceType?: string; name?: string }): WardrobePieceType {
  const text = `${input.pieceType ?? ''} ${input.name ?? ''}`.toLowerCase();

  if (FULL_BODY_TOKENS.some((token) => text.includes(token))) return 'full_body';
  if (TOP_TOKENS.some((token) => text.includes(token))) return 'top';
  if (BOTTOM_TOKENS.some((token) => text.includes(token))) return 'bottom';
  if (SHOE_TOKENS.some((token) => text.includes(token))) return 'shoes';
  return 'accessory';
}

export function classifyGarmentGender(input: { gender?: string; name?: string }): WardrobeTargetGender {
  const gender = String(input.gender ?? '').toLowerCase().trim();
  const text = `${gender} ${input.name ?? ''}`.toLowerCase();

  if (['male', 'masculino', 'man', 'men', 'masc'].some((token) => text.includes(token))) return 'male';
  if (['female', 'feminino', 'woman', 'women', 'fem'].some((token) => text.includes(token))) return 'female';
  return 'unisex';
}
