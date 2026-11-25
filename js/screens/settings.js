// Instellingen + back-up van de voortgang. (In fase 6 komen handkleuren, latency-kalibratie en effecten erbij.)
import * as store from '../core/storage.js';
import { dayKey } from '../core/stats.js';
import { download, setTitle } from '../ui/dom.js';

const OPTS = {
  names: [['abc', 'C D E'], ['do', 'do re mi'], ['off', 'Geen namen']],
  sound: [['auto', 'Automatisch (stil als de piano via MIDI speelt)'], ['on', 'Altijd aan'], ['off', 'Uit']],
  theme: [['auto', 'Volgens toestel'], ['light', 'Licht'], ['dark', 'Donker']],
};

export function render(root) {
  setTitle('Instellingen');
  const s = store.get().settings;
  const sel = (key, label) => `<label class="field"><span>${label}</span><select data-key="${key}">${OPTS[key].map(([v, t]) => `<option value="${v}" ${s[key] === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
  root.innerHTML = `
  <div class="page settings">
    <section class="card">
      <h3>Weergave en geluid</h3>
      ${sel('names', 'Notennamen')}
      ${sel('sound', 'App-geluid bij jouw noten')}
      ${sel('theme', 'Thema')}
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
    el.onchange = () => store.update(st => { st.settings[el.dataset.key] = el.value; });
  });
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
