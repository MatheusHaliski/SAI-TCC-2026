import test from 'node:test';
import assert from 'node:assert/strict';

import { getConsagrationGoal, getConsagrationLabel, getConsagrationProgressPercent, getConsagrationStatus, normalizeTributeType } from './artCelebrity.ts';

test('normalizeTributeType normalizes known values', () => {
  assert.equal(normalizeTributeType('LOOK'), 'look');
  assert.equal(normalizeTributeType('Criador'), 'creator');
  assert.equal(normalizeTributeType('brand'), 'brand');
});

test('getConsagrationStatus maps vote and tribute activity to a status tier', () => {
  assert.equal(getConsagrationStatus(0, 0).level, 'em-formacao');
  assert.equal(getConsagrationStatus(30, 10).level, 'arena');
  assert.equal(getConsagrationStatus(80, 30).level, 'consagrado');
});

test('getConsagrationLabel and progress reflect the current milestone', () => {
  assert.equal(getConsagrationLabel('arena'), 'Arena');
  assert.equal(getConsagrationLabel('consagrado'), 'Consagrado');
  assert.equal(getConsagrationProgressPercent(40, 0), 40);
  assert.equal(getConsagrationProgressPercent(100, 0), 100);
});

test('getConsagrationGoal reports how many points are left to the next milestone', () => {
  assert.equal(getConsagrationGoal(0, 0), 40);
  assert.equal(getConsagrationGoal(20, 0), 20);
  assert.equal(getConsagrationGoal(80, 0), 20);
});
