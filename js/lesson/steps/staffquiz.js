// Notenleesquiz: een noot op de notenbalk -> speel hem op de piano (precies die toets, tenzij octave: false).
// clef: 'treble' | 'bass' | 'grand'; pool: 'C4 D4 E4'; rounds
// Fouten worden bijgehouden per noot (store.weak.notes) voor de dagelijkse opwarming.
import { noteNum, pcOf } from '../../core/notation.js';
import * as store from '../../core/storage.js';
import { renderStatic } from '../../player/staff.js';
import { C, MARK } from '../../ui/colors.js';
import { setupStage, showPanel, pick, tokens } from './common.js';

export function trackNote(m, ok) {
  store.update(s => {
    const w = s.weak.notes[m] || { seen: 0, wrong: 0 };
    w.seen++;
    if (!ok) w.wrong++;
    s.weak.notes[m] = w;
  });
}

export default function staffquiz(step, ctx) {
  setupStage(step, ctx, { def: [48, 72], names: 'none' });
  ctx.stage.setOptions({ keyRatio: 0.42, keyAspect: 5.5, fallTop: 1 });
  const panel = showPanel(ctx, '<div class="staff-static"></div>', 'top');
  const host = panel.firstChild;
  const pool = tokens(step.pool).map(noteNum);
  const clef = step.clef || 'treble';
  const exactOct = step.octave !== false;
  const rounds = step.rounds || 8;
  let correct = 0, wrong = 0, round = 0, tries = 0, target = null, prev = null, shown = {};

  const draw = () => renderStatic(host, { clef, notes: [shown.m], labels: [shown.label || ''], colors: [shown.color || null], key: step.key || 'C' })
    .catch(e => { host.innerHTML = `<p class="staff-error">${e.message}<br>Noot: <b>${ctx.name(shown.m, true)}</b></p>`; });
  const ro = new ResizeObserver(() => { if (shown.m != null) draw(); });
  ro.observe(host);
  ctx.onCleanup(() => ro.disconnect());

  return new Promise(resolve => {
    function next() {
      ctx.stage.clearMarks();
      if (round >= rounds) { resolve({ correct, wrong, scored: true }); return; }
      target = pick(pool, prev);
      prev = target;
      tries = 0;
      round++;
      shown = { m: target };
      draw();
      ctx.counter(`${round}/${rounds}`);
      ctx.prompt(ctx.fmt(step.text || 'Welke noot is dit? **Speel hem** op je piano.'));
    }
    ctx.onNote(({ m }) => {
      if (target == null) return;
      const ok = exactOct ? m === target : pcOf(m) === pcOf(target);
      if (ok) {
        if (tries === 0) correct++;
        trackNote(target, tries === 0);
        ctx.stage.flash(m, C.green, 450);
        ctx.feedback(`${ctx.praise()} Dat is ${ctx.name(target, true)}.`, 'ok');
        shown = { m: target, label: ctx.name(target, true), color: '#1e9e63' };
        draw();
        target = null;
        ctx.later(next, 900);
        return;
      }
      wrong++;
      tries++;
      ctx.stage.flash(m, C.red, 380);
      const dir = m < target ? 'Hoger!' : m > target ? 'Lager!' : '';
      ctx.feedback(`Dat was ${ctx.name(m, true)}. ${exactOct ? dir : ''}`, 'bad');
      if (tries === 2) {
        shown = { m: target, label: ctx.name(target, true) };
        draw();
        ctx.stage.mark(target, MARK.hint);
      }
    });
    next();
  });
}
