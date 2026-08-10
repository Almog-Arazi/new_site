/**
 * Lead form: Hebrew inline validation, then hand off to WhatsApp.
 *
 * There is no server. On submit the fields are composed into a readable
 * Hebrew message and wa.me is opened with it prefilled — the visitor presses
 * send inside WhatsApp and the lead lands in the inspector's own chat. That
 * removes the whole class of "the form silently went nowhere" failures, and
 * a WhatsApp thread is a better lead than an email: it is already a two-way
 * channel with a phone number attached.
 *
 * Two consequences worth knowing:
 *
 * - Nothing is stored anywhere on the way, so there is no spam surface. The
 *   honeypot and the fill-timing gate that used to sit here are gone: a bot
 *   completing this form only opens WhatsApp on its own machine.
 * - The handoff must happen synchronously inside the submit handler. Any
 *   `await` before `window.open` breaks the user-gesture chain and the popup
 *   blocker eats it. Hence no async work on this path.
 *
 * Conversion events (`form_start`, `generate_lead`) are fired from here
 * through analytics.ts, which owns the gtag contract.
 */

import { track } from './analytics';

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
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const retry = document.querySelector<HTMLAnchorElement>('[data-form-retry]');
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

  /**
   * The message the inspector receives. Labelled lines, empty fields dropped —
   * a blank "חברה:" reads as a form dump rather than as somebody writing.
   */
  function composeMessage(): string {
    const value = (name: string) => (controlFor(name)?.value ?? '').trim();

    const select = controlFor('equipment') as HTMLSelectElement | null;
    const equipment = select?.selectedOptions[0]?.text ?? '';

    const details: string[] = [`שם: ${value('name')}`];
    if (value('company')) details.push(`חברה: ${value('company')}`);
    details.push(`טלפון: ${value('phone')}`, `סוג הציוד: ${equipment}`);
    if (value('message')) details.push(`פרטים: ${value('message')}`);

    return [
      'שלום, הגעתי דרך האתר של ארזי מיטב המהנדסים.',
      'אני מעוניין לתאם בדיקת בודק מוסמך ואשמח לקבל זמינות והצעת מחיר.',
      '',
      ...details,
    ].join('\n');
  }

  function complete(url: string): void {
    if (retry) retry.href = url;
    form!.hidden = true;
    success?.removeAttribute('hidden');
    success?.focus();
  }

  form.addEventListener('submit', (e) => {
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

    /* The number arrives on the element, not through an import: pulling
       site.config in here would drag Zod and every settings JSON into the
       browser bundle for the sake of one string. */
    const digits = form.dataset.wa ?? '';
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(composeMessage())}`;

    track('generate_lead', {
      page_path: location.pathname,
      equipment: String(controlFor('equipment')?.value ?? ''),
    });

    /* Synchronous, still inside the click gesture. A blocked popup returns
       null, and then navigating this tab is better than losing the lead. */
    const opened = window.open(url, '_blank', 'noopener');
    if (!opened) location.href = url;

    complete(url);
    document.dispatchEvent(new CustomEvent('lead:submitted'));

    /* The visitor may come back to this tab and want to send again. */
    submit?.removeAttribute('disabled');
  });
}

export {};
