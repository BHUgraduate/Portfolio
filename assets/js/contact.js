const EMAIL = 'bhugraduate@gmail.com';
// Hycyon's form relay (hycyon/relay on Netlify). If it cannot be reached, the form falls back to an email draft.
const FORMS_ENDPOINT = 'https://hycyon-forms.netlify.app/api/lead';

/**
 * Sends the message to the relay. Never throws. Resolves { ok: true } when it was delivered, otherwise { ok: false, reason }
 * where reason is the relay's short code (forbidden, invalid, rate_limited, delivery_failed, ...) or 'network' / 'timeout' /
 * 'http_<status>'. The reason is shown so a failure is diagnosable at a glance.
 */
async function sendToRelay(payload) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(FORMS_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal, credentials: 'omit' });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => null);
    return { ok: false, reason: (body && body.code) || `http_${res.status}` };
  } catch (err) {
    return { ok: false, reason: err && err.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get('intent')) { setStatus('error', 'Pick what you’re building first.'); return; }
    const bad = fields.filter((f) => !validate(f));
    if (bad.length) { setStatus('error', 'A couple of details are missing.'); bad[0].focus(); return; }
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const intent = String(data.get('intent'));
    const message = String(data.get('message')).trim();
    const subject = `${intent} — ${name} (via portfolio)`;
    const body = `${message}\n\n— ${name}\n${email}`;

    const send = form.querySelector('[data-send]');
    const label = send.textContent;
    send.disabled = true; send.textContent = 'Sending…';
    const result = await sendToRelay({ source: 'portfolio', intent, name, email, message, website: String(data.get('website') || '') });
    send.disabled = false; send.textContent = label;

    if (result.ok) {
      setStatus('success', `Thank you, ${name.split(' ')[0]}. Your message reached me, and I’ll reply to ${email}.`);
      msg.value = '';
    } else {
      // Not delivered: hand them an email draft so the message is not lost.
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('success', `I couldn’t send it from this page (reason: ${result.reason}), so your email app should now show a draft. If it doesn’t, write to ${EMAIL} directly.`);
    }
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
