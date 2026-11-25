// Latency-kalibratie: tik mee met de metronoom op je piano. De mediane afwijking (MIDI/Bluetooth +
// audio + jezelf) wordt de compensatie voor de modus "op tempo".
import { bus } from '../core/events.js';
import * as store from '../core/storage.js';
import { ensureAudio, click } from '../core/audio.js';
import { setTitle } from '../ui/dom.js';
import { median } from '../core/stats.js';

const BPM = 80, COUNT_IN = 4, BEATS = 16;

export function render(root) {
  setTitle('Latency meten');
  root.innerHTML = `
  <div class="page">
    <div class="card lat-card">
      <h2>Tik mee met de metronoom</h2>
      <p>Speel op elke tik <b>één toets op je piano</b> (eender welke), zo precies mogelijk tegelijk met wat je hoort. Eerst tellen we 4 tikken af, daarna volgen er 16.</p>
      <p class="muted small">Zo meet de app hoeveel vertraging er zit tussen je piano (zeker via Bluetooth) en de app. In de modus "op tempo" wordt die vertraging daarna gecompenseerd. Doe het met de piano en het toestel waarop je oefent.</p>
      <div class="lat-plot" id="plot" aria-hidden="true"><span class="zero"></span></div>
      <p class="lat-status" id="status" aria-live="polite">Huidige instelling: ${store.get().settings.latency} ms</p>
      <div class="row center" id="ctl"><button class="main" id="go">▶ Start</button><a class="btn" href="#/instellingen">Terug</a></div>
    </div>
  </div>`;
  const q = s => root.querySelector(s);
  let clicks = [], taps = [], timers = [], off = null;

  function dot(ms) {
    const d = document.createElement('span');
    d.className = 'dot-ms';
    d.style.left = `${50 + Math.max(-45, Math.min(45, ms / 4))}%`;
    d.title = `${Math.round(ms)} ms`;
    q('#plot').appendChild(d);
  }

  function start() {
    const ac = ensureAudio();
    if (!ac) { q('#status').textContent = 'Geen audio beschikbaar in deze browser.'; return; }
    q('#plot').querySelectorAll('.dot-ms').forEach(d => d.remove());
    clicks = []; taps = [];
    const spb = 60 / BPM, t0 = ac.currentTime + 0.3;
    const outLat = (ac.outputLatency || ac.baseLatency || 0) * 1000;
    const perfNow = performance.now(), acNow = ac.currentTime;
    for (let i = 0; i < COUNT_IN + BEATS; i++) {
      const t = t0 + i * spb;
      click(i % 4 === 0, t);
      if (i >= COUNT_IN) clicks.push(perfNow + (t - acNow) * 1000 + outLat);
      timers.push(setTimeout(() => {
        q('#status').textContent = i < COUNT_IN ? `Aftellen… ${COUNT_IN - i}` : `Tik mee! ${i - COUNT_IN + 1}/${BEATS}`;
      }, (t - acNow) * 1000));
    }
    q('#go').disabled = true;
    off?.();
    off = bus.on('noteon', ({ time }) => {
      const near = clicks.reduce((best, c) => (Math.abs(time - c) < Math.abs(time - best) ? c : best), Infinity);
      const ms = time - near;
      if (Math.abs(ms) < 300) { taps.push(ms); dot(ms); }
    });
    timers.push(setTimeout(done, (t0 - acNow + (COUNT_IN + BEATS) * spb) * 1000 + 600));
  }

  function done() {
    off?.(); off = null;
    q('#go').disabled = false;
    q('#go').textContent = '↺ Opnieuw';
    if (taps.length < 8) {
      q('#status').textContent = `Te weinig tikken opgevangen (${taps.length}). Probeer opnieuw en speel op elke tik één toets.`;
      return;
    }
    const lat = Math.round(median(taps));
    const spread = Math.round(median(taps.map(x => Math.abs(x - lat))));
    q('#status').innerHTML = `Je tikt gemiddeld <b>${Math.abs(lat)} ms ${lat >= 0 ? 'na' : 'voor'}</b> de metronoom (spreiding ± ${spread} ms).`;
    const save = document.createElement('button');
    save.className = 'main';
    save.textContent = `Bewaar ${lat} ms`;
    save.onclick = () => {
      store.update(s => { s.settings.latency = Math.max(-100, Math.min(400, lat)); });
      q('#status').textContent = `Bewaard: ${store.get().settings.latency} ms. In de modus "op tempo" wordt hier nu rekening mee gehouden.`;
      save.remove();
    };
    q('#ctl').prepend(save);
  }

  q('#go').onclick = start;
  return () => { off?.(); timers.forEach(clearTimeout); };
}
