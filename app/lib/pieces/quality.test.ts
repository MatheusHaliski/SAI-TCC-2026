import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeQualityStars, QUALITY_BOOST } from './quality.ts';

describe('computeQualityStars', () => {
  const base = 3.0;

  it('returns base quality when likes = 0', () => {
    assert.equal(computeQualityStars(base, 0), base);
  });

  it('returns ~3.5 at 10 likes (log10(11) * 0.5 ≈ 0.52)', () => {
    const result = computeQualityStars(base, 10);
    assert.ok(result > 3.49 && result < 3.55, `expected ~3.5 got ${result}`);
  });

  it('returns ~4.0 at 100 likes (log10(101) * 0.5 ≈ 1.0)', () => {
    const result = computeQualityStars(base, 100);
    assert.ok(result > 3.99 && result < 4.05, `expected ~4.0 got ${result}`);
  });

  it('returns ~4.5 at 1 000 likes (log10(1001) * 0.5 ≈ 1.5)', () => {
    const result = computeQualityStars(base, 1_000);
    assert.ok(result > 4.49 && result < 4.55, `expected ~4.5 got ${result}`);
  });

  it('clamps to 5.0 at 10 000 likes (would exceed 5)', () => {
    const result = computeQualityStars(base, 10_000);
    assert.equal(result, 5.0);
  });

  it('clamps lower bound to 0 when base is negative', () => {
    assert.equal(computeQualityStars(-10, 0), 0);
  });

  it('clamps upper bound to 5 for very high base + many likes', () => {
    assert.equal(computeQualityStars(5, 1_000_000), 5);
  });

  it('treats negative likes same as 0 (max(0, likes) guard)', () => {
    assert.equal(computeQualityStars(base, -500), base);
  });

  it('respects a custom boost value', () => {
    const result = computeQualityStars(3.0, 10, 1.0);
    const expected = 3.0 + Math.log10(11) * 1.0;
    assert.ok(Math.abs(result - expected) < 0.001, `expected ${expected} got ${result}`);
  });

  it('QUALITY_BOOST constant is 0.5', () => {
    assert.equal(QUALITY_BOOST, 0.5);
  });
});
