// Gedeelde lay-out voor les en instaptest: compacte tekstbalk bovenaan, groot klavier onderaan.
import { createStage } from '../player/stage.js';

export function lessonView(root) {
  root.innerHTML = `
  <section class="screen fill lesson">
    <div class="lesson-top">
      <div class="prompt" id="lPrompt"></div>
      <div class="counter" id="lCount"></div>
      <div class="feedback" id="lFb" aria-live="polite"></div>
      <div class="controls" id="lCtl"></div>
      <div class="dots" id="lDots" aria-hidden="true"></div>
    </div>
    <div class="stage-wrap" id="lWrap"></div>
  </section>`;
  const q = s => root.querySelector(s);
  const stage = createStage(q('#lWrap'), { keyRatio: 0.8, keyAspect: 6.5, keyNames: 'none' });
  return {
    stage,
    prompt: q('#lPrompt'),
    counter: q('#lCount'),
    feedback: q('#lFb'),
    controls: q('#lCtl'),
    dots: q('#lDots'),
    setDots(i, n) {
      q('#lDots').innerHTML = Array.from({ length: n }, (_, k) => `<span class="${k < i ? 'done' : k === i ? 'cur' : ''}"></span>`).join('');
    },
  };
}
