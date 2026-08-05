/**
 * Navigation behaviour.
 *
 *  1. The mobile drawer: aria-expanded, focus trap, `inert` on the rest of
 *     the page, Esc to close, scroll lock, focus returned to the toggle,
 *     auto-close when a link is followed.
 *  2. Desktop dropdown enhancement only. The menus open on :hover and
 *     :focus-within in CSS, so they are readable and operable with the
 *     keyboard with this file absent. Here we add Esc to dismiss and
 *     ArrowDown to step into the open group.
 */

const DESKTOP = '(width >= 1080px)';
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ── 1. drawer ─────────────────────────────────────────────── */

const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const panel = document.querySelector<HTMLElement>('[data-nav-panel]');

let inerted: Element[] = [];
let isOpen = false;

/**
 * Everything the drawer is not. The drawer is a direct child of <header>,
 * so we inert every <body> child except the one containing it, then every
 * child of that one except the drawer itself.
 */
function siblingsOf(target: Element): Element[] {
  const out: Element[] = [];
  const skip = (el: Element) => el.tagName === 'SCRIPT' || el.tagName === 'TEMPLATE';

  for (const child of Array.from(document.body.children)) {
    if (child === target) continue;
    if (child.contains(target)) {
      for (const grandchild of Array.from(child.children)) {
        if (grandchild !== target && !grandchild.contains(target) && !skip(grandchild)) {
          out.push(grandchild);
        }
      }
    } else if (!skip(child)) {
      out.push(child);
    }
  }
  return out;
}

function focusablesIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

function setDrawer(open: boolean): void {
  if (!toggle || !panel || open === isOpen) return;
  isOpen = open;

  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('is-nav-open', open);

  if (open) {
    inerted = siblingsOf(panel);
    inerted.forEach((el) => el.setAttribute('inert', ''));
    (focusablesIn(panel)[0] ?? panel).focus();
  } else {
    inerted.forEach((el) => el.removeAttribute('inert'));
    inerted = [];
    /* Focus must land back on the control that opened the drawer. */
    toggle.focus();
  }
}

toggle?.addEventListener('click', () => setDrawer(!isOpen));
panel?.querySelector<HTMLButtonElement>('[data-nav-close]')?.addEventListener('click', () => {
  setDrawer(false);
});

/* Following a link must not leave the page scroll-locked or inert. */
panel?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) setDrawer(false);
});

document.addEventListener('keydown', (e) => {
  if (!isOpen || !panel) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    setDrawer(false);
    return;
  }

  if (e.key !== 'Tab') return;

  const items = focusablesIn(panel);
  if (items.length === 0) {
    e.preventDefault();
    panel.focus();
    return;
  }

  const first = items[0] as HTMLElement;
  const last = items[items.length - 1] as HTMLElement;
  const active = document.activeElement;

  if (e.shiftKey && (active === first || active === panel)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
});

/* A drawer left open across a resize into desktop would strand `inert`. */
if (typeof window.matchMedia === 'function') {
  const desktop = window.matchMedia(DESKTOP);
  const onChange = (e: MediaQueryList | MediaQueryListEvent) => {
    if (e.matches) setDrawer(false);
  };
  if (typeof desktop.addEventListener === 'function') {
    desktop.addEventListener('change', onChange);
  }
}

/* ── 2. desktop dropdowns ──────────────────────────────────── */

const siteNav = document.querySelector<HTMLElement>('[data-site-nav]');

siteNav?.addEventListener('keydown', (event) => {
  const e = event as KeyboardEvent;
  const item = (e.target as HTMLElement).closest<HTMLElement>('[data-nav-item]');
  if (!item) return;

  const top = item.querySelector<HTMLAnchorElement>('.site-nav__link');
  const sub = item.querySelector<HTMLElement>('.site-nav__sub');

  if (e.key === 'Escape') {
    e.preventDefault();
    /* Suppress the panel but keep focus on the group — never drop the
       keyboard user onto <body>. */
    item.classList.add('is-suppressed');
    top?.focus();
    return;
  }

  if (e.key === 'ArrowDown' && document.activeElement === top) {
    e.preventDefault();
    item.classList.remove('is-suppressed');
    sub?.querySelector<HTMLAnchorElement>('a')?.focus();
  }
});

siteNav?.addEventListener('focusout', (e) => {
  const item = (e.target as HTMLElement).closest<HTMLElement>('[data-nav-item]');
  const next = (e as FocusEvent).relatedTarget as Node | null;
  if (item && (!next || !item.contains(next))) item.classList.remove('is-suppressed');
});

export {};
