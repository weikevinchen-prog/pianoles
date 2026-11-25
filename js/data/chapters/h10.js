// Hoofdstuk 10: nieuwe posities (G-positie, middelste-C-positie) en van positie wisselen.
export default {
  id: 'h10',
  title: 'Nieuwe posities',
  intro: 'Liedjes in de G-positie, de middelste-C-positie (beide duimen op C4) en je hand verplaatsen tijdens het spelen.',
  lessons: [
    {
      id: 'h10-l1', title: 'Ode in de G-positie', skills: ['g-positie', 'handen-samen'],
      steps: [
        {
          type: 'explain', range: 'G2 G5', names: 'c', position: { lh: 'G2', rh: 'G4' },
          text: 'Dezelfde melodie kan je in een **andere positie** spelen: dat heet **transponeren**. Ode an die Freude in de G-positie begint op {B4} met vinger 3. Links speel je de basnoten {G2} en {D3}.',
        },
        {
          type: 'piece', bpm: 84, key: 'G', position: { lh: 'G2', rh: 'G4' }, view: 'both', text: 'Ode an die Freude in G.',
          rh: 'B4/3 B4/3 C5/4 D5/5 | D5/5 C5/4 B4/3 A4/2 | G4/1 G4/1 A4/2 B4/3 | B4/3:1.5 A4/2:.5 A4/2:2 | B4/3 B4/3 C5/4 D5/5 | D5/5 C5/4 B4/3 A4/2 | G4/1 G4/1 A4/2 B4/3 | A4/2:1.5 G4/1:.5 G4/1:2',
          lh: 'G2/5:4 | D3/1:4 | G2/5:4 | D3/1:4 | G2/5:4 | D3/1:4 | G2/5:2 B2/3:2 | D3/1:2 G2/5:2',
        },
      ],
    },
    {
      id: 'h10-l2', title: 'De middelste-C-positie', skills: ['middelste-c'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: { lh: 'F3', rh: 'C4' }, show: [{ targets: 'C4', color: 'gold', label: 'name' }],
          text: 'In de **middelste-C-positie** liggen **beide duimen op de centrale C**. Rechts: 1 = C, 2 = D … 5 = G. Links: 1 = C, 2 = B, 3 = A, 4 = G, 5 = F. De duimen delen de C: wie speelt hem, staat in de noten.',
        },
        { type: 'fingerplay', range: 'C3 C5', position: { lh: 'F3', rh: 'C4' }, rounds: 10 },
        {
          type: 'piece', bpm: 76, position: { lh: 'F3', rh: 'C4' }, view: 'both', text: 'De melodie gaat van rechts naar links over de centrale C.',
          rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:2 E4/3:2 | R:4 | R:4 | E4/3 D4/2 C4/1:2',
          lh: 'R:4 | R:4 | C4/1 B3/2 A3/3 G3/4 | F3/5:2 A3/3:2 | R:4',
        },
      ],
    },
    {
      id: 'h10-l3', title: 'Van positie wisselen', skills: ['positiewissel'],
      steps: [
        {
          type: 'explain', range: 'C4 C6', names: 'c', position: { rh: 'C4' },
          text: 'Soms moet je hand **verplaatsen**. Gebruik de **rust** om je hand al naar de nieuwe plek te brengen. Kijk naar het vingernummer van de eerste noot in de nieuwe positie: dan weet je waar je hand moet liggen.',
        },
        {
          type: 'piece', bpm: 76, position: { rh: 'C4' }, view: 'both', text: 'Van de C-positie naar de G-positie en terug.',
          rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:2 R:2 | G4/1 A4/2 B4/3 C5/4 | D5/5:2 R:2 | D5/5 C5/4 B4/3 A4/2 | G4/1:2 R:2 | G4/5 F4/4 E4/3 D4/2 | C4/1:4',
        },
      ],
    },
    {
      id: 'h10-l4', title: 'Vader Jacob', skills: ['positiewissel', 'liedje'],
      steps: [
        {
          type: 'explain', range: 'G3 C5', names: 'c', position: { lh: 'C3', rh: 'C4' },
          text: '**Vader Jacob** (traditioneel). In het derde deel strekt je hand zich even uit naar de {A4}. Op het einde speelt je **linkerduim** de lage {G3}.',
        },
        {
          type: 'piece', bpm: 92, position: { lh: 'C3', rh: 'C4' }, view: 'both', text: 'Vader Jacob.',
          rh: 'C4/1 D4/2 E4/3 C4/1 | C4/1 D4/2 E4/3 C4/1 | E4/3 F4/4 G4/5:2 | E4/3 F4/4 G4/5:2 | G4/4:.5 A4/5:.5 G4/4:.5 F4/3:.5 E4/2 C4/1 | G4/4:.5 A4/5:.5 G4/4:.5 F4/3:.5 E4/2 C4/1 | C4/1 R C4/1:2 | C4/1 R C4/1:2',
          lh: 'R:4 | R:4 | R:4 | R:4 | R:4 | R:4 | R G3/1 R:2 | R G3/1 R:2',
        },
      ],
    },
    {
      id: 'h10-ex', title: 'Examen: posities', exam: true, skills: ['g-positie', 'middelste-c', 'positiewissel'],
      steps: [
        { type: 'fingerplay', range: 'C3 C5', position: { lh: 'F3', rh: 'C4' }, rounds: 6 },
        {
          type: 'piece', bpm: 80, key: 'G', position: { lh: 'G2', rh: 'G4' }, view: 'both', phases: ['wait', 'tempo'], text: 'In de G-positie.',
          rh: 'G4/1 B4/3 A4/2 C5/4 | B4/3 D5/5 D5/5:2 | C5/4 A4/2 B4/3 G4/1 | A4/2 A4/2 G4/1:2',
          lh: 'G2/5:4 | G2/5:4 | D3/1:4 | D3/1:2 G2/5:2',
        },
      ],
    },
  ],
};
