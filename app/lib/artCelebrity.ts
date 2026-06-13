export type TributeType = 'look' | 'creator' | 'brand';

export type ConsagrationLevel = 'em-formacao' | 'arena' | 'consagrado';

const CONSAGRACTION_THRESHOLD = 100;

export function normalizeTributeType(value?: string | null): TributeType {
  const normalized = (value ?? '').trim().toLowerCase();

  if (normalized === 'look' || normalized === 'outfit') return 'look';
  if (normalized === 'criador' || normalized === 'creator' || normalized === 'creator') return 'creator';
  if (normalized === 'marca' || normalized === 'brand') return 'brand';

  return 'creator';
}

export function getConsagrationStatus(votes: number, tributes: number): { level: ConsagrationLevel; score: number } {
  const score = Number(votes || 0) + Number(tributes || 0) * 2;

  if (score >= CONSAGRACTION_THRESHOLD) return { level: 'consagrado', score };
  if (score >= 40) return { level: 'arena', score };

  return { level: 'em-formacao', score };
}

export function getConsagrationLabel(level: ConsagrationLevel | string): string {
  switch (level) {
    case 'consagrado':
      return 'Consagrado';
    case 'arena':
      return 'Arena';
    default:
      return 'Em formação';
  }
}

export function getConsagrationProgressPercent(votes: number, tributes: number): number {
  const score = Number(votes || 0) + Number(tributes || 0) * 2;
  return Math.min(100, Math.max(0, score));
}

export function getConsagrationGoal(votes: number, tributes: number): number {
  const score = Number(votes || 0) + Number(tributes || 0) * 2;
  const nextMilestone = score >= 40 ? 100 : 40;
  return Math.max(0, nextMilestone - score);
}
