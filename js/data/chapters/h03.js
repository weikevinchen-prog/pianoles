// Hoofdstuk 3: rechterhand in de C-positie. Formaat: zie README.md ("Lessen toevoegen").
const RH = { rh: 'C4' };

export default {
  id: 'h3',
  title: 'Rechterhand: 5 noten',
  intro: 'Melodietjes met de rechterhand in de C-positie: stapjes, sprongetjes en je eerste bekende liedjes.',
  lessons: [
    {
      id: 'h3-l1', title: 'Stapjes', skills: ['rh', 'c-positie'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: RH,
          text: 'Een **stap** is van een toets naar de buurtoets: {C} → {D}, met vinger 1 → 2. Melodieën bestaan vooral uit stapjes. Houd je duim op de centrale C en laat elke vinger boven zijn eigen toets hangen.',
        },
        {
          type: 'piece', bpm: 76, position: RH, text: 'Stapjes omhoog en omlaag.',
          rh: 'C4/1 D4/2 E4/3 D4/2 | C4/1 D4/2 E4/3:2 | E4/3 F4/4 G4/5 F4/4 | E4/3 D4/2 C4/1:2',
        },
        {
          type: 'piece', bpm: 80, position: RH, text: 'Nog een golfje: let op de vingernummers.',
          rh: 'E4/3 F4/4 G4/5 F4/4 | E4/3 D4/2 C4/1:2 | D4/2 E4/3 F4/4 E4/3 | D4/2 C4/1 D4/2:2 | C4/1:4',
        },
      ],
    },
    {
      id: 'h3-l2', title: 'Sprongetjes', skills: ['rh', 'c-positie'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: RH, show: [{ targets: 'C4 E4 G4', color: 'teal', label: 'name' }],
          text: 'Bij een **sprongetje** sla je een toets over: {C} → {E} (vinger 1 → 3) of {E} → {G} (3 → 5). Je hand blijft liggen, alleen de vingers bewegen.',
        },
        { type: 'find', range: 'C3 C5', names: 'c', position: RH, targets: 'C4 E4 G4 E4 C4', mode: 'ordered', text: 'Speel {C4} – {E4} – {G4} – {E4} – {C4}: vinger 1, 3, 5, 3, 1.' },
        {
          type: 'piece', bpm: 76, position: RH, text: 'Sprongen en stapjes door elkaar.',
          rh: 'C4/1 E4/3 G4/5:2 | G4/5 E4/3 C4/1:2 | D4/2 F4/4 E4/3 G4/5 | C4/1:4',
        },
      ],
    },
    {
      id: 'h3-l3', title: 'Mary had a little lamb', skills: ['rh', 'liedje'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: RH,
          text: 'Een bekend kinderliedje met **herhaalde noten**: dezelfde toets meerdere keren. Til je vinger telkens een beetje op, zodat elke noot opnieuw klinkt.',
        },
        {
          type: 'piece', bpm: 92, position: RH, text: 'Mary had a little lamb (traditioneel).',
          rh: 'E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3:2 | D4/2 D4/2 D4/2:2 | E4/3 G4/5 G4/5:2 | E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3 E4/3 | D4/2 D4/2 E4/3 D4/2 | C4/1:4',
        },
      ],
    },
    {
      id: 'h3-l4', title: 'Ode an die Freude', skills: ['rh', 'liedje'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: RH,
          text: 'Het beroemde thema uit de 9de symfonie van **Beethoven**. Het past helemaal in de C-positie. Let in maat 4 en 8 op het **puntje**: die noot duurt iets langer, de volgende is kort.',
        },
        {
          type: 'piece', bpm: 88, position: RH, text: 'Ode an die Freude (L. van Beethoven).',
          rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2',
        },
      ],
    },
    {
      id: 'h3-l5', title: 'Au clair de la lune', skills: ['rh', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 88, position: RH, text: 'Au clair de la lune (traditioneel, Frankrijk). Lange noten even laten klinken!',
          rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4 | C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4',
        },
      ],
    },
    {
      id: 'h3-ex', title: 'Examen: rechterhand', exam: true, skills: ['rh', 'c-positie'],
      steps: [
        { type: 'fingerplay', range: 'C3 C5', position: RH, rounds: 6 },
        {
          type: 'piece', bpm: 88, position: RH, phases: ['wait', 'tempo'], text: 'Een nieuw melodietje in de C-positie.',
          rh: 'G4/5 E4/3 E4/3:2 | F4/4 D4/2 D4/2:2 | C4/1 D4/2 E4/3 F4/4 | G4/5 G4/5 G4/5:2 | G4/5 E4/3 E4/3:2 | F4/4 D4/2 D4/2:2 | C4/1 E4/3 G4/5 G4/5 | C4/1:4',
        },
      ],
    },
  ],
};
