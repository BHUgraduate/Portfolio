export function initNav() {
  const content = document.getElementById('nav-content');
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!content || !btn || !menu) return;

  /* Header gets a surface once the page has scrolled */
  let scrolled = false;
  const onScroll = () => {
    const s = window.scrollY > 20;
    if (s !== scrolled) { scrolled = s; content.classList.toggle('is-scrolled', s); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const setMenu = (open, returnFocus = false) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.querySelector('.icon-open').classList.toggle('hidden', open);
    btn.querySelector('.icon-close').classList.toggle('hidden', !open);
    if (!open && returnFocus) btn.focus();
  };
  btn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false, true); });
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* Active section ("where am I") */
  const links = [...document.querySelectorAll('[data-spy]')];
  const sections = ['home', 'work', 'story', 'capabilities', 'hycyon', 'contact']
    .map((id) => document.getElementById(id)).filter(Boolean);
  const setActive = (id) => links.forEach((a) => {
    if (a.dataset.spy === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
  setActive('home');

  /* Footer/contact edge: when the page bottom is reached, contact is the answer */
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive('contact');
  }, { passive: true });

}
