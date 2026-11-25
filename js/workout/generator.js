// Stelt de dagelijkse opwarming samen op basis van je voortgang en zwakke punten.
// Zuiver (geen DOM): dezelfde dag geeft dezelfde opwarming (seed = datum). Getest in tests/workout.test.mjs.
import { flat, passed } from '../lesson/course.js';
import { FINGER, SCALES, ARPEGGIOS, SCALE_REQ, ARP_REQ } from '../data/exercises.js';
import { noteName, noteNum, buildPiece } from '../core/notation.js';

/** Kleine deterministische random-generator (mulberry32) op basis van een tekst. */
export function seeded(text) {
  let h = 1779033703;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 3432918353), h = (h << 13) | (h >>> 19);
  let a = h >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIVE_SCALE = { rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:4 | G4/5 F4/4 E4/3 D4/2 | C4/1:4', lh: 'C3/5 D3/4 E3/3 F3/2 | G3/1:4 | G3/1 F3/2 E3/3 D3/4 | C3/5:4' };

/** Willekeurig ritme van `bars` maten in 4/4, met de ritmes die je al kent. */
export function rhythmPattern(rnd, { eighths = false, dotted = false, bars = 4 } = {}) {
  const cells = [[1], [1], [2], [1, 1]];
  if (eighths) cells.push([0.5, 0.5], [0.5, 0.5, 1]);
  if (dotted) cells.push([1.5, 0.5]);
  const out = [];
  for (let b = 0; b < bars; b++) {
    let left = 4;
    const bar = [];
    while (left > 0) {
      const fits = cells.filter(c => c.reduce((s, x) => s + x, 0) <= left);
      const c = fits[Math.floor(rnd() * fits.length)];
      bar.push(...c);
      left -= c.reduce((s, x) => s + x, 0);
    }
    if (b === bars - 1) { bar.length = 0; bar.push(4); } // slotnoot
    out.push(bar.map(d => `C4/1:${d}`).join(' '));
  }
  return out.join(' | ');
}

/** Geschatte duur van een stap in seconden. */
export function estimateSeconds(step) {
  if (step.type === 'piece') {
    const p = buildPiece({ rh: step.rh, lh: step.lh }, { bpm: step.bpm || 80, meter: step.meter || [4, 4] });
    const sec = p.beats * 60 / (step.bpm || 80) + 3;
    return sec * (step.phases || ['demo', 'wait', 'tempo']).length * 1.3 + 10;
  }
  return (step.rounds || 6) * 6 + 10;
}

/**
 * state: de volledige opslag (lessons, weak, settings)
 * -> { items: [{kind, icon, title, steps}], minutes, ready }
 */
export function buildWorkout(state, { date = new Date().toISOString().slice(0, 10), bpm } = {}) {
  const prog = state.lessons || {};
  const has = id => passed(prog[id]);
  const rnd = seeded('opwarming-' + date);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const tempo = bpm || state.settings?.workoutBpm || 72;
  const items = [];
  if (!has('h1-l2')) return { items, minutes: 0, ready: false };

  const lhOk = has('h4-l1'), together = has('h8-l3');
  const handFor = () => (together && rnd() < 0.35 ? 'both' : lhOk && rnd() < 0.5 ? 'lh' : 'rh');
  const voices = (ex, hand) => (hand === 'both' ? { rh: ex.rh, lh: ex.lh } : { [hand]: ex[hand] });
  const HAND = { rh: 'rechts', lh: 'links', both: 'twee handen' };

  // 1. Vingeroefening
  const fingers = FINGER.filter(f => has(f.requires));
  if (fingers.length) {
    const f = pick(fingers), hand = handFor();
    const inG = has('h10-l1') && f.skill === 'vingers' && rnd() < 0.4;
    items.push({
      kind: 'finger', icon: '🖐️', title: `${f.title} (${HAND[hand]}${inG ? ', in G' : ''})`,
      steps: [{ type: 'piece', ...voices(f, hand), bpm: tempo, metronome: true, phases: ['wait', 'tempo'], view: 'falling', transpose: inG ? 7 : 0, key: inG ? 'G' : 'C', text: `Opwarming: **${f.title}**. Rustig en gelijkmatig, met ronde vingers.` }],
    });
  }

  // 2. Toonladder of arpeggio (of, voor beginners, de vijf-noten-ladder)
  const scaleKeys = Object.keys(SCALES).filter(k => has(SCALE_REQ[k].rh) || has(SCALE_REQ[k].lh));
  if (scaleKeys.length) {
    const arp = has(ARP_REQ) && rnd() < 0.3;
    const pool = arp ? Object.keys(ARPEGGIOS) : scaleKeys;
    const k = pick(pool), src = arp ? ARPEGGIOS[k] : SCALES[k];
    const req = SCALE_REQ[k] || {};
    let hand = handFor();
    if (hand === 'both' && !(req.both && has(req.both))) hand = 'rh';
    if (hand === 'lh' && !arp && req.lh && !has(req.lh)) hand = 'rh';
    const name = k === 'Am' ? 'a-mineur' : `${k} majeur`;
    items.push({
      kind: 'scale', icon: '🎼', title: `${arp ? 'Arpeggio' : 'Toonladder'} ${name} (${HAND[hand]})`,
      steps: [{ type: 'piece', ...voices(src, hand), bpm: tempo, key: src.key, metronome: true, phases: ['wait', 'tempo'], view: has('h7-l5') ? 'both' : 'falling', text: `${arp ? 'Arpeggio' : 'Toonladder'} **${name}**. Let op de vingerzetting bij het onderdoor gaan.` }],
    });
  } else if (has('h2-l3')) {
    const hand = lhOk && rnd() < 0.5 ? 'lh' : 'rh';
    const inG = has('h2-l6') && rnd() < 0.5;
    items.push({
      kind: 'scale', icon: '🎼', title: `Vijf-noten-ladder ${inG ? 'G' : 'C'} (${HAND[hand]})`,
      steps: [{ type: 'piece', [hand]: FIVE_SCALE[hand], bpm: tempo, phases: ['wait', 'tempo'], transpose: inG ? 7 : 0, text: 'De vijf noten van je handpositie, op en neer.' }],
    });
  }

  // 3. Herhaling: de zwakste (of langst niet gespeelde) gehaalde les
  const done = flat().filter(x => prog[x.lesson.id]?.status === 'done' && !x.lesson.exam);
  if (done.length) {
    // minder sterren en langer geleden = eerder aan de beurt
    const days = x => Math.max(0, (Date.parse(date) - Date.parse(prog[x.lesson.id].date || date)) / 864e5);
    const score = x => (prog[x.lesson.id].stars || 0) * 10 - Math.min(9, days(x)) + rnd();
    const x = done.slice().sort((a, b) => score(a) - score(b))[0];
    const steps = x.lesson.steps;
    const pieceStep = [...steps].reverse().find(s => s.type === 'piece');
    const other = [...steps].reverse().find(s => s.type !== 'explain');
    const step = pieceStep
      ? { ...pieceStep, phases: (pieceStep.phases || ['demo', 'wait', 'tempo']).filter(p => p !== 'demo') }
      : other ? { ...other } : null;
    if (step) items.push({ kind: 'review', icon: '🔁', title: `Herhaling: ${x.lesson.title}`, lessonId: x.lesson.id, steps: [{ ...step, text: step.text ? `Herhaling uit „${x.lesson.title}”. ${step.text}` : step.text }] });
  }

  // 4. Noten lezen (notenbalk) of, vóór hoofdstuk 7, noten vinden op het klavier
  if (has('h7-l2')) {
    let treble = has('h7-l4') ? 'C4 D4 E4 F4 G4 A4 B4 C5 D5 E5' : has('h7-l3') ? 'C4 D4 E4 F4 G4' : 'C4 D4 E4';
    let bass = has('h9-l3') ? 'G2 A2 B2 C3 D3 E3 F3 G3' : has('h9-l1') ? 'C3 D3 E3 F3 G3' : '';
    const base = (treble + ' ' + bass).trim().split(/\s+/);
    // zwakke noten komen vaker terug
    const weak = Object.entries(state.weak?.notes || {})
      .map(([m, w]) => ({ name: noteName(+m, 'abc', true), ratio: w.seen ? w.wrong / w.seen : 0 }))
      .filter(w => w.ratio > 0.2 && base.includes(w.name))
      .sort((a, b) => b.ratio - a.ratio).slice(0, 3);
    const pool = [...base, ...weak.flatMap(w => [w.name, w.name])];
    const clef = bass ? 'grand' : 'treble';
    const lo = noteName(Math.min(...base.map(noteNum)) - 2, 'abc', true), hi = noteName(Math.max(...base.map(noteNum)) + 2, 'abc', true);
    items.push({
      kind: 'reading', icon: '👀', title: `Noten lezen${weak.length ? ` (extra: ${weak.map(w => w.name).join(', ')})` : ''}`,
      steps: [{ type: 'staffquiz', clef, pool: pool.join(' '), rounds: 8, range: `${lo.replace('#', '')} ${hi.replace('#', '')}`, names: 'c' }],
    });
  } else {
    const exact = has('h1-l7');
    items.push({
      kind: 'reading', icon: '🎹', title: 'Noten vinden op het klavier',
      steps: [{ type: 'quiz', range: exact ? 'C3 B5' : 'C3 B4', pool: exact ? 'C4 E4 G4 A3 F3 D5 B3 E5' : 'C D E F G A B', rounds: 8, names: exact ? 'c' : 'none' }],
    });
  }

  // 5. Ritme (om de dag, zodra je hoofdstuk 6 begonnen bent)
  if (has('h6-l1') && rnd() < 0.5) {
    items.push({
      kind: 'rhythm', icon: '🥁', title: 'Ritme meetikken',
      steps: [{ type: 'piece', rh: rhythmPattern(rnd, { eighths: has('h6-l5'), dotted: has('h6-l6') }), bpm: Math.min(tempo, 96), anyKey: true, metronome: true, phases: ['demo', 'tempo'], view: 'both', position: { rh: 'C4' }, text: 'Luister naar het ritme en tik het dan mee op één toets.' }],
    });
  }

  const minutes = Math.max(1, Math.round(items.reduce((s, it) => s + it.steps.reduce((t, st) => t + estimateSeconds(st), 0), 0) / 60));
  return { items, minutes, ready: true };
}
