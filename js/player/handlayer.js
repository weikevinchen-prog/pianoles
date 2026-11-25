// Laag voor het podium: kleine hand met vingernummers; de vinger(s) die nu moeten spelen lichten goud op.
//   onKeys: false  hand boven het klavier (oefeningen zonder vallende noten)
//   onKeys: true   vingertoppen óp de toetsen (tijdens vallende noten, zodat de noten zichtbaar blijven)
import { C, handColor } from '../ui/colors.js';
import { isBlack } from '../core/notation.js';
import { createTracker, initialPositions } from './handpos.js';

/** getState() -> { rh?: {map, active: Set<vinger>}, lh?: {...} } */
export function handLayer(getState, { onKeys = false } = {}) {
  function points(st, s, hand) {
    const [lo, hi] = s.range, hs = st[hand], pts = [];
    if (!hs || !hs.map) return pts;
    for (let f = 1; f <= 5; f++) {
      const m = hs.map[f];
      if (m == null || m < lo || m > hi) continue;
      pts.push({ f, m, x: s.x(m) + s.w(m) / 2, active: hs.active?.has(f) });
    }
    return pts;
  }
  function tip(cx, p, y, r, col) {
    if (p.active) {
      cx.fillStyle = C.gold + '55';
      cx.beginPath(); cx.arc(p.x, y, r + 5, 0, Math.PI * 2); cx.fill();
    }
    cx.fillStyle = p.active ? C.gold : col;
    cx.beginPath(); cx.arc(p.x, y, r, 0, Math.PI * 2); cx.fill();
    cx.lineWidth = 2;
    cx.strokeStyle = '#15131a';
    cx.stroke();
    cx.fillStyle = '#15131a';
    cx.font = `800 ${Math.round(r * 1.15)}px Manrope,sans-serif`;
    cx.fillText(String(p.f), p.x, y + 1);
  }
  function above(cx, s) {
    const st = getState();
    if (!st) return;
    const h = Math.max(26, Math.min(50, s.keyTop * 0.75));
    const r = Math.max(9, Math.min(h * 0.36, s.geom.ww * 0.42));
    const tipY = s.keyTop - h + r;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    for (const hand of ['lh', 'rh']) {
      const pts = points(st, s, hand);
      if (!pts.length) continue;
      const col = handColor(hand);
      // handpalm: een afgeronde balk onder de vingertoppen
      const xs = pts.map(p => p.x), x0 = Math.min(...xs) - r * 0.6, x1 = Math.max(...xs) + r * 0.6;
      const py = tipY + r * 0.2, ph = s.keyTop - py - 3;
      cx.globalAlpha = 0.28;
      cx.fillStyle = col;
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(x0, py, x1 - x0, ph, Math.min(ph / 2, 12)); else cx.rect(x0, py, x1 - x0, ph);
      cx.fill();
      cx.globalAlpha = 1;
      for (const p of pts) tip(cx, p, tipY, r, col);
    }
    cx.textBaseline = 'alphabetic';
  }
  function keys(cx, s) {
    const st = getState();
    if (!st) return;
    const kh = s.H - s.keyTop;
    const r = Math.max(8, Math.min(s.geom.ww * 0.36, kh * 0.17));
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    for (const hand of ['lh', 'rh']) {
      const col = handColor(hand);
      for (const p of points(st, s, hand)) tip(cx, p, s.keyTop + kh * (isBlack(p.m) ? 0.42 : 0.8), r, col);
    }
    cx.textBaseline = 'alphabetic';
  }
  return onKeys ? { drawOver: keys } : { draw: above };
}

/** Toestand van de handen tijdens het spelen van een engine: de hand volgt de noten mee
 *  en de vinger(s) van de noot die nu moet, lichten op. Geeft null als er geen vingerzetting is. */
export function engineHands(engine, position) {
  const tracker = createTracker(initialPositions(position, engine.notes));
  if (!tracker.pos.rh && !tracker.pos.lh) return () => null;
  return () => {
    let cur;
    if (engine.mode === 'wait') {
      const g = engine.current();
      cur = g ? g.idx.map(i => engine.notes[i]) : [];
    } else if (engine.mode === 'demo') {
      cur = engine.notes.filter(n => n.t <= engine.clock + 0.1 && n.t + n.d > engine.clock + 0.1);
    } else {
      cur = engine.notes.filter(n => !n.hit && !n.miss && n.t >= engine.clock - 0.05 && n.t < engine.clock + 0.45);
    }
    tracker.follow(cur);
    const st = {};
    for (const h of ['rh', 'lh']) {
      if (!tracker.pos[h]) continue;
      st[h] = { map: tracker.pos[h], active: new Set(cur.filter(n => n.hand === h && n.finger).map(n => n.finger)) };
    }
    return st;
  };
}
