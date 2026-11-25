// Vaste kleuren. Handkleuren komen uit de instellingen (standaard rechts turkoois, links koraal).
import { get } from '../core/storage.js';

export const C = {
  gold: '#f2b84b',   // "nu spelen"
  green: '#3ccf8e',  // juist
  red: '#ff5a5a',    // fout
  blue: '#7aa7ff',   // neutraal (vrij gespeeld)
  grey: '#5b5663',   // gemist
  ivory: '#f6f1e6',
  ebony: '#1d1b22',
  stage: '#15131a',
};

// Markeringen op toetsen: kleur voor witte en voor zwarte toetsen.
export const MARK = {
  done:  { color: '#a8e8c9', black: '#2f8f66' },
  hint:  { color: '#f7d999', black: '#9a7428' },
  gold:  { color: C.gold,    black: '#c8902a' },
  blue:  { color: '#b9cdfb', black: '#4a5f9e' },
  teal:  { color: '#9fe0d7', black: '#1f8277' },
  coral: { color: '#f4b3a7', black: '#a8473a' },
  green: { color: '#a8e8c9', black: '#2f8f66' },
};

export function handColor(hand) {
  const s = get().settings;
  return hand === 'lh' ? s.lhColor : s.rhColor;
}
