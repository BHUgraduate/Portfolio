import { prefersReduced } from './env.js';

/* Moby-Dick, opening (public domain). Each sentence is a tappable "highlight". */
const PAGES = [
  ['Call me Ishmael.', 'Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.'],
  ['It is a way I have of driving off the spleen and regulating the circulation.', 'Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul, then I account it high time to get to sea as soon as I can.'],
];

export function initReader() {
  const root = document.querySelector('[data-reader]');
  if (!root) return;
  const page = root.querySelector('[data-reader-page]');
  const pos = root.querySelector('[data-reader-pos]');
  const count = root.querySelector('[data-reader-count]');
  const prev = root.querySelector('[data-reader-prev]');
  const next = root.querySelector('[data-reader-next]');
  const marked = new Set();
  let i = 0, busy = false;

  function draw() {
    page.replaceChildren(...PAGES[i].map((text, n) => {
      const key = `${i}.${n}`;
      /* span[role=button]: a real <button> is always inline-block and would break the text flow */
      const b = document.createElement('span');
      b.setAttribute('role', 'button'); b.tabIndex = 0; b.textContent = text + ' ';
      b.setAttribute('aria-pressed', marked.has(key));
      const toggle = () => {
        marked.has(key) ? marked.delete(key) : marked.add(key);
        b.setAttribute('aria-pressed', marked.has(key));
        tally();
      };
      b.addEventListener('click', toggle);
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      return b;
    }));
    pos.textContent = `${i + 1}/${PAGES.length}`;
    prev.disabled = i === 0; next.disabled = i === PAGES.length - 1;
    prev.classList.toggle('opacity-40', prev.disabled); next.classList.toggle('opacity-40', next.disabled);
  }
  const tally = () => { count.textContent = `${marked.size} highlight${marked.size === 1 ? '' : 's'}`; };

  function turn(dir) {
    const to = i + dir;
    if (busy || to < 0 || to >= PAGES.length) return;
    busy = true;
    const cls = dir > 0 ? 'is-leaving-next' : 'is-leaving-prev';
    page.classList.add(cls);
    setTimeout(() => { i = to; draw(); page.classList.remove(cls); busy = false; }, prefersReduced() ? 0 : 200);
  }

  prev.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  draw(); tally();
}
