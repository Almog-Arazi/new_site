import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

/* ============================================================
   FROZEN AFTER PHASE 0.
   Every value here has a 1:1 counterpart in public/admin/config.yml.
   A mismatch saves fine in the CMS and fails the build later, which
   strands a non-technical client — so the two files change together
   or not at all.
   ============================================================ */

/** Branded geometric placeholders standing in until the photo day. */
export const PLACEHOLDER_VARIANTS = [
  'forklift',
  'crane',
  'platform',
  'lifeline',
  'accessory',
  'generic',
  'portrait',
  'document',
  'factory',
] as const;
export type PlaceholderVariant = (typeof PLACEHOLDER_VARIANTS)[number];

/** Section background treatment. `dark` flips text to the on-dark ramp. */
export const TONES = ['light', 'soft', 'tint', 'dark'] as const;
export type Tone = (typeof TONES)[number];

export const TEMPLATES = [
  'service',
  'equipment',
  'hub',
  'faq',
  'about',
  'legal',
  'region',
] as const;

const placeholder = z.enum(PLACEHOLDER_VARIANTS);
const tone = z.enum(TONES).default('light');

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const cta = z.object({
  label: z.string(),
  href: z.string(),
  style: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
});

/* ── the 12 blocks. Closed set — do not add a 13th mid-build. ── */

const richText = z.object({
  type: z.literal('richText'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  /** Markdown. Rendered inline-only (bold, links, lists). */
  body: z.string(),
  tone,
  narrow: z.boolean().default(false),
});

const checkList = z.object({
  type: z.literal('checkList'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(z.string()).min(1),
  columns: z.number().int().min(1).max(3).default(2),
  tone,
});

const featureGrid = z.object({
  type: z.literal('featureGrid'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        text: z.string(),
        icon: z.string().optional(),
      })
    )
    .min(1),
  columns: z.number().int().min(2).max(4).default(3),
  tone,
});

const processSteps = z.object({
  type: z.literal('processSteps'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  steps: z
    .array(
      z.object({
        title: z.string(),
        text: z.string().optional(),
      })
    )
    .min(2),
  tone,
});

const statRow = z.object({
  type: z.literal('statRow'),
  heading: z.string().optional(),
  intro: z.string().optional(),
  stats: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        note: z.string().optional(),
      })
    )
    .min(1),
  tone,
});

const calloutBand = z.object({
  type: z.literal('calloutBand'),
  heading: z.string(),
  text: z.string().optional(),
  cta: cta.optional(),
  tone: z.enum(TONES).default('tint'),
});

const regulationTable = z.object({
  type: z.literal('regulationTable'),
  heading: z.string().optional(),
  intro: z.string().optional(),
  columns: z.array(z.string()).min(2),
  rows: z.array(z.array(z.string())).min(1),
  note: z.string().optional(),
  tone,
});

const linkCards = z.object({
  type: z.literal('linkCards'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  intro: z.string().optional(),
  cards: z
    .array(
      z.object({
        title: z.string(),
        text: z.string().optional(),
        href: z.string(),
        placeholder: placeholder.optional(),
        alt: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .min(1),
  columns: z.number().int().min(2).max(3).default(3),
  tone,
});

const equipmentGrid = z.object({
  type: z.literal('equipmentGrid'),
  heading: z.string().optional(),
  intro: z.string().optional(),
  /** Empty = all six, in `data/equipment.json` order. */
  ids: z.array(z.string()).default([]),
  tone,
});

const photoBand = z.object({
  type: z.literal('photoBand'),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().optional(),
  bullets: z.array(z.string()).default([]),
  placeholder,
  alt: z.string(),
  /** Photography brief shown inside the placeholder while it is a placeholder. */
  note: z.string().optional(),
  image: z.string().optional(),
  /** Puts the image on the inline-end side instead of inline-start. */
  flip: z.boolean().default(false),
  cta: cta.optional(),
  tone,
});

const faqBlock = z.object({
  type: z.literal('faq'),
  heading: z.string().optional(),
  intro: z.string().optional(),
  /** FAQ group ids. Same array feeds the accordion AND the FAQPage JSON-LD. */
  groups: z.array(z.string()).min(1),
  limit: z.number().int().positive().optional(),
  moreHref: z.string().optional(),
  tone,
});

const ctaBand = z.object({
  type: z.literal('ctaBand'),
  heading: z.string(),
  text: z.string().optional(),
  primary: link.optional(),
  secondary: link.optional(),
  tone: z.enum(TONES).default('dark'),
});

export const sectionSchema = z.discriminatedUnion('type', [
  richText,
  checkList,
  featureGrid,
  processSteps,
  statRow,
  calloutBand,
  regulationTable,
  linkCards,
  equipmentGrid,
  photoBand,
  faqBlock,
  ctaBand,
]);

export type Section = z.infer<typeof sectionSchema>;

/* ── collections ─────────────────────────────────────────── */

const seo = z.object({
  title: z.string().max(70),
  description: z.string().min(50).max(190),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    slug: z.string(),
    template: z.enum(TEMPLATES),
    order: z.number().default(100),
    draft: z.boolean().default(false),
    breadcrumb: z.array(link).default([]),
    breadcrumbLabel: z.string(),
    eyebrow: z.string().optional(),
    h1: z.string(),
    lead: z.string(),
    hero: z
      .object({
        placeholder,
        alt: z.string(),
        note: z.string().optional(),
        /** Real photo under /uploads. When present PhotoFrame drops the placeholder. */
        image: z.string().optional(),
      })
      .optional(),
    seo,
    sections: z.array(sectionSchema).default([]),
    schema: z
      .object({
        kind: z.enum(['Service', 'CollectionPage', 'AboutPage', 'WebPage', 'FAQPage']),
        serviceName: z.string().optional(),
        serviceType: z.string().optional(),
        areaServed: z.array(z.string()).default([]),
      })
      .optional(),
    cta: z
      .object({
        heading: z.string(),
        text: z.string().optional(),
      })
      .optional(),
    related: z.array(z.string()).default([]),
    updated: z.coerce.date().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().min(50).max(190),
    seoTitle: z.string().max(70).optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('ארזי מיטב המהנדסים'),
    category: z.string(),
    keywords: z.array(z.string()).default([]),
    readingMinutes: z.number().int().positive().default(4),
    hero: z.object({
      placeholder,
      alt: z.string(),
      note: z.string().optional(),
      image: z.string().optional(),
    }),
    faqGroups: z.array(z.string()).default([]),
    relatedPages: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** One file per topic group. `showOn` targets pages by slug. */
const faq = defineCollection({
  loader: glob({ base: './src/content/faq', pattern: '**/*.json' }),
  schema: z.object({
    group: z.string(),
    title: z.string(),
    order: z.number().default(100),
    items: z
      .array(
        z.object({
          id: z.string(),
          q: z.string(),
          /** Inline markdown allowed. JSON-LD receives the stripped text. */
          a: z.string(),
          showOn: z.array(z.string()).default([]),
          order: z.number().default(100),
        })
      )
      .min(1),
  }),
});

/** Six items feeding four consumers: chip picker, /equipment, footer, form select. */
/** The JSON wraps its array in `{ items: [...] }` so the CMS can edit it as a
 *  single file; the parser unwraps it back to the array the loader expects. */
const unwrapItems = (text: string) => JSON.parse(text).items as Record<string, unknown>[];

const equipment = defineCollection({
  loader: file('./src/content/data/equipment.json', { parser: unwrapItems }),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    short: z.string(),
    href: z.string(),
    placeholder,
    alt: z.string(),
    note: z.string().optional(),
    image: z.string().optional(),
    order: z.number().default(100),
  }),
});

const process = defineCollection({
  loader: file('./src/content/data/process.json', { parser: unwrapItems }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    order: z.number().default(100),
  }),
});

const credentials = defineCollection({
  loader: file('./src/content/data/credentials.json', { parser: unwrapItems }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    icon: z.string().default('shield'),
    order: z.number().default(100),
  }),
});

export const collections = { pages, articles, faq, equipment, process, credentials };

/** Kept for schema-level cross-references if a future block needs one. */
export const _reference = reference;
