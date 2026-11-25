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
      for (const hand of ['rh', 'lh']) {
        const ns = notes.filter(n => n.hand === hand && n.finger);
        if (!ns.length) continue;
        const map = pos[hand];
        if (map && ns.every(n => map[n.finger] === n.m)) continue;
        // Eén vinger een halve toon verschoven (bv. F# met vinger 4): enkel die vinger aanpassen.
        if (map && ns.length === 1 && Math.abs(map[ns[0].finger] - ns[0].m) === 1) { pos[hand] = { ...map, [ns[0].finger]: ns[0].m }; continue; }
        // Anders: hand verplaatsen naar de eerste noot; bij akkoorden de andere vingers erbij zetten.
        const next = anchor(hand, ns[0].finger, ns[0].m);
        for (const n of ns) next[n.finger] = n.m;
        pos[hand] = next;
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
