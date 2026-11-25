// Gedeelde hulpjes voor staptypes.
import { parseRange, parseTargets, noteName } from '../../core/notation.js';
import { MARK } from '../../ui/colors.js';
import { textStyle } from '../../ui/dom.js';
import { initialPositions } from '../../player/handpos.js';
import { handLayer } from '../../player/handlayer.js';

/** Zet bereik en toetsnamen van het podium volgens de stap. */
export function setupStage(step, ctx, { def = [48, 71], names = 'none' } = {}) {
  const [lo, hi] = parseRange(step.range, def);
  ctx.stage.setRange(lo, hi);
  ctx.stage.setKeyNames(step.names || names);
  return [lo, hi];
}

/** show: [{targets: 'C D', color: 'gold', label: 'name' | 'name+oct' | 'tekst'}] */
export function applyMarks(show, ctx, lo, hi) {
  for (const s of show || []) {
    const spec = MARK[s.color] || MARK.gold;
    for (const m of parseTargets(s.targets, lo, hi).notes) {
      if (m < lo || m > hi) continue;
      let label;
      if (s.label === 'name') label = noteName(m, textStyle());
      else if (s.label === 'name+oct') label = noteName(m, textStyle(), true);
      else if (s.label) label = s.label;
      ctx.stage.mark(m, { ...spec, label });
    }
  }
}

export const pick = (arr, avoid) => {
  if (arr.length < 2) return arr[0];
  let x;
  do { x = arr[Math.floor(Math.random() * arr.length)]; } while (x === avoid);
  return x;
};

export const tokens = s => String(s || '').trim().split(/\s+/).filter(Boolean);

// ---------- fase 2: panelen, handen ----------

/** Paneel over het podium (illustraties, handtekeningen). Wordt na de stap automatisch weggehaald. */
export function showPanel(ctx, html, cls = '') {
  const d = document.createElement('div');
  d.className = 'panel ' + cls;
  d.innerHTML = html;
  ctx.stage.overlay.appendChild(d);
  return d;
}

/** Kleine hand(en) boven het klavier. position: {rh: 'C4', lh: 'C3'}; getActive() -> {rh: [vingers], lh: [...]} */
export function showHands(ctx, position, getActive = () => ({})) {
  const pos = initialPositions(position);
  ctx.stage.setLayers([handLayer(() => {
    const a = getActive() || {};
    const st = {};
    for (const h of ['rh', 'lh']) if (pos[h]) st[h] = { map: pos[h], active: new Set(a[h] || []) };
    return st;
  })]);
  return pos;
}

export const HAND_NAME = { rh: 'rechterhand', lh: 'linkerhand' };
