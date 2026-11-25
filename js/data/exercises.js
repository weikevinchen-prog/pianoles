// Oefencatalogus voor de dagelijkse opwarming (en gedeeld met de cursus: toonladders, arpeggio's).
// Elke oefening heeft `requires`: de les die je gehaald moet hebben voor ze in de opwarming verschijnt.
// Notenstrings: zie README.md. `transpose` (halve tonen) en `key` mogen erbij; de opwarming kiest soms
// een andere positie voor afwisseling.

export const SCALES = {
  C: { key: 'C', rh: 'C4/1 D4/2 E4/3 F4/1 | G4/2 A4/3 B4/4 C5/5 | C5/5 B4/4 A4/3 G4/2 | F4/1 E4/3 D4/2 C4/1', lh: 'C3/5 D3/4 E3/3 F3/2 | G3/1 A3/3 B3/2 C4/1 | C4/1 B3/2 A3/3 G3/1 | F3/2 E3/3 D3/4 C3/5' },
  G: { key: 'G', rh: 'G4/1 A4/2 B4/3 C5/1 | D5/2 E5/3 F#5/4 G5/5 | G5/5 F#5/4 E5/3 D5/2 | C5/1 B4/3 A4/2 G4/1', lh: 'G2/5 A2/4 B2/3 C3/2 | D3/1 E3/3 F#3/2 G3/1 | G3/1 F#3/2 E3/3 D3/1 | C3/2 B2/3 A2/4 G2/5' },
  F: { key: 'F', rh: 'F4/1 G4/2 A4/3 Bb4/4 | C5/1 D5/2 E5/3 F5/4 | F5/4 E5/3 D5/2 C5/1 | Bb4/4 A4/3 G4/2 F4/1', lh: 'F2/5 G2/4 A2/3 Bb2/2 | C3/1 D3/3 E3/2 F3/1 | F3/1 E3/2 D3/3 C3/1 | Bb2/2 A2/3 G2/4 F2/5' },
  D: { key: 'D', rh: 'D4/1 E4/2 F#4/3 G4/1 | A4/2 B4/3 C#5/4 D5/5 | D5/5 C#5/4 B4/3 A4/2 | G4/1 F#4/3 E4/2 D4/1', lh: 'D3/5 E3/4 F#3/3 G3/2 | A3/1 B3/3 C#4/2 D4/1 | D4/1 C#4/2 B3/3 A3/1 | G3/2 F#3/3 E3/4 D3/5' },
  Am: { key: 'Am', rh: 'A4/1 B4/2 C5/3 D5/1 | E5/2 F5/3 G5/4 A5/5 | A5/5 G5/4 F5/3 E5/2 | D5/1 C5/3 B4/2 A4/1', lh: 'A2/5 B2/4 C3/3 D3/2 | E3/1 F3/3 G3/2 A3/1 | A3/1 G3/2 F3/3 E3/1 | D3/2 C3/3 B2/4 A2/5' },
};

export const ARPEGGIOS = {
  C: { key: 'C', rh: 'C4/1 E4/2 G4/3 C5/5 | G4/3 E4/2 C4/1:2', lh: 'C3/5 E3/4 G3/2 C4/1 | G3/2 E3/4 C3/5:2' },
  G: { key: 'G', rh: 'G4/1 B4/2 D5/3 G5/5 | D5/3 B4/2 G4/1:2', lh: 'G2/5 B2/4 D3/2 G3/1 | D3/2 B2/4 G2/5:2' },
  F: { key: 'F', rh: 'F4/1 A4/2 C5/3 F5/5 | C5/3 A4/2 F4/1:2', lh: 'F2/5 A2/4 C3/2 F3/1 | C3/2 A2/4 F2/5:2' },
  Am: { key: 'Am', rh: 'A4/1 C5/2 E5/3 A5/5 | E5/3 C5/2 A4/1:2', lh: 'A2/5 C3/4 E3/2 A3/1 | E3/2 C3/4 A2/5:2' },
};

// Vingeroefeningen in de C-positie (rh) en hun spiegelbeeld (lh).
export const FINGER = [
  {
    id: 'vijf-op-neer', title: 'Vijf vingers op en neer', requires: 'h2-l3', skill: 'vingers',
    rh: 'C4/1:.5 D4/2:.5 E4/3:.5 F4/4:.5 G4/5:.5 F4/4:.5 E4/3:.5 D4/2:.5 | C4/1:.5 D4/2:.5 E4/3:.5 F4/4:.5 G4/5:.5 F4/4:.5 E4/3:.5 D4/2:.5 | C4/1:4',
    lh: 'G3/1:.5 F3/2:.5 E3/3:.5 D3/4:.5 C3/5:.5 D3/4:.5 E3/3:.5 F3/2:.5 | G3/1:.5 F3/2:.5 E3/3:.5 D3/4:.5 C3/5:.5 D3/4:.5 E3/3:.5 F3/2:.5 | G3/1:4',
  },
  {
    id: 'herhaalde-noten', title: 'Elke vinger twee keer', requires: 'h2-l3', skill: 'vingers',
    rh: 'C4/1:.5 C4/1:.5 D4/2:.5 D4/2:.5 E4/3:.5 E4/3:.5 F4/4:.5 F4/4:.5 | G4/5:.5 G4/5:.5 F4/4:.5 F4/4:.5 E4/3:.5 E4/3:.5 D4/2:.5 D4/2:.5 | C4/1:4',
    lh: 'C3/5:.5 C3/5:.5 D3/4:.5 D3/4:.5 E3/3:.5 E3/3:.5 F3/2:.5 F3/2:.5 | G3/1:.5 G3/1:.5 F3/2:.5 F3/2:.5 E3/3:.5 E3/3:.5 D3/4:.5 D3/4:.5 | C3/5:4',
  },
  {
    id: 'tertsen', title: 'Sprongetjes (tertsen)', requires: 'h3-l2', skill: 'vingers',
    rh: 'C4/1 E4/3 D4/2 F4/4 | E4/3 G4/5 F4/4 D4/2 | E4/3 C4/1 D4/2 B3/1 | C4/1:4',
    lh: 'C3/5 E3/3 D3/4 F3/2 | E3/3 G3/1 F3/2 D3/4 | E3/3 C3/5 D3/4 E3/3 | C3/5:4',
  },
  {
    id: 'vingers-3-4-5', title: 'Zwakke vingers (3-4-5)', requires: 'h3-l1', skill: 'vingers',
    rh: 'E4/3:.5 F4/4:.5 G4/5:.5 F4/4:.5 E4/3:.5 F4/4:.5 G4/5:.5 F4/4:.5 | E4/3:.5 G4/5:.5 F4/4:.5 G4/5:.5 E4/3:.5 F4/4:.5 E4/3:.5 F4/4:.5 | E4/3:4',
    lh: 'E3/3:.5 D3/4:.5 C3/5:.5 D3/4:.5 E3/3:.5 D3/4:.5 C3/5:.5 D3/4:.5 | E3/3:.5 C3/5:.5 D3/4:.5 C3/5:.5 E3/3:.5 D3/4:.5 E3/3:.5 D3/4:.5 | E3/3:4',
  },
  {
    id: 'hanon-1', title: 'Hanon nr. 1 (begin)', requires: 'h6-l5', skill: 'vingers',
    rh: 'C4/1:.5 E4/2:.5 F4/3:.5 G4/4:.5 A4/5:.5 G4/4:.5 F4/3:.5 E4/2:.5 | D4/1:.5 F4/2:.5 G4/3:.5 A4/4:.5 B4/5:.5 A4/4:.5 G4/3:.5 F4/2:.5 | E4/1:.5 G4/2:.5 A4/3:.5 B4/4:.5 C5/5:.5 B4/4:.5 A4/3:.5 G4/2:.5 | F4/1:.5 A4/2:.5 B4/3:.5 C5/4:.5 D5/5:.5 C5/4:.5 B4/3:.5 A4/2:.5 | G4/1:4',
    lh: 'C3/5:.5 E3/4:.5 F3/3:.5 G3/2:.5 A3/1:.5 G3/2:.5 F3/3:.5 E3/4:.5 | D3/5:.5 F3/4:.5 G3/3:.5 A3/2:.5 B3/1:.5 A3/2:.5 G3/3:.5 F3/4:.5 | E3/5:.5 G3/4:.5 A3/3:.5 B3/2:.5 C4/1:.5 B3/2:.5 A3/3:.5 G3/4:.5 | F3/5:.5 A3/4:.5 B3/3:.5 C4/2:.5 D4/1:.5 C4/2:.5 B3/3:.5 A3/4:.5 | G3/5:4',
  },
  {
    id: 'duim-onder', title: 'Duim onderdoor', requires: 'h11-l1', skill: 'duim-onder',
    rh: 'C4/1 D4/2 E4/3 F4/1 | G4/2 F4/1 E4/3 D4/2 | C4/1 D4/2 E4/3 F4/1 | E4/3 D4/2 C4/1:2',
    lh: 'G3/1 F3/2 E3/3 D3/1 | C3/2 D3/1 E3/3 F3/2 | G3/1 F3/2 E3/3 D3/1 | E3/3 F3/2 G3/1:2',
  },
  {
    id: 'akkoordwissel', title: 'Akkoorden C – F – G – C', requires: 'h12-l2', skill: 'akkoorden',
    rh: '[C4/1 E4/3 G4/5]:2 [C4/1 F4/4 A4/5]:2 | [B3/1 D4/2 G4/5]:2 [C4/1 E4/3 G4/5]:2 | [C4/1 E4/3 G4/5]:2 [C4/1 E4/3 A4/5]:2 | [B3/1 D4/2 G4/5]:2 [C4/1 E4/3 G4/5]:2',
    lh: '[C3/5 E3/3 G3/1]:2 [F2/5 A2/3 C3/1]:2 | [G2/5 B2/3 D3/1]:2 [C3/5 E3/3 G3/1]:2 | [C3/5 E3/3 G3/1]:2 [A2/5 C3/3 E3/1]:2 | [G2/5 B2/3 D3/1]:2 [C3/5 E3/3 G3/1]:2',
  },
];

// Wanneer een toonladder of arpeggio in de opwarming mag verschijnen.
export const SCALE_REQ = { C: { rh: 'h11-l3', lh: 'h11-l4', both: 'h11-l5' }, G: { rh: 'h14-l2', lh: 'h14-l2' }, F: { rh: 'h14-l3', lh: 'h14-l3' }, D: { rh: 'h14-l4', lh: 'h14-l4' }, Am: { rh: 'h14-l5', lh: 'h14-l5' } };
export const ARP_REQ = 'h14-l6';
