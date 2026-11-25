// Hoofdstuk 13: begeleidingspatronen voor de linkerhand.
const C = '[C3/5 E3/3 G3/1]', G = '[B2/5 D3/3 G3/1]';
const ODE_RH = 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2';
const BOTH = { lh: 'C3', rh: 'C4' };

export default {
  id: 'h13',
  title: 'Begeleiden met LH',
  intro: 'De linkerhand als begeleider: blokakkoorden, gebroken akkoorden, een walspatroon en de Alberti-bas.',
  lessons: [
    {
      id: 'h13-l1', title: 'Blokakkoorden', skills: ['begeleiding'],
      steps: [
        {
          type: 'explain', range: 'B2 C5', names: 'c', position: BOTH,
          text: 'De eenvoudigste begeleiding: de linkerhand speelt een **akkoord per maat** (een blokakkoord). Voor C speel je C-E-G, voor G speel je **B-D-G**: zo hoeft je hand bijna niet te bewegen.',
        },
        {
          type: 'piece', bpm: 76, position: BOTH, view: 'both', text: 'Ode an die Freude met blokakkoorden.',
          rh: ODE_RH,
          lh: `${C}:4 | ${G}:4 | ${C}:4 | ${G}:4 | ${C}:4 | ${G}:4 | ${C}:4 | ${G}:2 ${C}:2`,
        },
      ],
    },
    {
      id: 'h13-l2', title: 'Gebroken akkoorden', skills: ['begeleiding'],
      steps: [
        {
          type: 'explain', range: 'B2 C5', names: 'c', position: BOTH,
          text: 'Bij een **gebroken akkoord** speel je de noten van het akkoord **na elkaar**: C-E-G-E. Het klinkt levendiger dan een blokakkoord.',
        },
        {
          type: 'piece', bpm: 80, position: BOTH, view: 'both', text: 'Au clair de la lune met gebroken akkoorden.',
          rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4',
          lh: 'C3/5 E3/3 G3/1 E3/3 | C3/5 E3/3 B2/5 D3/3 | C3/5 E3/3 B2/5 D3/3 | C3/5 E3/3 G3/1:2',
        },
      ],
    },
    {
      id: 'h13-l3', title: 'Walspatroon', skills: ['begeleiding', 'ritme'],
      steps: [
        {
          type: 'explain', range: 'B2 C5', names: 'c', position: BOTH,
          text: 'In een **wals** (3/4) speelt links **bas – akkoord – akkoord**: hm-pa-pa. De basnoot op tel 1, de rest van het akkoord op tel 2 en 3.',
        },
        {
          type: 'piece', bpm: 100, meter: [3, 4], metronome: true, position: BOTH, view: 'both', text: 'Een walsje.',
          rh: 'E4/3:2 G4/5 | F4/4:2 D4/2 | E4/3 F4/4 E4/3 | D4/2:3 | E4/3:2 G4/5 | F4/4:2 D4/2 | D4/2 E4/3 D4/2 | C4/1:3',
          lh: 'C3/5 [E3/3 G3/1] [E3/3 G3/1] | B2/5 [D3/3 G3/1] [D3/3 G3/1] | C3/5 [E3/3 G3/1] [E3/3 G3/1] | B2/5 [D3/3 G3/1] [D3/3 G3/1] | C3/5 [E3/3 G3/1] [E3/3 G3/1] | B2/5 [D3/3 G3/1] [D3/3 G3/1] | B2/5 [D3/3 G3/1] [D3/3 G3/1] | C3/5:3',
        },
      ],
    },
    {
      id: 'h13-l4', title: 'Alberti-bas', skills: ['begeleiding'],
      steps: [
        {
          type: 'explain', range: 'B2 C5', names: 'c', position: BOTH,
          text: 'De **Alberti-bas** is het patroon dat Mozart en Haydn graag gebruikten: **laag – hoog – midden – hoog** in achtsten. Voor C: C-G-E-G.',
        },
        {
          type: 'piece', bpm: 66, position: BOTH, view: 'both', text: 'Melodie met Alberti-bas.',
          rh: 'G4/5:2 E4/3:2 | F4/4:2 D4/2:2 | E4/3 F4/4 G4/5 E4/3 | C4/1:4',
          lh: 'C3/5:.5 G3/1:.5 E3/3:.5 G3/1:.5 C3/5:.5 G3/1:.5 E3/3:.5 G3/1:.5 | B2/5:.5 G3/1:.5 D3/3:.5 G3/1:.5 B2/5:.5 G3/1:.5 D3/3:.5 G3/1:.5 | C3/5:.5 G3/1:.5 E3/3:.5 G3/1:.5 C3/5:.5 G3/1:.5 E3/3:.5 G3/1:.5 | C3/5:4',
        },
      ],
    },
    {
      id: 'h13-l5', title: 'Melodie en begeleiding', skills: ['begeleiding', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 80, position: BOTH, view: 'both', text: 'Ode an die Freude: bas op tel 1, akkoord op tel 3.',
          rh: ODE_RH,
          lh: 'C3/5:2 [E3/3 G3/1]:2 | B2/5:2 [D3/3 G3/1]:2 | C3/5:2 [E3/3 G3/1]:2 | B2/5:2 [D3/3 G3/1]:2 | C3/5:2 [E3/3 G3/1]:2 | B2/5:2 [D3/3 G3/1]:2 | C3/5:2 [E3/3 G3/1]:2 | B2/5:2 C3/5:2',
        },
      ],
    },
    {
      id: 'h13-ex', title: 'Examen: begeleiden', exam: true, skills: ['begeleiding'],
      steps: [
        {
          type: 'piece', bpm: 80, position: BOTH, view: 'both', phases: ['wait', 'tempo'], text: 'Au clair de la lune met blokakkoorden.',
          rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4',
          lh: `${C}:4 | ${C}:2 ${G}:2 | ${C}:2 ${G}:2 | ${C}:4`,
        },
      ],
    },
  ],
};
