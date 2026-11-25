import { test } from 'node:test';
import assert from 'node:assert/strict';
import { noteNum, noteName, pcNum, parseVoice, buildPiece, parseRange, parseTargets, isBlack } from '../js/core/notation.js';

test('noteNum en noteName', () => {
  assert.equal(noteNum('C4'), 60);
  assert.equal(noteNum('A0'), 21);
  assert.equal(noteNum('C8'), 108);
  assert.equal(noteNum('F#3'), 54);
  assert.equal(noteNum('Bb3'), 58);
  assert.equal(noteName(60, 'abc', true), 'C4');
  assert.equal(noteName(67, 'do'), 'sol');
  assert.equal(noteName(60, 'off'), '');
  assert.equal(pcNum('C#'), 1);
  assert.equal(pcNum('Bb'), 10);
  assert.equal(pcNum('C4'), null);
  assert.ok(isBlack(61) && !isBlack(60));
  assert.throws(() => noteNum('H4'));
});

test('parseVoice: oude notatie blijft werken', () => {
  const v = parseVoice('C4 D4 E4:2 R G4:.5');
  assert.deepEqual(v.notes.map(n => [n.m, n.b, n.bd]), [[60, 0, 1], [62, 1, 1], [64, 2, 2], [67, 5, 0.5]]);
  assert.equal(v.beats, 5.5);
});

test('parseVoice: vingers, akkoorden, maatstrepen', () => {
  const v = parseVoice('C4/1 D4/2 E4/3:2 | [C3/5 E3/3 G3/1]:4 |');
  assert.equal(v.notes[2].finger, 3);
  assert.equal(v.notes.filter(n => n.b === 4).length, 3);
  assert.deepEqual(v.warnings, []);
  assert.equal(parseVoice('C4 D4 | E4 | F4:4').warnings.length, 1);
  assert.throws(() => parseVoice('C4/7'));
});

test('buildPiece: seconden, handen, maten', () => {
  const p = buildPiece({ rh: 'E4 F4 G4 A4 | B4:4', lh: 'C3:4 | G2:4' }, { bpm: 120, meter: [4, 4] });
  assert.equal(p.measures, 2);
  const b4 = p.notes.find(n => n.m === noteNum('B4'));
  assert.equal(b4.t, 2);
  assert.equal(b4.measure, 1);
  assert.equal(p.notes.find(n => n.m === noteNum('G2')).hand, 'lh');
  assert.equal(buildPiece('C4 D4').notes[0].hand, 'rh');
});

test('parseRange en parseTargets', () => {
  assert.deepEqual(parseRange('C3 B4'), [48, 71]);
  assert.deepEqual(parseRange('C#3 B4'), [48, 71]);
  assert.deepEqual(parseTargets('C', 48, 72).notes, [48, 60, 72]);
  assert.deepEqual(parseTargets('C4 C5 C3', 21, 108).notes, [60, 72, 48]);
  assert.deepEqual(parseTargets('C# D#', 48, 59).notes, [49, 51]);
  assert.equal(parseTargets('C', 21, 108).notes.length, 8);
});
