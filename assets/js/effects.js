import { finePointer, reducedMotion } from './env.js';

/* Cursor-aware card highlight + magnetic CTAs. Mouse only, never under reduced motion. */
export function initEffects() {
  if (!finePointer.matches) return;

  document.querySelectorAll('[data-spotlight]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  });

  if (reducedMotion.matches) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    const reset = () => { el.classList.remove('is-tracking'); el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px'); };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.classList.add('is-tracking');
      el.style.setProperty('--tx', `${(dx * 6).toFixed(1)}px`);
      el.style.setProperty('--ty', `${(dy * 4).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', reset);
    el.addEventListener('blur', reset);
  });
}
