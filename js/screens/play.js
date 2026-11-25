// Vrij spelen: de oorspronkelijke vallende-noten-speler (liedjes, wachtmodus, op tempo, voorspelen, eigen MIDI).
import SONGS from '../data/songs.js';
import { bus } from '../core/events.js';
import * as store from '../core/storage.js';
import { buildPiece } from '../core/notation.js';
import { loadMidiFile } from '../core/midifile.js';
import { ensureAudio, tone } from '../core/audio.js';
import { createStage } from '../player/stage.js';
import { createEngine } from '../player/engine.js';
import { fallingLayer } from '../player/falling.js';
import { handLayer, engineHands } from '../player/handlayer.js';
import { fitRange } from '../player/keyboard.js';
import { attachView, resolveView } from '../player/views.js';
import { C } from '../ui/colors.js';
import { esc, setTitle, starStr } from '../ui/dom.js';

export function render(root) {
  setTitle('Vrij spelen');
  root.innerHTML = `
  <section class="screen fill play">
    <div class="bar">
      <select id="song" aria-label="Liedje">${SONGS.map(s => `<option value="${esc(s.id)}">${esc(s.title)}</option>`).join('')}</select>
      <select id="mode" aria-label="Modus">
        <option value="wait">Wachtmodus</option>
        <option value="play">Op tempo</option>
        <option value="demo">Voorspelen</option>
      </select>
      <select id="view" aria-label="Weergave">
        <option value="falling">Vallende noten</option>
        <option value="both">Notenbalk + vallend</option>
        <option value="staff">Bladmuziek</option>
      </select>
      <button class="main" id="btnPlay">▶ Start</button>
      <button id="btnRestart" aria-label="Opnieuw">↺</button>
      <label class="rng">Tempo <input type="range" id="tempo" min="40" max="150" step="5" value="100"><span id="tempoTxt">100%</span></label>
      <label class="file btn">📂 MIDI<input type="file" id="file" accept=".mid,.midi,audio/midi"></label>
      <span class="mini-stats" id="stats" aria-live="polite"></span>
    </div>
    <div class="stage-wrap" id="wrap"></div>
  </section>`;
  const q = s => root.querySelector(s);
  const stage = createStage(q('#wrap'), { keyRatio: 0.26 });
  stage.overlay.innerHTML = `
    <div class="msg" id="msg"><b>Klaar om te spelen?</b><span>Kies een liedje en druk op Start (of spatie). In de wachtmodus wacht het liedje tot je de juiste toets speelt.</span></div>
    <div class="done" id="done"><div><div class="stars big" id="stars"></div><h2 id="doneTitle"></h2><p id="doneTxt"></p><button class="main" id="btnAgain">Nog eens</button></div></div>`;

  let engine = null, songId = SONGS[0].id, view = null, meta = null;
  q('#view').value = resolveView('falling');

  function upd(e) {
    const { hit, wrong, miss, streak } = e.st, tot = hit + wrong + miss;
    q('#stats').textContent = `Juist ${hit} · Fout ${wrong + miss} · Reeks ${streak} · ${tot ? Math.round(hit / tot * 100) + '%' : '–'}`;
    q('#btnPlay').textContent = e.playing ? '⏸ Pauze' : e.clock > -2.5 && !e.finished ? '▶ Verder' : '▶ Start';
  }
  // meta = {bpm, meter, pickup, key} voor liedjes uit de bibliotheek; null voor MIDI-bestanden (geen notenbalk)
  function load(notes, m = null) {
    meta = m;
    const s = store.get().settings;
    engine = createEngine(notes, {
      mode: q('#mode').value,
      tempo: q('#tempo').value / 100,
      latency: s.latency,
      onChange: upd,
      onFinish: finish,
      playTone: n => {
        const d = n.d / engine.tempo;
        tone(n.m, 0.7, { dur: Math.max(0.5, d + 0.4) });
        stage.flash(n.m, C.green, d * 1000);
      },
    });
    const [lo, hi] = fitRange(notes);
    stage.setRange(lo, hi);
    stage.setLayers([fallingLayer(engine), handLayer(engineHands(engine), { onKeys: true })]);
    setView();
    q('#msg').style.display = '';
    q('#done').classList.remove('show');
  }
  function loadSong(id) {
    const song = SONGS.find(s => s.id === id) || SONGS[0];
    songId = song.id;
    const meter = song.meter || [4, 4], pickup = song.pickup || 0;
    load(buildPiece(song.versions.melody, { bpm: song.bpm, meter, pickup }).notes, { bpm: song.bpm, meter, pickup, key: song.key || 'C' });
  }
  function setView() {
    view?.destroy();
    q('#view').disabled = !meta;
    const grand = engine.notes.some(n => n.hand === 'lh') && engine.notes.some(n => n.hand === 'rh');
    view = attachView(stage, meta ? { view: q('#view').value, ...meta, grand } : { view: 'falling' });
    view.setEngine(engine);
  }
  function toggle() {
    ensureAudio();
    q('#done').classList.remove('show');
    q('#msg').style.display = 'none';
    engine.toggle();
  }
  function finish(res) {
    if (engine.mode === 'demo') { engine.reset(); q('#msg').style.display = ''; return; }
    const modeKey = engine.mode === 'play' ? 'tempo' : 'wait';
    const key = `${songId}/melody/${modeKey}`;
    const prev = store.get().songs[key]?.best || 0;
    if (!songId.startsWith('file:')) {
      store.update(s => { s.songs[key] = { best: Math.max(prev, res.acc), stars: Math.max(s.songs[key]?.stars || 0, res.stars), date: new Date().toISOString() }; });
    }
    q('#stars').textContent = starStr(res.stars);
    q('#doneTitle').textContent = res.stars === 3 ? 'Perfect!' : res.stars === 2 ? 'Goed gedaan!' : res.stars === 1 ? 'Bijna!' : 'Blijven oefenen!';
    const timing = engine.mode === 'play' && (res.early || res.late) ? ` · ${res.early} te vroeg, ${res.late} te laat` : '';
    q('#doneTxt').textContent = `${res.acc}% nauwkeurig · ${res.hit} juist · ${res.wrong + res.miss} fout${timing}${prev ? ` · vorig record ${prev}%` : ''}`;
    q('#done').classList.add('show');
  }

  q('#song').onchange = () => { if (q('#song').value !== 'file') loadSong(q('#song').value); };
  q('#mode').onchange = () => { engine.setMode(q('#mode').value); q('#msg').style.display = ''; q('#done').classList.remove('show'); };
  q('#tempo').oninput = () => { engine.tempo = q('#tempo').value / 100; q('#tempoTxt').textContent = q('#tempo').value + '%'; };
  q('#btnPlay').onclick = toggle;
  q('#btnRestart').onclick = () => { engine.reset(); q('#msg').style.display = ''; q('#done').classList.remove('show'); };
  q('#btnAgain').onclick = () => { engine.reset(); toggle(); };
  q('#file').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const notes = loadMidiFile(await f.arrayBuffer());
      let o = q('#song option[value=file]');
      if (!o) { o = document.createElement('option'); o.value = 'file'; q('#song').appendChild(o); }
      o.textContent = '📄 ' + f.name.replace(/\.midi?$/i, '');
      q('#song').value = 'file';
      load(notes);
      songId = 'file:' + f.name;
    } catch (err) {
      q('#msg').style.display = '';
      q('#msg b').textContent = 'Bestand niet gelezen';
      q('#msg span').textContent = err.message;
    }
    e.target.value = '';
  };

  q('#view').onchange = setView;
  stage.onFrame = dt => { if (!engine) return; engine.update(dt); view?.update(); };
  const offs = [
    bus.on('noteon', ({ m }) => {
      const r = engine && engine.noteOn(m);
      stage.flash(m, r === 'hit' ? C.green : r === 'wrong' ? C.red : C.blue, r ? 260 : 150);
    }),
    bus.on('space', toggle),
  ];
  loadSong(songId);
  return () => { offs.forEach(f => f()); view?.destroy(); stage.destroy(); };
}
