// Hoofdstuk 6: ritme. Ritmeoefeningen gebruiken anyKey (elke toets telt, alleen de timing) en de metronoom.
const RH = { rh: 'C4' };

export default {
  id: 'h6',
  title: 'Ritme',
  intro: 'Kwart-, halve en hele noten, rusten, de 3/4-maat, achtsten en het puntje. Met metronoom.',
  lessons: [
    {
      id: 'h6-l1', title: 'Kwart- en halve noten', skills: ['ritme'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c',
          staff: { clef: 'treble', notes: 'C4 C4 C4 C4' },
          text: 'Muziek heeft een **tel**, zoals een hartslag. Een **kwartnoot** (zwart bolletje met stok) duurt **1 tel**. Een **halve noot** (wit bolletje met stok) duurt **2 tellen**. De metronoom tikt de tellen; de eerste tel van elke maat klinkt hoger.',
        },
        {
          type: 'piece', bpm: 72, anyKey: true, metronome: true, phases: ['demo', 'tempo'], position: RH, view: 'both',
          text: 'Speel mee op één toets (eender welke). Tel hardop: 1-2-3-4.',
          rh: 'C4/1 C4/1 C4/1 C4/1 | C4/1:2 C4/1:2 | C4/1 C4/1 C4/1:2 | C4/1:2 C4/1 C4/1',
        },
      ],
    },
    {
      id: 'h6-l2', title: 'Hele noten', skills: ['ritme'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', staff: { clef: 'treble', notes: 'C4' },
          text: 'Een **hele noot** (wit bolletje zonder stok) duurt **4 tellen**: een volle maat. Blijf de toets vasthouden terwijl je verder telt.',
        },
        {
          type: 'piece', bpm: 76, anyKey: true, metronome: true, phases: ['demo', 'tempo'], position: RH, view: 'both',
          text: 'Hele, halve en kwartnoten door elkaar.',
          rh: 'C4/1:4 | C4/1:2 C4/1:2 | C4/1 C4/1 C4/1 C4/1 | C4/1:4 | C4/1:2 C4/1 C4/1 | C4/1:4',
        },
        {
          type: 'piece', bpm: 76, metronome: true, position: RH, view: 'both', text: 'Nu met echte noten: een melodie met lange noten.',
          rh: 'C4/1:2 E4/3:2 | G4/5:4 | F4/4 E4/3 D4/2 E4/3 | C4/1:4',
        },
      ],
    },
    {
      id: 'h6-l3', title: 'Rusten', skills: ['ritme'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c',
          text: 'Een **rust** is een stilte die je ook telt. Een kwartrust duurt 1 tel, een halve rust 2 tellen. Laat de toets los tijdens de rust, maar blijf tellen!',
        },
        {
          type: 'piece', bpm: 76, anyKey: true, metronome: true, phases: ['demo', 'tempo'], position: RH, view: 'both',
          text: 'Speel op de noten, zwijg op de rusten.',
          rh: 'C4/1 R C4/1 R | C4/1 C4/1 R:2 | R C4/1 R C4/1 | C4/1:2 R:2',
        },
        {
          type: 'piece', bpm: 80, metronome: true, position: RH, view: 'both', text: 'Een melodie met rusten.',
          rh: 'E4/3 D4/2 C4/1 R | E4/3 D4/2 C4/1 R | G4/5 F4/4 E4/3 D4/2 | C4/1:2 R:2',
        },
      ],
    },
    {
      id: 'h6-l4', title: 'De 3/4-maat', skills: ['ritme'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c',
          text: 'In een **3/4-maat** zijn er **3 tellen** per maat: 1-2-3, 1-2-3. Zo klinkt een wals. Een **halve noot met puntje** duurt 3 tellen: een hele maat.',
        },
        {
          type: 'piece', bpm: 92, meter: [3, 4], anyKey: true, metronome: true, phases: ['demo', 'tempo'], position: RH, view: 'both',
          text: 'Tel 1-2-3 en speel mee.',
          rh: 'C4/1 C4/1 C4/1 | C4/1:2 C4/1 | C4/1:3 | C4/1 C4/1:2 | C4/1:3',
        },
        {
          type: 'piece', bpm: 100, meter: [3, 4], metronome: true, position: RH, view: 'both', text: 'Een walsje in de C-positie.',
          rh: 'C4/1:2 E4/3 | G4/5:2 E4/3 | F4/4:2 D4/2 | E4/3:3 | D4/2:2 F4/4 | E4/3:2 D4/2 | C4/1:3',
        },
      ],
    },
    {
      id: 'h6-l5', title: 'Achtste noten', skills: ['ritme'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', staff: { clef: 'treble', notes: 'C4 D4 E4 F4' },
          text: 'Een **achtste noot** duurt een **halve tel**: twee achtsten passen in één tel. Je telt: **1-en-2-en-3-en-4-en**. Twee achtsten naast elkaar worden met een balk verbonden.',
        },
        {
          type: 'piece', bpm: 72, anyKey: true, metronome: true, phases: ['demo', 'tempo'], position: RH, view: 'both',
          text: 'Achtsten: twee noten per tik.',
          rh: 'C4/1 C4/1 C4/1:.5 C4/1:.5 C4/1 | C4/1:.5 C4/1:.5 C4/1:.5 C4/1:.5 C4/1:2 | C4/1 C4/1:.5 C4/1:.5 C4/1 C4/1:.5 C4/1:.5 | C4/1:4',
        },
        {
          type: 'piece', bpm: 76, metronome: true, position: RH, view: 'both', text: 'Achtsten in een melodie.',
          rh: 'C4/1:.5 D4/2:.5 E4/3:.5 F4/4:.5 G4/5:2 | G4/5:.5 F4/4:.5 E4/3:.5 D4/2:.5 C4/1:2 | E4/3 E4/3:.5 F4/4:.5 G4/5 E4/3 | D4/2:.5 E4/3:.5 D4/2:.5 C4/1:.5 C4/1:2',
        },
      ],
    },
    {
      id: 'h6-l6', title: 'Het puntje', skills: ['ritme'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c',
          text: 'Een **puntje** achter een noot maakt ze **anderhalve keer zo lang**. Een kwartnoot met puntje duurt 1½ tel; meestal volgt er dan een korte achtste. Dat ken je al: *E – D – D* op het einde van Ode an die Freude!',
        },
        {
          type: 'piece', bpm: 72, anyKey: true, metronome: true, phases: ['demo', 'tempo'], position: RH, view: 'both',
          text: 'Lang – kort – lang.',
          rh: 'C4/1:1.5 C4/1:.5 C4/1:2 | C4/1:1.5 C4/1:.5 C4/1 C4/1 | C4/1 C4/1 C4/1:1.5 C4/1:.5 | C4/1:4',
        },
        {
          type: 'piece', bpm: 88, metronome: true, position: RH, view: 'both', text: 'Ode an die Freude, nu op tempo met metronoom.',
          rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2',
        },
      ],
    },
    {
      id: 'h6-ex', title: 'Examen: ritme', exam: true, skills: ['ritme'],
      steps: [
        {
          type: 'piece', bpm: 80, anyKey: true, metronome: true, phases: ['demo', 'tempo'], position: RH, view: 'both',
          text: 'Speel dit ritme op één toets.',
          rh: 'C4/1 C4/1:.5 C4/1:.5 C4/1:2 | C4/1:1.5 C4/1:.5 C4/1 R | C4/1:.5 C4/1:.5 C4/1:.5 C4/1:.5 C4/1 C4/1 | C4/1:4',
        },
        {
          type: 'piece', bpm: 96, meter: [3, 4], metronome: true, phases: ['wait', 'tempo'], position: RH, view: 'both', text: 'En een walsje.',
          rh: 'E4/3:2 G4/5 | F4/4:2 D4/2 | E4/3 F4/4 E4/3 | D4/2:3 | E4/3:2 G4/5 | F4/4:2 D4/2 | D4/2 E4/3 D4/2 | C4/1:3',
        },
      ],
    },
  ],
};
