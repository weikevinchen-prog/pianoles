// Een stukje spelen, in fases: voorspelen -> wachtmodus -> op tempo.
// Vingernummers staan in de blokjes; de vingertoppen op de toetsen tonen welke vinger nu moet.
// Score = beste poging van de laatste beoordeelde fase (tempo, anders wacht).
// Extra velden: view ('falling' | 'both' | 'staff'), metronome, anyKey (ritme: elke toets telt), key, pickup, transpose.
import { buildPiece, parseRange } from '../../core/notation.js';
import { tone, ensureAudio } from '../../core/audio.js';
import { createEngine } from '../../player/engine.js';
import { fallingLayer } from '../../player/falling.js';
import { handLayer, engineHands } from '../../player/handlayer.js';
import { fitRange } from '../../player/keyboard.js';
import { attachView, resolveView, createMetronome } from '../../player/views.js';
import { C } from '../../ui/colors.js';
import { starStr } from '../../ui/dom.js';

const PHASE = {
  demo: { label: 'Luisteren', text: '👂 Luister en kijk mee.' },
  wait: { label: 'Oefenen', text: '🐢 Speel mee in je eigen tempo: de noten wachten op jou.' },
  tempo: { label: 'Op tempo', text: '🎵 Nu op tempo! Speel mee met de muziek.' },
};

export default function piece(step, ctx) {
  const meter = step.meter || [4, 4], bpm = step.bpm || 80, pickup = step.pickup || 0;
  const { notes } = buildPiece({ rh: step.rh, lh: step.lh }, { bpm, meter, pickup });
  // transpose: alles een aantal halve tonen verschuiven (de handpositie volgt dan uit de noten)
  if (step.transpose) notes.forEach(n => (n.m += step.transpose));
  const position = step.transpose ? null : step.position;
  const [lo, hi] = step.range ? parseRange(step.range) : fitRange(notes);
  ctx.stage.setOptions({ lo, hi, keyRatio: 0.34, keyAspect: 5.5, keyNames: step.names || 'c' });
  const grand = notes.some(n => n.hand === 'lh') && notes.some(n => n.hand === 'rh');
  const view = attachView(ctx.stage, { view: resolveView(step.view), meter, pickup, key: step.key || 'C', bpm, fingers: step.staffFingers !== false, grand });
  ctx.onCleanup(() => view.destroy());
  const metro = step.metronome ? createMetronome({ bpm, meter, pickup }) : null;
  const phases = step.phases || ['demo', 'wait', 'tempo'];
  const scoredPhase = [...phases].reverse().find(p => p !== 'demo');
  const hands = step.hands || 'both';
  let engine = null, best = null, runId = 0;

  return new Promise(resolve => {
    ctx.onNote(({ m }) => {
      if (!engine) return;
      const r = engine.noteOn(m);
      ctx.stage.flash(m, r === 'hit' ? C.green : r === 'wrong' ? C.red : C.blue, r ? 260 : 150);
    });
    ctx.onSpace(() => engine && !engine.finished && engine.toggle());
    ctx.stage.onFrame = dt => {
      if (!engine) return;
      engine.update(dt);
      metro?.tick(engine);
      view.update();
    };

    function button(label, fn, main = false) {
      const b = document.createElement('button');
      b.textContent = label;
      if (main) b.className = 'main';
      b.onclick = fn;
      ctx.controls.appendChild(b);
      return b;
    }

    function run(i) {
      const id = ++runId;
      const phase = phases[i];
      ctx.controls.innerHTML = '';
      ctx.feedback('');
      ctx.prompt((step.text ? ctx.fmt(step.text) + '<br>' : '') + `<span class="phase">${PHASE[phase].text}</span>`);
      ctx.counter(phases.length > 1 ? `${PHASE[phase].label} ${i + 1}/${phases.length}` : '');
      engine = createEngine(notes, {
        mode: phase === 'tempo' ? 'play' : phase,
        hands: phase === 'demo' ? 'both' : hands,
        latency: ctx.settings().latency,
        anyKey: !!step.anyKey,
        playTone: n => {
          const d = n.d / engine.tempo;
          tone(n.m, 0.7, { dur: Math.max(0.5, d + 0.4) });
          ctx.stage.flash(n.m, C.green, d * 1000);
        },
        onFinish: res => { if (id === runId) done(i, res, id); },
      });
      view.setEngine(engine);
      metro?.reset();
      ctx.stage.setLayers([fallingLayer(engine), handLayer(engineHands(engine, position), { onKeys: true })]);
      if (phase === 'demo') button('Overslaan →', () => next(i));
      if (phase === 'wait' && phases.includes('tempo')) button('Meteen op tempo →', () => go(phases.indexOf('tempo')));
      ensureAudio();
      engine.toggle();
    }

    function go(i) {
      runId++;
      if (engine) engine.playing = false;
      engine = null;
      ctx.stage.setLayers([]);
      if (i < phases.length) run(i);
      else resolve(best ? { correct: best.correct, wrong: best.wrong, scored: true } : { correct: 0, wrong: 0, scored: false });
    }
    const next = i => go(i + 1);

    function done(i, res, id) {
      const phase = phases[i];
      if (phase === 'demo') { next(i); return; }
      const r = { correct: res.hit, wrong: res.wrong + res.miss, acc: res.acc };
      if (phase === scoredPhase && (!best || r.acc > best.acc)) best = r;
      const timing = phase === 'tempo' && (res.early || res.late) ? ` · ${res.early} te vroeg, ${res.late} te laat` : '';
      ctx.controls.innerHTML = '';
      const last = i === phases.length - 1;
      // Ging het oefenen goed, dan meteen door naar de volgende fase (tenzij je "Nog eens" kiest).
      if (!last && res.stars >= 2) {
        ctx.feedback(`<span class="stars small">${starStr(res.stars)}</span> ${res.acc}% juist. Goed! Volgende fase…`, 'ok');
        ctx.later(() => { if (id === runId) next(i); }, 1400);
        button('↺ Nog eens', () => run(i));
        return;
      }
      ctx.feedback(`<span class="stars small">${starStr(res.stars)}</span> ${res.acc}% juist${timing}`, res.stars ? 'ok' : 'bad');
      button('↺ Nog eens', () => run(i));
      button('Verder →', () => next(i), true);
    }

    run(0);
  });
}
