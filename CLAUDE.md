# Pianoles: projectafspraken

Piano-leerapp in de stijl van Simply Piano, voor één gebruiker. Die speelde vroeger piano en wil het opnieuw opbouwen. Bouw de stof op vanaf de basis, maar laat snel doorgaan als iets al vlot gaat (examens, instaptest, "overgeslagen").

## Gebruiker en toestellen
- Roland FP-10 (88 toetsen), via **Bluetooth MIDI** op iPhone in de app **Web MIDI Browser** (Safari/Chrome op iOS hebben geen Web MIDI), en via USB op laptop-Chrome.
- iPhone **liggend** is het hoofdscenario: compacte balk bovenaan, groot klavier onderaan. Touch-targets ≥ 44px.
- Alle UI-teksten in het **Nederlands** (Vlaams mag).

## Technische regels
- Puur statisch voor GitHub Pages: HTML + CSS + vanilla JS (ES modules). **Geen build-stap, geen npm, geen backend.**
- Externe libraries alleen als ze echt veel werk besparen, met een vaste versie via CDN (gepland: VexFlow voor de notenbalk, lui laden).
- Opslag: `localStorage` sleutel `pianoles:v1` via `js/core/storage.js` (altijd try/catch), met export/import als JSON.
- Input loopt via `js/core/input.js` → bus-events `noteon`/`noteoff`/`pedal`/`space`. Schermen luisteren daarnaar, nooit rechtstreeks naar MIDI.
- Komt een noot via MIDI binnen, dan speelt de app **zelf geen geluid**. Voorspelen en begeleiding wel (Web Audio).
- Handkleuren: rechts turkoois `#2bb3a3`, links koraal `#e0644f`. Goud = nu spelen, groen = juist, rood = fout. Overal consistent (`js/ui/colors.js`).
- **Copyright:** alleen publiek-domeinmuziek (traditionals, kinderliedjes, klassiek). Geen moderne popsongs.
- Lessen en liedjes zijn data in `js/data/*.js`, in het formaat uit README.md. Houd de README bij als het formaat verandert.
- Respecteer `prefers-reduced-motion`. Animaties en geluidjes blijven rustig en uit te zetten.
- Breek nooit: de vallende-noten-speler (Vrij spelen), de MIDI-verbinding en de MIDI-bestand-import.

## Werkwijze
- Werk fase per fase (zie README › Stand van zaken). Na elke fase:
  1. `node --test "tests/*.test.mjs"` en `node tests/smoke.mjs` (headless Chrome, faalt bij JS-fouten). Voeg tests toe voor nieuwe pure logica en breid de rooktest uit voor nieuwe schermen.
  2. Geef de gebruiker een korte testlijst voor aan de piano.
  3. Maak een git commit met een duidelijke boodschap. **Push pas als de gebruiker zegt dat het goed is.**
- Nieuwe staptypes: module in `js/lesson/steps/`, registreren in `steps/index.js` én in `tests/step-types.mjs`, documenteren in de README.
- Screenshots ter controle: Chrome headless met `--window-size=844,390` (iPhone liggend).
