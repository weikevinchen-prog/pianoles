// Notennamen en de compacte notenstring van Pianoles. Formaat: zie README.md.
//   C4        kwartnoot (1 tel)          E4:2   halve noot   D4:.5  achtste
//   E4/3      vinger 3                   E4/3:2 vinger 3, halve noot
//   [C3/5 E3/3 G3/1]:4  akkoord          R:2    rust        |      maatstreep (controle)

export const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ABC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const DO = ['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'sol', 'sol#', 'la', 'la#', 'si'];

export const pcOf = m => ((m % 12) + 12) % 12;
export const octaveOf = m => Math.floor(m / 12) - 1;
export const isBlack = m => [1, 3, 6, 8, 10].includes(pcOf(m));

/** 'C#' -> 1, 'Bb' -> 10, anders null */
export function pcNum(s) {
  const r = /^([A-Ga-g])(#|b)?$/.exec(String(s).trim());
  if (!r) return null;
  return (PC[r[1].toUpperCase()] + (r[2] === '#' ? 1 : r[2] === 'b' ? -1 : 0) + 12) % 12;
}

/** 'C4' -> 60 */
export function noteNum(s) {
  const r = /^([A-Ga-g])(#|b)?(-?\d)$/.exec(String(s).trim());
  if (!r) throw new Error(`Onbekende noot: "${s}"`);
  return (+r[3] + 1) * 12 + PC[r[1].toUpperCase()] + (r[2] === '#' ? 1 : r[2] === 'b' ? -1 : 0);
}

/** Naam van een MIDI-noot. style: 'abc' | 'do' | 'off' */
export function noteName(m, style = 'abc', octave = false) {
  if (style === 'off') return '';
  const n = (style === 'do' ? DO : ABC)[pcOf(m)];
  return octave ? n + octaveOf(m) : n;
}

const TOKEN = /\[[^\]]*\](?::[\d.]+)?|\||[^\s|[\]]+/g;

/** Eén stem (één hand) -> noten in tellen. */
export function parseVoice(str, { beatsPerMeasure = 4 } = {}) {
  const notes = [], warnings = [];
  let b = 0, bar = 0, barNo = 0;
  for (const tok of String(str || '').match(TOKEN) || []) {
    if (tok === '|') {
      const len = b - bar;
      if (barNo > 0 && Math.abs(len - beatsPerMeasure) > 1e-6) warnings.push(`maat ${barNo + 1} heeft ${len} tellen in plaats van ${beatsPerMeasure}`);
      bar = b;
      barNo++;
      continue;
    }
    let body = tok, dur = 1;
    const ci = tok.lastIndexOf(':');
    if (ci >= 0) {
      dur = parseFloat(tok.slice(ci + 1));
      body = tok.slice(0, ci);
      if (!(dur > 0)) throw new Error(`Ongeldige duur in "${tok}"`);
    }
    if (body === 'R' || body === 'r') { b += dur; continue; }
    const items = body.startsWith('[') ? body.slice(1, -1).trim().split(/\s+/) : [body];
    for (const it of items) {
      const [n, f] = it.split('/');
      const finger = f ? +f : null;
      if (f && !(finger >= 1 && finger <= 5)) throw new Error(`Ongeldige vinger in "${tok}" (1–5)`);
      notes.push({ m: noteNum(n), b, bd: dur, finger });
    }
    b += dur;
  }
  return { notes, beats: b, warnings };
}

/** Een stuk ({rh, lh} of een losse string = rechterhand) -> noten in seconden, gesorteerd. */
export function buildPiece(piece, { bpm = 90, meter = [4, 4], gap = 0.92 } = {}) {
  const voices = typeof piece === 'string' ? { rh: piece } : (piece || {});
  const spb = 60 / bpm, perBar = meter[0]; // 1 tel = de noemer van de maatsoort
  const notes = [], warnings = [];
  let beats = 0;
  for (const hand of ['rh', 'lh']) {
    if (!voices[hand]) continue;
    const v = parseVoice(voices[hand], { beatsPerMeasure: perBar });
    beats = Math.max(beats, v.beats);
    warnings.push(...v.warnings.map(w => `${hand.toUpperCase()}: ${w}`));
    for (const n of v.notes) {
      notes.push({
        m: n.m, t: n.b * spb, d: Math.max(0.08, n.bd * spb * gap), b: n.b, bd: n.bd,
        hand, finger: n.finger, measure: Math.floor(n.b / perBar + 1e-6),
      });
    }
  }
  notes.sort((a, b) => a.t - b.t || a.m - b.m);
  return { notes, bpm, meter, beats, measures: Math.ceil(beats / perBar - 1e-6), warnings };
}

/** 'C2 C6' -> [36, 84] (uitgebreid tot witte toetsen) */
export function parseRange(spec, def = [48, 72]) {
  if (!spec) return def;
  const [a, b] = String(spec).trim().split(/\s+/).map(noteNum);
  let lo = Math.max(21, Math.min(a, b)), hi = Math.min(108, Math.max(a, b));
  if (isBlack(lo)) lo--;
  if (isBlack(hi)) hi++;
  return [lo, hi];
}

/** Doelnoten voor een oefening: 'C' = alle C's in het bereik, 'C4' = precies die toets.
 *  Volgorde: zoals opgegeven; een notennaam zonder octaaf wordt van laag naar hoog uitgebreid. */
export function parseTargets(spec, lo = 21, hi = 108) {
  const toks = Array.isArray(spec) ? spec : String(spec || '').trim().split(/\s+/).filter(Boolean);
  const notes = [], pcs = new Set(), exact = [];
  const add = m => { if (!notes.includes(m)) notes.push(m); };
  for (const t of toks) {
    const p = pcNum(t);
    if (p !== null) {
      pcs.add(p);
      for (let m = lo; m <= hi; m++) if (pcOf(m) === p) add(m);
    } else {
      const m = noteNum(t);
      exact.push(m);
      add(m);
    }
  }
  return { notes, pcs, exact };
}
