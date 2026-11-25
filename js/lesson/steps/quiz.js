// Speelquiz: "Speel een F" (eender welk octaaf) of "Speel E4" (precies die toets), een aantal rondes.
// Score: rondes die je in één keer juist had, tegenover het aantal foute noten.
import { noteNum, pcNum, pcOf, parseTargets } from '../../core/notation.js';
import { C, MARK } from '../../ui/colors.js';
import { setupStage, pick, tokens } from './common.js';

export default function quiz(step, ctx) {
  const [lo, hi] = setupStage(step, ctx);
  const pool = tokens(step.pool);
  const rounds = step.rounds || 8;
  let correct = 0, wrong = 0, round = 0, prev = null, target = null, tries = 0;

  return new Promise(resolve => {
    function next() {
      ctx.stage.clearMarks();
      if (round >= rounds) { resolve({ correct, wrong, scored: true }); return; }
      target = pick(pool, prev);
      prev = target;
      tries = 0;
      round++;
      const exact = /\d/.test(target);
      const text = step.text || (exact ? 'Speel {X}.' : 'Speel een {X}.');
      ctx.prompt(ctx.fmt(text.replace('{X}', `{${target}}`)));
      ctx.counter(`${round}/${rounds}`);
    }
    ctx.onNote(({ m }) => {
      if (!target) return;
      const exact = /\d/.test(target);
      const ok = exact ? m === noteNum(target) : pcOf(m) === pcNum(target);
      if (ok) {
        if (tries === 0) correct++;
        target = null;
        ctx.stage.flash(m, C.green, 450);
        ctx.feedback(ctx.praise(), 'ok');
        ctx.later(next, 600);
        return;
      }
      wrong++;
      tries++;
      ctx.stage.flash(m, C.red, 380);
      ctx.feedback(`Dat was ${ctx.name(m, exact)}. Probeer opnieuw.`, 'bad');
      if (tries >= 2) for (const t of parseTargets(target, lo, hi).notes) ctx.stage.mark(t, MARK.hint);
    });
    next();
  });
}
