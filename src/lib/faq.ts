import { getCollection } from 'astro:content';
import { renderInline, stripMarkdown } from './markdown';

export interface FaqItem {
  id: string;
  q: string;
  /** Rendered HTML for the visible accordion. */
  aHtml: string;
  /** Plain text for schema.org acceptedAnswer. Never the HTML. */
  aText: string;
}

export interface FaqGroup {
  group: string;
  title: string;
  items: FaqItem[];
}

function toItem(raw: { id: string; q: string; a: string }): FaqItem {
  return {
    id: raw.id,
    q: raw.q,
    aHtml: renderInline(raw.a),
    aText: stripMarkdown(raw.a),
  };
}

/** Groups in `order`, items in `order`. */
export async function getFaqGroups(groupIds: string[]): Promise<FaqGroup[]> {
  const all = await getCollection('faq');
  return all
    .filter((entry) => groupIds.includes(entry.data.group))
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({
      group: entry.data.group,
      title: entry.data.title,
      items: [...entry.data.items].sort((a, b) => a.order - b.order).map(toItem),
    }));
}

/** Flat list for a page, optionally capped. Used by both the accordion and the schema. */
export async function getFaqFor(groupIds: string[], limit?: number): Promise<FaqItem[]> {
  const groups = await getFaqGroups(groupIds);
  const flat = groups.flatMap((g) => g.items);
  return limit ? flat.slice(0, limit) : flat;
}

/** Every item that opted into a page slug via `showOn`. */
export async function getFaqByPage(slug: string, limit?: number): Promise<FaqItem[]> {
  const all = await getCollection('faq');
  const flat = all
    .sort((a, b) => a.data.order - b.data.order)
    .flatMap((entry) =>
      [...entry.data.items].sort((a, b) => a.order - b.order).filter((i) => i.showOn.includes(slug))
    )
    .map(toItem);
  return limit ? flat.slice(0, limit) : flat;
}
