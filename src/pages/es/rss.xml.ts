import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../../data/site';

export async function GET(context: APIContext): Promise<Response> {
  if (!context.site) {
    throw new Error('site is required in astro.config.mjs to generate RSS feed.');
  }

  const posts = (
    await getCollection('blog', (entry) => entry.data.language === 'es' && !entry.data.draft)
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: `${site.name} (es)`,
    description: site.description.es,
    site: context.site,
    items: posts.map((post) => {
      const slug = post.slug.split('/').at(-1) ?? post.slug;
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/es/blog/${slug}/`,
        categories: post.data.tags,
      };
    }),
    customData: `<language>es</language>`,
  });
}
