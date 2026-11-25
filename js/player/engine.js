// De speelmotor: klok, modi en beoordeling. Zonder DOM, dus testbaar in Node.
//   wait  = wachtmodus: de muziek wacht tot je de juiste noot speelt
//   play  = op tempo: noten binnen ±0,22 s tellen als juist, anders gemist
//   demo  = voorspelen: de app speelt alles zelf
// hands: 'both' | 'rh' | 'lh'. Noten van de andere hand speelt de app zelf (begeleiding).

export const LEAD = 2.5, WAIT_WIN = 0.35, PLAY_WIN = 0.22, EARLY_LATE = 0.08;

export const starsFor = acc => (acc >= 95 ? 3 : acc >= 80 ? 2 : acc >= 50 ? 1 : 0);

export function createEngine(list, opts = {}) {
  const e = {
    mode: opts.mode || 'wait',
    tempo: opts.tempo || 1,
    hands: opts.hands || 'both',
    latency: opts.latency || 0,           // ms
    anyKey: !!opts.anyKey,                // ritmeoefening: elke toets telt, enkel de timing
    playTone: opts.playTone || (() => {}),
    onFinish: opts.onFinish || (() => {}),
    onChange: opts.onChange || (() => {}),
  };
  e.notes = list.map(n => ({ ...n, hand: n.hand || (n.m >= 60 ? 'rh' : 'lh') })).sort((a, b) => a.t - b.t || a.m - b.m);
  e.songEnd = e.notes.length ? Math.max(...e.notes.map(n => n.t + n.d)) : 0;

  const isActive = n => e.mode !== 'demo' && (e.hands === 'both' || n.hand === e.hands);
  const lat = () => (e.latency / 1000) * e.tempo;
  const err = meas => { if (meas != null) e.measureErr[meas] = (e.measureErr[meas] || 0) + 1; };

  function regroup() {
    e.groups = [];
    e.notes.forEach((n, i) => {
      if (!isActive(n)) return;
      const g = e.groups[e.groups.length - 1];
      if (g && n.t - g.t < 0.04) g.idx.push(i); else e.groups.push({ t: n.t, idx: [i] });
    });
  }

  e.isActive = isActive;
  e.reset = () => {
    e.notes.forEach(n => { n.hit = false; n.miss = false; n.auto = false; n.off = null; });
    regroup();
    e.gi = 0; e.ai = 0; e.clock = -LEAD; e.playing = false; e.finished = false;
    e.st = { hit: 0, wrong: 0, miss: 0, streak: 0, bestStreak: 0, early: 0, late: 0 };
    e.measureErr = {};
    e.onChange(e);
  };
  e.setMode = m => { e.mode = m; e.reset(); };
  e.setHands = h => { e.hands = h; e.reset(); };
  e.toggle = () => {
    if (e.finished) e.reset();
    e.playing = !e.playing;
    e.onChange(e);
  };
  e.current = () => (e.mode === 'wait' ? e.groups[e.gi] || null : null);

  function finish() {
    e.playing = false;
    e.finished = true;
    e.onChange(e);
    e.onFinish(e.result(), e);
  }

  e.update = dt => {
    if (!e.playing) return;
    const step = dt * e.tempo;
    if (e.mode === 'wait') {
      const g = e.groups[e.gi];
      if (g && e.clock + step >= g.t) e.clock = Math.max(e.clock, g.t); else e.clock += step;
    } else e.clock += step;
    // Noten die de app zelf speelt (voorspelen of de andere hand)
    while (e.ai < e.notes.length && e.notes[e.ai].t <= e.clock) {
      const n = e.notes[e.ai++];
      if (!isActive(n)) { n.auto = true; e.playTone(n); }
    }
    if (e.mode === 'play') {
      const lim = e.clock - PLAY_WIN - lat();
      let changed = false;
      for (const n of e.notes) {
        if (n.t > lim) break;
        if (isActive(n) && !n.hit && !n.miss) { n.miss = true; e.st.miss++; e.st.streak = 0; err(n.measure); changed = true; }
      }
      if (changed) e.onChange(e);
    }
    if (e.clock > e.songEnd + 0.8 && (e.mode !== 'wait' || e.gi >= e.groups.length)) finish();
  };

  /** Een gespeelde noot verwerken. Geeft 'hit', 'wrong' of null (genegeerd). */
  e.noteOn = m => {
    if (!e.playing || e.mode === 'demo') return null;
    let ok = false, meas = null;
    if (e.mode === 'wait') {
      const g = e.groups[e.gi];
      if (g) {
        meas = e.notes[g.idx[0]].measure;
        if (g.t - e.clock < WAIT_WIN) {
          const i = g.idx.find(i => (e.anyKey || e.notes[i].m === m) && !e.notes[i].hit);
          if (i !== undefined) {
            e.notes[i].hit = true;
            ok = true;
            if (g.idx.every(i => e.notes[i].hit)) e.gi++;
          }
        }
      }
    } else {
      const c = e.clock - lat();
      let best = null, near = null;
      for (const n of e.notes) {
        if (!isActive(n)) continue;
        const dd = Math.abs(n.t - c);
        if (!near || dd < Math.abs(near.t - c)) near = n;
        if (n.hit || n.miss || (!e.anyKey && n.m !== m)) continue;
        if (dd < PLAY_WIN && (!best || dd < Math.abs(best.t - c))) best = n;
      }
      if (best) {
        best.hit = true;
        best.off = c - best.t;
        ok = true;
        if (best.off < -EARLY_LATE) e.st.early++; else if (best.off > EARLY_LATE) e.st.late++;
      } else if (near) meas = near.measure;
    }
    if (ok) { e.st.hit++; e.st.streak++; e.st.bestStreak = Math.max(e.st.bestStreak, e.st.streak); }
    else { e.st.wrong++; e.st.streak = 0; err(meas); }
    e.onChange(e);
    return ok ? 'hit' : 'wrong';
  };

  e.accuracy = () => {
    const { hit, wrong, miss } = e.st, tot = hit + wrong + miss;
    return tot ? Math.round(hit / tot * 100) : 0;
  };
  e.result = () => {
    const acc = e.accuracy();
    const hardest = Object.entries(e.measureErr).map(([m, c]) => ({ measure: +m, errors: c })).sort((a, b) => b.errors - a.errors || a.measure - b.measure);
    return { acc, stars: starsFor(acc), ...e.st, hardest };
  };

  e.reset();
  return e;
}
