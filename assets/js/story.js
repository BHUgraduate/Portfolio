import { prefersReduced } from './env.js';

/* Per-chapter state of the convergence figure.
   threads: draw progress 0–1 for code / science / sanskrit; then which labels and nodes are lit. */
const FIG = [
  { p: [0, 0, 0],      on: [],                    merge: 0, hyc: 0, fut: 0 },
  { p: [.4, .4, 0],    on: ['code', 'sci'],       merge: 0, hyc: 0, fut: 0 },
  { p: [.5, .5, .45],  on: ['code', 'sci', 'san'], merge: 0, hyc: 0, fut: 0 },
  { p: [.75, .65, .6], on: ['code', 'sci', 'san'], merge: 0, hyc: 0, fut: 0 },
  { p: [1, .85, .75],  on: ['code', 'sci', 'san'], merge: 0, hyc: 0, fut: 0 },
  { p: [1, 1, 1],      on: ['code', 'sci', 'san'], merge: 1, hyc: 0, fut: 0 },
  { p: [1, 1, 1],      on: ['code', 'sci', 'san'], merge: 1, hyc: 1, fut: 0 },
  { p: [1, 1, 1],      on: ['code', 'sci', 'san'], merge: 1, hyc: 1, fut: 1 },
];

export function initStory() {
  const list = document.querySelector('[data-story]');
  if (!list) return;
  const steps = [...list.querySelectorAll('.story-step')];
  const fig = document.querySelector('[data-fig]');
  let current = -1;

  const q = (sel) => fig && fig.querySelector(sel);
  const threads = { code: q('[data-thread=code]'), sci: q('[data-thread=sci]'), san: q('[data-thread=san]'), hyc: q('[data-thread=hyc]'), fut: q('[data-thread=fut]') };

  function updateSpine() {
    if (current < 0) return;
    const spineH = list.offsetHeight - 44;
    const y = steps[current].offsetTop + 26 - 22;
    list.style.setProperty('--progress', Math.max(0, Math.min(1, y / spineH)).toFixed(4));
  }

  function updateFigure(i) {
    if (!fig) return;
    const s = FIG[Math.min(i, FIG.length - 1)];
    ['code', 'sci', 'san'].forEach((k, n) => threads[k].style.setProperty('--p', Math.max(s.p[n], 0.03)));
    threads.hyc.style.setProperty('--p', s.hyc ? 1 : 0.001);
    threads.hyc.style.opacity = s.hyc ? 1 : 0;
    threads.fut.style.opacity = s.fut ? 1 : 0;
    fig.querySelectorAll('[data-label]').forEach((t) => t.classList.toggle('on', s.on.includes(t.dataset.label)));
    const flag = (sel, on) => { const el = q(sel); if (el) el.classList.toggle('on', !!on); };
    flag('[data-fignode=merge]', s.merge); flag('[data-figcap=merge]', s.merge);
    flag('[data-fignode=hyc]', s.hyc);     flag('[data-figcap=hyc]', s.hyc);
    flag('[data-fignode=fut]', s.fut);     flag('[data-figcap=fut]', s.fut);
  }

  function setActive(i) {
    if (i === current) return;
    current = i;
    steps.forEach((el, n) => {
      el.classList.toggle('is-active', n === i);
      el.classList.toggle('is-visited', n < i);
      el.removeAttribute('aria-current');
    });
    steps[i].setAttribute('aria-current', 'step');
    updateFigure(i);
    updateSpine();
  }

  /* The chapter crossing the middle band of the viewport becomes active. */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setActive(steps.indexOf(en.target)); });
  }, { rootMargin: '-42% 0px -48% 0px' });
  steps.forEach((s) => io.observe(s));

  /* Keyboard / tap: ring jumps to the chapter, focusing a chapter activates it. */
  steps.forEach((step, i) => {
    step.querySelector('[data-jump]').addEventListener('click', () => {
      setActive(i);
      step.scrollIntoView({ block: 'center', behavior: prefersReduced() ? 'auto' : 'smooth' });
    });
    step.addEventListener('focusin', () => setActive(i));
  });

  /* Expanding chapters shift later offsets; keep the spine aligned. */
  new ResizeObserver(updateSpine).observe(list);

  setActive(0);
}
