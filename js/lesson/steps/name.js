// Benoemen: een toets licht goud op, jij kiest de juiste naam.
import { pcNum, pcOf, noteName } from '../../core/notation.js';
import { MARK } from '../../ui/colors.js';
import { textStyle } from '../../ui/dom.js';
import { setupStage, pick, tokens } from './common.js';

export default function nameStep(step, ctx) {
  const [lo, hi] = setupStage(step, ctx);
  const pcs = tokens(step.pool || 'C D E F G A B').map(pcNum);
  const cands = [];
  for (let m = lo; m <= hi; m++) if (pcs.includes(pcOf(m))) cands.push(m);
  const rounds = step.rounds || 8;
  let correct = 0, wrong = 0, round = 0, target = null, prevT = null, tries = 0;
  const style = textStyle();

  const row = document.createElement('div');
  row.className = 'answers';
  const buttons = pcs.map(pc => {
    const b = document.createElement('button');
    b.textContent = noteName(pc + 60, style);
    b.onclick = () => answer(pc, b);
    row.appendChild(b);
    return b;
  });
  ctx.controls.appendChild(row);

  let resolveFn;
  function next() {
    ctx.stage.clearMarks();
    buttons.forEach(b => { b.disabled = false; b.className = ''; });
    if (round >= rounds) { resolveFn({ correct, wrong, scored: true }); return; }
    target = pick(cands, prevT);
    prevT = target;
    tries = 0;
    round++;
    ctx.stage.mark(target, { ...MARK.gold, label: '?' });
    ctx.prompt(ctx.fmt(step.text || 'Hoe heet de **gouden** toets?'));
    ctx.counter(`${round}/${rounds}`);
  }
  function answer(pc, b) {
    if (target == null) return;
    if (pc === pcOf(target)) {
      if (tries === 0) correct++;
      b.className = 'yes';
      ctx.stage.mark(target, { ...MARK.done, label: noteName(target, style) });
      ctx.feedback(ctx.praise(), 'ok');
      target = null;
      ctx.later(next, 650);
    } else {
      wrong++;
      tries++;
      b.className = 'no';
      b.disabled = true;
      ctx.feedback(`Nee, het is geen ${b.textContent}. Kijk naar de zwarte toetsen ernaast.`, 'bad');
    }
  }
  return new Promise(resolve => { resolveFn = resolve; next(); });
}
