// Hoofdstuk 1. Formaat: zie README.md ("Lessen toevoegen").
// Tekst: **vet**, {C} = notennaam volgens de instelling, {C4} = met octaafnummer.
export default {
  id: 'h1',
  title: 'Het klavier terugvinden',
  intro: 'Zwarte toetsen als kompas, de C vinden, de centrale C, en alle witte toetsen benoemen.',
  lessons: [
    {
      id: 'h1-l1', title: 'Zwarte toetsen in groepjes', skills: ['orientatie'],
      steps: [
        {
          type: 'explain', range: 'C3 B4',
          text: 'Kijk naar de zwarte toetsen: ze staan in **groepjes van 2** en **groepjes van 3**, steeds om en om. Dat patroon herhaalt zich over het hele klavier. Het is je kompas: zo vind je elke noot terug.',
          show: [{ targets: 'C# D#', color: 'gold' }, { targets: 'F# G# A#', color: 'blue' }],
        },
        {
          type: 'find', range: 'C3 B4', targets: 'C# D#', mode: 'all',
          text: 'Speel alle zwarte toetsen uit de **groepjes van 2** op het scherm.',
          hint: 'De groepjes van 2 zitten tussen de groepjes van 3.',
        },
        {
          type: 'find', range: 'C3 B4', targets: 'F# G# A#', mode: 'all',
          text: 'Speel nu alle zwarte toetsen uit de **groepjes van 3**.',
          hint: 'Zoek drie zwarte toetsen naast elkaar.',
        },
        {
          type: 'explain', range: 'A0 C8', names: 'none',
          text: 'Je FP-10 heeft **88 toetsen**: 52 witte en 36 zwarte. Helemaal links begint het met één losse zwarte toets, daarna komen de groepjes van 2 en 3.',
          show: [{ targets: 'A#0', color: 'gold' }],
        },
      ],
    },
    {
      id: 'h1-l2', title: 'De C vinden', skills: ['orientatie'],
      steps: [
        {
          type: 'explain', range: 'C3 C5',
          text: 'De **{C}** is de witte toets **net links van een groepje van 2** zwarte toetsen. Elk groepje van 2 heeft er zo één.',
          show: [{ targets: 'C', color: 'gold', label: 'name' }, { targets: 'C# D#', color: 'blue' }],
        },
        {
          type: 'find', range: 'C3 C5', targets: 'C', mode: 'all',
          text: 'Speel alle **{C}**\'s op het scherm.',
          hint: 'Zoek een groepje van 2 zwarte toetsen en neem de witte toets links ervan.',
        },
        {
          type: 'find', range: 'A0 C8', targets: 'C', mode: 'ordered',
          text: 'Speel nu **alle {C}\'s van je piano**, van laag (links) naar hoog (rechts). Er zijn er 8.',
          hint: 'De eerste C is de derde witte toets van links.',
        },
      ],
    },
    {
      id: 'h1-l3', title: 'De centrale C (C4)', skills: ['orientatie'],
      steps: [
        {
          type: 'explain', range: 'C2 C6', names: 'c',
          text: 'De C in het midden van het klavier heet de **centrale C**, of **{C4}**. Op een 88-toetsenpiano is het de **4de C van links**. Als je recht voor het midden van je piano zit, ligt hij ongeveer voor je neus. Hij is je vertrekpunt voor bijna alles.',
          show: [{ targets: 'C4', color: 'gold' }],
        },
        {
          type: 'find', range: 'C2 C6', targets: 'C4', mode: 'any',
          text: 'Speel de **centrale C**.',
          hint: 'Tel de C\'s vanaf links: 1, 2, 3, 4.',
        },
        {
          type: 'explain', range: 'C2 C6', names: 'none',
          text: 'Elke C krijgt een nummer: {C3} ligt één C lager (links), {C5} één C hoger (rechts). Van een C tot de volgende C heet een **octaaf**.',
          show: [{ targets: 'C3 C4 C5', color: 'gold', label: 'name+oct' }],
        },
        {
          type: 'quiz', range: 'C2 C6', pool: 'C4 C5 C3', rounds: 6,
          text: 'Speel {X}.',
        },
      ],
    },
    {
      id: 'h1-l4', title: 'D en E', skills: ['orientatie'],
      steps: [
        {
          type: 'explain', range: 'C3 B4',
          text: 'De **{D}** ligt **tussen** de 2 zwarte toetsen. De **{E}** ligt **rechts** van het groepje van 2. Rond elk groepje van 2 liggen dus {C} – {D} – {E}.',
          show: [{ targets: 'C D E', color: 'gold', label: 'name' }],
        },
        {
          type: 'find', range: 'C3 B4', targets: 'D', mode: 'all',
          text: 'Speel alle **{D}**\'s.',
          hint: 'De D zit tussen de twee zwarte toetsen van een groepje van 2.',
        },
        {
          type: 'find', range: 'C3 B4', targets: 'E', mode: 'all',
          text: 'Speel alle **{E}**\'s.',
          hint: 'De E ligt net rechts van een groepje van 2.',
        },
        { type: 'quiz', range: 'C3 B4', pool: 'C D E', rounds: 8 },
      ],
    },
    {
      id: 'h1-l5', title: 'F, G, A en B', skills: ['orientatie'],
      steps: [
        {
          type: 'explain', range: 'C3 B4',
          text: 'Rond het **groepje van 3** liggen 4 witte toetsen: **{F}** (net links ervan), **{G}**, **{A}** en **{B}**. In do-re-mi: fa, sol, la, si. (In Duitsland en soms in Nederland heet de B ook H.)',
          show: [{ targets: 'F G A B', color: 'gold', label: 'name' }],
        },
        {
          type: 'find', range: 'C3 B4', targets: 'F', mode: 'all',
          text: 'Speel alle **{F}**\'s.',
          hint: 'De F ligt net links van een groepje van 3.',
        },
        { type: 'quiz', range: 'C3 B4', pool: 'F G A B', rounds: 8 },
        {
          type: 'find', range: 'C3 C5', targets: 'C4 D4 E4 F4 G4 A4 B4 C5', mode: 'ordered', names: 'c',
          text: 'Speel de witte toetsen van {C4} tot {C5} één voor één: C D E F G A B C.',
        },
      ],
    },
    {
      id: 'h1-l6', title: 'Alle witte toetsen benoemen', skills: ['orientatie'],
      steps: [
        {
          type: 'explain', range: 'C3 B4',
          text: 'De witte toetsen heten **C D E F G A B**, en dan begint het opnieuw. In do-re-mi: **do re mi fa sol la si**. Gebruik de zwarte groepjes als houvast: C-D-E rond de 2, F-G-A-B rond de 3.',
          show: [{ targets: 'C D E F G A B', color: 'gold', label: 'name' }],
        },
        { type: 'name', range: 'C3 B4', pool: 'C D E F G A B', rounds: 8 },
        { type: 'quiz', range: 'C3 B4', pool: 'C D E F G A B', rounds: 10 },
      ],
    },
    {
      id: 'h1-l7', title: 'Hoog en laag', skills: ['orientatie'],
      steps: [
        {
          type: 'explain', range: 'C3 B4', names: 'none',
          text: 'Naar **rechts** wordt het **hoger**, naar **links lager**. Elke noot komt in elk octaaf terug; het getal zegt welk octaaf. {A3} ligt net onder {C4}, {G4} net erboven.',
          show: [{ targets: 'A3 G4', color: 'gold', label: 'name+oct' }, { targets: 'C4', color: 'blue', label: 'name+oct' }],
        },
        {
          type: 'find', range: 'A0 C8', targets: 'A', mode: 'ordered',
          text: 'Speel alle **{A}**\'s van je piano, van laag naar hoog.',
          hint: 'De allerlaagste toets is al een A!',
        },
        { type: 'quiz', range: 'C3 B5', pool: 'C4 E4 G4 A3 F3 D5 B3 E5', rounds: 8, names: 'c' },
      ],
    },
    {
      id: 'h1-ex', title: 'Examen: het klavier', exam: true, skills: ['orientatie'],
      steps: [
        { type: 'quiz', range: 'C3 B4', pool: 'C D E F G A B', rounds: 10 },
        { type: 'name', range: 'C3 B4', pool: 'C D E F G A B', rounds: 6 },
        { type: 'quiz', range: 'C2 C6', pool: 'C4 C3 C5 G4 F3 A4', rounds: 6 },
      ],
    },
  ],
};
