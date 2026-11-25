// Speelt de stappen van een les (of van de instaptest) na elkaar af.
import { bus } from '../core/events.js';
import { noteName } from '../core/notation.js';
import { get as getStore } from '../core/storage.js';
import { fmt, textStyle } from '../ui/dom.js';
import { starsFor } from '../player/engine.js';
import STEPS from './steps/index.js';

const PRAISE = ['Juist!', 'Goed zo!', 'Top!', 'Ja, dat is hem!', 'Prima!'];

/** Score over alle beoordeelde stappen samen. */
export function summarize(results) {
  const scored = results.filter(r => r.scored);
  const correct = scored.reduce((s, r) => s + r.correct, 0);
  const wrong = scored.reduce((s, r) => s + r.wrong, 0);
  const acc = correct + wrong ? Math.round(correct / (correct + wrong) * 100) : 100;
  return { acc, stars: starsFor(acc), correct, wrong };
}

/**
 * view: { stage, prompt, feedback, controls, counter, dots } (DOM-elementen + podium)
 * opts.onStep(i, n)  na elke stapwissel
 * opts.after(result, i) -> false om te stoppen (instaptest)
 * opts.startAt      beginnen bij deze stap (0-gebaseerd)
 */
export function createRunner(steps, view, opts = {}) {
  let aborted = false, subs = [], timers = [];

  function cleanStep() {
    subs.forEach(u => u());
    subs = [];
    timers.forEach(clearTimeout);
    timers = [];
    view.controls.innerHTML = '';
    view.feedback.textContent = '';
    view.feedback.className = 'feedback';
    view.counter.textContent = '';
    view.stage.clearMarks();
    view.stage.setLayers([]);
    view.stage.onFrame = null;
    view.stage.overlay.innerHTML = '';
    if (view.stageDefaults) view.stage.setOptions(view.stageDefaults);
  }

  function makeCtx() {
    return {
      stage: view.stage,
      controls: view.controls,
      fmt,
      prompt(html) { view.prompt.innerHTML = html; },
      feedback(text, kind = '') {
        view.feedback.innerHTML = text;
        view.feedback.className = 'feedback' + (kind ? ' ' + kind : '');
      },
      counter(text) { view.counter.textContent = text; },
      praise: () => PRAISE[Math.floor(Math.random() * PRAISE.length)],
      name: (m, octave = false) => noteName(m, textStyle(), octave),
      settings: () => getStore().settings,
      onNote(fn) { if (!aborted) subs.push(bus.on('noteon', fn)); },
      onSpace(fn) { if (!aborted) subs.push(bus.on('space', fn)); },
      later(fn, ms) { if (!aborted) timers.push(setTimeout(() => { if (!aborted) fn(); }, ms)); },
      get aborted() { return aborted; },
    };
  }

  async function start() {
    const results = [];
    for (let i = Math.max(0, Math.min(steps.length - 1, opts.startAt || 0)); i < steps.length; i++) {
      if (aborted) return null;
      opts.onStep?.(i, steps.length);
      const step = steps[i];
      const run = STEPS[step.type];
      if (!run) throw new Error(`Onbekend staptype: ${step.type}`);
      const r = await run(step, makeCtx());
      cleanStep();
      if (aborted) return null;
      results.push({ ...r, type: step.type });
      if (opts.after && opts.after(r, i) === false) break;
    }
    return { ...summarize(results), results };
  }

  return {
    start,
    abort() { aborted = true; cleanStep(); },
  };
}
