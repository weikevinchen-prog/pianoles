// Hoofdstuk 2. Formaat: zie README.md ("Lessen toevoegen").
// Tekst: **vet**, {C} = notennaam volgens de instelling, {C4} = met octaafnummer.
export default {
  id: 'h2',
  title: 'Handen en houding',
  intro: 'Vingernummers, een goede houding, en je handen in de C-positie en de G-positie.',
  lessons: [
    {
      id: 'h2-l1', title: 'Vingernummers', skills: ['vingers'],
      steps: [
        {
          type: 'explain', illustration: 'hands',
          text: 'Je vingers hebben **nummers**: duim = **1**, wijsvinger = **2**, middelvinger = **3**, ringvinger = **4**, pink = **5**. Dat geldt voor **beide** handen. In muziek staan die nummers boven de noten.',
        },
        { type: 'fingers', hand: 'rh', mode: 'tap', rounds: 5 },
        { type: 'fingers', hand: 'lh', mode: 'tap', rounds: 5 },
        {
          type: 'explain', illustration: 'hands',
          text: 'Let op: bij de **rechterhand** ligt de duim **links**, bij de **linkerhand** ligt de duim **rechts**. De duimen wijzen naar elkaar toe, naar de centrale C.',
        },
        { type: 'fingers', hand: 'both', mode: 'name', rounds: 6 },
      ],
    },
    {
      id: 'h2-l2', title: 'Goede houding', skills: ['houding'],
      steps: [
        {
          type: 'explain', illustration: 'zithoogte',
          text: '**Zithoogte:** zit op het voorste deel van de bank. Je **onderarmen** zijn ongeveer **horizontaal**, of de ellebogen staan net iets hoger dan de toetsen. Je knieën staan net onder het klavier.',
        },
        {
          type: 'explain', illustration: 'schouders',
          text: '**Afstand en schouders:** zit zo ver dat je ellebogen net vóór je lichaam hangen. Laat je **schouders laag en los**. Trek ze niet op naar je oren, ook niet als iets moeilijk is.',
        },
        {
          type: 'explain', illustration: 'ronde-vingers',
          text: '**Ronde vingers:** houd je hand gebogen, **alsof je een bal vasthoudt**. Je speelt met de **vingertoppen**, niet met de platte vinger. De duim speelt op zijn zijkant.',
        },
        {
          type: 'explain', illustration: 'polsen',
          text: '**Ontspannen polsen:** je pols ligt ongeveer **in één lijn** met je onderarm, niet gezakt en niet opgetrokken. Speel vanuit losse vingers, niet door hard te duwen.',
        },
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: { rh: 'C4' },
          text: 'Probeer het nu: leg je rechterhand op de toetsen, met ronde vingers en een losse pols. Speel een paar noten, en voel of je schouders laag blijven.',
          button: 'Klaar →',
        },
      ],
    },
    {
      id: 'h2-l3', title: 'Rechterhand in C-positie', skills: ['rh', 'c-positie'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: { rh: 'C4' },
          show: [{ targets: 'C4 D4 E4 F4 G4', color: 'teal', label: 'name' }],
          text: 'De **C-positie** voor de rechterhand: leg je **duim (1)** op de **centrale C**. Elke vinger krijgt een eigen witte toets: 1 = {C}, 2 = {D}, 3 = {E}, 4 = {F}, 5 = {G}.',
        },
        {
          type: 'find', range: 'C3 C5', names: 'c', position: { rh: 'C4' }, targets: 'C4 D4 E4 F4 G4', mode: 'ordered',
          text: 'Speel vinger **1, 2, 3, 4, 5** na elkaar: van {C4} naar {G4}.',
        },
        {
          type: 'find', range: 'C3 C5', names: 'c', position: { rh: 'C4' }, targets: 'G4 F4 E4 D4 C4', mode: 'ordered',
          text: 'En terug: vinger **5, 4, 3, 2, 1**.',
        },
        { type: 'fingerplay', range: 'C3 C5', position: { rh: 'C4' }, rounds: 8 },
        {
          type: 'piece', bpm: 70, position: { rh: 'C4' },
          text: 'Je eerste stukje: op en neer in de C-positie. Het cijfer in elk blokje is de vinger.',
          rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:4 | G4/5 F4/4 E4/3 D4/2 | C4/1:4',
        },
      ],
    },
    {
      id: 'h2-l4', title: 'Linkerhand in C-positie', skills: ['lh', 'c-positie'],
      steps: [
        {
          type: 'explain', range: 'C2 C4', names: 'c', position: { lh: 'C3' },
          show: [{ targets: 'C3 D3 E3 F3 G3', color: 'coral', label: 'name' }],
          text: 'De **C-positie** voor de linkerhand: leg je **pink (5)** op {C3}, één octaaf onder de centrale C. Dan: 5 = {C}, 4 = {D}, 3 = {E}, 2 = {F}, en je **duim (1)** ligt op {G}.',
        },
        {
          type: 'find', range: 'C2 C4', names: 'c', position: { lh: 'C3' }, targets: 'C3 D3 E3 F3 G3', mode: 'ordered',
          text: 'Speel vinger **5, 4, 3, 2, 1** na elkaar: van {C3} naar {G3}.',
        },
        {
          type: 'find', range: 'C2 C4', names: 'c', position: { lh: 'C3' }, targets: 'G3 F3 E3 D3 C3', mode: 'ordered',
          text: 'En terug: vinger **1, 2, 3, 4, 5**.',
        },
        { type: 'fingerplay', range: 'C2 C4', position: { lh: 'C3' }, rounds: 8 },
        {
          type: 'piece', bpm: 70, position: { lh: 'C3' },
          text: 'Nu met links. Het cijfer in elk blokje is de vinger.',
          lh: 'C3/5 D3/4 E3/3 F3/2 | G3/1:4 | G3/1 F3/2 E3/3 D3/4 | C3/5:4',
        },
      ],
    },
    {
      id: 'h2-l5', title: 'Beide handen in C-positie', skills: ['c-positie', 'handen-afwisselend'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: { lh: 'C3', rh: 'C4' },
          text: 'Leg nu **beide handen** in de C-positie: linkerpink op {C3}, rechterduim op {C4}. De **turkooizen** hand is rechts, de **koraalrode** links: die kleuren zie je overal terug.',
        },
        { type: 'fingerplay', range: 'C3 C5', position: { lh: 'C3', rh: 'C4' }, rounds: 10 },
        {
          type: 'piece', bpm: 72, position: { lh: 'C3', rh: 'C4' },
          text: 'Eerst links omhoog, dan rechts omhoog.',
          lh: 'C3/5 D3/4 E3/3 F3/2 | G3/1:4 | R:4 | R:4',
          rh: 'R:4 | R:4 | C4/1 D4/2 E4/3 F4/4 | G4/5:4',
        },
      ],
    },
    {
      id: 'h2-l6', title: 'De G-positie', skills: ['g-positie'],
      steps: [
        {
          type: 'explain', range: 'G2 G5', names: 'c', position: { lh: 'G2', rh: 'G4' },
          show: [{ targets: 'G2 G4', color: 'gold', label: 'name+oct' }],
          text: 'In de **G-positie** schuif je elke hand op naar de G. **Rechts:** duim op {G4} (1 = G, 2 = A, 3 = B, 4 = C, 5 = D). **Links:** pink op {G2} (5 = G … 1 = D). De {G} ligt in het groepje van 3 zwarte toetsen, tussen de eerste en de tweede.',
        },
        { type: 'fingerplay', range: 'G2 G5', position: { lh: 'G2', rh: 'G4' }, rounds: 10 },
        {
          type: 'piece', bpm: 72, position: { rh: 'G4' },
          text: 'Rechterhand in de G-positie.',
          rh: 'G4/1 A4/2 B4/3 C5/4 | D5/5:4 | D5/5 C5/4 B4/3 A4/2 | G4/1:4',
        },
        {
          type: 'piece', bpm: 72, position: { lh: 'G2' },
          text: 'En de linkerhand.',
          lh: 'G2/5 A2/4 B2/3 C3/2 | D3/1:4 | D3/1 C3/2 B2/3 A2/4 | G2/5:4',
        },
      ],
    },
    {
      id: 'h2-ex', title: 'Examen: handen', exam: true, skills: ['vingers', 'c-positie'],
      steps: [
        { type: 'fingers', hand: 'both', mode: 'name', rounds: 5 },
        { type: 'fingerplay', range: 'C3 C5', position: { lh: 'C3', rh: 'C4' }, rounds: 8 },
        {
          type: 'piece', bpm: 80, position: { rh: 'C4' }, phases: ['wait', 'tempo'],
          text: 'Speel dit stukje in de C-positie.',
          rh: 'C4/1 E4/3 D4/2 F4/4 | E4/3 G4/5 G4/5:2 | F4/4 D4/2 E4/3 C4/1 | D4/2 D4/2 C4/1:2',
        },
      ],
    },
  ],
};
