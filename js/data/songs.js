// Liedjesbibliotheek. Alleen publiek domein (traditionals, kinderliedjes, klassiek).
// Formaat: zie README.md ("Liedjes toevoegen"). In fase 5 wordt deze lijst uitgebreid tot 25+ liedjes.
export default [
  {
    id: 'toonladder-c', title: 'Toonladder C', composer: 'Oefening', level: 1, bpm: 80, meter: [4, 4],
    versions: { melody: { rh: 'C4/1 D4/2 E4/3 F4/1 G4/2 A4/3 B4/4 C5/5:2 B4/4 A4/3 G4/2 F4/1 E4/3 D4/2 C4/1:2' } },
  },
  {
    id: 'kortjakje', title: 'Altijd is Kortjakje ziek', composer: 'Traditioneel', level: 1, bpm: 90, meter: [4, 4],
    versions: { melody: { rh: 'C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2 | G4 G4 F4 F4 | E4 E4 D4:2 | G4 G4 F4 F4 | E4 E4 D4:2 | C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2' } },
  },
  {
    id: 'vader-jacob', title: 'Vader Jacob', composer: 'Traditioneel', level: 1, bpm: 100, meter: [4, 4],
    versions: { melody: { rh: 'C4 D4 E4 C4 | C4 D4 E4 C4 | E4 F4 G4:2 | E4 F4 G4:2 | G4:.5 A4:.5 G4:.5 F4:.5 E4 C4 | G4:.5 A4:.5 G4:.5 F4:.5 E4 C4 | C4 G3 C4:2 | C4 G3 C4:2' } },
  },
  {
    id: 'mary', title: 'Mary had a little lamb', composer: 'Traditioneel', level: 1, bpm: 100, meter: [4, 4],
    versions: { melody: { rh: 'E4 D4 C4 D4 | E4 E4 E4:2 | D4 D4 D4:2 | E4 G4 G4:2 | E4 D4 C4 D4 | E4 E4 E4 E4 | D4 D4 E4 D4 | C4:4' } },
  },
  {
    id: 'ode', title: 'Ode an die Freude', composer: 'L. van Beethoven', level: 1, bpm: 100, meter: [4, 4],
    versions: { melody: { rh: 'E4 E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | E4:1.5 D4:.5 D4:2 | E4 E4 F4 G4 | G4 F4 E4 D4 | C4 C4 D4 E4 | D4:1.5 C4:.5 C4:2' } },
  },
  {
    id: 'fur-elise', title: 'Für Elise (begin)', composer: 'L. van Beethoven', level: 2, bpm: 150, meter: [3, 8],
    versions: { melody: { rh: 'E5 D#5 E5 D#5 E5 B4 D5 C5 A4:2 R C4 E4 A4 B4:2 R E4 G#4 B4 C5:2 R E4 E5 D#5 E5 D#5 E5 B4 D5 C5 A4:2 R C4 E4 A4 B4:2 R E4 C5 B4 A4:3' } },
  },
];
