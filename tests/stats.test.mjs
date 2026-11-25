import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, weekSeconds, streakDays, longestStreak, totalSeconds, heatmap, median } from '../js/core/stats.js';
import { merge, defaults } from '../js/core/storage.js';

const day = (base, off) => { const d = new Date(base); d.setDate(d.getDate() + off); return dayKey(d); };

test('streak en weektotaal', () => {
  const today = new Date(2026, 10, 25);
  const p = { [day(today, 0)]: 120, [day(today, -1)]: 300, [day(today, -2)]: 61, [day(today, -4)]: 600, [day(today, -9)]: 999 };
  assert.equal(streakDays(p, today), 3);
  assert.equal(weekSeconds(p, today), 120 + 300 + 61 + 600);
  delete p[day(today, 0)];
  assert.equal(streakDays(p, today), 2);  // vandaag nog niet geoefend: reeks loopt nog
  assert.equal(streakDays({}, today), 0);
});

test('storage.merge vult aan en behoudt data', () => {
  const m = merge(defaults(), { settings: { names: 'do' }, lessons: { a: { stars: 2 } }, extra: 1 });
  assert.equal(m.settings.names, 'do');
  assert.equal(m.settings.sound, 'auto');
  assert.deepEqual(m.lessons, { a: { stars: 2 } });
  assert.equal(m.extra, 1);
  assert.deepEqual(merge(defaults(), { settings: 'kapot' }).settings, defaults().settings);
});


test('langste reeks, totaal en heatmap', () => {
  const p = { '2026-11-01': 100, '2026-11-02': 100, '2026-11-03': 100, '2026-11-05': 100, '2026-11-06': 30, '2026-10-31': 70 };
  assert.equal(longestStreak(p), 4);
  assert.equal(totalSeconds(p), 500);
  const h = heatmap(p, new Date(2026, 10, 25), 4);
  assert.equal(h.length, 4);
  assert.equal(h[0].length, 7);
  assert.equal(h[3].find(d => d.key === '2026-11-25').future, false);
  assert.equal(h[3][6].key, '2026-11-29'); // zondag
  assert.ok(h[3][6].future);
});

test('mediaan', () => {
  assert.equal(median([5, 1, 3]), 3);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(median([]), null);
});
