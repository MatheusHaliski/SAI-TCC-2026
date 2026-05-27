/**
 * Formats a like count for compact display: "47", "1.8k", "14.3M".
 * Trailing ".0" is stripped (e.g. 10 000 → "10k", not "10.0k").
 */
export function formatLikes(n: number): string {
  if (n < 1_000) return String(Math.floor(n));
  if (n < 1_000_000) {
    const val = n / 1_000;
    return `${parseFloat(val.toFixed(1))}k`;
  }
  const val = n / 1_000_000;
  return `${parseFloat(val.toFixed(1))}M`;
}
