// Hoofdstuk 8: handen samen.
const BOTH = { lh: 'C3', rh: 'C4' };

export default {
  id: 'h8',
  title: 'Handen samen',
  intro: 'Twee handen tegelijk: eerst lange basnoten onder de melodie, dan parallel en in tegenbeweging.',
  lessons: [
    {
      id: 'h8-l1', title: 'Links houdt vast, rechts speelt', skills: ['handen-samen'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: BOTH,
          text: 'De makkelijkste manier om handen samen te spelen: de **linkerhand houdt een lange noot vast** terwijl de rechterhand de melodie speelt. In de wachtmodus wacht de muziek tot **beide** noten van een moment gespeeld zijn.',
        },
        {
          type: 'piece', bpm: 76, position: BOTH, view: 'both', text: 'Rechts de melodie, links hele noten.',
          rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:2 E4/3:2 | F4/4 E4/3 D4/2 E4/3 | C4/1:4',
          lh: 'C3/5:4 | C3/5:4 | G3/1:4 | C3/5:4',
        },
      ],
    },
    {
      id: 'h8-l2', title: 'Parallel', skills: ['handen-samen'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: BOTH,
          text: '**Parallel** spelen: beide handen gaan **dezelfde richting** uit, een octaaf uit elkaar. Let op: de vingernummers zijn **verschillend**! Rechts 1-2-3-4-5, links 5-4-3-2-1.',
        },
        {
          type: 'piece', bpm: 66, position: BOTH, view: 'both', text: 'Beide handen omhoog en omlaag.',
          rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:4 | G4/5 F4/4 E4/3 D4/2 | C4/1:4',
          lh: 'C3/5 D3/4 E3/3 F3/2 | G3/1:4 | G3/1 F3/2 E3/3 D3/4 | C3/5:4',
        },
      ],
    },
    {
      id: 'h8-l3', title: 'Tegenbeweging', skills: ['handen-samen'],
      steps: [
        {
          type: 'explain', range: 'C3 C5', names: 'c', position: BOTH,
          text: 'In **tegenbeweging** gaan de handen **uit elkaar** en weer naar elkaar toe. Hier spelen beide handen **dezelfde vingernummers**: dat voelt vaak makkelijker!',
        },
        {
          type: 'piece', bpm: 66, position: BOTH, view: 'both', text: 'Van de duimen naar buiten en terug.',
          rh: 'C4/1 D4/2 E4/3 F4/4 | G4/5:4 | G4/5 F4/4 E4/3 D4/2 | C4/1:4',
          lh: 'G3/1 F3/2 E3/3 D3/4 | C3/5:4 | C3/5 D3/4 E3/3 F3/2 | G3/1:4',
        },
      ],
    },
    {
      id: 'h8-l4', title: 'Ode an die Freude met begeleiding', skills: ['handen-samen', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 80, position: BOTH, view: 'both', text: 'Ode an die Freude: rechts de melodie, links de basnoten C en G.',
          rh: 'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3:1.5 D4/2:.5 D4/2:2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2:1.5 C4/1:.5 C4/1:2',
          lh: 'C3/5:4 | G3/1:4 | C3/5:4 | G3/1:4 | C3/5:4 | G3/1:4 | C3/5:2 E3/3:2 | G3/1:2 C3/5:2',
        },
      ],
    },
    {
      id: 'h8-l5', title: 'Mary met twee handen', skills: ['handen-samen', 'liedje'],
      steps: [
        {
          type: 'piece', bpm: 84, position: BOTH, view: 'both', text: 'Mary had a little lamb, met halve noten in de linkerhand.',
          rh: 'E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3:2 | D4/2 D4/2 D4/2:2 | E4/3 G4/5 G4/5:2 | E4/3 D4/2 C4/1 D4/2 | E4/3 E4/3 E4/3 E4/3 | D4/2 D4/2 E4/3 D4/2 | C4/1:4',
          lh: 'C3/5:2 E3/3:2 | C3/5:2 E3/3:2 | G3/1:2 F3/2:2 | E3/3:2 C3/5:2 | C3/5:2 E3/3:2 | C3/5:2 E3/3:2 | G3/1:2 G3/1:2 | C3/5:4',
        },
      ],
    },
    {
      id: 'h8-ex', title: 'Examen: handen samen', exam: true, skills: ['handen-samen'],
      steps: [
        {
          type: 'piece', bpm: 76, position: BOTH, view: 'both', phases: ['wait', 'tempo'], text: 'Twee handen samen.',
          rh: 'G4/5 E4/3 F4/4 D4/2 | E4/3 C4/1 D4/2:2 | E4/3 F4/4 G4/5 E4/3 | C4/1:4',
          lh: 'C3/5:2 E3/3:2 | G3/1:2 G3/1:2 | C3/5:2 E3/3:2 | C3/5:4',
        },
      ],
    },
  ],
};
