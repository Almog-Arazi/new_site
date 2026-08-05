// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` before go-live — see docs/launch-checklist.md
const SITE = 'https://ardi-engineers.co.il';

export default defineConfig({
  site: SITE,
  // `file` format emits services.html served at /services with no trailing slash,
  // matching the canonical URLs in the spec.
  build: { format: 'file' },
  trailingSlash: 'never',
  markdown: {
    // MUST stay false: smartypants turns בע"מ into בע”מ — in the company name itself.
    smartypants: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/toda'),
    }),
  ],
  vite: {
    build: {
      // Keep the three islands as small separate chunks rather than one bundle.
      assetsInlineLimit: 0,
    },
  },
});
