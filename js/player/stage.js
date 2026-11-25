// Het podium: canvas met (optioneel) vallende noten en een speelbaar schermklavier onderaan.
import { isBlack, noteName, pcOf } from '../core/notation.js';
import * as input from '../core/input.js';
import { get as getStore } from '../core/storage.js';
import { geometry } from './keyboard.js';
import { C } from '../ui/colors.js';

/**
 * opts: lo, hi       bereik (MIDI-nummers)
 *       keyRatio     max. deel van de hoogte voor het klavier
 *       keyAspect    max. verhouding hoogte/breedte van een witte toets
 *       keyNames     'auto' (volgens instelling) | 'none' | 'c' (alleen de C's met octaafnummer)
 *       onFrame(dt)  wordt elke frame vóór het tekenen opgeroepen
 *       fallTop      deel (0–1) bovenaan dat voor de notenbalk is (vallende noten eronder)
 */
export function createStage(parent, opts = {}) {
  const o = { lo: 48, hi: 83, keyRatio: 0.26, keyAspect: 5.2, keyNames: 'auto', onFrame: null, fallTop: 0, ...opts };
  const el = document.createElement('div');
  el.className = 'stage';
  const cv = document.createElement('canvas');
  const overlay = document.createElement('div');
  overlay.className = 'stage-overlay';
  el.append(cv, overlay);
  parent.appendChild(el);
  const cx = cv.getContext('2d');

  let W = 0, H = 0, g = null, keyTop = 0, raf = 0, dead = false, last = performance.now();
  const marks = new Map(), flashes = new Map();
  let layers = [];

  function layout() {
    const r = el.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    W = r.width; H = r.height;
    cv.width = Math.max(1, Math.round(W * dpr));
    cv.height = Math.max(1, Math.round(H * dpr));
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    g = geometry(o.lo, o.hi, W || 1);
    keyTop = H - Math.min(H * o.keyRatio, g.ww * o.keyAspect);
    // bovenste deel voor de notenbalk (weergave 'samen' of 'bladmuziek')
    el.style.setProperty('--fall-top', `${Math.round(keyTop * o.fallTop)}px`);
    el.style.setProperty('--key-top', `${Math.round(keyTop)}px`);
  }
  const ro = new ResizeObserver(layout);
  ro.observe(el);
  layout();

  // ---------- tikken op het schermklavier (multitouch) ----------
  function keyAt(x, y) {
    if (!g || y < keyTop) return null;
    const bh = (H - keyTop) * 0.62;
    if (y < keyTop + bh) for (let m = g.lo; m <= g.hi; m++) if (isBlack(m) && x >= g.x(m) && x <= g.x(m) + g.bw) return m;
    const i = Math.floor(x / g.ww);
    return g.whites[Math.max(0, Math.min(g.whites.length - 1, i))];
  }
  const touches = new Map();
  function down(e) {
    const r = cv.getBoundingClientRect();
    const m = keyAt(e.clientX - r.left, e.clientY - r.top);
    if (m == null) return;
    e.preventDefault();
    touches.set(e.pointerId, m);
    input.noteOn(m, 0.7, 'touch');
  }
  function up(e) {
    const m = touches.get(e.pointerId);
    if (m == null) return;
    touches.delete(e.pointerId);
    input.noteOff(m, 'touch');
  }
  cv.addEventListener('pointerdown', down);
  addEventListener('pointerup', up);
  addEventListener('pointercancel', up);

  // ---------- tekenen ----------
  function rr(x, y, w, h, r) {
    cx.beginPath();
    if (cx.roundRect) cx.roundRect(x, y, w, h, r); else cx.rect(x, y, w, h);
  }
  function keyFill(m, now, base, pressedCol) {
    const f = flashes.get(m);
    if (f && f.until > now) return f.color;
    if (input.pressed.has(m)) return pressedCol;
    const mk = marks.get(m);
    if (mk) return isBlack(m) ? mk.black || mk.color : mk.color;
    return base;
  }
  function labelFor(m) {
    const mk = marks.get(m);
    if (mk && mk.label != null) return mk.label;
    const mode = o.keyNames;
    if (mode === 'none' || isBlack(m)) return '';
    const style = getStore().settings.names;
    if (mode === 'c') return pcOf(m) === 0 ? noteName(m, style === 'off' ? 'abc' : style, true) : '';
    if (style === 'off') return '';
    return noteName(m, style, pcOf(m) === 0);
  }
  function drawKeys(now) {
    const kh = H - keyTop;
    cx.textAlign = 'center';
    for (const m of g.whites) {
      const x = g.x(m);
      cx.fillStyle = keyFill(m, now, C.ivory, '#cfe0ff');
      rr(x + 1, keyTop + 2, g.ww - 2, kh - 4, 5);
      cx.fill();
      const L = labelFor(m);
      if (L && g.ww > 14) {
        cx.fillStyle = marks.get(m)?.label != null ? '#1b1820' : '#8a8290';
        cx.font = `${marks.get(m)?.label != null ? 800 : 600} ${Math.min(15, g.ww * 0.42)}px Manrope,sans-serif`;
        cx.fillText(L, x + g.ww / 2, H - 10);
      }
    }
    for (let m = g.lo; m <= g.hi; m++) {
      if (!isBlack(m)) continue;
      cx.fillStyle = keyFill(m, now, C.ebony, '#4a5a8a');
      rr(g.x(m), keyTop, g.bw, kh * 0.62, 4);
      cx.fill();
      const L = marks.get(m)?.label;
      if (L && g.bw > 12) {
        cx.fillStyle = '#fff';
        cx.font = `800 ${Math.min(12, g.bw * 0.5)}px Manrope,sans-serif`;
        cx.fillText(L, g.x(m) + g.bw / 2, keyTop + kh * 0.62 - 8);
      }
    }
  }
  function frame(ts) {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000));
    last = ts;
    if (o.onFrame) o.onFrame(dt);
    if (!g || !W || !H) return;
    const now = performance.now();
    cx.clearRect(0, 0, W, H);
    if (layers.length) for (let i = 0; i < g.whites.length; i++) if (pcOf(g.whites[i]) === 0) { cx.fillStyle = '#ffffff10'; cx.fillRect(i * g.ww, 0, 1, keyTop); }
    for (const l of layers) l.draw?.(cx, api, now);
    drawKeys(now);
    for (const l of layers) l.drawOver?.(cx, api, now);
  }
  raf = requestAnimationFrame(frame);

  const api = {
    el, overlay,
    get W() { return W; }, get H() { return H; }, get keyTop() { return keyTop; }, get geom() { return g; },
    get top() { return keyTop * o.fallTop; },
    x: m => g.x(m), w: m => g.w(m),
    setRange(lo, hi) { o.lo = lo; o.hi = hi; layout(); },
    get range() { return [g.lo, g.hi]; },
    setKeyNames(v) { o.keyNames = v; },
    setOptions(p) { Object.assign(o, p); layout(); },
    set onFrame(fn) { o.onFrame = fn; },
    setLayers(ls) { layers = ls; },
    mark(m, spec) { marks.set(m, spec); },
    unmark(m) { marks.delete(m); },
    clearMarks() { marks.clear(); },
    flash(m, color, ms = 260) { flashes.set(m, { color, until: performance.now() + ms }); },
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      for (const m of touches.values()) input.noteOff(m, 'touch');
      el.remove();
    },
  };
  return api;
}
