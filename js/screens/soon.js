// Tijdelijke schermen voor onderdelen die in een latere fase gebouwd worden.
import { setTitle } from '../ui/dom.js';

const INFO = {
  liedjes: { title: 'Liedjes', text: 'Een bibliotheek van 25+ publiek-domeinliedjes in drie niveaus, met oefentools per hand, tempo, lus en gedetailleerde feedback. Komt in fase 5. Voorlopig kun je de bestaande liedjes en je eigen MIDI-bestanden spelen via Vrij spelen.' },
};

export function render(root, [key]) {
  const i = INFO[key] || { title: 'Binnenkort', text: '' };
  setTitle(i.title);
  root.innerHTML = `<div class="page"><div class="card"><h2>${i.title}</h2><p>${i.text}</p><div class="row"><a class="btn main" href="#/spelen">Naar Vrij spelen</a><a class="btn" href="#/cursus">Naar de cursus</a></div></div></div>`;
}
