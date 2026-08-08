/**
 * Mouse-scrubbed hero backdrop.
 *
 * Cursor X across the viewport maps to a position on the video timeline, so
 * the camera orbits the crane as the visitor moves. The source is re-encoded
 * with every frame a keyframe (`-g 1 -keyint_min 1`), which is what makes an
 * arbitrary seek land instantly instead of stuttering to the nearest keyframe.
 *
 * Three guards, each for a real failure:
 *
 * `pointer: fine` — a device with a mouse. Touch cannot scrub, and seeking a
 * <video> by `currentTime` is unreliable on iOS in particular. Phones get the
 * poster and never download the 6MB file, which matters for an audience on 4G
 * inside a factory.
 *
 * `prefers-reduced-motion` — no video at all.
 *
 * `isSeeking` — mousemove fires far faster than the decoder can serve frames.
 * Without this the seek queue overflows and the image visibly lurches.
 *
 * Frames are painted to a canvas rather than shown through the <video>
 * element: the video stays out of the document, so it cannot flash a first
 * frame, cannot show controls on any platform, and cannot be picked up as a
 * media element by the browser or by assistive tech. The backdrop is
 * decorative — the poster underneath it carries the same image.
 */

const section = document.querySelector<HTMLElement>('[data-hero]');
const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
const cue = document.querySelector<HTMLElement>('[data-hero-cue]');

function start(): void {
  if (!section || !canvas) return;

  const src = section.dataset.video;
  if (!src) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const video = document.createElement('video');
  video.src = src;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.crossOrigin = 'anonymous';

  const state = { target: 0, seeking: false, ready: false };

  const size = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = section.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  };

  /* object-fit: cover, done by hand — the source is 4:3 and the hero is much
     wider, so the frame is scaled to the width and centred vertically. */
  const paint = (): void => {
    if (!state.ready) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / video.videoWidth, ch / video.videoHeight);
    const w = video.videoWidth * scale;
    const h = video.videoHeight * scale;
    ctx.drawImage(video, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  const seek = (time: number): void => {
    state.target = time;
    if (state.seeking) return;
    state.seeking = true;
    video.currentTime = time;
  };

  video.addEventListener('loadeddata', () => {
    state.ready = true;
    size();
    seek(video.duration / 2);
    section.setAttribute('data-scrub-ready', '');
    cue?.removeAttribute('hidden');
  });

  video.addEventListener('seeked', () => {
    paint();
    state.seeking = false;
    if (Math.abs(state.target - video.currentTime) > 0.01) {
      state.seeking = true;
      video.currentTime = state.target;
    }
  });

  window.addEventListener(
    'mousemove',
    (e) => {
      if (!state.ready) return;
      const d = video.duration;
      if (!d || Number.isNaN(d)) return;
      /* RTL page, but the timeline is not mirrored: the orbit should follow
         the hand, and cursor-right = later in the shot reads correctly for
         both directions of reading. */
      seek(Math.max(0, Math.min(d, (e.clientX / window.innerWidth) * d)));
    },
    { passive: true }
  );

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      size();
      paint();
    }, 150);
  });
}

if (
  section &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  /* Never before load — the poster is the LCP element and the video must not
     compete with it for bandwidth. */
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

export {};
