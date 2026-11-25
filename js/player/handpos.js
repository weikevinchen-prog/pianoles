// Handposities: welke vinger (1–5) op welke toets ligt. Zonder DOM, getest in tests/handpos.test.mjs.
// Rechterhand: duim (1) links, pink (5) rechts. Linkerhand: pink (5) links, duim (1) rechts.
import { isBlack, noteNum } from '../core/notation.js';

/** n witte toetsen naar rechts (n > 0) of links (n < 0). */
export function whiteStep(m, n) {
  let x = m;
  const dir = Math.sign(n);
  for (let i = 0; i < Math.abs(n); i++) {
    do { x += dir; } while (isBlack(x));
  }
  return x;
}

/** Positie als {1: midi, …, 5: midi}.
 *  spec 'C4' = laagste toets van een 5-vingerpositie op witte toetsen,
 *  of 5 noten van laag naar hoog ('C4 D4 E4 F#4 G4'). */
export function fivePosition(spec, hand) {
  const toks = String(spec).trim().split(/\s+/);
  const low = toks.map(noteNum);
  const keys = low.length >= 5 ? low.slice(0, 5) : [0, 1, 2, 3, 4].map(i => whiteStep(low[0], i));
  const map = {};
  keys.forEach((m, i) => { map[hand === 'lh' ? 5 - i : i + 1] = m; });
  return map;
}

/** Positie waarbij vinger f op toets m ligt en de andere vingers op de aangrenzende witte toetsen. */
export function anchor(hand, f, m) {
  const map = {};
  for (let k = 1; k <= 5; k++) map[k] = k === f ? m : whiteStep(m, hand === 'lh' ? f - k : k - f);
  return map;
}

/** Positie afleiden uit de eerste genummerde noot van een hand. */
export function derivePosition(notes, hand) {
  const n = notes.find(x => x.hand === hand && x.finger);
  return n ? anchor(hand, n.finger, n.m) : null;
}

/** Volgt de hand mee: speelt een vinger een andere toets dan verwacht, dan verschuift de hele hand. */
export function createTracker(initial = {}) {
  const pos = { rh: initial.rh || null, lh: initial.lh || null };
  return {
    pos,
    follow(notes) {
      for (const n of notes) {
        if (!n.finger || !n.hand) continue;
        const map = pos[n.hand];
        if (!map || map[n.finger] !== n.m) {
          // Bij één verschoven vinger (bv. F# met vinger 4) enkel die vinger aanpassen.
          const shift = map ? Math.abs(map[n.finger] - n.m) : 99;
          pos[n.hand] = map && shift === 1 ? { ...map, [n.finger]: n.m } : anchor(n.hand, n.finger, n.m);
        }
      }
      return pos;
    },
  };
}

/** Initiële positie: uit de stap (`position: {rh: 'C4', lh: 'C3'}`) of afgeleid uit de noten. */
export function initialPositions(position, notes = []) {
  const out = {};
  for (const h of ['rh', 'lh']) {
    if (position && position[h]) out[h] = fivePosition(position[h], h);
    else {
      const d = derivePosition(notes, h);
      if (d) out[h] = d;
    }
  }
  return out;
}
