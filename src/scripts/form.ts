/**
 * Lead form: Hebrew inline validation, bot friction, AJAX submit to Netlify.
 *
 * The honeypot and the timing gate are client-side only — there is no server
 * to verify them. They are friction, not security; Netlify's Akismet layer is
 * the real filter. They matter anyway because the free tier counts spam
 * against the 100-submissions/month cap.
 *
 * Conversion events (`form_start`, `generate_lead`) are fired from here
 * through analytics.ts, which owns the gtag contract.
 */

import { track } from './analytics';

const MIN_FILL_MS = 3500;

const form = document.querySelector<HTMLFormElement>('[data-lead-form]');

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Israeli numbers, tolerant of spaces, dashes, brackets and +972. */
function normalisePhone(raw: string): string {
  const trimmed = raw.replace(/[\s()\-.]/g, '');
  return trimmed.replace(/^\+?972/, '0');
}

const RULES: Record<string, (value: string) => string | null> = {
  name: (value) =>
    value.trim().length >= 2 ? null : 'נא למלא שם מלא — לפחות שתי אותיות.',
  phone: (value) => {
    const digits = normalisePhone(value);
    if (!digits) return 'נא למלא מספר טלפון — זה המספר שאליו נחזור.';
    return /^0\d{8,9}$/.test(digits)
      ? null
      : 'מספר הטלפון לא נראה תקין. לדוגמה: 050-123-4567.';
  },
  equipment: (value) => (value ? null : 'נא לבחור את סוג הציוד לבדיקה.'),
};

if (form) {
  const startedAt = Date.now();
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  /* Validation is ours, in Hebrew, inline. The `novalidate` flag is set from
     JavaScript rather than in the markup so the no-JS path keeps the native
     browser validation instead of losing it. */
  form.noValidate = true;

  let started = false;
  let messageTouched = false;
  /* The last message text this script wrote. Anything else in the field is the
     user's, and is never overwritten. */
  let autoMessage: string | null = null;
  /* Whether the current <select> value came from the chip picker rather than
     from the user. */
  let autoSelected = false;

  const controlFor = (name: string) =>
    form.querySelector<Control>(`[name="${name}"]`) ?? null;

  const errorFor = (name: string) =>
    form.querySelector<HTMLElement>(`[data-error-for="${name}"]`) ?? null;

  function showError(name: string, message: string): void {
    const control = controlFor(name);
    const slot = errorFor(name);
    control?.setAttribute('aria-invalid', 'true');
    if (!slot) return;
    const text = slot.querySelector<HTMLElement>('[data-error-text]');
    if (text) text.textContent = message;
    slot.hidden = false;
  }

  function clearError(name: string): void {
    const control = controlFor(name);
    const slot = errorFor(name);
    control?.removeAttribute('aria-invalid');
    if (slot) slot.hidden = true;
  }

  /** Returns the names that failed, in DOM order. */
  function validate(): string[] {
    return Object.keys(RULES).filter((name) => {
      const control = controlFor(name);
      if (!control) return false;
      const message = RULES[name]?.(control.value ?? '');
      if (message) {
        showError(name, message);
        return true;
      }
      clearError(name);
      return false;
    });
  }

  /* form_start — first meaningful interaction, once per page view. */
  form.addEventListener('input', (e) => {
    const target = e.target as Control;
    if (target?.name === 'message') messageTouched = true;

    /* Re-validating on every keystroke nags; clearing a resolved error
       as soon as it is resolved does not. */
    if (target?.name && RULES[target.name] && target.getAttribute('aria-invalid')) {
      if (!RULES[target.name]?.(target.value ?? '')) clearError(target.name);
    }

    if (started) return;
    started = true;
    track('form_start', { page_path: location.pathname });
    document.dispatchEvent(new CustomEvent('lead:start'));
  });

  /* Validate a field when the user leaves it, not while they are typing. */
  form.addEventListener(
    'blur',
    (e) => {
      const target = e.target as Control;
      const name = target?.name;
      if (!name || !RULES[name] || !target.value) return;
      const message = RULES[name]?.(target.value);
      if (message) showError(name, message);
      else clearError(name);
    },
    true
  );

  /* Cross-stream contract: the homepage chip picker announces its selection
     and the form preselects the matching equipment option. */
  document.addEventListener('equipment:change', (e) => {
    const ids = (e as CustomEvent<{ ids: string[] }>).detail?.ids ?? [];
    const select = controlFor('equipment') as HTMLSelectElement | null;
    if (!select) return;

    const message = controlFor('message') as HTMLTextAreaElement | null;
    const options = Array.from(select.options).map((option) => option.value);
    const labelFor = (id: string) =>
      Array.from(select.options).find((option) => option.value === id)?.text;

    /* Only ever rewrite a message this script wrote itself — the moment the
       user types, the field is theirs. */
    const setAutoMessage = (text: string | null) => {
      if (!message || messageTouched) return;
      if (message.value && message.value !== autoMessage) return;
      message.value = text ?? '';
      autoMessage = text;
    };

    /* Deselecting every chip has to undo the preselection, or the form keeps
       claiming an equipment type the visitor just cleared. */
    if (ids.length === 0) {
      if (autoSelected) {
        select.value = '';
        autoSelected = false;
      }
      setAutoMessage(null);
      return;
    }

    const first = ids[0] ?? '';
    if (ids.length === 1 && options.includes(first)) {
      select.value = first;
      autoSelected = true;
      setAutoMessage(null);
    } else if (options.includes('other')) {
      select.value = 'other';
      autoSelected = true;

      /* Several types selected and only one <select> to hold them — carry the
         labels into the message so nothing is lost. */
      const labels = ids.map(labelFor).filter(Boolean);
      setAutoMessage(labels.length ? `ציוד לבדיקה: ${labels.join(', ')}` : null);
    }
    clearError('equipment');
  });

  function complete(): void {
    form!.hidden = true;
    success?.removeAttribute('hidden');
    success?.focus();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const invalid = validate();
    if (invalid.length) {
      if (status) {
        status.textContent =
          invalid.length === 1 ? 'נותר שדה אחד להשלים.' : `נותרו ${invalid.length} שדות להשלים.`;
      }
      const first = invalid[0];
      if (first) controlFor(first)?.focus();
      return;
    }
    if (status) status.textContent = '';

    const data = new FormData(form);
    const honeypot = String(data.get('company-website') ?? '');
    const tooFast = Date.now() - startedAt < MIN_FILL_MS;

    if (honeypot || tooFast) {
      /* Silently accept: telling a bot why it failed teaches it to pass. */
      complete();
      return;
    }

    submit?.setAttribute('disabled', 'true');
    if (status) status.textContent = 'שולח…';

    const body = new URLSearchParams();
    data.forEach((value, key) => body.append(key, String(value)));

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!response.ok) throw new Error(String(response.status));

      track('generate_lead', {
        page_path: location.pathname,
        equipment: String(data.get('equipment') ?? ''),
      });
      complete();
      document.dispatchEvent(new CustomEvent('lead:submitted'));
    } catch {
      if (status) {
        status.textContent = 'השליחה נכשלה. אפשר לנסות שוב או להתקשר אלינו ישירות.';
      }
      submit?.removeAttribute('disabled');
    }
  });
}

export {};
