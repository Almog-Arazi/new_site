import { NAV } from '../site.config';

export type NavLink = { label: string; href: string; children?: { label: string; href: string }[] };

export const headerNav: NavLink[] = NAV.header;
export const footerNav = NAV.footer;

/** Marks the current top-level item, including when a child route is active. */
export function isActive(link: NavLink, pathname: string): boolean {
  const path = normalise(pathname);
  if (normalise(link.href) === path) return true;
  return (link.children ?? []).some((child) => normalise(child.href) === path);
}

export function normalise(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Every href referenced by the navigation — the link checker asserts each resolves. */
export function allNavHrefs(): string[] {
  const header = headerNav.flatMap((l) => [l.href, ...(l.children ?? []).map((c) => c.href)]);
  const footer = footerNav.flatMap((group) => group.links.map((l) => l.href));
  return [...new Set([...header, ...footer])];
}
