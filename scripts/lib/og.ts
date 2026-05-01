import { readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export interface PostMeta {
  slug: string;
  title: string;
  tags: string[];
  draft: boolean;
}

interface WalkOptions {
  postsDir: string;
  locales: readonly string[];
}

const POST_EXTS = new Set(['.md', '.mdx']);

export function parsePostMeta(raw: string, slug: string): PostMeta {
  const { data } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
  };
}

export function tagsLine(tags: string[]): string | null {
  return tags.length > 0 ? tags.map((t) => `#${t}`).join('  ') : null;
}

export function* walkPosts({ postsDir, locales }: WalkOptions): Generator<PostMeta> {
  for (const lang of locales) {
    const langDir = join(postsDir, lang);
    let files: string[];
    try {
      files = readdirSync(langDir);
    } catch {
      continue;
    }
    for (const file of files) {
      const ext = extname(file);
      if (!POST_EXTS.has(ext)) continue;
      const raw = readFileSync(join(langDir, file), 'utf8');
      yield parsePostMeta(raw, basename(file, ext));
    }
  }
}

export async function generateOg(post: PostMeta, fontData: Buffer): Promise<Buffer> {
  const line = tagsLine(post.tags);

  const children: unknown[] = [
    {
      type: 'div',
      props: {
        style: { fontSize: 64, lineHeight: 1.15, color: '#e5e5e5' },
        children: post.title,
      },
    },
  ];
  if (line) {
    children.push({
      type: 'div',
      props: {
        style: { fontSize: 22, color: '#D4A857' },
        children: line,
      },
    });
  }

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
                {
                  type: 'span',
                  props: { style: { color: '#a0a0a0' }, children: 'santiagoduque.dev' },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 24 },
              children,
            },
          },
        ],
      },
    } as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'JetBrains Mono', data: fontData, weight: 700, style: 'normal' }],
    },
  );

  return Buffer.from(new Resvg(svg).render().asPng());
}
