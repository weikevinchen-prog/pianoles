import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whiteStep, fivePosition, anchor, createTracker, initialPositions } from '../js/player/handpos.js';
import { noteNum as n } from '../js/core/notation.js';

test('witte toetsen tellen', () => {
  assert.equal(whiteStep(n('C4'), 2), n('E4'));
  assert.equal(whiteStep(n('E4'), 1), n('F4'));
  assert.equal(whiteStep(n('C4'), -1), n('B3'));
});

test('C-positie en G-positie', () => {
  assert.deepEqual(fivePosition('C4', 'rh'), { 1: n('C4'), 2: n('D4'), 3: n('E4'), 4: n('F4'), 5: n('G4') });
  assert.deepEqual(fivePosition('C3', 'lh'), { 5: n('C3'), 4: n('D3'), 3: n('E3'), 2: n('F3'), 1: n('G3') });
  assert.equal(fivePosition('G4', 'rh')[4], n('C5'));
  assert.equal(fivePosition('G4 A4 B4 C5 D5', 'rh')[5], n('D5'));
});

test('anker en meevolgen (duim onderdoor)', () => {
  assert.deepEqual(anchor('lh', 1, n('G3')), fivePosition('C3', 'lh'));
  const t = createTracker({ rh: fivePosition('C4', 'rh') });
  t.follow([{ hand: 'rh', finger: 1, m: n('F4') }]);   // duim onder naar F
  assert.equal(t.pos.rh[1], n('F4'));
  assert.equal(t.pos.rh[5], n('C5'));
  t.follow([{ hand: 'rh', finger: 4, m: n('F#4') }]);   // één zwarte toets: enkel die vinger
  assert.equal(t.pos.rh[4], n('F#4'));
});

test('positie afleiden uit de noten', () => {
  const p = initialPositions(null, [{ hand: 'rh', finger: 3, m: n('E4') }]);
  assert.deepEqual(p.rh, fivePosition('C4', 'rh'));
  assert.equal(p.lh, undefined);
});
