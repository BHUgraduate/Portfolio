const EMAIL = 'bhugraduate@gmail.com';

const PROMPTS = {
  'A product': 'What does it do, who is it for, and where are you in the process?',
  'A website / platform': 'What should the site or platform do, and for whom?',
  'A mobile app': 'What should the app do? iOS, or something else?',
  'Something experimental': 'What’s the idea you want to try?',
  'A technical partner': 'What are you building, and what kind of technical help do you need?',
  'Collaboration': 'What would you like us to work on together?',
};

const MESSAGES = {
  name: { valueMissing: 'Please tell me your name.' },
  email: { valueMissing: 'Please add your email so I can reply.', typeMismatch: 'That doesn’t look like an email address.' },
  message: { valueMissing: 'Say a little about what you’re working on.' },
};

export function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const details = form.querySelector('[data-details]');
  const status = document.getElementById('form-status');
  const msg = form.querySelector('[data-msg]');
  const fields = ['name', 'email', 'message'].map((n) => form.elements[n]);
  const errorOf = (f) => document.getElementById(f.getAttribute('aria-describedby'));

  const setStatus = (kind, text) => {
    status.hidden = !text; status.dataset.kind = kind; status.textContent = text;
  };
  const setError = (f, text) => {
    const el = errorOf(f);
    el.hidden = !text; el.textContent = text || '';
    f.setAttribute('aria-invalid', text ? 'true' : 'false');
  };
  const validate = (f) => {
    const v = f.validity;
    const key = v.valueMissing ? 'valueMissing' : v.typeMismatch ? 'typeMismatch' : null;
    setError(f, key ? MESSAGES[f.name][key] : '');
    return !key;
  };

  /* Conversation first: details appear once the visitor picks what they're building.
     Without JS the whole form stays visible. */
  const setOpen = (open) => { details.dataset.collapsed = String(!open); details.inert = !open; };
  setOpen(false);

  form.addEventListener('change', (e) => {
    if (e.target.name !== 'intent') return;
    msg.placeholder = PROMPTS[e.target.value] || '';
    setStatus('', '');
    setOpen(true);
  });
  fields.forEach((f) => {
    f.addEventListener('blur', () => { if (f.value) validate(f); });
    f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') validate(f); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get('intent')) { setStatus('error', 'Pick what you’re building first.'); return; }
    const bad = fields.filter((f) => !validate(f));
    if (bad.length) { setStatus('error', 'A couple of details are missing.'); bad[0].focus(); return; }
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const intent = String(data.get('intent'));
    const subject = `${intent} — ${name} (via portfolio)`;
    const body = `${String(data.get('message')).trim()}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('success', `Your email app should now show a draft. If it doesn’t, write to ${EMAIL} directly.`);
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
