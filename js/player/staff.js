// Notenbalk met VexFlow (vaste versie via CDN, pas geladen als er een notenbalk nodig is).
//   createStaffView: loopt mee met een engine (pagina's van een paar maten, kleuren, cursor)
//   renderStatic:    een paar losse noten (leesquiz, uitleg)
import { toMeasures, spell, measureIndex } from '../core/staffdata.js';

const VF_URL = 'https://cdn.jsdelivr.net/npm/vexflow@4.2.5/build/cjs/vexflow.js';
const VF_SRI = 'sha384-hTp5EB4x3B2hpyg2cOUxiLQjsEiWr0zbn6ABKZvaJm4hMThks7+F9ruInnkC3Vse';
const CLEF = { rh: 'treble', lh: 'bass' };
const INK = { cur: '#c8860f', hit: '#1e9e63', miss: '#a39cab', auto: '#8f88a0' };

let loading = null;
export function loadVexFlow() {
  if (window.Vex?.Flow) return Promise.resolve(window.Vex.Flow);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = VF_URL;
    s.integrity = VF_SRI;
    s.crossOrigin = 'anonymous';
    s.onload = () => (window.Vex?.Flow ? resolve(window.Vex.Flow) : reject(new Error('VexFlow niet gevonden')));
    s.onerror = () => { loading = null; s.remove(); reject(new Error('De notenbalk kon niet laden. Ben je online?')); };
    document.head.appendChild(s);
  });
  return loading;
}

// Vingerzetting: rechts boven de noot, links eronder. Bij akkoorden gestapeld (bovenste noot bovenaan).
function finger(VF, sn, ev, hand) {
  if (!ev.notes.length) return;
  const fs = ev.fingers.filter(Boolean);
  const order = hand === 'rh' ? fs : [...fs].reverse();
  for (const f of order) {
    const a = new VF.Annotation(String(f));
    a.setFont('Arial', 11, 'bold');
    a.setVerticalJustification(hand === 'rh' ? VF.Annotation.VerticalJustify.TOP : VF.Annotation.VerticalJustify.BOTTOM);
    sn.addModifier(a, 0);
  }
}

/**
 * Notenbalk die meeloopt met een engine.
 * opts: meter, pickup, key, bpm, fingers (vingerzetting tonen)
 */
export function createStaffView(container, opts) {
  const o = { meter: [4, 4], pickup: 0, key: 'C', fingers: true, ...opts };
  const el = document.createElement('div');
  el.className = 'staff-view';
  el.innerHTML = '<div class="staff-svg"></div><div class="staff-cursor"></div>';
  container.appendChild(el);
  const host = el.firstChild, cursor = el.lastChild;
  let VF = null, engine = null, data = null, sig = '', pts = [], scale = 1, dead = false;

  loadVexFlow().then(v => { VF = v; sig = ''; }).catch(e => {
    if (!dead) host.innerHTML = `<p class="staff-error">${e.message}</p>`;
  });

  function evState(ev) {
    const refs = ev.group || [];
    if (!refs.length || !engine) return null;
    const cur = engine.current();
    if (cur && refs.some(n => cur.idx.includes(engine.notes.indexOf(n)) && !n.hit)) return 'cur';
    if (refs.every(n => n.hit)) return 'hit';
    if (refs.some(n => n.miss)) return 'miss';
    if (refs.every(n => n.auto)) return 'auto';
    return null;
  }

  function render(pg, perPage, W, H) {
    host.innerHTML = '';
    const r = new VF.Renderer(host, VF.Renderer.Backends.SVG);
    r.resize(W, H);
    const ctx = r.getContext();
    ctx.scale(scale, scale);
    const grand = data.hands.length === 2;
    const Y = { rh: 20, lh: grand ? 132 : 20 };
    const ms = data.measures.slice(pg * perPage, (pg + 1) * perPage);
    const lw = W / scale - 8;
    const extra = 62 + (pg === 0 ? 26 : 0);
    const base = (lw - extra) / Math.max(1, ms.length);
    let x = 4;
    const ties = [], last = {};
    pts = [];
    ms.forEach((m, i) => {
      const w = base + (i === 0 ? extra : 0);
      const staves = {};
      for (const hand of data.hands) {
        const st = new VF.Stave(x, Y[hand], w);
        if (i === 0) {
          st.addClef(CLEF[hand]).addKeySignature(o.key);
          if (pg === 0) st.addTimeSignature(`${o.meter[0]}/${o.meter[1]}`);
        }
        if (pg * perPage + i === data.measures.length - 1) st.setEndBarType(VF.Barline.type.END);
        st.setContext(ctx).draw();
        staves[hand] = st;
      }
      if (grand) {
        if (i === 0) {
          new VF.StaveConnector(staves.rh, staves.lh).setType(VF.StaveConnector.type.BRACE).setContext(ctx).draw();
          new VF.StaveConnector(staves.rh, staves.lh).setType(VF.StaveConnector.type.SINGLE_LEFT).setContext(ctx).draw();
        }
        new VF.StaveConnector(staves.rh, staves.lh).setType(VF.StaveConnector.type.SINGLE_RIGHT).setContext(ctx).draw();
      }
      const voices = [];
      for (const hand of data.hands) {
        const tick = m[hand].map(ev => {
          const keys = ev.rest ? [hand === 'lh' ? 'd/3' : 'b/4'] : ev.midis.map(mm => spell(mm, o.key));
          // een rust van een volle maat schrijf je als gecentreerde hele rust
          const full = ev.rest && m[hand].length === 1 && m.len === data.perBar;
          const sn = new VF.StaveNote({ clef: CLEF[hand], keys, duration: full ? 'wr' : ev.code + (ev.rest ? 'r' : ''), auto_stem: true, align_center: full });
          if (!full && ev.code.endsWith('d')) VF.Dot.buildAndAttach([sn], { all: true });
          if (o.fingers && !ev.rest) finger(VF, sn, ev, hand);
          const s = evState(ev);
          if (s) sn.setStyle({ fillStyle: INK[s], strokeStyle: INK[s] });
          if (!ev.rest) {
            if (last[hand]?.tie) ties.push([last[hand].sn, sn, ev.midis.length]);
            last[hand] = { sn, tie: ev.tie };
          }
          pts.push({ b: ev.start, sn });
          return sn;
        });
        const voice = new VF.Voice({ num_beats: o.meter[0], beat_value: o.meter[1] }).setMode(VF.Voice.Mode.SOFT).addTickables(tick);
        VF.Accidental.applyAccidentals([voice], o.key);
        const beams = VF.Beam.generateBeams(tick);
        voices.push({ voice, stave: staves[hand], beams });
      }
      const startX = Math.max(...voices.map(v => v.stave.getNoteStartX()));
      voices.forEach(v => v.stave.setNoteStartX(startX));
      const fmt = new VF.Formatter();
      voices.forEach(v => fmt.joinVoices([v.voice]));
      fmt.format(voices.map(v => v.voice), Math.max(20, x + w - startX - 14));
      voices.forEach(v => { v.voice.draw(ctx, v.stave); v.beams.forEach(b => b.setContext(ctx).draw()); });
      x += w;
    });
    for (const [a, b, n] of ties) {
      const idx = Array.from({ length: n }, (_, k) => k);
      new VF.StaveTie({ first_note: a, last_note: b, first_indices: idx, last_indices: idx }).setContext(ctx).draw();
    }
    // cursorpunten: begintel -> x
    const end = ms.length ? ms[ms.length - 1].start + ms[ms.length - 1].len : 0;
    pts = pts.map(p => ({ b: p.b, x: p.sn.getAbsoluteX() + 4 })).sort((a, b) => a.b - b.b);
    pts.push({ b: end, x: x - 6 });
    cursor.style.height = `${(grand ? 236 : 124) * scale}px`;
    cursor.style.top = `${10 * scale}px`;
  }

  function placeCursor(b) {
    if (!pts.length) return;
    let x = pts[0].x;
    for (let i = 0; i + 1 < pts.length; i++) {
      if (b >= pts[i].b && b <= pts[i + 1].b) {
        const f = pts[i + 1].b > pts[i].b ? (b - pts[i].b) / (pts[i + 1].b - pts[i].b) : 0;
        x = pts[i].x + f * (pts[i + 1].x - pts[i].x);
        break;
      }
      if (b > pts[i + 1].b) x = pts[i + 1].x;
    }
    cursor.style.transform = `translateX(${x * scale}px)`;
  }

  return {
    el,
    setEngine(e) {
      engine = e;
      const ns = e.notes.filter(n => n.b != null);
      data = ns.length ? toMeasures(ns, { meter: o.meter, pickup: o.pickup }) : null;
      // alle delen van een (overgebonden) noot verwijzen naar dezelfde engine-noten
      if (data) for (const m of data.measures) for (const h of data.hands) {
        let prev = null;
        for (const ev of m[h]) {
          ev.group = ev.notes.length ? ev.notes : (!ev.rest && prev?.tie ? prev.group : []);
          if (!ev.rest) prev = ev;
        }
      }
      sig = '';
    },
    update() {
      if (!VF || !engine || !data || dead) return;
      const W = el.clientWidth, H = el.clientHeight;
      if (!W || !H) return;
      const grand = data.hands.length === 2;
      scale = Math.min(1.35, H / (grand ? 290 : 150));
      const perPage = Math.max(1, Math.min(4, Math.floor((W / scale - 70) / 185)));
      const spb = 60 / (o.bpm || 80);
      const g = engine.current();
      const curB = g ? engine.notes[g.idx[0]].b : Math.max(0, engine.clock / spb);
      const pg = Math.floor(measureIndex(data.measures, curB) / perPage);
      const s = `${W}x${H}|${pg}|${perPage}|${engine.gi}|${engine.st.hit}|${engine.st.miss}|${engine.finished}|${engine.mode}`;
      if (s !== sig) {
        sig = s;
        try { render(pg, perPage, W, H); } catch (e) { console.error(e); host.innerHTML = `<p class="staff-error">Notenbalk: ${e.message}</p>`; }
      }
      placeCursor(curB);
    },
    destroy() { dead = true; el.remove(); },
  };
}

/**
 * Losse noten op een notenbalk (leesquiz, uitleg).
 * opts: clef 'treble' | 'bass' | 'grand', notes [midi], labels [tekst onder de noot], key, duration ('w' of 'q'),
 *       colors [kleur per noot of null]
 */
export async function renderStatic(host, { clef = 'treble', notes = [], labels = [], key = 'C', duration = 'w', colors = [] } = {}) {
  const VF = await loadVexFlow();
  const W = host.clientWidth || 300, H = host.clientHeight || 160;
  host.innerHTML = '';
  const grand = clef === 'grand';
  const scale = Math.min(1.6, H / (grand ? 240 : 140));
  const r = new VF.Renderer(host, VF.Renderer.Backends.SVG);
  r.resize(W, H);
  const ctx = r.getContext();
  ctx.scale(scale, scale);
  const lw = W / scale, sw = Math.min(lw - 10, Math.max(170, 90 + notes.length * 60));
  const x = (lw - sw) / 2;
  const clefs = grand ? ['treble', 'bass'] : [clef];
  const Y = grand ? [12, 122] : [14];
  const staves = clefs.map((c, i) => new VF.Stave(x, Y[i], sw).addClef(c).addKeySignature(key).setContext(ctx));
  staves.forEach(s => s.draw());
  if (grand) {
    new VF.StaveConnector(staves[0], staves[1]).setType(VF.StaveConnector.type.BRACE).setContext(ctx).draw();
    new VF.StaveConnector(staves[0], staves[1]).setType(VF.StaveConnector.type.SINGLE_LEFT).setContext(ctx).draw();
  }
  const voices = clefs.map((c, ci) => {
    const tick = notes.map((m, i) => {
      const mine = !grand || (ci === 0 ? m >= 60 : m < 60);
      if (!mine) return new VF.GhostNote({ duration });
      const sn = new VF.StaveNote({ clef: c, keys: [spell(m, key)], duration, auto_stem: true });
      if (labels[i]) {
        const a = new VF.Annotation(labels[i]);
        a.setFont('Arial', 13, 'bold');
        a.setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM);
        sn.addModifier(a, 0);
      }
      if (colors[i]) sn.setStyle({ fillStyle: colors[i], strokeStyle: colors[i] });
      return sn;
    });
    const v = new VF.Voice({ num_beats: 4, beat_value: 4 }).setMode(VF.Voice.Mode.SOFT).addTickables(tick);
    VF.Accidental.applyAccidentals([v], key);
    return v;
  });
  const startX = Math.max(...staves.map(s => s.getNoteStartX()));
  staves.forEach(s => s.setNoteStartX(startX));
  const fmt = new VF.Formatter();
  voices.forEach(v => fmt.joinVoices([v]));
  fmt.format(voices, Math.max(30, x + sw - startX - 20));
  voices.forEach((v, i) => v.draw(ctx, staves[i]));
}
