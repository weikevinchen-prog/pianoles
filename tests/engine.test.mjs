import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEngine, starsFor, LEAD } from '../js/player/engine.js';
import { buildPiece } from '../js/core/notation.js';

const run = (e, sec) => { for (let t = 0; t < sec; t += 0.02) e.update(0.02); };

test('sterren', () => {
  assert.equal(starsFor(95), 3);
  assert.equal(starsFor(80), 2);
  assert.equal(starsFor(50), 1);
  assert.equal(starsFor(49), 0);
});

test('wachtmodus wacht op de juiste noot', () => {
  let finished = null;
  const e = createEngine(buildPiece('C4 D4 E4', { bpm: 60 }).notes, { mode: 'wait', onFinish: r => (finished = r) });
  e.toggle();
  run(e, LEAD + 5);
  assert.equal(e.clock, 0);              // blijft staan bij de eerste noot
  assert.equal(e.noteOn(61), 'wrong');
  assert.equal(e.noteOn(60), 'hit');
  run(e, 1.1);
  assert.equal(e.noteOn(62), 'hit');
  run(e, 1.1);
  assert.equal(e.noteOn(64), 'hit');
  run(e, 3);
  assert.ok(finished);
  assert.equal(finished.hit, 3);
  assert.equal(finished.wrong, 1);
  assert.equal(finished.acc, 75);
  assert.deepEqual(finished.hardest, [{ measure: 0, errors: 1 }]);
});

test('op tempo: gemiste noten, te vroeg/te laat', () => {
  const e = createEngine(buildPiece('C4 D4 E4', { bpm: 60 }).notes, { mode: 'play' });
  e.toggle();
  run(e, LEAD - 0.1);                    // klok ≈ -0.1: iets te vroeg voor C4
  assert.equal(e.noteOn(60), 'hit');
  assert.equal(e.st.early, 1);
  run(e, 3);                             // D4 en E4 nooit gespeeld
  assert.equal(e.st.miss >= 1, true);
});

test('één hand oefenen: de andere hand speelt de app', () => {
  const played = [];
  const e = createEngine(buildPiece({ rh: 'E4:2', lh: 'C3 C3' }, { bpm: 60 }).notes, { mode: 'wait', hands: 'rh', playTone: n => played.push(n.m) });
  e.toggle();
  run(e, LEAD + 0.1);
  assert.deepEqual(played, [48]);        // eerste LH-noot automatisch
  assert.equal(e.groups.length, 1);      // alleen RH moet je spelen
});

test('voorspelen speelt alles zelf', () => {
  const played = [];
  const e = createEngine(buildPiece('C4 D4', { bpm: 120 }).notes, { mode: 'demo', playTone: n => played.push(n.m) });
  e.toggle();
  run(e, LEAD + 2);
  assert.deepEqual(played, [60, 62]);
  assert.equal(e.noteOn(60), null);
});
