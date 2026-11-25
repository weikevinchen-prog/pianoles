// Web Audio: eenvoudige pianoklank (voorspelen, begeleiding, scherm/toetsenbord) en metronoomklik.
let ac = null;

export function ensureAudio() {
  if (!ac) {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) ac = new C();
    } catch (e) { /* geen audio */ }
  }
  if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
  return ac;
}

export const audioNow = () => (ac ? ac.currentTime : 0);

/** Speel een noot. `at` = audiotijd (0 = nu), `dur` = uitklinktijd in seconden. */
export function tone(m, vel = 0.7, { at = 0, dur = 1.6 } = {}) {
  if (!ac) return;
  const f = 440 * 2 ** ((m - 69) / 12), t = Math.max(ac.currentTime, at || 0);
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.22 * vel, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  const o1 = ac.createOscillator(), o2 = ac.createOscillator(), g2 = ac.createGain();
  o1.type = 'triangle'; o1.frequency.value = f;
  o2.type = 'sine'; o2.frequency.value = f * 2; g2.gain.value = 0.3;
  o1.connect(g); o2.connect(g2).connect(g); g.connect(ac.destination);
  o1.start(t); o2.start(t); o1.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
}

/** Korte metronoomtik; accent = eerste tel. */
export function click(accent = false, at = 0) {
  if (!ac) return;
  const t = Math.max(ac.currentTime, at || 0);
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine';
  o.frequency.value = accent ? 1600 : 1050;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.22, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g).connect(ac.destination);
  o.start(t); o.stop(t + 0.06);
}
