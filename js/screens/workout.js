// Dagelijkse opwarming: overzicht (#/opwarming) en uitvoeren (#/opwarming/start).
import * as store from '../core/storage.js';
import { dayKey, streakDays, weekSeconds } from '../core/stats.js';
import { buildWorkout } from '../workout/generator.js';
import { createRunner } from '../lesson/runner.js';
import { starsFor } from '../player/engine.js';
import { esc, setTitle, starStr } from '../ui/dom.js';
import { lessonView } from './lessonview.js';

const today = () => dayKey();

function weekBars(practice) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString('nl-BE', { weekday: 'narrow' }), min: Math.round((practice[dayKey(d)] || 0) / 60), today: i === 6 };
  });
  const max = Math.max(10, ...days.map(d => d.min));
  return `<div class="bars small-bars" role="img" aria-label="Oefenminuten van de laatste 7 dagen">${days.map(d =>
    `<div class="barcol${d.today ? ' today' : ''}"><span class="v">${d.min || ''}</span><span class="b" style="height:${Math.round(d.min / max * 100)}%"></span><small>${d.label}</small></div>`).join('')}</div>`;
}

export function render(root, [sub]) {
  return sub === 'start' ? run(root) : overview(root);
}

function overview(root) {
  setTitle('Dagelijkse opwarming');
  const s = store.get();
  const w = buildWorkout(s, { date: today() });
  const rec = s.workouts?.[today()];
  const streak = streakDays(s.practice), week = Math.round(weekSeconds(s.practice) / 60);
  const bpm = s.settings.workoutBpm || 72;
  root.innerHTML = `
  <div class="page workout">
    <div class="wo-head">
      <div class="card stat"><small>Reeks</small><b>${streak} 🔥</b><span class="muted small">${streak === 1 ? 'dag' : 'dagen'} op rij</span></div>
      <div class="card stat"><small>Deze week</small><b>${week}</b><span class="muted small">minuten</span></div>
      <div class="card stat wide">${weekBars(s.practice)}</div>
    </div>
    ${!w.ready ? `<div class="card"><h3>Nog even geduld</h3><p>De opwarming wordt samengesteld uit wat je al kent. Doe eerst de eerste lessen van de cursus (of de instaptest).</p><div class="row"><a class="btn main" href="#/cursus">Naar de cursus</a><a class="btn" href="#/instaptest">Instaptest</a></div></div>` : `
    <section class="card">
      <div class="wo-title">
        <h3>Vandaag ${rec?.done ? '<span class="tag ok">✓ gedaan</span>' : ''}</h3>
        <span class="muted small">± ${w.minutes} min</span>
      </div>
      <ol class="wo-list">
        ${w.items.map((it, i) => {
          const r = rec?.items?.[i];
          return `<li><span class="ic" aria-hidden="true">${it.icon}</span><span class="t">${esc(it.title)}</span>${r ? `<span class="muted small">${r.acc}%</span>` : ''}</li>`;
        }).join('')}
      </ol>
      <div class="field">
        <span>Tempo van de vinger- en toonladderoefeningen</span>
        <span class="row"><button id="wMinus" aria-label="Trager">−</button><b id="wBpm" class="bpm-small">${bpm}</b><button id="wPlus" aria-label="Sneller">+</button></span>
      </div>
      <div class="row">
        <a class="btn main" href="#/opwarming/start">▶ ${rec?.done ? 'Nog eens' : 'Start opwarming'}</a>
        <a class="btn" href="#/metronoom">🥁 Metronoom</a>
      </div>
    </section>`}
    <p class="small muted">Elke dag een nieuwe mix, op maat van je niveau: vingeroefeningen, toonladders, een herhaling van je zwakste les en noten lezen. Noten die je vaak mis hebt, komen vaker terug.</p>
  </div>`;
  const setBpm = v => { store.update(st => { st.settings.workoutBpm = Math.max(40, Math.min(160, v)); }); overview(root); };
  root.querySelector('#wMinus')?.addEventListener('click', () => setBpm(bpm - 4));
  root.querySelector('#wPlus')?.addEventListener('click', () => setBpm(bpm + 4));
}

function run(root) {
  const s = store.get();
  const w = buildWorkout(s, { date: today() });
  if (!w.ready) { location.hash = '#/opwarming'; return; }
  const steps = [], owner = [];
  w.items.forEach((it, i) => it.steps.forEach(st => { steps.push(st); owner.push(i); }));
  const view = lessonView(root);
  const runner = createRunner(steps, view, {
    onStep: (i, n) => { view.setDots(i, n); setTitle(`${w.items[owner[i]].icon} ${w.items[owner[i]].title}`); },
  });
  runner.start().then(res => { if (res) finish(res); }).catch(e => { console.error(e); view.prompt.textContent = 'Er liep iets mis: ' + e.message; });

  function finish(res) {
    view.stage.destroy();
    const items = w.items.map((it, i) => {
      const rs = res.results.filter((_, k) => owner[k] === i && res.results[k].scored);
      const c = rs.reduce((a, r) => a + r.correct, 0), x = rs.reduce((a, r) => a + r.wrong, 0);
      return { kind: it.kind, title: it.title, acc: c + x ? Math.round(c / (c + x) * 100) : 100 };
    });
    const now = new Date().toISOString();
    store.update(st => {
      st.workouts = st.workouts || {};
      st.workouts[today()] = { done: true, acc: res.acc, stars: res.stars, items, date: now };
      // de herhaalde les schuift achteraan in de rij voor herhaling
      const rev = w.items.find(it => it.kind === 'review');
      if (rev && st.lessons[rev.lessonId]) st.lessons[rev.lessonId].date = now;
    });
    const streak = streakDays(store.get().practice);
    setTitle('Opwarming klaar');
    root.innerHTML = `
    <div class="page result">
      <div class="card result-card">
        <div class="stars big ${res.stars ? 'pop' : ''}">${starStr(starsFor(res.acc))}</div>
        <h2>Opwarming klaar!</h2>
        <p>${res.acc}% juist${streak ? ` · 🔥 ${streak} ${streak === 1 ? 'dag' : 'dagen'} op rij` : ''}</p>
        <ul class="wo-result">${items.map(it => `<li><span>${esc(it.title)}</span><b>${it.acc}%</b></li>`).join('')}</ul>
        <p class="muted small">Morgen staat er een nieuwe opwarming klaar.</p>
        <div class="row center"><a class="btn main" href="#/cursus">Verder met de cursus</a><a class="btn" href="#/">Menu</a></div>
      </div>
    </div>`;
  }
  return () => { runner.abort(); view.stage.destroy(); };
}
