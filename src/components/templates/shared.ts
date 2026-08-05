import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getFaqByPage, type FaqItem } from '../../lib/faq';
import { pathForSlug } from '../../lib/routes';
import type { Section } from '../../content.config';

/* ============================================================
   Shared plumbing for the seven page templates.

   Templates are thin: they choose a composition and a set of
   JSON-LD entities. Everything they need that is not in the
   frozen `pages` schema is derived here, once.
   ============================================================ */

export type PageEntry = CollectionEntry<'pages'>;

export interface TemplateProps {
  page: PageEntry;
  path: string;
  /** The markdown body is optional on every page — most have none. */
  hasBody?: boolean;
}

export interface ResolvedLink {
  label: string;
  href: string;
}

/**
 * Turns `related: [slug, …]` into real links.
 *
 * Slugs that do not resolve are dropped rather than rendered as dead links —
 * during the parallel build most of the 15 pages do not exist yet, and after
 * launch a typo in the CMS should degrade to "one fewer link", not to a 404.
 */
export async function relatedLinks(slugs: string[] = []): Promise<ResolvedLink[]> {
  if (slugs.length === 0) return [];
  const pages = await getCollection('pages', ({ data }) => !data.draft);
  const bySlug = new Map(pages.map((page) => [normaliseSlug(page.data.slug), page]));

  return slugs
    .map((slug) => bySlug.get(normaliseSlug(slug)))
    .filter((page): page is PageEntry => Boolean(page))
    .map((page) => ({
      label: page.data.breadcrumbLabel || page.data.h1,
      href: pathForSlug(page.data.slug),
    }));
}

/** Sibling pages that share a breadcrumb parent — used by the regional template. */
export async function siblingLinks(current: PageEntry): Promise<ResolvedLink[]> {
  const parent = current.data.breadcrumb.at(-1)?.href;
  if (!parent) return [];
  const pages = await getCollection('pages', ({ data }) => !data.draft);
  return pages
    .filter(
      (page) =>
        page.data.slug !== current.data.slug && page.data.breadcrumb.at(-1)?.href === parent
    )
    .sort((a, b) => a.data.order - b.data.order)
    .map((page) => ({
      label: page.data.breadcrumbLabel || page.data.h1,
      href: pathForSlug(page.data.slug),
    }));
}

/**
 * FAQ items that opted into this page via `showOn`, but only when the page
 * does not already author a `faq` block.
 *
 * The point is that schema and screen never diverge: the template renders
 * these through FaqSection, which is what emits the FAQPage JSON-LD. A page
 * therefore never carries FAQ markup for questions a visitor cannot read.
 */
export async function autoFaqItems(slug: string, sections: Section[] = []): Promise<FaqItem[]> {
  if (sections.some((section) => section.type === 'faq')) return [];
  return getFaqByPage(slug);
}

/** The `faq` block a page authored, if any. */
export function faqBlockOf(sections: Section[] = []) {
  return sections.find((section): section is Extract<Section, { type: 'faq' }> =>
    section.type === 'faq'
  );
}

export function withoutFaqBlocks(sections: Section[] = []): Section[] {
  return sections.filter((section) => section.type !== 'faq');
}

/** Every FAQ group id, in `order` — the fallback for a dedicated FAQ page. */
export async function allFaqGroupIds(): Promise<string[]> {
  const all = await getCollection('faq');
  return all.sort((a, b) => a.data.order - b.data.order).map((entry) => entry.data.group);
}

function normaliseSlug(slug: string): string {
  return slug.replace(/^\/+/, '').replace(/\/+$/, '');
}
