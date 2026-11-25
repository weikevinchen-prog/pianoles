// Losse metronoom met nauwkeurige timing: tikken worden vooruit ingepland op de audioklok
// (lookahead), niet met setTimeout afgespeeld. onBeat(tel, maat) komt op het moment dat je de tik hoort.
import { ensureAudio, click } from './audio.js';

export function createMetronome({ bpm = 80, beats = 4, onBeat = () => {} } = {}) {
  let timer = null, nextTime = 0, beat = 0, running = false;
  const visual = [];
  const s = {
    get running() { return running; },
    bpm, beats,
    start() {
      const ac = ensureAudio();
      if (!ac || running) return;
      running = true;
      beat = 0;
      nextTime = ac.currentTime + 0.08;
      timer = setInterval(schedule, 25);
      schedule();
    },
    stop() {
      running = false;
      clearInterval(timer);
      visual.splice(0).forEach(clearTimeout);
    },
    toggle() { running ? s.stop() : s.start(); },
  };
  function schedule() {
    const ac = ensureAudio();
    while (nextTime < ac.currentTime + 0.12) {
      const b = beat % s.beats;
      click(b === 0, nextTime);
      const delay = Math.max(0, (nextTime - ac.currentTime) * 1000);
      visual.push(setTimeout(() => { visual.shift(); if (running) onBeat(b, s.beats); }, delay));
      nextTime += 60 / s.bpm;
      beat++;
    }
  }
  return s;
}

/** Tap-tempo: geef tijdstippen (ms) van tikken, krijg het tempo (of null). */
export function tapTempo(times) {
  const t = times.slice(-6);
  if (t.length < 3) return null;
  const gaps = t.slice(1).map((x, i) => x - t[i]).filter(g => g > 200 && g < 2000);
  if (gaps.length < 2) return null;
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  return Math.round(60000 / avg);
}
