#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  type Locale,
  isLocale,
  slugify,
  todayISO,
  fileExists,
  buildFrontmatter,
  isValidSlug,
  isDescriptionInRange,
  PLACEHOLDER_DESCRIPTION,
} from './lib/new-post-helpers';

const rl = createInterface({ input: stdin, output: stdout });

async function ask(question: string, defaultVal?: string): Promise<string> {
  const prompt = defaultVal !== undefined ? `${question} [${defaultVal}]: ` : `${question}: `;
  const answer = (await rl.question(prompt)).trim();
  return answer || defaultVal || '';
}

async function main(): Promise<void> {
  const lang = (await ask('Idioma (es/en)', 'es')).toLowerCase();
  if (!isLocale(lang)) {
    console.error(`✗ Idioma inválido: "${lang}". Solo "es" o "en".`);
    process.exit(1);
  }

  const title = await ask('Título');
  if (!title) {
    console.error('✗ El título es obligatorio.');
    process.exit(1);
  }

  const slug = await ask('Slug', slugify(title));
  if (!isValidSlug(slug)) {
    console.error(`✗ Slug inválido: "${slug}". Solo a-z, 0-9, y guiones.`);
    process.exit(1);
  }

  const tagsRaw = await ask('Tags (separados por coma)', '');
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const descriptionRaw = await ask('Descripción (50-200 chars, vacío para placeholder editable)');
  let description: string;
  if (descriptionRaw) {
    if (!isDescriptionInRange(descriptionRaw)) {
      console.error(
        `✗ Descripción debe tener entre 50 y 200 caracteres (actual: ${descriptionRaw.length}).`,
      );
      process.exit(1);
    }
    description = descriptionRaw;
  } else {
    description = PLACEHOLDER_DESCRIPTION;
  }

  const translatedTo = await ask(
    'Slug del post pareado en el otro idioma (vacío si no tiene traducción)',
  );
  if (translatedTo && !isValidSlug(translatedTo)) {
    console.error(`✗ Slug pareado inválido: "${translatedTo}". Solo a-z, 0-9, y guiones.`);
    process.exit(1);
  }

  rl.close();

  const filePath = resolve('src/content/blog', lang, `${slug}.md`);
  if (await fileExists(filePath)) {
    console.error(`✗ Ya existe: ${filePath}`);
    process.exit(1);
  }

  const frontmatter = buildFrontmatter({
    title,
    description,
    pubDate: todayISO(),
    language: lang,
    tags,
    translatedTo: translatedTo || undefined,
  });

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, frontmatter, 'utf8');

  const url = `/${lang}/blog/${slug}/`;
  console.log(`\n✓ Creado: ${filePath}`);
  console.log(`  Preview local: pnpm dev → http://localhost:4321${url}`);
  console.log(`  Listo para publicar: editar contenido + cambiar draft: false`);

  if (translatedTo) {
    const otherLang: Locale = lang === 'es' ? 'en' : 'es';
    console.log(
      `\n  Este post quedó pareado con /${otherLang}/blog/${translatedTo}/.\n  Si ese post aún no existe, corré el script de nuevo y declará "translatedTo: ${slug}" para cerrar el cruce.`,
    );
  }
}

main().catch((err: unknown) => {
  console.error('✗ Error inesperado:', err);
  process.exit(1);
});
