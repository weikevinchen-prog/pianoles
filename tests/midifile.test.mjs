import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMidi, splitHands, loadMidiFile } from '../js/core/midifile.js';

// Bouw een klein type-1 MIDI-bestand: spoor 1 = melodie (C5, E5), spoor 2 = bas (C3), 480 ticks per kwart.
function vlq(n) { const b = [n & 127]; while ((n >>= 7)) b.unshift((n & 127) | 128); return b; }
function track(events) {
  const body = [];
  for (const [dt, ...bytes] of events) body.push(...vlq(dt), ...bytes);
  body.push(0, 0xff, 0x2f, 0);
  const len = body.length;
  return [0x4d, 0x54, 0x72, 0x6b, (len >>> 24) & 255, (len >>> 16) & 255, (len >>> 8) & 255, len & 255, ...body];
}
function file(tracks) {
  const head = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 1, 0, tracks.length, 0x01, 0xe0];
  return new Uint8Array([...head, ...tracks.flat()]);
}
const tempo = [0, 0xff, 0x51, 3, 0x07, 0xa1, 0x20]; // 500000 us = 120 bpm
const mel = track([tempo, [0, 0x90, 72, 100], [480, 0x80, 72, 0], [0, 0x90, 76, 90], [480, 0x90, 76, 0]]);
const bass = track([[0, 0x91, 48, 80], [960, 0x81, 48, 0]]);

test('parseMidi leest noten, tijden en sporen', () => {
  const { notes } = parseMidi(file([mel, bass]));
  assert.equal(notes.length, 3);
  const e5 = notes.find(n => n.m === 76);
  assert.ok(Math.abs(e5.t - 0.5) < 1e-9);
  assert.ok(Math.abs(e5.d - 0.5) < 1e-9);
  assert.equal(notes.find(n => n.m === 48).track, 1);
});

test('splitHands per spoor', () => {
  const notes = loadMidiFile(file([mel, bass]));
  assert.equal(notes.find(n => n.m === 72).hand, 'rh');
  assert.equal(notes.find(n => n.m === 48).hand, 'lh');
});

test('splitHands rond C4 bij één spoor', () => {
  const r = splitHands([{ m: 59, t: 0, d: 1, track: 0, ch: 0 }, { m: 60, t: 0, d: 1, track: 0, ch: 0 }]);
  assert.deepEqual(r.map(n => n.hand), ['lh', 'rh']);
});

test('ongeldig bestand geeft een duidelijke fout', () => {
  assert.throws(() => parseMidi(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])), /Geen geldig MIDI/);
});
