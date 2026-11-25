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
node tests/smoke.mjs             # rooktest in headless Chrome: alle schermen + lessen + vrij spelen, meldt JS-fouten
node tests/shots.mjs <map> "#/les/h2-l3/5|click:#lCtl button|wait:2000"   # screenshots (844×390), alle lessen open
```

In Git Bash op Windows zet je `MSYS_NO_PATHCONV=1` voor het `shots`-commando. Anders worden de `#/…`-paden omgezet.

Je hebt alleen Node (18+), Python en Chrome of Edge nodig, geen npm.

## Mappen

```
index.html              schil: bovenbalk + <main id="app">
css/app.css             alle stijl (landscape-layout voor iPhone)
js/main.js              opstart + hash-router (#/cursus, #/les/h1-l3, …)
js/core/                midi, input (MIDI + toetsenbord + touch), audio, notation, midifile, storage, stats, events
js/player/              engine (wacht/tempo/voorspelen + scoring), stage (canvas + klavier), falling (vallende noten), keyboard,
                        handpos (vingerposities), handlayer (kleine hand op/boven het klavier)
js/ui/                  colors, dom, hands (SVG-handen), illustrations (houdingskaartjes)
js/lesson/              course (vergrendeling, sterren), runner (stappen afspelen), steps/ (staptypes)
js/workout/generator.js stelt de dagelijkse opwarming samen
js/screens/             één module per scherm
js/data/                course.js (voegt de hoofdstukken samen), chapters/h01.js … h15.js (lessen per hoofdstuk),
                        songs.js (liedjes), placement.js (instaptest), exercises.js (vingeroefeningen,
                        toonladders, arpeggio's)
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

In `js/data/chapters/hNN.js` (één bestand per hoofdstuk; nieuwe hoofdstukken voeg je toe in `js/data/course.js`): hoofdstukken → lessen → stappen. Elke les heeft een unieke `id`. Een les met `exam: true` is het hoofdstukexamen: haal je daar minstens 1 ster, dan worden alle lessen van het hoofdstuk vrijgegeven.

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
| `fingers` | vingernummers op de handtekening | `hand: rh \| lh \| both`, `mode: tap` (tik vinger N aan) of `mode: name` (welk nummer heeft de gouden vinger?), `rounds` |
| `fingerplay` | "Speel met vinger 3 van je rechterhand" | `position`, `pool: 'R1 R3 L5'` (standaard alle vingers), `rounds` |
| `piece` | stukje met vallende noten en/of notenbalk, in fases | `rh`, `lh` (notenstring met vingers), `bpm`, `meter`, `pickup` (tellen in de opmaat), `key` (`'G'`, `'F'`, `'Am'` …), `phases: ['demo', 'wait', 'tempo']`, `hands: both \| rh \| lh` (de andere hand speelt de app), `view: falling \| both \| staff`, `metronome: true`, `anyKey: true` (ritme: elke toets telt, alleen de timing), `position`, `range` |
| `staffquiz` | noot op de notenbalk → speel hem | `clef: treble \| bass \| grand`, `pool: 'C4 D4 E4'`, `rounds`, `octave: false` (octaaf maakt niet uit), `key` |

Gemeenschappelijk:
- `range: 'C3 B4'`: het zichtbare klavier.
- `names: 'none' | 'c' | 'auto'`: namen op de toetsen.
- `position: { rh: 'C4', lh: 'C3' }`: handpositie. Er verschijnt dan een kleine hand met vingernummers boven het klavier. `'C4'` is de laagste toets van een 5-vingerpositie op witte toetsen. Bij de rechterhand ligt daar de duim, bij de linkerhand de pink. Je kunt ook 5 noten geven: `'D4 E4 F#4 G4 A4'`.
- `explain` kan een notenbalk tonen: `staff: { clef: 'treble' | 'bass' | 'grand', notes: 'C4 D4 E4', labels: true | 'oct' }`.
- `explain` kan ook `illustration` tonen: `hands`, `zithoogte`, `schouders`, `ronde-vingers` of `polsen` (zie `js/ui/illustrations.js`).

**De fases van `piece`:**
- `demo`: de app speelt voor. Je kunt dit overslaan.
- `wait`: de noten wachten op jou. Met de knop "Meteen op tempo" sla je deze fase over.
- `tempo`: je speelt op tempo mee.

Na een oefenfase met minstens 2 sterren gaat de app vanzelf door naar de volgende fase. De score van de stap is je beste poging in de laatste beoordeelde fase. In elk blokje staat het vingernummer. Tijdens het spelen staan de vingertoppen op de toetsen, en de vinger die nu moet spelen licht goud op. Als de vingerzetting dat vraagt (bv. duim onderdoor), schuift de hand mee.

**Notenbalk:** VexFlow 4.2.5 komt van jsDelivr (met SRI-hash) en wordt pas geladen als er een notenbalk nodig is. Zonder internet zie je een melding en kun je verder met de vallende noten. De weergave per stap (`view`) kun je onder Instellingen overschrijven: "altijd vallende noten", "altijd beide" of "altijd alleen bladmuziek".

**Regels voor lesstukjes:** de unit-tests controleren dit voor elk stukje.
- Elke noot heeft een vingernummer.
- Elke maat heeft het juiste aantal tellen.
- Dezelfde toets komt nooit twee keer op hetzelfde moment voor (anders loopt de wachtmodus vast).
- Het stukje is als notenbalk op te bouwen.

**Een les vanaf een bepaalde stap starten:** `#/les/h2-l3/5` begint bij stap 5. Handig om te testen.

**Sterren:** juist ÷ (juist + fout) over alle beoordeelde stappen. ≥ 95% = 3, ≥ 80% = 2, ≥ 50% = 1. Vanaf 1 ster gaat de volgende les open.

**Instaptest:** `js/data/placement.js` bevat per hoofdstuk een paar proefstappen. Haal je ≥ 85%, dan wordt dat hoofdstuk als "overgeslagen" vrijgegeven en gaat de test verder.

## Dagelijkse opwarming

`js/workout/generator.js` stelt elke dag een opwarming van ± 5–10 minuten samen. Op dezelfde dag krijg je dezelfde mix (de datum is de seed). De opwarming bevat:

1. **Een vingeroefening** (`FINGER` in `js/data/exercises.js`): rechts, links of met twee handen, soms in de G-positie.
2. **Een toonladder of arpeggio** die je al geleerd hebt (`SCALES`, `ARPEGGIOS`). Beginners krijgen de vijf-noten-ladder.
3. **Een herhaling** van de laatste oefening uit je zwakste les: weinig sterren, of lang niet meer gespeeld.
4. **Noten lezen** op de notenbalk. Noten die je in leesquizzen vaak mis had (`weak.notes`), komen vaker terug. Vóór hoofdstuk 7 is dit "noten vinden op het klavier".
5. **Om de dag een ritmeoefening**: een willekeurig ritme met de ritmes die je al kent.

Een oefening verschijnt pas als je de les uit haar `requires` gehaald hebt. Toonladders en arpeggio's staan in `exercises.js` en worden gedeeld met hoofdstuk 11 en 14. Het tempo van de vinger- en toonladderoefeningen stel je in op het opwarmingsscherm.

**Metronoom** (`#/metronoom`):
- tempo 30–220;
- maat 2/4, 3/4, 4/4 of 6/8;
- tap-tempo;
- spatie = start/stop.

De tikken worden vooruit ingepland op de audioklok, zodat de timing nauwkeurig blijft.

**Streak:** een dag telt mee vanaf 1 minuut spelen. "Minuten deze week" telt de tijd tussen gespeelde noten, met pauzes van hoogstens 20 seconden.

## Voortgang

Alles staat in `localStorage` onder de sleutel `pianoles:v1`. Onder **Instellingen** kun je een back-up exporteren of importeren (JSON-bestand).

## Stand van zaken

- [x] Fase 1: structuur, verbinden, kalibratie, hoofdstuk 1 "Het klavier terugvinden", instaptest-skelet
- [x] Fase 2: handen en vingerzetting, hoofdstuk 2 "Handen en houding"
- [x] Fase 3: volledige cursus (15 hoofdstukken, 92 lessen) + notenbalk (VexFlow), metronoom, ritme- en leesoefeningen
- [x] Fase 4: dagelijkse opwarming + metronoom, streak en weekminuten
- [ ] Fase 5: liedjesbibliotheek + oefentools
- [ ] Fase 6: afwerking (voortgang, instellingen, animaties)
