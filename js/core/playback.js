// Noten die de app zelf speelt (voorspelen, begeleiding, de andere hand): via Web Audio, of via de
// piano zelf (MIDI out) als dat ingesteld is. Bij MIDI out filteren we een eventuele echo van de piano.
import { tone } from './audio.js';
import { midi } from './midi.js';
import { get } from './storage.js';

const sent = new Map(); // noot -> tijdstip waarop de app hem naar de piano stuurde

export const viaPiano = () => get().settings.accompaniment === 'piano' && midi.outputs.length > 0;

/** dur in seconden (klinkende duur, al rekening houdend met het tempo) */
export function playNote(m, vel = 0.7, dur = 0.5) {
  if (viaPiano()) {
    try {
      const out = midi.outputs[0];
      out.send([0x90, m, Math.max(1, Math.min(127, Math.round(vel * 110)))]);
      out.send([0x80, m, 0], performance.now() + Math.max(80, dur * 1000));
      sent.set(m, performance.now());
      return;
    } catch (e) { /* val terug op Web Audio */ }
  }
  tone(m, vel, { dur: Math.max(0.5, dur + 0.4) });
}

/** Kwam deze noot net van de app zelf (echo via de piano)? */
export function isEcho(m) {
  const t = sent.get(m);
  return t != null && performance.now() - t < 40;
}
