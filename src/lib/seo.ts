import site from '../site.config';
import { absoluteUrl } from './format';

export interface MetaInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: string;
  robots: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/** Titles arrive complete from the CMS — the brand suffix is appended only
 *  when the author left it off, so no page ends up double-branded. */
export function buildMeta(input: MetaInput): Meta {
  const brand = site.shortName;
  const title = input.title.includes(brand) ? input.title : `${input.title} | ${brand}`;

  return {
    title,
    description: input.description,
    canonical: absoluteUrl(input.path),
    ogImage: absoluteUrl(input.ogImage ?? '/og/og-default.png'),
    ogType: input.ogType ?? 'website',
    robots: input.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    publishedTime: input.publishedTime,
    modifiedTime: input.modifiedTime,
  };
}
