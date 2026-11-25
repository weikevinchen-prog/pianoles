// Geometrie van het klavier: welke toetsen, waar, hoe breed.
import { isBlack } from '../core/notation.js';

/** Bereik dat een lijst noten netjes omvat (hele octaven, minstens 2). */
export function fitRange(notes) {
  if (!notes.length) return [48, 83];
  const mn = Math.min(...notes.map(n => n.m)), mx = Math.max(...notes.map(n => n.m));
  let lo = Math.floor(mn / 12) * 12, hi = Math.ceil((mx + 1) / 12) * 12 - 1;
  if (hi - lo < 23) hi = lo + 23;
  return [Math.max(21, lo), Math.min(108, hi)];
}

export function geometry(lo, hi, W) {
  if (isBlack(lo)) lo--;
  if (isBlack(hi)) hi++;
  const whites = [], wIdx = {};
  for (let m = lo; m <= hi; m++) if (!isBlack(m)) { wIdx[m] = whites.length; whites.push(m); }
  const ww = W / whites.length, bw = ww * 0.6;
  const x = m => (isBlack(m) ? (wIdx[m - 1] + 1) * ww - bw / 2 : wIdx[m] * ww);
  const w = m => (isBlack(m) ? bw : ww);
  return { lo, hi, whites, wIdx, ww, bw, x, w };
}
