// Instellingen: weergave en geluid, handkleuren, begeleiding, latency, effecten, back-up.
import * as store from '../core/storage.js';
import { dayKey } from '../core/stats.js';
import { midi } from '../core/midi.js';
import { download, setTitle } from '../ui/dom.js';

const OPTS = {
  names: [['abc', 'C D E'], ['do', 'do re mi'], ['off', 'Geen namen']],
  sound: [['auto', 'Automatisch (stil als de piano via MIDI speelt)'], ['on', 'Altijd aan'], ['off', 'Uit']],
  theme: [['auto', 'Volgens toestel'], ['light', 'Licht'], ['dark', 'Donker']],
  view: [['auto', 'Zoals de les het vraagt'], ['falling', 'Altijd vallende noten'], ['both', 'Altijd notenbalk + vallende noten'], ['staff', 'Altijd alleen bladmuziek']],
  accompaniment: [['app', 'Uit het toestel (app-geluid)'], ['piano', 'Via de piano (MIDI)']],
  effects: [['true', 'Aan'], ['false', 'Uit']],
  effectSound: [['true', 'Aan'], ['false', 'Uit']],
};
const PRESETS = [
  ['Turkoois / koraal', '#2bb3a3', '#e0644f'],
  ['Blauw / oranje', '#3b82f6', '#f59e0b'],
  ['Groen / paars', '#22a06b', '#9b59d0'],
];

export function render(root) {
  setTitle('Instellingen');
  const s = store.get().settings;
  const sel = (key, label, hint = '') => `<label class="field"><span>${label}${hint ? `<small class="muted">${hint}</small>` : ''}</span><select data-key="${key}">${OPTS[key].map(([v, t]) => `<option value="${v}" ${String(s[key]) === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
  root.innerHTML = `
  <div class="page settings">
    <section class="card">
      <h3>Weergave en geluid</h3>
      ${sel('names', 'Notennamen')}
      ${sel('sound', 'App-geluid bij jouw noten')}
      ${sel('accompaniment', 'Voorspelen en begeleiding', midi.outputs.length ? 'Via de piano klinkt het mooier en zonder vertraging.' : 'Via de piano kan pas als de piano verbonden is.')}
      ${sel('view', 'Weergave bij stukjes')}
      ${sel('theme', 'Thema')}
    </section>
    <section class="card">
      <h3>Handkleuren</h3>
      <div class="field"><span>Rechterhand</span><input type="color" id="rh" value="${s.rhColor}" aria-label="Kleur rechterhand"></div>
      <div class="field"><span>Linkerhand</span><input type="color" id="lh" value="${s.lhColor}" aria-label="Kleur linkerhand"></div>
      <div class="row">${PRESETS.map(([n, r, l], i) => `<button class="preset" data-i="${i}"><i style="background:${r}"></i><i style="background:${l}"></i>${n}</button>`).join('')}</div>
    </section>
    <section class="card">
      <h3>Timing</h3>
      <div class="field"><span>Latency-compensatie <small class="muted">Vertraging tussen piano en app, voor de modus "op tempo".</small></span>
        <span class="row"><input type="range" id="lat" min="-100" max="400" step="5" value="${s.latency}" aria-label="Latency in milliseconden"><b id="latV" class="bpm-small">${s.latency} ms</b></span></div>
      <div class="row"><a class="btn main" href="#/latency">🎯 Meten (meetikken)</a></div>
    </section>
    <section class="card">
      <h3>Beloningen</h3>
      ${sel('effects', 'Animaties bij sterren en reeksen', 'Staan ook uit als je toestel "minder beweging" vraagt.')}
      ${sel('effectSound', 'Geluidjes bij sterren en reeksen')}
    </section>
    <section class="card">
      <h3>Back-up van je voortgang</h3>
      <p class="small muted">Je voortgang staat alleen op dit toestel (in de browser). Maak af en toe een back-up, of zet hem over naar een ander toestel.</p>
      <div class="row">
        <button id="exp">⬇ Exporteren</button>
        <label class="btn file">⬆ Importeren<input type="file" id="imp" accept=".json,application/json"></label>
        <button id="reset" class="danger">Alles wissen</button>
      </div>
      <p class="small" id="msg" aria-live="polite"></p>
    </section>
  </div>`;
  const q = x => root.querySelector(x);
  root.querySelectorAll('select[data-key]').forEach(el => {
    el.onchange = () => store.update(st => {
      const v = el.value;
      st.settings[el.dataset.key] = v === 'true' ? true : v === 'false' ? false : v;
    });
  });
  const setColors = (r, l) => store.update(st => { if (r) st.settings.rhColor = r; if (l) st.settings.lhColor = l; });
  q('#rh').oninput = () => setColors(q('#rh').value, null);
  q('#lh').oninput = () => setColors(null, q('#lh').value);
  root.querySelectorAll('.preset').forEach(b => {
    b.onclick = () => { const [, r, l] = PRESETS[+b.dataset.i]; setColors(r, l); q('#rh').value = r; q('#lh').value = l; };
  });
  q('#lat').oninput = () => { q('#latV').textContent = q('#lat').value + ' ms'; };
  q('#lat').onchange = () => store.update(st => { st.settings.latency = +q('#lat').value; });
  q('#exp').onclick = () => {
    download(`pianoles-voortgang-${dayKey()}.json`, store.exportJSON());
    q('#msg').textContent = 'Back-up gedownload.';
  };
  q('#imp').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      store.importJSON(await f.text());
      q('#msg').textContent = '✅ Voortgang ingeladen.';
      setTimeout(() => render(root), 600);
    } catch (err) {
      q('#msg').textContent = '⚠️ ' + err.message;
    }
    e.target.value = '';
  };
  q('#reset').onclick = () => {
    if (!confirm('Alle voortgang en instellingen wissen? Dit kan niet ongedaan gemaakt worden. (Tip: exporteer eerst een back-up.)')) return;
    store.resetAll();
    render(root);
  };
}
