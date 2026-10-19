import { transliterate } from './translit.js';
import { prefersReduced } from './env.js';

const SAMPLE = 'saMskRtam';

export function initVaak() {
  const root = document.querySelector('[data-vaak]');
  if (!root) return;
  const input = root.querySelector('[data-vaak-input]');
  const keys = root.querySelector('[data-vaak-keys]');
  const out = root.querySelector('[data-vaak-out]');
  const replay = root.querySelector('[data-vaak-replay]');
  let timer = null, touched = false;

  /* Live region only after the visitor takes over; otherwise autoplay would be announced letter by letter. */
  out.removeAttribute('aria-live');

  function render(hit) {
    out.textContent = transliterate(input.value) || '—';
    const chars = [...input.value].slice(-8);
    keys.replaceChildren(...chars.map((c, i) => {
      const k = document.createElement('span');
      k.className = 'keycap' + (hit && i === chars.length - 1 ? ' is-hit' : '');
      k.textContent = c === ' ' ? '␣' : c;
      return k;
    }));
  }

  const stop = () => { clearTimeout(timer); timer = null; };

  function play(text) {
    stop();
    if (prefersReduced()) { input.value = text; render(false); return; }
    input.value = '';
    render(false);
    let n = 0;
    const step = () => {
      n++;
      input.value = text.slice(0, n);
      render(true);
      if (n < text.length) timer = setTimeout(step, 120);
    };
    timer = setTimeout(step, 250);
  }

  input.addEventListener('input', () => {
    stop();
    if (!touched) { touched = true; out.setAttribute('aria-live', 'polite'); }
    render(true);
  });
  root.querySelectorAll('[data-vaak-sample]').forEach((b) =>
    b.addEventListener('click', () => { touched = true; out.setAttribute('aria-live', 'polite'); play(b.dataset.vaakSample); }));
  replay.addEventListener('click', () => play(SAMPLE));

  render(false);

  /* Type the sample once, the first time the preview is on screen. */
  if (!prefersReduced()) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { io.disconnect(); if (!touched && document.activeElement !== input) play(SAMPLE); }
    }, { threshold: 0.6 });
    io.observe(root);
  }
}
