// Voortgang en instellingen in localStorage (één sleutel), met export/import als JSON.
// Alles zit in try/catch: in privémodus of in sommige webviews kan localStorage ontbreken.
import { bus } from './events.js';
import { dayKey } from './stats.js';

const KEY = 'pianoles:v1';
export const VERSION = 1;

export function defaults() {
  return {
    version: VERSION,
    settings: {
      names: 'abc',        // 'abc' | 'do' | 'off'
      sound: 'auto',       // eigen noten: 'auto' (niet bij MIDI) | 'on' | 'off'
      theme: 'auto',       // 'auto' | 'light' | 'dark'
      rhColor: '#2bb3a3',  // rechterhand: turkoois
      lhColor: '#e0644f',  // linkerhand: koraal
      latency: 0,          // ms, latency-compensatie voor de modus "op tempo"
      effects: true,       // animaties en geluidjes bij sterren
      view: 'auto',        // stukjes: 'auto' (zoals de les het vraagt) | 'falling' | 'both' | 'staff'
      workoutBpm: 72,      // tempo van de vinger- en toonladderoefeningen in de opwarming
      metroBpm: 80,        // metronoom
      metroBeats: 4,
    },
    lessons: {},           // id -> {stars, best, status: 'done'|'skipped'|'tried', date, tries}
    songs: {},             // 'songId/versie/modus' -> {best, stars, date}
    practice: {},          // 'YYYY-MM-DD' -> seconden
    placement: null,       // {date, certified: [hoofdstuk-ids]}
    calibration: null,     // {date, lo, hi, velocity, pedal}
    weak: { notes: {}, skills: {} },
    workouts: {},
    songPrefs: {},         // liedje-id -> {version, hands, mode, view, tempo}          // 'YYYY-MM-DD' -> {done, acc, stars, items: [{kind, title, acc}]}
    migrated: false,
  };
}

const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

/** Vul ontbrekende velden aan met standaardwaarden; behoud onbekende velden (voorwaarts compatibel). */
export function merge(base, over) {
  if (!isObj(over)) return base;
  const out = { ...over };
  for (const k of Object.keys(base)) {
    if (!(k in over)) out[k] = base[k];
    else if (isObj(base[k]) && Object.keys(base[k]).length && isObj(over[k])) out[k] = merge(base[k], over[k]);
    else if (isObj(base[k]) && !isObj(over[k])) out[k] = base[k];
  }
  return out;
}

let state = null;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function load() {
  state = merge(defaults(), read() || {});
  migrateLegacy();
  return state;
}

export function get() {
  return state || load();
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(get()));
    return true;
  } catch (e) {
    console.warn('Voortgang kon niet bewaard worden', e);
    return false;
  }
}

/** Pas de staat aan en bewaar meteen. */
export function update(fn) {
  fn(get());
  save();
  bus.emit('storage', state);
}

export function addPractice(sec) {
  if (!(sec > 0)) return;
  update(s => {
    const k = dayKey();
    s.practice[k] = Math.round(((s.practice[k] || 0) + sec) * 10) / 10;
  });
}

export function exportJSON() {
  return JSON.stringify({ app: 'pianoles', exported: new Date().toISOString(), ...get() }, null, 2);
}

export function importJSON(text) {
  let d;
  try { d = JSON.parse(text); } catch (e) { throw new Error('Dit bestand is geen geldige JSON.'); }
  if (!isObj(d) || (d.app !== 'pianoles' && typeof d.version !== 'number')) throw new Error('Dit is geen Pianoles-back-up.');
  delete d.app;
  delete d.exported;
  state = merge(defaults(), d);
  save();
  bus.emit('storage', state);
}

export function resetAll() {
  state = defaults();
  state.migrated = true;
  save();
  bus.emit('storage', state);
}

// Scores van de eerste versie (sleutels 'pianoles-best:<index>:<modus>') één keer overnemen.
const LEGACY_IDS = ['toonladder-c', 'kortjakje', 'vader-jacob', 'mary', 'ode', 'fur-elise'];
function migrateLegacy() {
  if (state.migrated) return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const r = /^pianoles-best:(\d+):(\w+)$/.exec(k || '');
      if (!r || !LEGACY_IDS[+r[1]]) continue;
      const mode = r[2] === 'play' ? 'tempo' : r[2];
      state.songs[`${LEGACY_IDS[+r[1]]}/melody/${mode}`] = { best: +localStorage.getItem(k) || 0 };
    }
  } catch (e) { /* geen localStorage: niets te migreren */ }
  state.migrated = true;
  save();
}
