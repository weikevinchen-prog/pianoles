// Liedjesbibliotheek: filter op niveau, beste score per liedje, eigen MIDI-bestand openen.
import SONGS, { LEVELS } from '../data/songs.js';
import * as store from '../core/storage.js';
import { openMidiFile } from '../core/customsong.js';
import { esc, setTitle } from '../ui/dom.js';

export function bestFor(id) {
  const songs = store.get().songs;
  let best = null;
  for (const [k, v] of Object.entries(songs)) if (k.startsWith(id + '/') && v?.best != null) best = Math.max(best ?? 0, v.best);
  return best;
}

export function render(root, [lvl]) {
  setTitle('Liedjes');
  const level = +lvl || 0;
  const list = SONGS.filter(s => !level || s.level === level);
  const dots = n => '●'.repeat(n) + '○'.repeat(3 - n);
  root.innerHTML = `
  <div class="page songs">
    <div class="songs-head">
      <nav class="tabs" aria-label="Niveau">
        ${[[0, 'Alle'], [1, LEVELS[1]], [2, LEVELS[2]], [3, LEVELS[3]]].map(([v, t]) => `<a class="tab${v === level ? ' on' : ''}" href="#/liedjes${v ? '/' + v : ''}"${v === level ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
      </nav>
      <label class="btn file">📂 Eigen MIDI-bestand<input type="file" id="midi" accept=".mid,.midi,audio/midi"></label>
    </div>
    <p class="small" id="msg" aria-live="polite"></p>
    <ul class="song-list">
      ${list.map(s => {
        const b = bestFor(s.id);
        return `<li><a class="song-card" href="#/liedje/${esc(s.id)}">
          <span class="lvl lvl${s.level}" title="${LEVELS[s.level]}" aria-label="${LEVELS[s.level]}">${dots(s.level)}</span>
          <span class="t"><b>${esc(s.title)}</b><small>${esc(s.composer)}${s.versions.full ? ' · 3 versies' : ''}</small></span>
          ${b != null ? `<span class="best">${b}%</span>` : '<span class="best muted">nieuw</span>'}
        </a></li>`;
      }).join('')}
    </ul>
    <p class="small muted">Alleen muziek uit het publiek domein. Eigen MIDI-bestanden worden automatisch in linker- en rechterhand gesplitst (per spoor, of anders rond de centrale C).</p>
  </div>`;
  root.querySelector('#midi').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      await openMidiFile(f);
      location.hash = '#/liedje/eigen';
    } catch (err) {
      root.querySelector('#msg').textContent = '⚠️ ' + err.message;
    }
    e.target.value = '';
  };
}
