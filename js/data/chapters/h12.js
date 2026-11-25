// Hoofdstuk 12: akkoorden C, F, G en Am.
const C_LH = '[C3/5 E3/3 G3/1]', F_LH = '[F2/5 A2/3 C3/1]', G_LH = '[G2/5 B2/3 D3/1]', AM_LH = '[A2/5 C3/3 E3/1]';
const C_RH = '[C4/1 E4/3 G4/5]', F_RH = '[C4/1 F4/4 A4/5]', G_RH = '[B3/1 D4/2 G4/5]', AM_RH = '[C4/1 E4/3 A4/5]';

export default {
  id: 'h12',
  title: 'Akkoorden',
  intro: 'Drie of meer noten tegelijk: de akkoorden C, F, G en a-mineur, en vlot wisselen.',
  lessons: [
    {
      id: 'h12-l1', title: 'Het C-akkoord', skills: ['akkoorden'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: { rh: 'C4' }, show: [{ targets: 'C4 E4 G4', color: 'teal', label: 'name' }],
          text: 'Een **akkoord** is meerdere noten tegelijk. Het **C-akkoord** bestaat uit **{C} – {E} – {G}**: telkens een toets overslaan. Rechts met vinger 1-3-5. Druk de drie toetsen **precies tegelijk** in.',
        },
        {
          type: 'piece', bpm: 72, position: { rh: 'C4' }, view: 'both', text: 'C-akkoord met rechts: eerst samen, dan gebroken (na elkaar).',
          rh: `${C_RH}:4 | ${C_RH}:2 ${C_RH}:2 | C4/1 E4/3 G4/5 E4/3 | ${C_RH}:4`,
        },
        {
          type: 'piece', bpm: 72, position: { lh: 'C3' }, view: 'both', text: 'En met links: vinger 5-3-1.',
          lh: `${C_LH}:4 | ${C_LH}:2 ${C_LH}:2 | C3/5 E3/3 G3/1 E3/3 | ${C_LH}:4`,
        },
      ],
    },
    {
      id: 'h12-l2', title: 'F en G', skills: ['akkoorden'],
      steps: [
        {
          type: 'explain', range: 'F2 C4', names: 'c', show: [{ targets: 'F2 A2 C3', color: 'coral', label: 'name' }, { targets: 'G3 B3 D4', color: 'teal', label: 'name' }],
          text: 'Het **F-akkoord** is **F – A – C**, het **G-akkoord** is **G – B – D**. Zelfde vorm als C (toets – overslaan – toets – overslaan – toets), alleen op een andere plek.',
        },
        {
          type: 'piece', bpm: 66, position: { lh: 'C3' }, view: 'both', text: 'Links: C – F – G – C. Verplaats je hand tijdens de laatste tel.',
          lh: `${C_LH}:4 | ${F_LH}:4 | ${G_LH}:4 | ${C_LH}:4`,
        },
      ],
    },
    {
      id: 'h12-l3', title: 'a-mineur', skills: ['akkoorden'],
      steps: [
        {
          type: 'explain', range: 'F2 C4', names: 'c', show: [{ targets: 'A2 C3 E3', color: 'coral', label: 'name' }],
          text: 'Het **a-mineurakkoord (Am)** is **A – C – E**. Mineur klinkt droeviger dan majeur. Luister naar het verschil tussen C en Am: er verandert maar één noot!',
        },
        {
          type: 'piece', bpm: 66, position: { lh: 'C3' }, view: 'both', text: 'De bekendste akkoordreeks: C – Am – F – G – C.',
          lh: `${C_LH}:4 | ${AM_LH}:4 | ${F_LH}:4 | ${G_LH}:4 | ${C_LH}:4`,
        },
      ],
    },
    {
      id: 'h12-l4', title: 'Akkoorden dicht bij elkaar', skills: ['akkoorden', 'omkeringen'],
      steps: [
        {
          type: 'explain', range: 'G3 C5', names: 'c', position: { rh: 'C4' },
          text: 'Rechts kan je de akkoorden **dicht bij de C-positie** houden. Dan verschuiven maar één of twee vingers: C = C-E-G, F = C-F-A, G = B-D-G. Die vorm heet een **omkering**: dezelfde noten in een andere volgorde.',
        },
        {
          type: 'piece', bpm: 72, position: { lh: 'C3', rh: 'C4' }, view: 'both', text: 'Rechts akkoorden, links de basnoot.',
          rh: `${C_RH}:4 | ${F_RH}:4 | ${G_RH}:4 | ${C_RH}:4 | ${AM_RH}:4 | ${F_RH}:4 | ${G_RH}:4 | ${C_RH}:4`,
          lh: 'C3/5:4 | F3/2:4 | G3/1:4 | C3/5:4 | A2/5:4 | F2/5:4 | G2/5:4 | C3/5:4',
        },
      ],
    },
    {
      id: 'h12-l5', title: 'Omkeringen', skills: ['omkeringen'],
      steps: [
        {
          type: 'explain', range: 'C4 C6', names: 'c', show: [{ targets: 'C4 E4 G4', color: 'teal' }, { targets: 'C5 E5', color: 'blue' }],
          text: 'Je kunt het C-akkoord **op drie manieren** spelen: **C-E-G** (grondligging), **E-G-C** (1ste omkering) en **G-C-E** (2de omkering). Het blijft een C-akkoord.',
        },
        {
          type: 'piece', bpm: 66, position: { rh: 'C4' }, view: 'both', text: 'Het C-akkoord omhoog en omlaag in omkeringen.',
          rh: '[C4/1 E4/3 G4/5]:2 [E4/1 G4/2 C5/5]:2 | [G4/1 C5/3 E5/5]:4 | [E4/1 G4/2 C5/5]:2 [C4/1 E4/3 G4/5]:2 | [C4/1 E4/3 G4/5]:4',
        },
      ],
    },
    {
      id: 'h12-ex', title: 'Examen: akkoorden', exam: true, skills: ['akkoorden'],
      steps: [
        {
          type: 'piece', bpm: 72, position: { lh: 'C3', rh: 'C4' }, view: 'both', phases: ['wait', 'tempo'], text: 'Akkoorden met twee handen.',
          rh: `${C_RH}:2 ${C_RH}:2 | ${AM_RH}:4 | ${F_RH}:2 ${G_RH}:2 | ${C_RH}:4`,
          lh: 'C3/5:4 | A2/5:4 | F2/5:2 G2/5:2 | C3/5:4',
        },
      ],
    },
  ],
};
