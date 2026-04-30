import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

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

  integrations: [tailwind()],
});