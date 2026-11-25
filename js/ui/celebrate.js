// Rustige beloningen: een kleine sterrenburst en een zacht belletje. Uit te zetten in de instellingen;
// animaties volgen ook prefers-reduced-motion.
import { ensureAudio, tone } from '../core/audio.js';
import { get } from '../core/storage.js';

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
export const animationsOn = () => get().settings.effects !== false && !reduced();
export const soundsOn = () => get().settings.effectSound !== false;

/** Zacht belletje: kind 'star' (1–3 sterren), 'streak' of 'record'. */
export function chime(kind = 'star', n = 1) {
  if (!soundsOn()) return;
  const ac = ensureAudio();
  if (!ac) return;
  const seq = kind === 'streak' ? [72, 76, 79, 84] : kind === 'record' ? [79, 84, 88] : [76, 79, 84].slice(0, Math.max(1, n));
  seq.forEach((m, i) => tone(m, 0.35, { at: ac.currentTime + i * 0.12, dur: 0.9 }));
}

/** Sterrenburst rond een element (bv. de sterren op het resultaatscherm). */
export function burst(el, count = 10) {
  if (!el || !animationsOn()) return;
  const host = document.createElement('div');
  host.className = 'burst';
  host.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    const a = (i / count) * Math.PI * 2, r = 50 + Math.random() * 40;
    s.style.setProperty('--dx', `${Math.cos(a) * r}px`);
    s.style.setProperty('--dy', `${Math.sin(a) * r}px`);
    s.style.animationDelay = `${Math.random() * 120}ms`;
    s.textContent = '★';
    host.appendChild(s);
  }
  el.style.position = el.style.position || 'relative';
  el.appendChild(host);
  setTimeout(() => host.remove(), 1400);
}

/** Viering op een resultaatscherm. */
export function celebrate(el, stars, { record = false } = {}) {
  if (stars <= 0) return;
  burst(el, 6 + stars * 3);
  chime(record ? 'record' : 'star', stars);
}

/** Korte melding bovenaan het scherm (los van een scherm). */
export function toast(text, ms = 2600) {
  let t = document.getElementById('appToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'appToast';
    t.className = 'app-toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), ms);
}
