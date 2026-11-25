// Een stukje spelen met vallende noten, in fases: voorspelen -> wachtmodus -> op tempo.
// Vingernummers staan in de blokjes; de kleine hand boven het klavier toont welke vinger nu moet.
// Score = beste poging van de laatste beoordeelde fase (tempo, anders wacht).
import { buildPiece, parseRange } from '../../core/notation.js';
import { tone, ensureAudio } from '../../core/audio.js';
import { createEngine } from '../../player/engine.js';
import { fallingLayer } from '../../player/falling.js';
import { handLayer, engineHands } from '../../player/handlayer.js';
import { fitRange } from '../../player/keyboard.js';
import { C } from '../../ui/colors.js';
import { starStr } from '../../ui/dom.js';

const PHASE = {
  demo: { label: 'Luisteren', text: '👂 Luister en kijk mee.' },
  wait: { label: 'Oefenen', text: '🐢 Speel mee in je eigen tempo: de noten wachten op jou.' },
  tempo: { label: 'Op tempo', text: '🎵 Nu op tempo! Speel mee met de muziek.' },
};

export default function piece(step, ctx) {
  const { notes } = buildPiece({ rh: step.rh, lh: step.lh }, { bpm: step.bpm || 80, meter: step.meter || [4, 4] });
  const [lo, hi] = step.range ? parseRange(step.range) : fitRange(notes);
  ctx.stage.setOptions({ lo, hi, keyRatio: 0.34, keyAspect: 5.5, keyNames: step.names || 'c' });
  const phases = step.phases || ['demo', 'wait', 'tempo'];
  const scoredPhase = [...phases].reverse().find(p => p !== 'demo');
  const hands = step.hands || 'both';
  let engine = null, best = null, phaseIdx = 0;

  return new Promise(resolve => {
    ctx.onNote(({ m }) => {
      if (!engine) return;
      const r = engine.noteOn(m);
      ctx.stage.flash(m, r === 'hit' ? C.green : r === 'wrong' ? C.red : C.blue, r ? 260 : 150);
    });
    ctx.onSpace(() => engine && !engine.finished && engine.toggle());
    ctx.stage.onFrame = dt => engine && engine.update(dt);

    function button(label, fn, main = false) {
      const b = document.createElement('button');
      b.textContent = label;
      if (main) b.className = 'main';
      b.onclick = fn;
      ctx.controls.appendChild(b);
      return b;
    }

    function run(i) {
      phaseIdx = i;
      const phase = phases[i];
      ctx.controls.innerHTML = '';
      ctx.feedback('');
      ctx.prompt((step.text ? ctx.fmt(step.text) + '<br>' : '') + `<span class="phase">${PHASE[phase].text}</span>`);
      ctx.counter(phases.length > 1 ? `${PHASE[phase].label} ${i + 1}/${phases.length}` : '');
      engine = createEngine(notes, {
        mode: phase === 'tempo' ? 'play' : phase,
        hands: phase === 'demo' ? 'both' : hands,
        latency: ctx.settings().latency,
        playTone: n => {
          const d = n.d / engine.tempo;
          tone(n.m, 0.7, { dur: Math.max(0.5, d + 0.4) });
          ctx.stage.flash(n.m, C.green, d * 1000);
        },
        onFinish: res => done(i, res),
      });
      ctx.stage.setLayers([fallingLayer(engine), handLayer(engineHands(engine, step.position), { onKeys: true })]);
      if (phase === 'demo') button('Overslaan →', () => next(i));
      if (phase === 'wait' && phases.includes('tempo')) button('Meteen op tempo →', () => go(phases.indexOf('tempo')));
      ensureAudio();
      engine.toggle();
    }

    function go(i) {
      if (engine) engine.playing = false;
      engine = null;
      ctx.stage.setLayers([]);
      if (i < phases.length) run(i);
      else resolve(best ? { correct: best.correct, wrong: best.wrong, scored: true } : { correct: 0, wrong: 0, scored: false });
    }
    const next = i => go(i + 1);

    function done(i, res) {
      const phase = phases[i];
      if (phase === 'demo') { next(i); return; }
      const r = { correct: res.hit, wrong: res.wrong + res.miss, acc: res.acc };
      if (phase === scoredPhase && (!best || r.acc > best.acc)) best = r;
      const timing = phase === 'tempo' && (res.early || res.late) ? ` · ${res.early} te vroeg, ${res.late} te laat` : '';
      ctx.feedback(`<span class="stars small">${starStr(res.stars)}</span> ${res.acc}% juist${timing}`, res.stars ? 'ok' : 'bad');
      ctx.controls.innerHTML = '';
      const last = i === phases.length - 1;
      // Ging het oefenen goed, dan meteen door naar de volgende fase.
      if (!last && res.stars >= 2) {
        ctx.feedback(`<span class="stars small">${starStr(res.stars)}</span> ${res.acc}% juist. Goed! Volgende fase…`, 'ok');
        ctx.later(() => { if (phaseIdx === i) next(i); }, 1400);
        button('↺ Nog eens', () => run(i));
        return;
      }
      button('↺ Nog eens', () => run(i));
      button('Verder →', () => next(i), true);
    }

    run(0);
  });
}
