// Hoofdstuk 15: eenvoudige klassieke stukjes (publiek domein, vereenvoudigde arrangementen).
const intro = text => ({ type: 'explain', range: 'C3 C5', names: 'c', text });

export default {
  id: 'h15',
  title: 'Klassieke stukjes',
  intro: 'Bekende klassieke muziek in een eenvoudige versie: Beethoven, Bach/Petzold, Satie en Pachelbel.',
  lessons: [
    {
      id: 'h15-l1', title: 'Ode an die Freude (volledig)', skills: ['klassiek', 'handen-samen'],
      steps: [
        intro('Nu het **hele thema** van Beethoven, met het middenstuk. In maat 12 zakt je rechterduim even naar de {G3}; daarna ga je terug naar de C-positie.'),
        {
          type: 'piece', bpm: 84, position: { lh: 'C3', rh: 'C4' }, view: 'both', text: 'Ode an die Freude (L. van Beethoven).',
          rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2 | D4/2 D4/2 E4/3 C4/1 | D4/2 E4/3:.5 F4/4:.5 E4/3 C4/1 | D4/2 E4/3:.5 F4/4:.5 E4/3 D4/2 | C4/1 D4/2 G3/1:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2',
          lh: '[C3/5 E3/3 G3/1]:4 | [B2/5 D3/3 G3/1]:4 | [C3/5 E3/3 G3/1]:4 | [B2/5 D3/3 G3/1]:4 | [C3/5 E3/3 G3/1]:4 | [B2/5 D3/3 G3/1]:4 | [C3/5 E3/3 G3/1]:4 | [B2/5 D3/3 G3/1]:2 [C3/5 E3/3 G3/1]:2 | [B2/5 D3/3 G3/1]:4 | [B2/5 D3/3 G3/1]:2 [C3/5 E3/3 G3/1]:2 | [B2/5 D3/3 G3/1]:2 [C3/5 E3/3 G3/1]:2 | G2/5:4 | [C3/5 E3/3 G3/1]:4 | [B2/5 D3/3 G3/1]:4 | [C3/5 E3/3 G3/1]:4 | [B2/5 D3/3 G3/1]:2 [C3/5 E3/3 G3/1]:2',
        },
      ],
    },
    {
      id: 'h15-l2', title: 'Menuet in G', skills: ['klassiek'],
      steps: [
        intro('Het **Menuet in G** (Christian Petzold, uit het notenboekje voor Anna Magdalena Bach). Een dans in **3/4**. Rechts beweeg je veel: volg de vingernummers. Links speelt eenvoudige basnoten (vereenvoudigd).'),
        {
          type: 'piece', bpm: 96, meter: [3, 4], key: 'G', position: { lh: 'G2', rh: 'G4' }, view: 'both', text: 'Menuet in G (C. Petzold), deel A.',
          rh: 'D5/5 G4/1:.5 A4/2:.5 B4/3:.5 C5/4:.5 | D5/5 G4/1 G4/1 | E5/5 C5/1:.5 D5/2:.5 E5/3:.5 F#5/4:.5 | G5/5 G4/1 G4/1 | C5/4 D5/5:.5 C5/4:.5 B4/3:.5 A4/2:.5 | B4/4 C5/5:.5 B4/4:.5 A4/3:.5 G4/2:.5 | F#4/1 G4/2:.5 A4/3:.5 B4/4:.5 G4/2:.5 | A4/3:3 | D5/5 G4/1:.5 A4/2:.5 B4/3:.5 C5/4:.5 | D5/5 G4/1 G4/1 | E5/5 C5/1:.5 D5/2:.5 E5/3:.5 F#5/4:.5 | G5/5 G4/1 G4/1 | C5/4 D5/5:.5 C5/4:.5 B4/3:.5 A4/2:.5 | B4/4 C5/5:.5 B4/4:.5 A4/3:.5 G4/2:.5 | A4/3 B4/4:.5 A4/3:.5 G4/2:.5 F#4/1:.5 | G4/2:3',
          lh: 'G2/5:3 | B2/3:3 | C3/2:3 | B2/3:3 | A2/4:3 | G2/5:3 | D3/1:3 | D3/1:3 | G2/5:3 | B2/3:3 | C3/2:3 | B2/3:3 | A2/4:3 | G2/5:3 | D3/1:3 | G2/5:3',
        },
      ],
    },
    {
      id: 'h15-l3', title: 'Für Elise (A-deel)', skills: ['klassiek'],
      steps: [
        intro('**Für Elise** van Beethoven, het bekende begin. In **3/8**: één tel is een achtste. Het stuk begint met een **opmaat** (twee korte noten voor de eerste maat). De handen wisselen elkaar af: links speelt een gebroken akkoord, rechts antwoordt.'),
        {
          type: 'piece', bpm: 120, meter: [3, 8], pickup: 1, key: 'Am', view: 'both', text: 'Für Elise (L. van Beethoven), A-deel.',
          rh: 'E5/5:.5 D#5/4:.5 | E5/5:.5 D#5/4:.5 E5/5:.5 B4/2:.5 D5/4:.5 C5/3:.5 | A4/1 R:.5 C4/1:.5 E4/2:.5 A4/4:.5 | B4/5 R:.5 E4/1:.5 G#4/3:.5 B4/4:.5 | C5/5 R:.5 E4/1:.5 E5/5:.5 D#5/4:.5 | E5/5:.5 D#5/4:.5 E5/5:.5 B4/2:.5 D5/4:.5 C5/3:.5 | A4/1 R:.5 C4/1:.5 E4/2:.5 A4/4:.5 | B4/5 R:.5 E4/1:.5 C5/4:.5 B4/3:.5 | A4/2:3',
          lh: 'R:1 | R:3 | A2/5:.5 E3/2:.5 A3/1:.5 R:1.5 | E2/5:.5 E3/2:.5 G#3/1:.5 R:1.5 | A2/5:.5 E3/2:.5 A3/1:.5 R:1.5 | R:3 | A2/5:.5 E3/2:.5 A3/1:.5 R:1.5 | E2/5:.5 E3/2:.5 G#3/1:.5 R:1.5 | A2/5:.5 E3/2:.5 A3/1:.5 R:1.5',
        },
      ],
    },
    {
      id: 'h15-l4', title: 'Prelude in C', skills: ['klassiek', 'akkoorden'],
      steps: [
        intro('De **Prelude in C** van **J.S. Bach** (uit Das wohltemperierte Klavier) bestaat uit **gebroken akkoorden**. Vereenvoudigd: links houdt twee basnoten aan, rechts herhaalt per maat hetzelfde patroon. Luister hoe de akkoorden van kleur veranderen.'),
        {
          type: 'piece', bpm: 66, position: { lh: 'C3', rh: 'G4' }, view: 'both', text: 'Prelude in C (J.S. Bach), maat 1–8, vereenvoudigd.',
          rh: 'G4/1:.5 C5/2:.5 E5/4:.5 C5/2:.5 G4/1:.5 C5/2:.5 E5/4:.5 C5/2:.5 | A4/1:.5 D5/2:.5 F5/4:.5 D5/2:.5 A4/1:.5 D5/2:.5 F5/4:.5 D5/2:.5 | G4/1:.5 D5/3:.5 F5/5:.5 D5/3:.5 G4/1:.5 D5/3:.5 F5/5:.5 D5/3:.5 | G4/1:.5 C5/2:.5 E5/4:.5 C5/2:.5 G4/1:.5 C5/2:.5 E5/4:.5 C5/2:.5 | A4/1:.5 E5/3:.5 A5/5:.5 E5/3:.5 A4/1:.5 E5/3:.5 A5/5:.5 E5/3:.5 | A4/1:.5 D5/2:.5 F#5/4:.5 D5/2:.5 A4/1:.5 D5/2:.5 F#5/4:.5 D5/2:.5 | G4/1:.5 D5/3:.5 G5/5:.5 D5/3:.5 G4/1:.5 D5/3:.5 G5/5:.5 D5/3:.5 | E4/1:.5 G4/2:.5 C5/4:.5 G4/2:.5 E4/1:.5 G4/2:.5 C5/4:.5 G4/2:.5',
          lh: 'C3/5:2 E3/3:2 | C3/5:2 D3/4:2 | B2/5:2 D3/3:2 | C3/5:2 E3/3:2 | C3/5:2 E3/3:2 | C3/5:2 D3/4:2 | B2/5:2 D3/3:2 | B2/5:2 C3/4:2',
        },
      ],
    },
    {
      id: 'h15-l5', title: 'Gymnopédie nr. 1', skills: ['klassiek'],
      steps: [
        intro('**Gymnopédie nr. 1** van **Erik Satie**: traag, rustig en dromerig. Links wisselt een lage basnoot af met een akkoord (vereenvoudigd). Rechts komt de melodie binnen in maat 5. Laat alles mooi doorklinken; met het pedaal mag het ook.'),
        {
          type: 'piece', bpm: 72, meter: [3, 4], key: 'D', view: 'both', text: 'Gymnopédie nr. 1 (E. Satie), begin, vereenvoudigd.',
          rh: 'R:3 | R:3 | R:3 | R:3 | R F#5/3 A5/5 | G5/4 F#5/3 C#5/1 | B4/1 C#5/2 D5/3 | A4/1:3 | F#4/1:3 | F#4/1:3',
          lh: 'G2/5 [B2/3 D3/2 F#3/1]:2 | D2/5 [A2/3 C#3/2 F#3/1]:2 | G2/5 [B2/3 D3/2 F#3/1]:2 | D2/5 [A2/3 C#3/2 F#3/1]:2 | G2/5 [B2/3 D3/2 F#3/1]:2 | D2/5 [A2/3 C#3/2 F#3/1]:2 | G2/5 [B2/3 D3/2 F#3/1]:2 | D2/5 [A2/3 C#3/2 F#3/1]:2 | G2/5 [B2/3 D3/2 F#3/1]:2 | D2/5 [A2/3 C#3/2 F#3/1]:2',
        },
      ],
    },
    {
      id: 'h15-l6', title: 'Canon in D', skills: ['klassiek'],
      steps: [
        intro('De **Canon in D** van **Johann Pachelbel**. Links speelt steeds dezelfde 8 basnoten (D – A – B – F# – G – D – G – A). Rechts komt in maat 5 de bekende melodie erbij (vereenvoudigd, in halve noten).'),
        {
          type: 'piece', bpm: 72, key: 'D', view: 'both', text: 'Canon in D (J. Pachelbel), vereenvoudigd.',
          rh: 'R:4 | R:4 | R:4 | R:4 | F#5/5:2 E5/4:2 | D5/3:2 C#5/2:2 | B4/2:2 A4/1:2 | B4/2:2 C#5/3:2 | D5/5:2 C#5/4:2 | B4/3:2 A4/2:2 | G4/1:2 F#4/1:2 | G4/2:2 E4/1:2 | D4/1:4',
          lh: 'D3/1:2 A2/4:2 | B2/3:2 F#2/5:2 | G2/4:2 D2/5:2 | G2/4:2 A2/3:2 | D3/1:2 A2/4:2 | B2/3:2 F#2/5:2 | G2/4:2 D2/5:2 | G2/4:2 A2/3:2 | D3/1:2 A2/4:2 | B2/3:2 F#2/5:2 | G2/4:2 D2/5:2 | G2/4:2 A2/3:2 | D3/1:4',
        },
      ],
    },
  ],
};
