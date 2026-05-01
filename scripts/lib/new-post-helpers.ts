import { access } from 'node:fs/promises';

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const PLACEHOLDER_DESCRIPTION =
  '[Descripción pendiente: completá entre 50 y 200 caracteres antes de publicar.]';

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function todayISO(now: Date = new Date()): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

interface FrontmatterOptions {
  title: string;
  description: string;
  pubDate: string;
  language: Locale;
  tags: string[];
  translatedTo?: string;
}

export function buildFrontmatter(opts: FrontmatterOptions): string {
  const lines = [
    '---',
    `title: "${opts.title.replace(/"/g, '\\"')}"`,
    `description: "${opts.description.replace(/"/g, '\\"')}"`,
    `pubDate: ${opts.pubDate}`,
    `language: "${opts.language}"`,
    `tags: ${JSON.stringify(opts.tags)}`,
    'featured: false',
    'draft: true',
  ];
  if (opts.translatedTo) {
    lines.push(`translatedTo: "${opts.translatedTo}"`);
  }
  lines.push('---', '', 'Empezá acá.', '');
  return lines.join('\n');
}

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

export function isDescriptionInRange(value: string): boolean {
  return value.length >= 50 && value.length <= 200;
}
