// Hoofdstuk 4: linkerhand in de C-positie (pink op C3).
const LH = { lh: 'C3' };

export default {
  id: 'h4',
  title: 'Linkerhand: 5 noten',
  intro: 'Nu de linkerhand: dezelfde stapjes en sprongen, maar met de pink op C3 en de duim op G3.',
  lessons: [
    {
      id: 'h4-l1', title: 'Stapjes met links', skills: ['lh', 'c-positie'],
      steps: [
        {
          type: 'explain', range: 'C2 C4', names: 'c', position: LH,
          text: 'Bij de linkerhand gaan de nummers **andersom**: omhoog spelen is 5 → 4 → 3 → 2 → 1. Neem je tijd: links voelt in het begin onwennig, dat is normaal.',
        },
        {
          type: 'piece', bpm: 72, position: LH, text: 'Stapjes met links.',
          lh: 'C3/5 D3/4 E3/3 D3/4 | C3/5 D3/4 E3/3:2 | E3/3 F3/2 G3/1 F3/2 | E3/3 D3/4 C3/5:2',
        },
        {
          type: 'piece', bpm: 76, position: LH, text: 'En nog een.',
          lh: 'G3/1 F3/2 E3/3 F3/2 | G3/1 G3/1 G3/1:2 | F3/2 E3/3 D3/4 E3/3 | F3/2 E3/3 D3/4 C3/5 | C3/5:4',
        },
      ],
    },
    {
      id: 'h4-l2', title: 'Sprongen met links', skills: ['lh', 'c-positie'],
      steps: [
        { type: 'find', range: 'C2 C4', names: 'c', position: LH, targets: 'C3 E3 G3 E3 C3', mode: 'ordered', text: 'Speel {C3} – {E3} – {G3} – {E3} – {C3}: vinger 5, 3, 1, 3, 5.' },
        {
          type: 'piece', bpm: 72, position: LH, text: 'Sprongen en stapjes.',
          lh: 'C3/5 E3/3 G3/1:2 | G3/1 E3/3 C3/5:2 | D3/4 F3/2 E3/3 G3/1 | C3/5:4',
        },
      ],
    },
    {
      id: 'h4-l3', title: 'Lange basnoten', skills: ['lh', 'ritme'],
      steps: [
        {
          type: 'explain', range: 'C2 C4', names: 'c', position: LH,
          text: 'De linkerhand speelt vaak **lange noten** in de bas, als fundament onder de melodie. Hou de toets ingedrukt tot het blokje voorbij is: een **halve noot** duurt 2 tellen, een **hele noot** 4.',
        },
        {
          type: 'piece', bpm: 80, position: LH, phases: ['demo', 'wait', 'tempo'], metronome: true, text: 'Tel mee: 1-2-3-4.',
          lh: 'C3/5:4 | G3/1:4 | F3/2:2 E3/3:2 | D3/4:2 G3/1:2 | C3/5:4',
        },
      ],
    },
    {
      id: 'h4-l4', title: 'Mary met links', skills: ['lh', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 88, position: LH, text: 'Mary had a little lamb, een octaaf lager met links.',
          lh: 'E3/3 D3/4 C3/5 D3/4 | E3/3 E3/3 E3/3:2 | D3/4 D3/4 D3/4:2 | E3/3 G3/1 G3/1:2 | E3/3 D3/4 C3/5 D3/4 | E3/3 E3/3 E3/3 E3/3 | D3/4 D3/4 E3/3 D3/4 | C3/5:4',
        },
      ],
    },
    {
      id: 'h4-l5', title: 'Ode an die Freude met links', skills: ['lh', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 84, position: LH, text: 'Dezelfde melodie als in hoofdstuk 3, nu met links.',
          lh: 'E3/3 E3/3 F3/2 G3/1 | G3/1 F3/2 E3/3 D3/4 | C3/5 C3/5 D3/4 E3/3 | E3/3:1.5 D3/4:.5 D3/4:2 | E3/3 E3/3 F3/2 G3/1 | G3/1 F3/2 E3/3 D3/4 | C3/5 C3/5 D3/4 E3/3 | D3/4:1.5 C3/5:.5 C3/5:2',
        },
      ],
    },
    {
      id: 'h4-ex', title: 'Examen: linkerhand', exam: true, skills: ['lh'],
      steps: [
        { type: 'fingerplay', range: 'C2 C4', position: LH, rounds: 6 },
        {
          type: 'piece', bpm: 84, position: LH, phases: ['wait', 'tempo'], text: 'Speel dit met links.',
          lh: 'C3/5 E3/3 D3/4 F3/2 | E3/3 G3/1 G3/1:2 | F3/2 D3/4 E3/3 C3/5 | D3/4 D3/4 C3/5:2',
        },
      ],
    },
  ],
};
