/** Mobile navigation drawer: toggle, Esc, scroll lock, focus return. */

const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const panel = document.querySelector<HTMLElement>('[data-nav-panel]');

function setOpen(open: boolean): void {
  if (!toggle || !panel) return;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
  if (!open) toggle.focus();
}

toggle?.addEventListener('click', () => {
  setOpen(toggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') setOpen(false);
});

/** Following a link inside the drawer must not leave the page scroll-locked. */
panel?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) setOpen(false);
});

export {};
