// Startscherm met het hoofdmenu.
import * as store from '../core/storage.js';
import { midi } from '../core/midi.js';
import { firstOpen, courseStats } from '../lesson/course.js';
import { streakDays, weekSeconds } from '../core/stats.js';
import { esc } from '../ui/dom.js';

const TILES = [
  { href: '#/cursus', icon: '🎓', title: 'Cursus', sub: 'Stap voor stap' },
  { href: '#/opwarming', icon: '☀️', title: 'Dagelijkse opwarming', sub: '5–10 minuten' },
  { href: '#/liedjes', icon: '🎵', title: 'Liedjes', sub: 'Klassiek & traditioneel' },
  { href: '#/spelen', icon: '🎹', title: 'Vrij spelen', sub: 'Vallende noten, eigen MIDI' },
  { href: '#/voortgang', icon: '📈', title: 'Voortgang', sub: 'Sterren & oefentijd' },
  { href: '#/instellingen', icon: '⚙️', title: 'Instellingen', sub: 'Namen, geluid, back-up' },
];

export function render(root) {
  const s = store.get();
  const next = firstOpen(s.lessons);
  const cs = courseStats(s.lessons);
  const fresh = !s.placement && cs.done === 0;
  const streak = streakDays(s.practice), week = Math.round(weekSeconds(s.practice) / 60);
  const connected = midi.status === 'connected';

  root.innerHTML = `
  <div class="page home">
    ${fresh ? `<div class="banner">
      <div><b>Welkom!</b> Al wat piano gespeeld vroeger? Doe de korte <b>instaptest</b> (± 3 min), dan begin je meteen op jouw niveau.</div>
      <div class="row"><a class="btn main" href="#/instaptest">Instaptest</a><a class="btn" href="#/les/h1-l1">Begin bij les 1</a></div>
    </div>` : next ? `<a class="continue" href="#/les/${esc(next.id)}"><small>Verder met</small><b>${esc(next.title)}</b><span aria-hidden="true">▶</span></a>` : ''}
    <nav class="tiles">
      ${TILES.map(t => `<a class="tile" href="${t.href}"><span class="ic" aria-hidden="true">${t.icon}</span><b>${t.title}</b><small>${t.sub}</small></a>`).join('')}
    </nav>
    ${connected ? '' : `<a class="banner warn" href="#/verbinden"><span>🔌 <b>Piano nog niet verbonden.</b> Tik hier voor hulp. Je kunt ook met het schermklavier of je toetsenbord spelen.</span></a>`}
    <p class="muted small">Cursus ${cs.pct}% · ${streak ? `🔥 ${streak} ${streak === 1 ? 'dag' : 'dagen'} op rij · ` : ''}${week} min geoefend deze week</p>
  </div>`;
}
