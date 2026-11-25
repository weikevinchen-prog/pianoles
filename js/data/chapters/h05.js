// Hoofdstuk 5: handen afwisselend (beide handen in de C-positie, maar niet tegelijk).
const BOTH = { lh: 'C3', rh: 'C4' };

export default {
  id: 'h5',
  title: 'Handen afwisselend',
  intro: 'Beide handen liggen klaar; de melodie springt van de ene hand naar de andere.',
  lessons: [
    {
      id: 'h5-l1', title: 'Vraag en antwoord', skills: ['handen-afwisselend'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: BOTH,
          text: 'Leg beide handen in de C-positie. De **rechterhand vraagt** iets, de **linkerhand antwoordt** met hetzelfde zinnetje een octaaf lager. Turkoois = rechts, koraal = links.',
        },
        {
          type: 'piece', bpm: 80, position: BOTH, text: 'Vraag (rechts) en antwoord (links).',
          rh: 'C4/1 D4/2 E4/3 C4/1 | R:4 | E4/3 F4/4 G4/5:2 | R:4',
          lh: 'R:4 | C3/5 D3/4 E3/3 C3/5 | R:4 | E3/3 F3/2 G3/1:2',
        },
      ],
    },
    {
      id: 'h5-l2', title: 'Mary in twee handen', skills: ['handen-afwisselend', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 88, position: BOTH, text: 'Mary had a little lamb: eerst rechts, dan links.',
          rh: 'E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3:2 | D4/2 D4/2 D4/2:2 | E4/3 G4/5 G4/5:2 | R:4 | R:4 | R:4 | R:4',
          lh: 'R:4 | R:4 | R:4 | R:4 | E3/3 D3/4 C3/5 D3/4 | E3/3 E3/3 E3/3 E3/3 | D3/4 D3/4 E3/3 D3/4 | C3/5:4',
        },
      ],
    },
    {
      id: 'h5-l3', title: 'Ode verdeeld', skills: ['handen-afwisselend', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 84, position: BOTH, text: 'Ode an die Freude: elke hand speelt een zinnetje.',
          rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | R:4 | R:4 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | R:4 | R:4',
          lh: 'R:4 | R:4 | C3/5 C3/5 D3/4 E3/3 | E3/3:1.5 D3/4:.5 D3/4:2 | R:4 | R:4 | C3/5 C3/5 D3/4 E3/3 | D3/4:1.5 C3/5:.5 C3/5:2',
        },
      ],
    },
    {
      id: 'h5-l4', title: 'Snel wisselen', skills: ['handen-afwisselend'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: BOTH,
          text: 'Nu wisselen de handen **binnen één maat**. Kijk vooruit naar de kleur van het volgende blokje, zodat de juiste hand al klaar is.',
        },
        {
          type: 'piece', bpm: 76, position: BOTH, text: 'Om beurten: links – rechts.',
          rh: 'R C4/1 R E4/3 | R G4/5 R E4/3 | R D4/2 R F4/4 | R E4/3 C4/1:2',
          lh: 'C3/5 R E3/3 R | G3/1 R E3/3 R | D3/4 R F3/2 R | E3/3 R:3',
        },
      ],
    },
    {
      id: 'h5-ex', title: 'Examen: handen afwisselend', exam: true, skills: ['handen-afwisselend'],
      steps: [
        { type: 'fingerplay', range: 'C3 C5', position: BOTH, rounds: 8 },
        {
          type: 'piece', bpm: 84, position: BOTH, phases: ['wait', 'tempo'], text: 'Au clair de la lune, verdeeld over twee handen.',
          rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | R:4 | R:4 | C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | R:4 | R:4',
          lh: 'R:4 | R:4 | C3/5 E3/3 D3/4 D3/4 | C3/5:4 | R:4 | R:4 | C3/5 E3/3 D3/4 D3/4 | C3/5:4',
        },
      ],
    },
  ],
};
