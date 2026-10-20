import { transliterate, toIast } from './vaak/index.js';
import { prefersReduced } from './env.js';

const SAMPLE = 'saMskRtam';
/* Combining signs need a base to read clearly on their own, so they are shown on a dotted circle. */
const shown = (piece) => (/^[\u0900-\u0903\u093A-\u094F\u0962\u0963]/.test(piece) ? `\u25CC${piece}` : piece);
const SCHEME_LABEL = { latin: 'Latin scheme', iast: 'IAST scheme' };

/* The portfolio demo runs the real engine (assets/js/vaak/). Every number and glyph below comes from its output. */
export function initVaak() {
  const root = document.querySelector('[data-vaak]');
  if (!root) return;
  const input = root.querySelector('[data-vaak-input]');
  const out = root.querySelector('[data-vaak-out]');
  const iast = root.querySelector('[data-vaak-iast]');
  const trace = root.querySelector('[data-vaak-trace]');
  const scheme = root.querySelector('[data-vaak-scheme]');
  const replay = root.querySelector('[data-vaak-replay]');
  const stages = Object.fromEntries([...document.querySelectorAll('[data-stage]')].map((el) => [el.dataset.stage, el]));
  let timer = null, touched = false, lastCount = 0;

  /* Announce results only once the visitor takes over; autoplay would otherwise be read out letter by letter. */
  const setLive = (on) => on ? out.setAttribute('aria-live', 'polite') : out.removeAttribute('aria-live');
  setLive(false);

  function tokenChip(t, isNew) {
    const li = document.createElement('li');
    li.className = 'trace-tok' + (isNew ? ' is-new' : '');
    li.dataset.kind = t.kind;
    const src = document.createElement('span'); src.className = 'trace-src'; src.textContent = t.src === ' ' ? '␣' : t.src;
    const o = document.createElement('span'); o.className = 'trace-out';
    if (t.inherent) o.textContent = 'inherent a';
    else if (t.kind === 'X') o.textContent = 'kept';
    else { o.classList.add('deva-out'); o.textContent = shown(t.piece); }
    li.append(src, o);
    return li;
  }

  function render() {
    const r = transliterate(input.value);
    const roman = toIast(r.text);
    out.textContent = r.text || '—';
    iast.textContent = roman || '—';
    scheme.textContent = SCHEME_LABEL[r.scheme];
    const visible = r.tokens.filter((t) => !/^\s+$/.test(t.src)).slice(-14);
    trace.replaceChildren(...visible.map((t, i) => tokenChip(t, i === visible.length - 1 && r.tokens.length > lastCount)));
    lastCount = r.tokens.length;
    if (stages.input) {
      stages.input.textContent = input.value || '—';
      stages.normalize.textContent = r.normalized === input.value ? SCHEME_LABEL[r.scheme] : `${r.normalized} · ${SCHEME_LABEL[r.scheme]}`;
      stages.tokenize.textContent = visible.map((t) => t.src).join(' · ') || '—';
      stages.compose.textContent = visible.map((t) => (t.inherent ? 'अ' : shown(t.piece))).join(' ') || '—';
      stages.output.textContent = r.text || '—';
    }
  }

  const stop = () => { clearTimeout(timer); timer = null; };

  function play(text) {
    stop();
    if (prefersReduced()) { input.value = text; render(); return; }
    input.value = '';
    lastCount = 0; render();
    let n = 0;
    const step = () => {
      n++;
      input.value = [...text].slice(0, n).join('');
      render();
      if (n < [...text].length) timer = setTimeout(step, 120);
    };
    timer = setTimeout(step, 250);
  }

  const takeOver = () => { touched = true; setLive(true); };
  input.addEventListener('input', () => { stop(); takeOver(); render(); });
  root.querySelectorAll('[data-vaak-sample]').forEach((b) =>
    b.addEventListener('click', () => { takeOver(); play(b.dataset.vaakSample); }));
  replay.addEventListener('click', () => play(SAMPLE));

  render();

  /* Type the sample once, the first time the demo is on screen. */
  if (!prefersReduced() && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { io.disconnect(); if (!touched && document.activeElement !== input) play(SAMPLE); }
    }, { threshold: 0.5 });
    io.observe(root);
  }
}
