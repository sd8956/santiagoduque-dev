import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://santiagoduque.dev',
  trailingSlash: 'always',

  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: false,
    },
  },

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en' },
      },
      // sitemap i18n config requires every URL to live under /es/ or /en/.
      // Exclude the root redirect (/) and the RSS endpoints, which break the
      // locale grouping with "Cannot read properties of undefined (reading 'reduce')".
      filter: (page) => /\/(es|en)\//.test(page) && !page.includes('/rss.xml'),
    }),
  ],
});