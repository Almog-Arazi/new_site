/**
 * Canonical route registry. The link checker and the sitemap filter both
 * read this, so a page that exists in exactly one of them fails the build
 * rather than shipping a dead nav item.
 */

/** Routes owned by a hand-written .astro file, not by the pages collection. */
export const BESPOKE_ROUTES = ['/', '/contact', '/blog', '/toda', '/404'] as const;

/** Slugs the pages collection is expected to provide. */
export const COLLECTION_ROUTES = [
  '/services',
  '/lifting-equipment-inspection',
  '/lifting-accessories',
  '/lifeline-inspection',
  '/equipment',
  '/forklift-inspection',
  '/crane-inspection',
  '/lift-platform-inspection',
  '/additional-lifting-equipment',
  '/faq',
  '/about',
  '/privacy',
  '/accessibility',
  '/lifting-inspection-center',
  '/lifting-inspection-south',
  '/lifting-inspection-sharon',
] as const;

/** Routes excluded from the sitemap. */
export const NOINDEX_ROUTES = ['/toda', '/404'] as const;

export function isNoindex(path: string): boolean {
  return (NOINDEX_ROUTES as readonly string[]).includes(path);
}

export function pathForSlug(slug: string): string {
  return slug.startsWith('/') ? slug : `/${slug}`;
}

export function articlePath(slug: string): string {
  return `/blog/${slug}`;
}
