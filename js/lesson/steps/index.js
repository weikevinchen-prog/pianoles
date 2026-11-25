// Alle staptypes. Een staptype is een functie (step, ctx) -> Promise<{correct, wrong, scored}>.
// Nieuw type? Ook toevoegen in tests/step-types.mjs en documenteren in README.md.
import explain from './explain.js';
import find from './find.js';
import quiz from './quiz.js';
import name from './name.js';
import fingers from './fingers.js';
import fingerplay from './fingerplay.js';
import piece from './piece.js';
import staffquiz from './staffquiz.js';

export default { explain, find, quiz, name, fingers, fingerplay, piece, staffquiz };
