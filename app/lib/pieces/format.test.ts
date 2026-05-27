import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatLikes } from './format.ts';

describe('formatLikes', () => {
  it('shows plain number below 1 000', () => {
    assert.equal(formatLikes(0), '0');
    assert.equal(formatLikes(1), '1');
    assert.equal(formatLikes(47), '47');
    assert.equal(formatLikes(999), '999');
  });

  it('formats thousands with "k" suffix', () => {
    assert.equal(formatLikes(1_000), '1k');
    assert.equal(formatLikes(1_800), '1.8k');
    assert.equal(formatLikes(10_000), '10k');
    assert.equal(formatLikes(42_000), '42k');
    assert.equal(formatLikes(999_000), '999k');
  });

  it('formats millions with "M" suffix', () => {
    assert.equal(formatLikes(1_000_000), '1M');
    assert.equal(formatLikes(14_300_000), '14.3M');
    assert.equal(formatLikes(100_000_000), '100M');
  });

  it('strips trailing ".0" from k values', () => {
    assert.ok(!formatLikes(5_000).includes('.0'), formatLikes(5_000));
  });

  it('strips trailing ".0" from M values', () => {
    assert.ok(!formatLikes(2_000_000).includes('.0'), formatLikes(2_000_000));
  });
});
