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
  email: z.string().email(),
  hours: z.string(),
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

const linkSchema = z.object({ label: z.string(), href: z.string() });
const navSchema = z.object({
  header: z.array(linkSchema.extend({ children: z.array(linkSchema).optional() })),
  footer: z.array(z.object({ title: z.string(), links: z.array(linkSchema) })),
});

export const NAV = navSchema.parse(navRaw);

/** `tel:` needs bare E.164 — any dash or space breaks dialling on some Androids. */
export const telHref = `tel:${site.phoneE164}`;

/** wa.me takes digits only, no leading +. */
export const waHref = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
  site.whatsappMessage
)}`;

export const mailHref = `mailto:${site.email}`;

/** True once a real GA4 id replaces the placeholder. */
export const hasAnalytics = /^G-[A-Z0-9]{6,}$/.test(site.ga4Id) && site.ga4Id !== 'G-XXXXXXXXXX';

/** True once real contact details replace the placeholders — gates the launch checklist. */
export const hasRealContact =
  site.phoneE164 !== '+972500000000' && !site.email.endsWith('example.co.il');

export const SITE = site;
export default site;
