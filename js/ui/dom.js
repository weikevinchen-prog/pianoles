// Kleine DOM-hulpjes.
import { noteName, noteNum } from '../core/notation.js';
import { get } from '../core/storage.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function setTitle(t) {
  const el = document.getElementById('title');
  if (el) el.textContent = t;
  document.title = t === 'Pianoles' ? t : `${t} · Pianoles`;
}

export const starStr = n => '★'.repeat(n) + '☆'.repeat(3 - n);

/** Naamstijl voor tekst: bij "geen namen" tonen we in uitleg toch C D E. */
export const textStyle = () => (get().settings.names === 'off' ? 'abc' : get().settings.names);

const DO_NAMES = { C: 'do', D: 're', E: 'mi', F: 'fa', G: 'sol', A: 'la', B: 'si' };
/** Notennaam zoals geschreven (een mol blijft een mol): 'Bb' -> 'Bb' of 'sib'. */
function spelled(n, o, st) {
  if (n.length === 2 && n[1] === 'b') return (st === 'do' ? DO_NAMES[n[0]] + 'b' : n) + (o ?? '');
  return noteName(noteNum(n + (o ?? '4')), st, o != null);
}

/** Lestekst -> HTML. **vet**, {C} = notennaam volgens instelling, {C4} = met octaaf, nieuwe regel = <br>. */
export function fmt(text) {
  const st = textStyle();
  return esc(text || '')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\{([A-G][#b]?)(-?\d)?\}/g, (_, n, o) => `<b class="nn">${spelled(n, o, st)}</b>`)
    .replace(/\n/g, '<br>');
}

export function download(name, text, type = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
