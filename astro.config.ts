import { defineConfig } from 'astro/config';
import { join } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import { buildBlogTranslationMap } from './scripts/lib/blog-translation-map';

const SITE_URL = 'https://santiagoduque.dev';
const DEFAULT_LOCALE = 'es';
const LOCALES = ['es', 'en'];

// Build a slug-translation map at config-eval time by reading blog frontmatter
// directly from disk. Keyed by `${lang}/${slug}`; value is the matching slug
// in each locale (undefined if no translation exists).
//
// We can't import astro:content from astro.config.mjs, and @astrojs/sitemap's
// i18n config auto-pairs alternates by SAME path across locales — but our
// blog posts use different slugs per language (hola-mundo ↔ hello-world)
// linked via `translatedTo` frontmatter. So we override the `links` array
// in `serialize` for blog post URLs.
const blogTranslationMap = buildBlogTranslationMap({
  contentRoot: join(process.cwd(), 'src/content/blog'),
  locales: LOCALES,
});

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',

  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
      wrap: false,
    },
  },

  i18n: {
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: { es: 'es-ES', en: 'en-US' },
      },
      filter: (page) => {
        if (page.includes('/draft/')) return false;
        // Root '/' is a noindex JS-detection redirect (src/pages/index.astro);
        // canonical URLs all live under /es/ or /en/ via prefixDefaultLocale.
        const path = new URL(page).pathname;
        if (path === '/') return false;
        return true;
      },
      serialize(item) {
        const match = item.url.match(/\/(es|en)\/blog\/([^/]+)\/$/);
        if (!match) return item;

        const [, lang, slug] = match;
        const pair = blogTranslationMap.get(`${lang}/${slug}`);
        if (!pair) return item;

        const buildHref = (l: string) => new URL(`/${l}/blog/${pair[l]}/`, SITE_URL).href;

        if (pair.es && pair.en) {
          item.links = [
            { lang: 'es-ES', url: buildHref('es') },
            { lang: 'en-US', url: buildHref('en') },
            { lang: 'x-default', url: buildHref(DEFAULT_LOCALE) },
          ];
        } else {
          item.links = [{ lang: lang === 'es' ? 'es-ES' : 'en-US', url: item.url }];
        }
        return item;
      },
    }),
  ],
});
