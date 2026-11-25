// Eén les spelen, daarna sterren tonen en bewaren.
import * as store from '../core/storage.js';
import { findLesson, isUnlocked, nextLesson, recordLesson } from '../lesson/course.js';
import { createRunner } from '../lesson/runner.js';
import { esc, setTitle, starStr } from '../ui/dom.js';
import { lessonView } from './lessonview.js';
import { celebrate } from '../ui/celebrate.js';

// Route: #/les/<id> of #/les/<id>/<stapnummer> (vanaf die stap beginnen)
export function render(root, [id, stepNo]) {
  const x = findLesson(id);
  if (!x) {
    root.innerHTML = `<div class="page"><h2>Les niet gevonden</h2><a class="btn" href="#/cursus">Naar de cursus</a></div>`;
    return;
  }
  const { lesson, chapter } = x;
  setTitle(lesson.title);
  if (!isUnlocked(id, store.get().lessons)) {
    root.innerHTML = `<div class="page"><h2>🔒 Nog op slot</h2><p>Haal eerst minstens 1 ster in de vorige les, of doe het examen van het hoofdstuk.</p><a class="btn main" href="#/cursus">Naar de cursus</a></div>`;
    return;
  }

  let runner = null, view = null;
  function start() {
    view?.stage.destroy();
    view = lessonView(root);
    runner = createRunner(lesson.steps, view, { onStep: (i, n) => view.setDots(i, n), startAt: stepNo ? +stepNo - 1 : 0 });
    runner.start().then(res => { if (res) finish(res); }).catch(e => {
      console.error(e);
      view.prompt.textContent = 'Er liep iets mis in deze les: ' + e.message;
    });
  }

  function finish(res) {
    view.stage.destroy();
    view = null;
    const before = store.get().lessons[id];
    store.update(s => recordLesson(s.lessons, id, res));
    const nxt = nextLesson(id);
    const nextOpen = nxt && res.stars >= 1;
    const title = res.stars === 3 ? 'Perfect!' : res.stars === 2 ? 'Goed gedaan!' : res.stars === 1 ? 'Gehaald!' : 'Nog even oefenen';
    const record = before?.best != null && res.acc > before.best ? ' · nieuw record!' : '';
    const examNote = lesson.exam && res.stars >= 1 ? `<p>Hoofdstuk <b>${esc(chapter.title)}</b> is afgerond.</p>` : '';
    root.innerHTML = `
    <div class="page result">
      <div class="card result-card">
        <div class="stars big ${res.stars ? 'pop' : ''}" aria-label="${res.stars} van 3 sterren">${starStr(res.stars)}</div>
        <h2>${title}</h2>
        <p>${res.acc}% juist · ${res.correct} goed · ${res.wrong} fout${record}</p>
        ${examNote}
        ${res.stars === 0 ? '<p class="muted">Je hebt minstens 1 ster nodig (50%) om verder te gaan. Neem je tijd: juist is belangrijker dan snel.</p>' : ''}
        <div class="row center">
          <button id="again">↺ Opnieuw</button>
          ${nextOpen ? `<a class="btn main" href="#/les/${esc(nxt.id)}">Volgende: ${esc(nxt.title)} →</a>` : ''}
          <a class="btn" href="#/cursus">Naar de cursus</a>
        </div>
      </div>
    </div>`;
    root.querySelector('#again').onclick = start;
    celebrate(root.querySelector('.stars.big'), res.stars, { record: !!record });
  }

  start();
  return () => { runner?.abort(); view?.stage.destroy(); };
}
