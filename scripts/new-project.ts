#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const URL_RE = /^https?:\/\/.+/;

const rl = createInterface({ input: stdin, output: stdout });

async function ask(question: string, defaultVal?: string): Promise<string> {
  const prompt = defaultVal !== undefined ? `${question} [${defaultVal}]: ` : `${question}: `;
  const answer = (await rl.question(prompt)).trim();
  return answer || defaultVal || '';
}

async function askOptionalUrl(question: string): Promise<string | undefined> {
  const answer = await ask(`${question} (opcional)`, '');
  if (!answer) return undefined;
  if (!URL_RE.test(answer)) {
    console.error(`✗ URL inválida: "${answer}". Debe empezar con http:// o https://`);
    process.exit(1);
  }
  return answer;
}

async function main(): Promise<void> {
  const title = await ask('Título del proyecto');
  if (!title) {
    console.error('✗ El título es obligatorio.');
    process.exit(1);
  }

  const slug = await ask('Slug', slugify(title));
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`✗ Slug inválido: "${slug}". Solo a-z, 0-9, y guiones.`);
    process.exit(1);
  }

  const description = await ask('Descripción corta (1 línea)');
  if (!description) {
    console.error('✗ La descripción es obligatoria.');
    process.exit(1);
  }

  const techStackRaw = await ask('Tech stack (separado por coma)');
  const techStack = techStackRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  if (techStack.length === 0) {
    console.error('✗ Tech stack no puede estar vacío.');
    process.exit(1);
  }

  const githubUrl = await askOptionalUrl('URL de GitHub');
  const demoUrl = await askOptionalUrl('URL de demo');
  const featuredAns = (await ask('¿Featured? (y/n)', 'n')).toLowerCase();
  const featured = ['y', 'yes', 's', 'si', 'sí'].includes(featuredAns);

  rl.close();

  const filePath = resolve('src/content/projects', `${slug}.md`);
  if (await fileExists(filePath)) {
    console.error(`✗ Ya existe: ${filePath}`);
    process.exit(1);
  }

  const lines: string[] = ['---'];
  lines.push(`title: "${title.replace(/"/g, '\\"')}"`);
  lines.push(`description: "${description.replace(/"/g, '\\"')}"`);
  lines.push(`techStack: ${JSON.stringify(techStack)}`);
  if (githubUrl) lines.push(`githubUrl: "${githubUrl}"`);
  if (demoUrl) lines.push(`demoUrl: "${demoUrl}"`);
  lines.push(`featured: ${featured}`);
  lines.push('---');
  lines.push('');
  lines.push('Descripción larga del proyecto en markdown. Reemplazar.');
  lines.push('');

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, lines.join('\n'), 'utf8');

  const url = `/{es,en}/projects/`;
  console.log(`\n✓ Creado: ${filePath}`);
  console.log(`  Visible en: pnpm dev → http://localhost:4321${url}`);
}

main().catch((err: unknown) => {
  console.error('✗ Error inesperado:', err);
  process.exit(1);
});
