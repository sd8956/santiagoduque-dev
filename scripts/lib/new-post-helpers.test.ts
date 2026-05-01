import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  isLocale,
  slugify,
  todayISO,
  fileExists,
  buildFrontmatter,
  isValidSlug,
  isDescriptionInRange,
  PLACEHOLDER_DESCRIPTION,
  LOCALES,
} from './new-post-helpers';

describe('isLocale', () => {
  it('matches each declared locale', () => {
    for (const loc of LOCALES) {
      expect(isLocale(loc)).toBe(true);
    }
  });

  it('rejects unknown languages', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
  });
});

describe('slugify', () => {
  it('lowercases and joins words with dashes', () => {
    expect(slugify('Hola Mundo')).toBe('hola-mundo');
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips diacritics so URLs stay ASCII', () => {
    expect(slugify('Diseño de páginas estáticas')).toBe('diseno-de-paginas-estaticas');
    expect(slugify('Café con leche')).toBe('cafe-con-leche');
  });

  it('replaces every non-alphanumeric run with a single dash', () => {
    expect(slugify('AWS::IAM // Roles & Policies')).toBe('aws-iam-roles-policies');
  });

  it('trims leading and trailing dashes', () => {
    expect(slugify('  ¡Hola, mundo!  ')).toBe('hola-mundo');
    expect(slugify('---tag---')).toBe('tag');
  });

  it('returns empty string when no alphanumerics survive', () => {
    expect(slugify('!!!')).toBe('');
    expect(slugify('   ')).toBe('');
  });
});

describe('todayISO', () => {
  it('returns YYYY-MM-DD with zero-padded month and day', () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(todayISO(new Date(2026, 8, 30))).toBe('2026-09-30');
  });

  it('uses local time so the date does not flip across midnight UTC', () => {
    // Constructed via local-time fields, so the formatter should echo them back.
    expect(todayISO(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('defaults to "now" when no argument is passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 1));
    try {
      expect(todayISO()).toBe('2026-05-01');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('isValidSlug', () => {
  it('accepts kebab-case alphanumeric slugs', () => {
    expect(isValidSlug('hola-mundo')).toBe(true);
    expect(isValidSlug('aws-iam-101')).toBe(true);
    expect(isValidSlug('a')).toBe(true);
  });

  it('rejects slugs with uppercase, accents, or whitespace', () => {
    expect(isValidSlug('Hola-Mundo')).toBe(false);
    expect(isValidSlug('café')).toBe(false);
    expect(isValidSlug('hola mundo')).toBe(false);
    expect(isValidSlug('')).toBe(false);
  });
});

describe('isDescriptionInRange', () => {
  it('honours the 50-200 char window of the content schema', () => {
    expect(isDescriptionInRange('a'.repeat(49))).toBe(false);
    expect(isDescriptionInRange('a'.repeat(50))).toBe(true);
    expect(isDescriptionInRange('a'.repeat(200))).toBe(true);
    expect(isDescriptionInRange('a'.repeat(201))).toBe(false);
  });
});

describe('PLACEHOLDER_DESCRIPTION', () => {
  it('is itself in range so the schema accepts a stub post', () => {
    expect(isDescriptionInRange(PLACEHOLDER_DESCRIPTION)).toBe(true);
  });
});

describe('buildFrontmatter', () => {
  const base = {
    title: 'Hola, mundo',
    description: 'Una descripción suficientemente larga para pasar la validación del schema (50+).',
    pubDate: '2026-04-29',
    language: 'es' as const,
    tags: ['meta', 'intro'],
  };

  it('emits the canonical frontmatter block', () => {
    const out = buildFrontmatter(base);
    expect(out).toContain('---\ntitle: "Hola, mundo"');
    expect(out).toContain('language: "es"');
    expect(out).toContain('tags: ["meta","intro"]');
    expect(out).toContain('featured: false');
    expect(out).toContain('draft: true');
    expect(out).toMatch(/---\n\nEmpezá acá\.\n$/);
  });

  it('omits translatedTo when not provided', () => {
    expect(buildFrontmatter(base)).not.toContain('translatedTo');
  });

  it('emits translatedTo when provided', () => {
    const out = buildFrontmatter({ ...base, translatedTo: 'hello-world' });
    expect(out).toContain('translatedTo: "hello-world"');
  });

  it('escapes embedded double quotes in title and description', () => {
    const out = buildFrontmatter({
      ...base,
      title: 'He said "hi"',
      description: 'Quote: "x" — and it should be escaped within the YAML string literal here.',
    });
    expect(out).toContain('title: "He said \\"hi\\""');
    expect(out).toContain('description: "Quote: \\"x\\"');
  });

  it('serialises the tag list as a JSON array', () => {
    const out = buildFrontmatter({ ...base, tags: [] });
    expect(out).toContain('tags: []');
  });
});

describe('fileExists', () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'new-post-helpers-'));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('returns true when the file is on disk', async () => {
    const path = join(dir, 'a.md');
    await writeFile(path, 'x', 'utf8');
    await expect(fileExists(path)).resolves.toBe(true);
  });

  it('returns false when the file does not exist', async () => {
    await expect(fileExists(join(dir, 'missing.md'))).resolves.toBe(false);
  });
});
