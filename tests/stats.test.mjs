import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, weekSeconds, streakDays } from '../js/core/stats.js';
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
