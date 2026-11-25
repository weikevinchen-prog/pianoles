// Instaptest: per hoofdstuk een korte proef. Haal je de drempel, dan wordt dat hoofdstuk
// als "overgeslagen" vrijgegeven en gaat de test door met het volgende. Bij de eerste misser stopt hij.
// In fase 3 komen proeven voor de volgende hoofdstukken erbij.
export const THRESHOLD = 85; // % juist

export default [
  {
    chapter: 'h1',
    title: 'Het klavier',
    steps: [
      { type: 'quiz', range: 'C3 B4', pool: 'C D E F G A B', rounds: 6 },
      { type: 'quiz', range: 'C2 C6', pool: 'C4 G4 F3 A4', rounds: 4 },
      { type: 'name', range: 'C3 B4', pool: 'C D E F G A B', rounds: 4 },
    ],
  },
  {
    chapter: 'h2',
    title: 'Handen',
    steps: [
      { type: 'fingerplay', range: 'C3 C5', position: { lh: 'C3', rh: 'C4' }, rounds: 6 },
      {
        type: 'piece', bpm: 80, position: { rh: 'C4' }, phases: ['wait'],
        text: 'Speel dit stukje met de rechterhand in de C-positie.',
        rh: 'C4/1 D4/2 E4/3 C4/1 | E4/3 F4/4 G4/5:2 | G4/5 F4/4 E4/3 D4/2 | C4/1:4',
      },
    ],
  },
];
