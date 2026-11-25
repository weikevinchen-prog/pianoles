// "Piano verbinden": status, testzone en uitleg voor iPhone en laptop.
import { bus } from '../core/events.js';
import { midi, connectMidi, statusText } from '../core/midi.js';
import { noteName } from '../core/notation.js';
import { setTitle, textStyle } from '../ui/dom.js';

export function render(root) {
  setTitle('Piano verbinden');
  root.innerHTML = `
  <div class="page connect">
    <div class="card status-card">
      <span class="bigdot" id="cDot"></span>
      <div><b id="cStatus"></b><div class="muted small" id="cHelp"></div></div>
      <button id="cRetry">Opnieuw zoeken</button>
    </div>
    <div class="card tester">
      <div><small class="muted">Speel een toets op je piano</small><b id="cNote">–</b></div>
      <div><small class="muted">Aanslag</small><div class="velbar"><span id="cVel"></span></div></div>
      <div><small class="muted">Pedaal</small><b id="cPedal">los</b></div>
      <a class="btn main" href="#/kalibratie">Kalibratie →</a>
    </div>
    <div class="two">
      <section class="card">
        <h3>📱 iPhone of iPad</h3>
        <p class="small">Safari en Chrome op iOS kennen geen Web MIDI. Gebruik daarom de app <b>Web MIDI Browser</b> (gratis in de App Store).</p>
        <ol class="small">
          <li>Zet je FP-10 aan.</li>
          <li>Open <b>Web MIDI Browser</b> en surf naar het adres van deze app.</li>
          <li>Koppel de piano <b>niet</b> via iOS-Instellingen › Bluetooth, maar in Web MIDI Browser zelf: open het menu en kies de Bluetooth-MIDI-verbinding. Selecteer daar je FP-10 (“FP-10” of “Roland”).</li>
          <li>Kom terug naar dit scherm en tik op <b>Opnieuw zoeken</b>. De status moet groen worden.</li>
          <li>Draai je telefoon <b>liggend</b> voor een groot klavier.</li>
        </ol>
      </section>
      <section class="card">
        <h3>💻 Laptop</h3>
        <ol class="small">
          <li>Verbind de <b>USB-poort</b> (“USB Computer”, type B) van de FP-10 met je laptop.</li>
          <li>Open deze app in <b>Chrome</b> of <b>Edge</b>.</li>
          <li>Geef toestemming als de browser vraagt om MIDI-apparaten te gebruiken.</li>
          <li>Geen piano bij de hand? Speel met je toetsenbord: <kbd>A</kbd> <kbd>W</kbd> <kbd>S</kbd> <kbd>E</kbd> <kbd>D</kbd> <kbd>F</kbd> <kbd>T</kbd> <kbd>G</kbd> <kbd>Y</kbd> <kbd>H</kbd> <kbd>U</kbd> <kbd>J</kbd> <kbd>K</kbd> = C tot C, <kbd>Z</kbd>/<kbd>X</kbd> = octaaf lager/hoger.</li>
        </ol>
        <p class="small muted">Komt er MIDI binnen, dan maakt de app zelf geen geluid: je hoort gewoon je piano. Voorspelen en begeleiding klinken wel uit het toestel.</p>
      </section>
    </div>
  </div>`;
  const q = s => root.querySelector(s);
  const HELP = {
    connected: 'Alles in orde. Speel een toets om te testen.',
    connecting: 'Even geduld…',
    none: 'Web MIDI werkt, maar er is geen piano gevonden. Staat hij aan en is hij gekoppeld (Bluetooth) of ingeplugd (USB)?',
    unsupported: 'Op iPhone: gebruik Web MIDI Browser. Op laptop: gebruik Chrome of Edge.',
    blocked: 'Geef de site toestemming voor MIDI (slotje in de adresbalk) en probeer opnieuw.',
    idle: '',
  };
  function upd() {
    q('#cStatus').textContent = statusText();
    q('#cHelp').textContent = HELP[midi.status] || '';
    q('#cDot').className = 'bigdot ' + midi.status;
  }
  upd();
  q('#cRetry').onclick = () => connectMidi();
  const offs = [
    bus.on('midi:status', upd),
    bus.on('noteon', ({ m, vel, src }) => {
      q('#cNote').textContent = `${noteName(m, textStyle(), true)}${src === 'midi' ? '' : src === 'kbd' ? ' (toetsenbord)' : ' (scherm)'}`;
      q('#cVel').style.width = Math.round(vel * 100) + '%';
    }),
    bus.on('pedal', p => { q('#cPedal').textContent = p ? 'ingetrapt' : 'los'; }),
  ];
  return () => offs.forEach(f => f());
}
