// Liedjesbibliotheek. Alleen publiek domein (traditionals, kinderliedjes, klassiek).
// Formaat: zie README.md ("Liedjes toevoegen").
//   level 1 = beginner, 2 = gemiddeld, 3 = gevorderd
//   versions.melody = alleen melodie (RH), versions.easy = eenvoudig met LH, versions.full = volledig (waar het kan)
// De klassieke stukken uit hoofdstuk 15 worden hier hergebruikt (één bron).
import h15 from './chapters/h15.js';

const lessonPiece = id => {
  const s = h15.lessons.find(l => l.id === id).steps.find(st => st.type === 'piece');
  return { rh: s.rh, lh: s.lh };
};
const C = '[C3 E3 G3]', F = '[C3 F3 A3]', G = '[B2 D3 G3]';

export default [
  // ---------------- beginner ----------------
  {
    id: 'toonladder-c', title: 'Toonladder C', composer: 'Oefening', level: 1, bpm: 80, meter: [4, 4],
    versions: {
      melody: { rh: 'C4/1 D4/2 E4/3 F4/1 | G4/2 A4/3 B4/4 C5/5 | C5/5 B4/4 A4/3 G4/2 | F4/1 E4/3 D4/2 C4/1' },
      easy: { rh: 'C4/1 D4/2 E4/3 F4/1 | G4/2 A4/3 B4/4 C5/5 | C5/5 B4/4 A4/3 G4/2 | F4/1 E4/3 D4/2 C4/1', lh: 'C3/5:4 | G3/1:4 | C3/5:4 | G2/5:2 C3/5:2' },
    },
  },
  {
    id: 'kortjakje', title: 'Altijd is Kortjakje ziek', composer: 'Traditioneel', level: 1, bpm: 90, meter: [4, 4],
    versions: {
      melody: { rh: 'C4/1 C4/1 G4/4 G4/4 | A4/5 A4/5 G4/4:2 | F4/4 F4/4 E4/3 E4/3 | D4/2 D4/2 C4/1:2 | G4/5 G4/5 F4/4 F4/4 | E4/3 E4/3 D4/2:2 | G4/5 G4/5 F4/4 F4/4 | E4/3 E4/3 D4/2:2 | C4/1 C4/1 G4/4 G4/4 | A4/5 A4/5 G4/4:2 | F4/4 F4/4 E4/3 E4/3 | D4/2 D4/2 C4/1:2' },
      easy: {
        rh: 'C4/1 C4/1 G4/4 G4/4 | A4/5 A4/5 G4/4:2 | F4/4 F4/4 E4/3 E4/3 | D4/2 D4/2 C4/1:2 | G4/5 G4/5 F4/4 F4/4 | E4/3 E4/3 D4/2:2 | G4/5 G4/5 F4/4 F4/4 | E4/3 E4/3 D4/2:2 | C4/1 C4/1 G4/4 G4/4 | A4/5 A4/5 G4/4:2 | F4/4 F4/4 E4/3 E4/3 | D4/2 D4/2 C4/1:2',
        lh: 'C3/5:4 | F3/2:2 C3/5:2 | F3/2:2 C3/5:2 | G3/1:2 C3/5:2 | C3/5:2 G3/1:2 | C3/5:2 G3/1:2 | C3/5:2 G3/1:2 | C3/5:2 G3/1:2 | C3/5:4 | F3/2:2 C3/5:2 | F3/2:2 C3/5:2 | G3/1:2 C3/5:2',
      },
      full: {
        rh: 'C4/1 C4/1 G4/4 G4/4 | A4/5 A4/5 G4/4:2 | F4/4 F4/4 E4/3 E4/3 | D4/2 D4/2 C4/1:2 | G4/5 G4/5 F4/4 F4/4 | E4/3 E4/3 D4/2:2 | G4/5 G4/5 F4/4 F4/4 | E4/3 E4/3 D4/2:2 | C4/1 C4/1 G4/4 G4/4 | A4/5 A4/5 G4/4:2 | F4/4 F4/4 E4/3 E4/3 | D4/2 D4/2 C4/1:2',
        lh: `${C}:4 | ${F}:2 ${C}:2 | ${F}:2 ${C}:2 | ${G}:2 ${C}:2 | ${C}:2 ${G}:2 | ${C}:2 ${G}:2 | ${C}:2 ${G}:2 | ${C}:2 ${G}:2 | ${C}:4 | ${F}:2 ${C}:2 | ${F}:2 ${C}:2 | ${G}:2 ${C}:2`,
      },
    },
  },
  {
    id: 'vader-jacob', title: 'Vader Jacob', composer: 'Traditioneel', level: 1, bpm: 100, meter: [4, 4],
    versions: {
      melody: { rh: 'C4/1 D4/2 E4/3 C4/1 | C4/1 D4/2 E4/3 C4/1 | E4/3 F4/4 G4/5:2 | E4/3 F4/4 G4/5:2 | G4/4:.5 A4/5:.5 G4/4:.5 F4/3:.5 E4/2 C4/1 | G4/4:.5 A4/5:.5 G4/4:.5 F4/3:.5 E4/2 C4/1 | C4/2 G3/1 C4/2:2 | C4/2 G3/1 C4/2:2' },
      easy: {
        rh: 'C4/1 D4/2 E4/3 C4/1 | C4/1 D4/2 E4/3 C4/1 | E4/3 F4/4 G4/5:2 | E4/3 F4/4 G4/5:2 | G4/4:.5 A4/5:.5 G4/4:.5 F4/3:.5 E4/2 C4/1 | G4/4:.5 A4/5:.5 G4/4:.5 F4/3:.5 E4/2 C4/1 | C4/2 G3/1 C4/2:2 | C4/2 G3/1 C4/2:2',
        lh: 'C3:4 | C3:4 | C3:4 | C3:4 | C3:4 | C3:4 | C3:4 | C3:4',
      },
    },
  },
  {
    id: 'mary', title: 'Mary had a little lamb', composer: 'Traditioneel', level: 1, bpm: 100, meter: [4, 4],
    versions: {
      melody: { rh: 'E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3:2 | D4/2 D4/2 D4/2:2 | E4/3 G4/5 G4/5:2 | E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3 E4/3 | D4/2 D4/2 E4/3 D4/2 | C4/1:4' },
      easy: { rh: 'E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3:2 | D4/2 D4/2 D4/2:2 | E4/3 G4/5 G4/5:2 | E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3 E4/3 | D4/2 D4/2 E4/3 D4/2 | C4/1:4', lh: 'C3/5:4 | C3/5:4 | G2/5:4 | C3/5:4 | C3/5:4 | C3/5:4 | G2/5:4 | C3/5:4' },
      full: { rh: 'E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3:2 | D4/2 D4/2 D4/2:2 | E4/3 G4/5 G4/5:2 | E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3 E4/3 | D4/2 D4/2 E4/3 D4/2 | C4/1:4', lh: `${C}:4 | ${C}:4 | ${G}:4 | ${C}:4 | ${C}:4 | ${C}:4 | ${G}:4 | ${C}:4` },
    },
  },
  {
    id: 'ode', title: 'Ode an die Freude', composer: 'L. van Beethoven', level: 1, bpm: 100, meter: [4, 4],
    versions: {
      melody: { rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2' },
      easy: {
        rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2',
        lh: 'C3/5:4 | G3/1:4 | C3/5:4 | G3/1:4 | C3/5:4 | G3/1:4 | C3/5:2 E3/3:2 | G3/1:2 C3/5:2',
      },
      full: {
        rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2',
        lh: `${C}:4 | ${G}:4 | ${C}:4 | ${G}:4 | ${C}:4 | ${G}:4 | ${C}:4 | ${G}:2 ${C}:2`,
      },
    },
  },
  {
    id: 'au-clair', title: 'Au clair de la lune', composer: 'Traditioneel (Frankrijk)', level: 1, bpm: 90, meter: [4, 4],
    versions: {
      melody: { rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4 | C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4' },
      easy: { rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4 | C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4', lh: 'C3/5:4 | C3/5:2 G2/5:2 | C3/5:2 G2/5:2 | C3/5:4 | C3/5:4 | C3/5:2 G2/5:2 | C3/5:2 G2/5:2 | C3/5:4' },
      full: { rh: 'C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4 | C4/1 C4/1 C4/1 D4/2 | E4/3:2 D4/2:2 | C4/1 E4/3 D4/2 D4/2 | C4/1:4', lh: `${C}:4 | ${C}:2 ${G}:2 | ${C}:2 ${G}:2 | ${C}:4 | ${C}:4 | ${C}:2 ${G}:2 | ${C}:2 ${G}:2 | ${C}:4` },
    },
  },
  {
    id: 'hot-cross-buns', title: 'Hot Cross Buns', composer: 'Traditioneel (Engeland)', level: 1, bpm: 100, meter: [4, 4],
    versions: {
      melody: { rh: 'E4/3 D4/2 C4/1:2 | E4/3 D4/2 C4/1:2 | C4/1:.5 C4/1:.5 C4/1:.5 C4/1:.5 D4/2:.5 D4/2:.5 D4/2:.5 D4/2:.5 | E4/3 D4/2 C4/1:2' },
      easy: { rh: 'E4/3 D4/2 C4/1:2 | E4/3 D4/2 C4/1:2 | C4/1:.5 C4/1:.5 C4/1:.5 C4/1:.5 D4/2:.5 D4/2:.5 D4/2:.5 D4/2:.5 | E4/3 D4/2 C4/1:2', lh: 'C3/5:4 | C3/5:4 | C3/5:2 G2/5:2 | C3/5:4' },
      full: { rh: 'E4/3 D4/2 C4/1:2 | E4/3 D4/2 C4/1:2 | C4/1:.5 C4/1:.5 C4/1:.5 C4/1:.5 D4/2:.5 D4/2:.5 D4/2:.5 D4/2:.5 | E4/3 D4/2 C4/1:2', lh: `${C}:4 | ${C}:4 | ${C}:2 ${G}:2 | ${C}:4` },
    },
  },
  {
    id: 'jingle-bells', title: 'Jingle Bells (refrein)', composer: 'J. Pierpont', level: 1, bpm: 112, meter: [4, 4],
    versions: {
      melody: { rh: 'E4/3 E4/3 E4/3:2 | E4/3 E4/3 E4/3:2 | E4/3 G4/5 C4/1:1.5 D4/2:.5 | E4/3:4 | F4/4 F4/4 F4/4:1.5 F4/4:.5 | F4/4 E4/3 E4/3 E4/3:.5 E4/3:.5 | E4/3 D4/2 D4/2 E4/3 | D4/2:2 G4/5:2 | E4/3 E4/3 E4/3:2 | E4/3 E4/3 E4/3:2 | E4/3 G4/5 C4/1:1.5 D4/2:.5 | E4/3:4 | F4/4 F4/4 F4/4 F4/4 | F4/4 E4/3 E4/3 E4/3:.5 E4/3:.5 | G4/5 G4/5 F4/4 D4/2 | C4/1:4' },
      easy: {
        rh: 'E4/3 E4/3 E4/3:2 | E4/3 E4/3 E4/3:2 | E4/3 G4/5 C4/1:1.5 D4/2:.5 | E4/3:4 | F4/4 F4/4 F4/4:1.5 F4/4:.5 | F4/4 E4/3 E4/3 E4/3:.5 E4/3:.5 | E4/3 D4/2 D4/2 E4/3 | D4/2:2 G4/5:2 | E4/3 E4/3 E4/3:2 | E4/3 E4/3 E4/3:2 | E4/3 G4/5 C4/1:1.5 D4/2:.5 | E4/3:4 | F4/4 F4/4 F4/4 F4/4 | F4/4 E4/3 E4/3 E4/3:.5 E4/3:.5 | G4/5 G4/5 F4/4 D4/2 | C4/1:4',
        lh: 'C3/5:4 | C3/5:4 | C3/5:4 | C3/5:4 | F3/2:4 | C3/5:4 | G2/5:4 | G2/5:4 | C3/5:4 | C3/5:4 | C3/5:4 | C3/5:4 | F3/2:4 | C3/5:4 | G2/5:4 | C3/5:4',
      },
      full: {
        rh: 'E4/3 E4/3 E4/3:2 | E4/3 E4/3 E4/3:2 | E4/3 G4/5 C4/1:1.5 D4/2:.5 | E4/3:4 | F4/4 F4/4 F4/4:1.5 F4/4:.5 | F4/4 E4/3 E4/3 E4/3:.5 E4/3:.5 | E4/3 D4/2 D4/2 E4/3 | D4/2:2 G4/5:2 | E4/3 E4/3 E4/3:2 | E4/3 E4/3 E4/3:2 | E4/3 G4/5 C4/1:1.5 D4/2:.5 | E4/3:4 | F4/4 F4/4 F4/4 F4/4 | F4/4 E4/3 E4/3 E4/3:.5 E4/3:.5 | G4/5 G4/5 F4/4 D4/2 | C4/1:4',
        lh: `${C}:4 | ${C}:4 | ${C}:4 | ${C}:4 | ${F}:4 | ${C}:4 | ${G}:4 | ${G}:4 | ${C}:4 | ${C}:4 | ${C}:4 | ${C}:4 | ${F}:4 | ${C}:4 | ${G}:4 | ${C}:4`,
      },
    },
  },
  {
    id: 'alle-eendjes', title: 'Alle eendjes zwemmen in het water', composer: 'Traditioneel', level: 1, bpm: 96, meter: [4, 4],
    versions: {
      melody: { rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:2 G4/5:2 | A4/5 A4/5 A4/5 A4/5 | G4/4:4 | A4/5 A4/5 A4/5 A4/5 | G4/4:4 | F4/4 F4/4 F4/4 F4/4 | E4/3:2 E4/3:2 | D4/2 D4/2 D4/2 D4/2 | C4/1:4' },
      easy: { rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:2 G4/5:2 | A4/5 A4/5 A4/5 A4/5 | G4/4:4 | A4/5 A4/5 A4/5 A4/5 | G4/4:4 | F4/4 F4/4 F4/4 F4/4 | E4/3:2 E4/3:2 | D4/2 D4/2 D4/2 D4/2 | C4/1:4', lh: 'C3:4 | C3:4 | F3:4 | C3:4 | F3:4 | C3:4 | G2:4 | C3:4 | G2:4 | C3:4' },
    },
  },
  {
    id: 'london-bridge', title: 'London Bridge', composer: 'Traditioneel (Engeland)', level: 1, bpm: 100, meter: [4, 4],
    versions: {
      melody: { rh: 'G4/4:1.5 A4/5:.5 G4/4 F4/3 | E4/2 F4/3 G4/4:2 | D4/1 E4/2 F4/3:2 | E4/2 F4/3 G4/4:2 | G4/4:1.5 A4/5:.5 G4/4 F4/3 | E4/2 F4/3 G4/4:2 | D4/2:2 G4/5:2 | E4/3 C4/1:3' },
      easy: { rh: 'G4/4:1.5 A4/5:.5 G4/4 F4/3 | E4/2 F4/3 G4/4:2 | D4/1 E4/2 F4/3:2 | E4/2 F4/3 G4/4:2 | G4/4:1.5 A4/5:.5 G4/4 F4/3 | E4/2 F4/3 G4/4:2 | D4/2:2 G4/5:2 | E4/3 C4/1:3', lh: 'C3:4 | C3:4 | G2:4 | C3:4 | C3:4 | C3:4 | G2:4 | C3:4' },
    },
  },
  {
    id: 'row-your-boat', title: 'Row, row, row your boat', composer: 'Traditioneel', level: 1, bpm: 160, meter: [6, 8],
    versions: {
      melody: { rh: 'C4/1:3 C4/1:3 | C4/1:2 D4/2 E4/3:3 | E4/3:2 D4/2 E4/3:2 F4/4 | G4/5:6 | C5/5 C5/5 C5/5 G4/2 G4/2 G4/2 | E4/3 E4/3 E4/3 C4/1 C4/1 C4/1 | G4/5:2 F4/4 E4/3:2 D4/2 | C4/1:6' },
      easy: { rh: 'C4/1:3 C4/1:3 | C4/1:2 D4/2 E4/3:3 | E4/3:2 D4/2 E4/3:2 F4/4 | G4/5:6 | C5/5 C5/5 C5/5 G4/2 G4/2 G4/2 | E4/3 E4/3 E4/3 C4/1 C4/1 C4/1 | G4/5:2 F4/4 E4/3:2 D4/2 | C4/1:6', lh: 'C3:6 | C3:6 | C3:6 | C3:6 | C3:6 | C3:6 | G2:6 | C3:6' },
    },
  },
  {
    id: 'westminster', title: 'Westminster-klokken', composer: 'Traditioneel (Big Ben)', level: 1, bpm: 84, meter: [3, 4],
    versions: {
      melody: { rh: 'E4/5 C4/3 D4/4 | G3/1:3 | G3/1 D4/4 E4/5 | C4/3:3 | E4/5 D4/4 C4/3 | G3/1:3 | G3/1 D4/4 E4/5 | C4/3:3' },
      easy: { rh: 'E4/5 C4/3 D4/4 | G3/1:3 | G3/1 D4/4 E4/5 | C4/3:3 | E4/5 D4/4 C4/3 | G3/1:3 | G3/1 D4/4 E4/5 | C4/3:3', lh: 'C3:3 | G2:3 | G2:3 | C3:3 | C3:3 | G2:3 | G2:3 | C3:3' },
    },
  },

  // ---------------- gemiddeld ----------------
  {
    id: 'ode-volledig', title: 'Ode an die Freude (volledig)', composer: 'L. van Beethoven', level: 2, bpm: 96, meter: [4, 4],
    versions: { melody: { rh: lessonPiece('h15-l1').rh }, easy: lessonPiece('h15-l1') },
  },
  {
    id: 'amazing-grace', title: 'Amazing Grace', composer: 'Traditioneel (J. Newton)', level: 2, bpm: 80, meter: [3, 4], pickup: 1, key: 'G',
    versions: {
      melody: { rh: 'D4 | G4:2 B4:.5 G4:.5 | B4:2 A4 | G4:2 E4 | D4:2 D4 | G4:2 B4:.5 G4:.5 | B4:2 A4 | D5:3 | R:2 D5 | D5:2 B4:.5 D5:.5 | B4:2 A4 | G4:2 E4 | D4:2 D4 | G4:2 B4:.5 G4:.5 | B4:2 A4 | G4:3' },
      easy: {
        rh: 'D4 | G4:2 B4:.5 G4:.5 | B4:2 A4 | G4:2 E4 | D4:2 D4 | G4:2 B4:.5 G4:.5 | B4:2 A4 | D5:3 | R:2 D5 | D5:2 B4:.5 D5:.5 | B4:2 A4 | G4:2 E4 | D4:2 D4 | G4:2 B4:.5 G4:.5 | B4:2 A4 | G4:3',
        lh: 'R | G2:3 | G2:3 | C3:3 | G2:3 | G2:3 | D3:3 | D3:3 | D3:3 | G2:3 | G2:3 | C3:3 | G2:3 | G2:3 | D3:3 | G2:3',
      },
    },
  },
  {
    id: 'stille-nacht', title: 'Stille Nacht', composer: 'F.X. Gruber', level: 2, bpm: 132, meter: [6, 8],
    versions: {
      melody: { rh: 'G4:3 A4 G4:2 | E4:6 | G4:3 A4 G4:2 | E4:6 | D5:4 D5:2 | B4:6 | C5:4 C5:2 | G4:6 | A4:4 A4:2 | C5:3 B4 A4:2 | G4:3 A4 G4:2 | E4:6 | A4:4 A4:2 | C5:3 B4 A4:2 | G4:3 A4 G4:2 | E4:6 | D5:4 D5:2 | F5:3 D5 B4:2 | C5:6 | E5:6 | C5:2 G4:2 E4:2 | G4:3 F4 D4:2 | C4:6' },
      easy: {
        rh: 'G4:3 A4 G4:2 | E4:6 | G4:3 A4 G4:2 | E4:6 | D5:4 D5:2 | B4:6 | C5:4 C5:2 | G4:6 | A4:4 A4:2 | C5:3 B4 A4:2 | G4:3 A4 G4:2 | E4:6 | A4:4 A4:2 | C5:3 B4 A4:2 | G4:3 A4 G4:2 | E4:6 | D5:4 D5:2 | F5:3 D5 B4:2 | C5:6 | E5:6 | C5:2 G4:2 E4:2 | G4:3 F4 D4:2 | C4:6',
        lh: 'C3:6 | C3:6 | C3:6 | C3:6 | G2:6 | G2:6 | C3:6 | C3:6 | F2:6 | F2:6 | C3:6 | C3:6 | F2:6 | F2:6 | C3:6 | C3:6 | G2:6 | G2:6 | C3:6 | C3:6 | C3:6 | G2:6 | C3:6',
      },
    },
  },
  {
    id: 'greensleeves', title: 'Greensleeves', composer: 'Traditioneel (Engeland)', level: 2, bpm: 96, meter: [3, 4], pickup: 1, key: 'Am',
    versions: {
      melody: { rh: 'A4 | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B4 | G4:1.5 A4:.5 B4 | C5:2 A4 | A4:1.5 G#4:.5 A4 | B4:2 G#4 | E4:2 A4 | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B4 | G4:1.5 A4:.5 B4 | C5:1.5 B4:.5 A4 | G#4:1.5 F#4:.5 G#4 | A4:3' },
      easy: {
        rh: 'A4 | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B4 | G4:1.5 A4:.5 B4 | C5:2 A4 | A4:1.5 G#4:.5 A4 | B4:2 G#4 | E4:2 A4 | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B4 | G4:1.5 A4:.5 B4 | C5:1.5 B4:.5 A4 | G#4:1.5 F#4:.5 G#4 | A4:3',
        lh: 'R | A2:3 | C3:3 | G2:3 | E2:3 | A2:3 | A2:3 | E2:3 | E2:3 | A2:3 | C3:3 | G2:3 | E2:3 | A2:3 | E2:3 | A2:3',
      },
    },
  },
  {
    id: 'auld-lang-syne', title: 'Auld Lang Syne', composer: 'Traditioneel (Schotland)', level: 2, bpm: 88, meter: [4, 4], pickup: 1, key: 'F',
    versions: {
      melody: { rh: 'C4 | F4:1.5 E4:.5 F4 A4 | G4:1.5 F4:.5 G4 A4 | F4:1.5 F4:.5 A4 C5 | D5:3 D5 | C5:1.5 A4:.5 A4 F4 | G4:1.5 F4:.5 G4 A4 | F4:1.5 D4:.5 D4 C4 | F4:3' },
      easy: { rh: 'C4 | F4:1.5 E4:.5 F4 A4 | G4:1.5 F4:.5 G4 A4 | F4:1.5 F4:.5 A4 C5 | D5:3 D5 | C5:1.5 A4:.5 A4 F4 | G4:1.5 F4:.5 G4 A4 | F4:1.5 D4:.5 D4 C4 | F4:3', lh: 'R | F2:4 | C3:4 | F2:4 | Bb2:4 | F2:4 | C3:4 | D3:2 C3:2 | F2:3' },
    },
  },
  {
    id: 'menuet-g', title: 'Menuet in G', composer: 'C. Petzold', level: 2, bpm: 100, meter: [3, 4], key: 'G',
    versions: { melody: { rh: lessonPiece('h15-l2').rh }, easy: lessonPiece('h15-l2') },
  },
  {
    id: 'fur-elise', title: 'Für Elise (A-deel)', composer: 'L. van Beethoven', level: 2, bpm: 130, meter: [3, 8], pickup: 1, key: 'Am',
    versions: { melody: { rh: lessonPiece('h15-l3').rh }, easy: lessonPiece('h15-l3') },
  },
  {
    id: 'bergkoning', title: 'In de hal van de bergkoning (thema)', composer: 'E. Grieg', level: 2, bpm: 96, meter: [4, 4], key: 'Am',
    versions: {
      melody: { rh: 'A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5 | D#5:.5 B4:.5 D#5 D5:.5 Bb4:.5 D5 | A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5:.5 A5:.5 | G5:.5 E5:.5 C5:.5 E5:.5 G5:2 | A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5 | D#5:.5 B4:.5 D#5 D5:.5 Bb4:.5 D5 | A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5:.5 A5:.5 | G5:.5 E5:.5 C5:.5 E5:.5 G5:2' },
      easy: {
        rh: 'A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5 | D#5:.5 B4:.5 D#5 D5:.5 Bb4:.5 D5 | A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5:.5 A5:.5 | G5:.5 E5:.5 C5:.5 E5:.5 G5:2 | A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5 | D#5:.5 B4:.5 D#5 D5:.5 Bb4:.5 D5 | A4:.5 B4:.5 C5:.5 D5:.5 E5:.5 C5:.5 E5:.5 A5:.5 | G5:.5 E5:.5 C5:.5 E5:.5 G5:2',
        lh: 'A2:4 | B2:2 Bb2:2 | A2:4 | C3:4 | A2:4 | B2:2 Bb2:2 | A2:4 | C3:4',
      },
    },
  },
  {
    id: 'prelude-c', title: 'Prelude in C (begin)', composer: 'J.S. Bach', level: 2, bpm: 66, meter: [4, 4],
    versions: { melody: { rh: lessonPiece('h15-l4').rh }, easy: lessonPiece('h15-l4') },
  },

  // ---------------- gevorderd ----------------
  {
    id: 'canon-d', title: 'Canon in D', composer: 'J. Pachelbel', level: 3, bpm: 72, meter: [4, 4], key: 'D',
    versions: { melody: { rh: lessonPiece('h15-l6').rh }, easy: lessonPiece('h15-l6') },
  },
  {
    id: 'gymnopedie', title: 'Gymnopédie nr. 1 (begin)', composer: 'E. Satie', level: 3, bpm: 72, meter: [3, 4], key: 'D',
    versions: { melody: { rh: lessonPiece('h15-l5').rh }, easy: lessonPiece('h15-l5') },
  },
  {
    id: 'entertainer', title: 'The Entertainer (thema, vereenvoudigd)', composer: 'S. Joplin', level: 3, bpm: 84, meter: [4, 4], pickup: 1,
    versions: {
      melody: { rh: 'D4:.5 D#4:.5 | E4:.5 C5 E4:.5 C5 E4:.5 C5:.5 | C5:3 C5:.5 D5:.5 | D#5:.5 E5:.5 C5:.5 D5:.5 E5 B4:.5 D5:.5 | C5:3 D4:.5 D#4:.5 | E4:.5 C5 E4:.5 C5 E4:.5 C5:.5 | C5:3 A4:.5 G4:.5 | F#4:.5 A4:.5 C5:.5 E5 D5:.5 C5:.5 A4:.5 | D5:3 D4:.5 D#4:.5 | E4:.5 C5 E4:.5 C5 E4:.5 C5:.5 | C5:3 C5:.5 D5:.5 | D#5:.5 E5:.5 C5:.5 D5:.5 E5 B4:.5 D5:.5 | C5:3' },
      easy: {
        rh: 'D4:.5 D#4:.5 | E4:.5 C5 E4:.5 C5 E4:.5 C5:.5 | C5:3 C5:.5 D5:.5 | D#5:.5 E5:.5 C5:.5 D5:.5 E5 B4:.5 D5:.5 | C5:3 D4:.5 D#4:.5 | E4:.5 C5 E4:.5 C5 E4:.5 C5:.5 | C5:3 A4:.5 G4:.5 | F#4:.5 A4:.5 C5:.5 E5 D5:.5 C5:.5 A4:.5 | D5:3 D4:.5 D#4:.5 | E4:.5 C5 E4:.5 C5 E4:.5 C5:.5 | C5:3 C5:.5 D5:.5 | D#5:.5 E5:.5 C5:.5 D5:.5 E5 B4:.5 D5:.5 | C5:3',
        lh: 'R | C3:4 | C3:4 | G2:4 | C3:4 | C3:4 | F2:4 | D3:4 | G2:4 | C3:4 | C3:4 | G2:4 | C3:3',
      },
    },
  },
  {
    id: 'turkse-mars', title: 'Turkse Mars (thema, vereenvoudigd)', composer: 'W.A. Mozart', level: 3, bpm: 72, meter: [2, 4], pickup: 1, key: 'Am',
    versions: {
      melody: { rh: 'B4:.25 A4:.25 G#4:.25 A4:.25 | C5 D5:.25 C5:.25 B4:.25 C5:.25 | E5 F5:.25 E5:.25 D#5:.25 E5:.25 | B5:.25 A5:.25 G#5:.25 A5:.25 B5:.25 A5:.25 G#5:.25 A5:.25 | C6 A5:.5 C6:.5 | B5:.5 A5:.5 G5:.5 A5:.5 | B5:.5 A5:.5 G5:.5 A5:.5 | B5:.5 A5:.5 G5:.5 F#5:.5 | E5:2' },
      easy: {
        rh: 'B4:.25 A4:.25 G#4:.25 A4:.25 | C5 D5:.25 C5:.25 B4:.25 C5:.25 | E5 F5:.25 E5:.25 D#5:.25 E5:.25 | B5:.25 A5:.25 G#5:.25 A5:.25 B5:.25 A5:.25 G#5:.25 A5:.25 | C6 A5:.5 C6:.5 | B5:.5 A5:.5 G5:.5 A5:.5 | B5:.5 A5:.5 G5:.5 A5:.5 | B5:.5 A5:.5 G5:.5 F#5:.5 | E5:2',
        lh: 'R | A3:2 | A3:2 | A3:2 | A3:2 | E3:2 | E3:2 | B2:2 | E3:2',
      },
    },
  },
];

export const LEVELS = { 1: 'Beginner', 2: 'Gemiddeld', 3: 'Gevorderd' };
export const VERSIONS = { melody: 'Alleen melodie (RH)', easy: 'Eenvoudig met LH', full: 'Volledig' };
