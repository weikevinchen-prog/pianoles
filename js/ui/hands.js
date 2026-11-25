// SVG-tekening van een hand (bovenaanzicht, zoals je je handen op het klavier ziet) met vingernummers.
// Rechterhand: duim links. Linkerhand: gespiegeld, duim rechts.
import { handColor, C } from './colors.js';

// Vingers van de rechterhand: rechthoek (x, y, b, h) en de plek van het nummer.
const FINGERS = {
  2: { x: 62, y: 40, w: 30, h: 120, nx: 77, ny: 60 },
  3: { x: 96, y: 22, w: 30, h: 138, nx: 111, ny: 42 },
  4: { x: 130, y: 36, w: 29, h: 124, nx: 144.5, ny: 56 },
  5: { x: 163, y: 72, w: 26, h: 96, nx: 176, ny: 92 },
};
const THUMB = { x: 30, y: 118, w: 32, h: 84, rot: -30, cx: 62, cy: 200, nx: 19, ny: 150 };

/**
 * opts.highlight  vingers die goud oplichten
 * opts.interactive  vingers zijn knoppen (data-finger)
 * opts.label  tekst onder de hand
 */
export function handSVG(hand, opts = {}) {
  const { highlight = [], interactive = false, label = hand === 'lh' ? 'Linkerhand' : 'Rechterhand', numbers = true } = opts;
  const col = opts.color || handColor(hand);
  const mirror = hand === 'lh';
  const mx = x => (mirror ? 200 - x : x);
  const fill = f => (highlight.includes(f) ? C.gold : col);
  const attrs = f => (interactive ? ` data-finger="${f}" role="button" tabindex="0" aria-label="Vinger ${f}" class="finger"` : ` class="finger"`);

  const shapes = [
    `<rect x="56" y="120" width="136" height="100" rx="42" fill="${col}" />`,
    ...Object.entries(FINGERS).map(([f, s]) => `<rect${attrs(f)} x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.w / 2}" fill="${fill(+f)}" />`),
    `<rect${attrs(1)} x="${THUMB.x}" y="${THUMB.y}" width="${THUMB.w}" height="${THUMB.h}" rx="16" fill="${fill(1)}" transform="rotate(${THUMB.rot} ${THUMB.cx} ${THUMB.cy})" />`,
  ].join('');
  const nums = numbers ? [[1, THUMB.nx, THUMB.ny], ...Object.entries(FINGERS).map(([f, s]) => [+f, s.nx, s.ny])]
    .map(([f, x, y]) => `<g${interactive ? ` data-finger="${f}"` : ''} class="num" pointer-events="${interactive ? 'all' : 'none'}"><circle cx="${mx(x)}" cy="${y}" r="13" fill="#fffdf8" stroke="#15131a" stroke-width="2"/><text x="${mx(x)}" y="${y + 5.5}" text-anchor="middle" font-size="16" font-weight="800" fill="#15131a" font-family="Manrope,sans-serif">${f}</text></g>`).join('') : '';
  return `<figure class="hand-fig ${hand}"><svg viewBox="-12 0 224 232" role="img" aria-label="${label} met vingernummers">
    <g stroke="#15131a" stroke-opacity=".35" stroke-width="2"${mirror ? ' transform="matrix(-1 0 0 1 200 0)"' : ''}>${shapes}</g>${nums}
  </svg><figcaption>${label}</figcaption></figure>`;
}

export function bothHandsSVG(opts = {}) {
  return `<div class="hands-pair">${handSVG('lh', { ...opts, highlight: opts.lh || [] })}${handSVG('rh', { ...opts, highlight: opts.rh || [] })}</div>`;
}
