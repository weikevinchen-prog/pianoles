# Pianoles

Een piano-leerapp in de browser, in de stijl van Simply Piano: vallende noten, wachtmodus, lessen met sterren. Je speelt op je eigen digitale piano via Web MIDI (getest met een Roland FP-10). Alles is statisch: HTML, CSS en vanilla JavaScript (ES modules), zonder build-stap. Het draait dus gewoon op GitHub Pages.

## Starten

ES modules werken niet via `file://`. Start daarom een kleine webserver in deze map:

```bash
python -m http.server 8000
```

Surf dan naar <http://localhost:8000>.

## Testen op je piano

### Laptop (USB)
1. Verbind de USB-poort ("USB Computer", type B) van de FP-10 met de laptop.
2. Open de app in **Chrome** of **Edge** en geef toestemming voor MIDI.
3. Het bolletje rechtsboven wordt groen. Onder **Piano verbinden › Kalibratie** test je alle toetsen, de aanslag en het pedaal.

Zonder piano speel je met het toetsenbord: `A W S E D F T G Y H U J K` = C tot C, `Z`/`X` = octaaf lager/hoger, spatie = start/pauze. Of tik op het schermklavier.

### iPhone (Bluetooth MIDI)
Safari en Chrome op iOS hebben geen Web MIDI. Gebruik daarom de app **Web MIDI Browser**.
1. Zet de app online (GitHub Pages). Of surf in Web MIDI Browser naar `http://<ip-van-je-laptop>:8000` terwijl `python -m http.server 8000` op de laptop draait (zelfde wifi).
2. Koppel de FP-10 in Web MIDI Browser zelf (menu › Bluetooth MIDI), niet via iOS-Instellingen.
3. Houd de telefoon **liggend**: compacte balk bovenaan, groot klavier onderaan.

Als er MIDI binnenkomt, speelt de app zelf geen geluid (de piano klinkt al). Voorspelen en begeleiding klinken wel via Web Audio.

## Automatische tests

```bash
node --test "tests/*.test.mjs"   # unit-tests: notatie, MIDI-parser, speelmotor, cursuslogica, opslag
node tests/smoke.mjs             # rooktest in headless Chrome: alle schermen + een les + vrij spelen, meldt JS-fouten
```

Je hebt alleen Node (18+), Python en Chrome of Edge nodig, geen npm.

## Mappen

```
index.html              schil: bovenbalk + <main id="app">
css/app.css             alle stijl (landscape-layout voor iPhone)
js/main.js              opstart + hash-router (#/cursus, #/les/h1-l3, …)
js/core/                midi, input (MIDI + toetsenbord + touch), audio, notation, midifile, storage, stats, events
js/player/              engine (wacht/tempo/voorspelen + scoring), stage (canvas + klavier), falling (vallende noten), keyboard
js/lesson/              course (vergrendeling, sterren), runner (stappen afspelen), steps/ (staptypes)
js/screens/             één module per scherm
js/data/                course.js (lessen), songs.js (liedjes), placement.js (instaptest)
tests/                  node-tests + rooktest
```

## Notenstring

Lessen en liedjes gebruiken een compacte notatie per hand:

| Schrijfwijze | Betekenis |
|---|---|
| `C4` | kwartnoot / 1 tel (C4 = centrale C) |
| `E4:2`, `D4:.5`, `G4:1.5` | 2 tellen, een halve tel, gepunteerd |
| `F#4`, `Bb3` | kruis / mol |
| `E4/3` | gespeeld met vinger 3 (1 = duim) |
| `E4/3:2` | vinger 3, 2 tellen |
| `[C3/5 E3/3 G3/1]:4` | akkoord van 4 tellen |
| `R`, `R:2` | rust |
| `\|` | maatstreep (optioneel). De tests controleren dan of elke maat klopt. |

Eén tel = de noemer van de maatsoort (in 3/8 is één tel een achtste).

## Liedjes toevoegen

In `js/data/songs.js`. Gebruik **alleen publiek domein** (traditionals, klassiek), geen moderne popsongs.

```js
{
  id: 'ode', title: 'Ode an die Freude', composer: 'L. van Beethoven',
  level: 1,                 // 1 beginner, 2 gemiddeld, 3 gevorderd
  bpm: 100, meter: [4, 4],
  versions: {
    melody: { rh: 'E4/3 E4/3 F4/4 G4/5 | …' },             // alleen melodie RH
    easy:   { rh: '…', lh: 'C3/5:4 | G2/5:4 | …' },          // eenvoudig met LH
    full:   { rh: '…', lh: '…' },                            // volledig (waar mogelijk)
  },
},
```

Draai daarna `node --test "tests/*.test.mjs"`. Die controleert of alles parset en of de maten kloppen.

## Lessen toevoegen

In `js/data/course.js`: hoofdstukken → lessen → stappen. Elke les heeft een unieke `id`. Een les met `exam: true` is het hoofdstukexamen: haal je daar minstens 1 ster, dan worden alle lessen van het hoofdstuk vrijgegeven.

```js
{
  id: 'h1-l2', title: 'De C vinden', skills: ['orientatie'],
  steps: [
    { type: 'explain', range: 'C3 C5', text: 'De **{C}** is …', show: [{ targets: 'C', color: 'gold', label: 'name' }] },
    { type: 'find', range: 'C3 C5', targets: 'C', mode: 'all', text: 'Speel alle {C}\'s.', hint: 'Links van de 2 zwarte.' },
  ],
}
```

Tekst: `**vet**`, `{C}` = notennaam volgens de instelling (C of do), `{C4}` = met octaafnummer.

**Staptypes**

| type | wat | velden |
|---|---|---|
| `explain` | uitleg + gemarkeerde toetsen, knop "Verder" | `text`, `range`, `show: [{targets, color: gold/blue/teal/coral/green, label: 'name' \| 'name+oct' \| tekst}]`, `names` |
| `find` | toetsen zoeken | `targets` (`'C'` = alle C's in bereik, `'C4'` = precies die), `mode: all \| ordered \| any`, `hint`, `hintAfter` (standaard 2) |
| `quiz` | "Speel een F" (eender welk octaaf) of "Speel E4" | `pool: 'C D E'` of `'C4 E4'`, `rounds`, `text` met `{X}` |
| `name` | een toets licht op, kies de naam | `pool`, `rounds` |

Gemeenschappelijk: `range: 'C3 B4'` (zichtbaar klavier), `names: 'none' | 'c' | 'auto'` (namen op de toetsen).

**Sterren:** juist ÷ (juist + fout) over alle beoordeelde stappen. ≥ 95% = 3, ≥ 80% = 2, ≥ 50% = 1. Vanaf 1 ster gaat de volgende les open.

**Instaptest:** `js/data/placement.js` bevat per hoofdstuk een paar proefstappen. Haal je ≥ 85%, dan wordt dat hoofdstuk als "overgeslagen" vrijgegeven en gaat de test verder.

## Voortgang

Alles staat in `localStorage` onder de sleutel `pianoles:v1`. Onder **Instellingen** kun je een back-up exporteren of importeren (JSON-bestand).

## Stand van zaken

- [x] Fase 1: structuur, verbinden, kalibratie, hoofdstuk 1 "Het klavier terugvinden", instaptest-skelet
- [ ] Fase 2: handen en vingerzetting
- [ ] Fase 3: volledige cursus + notenbalk (VexFlow)
- [ ] Fase 4: dagelijkse opwarming + metronoom
- [ ] Fase 5: liedjesbibliotheek + oefentools
- [ ] Fase 6: afwerking (voortgang, instellingen, animaties)
