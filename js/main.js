// Opstart en hash-router (#/cursus, #/les/h1-l3, …). Werkt op GitHub Pages zonder serverconfiguratie.
import * as store from './core/storage.js';
import { bus } from './core/events.js';
import { connectMidi, midi, statusText } from './core/midi.js';
import * as input from './core/input.js';
import { ensureAudio } from './core/audio.js';
import { setTitle } from './ui/dom.js';

import * as home from './screens/home.js';
import * as connect from './screens/connect.js';
import * as calibrate from './screens/calibrate.js';
import * as course from './screens/course.js';
import * as lesson from './screens/lesson.js';
import * as placement from './screens/placement.js';
import * as play from './screens/play.js';
import * as settings from './screens/settings.js';
import * as progress from './screens/progress.js';
import * as soon from './screens/soon.js';
import * as workout from './screens/workout.js';
import * as metronome from './screens/metronome.js';

const ROUTES = {
  '': { mod: home, parent: null },
  verbinden: { mod: connect, parent: '' },
  kalibratie: { mod: calibrate, parent: 'verbinden' },
  cursus: { mod: course, parent: '' },
  les: { mod: lesson, parent: 'cursus' },
  instaptest: { mod: placement, parent: 'cursus' },
  spelen: { mod: play, parent: '' },
  liedjes: { mod: soon, parent: '', args: ['liedjes'] },
  opwarming: { mod: workout, parent: '' },
  metronoom: { mod: metronome, parent: 'opwarming' },
  voortgang: { mod: progress, parent: '' },
  instellingen: { mod: settings, parent: '' },
};

const app = document.getElementById('app');
const back = document.getElementById('back');
let cleanup = null;

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const r = ROUTES[parts[0]] || ROUTES[''];
  try { cleanup?.(); } catch (e) { console.error(e); }
  cleanup = null;
  app.innerHTML = '';
  app.scrollTop = 0;
  back.hidden = r.parent === null;
  back.href = '#/' + (r.parent || '');
  setTitle('Pianoles');
  try {
    cleanup = r.mod.render(app, r.args || parts.slice(1)) || null;
  } catch (e) {
    console.error(e);
    app.innerHTML = `<div class="page"><h2>Er liep iets mis</h2><p class="muted">${String(e.message || e)}</p><a class="btn" href="#/">Naar het menu</a></div>`;
  }
}

function applyTheme() {
  const t = store.get().settings.theme;
  if (t === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}

function updatePill() {
  const pill = document.getElementById('midiPill');
  pill.classList.toggle('on', midi.status === 'connected');
  document.getElementById('midiTxt').textContent = statusText();
}

store.load();
applyTheme();
bus.on('storage', applyTheme);
bus.on('midi:status', updatePill);
updatePill();
input.attachKeyboard();
// iOS laat audio pas toe na een aanraking: bij elke aanraking/toets de audio wekken.
addEventListener('pointerdown', ensureAudio, { passive: true });
addEventListener('keydown', ensureAudio);
addEventListener('visibilitychange', () => { if (document.hidden) input.flushPractice(); });
addEventListener('pagehide', input.flushPractice);
addEventListener('hashchange', route);
route();
connectMidi();

// Voor de rooktest en om te debuggen in de console.
window.pianoles = { store, bus, input, midi, route };
