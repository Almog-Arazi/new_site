import site from '../site.config';
import { absoluteUrl } from './format';
import type { FaqItem } from './faq';

/* ============================================================
   JSON-LD builders. One <script> per entity, no @graph, cross-linked
   by stable @id so Service entities can point at the business.

   No street address exists yet, so the business is a ProfessionalService
   with areaServed + telephone + hours and a country-only address.
   Do NOT invent a street address — Google penalises fabricated NAP data.
   ============================================================ */

const BUSINESS_ID = `${site.domain}/#business`;
const ORG_ID = `${site.domain}/#organization`;
const WEBSITE_ID = `${site.domain}/#website`;

export function localBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: site.businessName,
    alternateName: site.shortName,
    description: site.tagline,
    url: site.domain,
    telephone: site.phoneE164,
    email: site.email,
    image: absoluteUrl('/og/og-default.png'),
    logo: absoluteUrl('/logo/ardi-logo.svg'),
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.addressLocality,
      addressCountry: site.addressCountry,
    },
    areaServed: site.areasServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    knowsAbout: [
      'בדיקות מתקני הרמה',
      'בדיקות אביזרי הרמה',
      'בדיקות קווי חיים',
      'תסקיר בדיקה',
      'בודק מוסמך',
    ],
    openingHoursSpecification: site.hoursSchema.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  };
}

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.businessName,
    url: site.domain,
    logo: absoluteUrl('/logo/ardi-logo.svg'),
    telephone: site.phoneE164,
    email: site.email,
    foundingDate: String(new Date().getFullYear() - site.yearsExperience),
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.domain,
    name: site.businessName,
    inLanguage: 'he-IL',
    publisher: { '@id': ORG_ID },
  };
}

export function service(opts: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
  areaServed?: string[];
}) {
  const areas = opts.areaServed?.length ? opts.areaServed : site.areasServed;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType ?? opts.name,
    url: absoluteUrl(opts.path),
    provider: { '@id': BUSINESS_ID },
    areaServed: areas.map((name) => ({ '@type': 'AdministrativeArea', name })),
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: { '@type': 'ContactPoint', telephone: site.phoneE164 },
      serviceUrl: absoluteUrl('/contact'),
    },
  };
}

export function faqPage(items: FaqItem[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.aText },
    })),
  };
}

export function breadcrumb(trail: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.label,
      item: absoluteUrl(step.href),
    })),
  };
}

export function collectionPage(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(opts.path)}#page`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'he-IL',
  };
}

export function aboutPage(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${absoluteUrl(opts.path)}#page`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntity: { '@id': ORG_ID },
    inLanguage: 'he-IL',
  };
}

export function webPage(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#page`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'he-IL',
  };
}

export function contactPage(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${absoluteUrl(opts.path)}#page`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntity: { '@id': BUSINESS_ID },
    inLanguage: 'he-IL',
  };
}

export function article(opts: {
  title: string;
  description: string;
  path: string;
  published: Date;
  updated?: Date;
  author: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absoluteUrl(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    datePublished: opts.published.toISOString(),
    dateModified: (opts.updated ?? opts.published).toISOString(),
    author: { '@type': 'Organization', name: opts.author, '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'he-IL',
    keywords: opts.keywords,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(opts.path) },
  };
}

export function blog(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${absoluteUrl(opts.path)}#blog`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    publisher: { '@id': ORG_ID },
    inLanguage: 'he-IL',
  };
}

export function itemList(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}
