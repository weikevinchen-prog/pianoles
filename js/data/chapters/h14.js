// Hoofdstuk 14: kruisen en mollen, toonladders in G, F, D en a-mineur, arpeggio's.
// De toonladders zelf staan in js/data/exercises.js (gedeeld met de opwarming).
import { SCALES as SC, ARPEGGIOS as ARP } from '../exercises.js';

const scaleLesson = (id, title, key, text, rhPos, lhPos) => ({
  id, title, skills: ['toonladders'],
  steps: [
    { type: 'explain', range: rhPos.range, names: 'c', position: { rh: rhPos.pos }, text },
    { type: 'piece', bpm: 72, key, position: { rh: rhPos.pos }, view: 'both', text: 'Rechterhand.', rh: SC[key].rh },
    { type: 'piece', bpm: 72, key, position: { lh: lhPos }, view: 'both', text: 'Linkerhand.', lh: SC[key].lh },
  ],
});

export default {
  id: 'h14',
  title: 'Toonladders en zwarte toetsen',
  intro: 'Kruisen en mollen, de toonladders van G, F, D en a-mineur, en gebroken akkoorden over het klavier (arpeggio\'s).',
  lessons: [
    {
      id: 'h14-l1', title: 'Kruis en mol', skills: ['zwarte-toetsen'],
      steps: [
        {
          type: 'explain', range: 'C3 B4', names: 'c', show: [{ targets: 'F#3 F#4', color: 'gold', label: 'F#' }, { targets: 'Bb3 Bb4', color: 'blue', label: 'Bb' }],
          text: 'Een **kruis (#)** maakt een noot een halve toon **hoger**: de zwarte toets rechts ervan. **F#** ligt rechts van F. Een **mol (b)** maakt een noot **lager**: **Bb** ligt links van B. Elke zwarte toets heeft dus twee namen: F# = Gb.',
        },
        { type: 'find', range: 'C3 B4', targets: 'F#', mode: 'all', text: 'Speel alle **F#**\'s (fa kruis).', hint: 'F# is de zwarte toets rechts van F: de eerste van het groepje van 3.' },
        { type: 'find', range: 'C3 B4', targets: 'Bb', mode: 'all', text: 'Speel alle **Bb**\'s (si mol).', hint: 'Bb is de zwarte toets links van B: de laatste van het groepje van 3.' },
        { type: 'quiz', range: 'C3 B4', pool: 'F# C# Bb Eb G#', rounds: 8 },
      ],
    },
    scaleLesson('h14-l2', 'G majeur', 'G',
      'De toonladder van **G majeur** heeft één kruis: **F#**. Vingerzetting rechts: 1-2-3, duim onder, 1-2-3-4-5, net als C. De **voortekening** (het kruis vooraan op de balk) zegt: speel elke F als F#.',
      { range: 'G3 B5', pos: 'G4' }, 'G2'),
    scaleLesson('h14-l3', 'F majeur', 'F',
      '**F majeur** heeft één mol: **Bb**. Rechts is de vingerzetting anders: **1-2-3-4**, duim onder op de C, 1-2-3-4. Zo valt vinger 4 op de Bb.',
      { range: 'F3 G5', pos: 'F4' }, 'F2'),
    scaleLesson('h14-l4', 'D majeur', 'D',
      '**D majeur** heeft twee kruisen: **F#** en **C#**. Vingerzetting zoals C en G: 1-2-3, duim onder, 1-2-3-4-5.',
      { range: 'C4 E5', pos: 'D4' }, 'D3'),
    scaleLesson('h14-l5', 'a-mineur', 'Am',
      '**a-mineur** gebruikt dezelfde witte toetsen als C majeur, maar begint en eindigt op **A**. Het klinkt droever. Het is de "familie" van C majeur: geen kruisen of mollen.',
      { range: 'G4 B5', pos: 'A4' }, 'A2'),
    {
      id: 'h14-l6', title: 'Arpeggio\'s', skills: ['arpeggio'],
      steps: [
        {
          type: 'explain', range: 'C3 C6', names: 'c', show: [{ targets: 'C4 E4 G4 C5', color: 'teal', label: 'name' }],
          text: 'Een **arpeggio** is een gebroken akkoord over meer dan een octaaf: **C – E – G – C**. Rechts met 1-2-3-5, links met 5-4-2-1. Laat je hand meeschuiven.',
        },
        { type: 'piece', bpm: 72, position: { rh: 'C4' }, view: 'both', text: 'Arpeggio C, rechts.', rh: `${ARP.C.rh} | ${ARP.G.rh}` },
        { type: 'piece', bpm: 72, position: { lh: 'C3' }, view: 'both', text: 'Arpeggio C, links.', lh: `${ARP.C.lh} | ${ARP.G.lh}` },
      ],
    },
    {
      id: 'h14-ex', title: 'Examen: toonladders', exam: true, skills: ['toonladders'],
      steps: [
        { type: 'quiz', range: 'C3 B4', pool: 'F# Bb C# Eb', rounds: 6 },
        { type: 'piece', bpm: 80, key: 'G', position: { rh: 'G4' }, view: 'both', phases: ['wait', 'tempo'], text: 'G majeur, rechterhand.', rh: SC.G.rh },
        { type: 'piece', bpm: 80, key: 'F', position: { rh: 'F4' }, view: 'both', phases: ['wait', 'tempo'], text: 'F majeur, rechterhand.', rh: SC.F.rh },
      ],
    },
  ],
};
