/**
 * Desktop CTA dock — show it only when nothing better is on screen.
 *
 * A persistent "call us" panel competing with the hero form, a CTA band or
 * the footer is worse than no panel: it splits attention and covers the very
 * control it is pointing at. So the dock is the fallback, not the default.
 *
 * Every element that already offers a way to make contact is marked
 * `[data-cta-quiet]`. While any of them is even partly in the viewport the
 * dock stays away; when the last one leaves, it comes back.
 *
 * IntersectionObserver rather than a scroll threshold: a threshold has to
 * guess at viewport height and page length, and gets it wrong on a 13"
 * laptop, on a short page, and on every zoom level. The observer asks the
 * only question that matters — is a CTA visible right now.
 *
 * Under 901px the dock is display:none and the fixed mobile bar takes over,
 * so the observer is never wired up there.
 */

const dock = document.querySelector<HTMLElement>('[data-cta-dock]');
const desktop = window.matchMedia('(width >= 901px)');

if (dock && desktop.matches) {
  const quiet = document.querySelectorAll<HTMLElement>('[data-cta-quiet]');

  /* A page with no in-page CTA at all — nothing would ever trigger the
     observer, so show the dock outright. */
  if (quiet.length === 0) {
    dock.setAttribute('data-shown', '');
  } else {
    const visible = new Set<Element>();

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }

      if (visible.size > 0) dock.removeAttribute('data-shown');
      else dock.setAttribute('data-shown', '');
    });

    for (const el of quiet) io.observe(el);
  }
}

export {};
