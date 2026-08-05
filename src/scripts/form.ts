/**
 * Lead form: Hebrew validation, bot friction, AJAX submit to Netlify.
 *
 * The honeypot and the timing gate are client-side only — there is no server
 * to verify them. They are friction, not security; Netlify's Akismet layer is
 * the real filter. They matter anyway because the free tier counts spam
 * against the 100-submissions/month cap.
 *
 * PHASE 0 STUB — ownership passes to Stream A.
 */

const MIN_FILL_MS = 3500;
const form = document.querySelector<HTMLFormElement>('[data-lead-form]');

if (form) {
  const startedAt = Date.now();
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  let started = false;

  form.addEventListener('input', () => {
    if (started) return;
    started = true;
    document.dispatchEvent(new CustomEvent('lead:start'));
  });

  /* Preselect the equipment type from the homepage chip picker. */
  document.addEventListener('equipment:change', (e) => {
    const ids = (e as CustomEvent<{ ids: string[] }>).detail?.ids ?? [];
    const field = form.querySelector<HTMLSelectElement | HTMLInputElement>('[name="equipment"]');
    if (field && ids.length) field.value = ids.join(', ');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const honeypot = String(data.get('company-website') ?? '');
    const tooFast = Date.now() - startedAt < MIN_FILL_MS;
    if (honeypot || tooFast) {
      /* Silently accept: telling a bot why it failed teaches it to pass. */
      form.hidden = true;
      success?.removeAttribute('hidden');
      return;
    }

    submit?.setAttribute('disabled', 'true');
    if (status) status.textContent = 'שולח…';

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      form.hidden = true;
      success?.removeAttribute('hidden');
      success?.focus();
      document.dispatchEvent(new CustomEvent('lead:submitted'));
    } catch {
      if (status) status.textContent = 'השליחה נכשלה. אפשר להתקשר אלינו ישירות.';
      submit?.removeAttribute('disabled');
    }
  });
}

export {};
