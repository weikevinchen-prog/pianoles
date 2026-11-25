import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkout, rhythmPattern, seeded } from '../js/workout/generator.js';
import { flat } from '../js/lesson/course.js';
import { buildPiece, parseTargets } from '../js/core/notation.js';
import { defaults } from '../js/core/storage.js';
import STEP_TYPES from './step-types.mjs';

const upTo = id => {
  const lessons = {};
  for (const x of flat()) { lessons[x.lesson.id] = { stars: 2, status: 'done', date: '2026-11-01T10:00:00Z' }; if (x.lesson.id === id) break; }
  return { ...defaults(), lessons };
};
const valid = w => {
  for (const it of w.items) for (const s of it.steps) {
    assert.ok(STEP_TYPES.includes(s.type), it.title);
    if (s.type === 'piece') {
      const p = buildPiece({ rh: s.rh, lh: s.lh }, { bpm: s.bpm, meter: s.meter || [4, 4] });
      assert.ok(p.notes.length && p.notes.every(n => n.finger), it.title);
      assert.deepEqual(p.warnings, [], it.title);
    }
    if (s.pool) assert.ok(s.pool.split(' ').length > 0);
    if (s.range) parseTargets('C', ...[48, 72]);
  }
};

test('nieuwe gebruiker: nog geen opwarming', () => {
  assert.equal(buildWorkout(defaults(), { date: '2026-11-25' }).ready, false);
});

test('beginner (hoofdstuk 1-2): vinger-, ladder-, herhaal- en vindoefening', () => {
  const w = buildWorkout(upTo('h2-l4'), { date: '2026-11-25' });
  assert.ok(w.ready);
  const kinds = w.items.map(i => i.kind);
  assert.ok(kinds.includes('finger') && kinds.includes('scale') && kinds.includes('review') && kinds.includes('reading'));
  assert.equal(w.items.find(i => i.kind === 'reading').steps[0].type, 'quiz');
  valid(w);
});

test('gevorderd: toonladders, notenbalk, zelfde dag = zelfde opwarming', () => {
  const st = upTo('h14-ex');
  const a = buildWorkout(st, { date: '2026-11-25' }), b = buildWorkout(st, { date: '2026-11-25' });
  assert.deepEqual(a, b);
  assert.equal(a.items.find(i => i.kind === 'reading').steps[0].type, 'staffquiz');
  assert.equal(a.items.find(i => i.kind === 'reading').steps[0].clef, 'grand');
  assert.ok(a.minutes >= 3 && a.minutes <= 15, `duur ${a.minutes}`);
  valid(a);
  // over 20 dagen: alle soorten komen eens voor en alles is geldig
  const seen = new Set();
  for (let d = 1; d <= 20; d++) { const w = buildWorkout(st, { date: `2026-12-${String(d).padStart(2, '0')}` }); valid(w); w.items.forEach(i => seen.add(i.kind)); }
  assert.deepEqual([...seen].sort(), ['finger', 'reading', 'review', 'rhythm', 'scale']);
});

test('zwakke noten komen vaker in de leesquiz', () => {
  const st = upTo('h9-ex');
  st.weak.notes = { 53: { seen: 10, wrong: 6 } }; // F3
  const w = buildWorkout(st, { date: '2026-11-25' });
  const pool = w.items.find(i => i.kind === 'reading').steps[0].pool.split(' ');
  assert.ok(pool.filter(n => n === 'F3').length >= 3);
});

test('herhaling kiest de zwakste les', () => {
  const st = upTo('h3-l5');
  st.lessons['h3-l2'].stars = 1;
  const w = buildWorkout(st, { date: '2026-11-25' });
  assert.equal(w.items.find(i => i.kind === 'review').lessonId, 'h3-l2');
});

test('ritmepatroon vult elke maat precies', () => {
  const rnd = seeded('x');
  for (let i = 0; i < 30; i++) {
    const p = buildPiece(rhythmPattern(rnd, { eighths: true, dotted: true }), { meter: [4, 4] });
    assert.deepEqual(p.warnings, []);
    assert.equal(p.beats, 16);
  }
});
