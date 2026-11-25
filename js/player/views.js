// Weergave van een stuk op het podium: 'falling' (vallende noten), 'both' (notenbalk boven, vallende
// noten eronder) of 'staff' (alleen bladmuziek, met het klavier voor feedback).
import { get as getStore } from '../core/storage.js';
import { click } from '../core/audio.js';
import { LEAD } from './engine.js';
import { createStaffView } from './staff.js';

const FALL_TOP = { falling: 0, both: 0.5, staff: 1 };

/** Instelling gaat voor, behalve bij 'auto': dan beslist de les. */
export function resolveView(stepView) {
  const s = getStore().settings.view;
  return s && s !== 'auto' ? s : stepView || 'falling';
}

/** opts: view, meter, pickup, key, bpm, fingers, grand (beide handen: grote notenbalk, meer hoogte nodig) */
export function attachView(stage, opts) {
  const view = FALL_TOP[opts.view] != null ? opts.view : 'falling';
  stage.setOptions({ fallTop: view === 'both' && opts.grand ? 0.64 : FALL_TOP[view] });
  let panel = null, staff = null;
  if (view !== 'falling') {
    panel = document.createElement('div');
    panel.className = 'staff-panel ' + view;
    stage.overlay.prepend(panel); // onder de startboodschap en het eindscherm
    staff = createStaffView(panel, opts);
  }
  return {
    view,
    setEngine(e) { staff?.setEngine(e); },
    update() { staff?.update(); },
    destroy() { staff?.destroy(); panel?.remove(); stage.setOptions({ fallTop: 0 }); },
  };
}

/** Metronoom die meetikt met de klok van een engine (ook tijdens het aftellen). */
export function createMetronome({ bpm, meter = [4, 4], pickup = 0 }) {
  const spb = 60 / bpm;
  let last = null;
  return {
    reset() { last = null; },
    tick(engine) {
      if (!engine.playing || engine.mode === 'wait') { last = null; return; }
      if (engine.clock < -LEAD) return;
      const beat = Math.floor(engine.clock / spb + 1e-6);
      if (last === null) { last = beat; return; }
      while (last < beat) {
        last++;
        const inBar = (((last - pickup) % meter[0]) + meter[0]) % meter[0];
        click(inBar === 0);
      }
    },
  };
}
