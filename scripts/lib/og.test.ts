import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parsePostMeta, tagsLine, walkPosts, generateOg, type PostMeta } from './og';

const LOCALES = ['es', 'en'] as const;
// PNG magic number: \x89PNG\r\n\x1a\n
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('parsePostMeta', () => {
  it('reads title, tags, and draft from frontmatter', () => {
    const raw = `---\ntitle: "Hola mundo"\ntags: ["meta", "intro"]\ndraft: false\n---\n\nbody`;
    const meta = parsePostMeta(raw, 'hola-mundo');
    expect(meta).toEqual({
      slug: 'hola-mundo',
      title: 'Hola mundo',
      tags: ['meta', 'intro'],
      draft: false,
    });
  });

  it('falls back to the slug when title is missing', () => {
    const raw = `---\ntags: []\n---\n\nbody`;
    expect(parsePostMeta(raw, 'untitled').title).toBe('untitled');
  });

  it('coerces non-array tags to []', () => {
    const raw = `---\ntitle: "x"\ntags: "not-an-array"\n---`;
    expect(parsePostMeta(raw, 'x').tags).toEqual([]);
  });

  it('treats missing draft as false and any truthy value as true', () => {
    expect(parsePostMeta(`---\ntitle: "x"\n---`, 'x').draft).toBe(false);
    expect(parsePostMeta(`---\ntitle: "x"\ndraft: true\n---`, 'x').draft).toBe(true);
    expect(parsePostMeta(`---\ntitle: "x"\ndraft: false\n---`, 'x').draft).toBe(false);
  });

  it('stringifies non-string tag entries so satori always receives strings', () => {
    const raw = `---\ntitle: "x"\ntags: [1, 2, 3]\n---`;
    expect(parsePostMeta(raw, 'x').tags).toEqual(['1', '2', '3']);
  });
});

describe('tagsLine', () => {
  it('returns null for an empty tag list', () => {
    expect(tagsLine([])).toBeNull();
  });

  it('prefixes each tag with # and joins with two spaces', () => {
    expect(tagsLine(['aws'])).toBe('#aws');
    expect(tagsLine(['aws', 'security'])).toBe('#aws  #security');
    expect(tagsLine(['aws', 'security', 'iam'])).toBe('#aws  #security  #iam');
  });
});

describe('walkPosts', () => {
  let postsDir: string;

  beforeEach(async () => {
    postsDir = await mkdtemp(join(tmpdir(), 'walk-posts-'));
  });
  afterEach(async () => {
    await rm(postsDir, { recursive: true, force: true });
  });

  async function seed(lang: string, slug: string, fm: string, ext = 'md'): Promise<void> {
    const dir = join(postsDir, lang);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, `${slug}.${ext}`), `---\n${fm}\n---\n\nbody\n`, 'utf8');
  }

  it('yields posts from every locale folder', async () => {
    await seed('es', 'hola', 'title: "Hola"');
    await seed('en', 'hello', 'title: "Hello"');
    const slugs = [...walkPosts({ postsDir, locales: LOCALES })].map((p) => p.slug).sort();
    expect(slugs).toEqual(['hello', 'hola']);
  });

  it('includes drafts so the consumer can decide what to do with them', async () => {
    await seed('es', 'wip', 'title: "WIP"\ndraft: true');
    const posts = [...walkPosts({ postsDir, locales: LOCALES })];
    expect(posts).toHaveLength(1);
    expect(posts[0].draft).toBe(true);
  });

  it('skips files whose extension is not .md or .mdx', async () => {
    const dir = join(postsDir, 'es');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'notes.txt'), 'plain', 'utf8');
    await writeFile(join(dir, '.DS_Store'), 'noise', 'utf8');
    await seed('es', 'real', 'title: "Real"');
    const slugs = [...walkPosts({ postsDir, locales: LOCALES })].map((p) => p.slug);
    expect(slugs).toEqual(['real']);
  });

  it('accepts .mdx alongside .md', async () => {
    await seed('es', 'plain', 'title: "Plain"', 'md');
    await seed('es', 'rich', 'title: "Rich"', 'mdx');
    const slugs = [...walkPosts({ postsDir, locales: LOCALES })].map((p) => p.slug).sort();
    expect(slugs).toEqual(['plain', 'rich']);
  });

  it('does not throw when a locale folder is missing', async () => {
    await seed('es', 'only-es', 'title: "Solo"');
    // en/ never created
    expect(() => [...walkPosts({ postsDir, locales: LOCALES })]).not.toThrow();
  });
});

describe('generateOg', () => {
  it('produces a non-empty PNG buffer with the standard PNG signature', async () => {
    const fontData = await readFile(join(process.cwd(), 'scripts/JetBrainsMono-Bold.ttf'));
    const post: PostMeta = {
      slug: 'smoke-test',
      title: 'Smoke test post title',
      tags: ['vitest', 'og'],
      draft: false,
    };
    const png = await generateOg(post, fontData);
    expect(png.length).toBeGreaterThan(1024);
    expect(png.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
  });

  it('renders without a tags line when the post has no tags', async () => {
    const fontData = await readFile(join(process.cwd(), 'scripts/JetBrainsMono-Bold.ttf'));
    const post: PostMeta = { slug: 'no-tags', title: 'No tags here', tags: [], draft: false };
    const png = await generateOg(post, fontData);
    expect(png.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
  });
});
