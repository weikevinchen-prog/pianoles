// "Speel met vinger 3 van je rechterhand": hand in een vaste positie, het nummer bepaalt de toets.
// position: {rh: 'C4', lh: 'C3'}; pool: 'R1 R3 L5' (standaard: alle vingers van de handen in de positie)
import { C, MARK } from '../../ui/colors.js';
import { setupStage, showHands, pick, tokens, HAND_NAME } from './common.js';

export default function fingerplay(step, ctx) {
  setupStage(step, ctx, { def: [48, 76], names: step.names || 'c' });
  let active = {};
  const pos = showHands(ctx, step.position, () => active);
  const pool = step.pool ? tokens(step.pool) : Object.keys(pos).flatMap(h => [1, 2, 3, 4, 5].map(f => (h === 'rh' ? 'R' : 'L') + f));
  const rounds = step.rounds || 8;
  let correct = 0, wrong = 0, round = 0, tries = 0, target = null, prev = null;

  return new Promise(resolve => {
    function next() {
      active = {};
      ctx.stage.clearMarks();
      if (round >= rounds) { resolve({ correct, wrong, scored: true }); return; }
      const tok = pick(pool, prev);
      prev = tok;
      const hand = tok[0] === 'L' ? 'lh' : 'rh', f = +tok.slice(1);
      target = { hand, f, m: pos[hand][f] };
      tries = 0;
      round++;
      ctx.counter(`${round}/${rounds}`);
      ctx.prompt(ctx.fmt(`Speel met **vinger ${f}** van je **${HAND_NAME[hand]}**.`));
    }
    ctx.onNote(({ m }) => {
      if (!target) return;
      if (m === target.m) {
        if (tries === 0) correct++;
        active = { [target.hand]: [target.f] };
        ctx.stage.flash(m, C.green, 450);
        ctx.feedback(ctx.praise(), 'ok');
        target = null;
        ctx.later(next, 650);
        return;
      }
      wrong++;
      tries++;
      ctx.stage.flash(m, C.red, 380);
      // Welke vinger zou deze toets spelen?
      let who = null;
      for (const h of Object.keys(pos)) for (let f = 1; f <= 5; f++) if (pos[h][f] === m) who = { h, f };
      ctx.feedback(who
        ? `Dat was vinger ${who.f} van je ${HAND_NAME[who.h]} (${ctx.name(m)}).`
        : `Dat was ${ctx.name(m, true)}: die ligt buiten de handpositie.`, 'bad');
      if (tries >= 2) { active = { [target.hand]: [target.f] }; ctx.stage.mark(target.m, MARK.hint); }
    });
    next();
  });
}
