// Laag voor het podium: vallende noten boven het klavier, raaklijn, aftellen en voortgangsbalk.
import { isBlack, noteName } from '../core/notation.js';
import { get as getStore } from '../core/storage.js';
import { C, handColor } from '../ui/colors.js';

const SECONDS_VISIBLE = 3.2;

export function fallingLayer(engine) {
  function rr(cx, x, y, w, h, r) {
    cx.beginPath();
    if (cx.roundRect) cx.roundRect(x, y, w, h, r); else cx.rect(x, y, w, h);
  }
  return {
    draw(cx, s) {
      const pps = s.keyTop / SECONDS_VISIBLE, hitY = s.keyTop;
      const [lo, hi] = s.range;
      const cur = engine.current();
      const curSet = cur ? new Set(cur.idx) : null;
      const style = getStore().settings.names;
      cx.textAlign = 'center';
      engine.notes.forEach((n, i) => {
        if (n.m < lo || n.m > hi) return;
        const y1 = hitY - (n.t - engine.clock) * pps, y0 = y1 - n.d * pps;
        if (y1 < 0 || y0 > s.keyTop) return;
        const x = s.x(n.m) + 1.5, w = s.w(n.m) - 3;
        let c = handColor(n.hand), alpha = 1;
        if (curSet && curSet.has(i) && !n.hit) c = C.gold;
        if (n.hit) { c = C.green; alpha = 0.55; }
        if (n.miss) c = C.grey;
        if (n.auto) alpha = 0.35;
        cx.globalAlpha = alpha;
        cx.fillStyle = c;
        const top = Math.max(y0, -10), bot = Math.min(y1, s.keyTop);
        rr(cx, x, top, w, bot - top, Math.min(6, w / 3));
        cx.fill();
        if (isBlack(n.m)) { cx.strokeStyle = '#0007'; cx.lineWidth = 1.5; cx.stroke(); }
        cx.globalAlpha = 1;
        const L = n.finger ? String(n.finger) : noteName(n.m, style);
        if (L && w > 12 && bot - top > 16) {
          cx.fillStyle = '#15131a';
          cx.font = `800 ${Math.min(15, w * 0.5)}px Manrope,sans-serif`;
          cx.fillText(L, x + w / 2, bot - 6);
        }
      });
      cx.fillStyle = C.gold;
      cx.fillRect(0, hitY - 2, s.W, 3);
    },
    drawOver(cx, s) {
      cx.textAlign = 'center';
      const cur = engine.current();
      if (engine.playing && cur && engine.clock >= cur.t - 0.001) {
        cx.fillStyle = C.ivory;
        cx.font = '700 15px Manrope,sans-serif';
        cx.fillText('Speel de gouden noot…', s.W / 2, s.keyTop - 14);
      }
      if (engine.playing && engine.clock < 0) {
        cx.fillStyle = C.ivory;
        cx.font = '800 56px Manrope,sans-serif';
        cx.fillText(String(Math.ceil(-engine.clock)), s.W / 2, s.keyTop / 2);
      }
      const p = engine.songEnd ? Math.max(0, Math.min(1, engine.clock / engine.songEnd)) : 0;
      cx.fillStyle = C.gold;
      cx.fillRect(0, 0, s.W * p, 4);
    },
  };
}
