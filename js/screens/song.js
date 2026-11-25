// Oefenspeler voor één liedje: versie, handen (de app speelt de andere hand), modus, tempo 40–150 %,
// A–B-lus, weergave, en een gedetailleerd resultaat met "Oefen deze maten".
import SONGS, { LEVELS, VERSIONS } from '../data/songs.js';
import { bus } from '../core/events.js';
import * as store from '../core/storage.js';
import { buildPiece } from '../core/notation.js';
import { ensureAudio } from '../core/audio.js';
import { playNote } from '../core/playback.js';
import { getCustom } from '../core/customsong.js';
import { createStage } from '../player/stage.js';
import { createEngine, LEAD } from '../player/engine.js';
import { fallingLayer } from '../player/falling.js';
import { handLayer, engineHands } from '../player/handlayer.js';
import { fitRange } from '../player/keyboard.js';
import { attachView, resolveView } from '../player/views.js';
import { C } from '../ui/colors.js';
import { esc, setTitle, starStr } from '../ui/dom.js';
import { celebrate } from '../ui/celebrate.js';

const MODES = { wait: 'Wachtmodus', play: 'Op tempo', demo: 'Voorspelen' };
const HANDS = { both: 'Beide handen', rh: 'Alleen rechts', lh: 'Alleen links' };

export function render(root, [id]) {
  const song = id === 'eigen' ? getCustom() : SONGS.find(s => s.id === id);
  if (!song) {
    root.innerHTML = `<div class="page"><div class="card"><h2>Liedje niet gevonden</h2><p>${id === 'eigen' ? 'Open eerst een MIDI-bestand in de bibliotheek.' : ''}</p><a class="btn main" href="#/liedjes">Naar de liedjes</a></div></div>`;
    return;
  }
  setTitle(song.title);
  const isFile = !!song.file;
  const meter = song.meter || [4, 4], pickup = song.pickup || 0, perBar = meter[0];
  const prefs = (!isFile && store.get().songPrefs?.[song.id]) || {};
  const st = {
    version: prefs.version && song.versions?.[prefs.version] ? prefs.version : (song.versions?.easy ? 'easy' : 'melody'),
    hands: prefs.hands || 'both',
    mode: prefs.mode || 'wait',
    view: isFile ? 'falling' : prefs.view || resolveView(song.level >= 2 ? 'both' : 'falling'),
    tempo: prefs.tempo || 100,
    loop: { on: false, a: 0, b: 0 },
  };

  root.innerHTML = `
  <section class="screen fill play song">
    <div class="bar">
      <button class="main" id="sPlay">▶ Start</button>
      <button id="sRestart" aria-label="Opnieuw">↺</button>
      <select id="sMode" aria-label="Modus">${Object.entries(MODES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
      <select id="sHands" aria-label="Handen">${Object.entries(HANDS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
      <span class="tempo-ctl"><button id="tMinus" aria-label="Trager">−</button><b id="tVal"></b><button id="tPlus" aria-label="Sneller">+</button></span>
      ${isFile ? '' : `<button id="sLoop" aria-pressed="false">🔁 Lus</button>
      <span class="loop-sel" id="loopSel" hidden>maat <select id="la" aria-label="Lus van maat"></select> – <select id="lb" aria-label="Lus tot maat"></select></span>
      <select id="sVersion" aria-label="Versie">${Object.keys(song.versions).map(k => `<option value="${k}">${VERSIONS[k]}</option>`).join('')}</select>
      <select id="sView" aria-label="Weergave"><option value="falling">Vallende noten</option><option value="both">Notenbalk + vallend</option><option value="staff">Bladmuziek</option></select>`}
      <span class="mini-stats" id="sStats" aria-live="polite"></span>
    </div>
    <div class="stage-wrap" id="wrap"></div>
  </section>`;
  const q = s => root.querySelector(s);
  const stage = createStage(q('#wrap'), { keyRatio: 0.28 });
  stage.overlay.insertAdjacentHTML('beforeend', `
    <div class="msg" id="msg"><b>${esc(song.title)}</b><span>${esc(song.composer)}${song.level ? ' · ' + LEVELS[song.level] : ''}. Druk op Start (of spatie).</span></div>
    <div class="toast" id="toast" hidden></div>
    <div class="done" id="done"><div class="result-box">
      <div class="stars big" id="rStars"></div><h2 id="rTitle"></h2>
      <div class="res-grid" id="rGrid"></div>
      <p id="rHard" class="small"></p>
      <div class="row center"><button class="main" id="rPractice">Oefen deze maten</button><button id="rAgain">↺ Nog eens</button><button id="rClose">Sluiten</button></div>
    </div></div>`);

  let engine = null, view = null, all = [], measures = 0, round = 0, alive = true, lastRes = null;
  const label = m => (pickup ? (m === 0 ? 'opmaat' : String(m)) : String(m + 1));
  const beatOf = m => (m === 0 ? 0 : pickup ? pickup + (m - 1) * perBar : m * perBar);

  function savePrefs() {
    if (isFile) return;
    store.update(s => { s.songPrefs = s.songPrefs || {}; s.songPrefs[song.id] = { version: st.version, hands: st.hands, mode: st.mode, view: st.view, tempo: st.tempo }; });
  }

  function build() {
    if (isFile) { all = song.notes; measures = 0; } else {
      const p = buildPiece(song.versions[st.version], { bpm: song.bpm, meter, pickup });
      all = p.notes;
      measures = p.measures;
    }
    const hasLh = all.some(n => n.hand === 'lh'), hasRh = all.some(n => n.hand === 'rh');
    if ((st.hands === 'lh' && !hasLh) || (st.hands === 'rh' && !hasRh)) st.hands = 'both';
    q('#sHands').querySelector('option[value=lh]').disabled = !hasLh;
    q('#sHands').querySelector('option[value=rh]').disabled = !hasRh;
    let notes = all, shiftB = 0;
    if (st.loop.on) {
      shiftB = beatOf(st.loop.a);
      const t0 = shiftB * 60 / song.bpm;
      notes = all.filter(n => n.measure >= st.loop.a && n.measure <= st.loop.b).map(n => ({ ...n, t: n.t - t0, b: n.b - shiftB }));
    }
    engine = createEngine(notes, {
      mode: st.mode, hands: st.hands, tempo: st.tempo / 100, latency: store.get().settings.latency,
      onChange: upd, onFinish: finish,
      playTone: n => {
        const d = n.d / engine.tempo;
        playNote(n.m, n.v || 0.7, d);
        stage.flash(n.m, C.green, d * 1000);
      },
    });
    const [lo, hi] = fitRange(all);
    stage.setRange(lo, hi);
    view?.destroy();
    view = attachView(stage, { view: st.view, meter, pickup: st.loop.on && st.loop.a > 0 ? 0 : pickup, key: song.key || 'C', bpm: song.bpm, grand: hasLh && hasRh });
    view.setEngine(engine);
    stage.setLayers([fallingLayer(engine), handLayer(engineHands(engine), { onKeys: true })]);
    q('#done').classList.remove('show');
    q('#msg').style.display = '';
    syncControls();
  }

  function syncControls() {
    q('#sMode').value = st.mode;
    q('#sHands').value = st.hands;
    q('#tVal').textContent = st.tempo + '%';
    if (isFile) return;
    q('#sVersion').value = st.version;
    q('#sView').value = st.view;
    q('#sLoop').setAttribute('aria-pressed', st.loop.on);
    q('#sLoop').classList.toggle('on', st.loop.on);
    q('#loopSel').hidden = !st.loop.on;
    const opts = Array.from({ length: measures }, (_, m) => `<option value="${m}">${label(m)}</option>`).join('');
    q('#la').innerHTML = opts;
    q('#lb').innerHTML = opts;
    q('#la').value = st.loop.a;
    q('#lb').value = st.loop.b;
  }

  function upd(e) {
    const { hit, wrong, miss, streak } = e.st, tot = hit + wrong + miss;
    q('#sStats').textContent = `Juist ${hit} · Fout ${wrong + miss} · Reeks ${streak} · ${tot ? Math.round(hit / tot * 100) + '%' : '–'}`;
    q('#sPlay').textContent = e.playing ? '⏸ Pauze' : e.clock > -LEAD && !e.finished ? '▶ Verder' : '▶ Start';
  }

  function toggle() {
    ensureAudio();
    q('#done').classList.remove('show');
    q('#msg').style.display = 'none';
    engine.toggle();
  }

  function toast(text) {
    const t = q('#toast');
    t.textContent = text;
    t.hidden = false;
    setTimeout(() => { if (alive) t.hidden = true; }, 1600);
  }

  function finish(res) {
    lastRes = res;
    if (engine.mode === 'demo') { engine.reset(); q('#msg').style.display = ''; return; }
    // In de lus: kort resultaat en meteen opnieuw.
    if (st.loop.on) {
      round++;
      toast(`Ronde ${round}: ${res.acc}% ${starStr(res.stars)}`);
      setTimeout(() => { if (alive && st.loop.on && engine.finished) { engine.reset(); engine.toggle(); } }, 1500);
      return;
    }
    const modeKey = engine.mode === 'play' ? 'tempo' : 'wait';
    let prev = null;
    if (!isFile) {
      const key = `${song.id}/${st.version}/${modeKey}${st.hands !== 'both' ? '/' + st.hands : ''}`;
      prev = store.get().songs[key]?.best ?? null;
      store.update(s => { s.songs[key] = { best: Math.max(prev || 0, res.acc), stars: Math.max(s.songs[key]?.stars || 0, res.stars), tempo: st.tempo, date: new Date().toISOString() }; });
    }
    q('#rStars').textContent = starStr(res.stars);
    q('#rTitle').textContent = (res.stars === 3 ? 'Perfect!' : res.stars === 2 ? 'Goed gedaan!' : res.stars === 1 ? 'Bijna!' : 'Blijven oefenen!') + (prev != null && res.acc > prev ? ' Nieuw record!' : '');
    const cells = [[res.acc + '%', 'nauwkeurig'], [res.hit, 'juist'], [res.wrong, 'verkeerd'], [res.miss, 'gemist']];
    if (engine.mode === 'play') cells.push([res.early, 'te vroeg'], [res.late, 'te laat']);
    q('#rGrid').innerHTML = cells.map(([v, t]) => `<div><b>${v}</b><small>${t}</small></div>`).join('');
    const hard = res.hardest.filter(h => h.errors > 0).slice(0, 3);
    q('#rHard').textContent = hard.length ? `Moeilijkste maten: ${hard.map(h => `${label(h.measure)} (${h.errors} ${h.errors === 1 ? 'fout' : 'fouten'})`).join(', ')}` : (measures ? 'Geen moeilijke maten: alles liep vlot!' : '');
    q('#rPractice').hidden = isFile || !hard.length;
    q('#done').classList.add('show');
    celebrate(q('#rStars'), res.stars, { record: prev != null && res.acc > prev });
  }

  /** Lus rond de moeilijkste maten, in de wachtmodus en wat trager. */
  function practiceHard() {
    const hard = (lastRes?.hardest || []).filter(h => h.errors > 0).slice(0, 2).map(h => h.measure);
    if (!hard.length) return;
    let a = Math.min(...hard), b = Math.max(...hard);
    if (b - a > 3) a = b = hard[0];
    st.loop = { on: true, a, b };
    st.mode = 'wait';
    st.tempo = Math.min(st.tempo, 80);
    round = 0;
    build();
    toast(`Lus: maat ${label(a)}${a !== b ? '–' + label(b) : ''}, wachtmodus`);
  }

  // ---------- bediening ----------
  q('#sPlay').onclick = toggle;
  q('#sRestart').onclick = () => { engine.reset(); q('#msg').style.display = ''; q('#done').classList.remove('show'); };
  q('#sMode').onchange = () => { st.mode = q('#sMode').value; savePrefs(); build(); };
  q('#sHands').onchange = () => { st.hands = q('#sHands').value; savePrefs(); build(); };
  const setTempo = v => { st.tempo = Math.max(40, Math.min(150, v)); engine.tempo = st.tempo / 100; q('#tVal').textContent = st.tempo + '%'; savePrefs(); };
  q('#tMinus').onclick = () => setTempo(st.tempo - 10);
  q('#tPlus').onclick = () => setTempo(st.tempo + 10);
  q('#rAgain').onclick = () => { engine.reset(); toggle(); };
  q('#rClose').onclick = () => { q('#done').classList.remove('show'); engine.reset(); q('#msg').style.display = ''; };
  q('#rPractice').onclick = practiceHard;
  if (!isFile) {
    q('#sVersion').onchange = () => { st.version = q('#sVersion').value; st.loop.on = false; savePrefs(); build(); };
    q('#sView').onchange = () => { st.view = q('#sView').value; savePrefs(); build(); };
    q('#sLoop').onclick = () => {
      st.loop.on = !st.loop.on;
      if (st.loop.on && st.loop.b === 0) st.loop = { on: true, a: 0, b: Math.min(measures - 1, 3) };
      round = 0;
      build();
    };
    const setLoop = () => {
      let a = +q('#la').value, b = +q('#lb').value;
      if (b < a) [a, b] = [b, a];
      st.loop = { on: true, a, b };
      round = 0;
      build();
    };
    q('#la').onchange = setLoop;
    q('#lb').onchange = setLoop;
  }

  stage.onFrame = dt => { if (!engine) return; engine.update(dt); view?.update(); };
  const offs = [
    bus.on('noteon', ({ m }) => {
      const r = engine && engine.noteOn(m);
      stage.flash(m, r === 'hit' ? C.green : r === 'wrong' ? C.red : C.blue, r ? 260 : 150);
    }),
    bus.on('space', toggle),
  ];
  build();
  window.pianoles.current = { get engine() { return engine; }, state: st };
  return () => { alive = false; offs.forEach(f => f()); view?.destroy(); stage.destroy(); delete window.pianoles.current; };
}
