// Uitleg: tekst + gemarkeerde toetsen. Je mag vrij spelen; "Verder" (of spatie) gaat door.
import { C } from '../../ui/colors.js';
import { setupStage, applyMarks } from './common.js';

export default function explain(step, ctx) {
  const [lo, hi] = setupStage(step, ctx, { names: 'c' });
  applyMarks(step.show, ctx, lo, hi);
  ctx.prompt(ctx.fmt(step.text));
  return new Promise(resolve => {
    const btn = document.createElement('button');
    btn.className = 'main';
    btn.textContent = step.button || 'Verder →';
    const done = () => resolve({ correct: 0, wrong: 0, scored: false });
    btn.onclick = done;
    ctx.controls.appendChild(btn);
    ctx.onSpace(done);
    ctx.onNote(({ m }) => ctx.stage.flash(m, C.blue, 200));
    btn.focus({ preventScroll: true });
  });
}
