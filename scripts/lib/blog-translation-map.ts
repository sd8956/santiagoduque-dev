import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export type TranslationPair = Record<string, string>;

interface BuildOptions {
  /** Absolute path to the blog collection root (the directory that contains the locale subfolders). */
  contentRoot: string;
  /** Two-element list of locale codes that match the subdirectory names. */
  locales: readonly string[];
}

/**
 * Walks every locale folder under `contentRoot` and builds a map of
 * `${lang}/${slug}` → cross-language slug pair, derived from the post's
 * `translatedTo` frontmatter field. Drafts and non-`.md` entries are skipped.
 *
 * Side effects: synchronous reads only — safe to call from astro.config.mjs
 * during config evaluation.
 */
export function buildBlogTranslationMap({
  contentRoot,
  locales,
}: BuildOptions): Map<string, TranslationPair> {
  const map = new Map<string, TranslationPair>();
  for (const lang of locales) {
    const dir = join(contentRoot, lang);
    let files: string[];
    try {
      files = readdirSync(dir);
    } catch {
      continue;
    }
    const otherLang = locales.find((l) => l !== lang);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const filePath = join(dir, file);
      const { data } = matter(readFileSync(filePath, 'utf-8'));
      if (data.draft) continue;
      const pair: TranslationPair = { [lang]: slug };
      if (otherLang && typeof data.translatedTo === 'string') {
        pair[otherLang] = data.translatedTo;
      }
      map.set(`${lang}/${slug}`, pair);
    }
  }
  return map;
}
