// Voortgang (eenvoudige versie; het volledige overzicht komt in fase 6).
import * as store from '../core/storage.js';
import { courseStats } from '../lesson/course.js';
import { streakDays, weekSeconds, dayKey } from '../core/stats.js';
import { setTitle } from '../ui/dom.js';

export function render(root) {
  setTitle('Voortgang');
  const s = store.get();
  const cs = courseStats(s.lessons);
  const streak = streakDays(s.practice);
  const week = Math.round(weekSeconds(s.practice) / 60);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString('nl-BE', { weekday: 'short' }), min: Math.round((s.practice[dayKey(d)] || 0) / 60) };
  });
  const max = Math.max(10, ...days.map(d => d.min));
  root.innerHTML = `
  <div class="page progress">
    <div class="statgrid">
      <div class="card stat"><small>Cursus</small><b>${cs.pct}%</b><span class="muted small">${cs.done}/${cs.total} lessen</span></div>
      <div class="card stat"><small>Sterren</small><b>${cs.stars}</b><span class="muted small">van ${cs.maxStars}</span></div>
      <div class="card stat"><small>Reeks</small><b>${streak} 🔥</b><span class="muted small">${streak === 1 ? 'dag' : 'dagen'} op rij</span></div>
      <div class="card stat"><small>Deze week</small><b>${week}</b><span class="muted small">minuten</span></div>
    </div>
    <section class="card">
      <h3>Minuten per dag</h3>
      <div class="bars" role="img" aria-label="Oefenminuten van de laatste 7 dagen">
        ${days.map(d => `<div class="barcol"><span class="v">${d.min || ''}</span><span class="b" style="height:${Math.round(d.min / max * 100)}%"></span><small>${d.label}</small></div>`).join('')}
      </div>
      <p class="small muted">Een dag telt mee voor je reeks vanaf 1 minuut spelen.</p>
    </section>
  </div>`;
}
