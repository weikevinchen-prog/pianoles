// Het eigen MIDI-bestand dat je in de bibliotheek opende (alleen in het geheugen, niet bewaard).
import { loadMidiFile } from './midifile.js';

let current = null;

export async function openMidiFile(file) {
  const notes = loadMidiFile(await file.arrayBuffer());
  current = { id: 'eigen', title: file.name.replace(/\.midi?$/i, ''), composer: 'Eigen MIDI-bestand', level: 0, file: true, notes };
  return current;
}

export const getCustom = () => current;
