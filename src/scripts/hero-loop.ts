/**
 * Hero backdrop: a seamless ping-pong loop.
 *
 * The clip itself is the palindrome — forward frames followed by the reversed
 * frames with the two duplicated seam frames dropped — so playback is a plain
 * native `loop`. No JS drives the motion. Browsers do not support a negative
 * `playbackRate`, so any attempt to "play backwards" in script stutters; doing
 * it in the encode is the only way this looks right.
 *
 * What the script does own:
 *
 * - Which encode to fetch. Narrow screens get a 480×640 portrait crop at
 *   ~0.65MB instead of the 1112×834 desktop clip at 2.8MB: `object-fit:cover`
 *   in a phone-shaped frame throws most of a landscape source away, so the
 *   wide version would be paying to download pixels nobody sees.
 * - Whether to fetch at all. Reduced motion, Save-Data, or a 2G connection
 *   means the poster stands alone. This audience is on 4G inside a factory.
 * - When to fetch. On a phone the video waits for `load`, so it never competes
 *   with the poster — which is the LCP element either way.
 * - Pausing when the hero scrolls out of view, so a looping decode does not
 *   run for the whole visit.
 *
 * WCAG 2.2.2 wants a way to stop motion that starts by itself and runs past
 * five seconds. The control is the accessibility menu's "עצירת אנימציות",
 * which pauses any `video[autoplay]` and marks it `data-autoplay-stopped` —
 * hence the autoplay attribute on an element that is played from script. The
 * observer below honours that mark so scrolling never overrides the choice.
 */

const section = document.querySelector<HTMLElement>('[data-hero]');
const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');

interface NetworkInfo {
  saveData?: boolean;
  effectiveType?: string;
}

const narrow = window.matchMedia('(width <= 900px)');

function wants(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  if (conn?.saveData) return false;
  /* 2G only. `effectiveType` is a rolling round-trip estimate, not the radio
     type, and Chrome reports "3g" on connections that carry 0.65MB in a few
     seconds — gating on it cost every such visitor the video for nothing.
     Chrome-family only; absent elsewhere, and absence is not a reason to skip. */
  if (conn?.effectiveType && /^(slow-)?2g$/.test(conn.effectiveType)) return false;
  return true;
}

if (section && video) {
  const stopped = (): boolean => video.hasAttribute('data-autoplay-stopped');

  const start = (): void => {
    const src = narrow.matches ? video.dataset.srcMobile : video.dataset.src;
    if (!src) return;

    video.src = src;
    video.load();
    video.addEventListener(
      'loadeddata',
      () => {
        section.setAttribute('data-loop-ready', '');
        if (!stopped()) void video.play().catch(() => undefined);
      },
      { once: true },
    );

    /* A loop that keeps decoding behind ten screens of content is just heat. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (stopped()) continue;
          if (entry.isIntersecting) void video.play().catch(() => undefined);
          else video.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(section);
  };

  if (wants()) {
    /* Desktop has the headroom to start immediately. A phone does not: hold
       the request until the page has finished loading so the poster, the
       fonts and the form all land first. */
    if (!narrow.matches) start();
    else if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  }
}

export {};
