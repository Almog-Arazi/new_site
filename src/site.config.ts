import { z } from 'astro:content';
import raw from './content/settings/site.json';
import navRaw from './content/settings/navigation.json';

/* ============================================================
   The single dev-facing config. Values come from
   src/content/settings/site.json, which the CMS can edit —
   so the client changes the phone number without a developer,
   and code still imports one typed module.
   ============================================================ */

const siteSchema = z.object({
  businessName: z.string(),
  shortName: z.string(),
  tagline: z.string(),
  yearsExperience: z.number(),
  phone: z.string(),
  phoneE164: z.string().regex(/^\+\d{9,15}$/, 'phoneE164 must be bare E.164, no spaces or dashes'),
  whatsapp: z.string().regex(/^\+\d{9,15}$/),
  whatsappMessage: z.string(),
  hours: z.string(),
  accessibility: z.object({
    coordinatorName: z.string(),
    coordinatorRole: z.string(),
    coordinatorPhone: z.string().regex(/^\+\d{9,15}$/),
    statementDate: z.string(),
    /** Empty until a licensed surveyor has signed off. */
    surveyorName: z.string(),
  }),
  hoursSchema: z.array(
    z.object({ days: z.array(z.string()), opens: z.string(), closes: z.string() })
  ),
  addressLocality: z.string(),
  addressCountry: z.string(),
  areasServed: z.array(z.string()),
  areaServedLabel: z.string(),
  ga4Id: z.string(),
  domain: z.string().url(),
  formProvider: z.enum(['netlify', 'none']),
  formName: z.string(),
});

const site = siteSchema.parse(raw);

/* Three levels: top item → section → leaf. The crane pages are leaves under
   the crane hub, not siblings of it.
   Spelled out rather than made recursive with z.lazy, because the depth is a
   deliberate limit — a fourth level would need a second flyout, and the menu
   is not getting one. Note that zod strips unknown keys: while the sub level
   was typed as a plain linkSchema, a `children` array on it parsed without
   error and simply vanished, so the JSON and the rendered menu disagreed
   with nothing to show for it. */
const linkSchema = z.object({ label: z.string(), href: z.string() });
const sectionSchema = linkSchema.extend({ children: z.array(linkSchema).optional() });
const topSchema = linkSchema.extend({ children: z.array(sectionSchema).optional() });

const navSchema = z.object({
  header: z.array(topSchema),
  footer: z.array(z.object({ title: z.string(), links: z.array(sectionSchema) })),
});

export const NAV = navSchema.parse(navRaw);

/** `tel:` needs bare E.164 — any dash or space breaks dialling on some Androids. */
export const telHref = `tel:${site.phoneE164}`;

/** wa.me takes digits only, no leading +. */
export const waHref = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
  site.whatsappMessage
)}`;

/** True once a real GA4 id replaces the placeholder. */
export const hasAnalytics = /^G-[A-Z0-9]{6,}$/.test(site.ga4Id) && site.ga4Id !== 'G-XXXXXXXXXX';

/** True once real contact details replace the placeholders — gates the launch checklist. */
export const hasRealContact = site.phoneE164 !== '+972500000000';

/** The accessibility regulations want a named coordinator, not a department. */
export const hasAccessibilityCoordinator =
  !site.accessibility.coordinatorName.includes('REPLACE-ME');

export const SITE = site;
export default site;
