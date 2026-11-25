// Noten (uit buildPiece) -> maten met noten/rusten per hand, klaar om op een notenbalk te tekenen.
// Zonder DOM en zonder VexFlow, getest in tests/staffdata.test.mjs.
import { octaveOf, pcOf } from './notation.js';

// Duren in kwartnoten -> VexFlow-code (+ punt)
const DUR = [[4, 'w'], [3, 'hd'], [2, 'h'], [1.5, 'qd'], [1, 'q'], [0.75, '8d'], [0.5, '8'], [0.375, '16d'], [0.25, '16'], [0.125, '32']];
const EPS = 1e-6;

/** Kwartnoten opsplitsen in schrijfbare duren (groot naar klein). */
export function durationParts(q) {
  const out = [];
  let rest = q;
  while (rest > EPS) {
    const d = DUR.find(([v]) => v <= rest + EPS);
    if (!d) break;
    out.push({ q: d[0], code: d[1] });
    rest -= d[0];
  }
  return out;
}

const SHARP_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Am', 'Em', 'Bm', 'F#m', 'C#m'];
const SH = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
const FL = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];

/** MIDI -> VexFlow-toets ('c#/4'), gespeld volgens de toonsoort (kruisen of mollen). */
export function spell(m, key = 'C') {
  const names = SHARP_KEYS.includes(key) ? SH : FL;
  return `${names[pcOf(m)]}/${octaveOf(m)}`;
}

/**
 * notes: [{m, b, bd, hand, finger}] (b en bd in tellen)
 * opts: meter [teller, noemer], pickup (tellen in de opmaat)
 * -> { measures: [{start, len, rh: [ev], lh: [ev]}], hands: ['rh','lh'], perBar, qf }
 *    ev = {start (tel), q (kwartnoten), code, rest, midis, fingers, notes (originele noten, enkel op het eerste deel), tie (naar volgende deel)}
 */
export function toMeasures(notes, { meter = [4, 4], pickup = 0 } = {}) {
  const perBar = meter[0], qf = 4 / meter[1];
  const end = notes.reduce((mx, n) => Math.max(mx, n.b + n.bd), 0);
  const bounds = [0];
  let t = pickup > 0 ? pickup : perBar;
  bounds.push(t);
  while (t < end - EPS) { t += perBar; bounds.push(t); }
  const measures = [];
  for (let i = 0; i + 1 < bounds.length; i++) measures.push({ start: bounds[i], len: bounds[i + 1] - bounds[i], rh: [], lh: [] });
  const measureAt = b => {
    let i = 0;
    while (i + 1 < measures.length && measures[i + 1].start <= b + EPS) i++;
    return i;
  };

  const hands = ['rh', 'lh'].filter(h => notes.some(n => n.hand === h));
  for (const hand of hands) {
    // akkoorden: noten met dezelfde start samen
    const groups = [];
    for (const n of notes.filter(x => x.hand === hand).sort((a, b) => a.b - b.b || a.m - b.m)) {
      const g = groups[groups.length - 1];
      if (g && Math.abs(g.b - n.b) < EPS) { g.notes.push(n); g.bd = Math.min(g.bd, n.bd); } else groups.push({ b: n.b, bd: n.bd, notes: [n] });
    }
    let cur = 0;
    const push = (start, len, rest, g) => {
      // splits over maatstrepen en in schrijfbare duren; noten worden overgebonden
      let s = start, first = true;
      const out = [];
      while (len > EPS) {
        const mi = measureAt(s), m = measures[mi];
        const room = m.start + m.len - s;
        const chunk = Math.min(len, room);
        for (const p of durationParts(chunk * qf)) {
          const ev = { start: s, q: p.q, code: p.code, rest, midis: rest ? [] : g.notes.map(n => n.m), fingers: rest ? [] : g.notes.map(n => n.finger), notes: first && !rest ? g.notes : [], tie: false };
          m[hand].push(ev);
          out.push(ev);
          s += p.q / qf;
          first = false;
        }
        len -= chunk;
      }
      if (!rest) out.slice(0, -1).forEach(ev => (ev.tie = true));
    };
    for (const g of groups) {
      if (g.b > cur + EPS) push(cur, g.b - cur, true);
      const len = g.b < cur ? Math.max(0, g.b + g.bd - cur) : g.bd; // overlap: inkorten
      if (len > EPS) push(Math.max(cur, g.b), len, false, g);
      cur = Math.max(cur, g.b + g.bd);
    }
    if (cur < end - EPS) push(cur, end - cur, true);
    // lege of onvolledige maten aanvullen met rusten
    for (const m of measures) {
      const filled = m[hand].reduce((s, e) => s + e.q / qf, 0);
      if (filled < m.len - EPS) {
        const s = m[hand].length ? m[hand][m[hand].length - 1].start + m[hand][m[hand].length - 1].q / qf : m.start;
        for (const p of durationParts((m.start + m.len - s) * qf)) m[hand].push({ start: s, q: p.q, code: p.code, rest: true, midis: [], fingers: [], notes: [], tie: false });
      }
    }
  }
  return { measures, hands, perBar, qf };
}

/** In welke maat valt tel b? */
export function measureIndex(measures, b) {
  let i = 0;
  while (i + 1 < measures.length && measures[i + 1].start <= b + EPS) i++;
  return i;
}
