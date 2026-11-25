// Alle staptypes. Een staptype is een functie (step, ctx) -> Promise<{correct, wrong, scored}>.
import explain from './explain.js';
import find from './find.js';
import quiz from './quiz.js';
import name from './name.js';

export default { explain, find, quiz, name };
