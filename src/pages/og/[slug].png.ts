import type { APIContext } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const prerender = true;

// Font lives in public/ so it ships with dist/ verbatim. Reading via cwd
// works in both dev (cwd = project root) and build (cwd = repo root).
const fontData = readFileSync(join(process.cwd(), 'public/fonts/JetBrainsMono-Bold.ttf'));

export async function getStaticPaths() {
  const posts = await getCollection('blog', (entry) => !entry.data.draft);
  return posts.map((post) => {
    const slug = post.slug.split('/').at(-1) ?? post.slug;
    return {
      params: { slug },
      props: { post },
    };
  });
}

type Props = { post: CollectionEntry<'blog'> };

export async function GET(context: APIContext): Promise<Response> {
  const { post } = context.props as Props;
  const title = post.data.title;
  const tags = post.data.tags;

  const tagsLine = tags.length > 0 ? tags.map((t) => `#${t}`).join('  ') : null;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#0d0d0d',
          fontFamily: 'JetBrains Mono',
          color: '#e5e5e5',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: 28, display: 'flex' },
              children: [
                { type: 'span', props: { style: { color: '#D4A857' }, children: '$ ' } },
                { type: 'span', props: { style: { color: '#a0a0a0' }, children: 'santiagoduque.dev' } },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 24 },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 64, lineHeight: 1.15, color: '#e5e5e5' },
                    children: title,
                  },
                },
                tagsLine
                  ? {
                      type: 'div',
                      props: {
                        style: { fontSize: 22, color: '#D4A857' },
                        children: tagsLine,
                      },
                    }
                  : null,
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'JetBrains Mono', data: fontData, weight: 700, style: 'normal' }],
    },
  );

  const png = new Resvg(svg).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
