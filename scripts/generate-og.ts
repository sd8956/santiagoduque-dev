#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ROOT = process.cwd();
const FONT_PATH = join(ROOT, 'scripts/JetBrainsMono-Bold.ttf');
const POSTS_DIR = join(ROOT, 'src/content/blog');
const OUT_DIR = join(ROOT, 'public/og');
const LOCALES = ['es', 'en'] as const;

const fontData = readFileSync(FONT_PATH);

interface PostMeta {
  slug: string;
  title: string;
  tags: string[];
  draft: boolean;
}

function* walkPosts(): Generator<PostMeta> {
  for (const lang of LOCALES) {
    const langDir = join(POSTS_DIR, lang);
    let files: string[];
    try {
      files = readdirSync(langDir);
    } catch {
      continue;
    }
    for (const file of files) {
      const ext = extname(file);
      if (ext !== '.md' && ext !== '.mdx') continue;
      const fullPath = join(langDir, file);
      const raw = readFileSync(fullPath, 'utf8');
      const { data } = matter(raw);
      yield {
        slug: basename(file, ext),
        title: String(data.title ?? basename(file, ext)),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        draft: Boolean(data.draft),
      };
    }
  }
}

async function generateOg(post: PostMeta): Promise<Buffer> {
  const tagsLine = post.tags.length > 0 ? post.tags.map((t) => `#${t}`).join('  ') : null;

  const children: unknown[] = [
    {
      type: 'div',
      props: {
        style: { fontSize: 64, lineHeight: 1.15, color: '#e5e5e5' },
        children: post.title,
      },
    },
  ];
  if (tagsLine) {
    children.push({
      type: 'div',
      props: {
        style: { fontSize: 22, color: '#D4A857' },
        children: tagsLine,
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

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  let count = 0;
  for (const post of walkPosts()) {
    if (post.draft) continue;
    const png = await generateOg(post);
    const outPath = join(OUT_DIR, `${post.slug}.png`);
    writeFileSync(outPath, png);
    console.log(`✓ ${post.slug}.png (${(png.length / 1024).toFixed(1)} KB)`);
    count++;
  }
  console.log(`\nGenerated ${count} OG image${count === 1 ? '' : 's'} in public/og/.`);
}

main().catch((err: unknown) => {
  console.error('✗ OG generation failed:', err);
  process.exit(1);
});
