// Cursusoverzicht: hoofdstukken, lessen, sterren en sloten.
import * as store from '../core/storage.js';
import { chapters, isUnlocked, passed, courseStats } from '../lesson/course.js';
import { UPCOMING } from '../data/course.js';
import { esc, setTitle, starStr } from '../ui/dom.js';

export function render(root) {
  setTitle('Cursus');
  const prog = store.get().lessons;
  const cs = courseStats(prog);
  const chapterHtml = (ch, ci) => {
    const examId = ch.lessons.find(l => l.exam)?.id;
    const allPassed = ch.lessons.every(l => passed(prog[l.id]));
    const items = ch.lessons.map((l, li) => {
      const p = prog[l.id];
      const open = isUnlocked(l.id, prog);
      const cls = ['lesson-card', open ? '' : 'locked', p?.status === 'skipped' && !(p.stars > 0) ? 'skipped' : '', passed(p) ? 'passed' : '', l.exam ? 'exam' : ''].join(' ');
      const right = !open ? '🔒' : p?.status === 'skipped' && !(p.stars > 0) ? '<span class="tag">overgeslagen</span>' : `<span class="stars small">${starStr(p?.stars || 0)}</span>`;
      const inner = `<span class="num">${l.exam ? '🏁' : li + 1}</span><span class="t">${esc(l.title)}</span>${right}`;
      return `<li>${open ? `<a class="${cls}" href="#/les/${esc(l.id)}">${inner}</a>` : `<span class="${cls}" aria-disabled="true">${inner}</span>`}</li>`;
    }).join('');
    const canExam = examId && !allPassed && isUnlocked(examId, prog) && !passed(prog[examId]);
    return `<section class="chapter card">
      <header>
        <div><small class="muted">Hoofdstuk ${ci + 1}</small><h3>${esc(ch.title)}</h3><p class="muted small">${esc(ch.intro || '')}</p></div>
        ${canExam ? `<a class="btn small" href="#/les/${esc(examId)}">Ik ken dit al → examen</a>` : ''}
      </header>
      <ol class="lessons">${items}</ol>
    </section>`;
  };
  root.innerHTML = `
  <div class="page course">
    <div class="course-head">
      <div><b>${cs.pct}% voltooid</b> <span class="muted small">· ${cs.stars}/${cs.maxStars} sterren</span>
        <div class="meter"><span style="width:${cs.pct}%"></span></div></div>
      <a class="btn" href="#/instaptest">Instaptest</a>
    </div>
    ${chapters.map(chapterHtml).join('')}
    ${UPCOMING.length ? `<section class="card upcoming"><h3>Binnenkort</h3><ol start="${chapters.length + 1}">${UPCOMING.map(t => `<li>${esc(t)}</li>`).join('')}</ol></section>` : ''}
  </div>`;
}
