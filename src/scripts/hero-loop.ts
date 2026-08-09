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
 * - Deciding whether the video is fetched at all. Reduced motion, a narrow
 *   screen, or Save-Data means the poster stands alone and the 3MB is never
 *   requested. This audience is on 4G inside a factory.
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
}

function wants(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(width < 900px)').matches) return false;
  const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
  return !conn?.saveData;
}

if (section && video) {
  const stopped = (): boolean => video.hasAttribute('data-autoplay-stopped');

  if (wants()) {
    const src = video.dataset.src;
    if (src) {
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
    }

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
  }
}

export {};
