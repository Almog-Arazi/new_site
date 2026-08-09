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
 * - A pause control. WCAG 2.2.2 requires a way to stop motion that starts
 *   automatically and runs more than five seconds; this one runs forever.
 */

const section = document.querySelector<HTMLElement>('[data-hero]');
const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
const toggle = document.querySelector<HTMLButtonElement>('[data-hero-toggle]');

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
  let paused = false;

  const label = (playing: boolean): void => {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', playing ? 'false' : 'true');
    toggle.setAttribute('aria-label', playing ? 'עצירת התנועה ברקע' : 'הפעלת התנועה ברקע');
    toggle.dataset.playing = playing ? 'true' : 'false';
  };

  if (wants()) {
    const src = video.dataset.src;
    if (src) {
      video.src = src;
      video.load();
      video.addEventListener(
        'loadeddata',
        () => {
          section.setAttribute('data-loop-ready', '');
          void video.play().catch(() => undefined);
          toggle?.removeAttribute('hidden');
          label(true);
        },
        { once: true }
      );
    }

    /* A loop that keeps decoding behind ten screens of content is just heat. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (paused) continue;
          if (entry.isIntersecting) void video.play().catch(() => undefined);
          else video.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(section);
  }

  toggle?.addEventListener('click', () => {
    paused = !paused;
    if (paused) video.pause();
    else void video.play().catch(() => undefined);
    label(!paused);
  });
}

export {};
