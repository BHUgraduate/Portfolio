const EMAIL = 'bhugraduate@gmail.com';

const PROMPTS = {
  'A product': 'What does it do, who is it for, and where are you in the process?',
  'A website / platform': 'What should the site or platform do, and for whom?',
  'A mobile app': 'What should the app do? iOS, or something else?',
  'Something experimental': 'What’s the idea you want to try?',
  'Collaboration': 'What would you like us to work on together?',
};

export function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const details = form.querySelector('[data-details]');
  const status = document.getElementById('form-status');
  const msg = form.querySelector('[data-msg]');

  /* Conversation first: details appear once the visitor picks what they're building.
     Without JS the whole form stays visible. */
  const setOpen = (open) => {
    details.dataset.collapsed = String(!open);
    details.inert = !open;
  };
  setOpen(false);

  form.addEventListener('change', (e) => {
    if (e.target.name !== 'intent') return;
    msg.placeholder = PROMPTS[e.target.value] || '';
    setOpen(true);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get('intent')) { status.textContent = 'Pick what you’re building first.'; return; }
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const intent = String(data.get('intent'));
    const subject = `${intent} — ${name} (via portfolio)`;
    const body = `${String(data.get('message')).trim()}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app. If nothing happens, write to ' + EMAIL + '.';
  });

  const copy = document.querySelector('[data-copy-email]');
  if (copy) {
    const live = document.createElement('span');
    live.className = 'sr-only'; live.setAttribute('role', 'status');
    copy.after(live);
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(EMAIL); copy.textContent = 'Copied'; live.textContent = 'Email address copied'; }
      catch { copy.textContent = 'Press ⌘/Ctrl+C on the address'; }
      setTimeout(() => { copy.textContent = 'Copy'; live.textContent = ''; }, 2500);
    });
  }
}
