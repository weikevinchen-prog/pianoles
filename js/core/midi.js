// Web MIDI: verbinden met de piano (Roland FP-10 via USB of Bluetooth MIDI).
// Stuurt events op de bus: 'midi:on' (noot, velocity 0–1), 'midi:off', 'midi:pedal' (CC64), 'midi:status'.
import { bus } from './events.js';

export const midi = {
  status: 'idle',   // idle | connecting | connected | none | unsupported | blocked
  names: [],
  error: '',
  outputs: [],
  access: null,
};

function set(status, error = '') {
  midi.status = status;
  midi.error = error;
  bus.emit('midi:status', midi);
}

function onMessage(ev) {
  const [s, a, b = 0] = ev.data;
  const h = s & 0xf0;
  if (h === 0x90 && b > 0) bus.emit('midi:on', a, b / 127);
  else if (h === 0x80 || h === 0x90) bus.emit('midi:off', a);
  else if (h === 0xb0 && a === 64) bus.emit('midi:pedal', b >= 64);
}

function bind() {
  const acc = midi.access;
  const names = [];
  acc.inputs.forEach(inp => {
    if (inp.state === 'disconnected') return;
    names.push(inp.name || 'MIDI-toestel');
    inp.onmidimessage = onMessage;
  });
  midi.names = names;
  midi.outputs = [...acc.outputs.values()].filter(o => o.state !== 'disconnected');
  set(names.length ? 'connected' : 'none');
}

export async function connectMidi() {
  if (!navigator.requestMIDIAccess) {
    set('unsupported', 'Deze browser heeft geen Web MIDI.');
    return midi;
  }
  set('connecting');
  try {
    midi.access = await navigator.requestMIDIAccess({ sysex: false });
    bind();
    midi.access.onstatechange = bind;
  } catch (e) {
    set('blocked', 'De browser gaf geen toestemming voor MIDI.');
  }
  return midi;
}

export function statusText() {
  switch (midi.status) {
    case 'connected': return `${midi.names.join(', ')} verbonden`;
    case 'connecting': return 'Zoeken naar piano…';
    case 'none': return 'Geen piano gevonden';
    case 'unsupported': return 'Geen Web MIDI in deze browser';
    case 'blocked': return 'MIDI geblokkeerd';
    default: return 'Niet verbonden';
  }
}
