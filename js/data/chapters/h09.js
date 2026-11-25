// Hoofdstuk 9: de bassleutel en de grote notenbalk.
const BOTH = { lh: 'C3', rh: 'C4' };

export default {
  id: 'h9',
  title: 'Noten lezen 2 (bassleutel)',
  intro: 'De bassleutel voor de linkerhand, de grote notenbalk, en je eerste stuk alleen van bladmuziek.',
  lessons: [
    {
      id: 'h9-l1', title: 'De bassleutel', skills: ['lezen-bas'],
      steps: [
        {
          type: 'explain', range: 'C2 C4', names: 'c', staff: { clef: 'bass', notes: 'F3', labels: 'oct' },
          text: 'De linkerhand leest in de **bassleutel** (F-sleutel). De twee puntjes van de sleutel omringen de **4de lijn**: daar staat de **{F3}**.',
        },
        {
          type: 'explain', range: 'C2 C4', names: 'c', staff: { clef: 'bass', notes: 'C3 D3 E3 F3 G3', labels: true },
          text: 'De C-positie van de linkerhand op de bassleutel: {C3} staat in de 2de tussenruimte, en elke noot gaat één trapje hoger tot {G3} in de 4de ruimte.',
        },
        { type: 'staffquiz', clef: 'bass', range: 'C2 C4', names: 'c', pool: 'C3 D3 E3 F3 G3', rounds: 10 },
      ],
    },
    {
      id: 'h9-l2', title: 'De grote notenbalk', skills: ['lezen-bas', 'lezen-viool'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', staff: { clef: 'grand', notes: 'C3 G3 C4 G4', labels: 'oct' },
          text: 'Piano lees je op de **grote notenbalk**: vioolsleutel boven (rechterhand), bassleutel onder (linkerhand), met een accolade ervoor. De **centrale C** zit precies **tussen** de twee balken, op een hulplijn.',
        },
        { type: 'staffquiz', clef: 'grand', range: 'C3 C5', names: 'c', pool: 'C3 E3 G3 C4 D4 E4 G4 A4', rounds: 10 },
      ],
    },
    {
      id: 'h9-l3', title: 'Lagere basnoten', skills: ['lezen-bas'],
      steps: [
        {
          type: 'explain', range: 'C2 C4', names: 'c', staff: { clef: 'bass', notes: 'G2 A2 B2 C3', labels: 'oct' },
          text: 'Onder {C3} gaat het verder naar beneden: {B2}, {A2} en {G2} op de **onderste lijn**. Ankers in de bas: **F3** (4de lijn), **C3** (2de ruimte), **G2** (onderste lijn).',
        },
        { type: 'staffquiz', clef: 'bass', range: 'C2 C4', names: 'c', pool: 'G2 A2 B2 C3 D3 E3 F3', rounds: 10 },
      ],
    },
    {
      id: 'h9-l4', title: 'Van bladmuziek spelen', skills: ['lezen-bas', 'handen-samen'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: BOTH,
          text: 'Nu speel je **alleen van bladmuziek**, met twee handen. Neem je tijd: in de wachtmodus wacht de muziek op jou. Kijk eerst welke hand begint.',
        },
        {
          type: 'piece', bpm: 72, position: BOTH, view: 'staff', phases: ['wait', 'tempo'], text: 'Twee handen van de grote notenbalk.',
          rh: 'E4/3 D4/2 E4/3 F4/4 | G4/5:2 G4/5:2 | F4/4 E4/3 D4/2 C4/1 | D4/2:4',
          lh: 'C3/5:4 | E3/3:4 | F3/2:2 E3/3:2 | G3/1:4',
        },
      ],
    },
    {
      id: 'h9-ex', title: 'Examen: noten lezen', exam: true, skills: ['lezen-bas', 'lezen-viool'],
      steps: [
        { type: 'staffquiz', clef: 'grand', range: 'G2 C6', names: 'c', pool: 'G2 B2 D3 F3 A3 C4 E4 G4 B4 D5', rounds: 10 },
        {
          type: 'piece', bpm: 76, position: BOTH, view: 'staff', phases: ['wait'], text: 'Speel van bladmuziek.',
          rh: 'C4/1 E4/3 G4/5:2 | F4/4 D4/2 E4/3:2 | R:4 | E4/3 D4/2 C4/1:2',
          lh: 'R:4 | R:4 | G3/1 F3/2 E3/3 D3/4 | C3/5:4',
        },
      ],
    },
  ],
};
