// Hoofdstuk 11: buiten de 5-vingerpositie: duim onderdoor, vinger over, toonladder C.
import { SCALES } from '../exercises.js';

const SCALE_RH = SCALES.C.rh;
const SCALE_LH = SCALES.C.lh;

export default {
  id: 'h11',
  title: 'Buiten de 5 vingers',
  intro: 'Meer dan 5 noten zonder te springen: de duim onder de hand door, een vinger over de duim, en de toonladder van C.',
  lessons: [
    {
      id: 'h11-l1', title: 'Duim onderdoor', skills: ['duim-onder'],
      steps: [
        {
          type: 'explain', range: 'C4 C6', names: 'c', position: { rh: 'C4' }, show: [{ targets: 'F4', color: 'gold', label: '1' }],
          text: 'Om verder te gaan dan 5 noten, schuift de **duim onder de hand door**. Speel C-D-E met 1-2-3 en zet dan je **duim op de F**, onder je middelvinger door. Je pols blijft rustig; de hand glijdt mee naar rechts.',
        },
        {
          type: 'piece', bpm: 66, position: { rh: 'C4' }, view: 'both', text: 'Duim onderdoor naar de F, en terug.',
          rh: 'C4/1 D4/2 E4/3 F4/1 | G4/2 A4/3 G4/2 F4/1 | E4/3 D4/2 C4/1:2',
        },
      ],
    },
    {
      id: 'h11-l2', title: 'Vinger over de duim', skills: ['duim-onder'],
      steps: [
        {
          type: 'explain', range: 'C4 C6', names: 'c', position: { rh: 'F4' },
          text: 'Naar beneden gaat het omgekeerd: je **middelvinger (3) stapt over de duim**. Van F (duim) naar E (vinger 3). Hou de duim even op de F tot de 3 de E raakt, dan klinkt het mooi gebonden.',
        },
        {
          type: 'piece', bpm: 66, position: { rh: 'F4' }, view: 'both', text: 'Over de duim naar beneden.',
          rh: 'F4/1 G4/2 A4/3 G4/2 | F4/1 E4/3 D4/2 C4/1 | D4/2 E4/3 F4/1 E4/3 | D4/2 C4/1:3',
        },
      ],
    },
    {
      id: 'h11-l3', title: 'Toonladder C (rechts)', skills: ['toonladders', 'duim-onder'],
      steps: [
        {
          type: 'explain', range: 'C4 C6', names: 'c', position: { rh: 'C4' },
          text: 'De **toonladder van C**: alle witte toetsen van {C4} tot {C5}. Vingerzetting rechts: **1-2-3, duim onder, 1-2-3-4-5**. Naar beneden: 5-4-3-2-1, **3 over**, 3-2-1.',
        },
        { type: 'piece', bpm: 72, position: { rh: 'C4' }, view: 'both', text: 'Toonladder C, rechterhand.', rh: SCALE_RH },
        { type: 'piece', bpm: 96, position: { rh: 'C4' }, view: 'both', metronome: true, phases: ['tempo'], text: 'Nu wat sneller, met metronoom.', rh: SCALE_RH },
      ],
    },
    {
      id: 'h11-l4', title: 'Toonladder C (links)', skills: ['toonladders', 'duim-onder', 'lh'],
      steps: [
        {
          type: 'explain', range: 'C2 C4', names: 'c', position: { lh: 'C3' },
          text: 'Links omhoog: **5-4-3-2-1, dan 3 over de duim**, 3-2-1. Naar beneden: 1-2-3, **duim onder**, 1-2-3-4-5. Het is het spiegelbeeld van rechts.',
        },
        { type: 'piece', bpm: 72, position: { lh: 'C3' }, view: 'both', text: 'Toonladder C, linkerhand.', lh: SCALE_LH },
      ],
    },
    {
      id: 'h11-l5', title: 'Toonladder met twee handen', skills: ['toonladders', 'handen-samen'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: { lh: 'C3', rh: 'C4' },
          text: 'Beide handen samen, een octaaf uit elkaar. Lastig: de handen **kruisen op een ander moment**. Rechts gaat de duim onder bij de F, links gaat 3 over bij de A. Begin heel traag.',
        },
        { type: 'piece', bpm: 60, position: { lh: 'C3', rh: 'C4' }, view: 'both', text: 'Toonladder C met beide handen.', rh: SCALE_RH, lh: SCALE_LH },
      ],
    },
    {
      id: 'h11-ex', title: 'Examen: toonladder C', exam: true, skills: ['toonladders'],
      steps: [
        { type: 'piece', bpm: 84, position: { rh: 'C4' }, view: 'both', metronome: true, phases: ['wait', 'tempo'], text: 'Rechterhand op tempo.', rh: SCALE_RH },
        { type: 'piece', bpm: 72, position: { lh: 'C3' }, view: 'both', metronome: true, phases: ['wait', 'tempo'], text: 'Linkerhand op tempo.', lh: SCALE_LH },
      ],
    },
  ],
};
