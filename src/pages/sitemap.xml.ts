import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '../i18n/config';

type Alternate = { hreflang: string; href: string };

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  alternates: Alternate[];
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function otherLocale(lang: Locale): Locale {
  return lang === 'es' ? 'en' : 'es';
}

export async function GET(context: APIContext): Promise<Response> {
  const site = context.site;
  if (!site) {
    throw new Error('site is required in astro.config.mjs to generate sitemap.');
  }

  const abs = (path: string): string => new URL(path, site).href;

  const allPosts = await getCollection('blog', (entry) => !entry.data.draft);

  const staticPaths = ['/', '/about/', '/blog/'];
  const staticEntries: SitemapEntry[] = staticPaths.flatMap((path) =>
    LOCALES.map((lang) => {
      const localized = `/${lang}${path}`;
      return {
        loc: abs(localized),
        alternates: [
          { hreflang: lang, href: abs(localized) },
          { hreflang: otherLocale(lang), href: abs(`/${otherLocale(lang)}${path}`) },
          { hreflang: 'x-default', href: abs(`/${DEFAULT_LOCALE}${path}`) },
        ],
      };
    }),
  );

  const postEntries: SitemapEntry[] = allPosts.map((post) => {
    const slug = post.slug.split('/').at(-1) ?? post.slug;
    const lang = post.data.language as Locale;
    const loc = abs(`/${lang}/blog/${slug}/`);
    const lastmod = post.data.pubDate.toISOString().split('T')[0];
    const alternates: Alternate[] = [{ hreflang: lang, href: loc }];
    if (post.data.translatedTo) {
      alternates.push({
        hreflang: otherLocale(lang),
        href: abs(`/${otherLocale(lang)}/blog/${post.data.translatedTo}/`),
      });
    }
    return { loc, lastmod, alternates };
  });

  const entries = [...staticEntries, ...postEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map((e) => {
    const lastmodLine = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
    const alternatesLines = e.alternates
      .map(
        (a) =>
          `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeXml(a.href)}" />`,
      )
      .join('\n');
    return `  <url>
    <loc>${escapeXml(e.loc)}</loc>${lastmodLine}
${alternatesLines}
  </url>`;
  })
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
