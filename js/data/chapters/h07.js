// Hoofdstuk 7: noten lezen in de vioolsleutel. Introductie van de notenbalk (eerst samen met vallende noten).
const RH = { rh: 'C4' };

export default {
  id: 'h7',
  title: 'Noten lezen 1 (vioolsleutel)',
  intro: 'De notenbalk, de vioolsleutel, de centrale C en de noten van de rechterhand lezen.',
  lessons: [
    {
      id: 'h7-l1', title: 'Notenbalk en vioolsleutel', skills: ['lezen-viool'],
      steps: [
        {
          type: 'explain', range: 'C4 C6', names: 'c', staff: { clef: 'treble', notes: 'E4 G4 B4 D5 F5', labels: true },
          text: 'Een **notenbalk** heeft **5 lijnen**. Noten staan **op** een lijn of **tussen** twee lijnen. Hoe hoger op de balk, hoe hoger de noot. De **vioolsleutel** (de krul) draait rond de 2de lijn: daar staat de **{G4}**.',
        },
        {
          type: 'explain', range: 'C4 C6', names: 'c', staff: { clef: 'treble', notes: 'F4 A4 C5 E5', labels: true },
          text: 'De noten **tussen** de lijnen zijn van onder naar boven **F – A – C – E**. Ezelsbruggetje: ze vormen samen het woord **FACE**.',
        },
        { type: 'staffquiz', clef: 'treble', range: 'C4 C6', names: 'c', pool: 'G4 F4 A4', rounds: 6 },
      ],
    },
    {
      id: 'h7-l2', title: 'De centrale C op de balk', skills: ['lezen-viool'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', staff: { clef: 'treble', notes: 'C4 D4 E4', labels: 'oct' },
          text: 'De **centrale C** staat **onder** de notenbalk, op een eigen klein lijntje (een **hulplijn**). De {D4} hangt net onder de balk, de {E4} staat op de onderste lijn.',
        },
        { type: 'staffquiz', clef: 'treble', range: 'C3 C5', names: 'c', pool: 'C4 D4 E4', rounds: 8 },
      ],
    },
    {
      id: 'h7-l3', title: 'C-D-E-F-G lezen', skills: ['lezen-viool'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: RH, staff: { clef: 'treble', notes: 'C4 D4 E4 F4 G4', labels: true },
          text: 'Dit zijn de 5 noten van de C-positie: elke noot staat één trapje hoger, afwisselend **op** een lijn en **tussen** lijnen.',
        },
        { type: 'staffquiz', clef: 'treble', range: 'C3 C5', names: 'c', pool: 'C4 D4 E4 F4 G4', rounds: 10 },
      ],
    },
    {
      id: 'h7-l4', title: 'Hoger op de balk', skills: ['lezen-viool'],
      steps: [
        {
          type: 'explain', range: 'C4 C6', names: 'c', staff: { clef: 'treble', notes: 'G4 A4 B4 C5 D5 E5', labels: 'oct' },
          text: 'Vanaf de {G4} gaan we verder omhoog: {A4}, {B4}, {C5} (3de tussenruimte), {D5}, {E5}. Gebruik **ankers**: G op de 2de lijn, C5 in de 3de ruimte.',
        },
        { type: 'staffquiz', clef: 'treble', range: 'C4 C6', names: 'c', pool: 'G4 A4 B4 C5 D5 E5', rounds: 10 },
      ],
    },
    {
      id: 'h7-l5', title: 'Lezen en spelen', skills: ['lezen-viool'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c',
          text: 'Vanaf nu zie je de **notenbalk boven de vallende noten**. Probeer zoveel mogelijk naar de balk te kijken: de gouden noot en de cursor tonen waar je bent.',
        },
        {
          type: 'piece', bpm: 88, position: RH, view: 'both', text: 'Mary had a little lamb, met notenbalk.',
          rh: 'E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3:2 | D4/2 D4/2 D4/2:2 | E4/3 G4/5 G4/5:2 | E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3 E4/3 | D4/2 D4/2 E4/3 D4/2 | C4/1:4',
        },
        {
          type: 'piece', bpm: 88, position: RH, view: 'staff', phases: ['wait'], text: 'Durf je het nu alleen van de balk? (Alleen bladmuziek.)',
          rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4',
        },
      ],
    },
    {
      id: 'h7-ex', title: 'Examen: vioolsleutel', exam: true, skills: ['lezen-viool'],
      steps: [
        { type: 'staffquiz', clef: 'treble', range: 'C3 C6', names: 'c', pool: 'C4 D4 E4 F4 G4 A4 B4 C5 D5', rounds: 10 },
        {
          type: 'piece', bpm: 84, position: RH, view: 'staff', phases: ['wait'], text: 'Speel van bladmuziek.',
          rh: 'E4/3 F4/4 G4/5 E4/3 | D4/2 E4/3 C4/1:2 | G4/5 F4/4 E4/3 D4/2 | C4/1:4',
        },
      ],
    },
  ],
};
