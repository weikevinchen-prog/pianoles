// Metronoom: tempo, maatsoort, tap-tempo, start/stop (ook met spatie).
import { bus } from '../core/events.js';
import * as store from '../core/storage.js';
import { createMetronome, tapTempo } from '../core/metronome.js';
import { setTitle } from '../ui/dom.js';

export function render(root) {
  setTitle('Metronoom');
  const st = store.get().settings;
  root.innerHTML = `
  <div class="page metro">
    <div class="card metro-card">
      <div class="beats" id="mBeats" aria-hidden="true"></div>
      <div class="bpm-row">
        <button id="mMinus" aria-label="Trager">−</button>
        <div class="bpm"><b id="mBpm"></b><small>slagen per minuut</small></div>
        <button id="mPlus" aria-label="Sneller">+</button>
      </div>
      <input type="range" id="mRange" min="30" max="220" step="1" aria-label="Tempo">
      <div class="row center">
        <label class="field-inline">Maat
          <select id="mMeter"><option value="2">2/4</option><option value="3">3/4</option><option value="4">4/4</option><option value="6">6/8</option></select>
        </label>
        <button id="mTap">Tik het tempo</button>
        <button class="main" id="mGo">▶ Start</button>
      </div>
      <p class="muted small center" id="mName"></p>
    </div>
  </div>`;
  const q = s => root.querySelector(s);
  const names = [[40, 'Largo (zeer traag)'], [60, 'Adagio (traag)'], [76, 'Andante (wandeltempo)'], [108, 'Moderato (matig)'], [120, 'Allegro (vlug)'], [168, 'Presto (zeer snel)'], [999, 'Prestissimo']];
  const m = createMetronome({
    bpm: st.metroBpm || 80,
    beats: st.metroBeats || 4,
    onBeat: (b, n) => {
      q('#mBeats').querySelectorAll('span').forEach((el, i) => el.classList.toggle('on', i === b));
      if (b === 0) q('#mBeats').classList.add('accent');
      setTimeout(() => q('#mBeats')?.classList.remove('accent'), 120);
    },
  });
  function upd(save = true) {
    q('#mBpm').textContent = m.bpm;
    q('#mRange').value = m.bpm;
    q('#mMeter').value = m.beats;
    q('#mName').textContent = names.find(([v]) => m.bpm < v)?.[1] || '';
    q('#mBeats').innerHTML = Array.from({ length: m.beats }, () => '<span></span>').join('');
    q('#mGo').textContent = m.running ? '⏸ Stop' : '▶ Start';
    if (save) store.update(s => { s.settings.metroBpm = m.bpm; s.settings.metroBeats = m.beats; });
  }
  const setBpm = v => { m.bpm = Math.max(30, Math.min(220, Math.round(v))); upd(); };
  q('#mMinus').onclick = () => setBpm(m.bpm - (m.bpm > 120 ? 4 : 2));
  q('#mPlus').onclick = () => setBpm(m.bpm + (m.bpm >= 120 ? 4 : 2));
  q('#mRange').oninput = () => setBpm(+q('#mRange').value);
  q('#mMeter').onchange = () => { m.beats = +q('#mMeter').value; upd(); };
  const taps = [];
  q('#mTap').onclick = () => { taps.push(performance.now()); const t = tapTempo(taps); if (t) setBpm(t); };
  const toggle = () => { m.toggle(); upd(false); };
  q('#mGo').onclick = toggle;
  const off = bus.on('space', toggle);
  upd(false);
  return () => { m.stop(); off(); };
}
