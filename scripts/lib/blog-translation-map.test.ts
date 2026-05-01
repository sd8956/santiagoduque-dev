import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildBlogTranslationMap } from './blog-translation-map';

const LOCALES = ['es', 'en'] as const;

async function writePost(
  contentRoot: string,
  lang: string,
  slug: string,
  frontmatter: Record<string, unknown>,
  body: string = 'Body.',
): Promise<void> {
  const dir = join(contentRoot, lang);
  await mkdir(dir, { recursive: true });
  const lines = ['---'];
  for (const [key, value] of Object.entries(frontmatter)) {
    lines.push(`${key}: ${typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}`);
  }
  lines.push('---', '', body, '');
  await writeFile(join(dir, `${slug}.md`), lines.join('\n'), 'utf8');
}

describe('buildBlogTranslationMap', () => {
  let contentRoot: string;

  beforeEach(async () => {
    contentRoot = await mkdtemp(join(tmpdir(), 'blog-translation-map-'));
  });
  afterEach(async () => {
    await rm(contentRoot, { recursive: true, force: true });
  });

  it('returns an empty map when no locale folders exist', () => {
    const map = buildBlogTranslationMap({ contentRoot, locales: LOCALES });
    expect(map.size).toBe(0);
  });

  it('lists posts without translatedTo with only their own locale', async () => {
    await writePost(contentRoot, 'es', 'lonely', { title: 'Solo' });
    const map = buildBlogTranslationMap({ contentRoot, locales: LOCALES });
    expect(map.get('es/lonely')).toEqual({ es: 'lonely' });
    expect(map.size).toBe(1);
  });

  it('pairs both languages when translatedTo points across', async () => {
    await writePost(contentRoot, 'es', 'hola-mundo', {
      title: 'Hola mundo',
      translatedTo: 'hello-world',
    });
    await writePost(contentRoot, 'en', 'hello-world', {
      title: 'Hello world',
      translatedTo: 'hola-mundo',
    });
    const map = buildBlogTranslationMap({ contentRoot, locales: LOCALES });
    expect(map.get('es/hola-mundo')).toEqual({ es: 'hola-mundo', en: 'hello-world' });
    expect(map.get('en/hello-world')).toEqual({ en: 'hello-world', es: 'hola-mundo' });
  });

  it('excludes drafts', async () => {
    await writePost(contentRoot, 'es', 'in-progress', { title: 'WIP', draft: true });
    await writePost(contentRoot, 'es', 'published', { title: 'Live', draft: false });
    const map = buildBlogTranslationMap({ contentRoot, locales: LOCALES });
    expect(map.has('es/in-progress')).toBe(false);
    expect(map.has('es/published')).toBe(true);
  });

  it('ignores non-markdown files', async () => {
    const dir = join(contentRoot, 'es');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'notes.txt'), 'plain text', 'utf8');
    await writeFile(join(dir, '.DS_Store'), 'system noise', 'utf8');
    await writePost(contentRoot, 'es', 'real', { title: 'Real' });
    const map = buildBlogTranslationMap({ contentRoot, locales: LOCALES });
    expect(map.size).toBe(1);
    expect(map.has('es/real')).toBe(true);
  });

  it('skips a missing locale folder without throwing', async () => {
    await writePost(contentRoot, 'es', 'only-es', { title: 'Solo' });
    // Note: en/ folder never created
    const map = buildBlogTranslationMap({ contentRoot, locales: LOCALES });
    expect(map.has('es/only-es')).toBe(true);
    expect([...map.keys()].some((k) => k.startsWith('en/'))).toBe(false);
  });

  it('ignores translatedTo when the value is not a string', async () => {
    await writePost(contentRoot, 'es', 'weird', { title: 'Weird', translatedTo: 42 });
    const map = buildBlogTranslationMap({ contentRoot, locales: LOCALES });
    expect(map.get('es/weird')).toEqual({ es: 'weird' });
  });

  it('honours arbitrary 2-locale pairs (not hardcoded to es/en)', async () => {
    await writePost(contentRoot, 'fr', 'bonjour', {
      title: 'Bonjour',
      translatedTo: 'hallo',
    });
    await writePost(contentRoot, 'de', 'hallo', { title: 'Hallo', translatedTo: 'bonjour' });
    const map = buildBlogTranslationMap({ contentRoot, locales: ['fr', 'de'] });
    expect(map.get('fr/bonjour')).toEqual({ fr: 'bonjour', de: 'hallo' });
    expect(map.get('de/hallo')).toEqual({ de: 'hallo', fr: 'bonjour' });
  });
});
