import { test } from 'node:test';
import assert from 'node:assert/strict';
import { durationParts, spell, toMeasures, measureIndex } from '../js/core/staffdata.js';
import { buildPiece, noteNum } from '../js/core/notation.js';

test('duren opsplitsen', () => {
  assert.deepEqual(durationParts(4).map(p => p.code), ['w']);
  assert.deepEqual(durationParts(1.5).map(p => p.code), ['qd']);
  assert.deepEqual(durationParts(5).map(p => p.code), ['w', 'q']);
  assert.deepEqual(durationParts(2.5).map(p => p.code), ['h', '8']);
});

test('spelling volgens toonsoort', () => {
  assert.equal(spell(noteNum('C4')), 'c/4');
  assert.equal(spell(noteNum('F#4'), 'G'), 'f#/4');
  assert.equal(spell(noteNum('A#3'), 'F'), 'bb/3');
});

test('maten met rusten en akkoorden', () => {
  const p = buildPiece({ rh: 'C4 D4 E4 F4 | G4:4', lh: '[C3 E3 G3]:4 | R:2 G2:2' }, { meter: [4, 4] });
  const { measures, hands } = toMeasures(p.notes, { meter: [4, 4] });
  assert.deepEqual(hands, ['rh', 'lh']);
  assert.equal(measures.length, 2);
  assert.deepEqual(measures[0].rh.map(e => e.code), ['q', 'q', 'q', 'q']);
  assert.deepEqual(measures[0].lh[0].midis, [48, 52, 55]);
  assert.deepEqual(measures[1].lh.map(e => [e.code, e.rest]), [['h', true], ['h', false]]);
});

test('overbinding over de maatstreep en opmaat', () => {
  const { measures } = toMeasures([{ m: 60, b: 3, bd: 2, hand: 'rh', finger: 1 }], { meter: [4, 4] });
  assert.equal(measures.length, 2);
  assert.equal(measures[0].rh.at(-1).tie, true);
  assert.equal(measures[1].rh[0].tie, false);
  assert.equal(measures[1].rh[0].notes.length, 0);  // vervolgdeel draagt de noot niet opnieuw
  const fe = buildPiece({ rh: 'E5:.5 D#5:.5 | E5:3' }, { meter: [3, 8] });
  const r = toMeasures(fe.notes, { meter: [3, 8], pickup: 1 });
  assert.equal(r.measures[0].len, 1);
  assert.equal(r.measures[0].rh[0].code, '16');
  assert.equal(measureIndex(r.measures, 1.5), 1);
});

test('3/4: lege maat wordt rust', () => {
  const p = buildPiece({ rh: 'C4:3 | R:3 | E4:3', lh: 'C3:3 | C3:3 | C3:3' }, { meter: [3, 4] });
  const { measures } = toMeasures(p.notes, { meter: [3, 4] });
  assert.deepEqual(measures[1].rh.map(e => [e.code, e.rest]), [['hd', true]]);
});
