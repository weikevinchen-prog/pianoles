// Alle invoer samen: MIDI, laptoptoetsenbord en tikken op het schermklavier.
// Iedereen luistert naar bus-events 'noteon' {m, vel, src, time}, 'noteoff' {m, src}, 'pedal' (bool) en 'space'.
import { bus } from './events.js';
import { ensureAudio, tone } from './audio.js';
import * as store from './storage.js';
import { isEcho } from './playback.js';

export const pressed = new Set();
export const state = { pedal: false, kbOct: 4, lastSrc: null };

/** src: 'midi' | 'kbd' | 'touch' */
export function noteOn(m, vel = 0.7, src = 'touch') {
  if (m < 21 || m > 108) return;
  pressed.add(m);
  state.lastSrc = src;
  const s = store.get().settings.sound;
  // Als de noot van de piano komt, klinkt de piano al: de app speelt dan zelf niets (behalve bij 'on').
  if (s === 'on' || (s === 'auto' && src !== 'midi')) { ensureAudio(); tone(m, vel); }
  trackPractice();
  bus.emit('noteon', { m, vel, src, time: performance.now() });
}

export function noteOff(m, src = 'touch') {
  pressed.delete(m);
  bus.emit('noteoff', { m, src });
}

bus.on('midi:on', (m, v) => { if (!isEcho(m)) noteOn(m, v, 'midi'); });
bus.on('midi:off', m => noteOff(m, 'midi'));
bus.on('midi:pedal', p => { state.pedal = p; bus.emit('pedal', p); });

// ---------- laptoptoetsenbord (QWERTY/AZERTY op positie) ----------
const KMAP = { KeyA: 0, KeyW: 1, KeyS: 2, KeyE: 3, KeyD: 4, KeyF: 5, KeyT: 6, KeyG: 7, KeyY: 8, KeyH: 9, KeyU: 10, KeyJ: 11, KeyK: 12, KeyO: 13, KeyL: 14, KeyP: 15, Semicolon: 16, Quote: 17 };
const typing = t => t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
const down = new Map();

export function attachKeyboard() {
  addEventListener('keydown', e => {
    if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === 'Space') {
      if (e.target && e.target.tagName === 'BUTTON') return; // spatie op een knop = die knop
      e.preventDefault();
      if (!e.repeat) bus.emit('space');
      return;
    }
    if (e.repeat) return;
    if (e.code === 'KeyZ') { state.kbOct = Math.max(0, state.kbOct - 1); bus.emit('kboct', state.kbOct); return; }
    if (e.code === 'KeyX') { state.kbOct = Math.min(7, state.kbOct + 1); bus.emit('kboct', state.kbOct); return; }
    if (e.code in KMAP) {
      const m = (state.kbOct + 1) * 12 + KMAP[e.code];
      down.set(e.code, m);
      noteOn(m, 0.7, 'kbd');
    }
  });
  addEventListener('keyup', e => {
    const m = down.get(e.code);
    if (m !== undefined) { down.delete(e.code); noteOff(m, 'kbd'); }
  });
}

// ---------- oefentijd ----------
// Tijd tussen twee noten telt als oefentijd als de pauze korter is dan 20 seconden.
let lastNote = 0, pending = 0;
function trackPractice() {
  const now = performance.now();
  if (lastNote && now - lastNote < 20000) pending += (now - lastNote) / 1000;
  lastNote = now;
  if (pending >= 15) flushPractice();
}
export function flushPractice() {
  if (pending <= 0) return;
  const p = pending;
  pending = 0;
  store.addPractice(p);
}
