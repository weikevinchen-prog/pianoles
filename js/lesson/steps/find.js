// Toetsen vinden: "speel alle C's", "speel de centrale C", "van laag naar hoog".
//   mode 'all'     alle doeltoetsen in willekeurige volgorde
//   mode 'ordered' in de gegeven volgorde (notennaam zonder octaaf = van laag naar hoog)
//   mode 'any'     één doeltoets volstaat
import { parseTargets, pcOf } from '../../core/notation.js';
import { C, MARK } from '../../ui/colors.js';
import { setupStage, showHands } from './common.js';

export default function find(step, ctx) {
  const [lo, hi] = setupStage(step, ctx);
  const mode = step.mode || 'all';
  const { notes: targets, pcs, exact } = parseTargets(step.targets, lo, hi);
  const withOct = exact.length > 0 || mode === 'ordered';
  const total = mode === 'any' ? 1 : targets.length;
  const done = new Set();
  let correct = 0, wrong = 0, wrongRun = 0, idx = 0, finished = false;

  ctx.prompt(ctx.fmt(step.text));
  const progress = () => ctx.counter(mode === 'any' ? '' : `${done.size}/${total}`);
  progress();

  const remaining = () => (mode === 'ordered' ? [targets[idx]] : targets.filter(m => !done.has(m)));
  // Met een handpositie: de vinger voor de volgende noot licht op (bij 'ordered').
  if (step.position) {
    const pos = showHands(ctx, step.position, () => {
      if (mode !== 'ordered' || idx >= targets.length) return {};
      for (const h of Object.keys(pos)) for (let f = 1; f <= 5; f++) if (pos[h][f] === targets[idx]) return { [h]: [f] };
      return {};
    });
  }
  function hint() {
    for (const m of remaining()) if (m >= lo && m <= hi) ctx.stage.mark(m, MARK.hint);
  }

  return new Promise(resolve => {
    ctx.onNote(({ m }) => {
      if (finished) return;
      const isTarget = mode === 'ordered' ? m === targets[idx] : targets.includes(m) && !done.has(m);
      if (isTarget) {
        done.add(m);
        idx++;
        correct++;
        wrongRun = 0;
        ctx.stage.flash(m, C.green, 450);
        ctx.stage.mark(m, MARK.done);
        ctx.feedback(ctx.praise(), 'ok');
        progress();
        if (mode === 'any' || done.size >= total) {
          finished = true;
          ctx.later(() => resolve({ correct, wrong, scored: step.scored !== false }), 650);
        }
        return;
      }
      if (done.has(m)) {
        ctx.stage.flash(m, C.blue, 200);
        ctx.feedback('Die had je al ✓', 'info');
        return;
      }
      const name = ctx.name(m, withOct);
      if ((m < lo || m > hi) && pcs.has(pcOf(m)) && mode !== 'ordered') {
        ctx.feedback(`Ook een ${name}! Zoek nu die op het scherm.`, 'info');
        return;
      }
      wrong++;
      wrongRun++;
      ctx.stage.flash(m, C.red, 380);
      const extra = mode === 'ordered' && targets.includes(m) ? 'Goede noot, maar niet in de juiste volgorde. ' : '';
      ctx.feedback(`Dat was ${name}. ${extra}${step.hint ? ctx.fmt(step.hint) : ''}`, 'bad');
      if (wrongRun >= (step.hintAfter ?? 2)) hint();
    });
  });
}
