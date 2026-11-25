// Instaptest: bepaalt waar je in de cursus begint. Gehaalde hoofdstukken worden "overgeslagen" vrijgegeven.
import * as store from '../core/storage.js';
import { chapters, skipChapter, firstOpen } from '../lesson/course.js';
import { createRunner } from '../lesson/runner.js';
import PROBES, { THRESHOLD } from '../data/placement.js';
import { esc, setTitle } from '../ui/dom.js';
import { lessonView } from './lessonview.js';

export function render(root) {
  setTitle('Instaptest');
  let runner = null, view = null, stopped = false;

  root.innerHTML = `
  <div class="page">
    <div class="card">
      <h2>Instaptest</h2>
      <p>Een paar korte opdrachten (± 3 minuten). Gaat een deel vlot, dan slaan we die lessen over. Ze blijven wel open, zodat je ze later nog kunt doen.</p>
      <p class="muted small">Geen stress: fouten zijn hier net nuttig, dan weet de app waar je moet beginnen.</p>
      <div class="row"><button class="main" id="go">Start de test</button><a class="btn" href="#/cursus">Liever niet</a></div>
    </div>
  </div>`;
  root.querySelector('#go').onclick = run;

  async function run() {
    const certified = [];
    for (const probe of PROBES) {
      if (stopped) return;
      view?.stage.destroy();
      view = lessonView(root);
      const stopBtn = document.createElement('button');
      stopBtn.textContent = 'Stop de test';
      stopBtn.className = 'small ghost';
      view.dots.after(stopBtn);
      let quit = false;
      stopBtn.onclick = () => { quit = true; runner.abort(); done(certified); };
      runner = createRunner(probe.steps, view, {
        onStep: (i, n) => view.setDots(i, n),
        // vroeg stoppen als een stap duidelijk niet gaat
        after: r => !(r.scored && r.correct + r.wrong > 0 && r.correct / (r.correct + r.wrong) * 100 < THRESHOLD - 25),
      });
      const res = await runner.start();
      if (quit || stopped || !res) return;
      if (res.acc >= THRESHOLD && res.results.length === probe.steps.length) certified.push(probe.chapter);
      else break;
    }
    done(certified);
  }

  function done(certified) {
    view?.stage.destroy();
    view = null;
    store.update(s => {
      for (const c of certified) skipChapter(s.lessons, c);
      s.placement = { date: new Date().toISOString(), certified };
    });
    const next = firstOpen(store.get().lessons);
    const names = certified.map(id => chapters.find(c => c.id === id)?.title).filter(Boolean);
    root.innerHTML = `
    <div class="page result">
      <div class="card result-card">
        <h2>${certified.length ? 'Mooi, dat zat er nog in!' : 'We beginnen bij de basis'}</h2>
        ${names.length ? `<p>Vrijgegeven: <b>${names.map(esc).join(', ')}</b>.</p>` : '<p>Geen probleem: de eerste lessen gaan snel als iets al vlot gaat.</p>'}
        ${next ? `<p>Je begint bij: <b>${esc(next.title)}</b></p>` : '<p>Alle lessen die er nu zijn, zijn vrijgegeven. Er komen er snel meer bij.</p>'}
        <div class="row center">
          ${next ? `<a class="btn main" href="#/les/${esc(next.id)}">Start ▶</a>` : ''}
          <a class="btn" href="#/cursus">Naar de cursus</a>
        </div>
      </div>
    </div>`;
  }

  return () => { stopped = true; runner?.abort(); view?.stage.destroy(); };
}
