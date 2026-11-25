// Kalibratie: laagste en hoogste toets, aanslag (velocity) en sustainpedaal controleren.
import { bus } from '../core/events.js';
import * as store from '../core/storage.js';
import { noteName } from '../core/notation.js';
import { createStage } from '../player/stage.js';
import { C, MARK } from '../ui/colors.js';
import { setTitle, textStyle } from '../ui/dom.js';

const LOW = 21, HIGH = 108; // A0 en C8 op een 88-toetsenpiano

export function render(root) {
  setTitle('Kalibratie');
  root.innerHTML = `
  <section class="screen fill lesson">
    <div class="lesson-top">
      <div class="prompt" id="kPrompt"></div>
      <div class="counter" id="kStep"></div>
      <div class="feedback" id="kFb" aria-live="polite"></div>
      <div class="controls" id="kCtl"></div>
    </div>
    <div class="stage-wrap" id="kWrap"></div>
  </section>`;
  const q = s => root.querySelector(s);
  const stage = createStage(q('#kWrap'), { lo: LOW, hi: HIGH, keyRatio: 0.85, keyAspect: 11, keyNames: 'c' });
  const res = { lo: null, hi: null, velMin: 1, velMax: 0, pedal: false, src: null };
  const nm = m => noteName(m, textStyle(), true);
  let step = 0;

  const STEPS = [
    { text: 'Druk de <b>laagste</b> toets van je piano in (helemaal links).', mark: LOW },
    { text: 'Druk nu de <b>hoogste</b> toets in (helemaal rechts).', mark: HIGH },
    { text: 'Speel een paar keer dezelfde toets: eerst heel <b>zacht</b>, dan heel <b>hard</b>.' },
    { text: 'Trap het <b>rechterpedaal</b> (sustain) in en laat het weer los.' },
  ];

  function show() {
    stage.clearMarks();
    q('#kCtl').innerHTML = '';
    q('#kFb').textContent = '';
    if (step >= STEPS.length) return summary();
    const s = STEPS[step];
    q('#kPrompt').innerHTML = s.text;
    q('#kStep').textContent = `${step + 1}/${STEPS.length}`;
    if (s.mark) stage.mark(s.mark, MARK.gold);
    if (step === 2) {
      q('#kFb').innerHTML = `<div class="velbar wide"><span id="kVel"></span></div>`;
      addBtn('Verder →', () => { step++; show(); }, true);
    }
    if (step === 3) addBtn('Geen pedaal / overslaan', () => { step++; show(); });
  }
  function addBtn(label, fn, main = false) {
    const b = document.createElement('button');
    b.textContent = label;
    if (main) b.className = 'main';
    b.onclick = fn;
    q('#kCtl').appendChild(b);
  }

  function summary() {
    q('#kStep').textContent = '';
    const lines = [];
    let ok = true;
    if (res.src && res.src !== 'midi') { ok = false; lines.push('De noten kwamen van het scherm of het toetsenbord, niet van een piano. Verbind eerst je piano.'); }
    if (res.lo === LOW && res.hi === HIGH) lines.push('✅ Alle 88 toetsen komen goed binnen (A0 tot C8).');
    else if (res.lo != null && res.hi != null && res.lo - LOW === res.hi - HIGH && res.lo !== LOW) {
      ok = false;
      const d = res.lo - LOW;
      lines.push(`⚠️ Alles is ${Math.abs(d)} halve ${Math.abs(d) === 1 ? 'toon' : 'tonen'} ${d > 0 ? 'hoger' : 'lager'} verschoven. Staat <b>Transpose</b> aan op je piano? Zet die terug op 0.`);
    } else {
      ok = false;
      lines.push(`⚠️ Laagste toets: ${res.lo != null ? nm(res.lo) : '–'} (verwacht A0), hoogste: ${res.hi != null ? nm(res.hi) : '–'} (verwacht C8). Probeer opnieuw en druk echt de buitenste toetsen in.`);
    }
    if (res.velMax - res.velMin >= 0.3) lines.push('✅ Aanslaggevoeligheid werkt (zacht en hard worden herkend).');
    else lines.push('ℹ️ Weinig verschil tussen zacht en hard. Geen probleem voor de lessen, maar check de "Key Touch"-instelling van je piano.');
    lines.push(res.pedal ? '✅ Sustainpedaal werkt.' : 'ℹ️ Geen pedaal gedetecteerd (niet nodig voor de eerste lessen).');
    q('#kPrompt').innerHTML = ok ? '<b>Je piano is klaar!</b>' : '<b>Bijna klaar</b>';
    q('#kFb').innerHTML = lines.join('<br>');
    q('#kFb').className = 'feedback summary';
    addBtn('Opnieuw', () => { step = 0; Object.assign(res, { lo: null, hi: null, velMin: 1, velMax: 0, pedal: false, src: null }); q('#kFb').className = 'feedback'; show(); });
    const a = document.createElement('a');
    a.className = 'btn main';
    a.href = '#/';
    a.textContent = 'Naar het menu';
    q('#kCtl').appendChild(a);
    store.update(s => { s.calibration = { date: new Date().toISOString(), lo: res.lo, hi: res.hi, velocity: res.velMax - res.velMin >= 0.3, pedal: res.pedal }; });
  }

  const offs = [
    bus.on('noteon', ({ m, vel, src }) => {
      res.src = res.src === 'midi' ? 'midi' : src;
      if (step === 0) {
        res.lo = m;
        stage.flash(m, m === LOW ? C.green : C.red, 500);
        q('#kFb').textContent = `Ontvangen: ${nm(m)}${m === LOW ? ' ✓' : ' (de laagste toets is A0)'}`;
        setTimeout(() => { if (step === 0) { step = 1; show(); } }, 900);
      } else if (step === 1) {
        res.hi = m;
        stage.flash(m, m === HIGH ? C.green : C.red, 500);
        q('#kFb').textContent = `Ontvangen: ${nm(m)}${m === HIGH ? ' ✓' : ' (de hoogste toets is C8)'}`;
        setTimeout(() => { if (step === 1) { step = 2; show(); } }, 900);
      } else if (step === 2) {
        res.velMin = Math.min(res.velMin, vel);
        res.velMax = Math.max(res.velMax, vel);
        stage.flash(m, C.blue, 200);
        const bar = q('#kVel');
        if (bar) bar.style.width = Math.round(vel * 100) + '%';
      } else stage.flash(m, C.blue, 200);
    }),
    bus.on('pedal', p => {
      if (step === 3 && p) { res.pedal = true; q('#kFb').textContent = 'Pedaal ingetrapt ✓'; }
      if (step === 3 && !p && res.pedal) setTimeout(() => { if (step === 3) { step = 4; show(); } }, 500);
    }),
  ];
  show();
  return () => { offs.forEach(f => f()); stage.destroy(); };
}
