/**
 * One delegated listener for every conversion event on the site.
 * Any element that matters carries `data-track="<event>"`.
 *
 * Contract (agreed in Phase 0, do not rename):
 *   phone_click · whatsapp_click · form_start · generate_lead
 */

type Gtag = (command: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

const EVENTS = ['phone_click', 'whatsapp_click', 'form_start', 'generate_lead'] as const;
export type TrackEvent = (typeof EVENTS)[number];

export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

document.addEventListener(
  'click',
  (e) => {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
    if (!target) return;
    const event = target.dataset.track;
    if (!event || !(EVENTS as readonly string[]).includes(event)) return;
    track(event, {
      link_text: target.textContent?.trim().slice(0, 80),
      page_path: location.pathname,
    });
  },
  { passive: true }
);

export {};
