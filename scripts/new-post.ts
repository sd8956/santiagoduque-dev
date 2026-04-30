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

  rl.close();

  const filePath = resolve('src/content/blog', lang, `${slug}.md`);
  if (await fileExists(filePath)) {
    console.error(`✗ Ya existe: ${filePath}`);
    process.exit(1);
  }

  const description = 'TODO: descripción de 150-160 caracteres para SEO y para las preview cards.';
  const tagsYaml = JSON.stringify(tags);

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description}"
pubDate: ${todayISO()}
language: "${lang}"
tags: ${tagsYaml}
featured: false
draft: true
---

Empezá acá.
`;

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, frontmatter, 'utf8');

  const url = `/${lang}/blog/${slug}/`;
  console.log(`\n✓ Creado: ${filePath}`);
  console.log(`  Preview local: pnpm dev → http://localhost:4321${url}`);
  console.log(`  Listo para publicar: editar contenido + cambiar draft: false`);
}

main().catch((err: unknown) => {
  console.error('✗ Error inesperado:', err);
  process.exit(1);
});
