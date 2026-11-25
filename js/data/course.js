// Cursusinhoud: hoofdstukken -> lessen -> stappen. Formaat en staptypes: zie README.md ("Lessen toevoegen").
// Tekst: **vet**, {C} = notennaam volgens de instelling (C of do), {C4} = met octaafnummer.

export default {
  chapters: [
    {
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
    },
    {
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
    },
  ],
};

// Hoofdstukken die in volgende fases gebouwd worden (enkel om te tonen in het cursusoverzicht).
export const UPCOMING = [
  'Rechterhand: 5 noten', 'Linkerhand: 5 noten', 'Handen afwisselend', 'Ritme',
  'Noten lezen 1 (vioolsleutel)', 'Handen samen', 'Noten lezen 2 (bassleutel)', 'Nieuwe posities',
  'Buiten de 5 vingers', 'Akkoorden', 'Begeleiden met LH', 'Toonladders en zwarte toetsen', 'Klassieke stukjes',
];
