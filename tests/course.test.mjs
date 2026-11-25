import { test } from 'node:test';
import assert from 'node:assert/strict';
import COURSE from '../js/data/course.js';
import SONGS from '../js/data/songs.js';
import PROBES from '../js/data/placement.js';
import STEP_TYPES_LIST from './step-types.mjs';
import { flat, isUnlocked, recordLesson, firstOpen, courseStats, skipChapter } from '../js/lesson/course.js';
import { parseRange, parseTargets, buildPiece, pcNum, noteNum } from '../js/core/notation.js';

function checkStep(s, where) {
  assert.ok(STEP_TYPES_LIST.includes(s.type), `${where}: onbekend staptype ${s.type}`);
  const [lo, hi] = parseRange(s.range);
  if (s.targets) assert.ok(parseTargets(s.targets, lo, hi).notes.length > 0, `${where}: geen doeltoetsen`);
  if (s.pool) for (const t of s.pool.split(/\s+/)) assert.ok(pcNum(t) !== null || noteNum(t), `${where}: ${t}`);
  for (const sh of s.show || []) parseTargets(sh.targets, lo, hi);
  if (['explain', 'find', 'quiz'].includes(s.type) && s.type !== 'quiz') assert.ok(s.text, `${where}: tekst ontbreekt`);
}

test('lesdata is geldig en ids zijn uniek', () => {
  const ids = new Set();
  for (const ch of COURSE.chapters) {
    assert.ok(ch.id && ch.title);
    for (const l of ch.lessons) {
      assert.ok(!ids.has(l.id), `dubbele id ${l.id}`);
      ids.add(l.id);
      assert.ok(l.steps.length > 0);
      l.steps.forEach((s, i) => checkStep(s, `${l.id} stap ${i + 1}`));
    }
  }
  for (const p of PROBES) p.steps.forEach((s, i) => checkStep(s, `instaptest ${p.chapter} stap ${i + 1}`));
});

test('liedjes parsen zonder fouten', () => {
  const ids = new Set();
  for (const s of SONGS) {
    assert.ok(!ids.has(s.id));
    ids.add(s.id);
    for (const [v, piece] of Object.entries(s.versions)) {
      const p = buildPiece(piece, { bpm: s.bpm, meter: s.meter });
      assert.ok(p.notes.length > 0, `${s.id}/${v}`);
      assert.deepEqual(p.warnings, [], `${s.id}/${v}: ${p.warnings.join('; ')}`);
    }
  }
});

test('vergrendeling: lessen gaan open na 1 ster, examen kan altijd', () => {
  const L = flat().map(x => x.lesson.id);
  const prog = {};
  assert.ok(isUnlocked(L[0], prog));
  assert.ok(!isUnlocked(L[1], prog));
  assert.ok(isUnlocked('h1-ex', prog));
  recordLesson(prog, L[0], { stars: 0, acc: 40 });
  assert.ok(!isUnlocked(L[1], prog));
  recordLesson(prog, L[0], { stars: 2, acc: 85 });
  assert.ok(isUnlocked(L[1], prog));
  assert.equal(firstOpen(prog).id, L[1]);
  recordLesson(prog, L[0], { stars: 1, acc: 60 });
  assert.equal(prog[L[0]].stars, 2);       // beste score blijft
  assert.equal(prog[L[0]].best, 85);
});

test('gehaald examen of instaptest geeft hoofdstuk vrij als overgeslagen', () => {
  const prog = {};
  recordLesson(prog, 'h1-ex', { stars: 1, acc: 70 });
  assert.equal(prog['h1-l3'].status, 'skipped');
  assert.equal(courseStats(prog).done, courseStats(prog).total);
  const p2 = { 'h1-l1': { stars: 3, status: 'done' } };
  skipChapter(p2, 'h1');
  assert.equal(p2['h1-l1'].status, 'done');
  assert.equal(p2['h1-l2'].status, 'skipped');
});
