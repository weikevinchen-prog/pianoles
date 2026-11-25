// Vingernummers oefenen met de handtekening.
//   mode 'tap'  "Tik op vinger 3 van je rechterhand" -> tik op de tekening
//   mode 'name' een vinger licht goud op -> kies het nummer
import { handSVG } from '../../ui/hands.js';
import { showPanel, HAND_NAME } from './common.js';

export default function fingers(step, ctx) {
  const hands = step.hand === 'both' || !step.hand ? ['lh', 'rh'] : [step.hand];
  const mode = step.mode || 'tap';
  const rounds = step.rounds || 6;
  let correct = 0, wrong = 0, round = 0, tries = 0, target = null, prevKey = '';
  const panel = showPanel(ctx, '', 'hands-panel');
  let resolveFn, row = null;

  function draw(highlight = []) {
    panel.innerHTML = `<div class="hands-pair">${hands.map(h => handSVG(h, {
      interactive: mode === 'tap',
      numbers: mode !== 'name',
      highlight: target && target.hand === h ? highlight : [],
    })).join('')}</div>`;
  }

  function next() {
    row?.querySelectorAll('button').forEach(b => { b.disabled = false; b.className = ''; });
    if (round >= rounds) { resolveFn({ correct, wrong, scored: true }); return; }
    let t;
    do { t = { hand: hands[Math.floor(Math.random() * hands.length)], f: 1 + Math.floor(Math.random() * 5) }; } while (`${t.hand}${t.f}` === prevKey);
    prevKey = `${t.hand}${t.f}`;
    target = t;
    tries = 0;
    round++;
    ctx.counter(`${round}/${rounds}`);
    if (mode === 'tap') {
      ctx.prompt(ctx.fmt(`Tik op **vinger ${t.f}** van je **${HAND_NAME[t.hand]}**.`));
      draw();
    } else {
      ctx.prompt(ctx.fmt(`Welk nummer heeft de **gouden** vinger van je ${HAND_NAME[t.hand]}?`));
      draw([t.f]);
    }
  }

  function answer(hand, f, el) {
    if (!target) return;
    if (hand === target.hand && f === target.f) {
      if (tries === 0) correct++;
      ctx.feedback(ctx.praise(), 'ok');
      if (mode === 'tap') draw([f]);
      else el?.classList.add('yes');
      target = null;
      ctx.later(next, 700);
    } else {
      wrong++;
      tries++;
      const msg = mode === 'tap'
        ? (hand !== target.hand ? `Dat is je ${HAND_NAME[hand]}. Kijk naar de andere hand.` : `Dat is vinger ${f}. Duim = 1, pink = 5.`)
        : `Nee, niet ${f}. Tel vanaf de duim: duim = 1.`;
      ctx.feedback(msg, 'bad');
      if (el) { el.classList.add('no'); el.disabled = true; }
    }
  }

  if (mode === 'tap') {
    panel.addEventListener('click', e => {
      const el = e.target.closest('[data-finger]');
      if (!el) return;
      const hand = el.closest('.hand-fig').classList.contains('lh') ? 'lh' : 'rh';
      answer(hand, +el.dataset.finger, null);
    });
    panel.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset?.finger) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    });
  } else {
    row = document.createElement('div');
    row.className = 'answers';
    for (let f = 1; f <= 5; f++) {
      const b = document.createElement('button');
      b.textContent = f;
      b.onclick = () => answer(target?.hand, f, b);
      row.appendChild(b);
    }
    ctx.controls.appendChild(row);
  }

  return new Promise(resolve => { resolveFn = resolve; next(); });
}
