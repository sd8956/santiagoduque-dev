#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const LOCALES = ['es', 'en'] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function todayISO(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

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
  if (!/^[a-z0-9-]+$/.test(slug)) {
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
    if (descriptionRaw.length < 50 || descriptionRaw.length > 200) {
      console.error(
        `✗ Descripción debe tener entre 50 y 200 caracteres (actual: ${descriptionRaw.length}).`,
      );
      process.exit(1);
    }
    description = descriptionRaw;
  } else {
    description = '[Descripción pendiente: completá entre 50 y 200 caracteres antes de publicar.]';
  }

  const translatedTo = await ask(
    'Slug del post pareado en el otro idioma (vacío si no tiene traducción)',
  );
  if (translatedTo && !/^[a-z0-9-]+$/.test(translatedTo)) {
    console.error(`✗ Slug pareado inválido: "${translatedTo}". Solo a-z, 0-9, y guiones.`);
    process.exit(1);
  }

  rl.close();

  const filePath = resolve('src/content/blog', lang, `${slug}.md`);
  if (await fileExists(filePath)) {
    console.error(`✗ Ya existe: ${filePath}`);
    process.exit(1);
  }

  const tagsYaml = JSON.stringify(tags);

  const frontmatterLines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `pubDate: ${todayISO()}`,
    `language: "${lang}"`,
    `tags: ${tagsYaml}`,
    'featured: false',
    'draft: true',
  ];
  if (translatedTo) {
    frontmatterLines.push(`translatedTo: "${translatedTo}"`);
  }
  frontmatterLines.push('---', '', 'Empezá acá.', '');
  const frontmatter = frontmatterLines.join('\n');

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
