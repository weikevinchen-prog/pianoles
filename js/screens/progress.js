// Voortgang: cursus, sterren per les, reeks, oefentijd, opwarmingen en beste scores van liedjes.
import * as store from '../core/storage.js';
import SONGS from '../data/songs.js';
import { chapters, courseStats, passed } from '../lesson/course.js';
import { streakDays, weekSeconds, longestStreak, totalSeconds, heatmap, dayKey } from '../core/stats.js';
import { esc, setTitle, starStr } from '../ui/dom.js';

const fmtMin = sec => {
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)} u ${m % 60} min` : `${m} min`;
};

export function render(root) {
  setTitle('Voortgang');
  const s = store.get();
  const cs = courseStats(s.lessons);
  const streak = streakDays(s.practice), longest = longestStreak(s.practice);
  const week = weekSeconds(s.practice), total = totalSeconds(s.practice);
  const month = dayKey().slice(0, 7);
  const workouts = Object.entries(s.workouts || {}).filter(([k, v]) => k.startsWith(month) && v.done).length;
  const hm = heatmap(s.practice);
  const level = sec => (sec <= 0 ? 0 : sec < 300 ? 1 : sec < 900 ? 2 : 3);

  // Beste score per liedje (over alle versies en modi), recentst gespeeld eerst
  const songRows = SONGS.map(song => {
    const entries = Object.entries(s.songs).filter(([k]) => k.startsWith(song.id + '/'));
    if (!entries.length) return null;
    return {
      song,
      best: Math.max(...entries.map(([, v]) => v.best || 0)),
      stars: Math.max(...entries.map(([, v]) => v.stars || 0)),
      date: entries.map(([, v]) => v.date || '').sort().pop(),
    };
  }).filter(Boolean).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const lessonCell = l => {
    const p = s.lessons[l.id], st = p?.stars || 0, sk = p?.status === 'skipped' && !st;
    return `<i class="${sk ? 'sk' : 's' + st}" title="${esc(l.title)}: ${sk ? 'overgeslagen' : starStr(st)}"></i>`;
  };

  root.innerHTML = `
  <div class="page progress">
    <div class="statgrid">
      <div class="card stat"><small>Cursus</small><b>${cs.pct}%</b><span class="muted small">${cs.done}/${cs.total} lessen</span></div>
      <div class="card stat"><small>Sterren</small><b>${cs.stars} ★</b><span class="muted small">van ${cs.maxStars}</span></div>
      <div class="card stat"><small>Reeks</small><b>${streak} 🔥</b><span class="muted small">langste: ${longest} ${longest === 1 ? 'dag' : 'dagen'}</span></div>
      <div class="card stat"><small>Oefentijd</small><b>${fmtMin(week)}</b><span class="muted small">deze week · ${fmtMin(total)} in totaal</span></div>
    </div>
    <section class="card">
      <h3>De laatste 4 weken</h3>
      <div class="heat" role="img" aria-label="Oefentijd per dag, laatste 4 weken">
        <div class="heat-head">${['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map(d => `<small>${d}</small>`).join('')}</div>
        ${hm.map(row => `<div class="heat-row">${row.map(d => `<span class="h${d.future ? ' fut' : ' l' + level(d.sec)}" title="${d.key}: ${Math.round(d.sec / 60)} min"></span>`).join('')}</div>`).join('')}
      </div>
      <p class="small muted">${workouts} ${workouts === 1 ? 'opwarming' : 'opwarmingen'} gedaan deze maand. Een dag telt mee voor je reeks vanaf 1 minuut spelen.</p>
    </section>
    <section class="card">
      <h3>Cursus</h3>
      <div class="ch-progress">
        ${chapters.map((ch, i) => {
          const done = ch.lessons.filter(l => passed(s.lessons[l.id])).length;
          return `<div class="chp">
            <span class="chp-t"><b>${i + 1}. ${esc(ch.title)}</b><small class="muted">${done}/${ch.lessons.length}</small></span>
            <span class="meter"><span style="width:${Math.round(done / ch.lessons.length * 100)}%"></span></span>
            <span class="chp-stars">${ch.lessons.map(lessonCell).join('')}</span>
          </div>`;
        }).join('')}
      </div>
      <p class="small muted legend-row"><i class="legend s3"></i> 3 sterren <i class="legend s2"></i> 2 <i class="legend s1"></i> 1 <i class="legend sk"></i> overgeslagen <i class="legend s0"></i> nog niet</p>
    </section>
    <section class="card">
      <h3>Liedjes</h3>
      ${songRows.length
        ? `<ul class="wo-result">${songRows.map(r => `<li><a href="#/liedje/${esc(r.song.id)}">${esc(r.song.title)}</a><span><span class="stars small">${starStr(r.stars)}</span> <b>${r.best}%</b></span></li>`).join('')}</ul>`
        : '<p class="muted">Nog geen liedjes gespeeld. <a href="#/liedjes">Naar de bibliotheek →</a></p>'}
    </section>
  </div>`;
}
