#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { generateOg, walkPosts } from './lib/og';

const ROOT = process.cwd();
const FONT_PATH = join(ROOT, 'scripts/JetBrainsMono-Bold.ttf');
const POSTS_DIR = join(ROOT, 'src/content/blog');
const OUT_DIR = join(ROOT, 'public/og');
const LOCALES = ['es', 'en'] as const;

const fontData = readFileSync(FONT_PATH);

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  let count = 0;
  for (const post of walkPosts({ postsDir: POSTS_DIR, locales: LOCALES })) {
    if (post.draft) continue;
    const png = await generateOg(post, fontData);
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
