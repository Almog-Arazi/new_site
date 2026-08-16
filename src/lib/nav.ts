import { NAV } from '../site.config';

/* Three levels, not two. The crane pages are children of the crane hub, not
   its siblings: the menu used to list עגורנים beside עגורני גשר, עגורני שער
   and עגורני זרוע as though the four were peers, while the homepage grouped
   all of them under one עגורנים card and the footer listed a different subset
   again. One hierarchy now, and every consumer walks it with `navDescendants`
   rather than reaching for `.children` directly. */
export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

export const headerNav: NavLink[] = NAV.header;
export const footerNav = NAV.footer;

/** Every link at or below `link`, itself included, depth-first. */
export function navDescendants(link: NavLink): NavLink[] {
  return [link, ...(link.children ?? []).flatMap(navDescendants)];
}

/** Marks the current top-level item, including when any descendant is active. */
export function isActive(link: NavLink, pathname: string): boolean {
  const path = normalise(pathname);
  return navDescendants(link).some((l) => normalise(l.href) === path);
}

export function normalise(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Every href referenced by the navigation — the link checker asserts each resolves. */
export function allNavHrefs(): string[] {
  const header = headerNav.flatMap((l) => navDescendants(l).map((x) => x.href));
  const footer = footerNav.flatMap((group) =>
    group.links.flatMap((l) => navDescendants(l).map((x) => x.href))
  );
  return [...new Set([...header, ...footer])];
}
