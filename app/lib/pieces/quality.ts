export const QUALITY_BOOST = 0.5;

/**
 * Derives a 0–5★ quality score from a base quality rating + community likes.
 * Log scale prevents viral pieces from trivially hitting 5★ while still
 * rewarding niche pieces that accumulate any traction.
 */
export function computeQualityStars(
  baseQuality: number,
  likes: number,
  boost = QUALITY_BOOST,
): number {
  const raw = baseQuality + Math.log10(Math.max(0, likes) + 1) * boost;
  return Math.max(0, Math.min(5, raw));
}
