/* Capability ↔ product graph.
   Hover/focus a capability to light the products it is proven by; pick a product to light its capabilities. */
export function initCapabilities() {
  const grid = document.querySelector('[data-cap-grid]');
  const rail = document.querySelector('[data-cap-rail]');
  if (!grid || !rail) return;
  rail.hidden = false;                               // only useful with JS, so it only appears with JS
  const cards = [...grid.querySelectorAll('.cap')];
  const pills = [...rail.querySelectorAll('[data-product]')];
  let locked = null;                                  // product chosen by click/tap

  const lit = (product) => {
    cards.forEach((c) => {
      const on = !!product && c.dataset.products.split(' ').includes(product);
      c.classList.toggle('is-lit', on);
    });
    pills.forEach((p) => p.classList.toggle('is-lit', p.dataset.product === product));
  };
  const litByCard = (card) => {
    const set = card ? card.dataset.products.split(' ') : [];
    pills.forEach((p) => p.classList.toggle('is-lit', set.includes(p.dataset.product)));
    cards.forEach((c) => c.classList.toggle('is-lit', c === card));
  };
  const restore = () => (locked ? lit(locked) : (pills.forEach((p) => p.classList.remove('is-lit')), cards.forEach((c) => c.classList.remove('is-lit'))));

  pills.forEach((p) => {
    p.addEventListener('pointerenter', () => { if (!locked) lit(p.dataset.product); });
    p.addEventListener('pointerleave', restore);
    p.addEventListener('focus', () => { if (!locked) lit(p.dataset.product); });
    p.addEventListener('blur', restore);
    p.addEventListener('click', () => {
      locked = locked === p.dataset.product ? null : p.dataset.product;
      pills.forEach((q) => q.setAttribute('aria-pressed', String(q.dataset.product === locked)));
      locked ? lit(locked) : restore();
    });
  });

  cards.forEach((c) => {
    c.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && !locked) litByCard(c); });
    c.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !locked) restore(); });
    c.addEventListener('focusin', () => { if (!locked) litByCard(c); });
    c.addEventListener('focusout', (e) => { if (!c.contains(e.relatedTarget) && !locked) restore(); });
  });
}
