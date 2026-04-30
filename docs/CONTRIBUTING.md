# Contribuir al proyecto

Aunque es un proyecto personal, mantener convenciones claras ayuda a:
- Cualquier agente de IA trabajando en el código
- Mi yo futuro que olvidó cómo funcionaba algo
- Cualquier persona que clone el repo para inspirarse

## Flujo de desarrollo

### Branches

- `main` → rama de producción. Deploy automático a Cloudflare Pages.
- `feature/nombre-corto` → features nuevas
- `fix/nombre-corto` → bug fixes
- `content/slug-del-post` → posts nuevos (separado de features de código)

### Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add language switcher to header
fix: correct hreflang for translated posts
content: publish post about AWS IAM boundaries
chore: update dependencies
docs: update architecture notes
refactor: extract PostCard component
style: adjust spacing in hero section
```

### Pull requests

Sí, hacer PRs incluso siendo proyecto solo. Razón:
- Preview deploys automáticos en Cloudflare
- Diff review obligatorio (atrapa errores)
- Historia limpia de cambios

## Crear nuevo post

### Flujo completo

1. **Crear archivo** con el comando:
   ```bash
   pnpm new-post
   ```
   El script pregunta: idioma, título, tags, slug.

2. **Escribir contenido** en el archivo creado.

3. **Revisar preview local:**
   ```bash
   pnpm dev
   ```
   Ir a `http://localhost:4321/{es|en}/blog/{slug}` y revisar.

4. **Quitar `draft: true`** cuando esté listo para publicar.

5. **Commit + push** con mensaje tipo `content: publish [título]`.

6. **Deploy automático** vía Cloudflare Pages.

7. **Cross-post a dev.to** (proceso manual):
   - Copiar contenido del `.md`
   - Pegar en dev.to editor
   - Importante: setear `canonical_url` apuntando a tu blog
   - Publicar después que tu versión esté live (nunca antes)

### Frontmatter obligatorio

```yaml
---
title: "Title exact as will appear"
description: "150-160 char description for SEO and cards"
pubDate: 2026-02-15
language: "en"                    # "en" o "es"
tags: ["aws", "security"]
featured: false
draft: false
---
```

### Frontmatter opcional

```yaml
canonicalUrl: "https://..."        # Si es cross-post
translatedTo: "slug-otro-idioma"   # Si hay versión traducida
translatedFrom: "slug-original"
coverImage: "/images/cover.png"
```

## Crear nuevo proyecto (portfolio)

1. **Crear archivo** en `src/content/projects/[slug].md`
2. **Frontmatter:**
   ```yaml
   ---
   title: "Project Name"
   description: "Short description"
   techStack: ["TypeScript", "AWS CDK", "Python"]
   githubUrl: "https://github.com/..."
   demoUrl: "https://..."            # opcional
   blogPostSlug: "my-related-post"   # opcional, post que explica el proyecto
   featured: false
   coverImage: "/images/projects/..."
   ---
   ```
3. **Body del archivo:** descripción larga del proyecto en markdown.

## Actualizar CV / Página About

CV data vive en `src/data/cv.ts` como objeto TypeScript tipado.

Actualizar allí propaga a:
- Página `/about`
- Metadata estructurada (JSON-LD)
- Generador de PDF si está implementado

## Convenciones de código

### TypeScript

- **Strict mode obligatorio.**
- **No `any`** sin comentario justificando.
- **Tipos explícitos** en function signatures públicas.
- **Utility types** cuando aplique (`Pick`, `Omit`, `Partial`).

### Astro components

- **Un componente por archivo.**
- **Props con TypeScript interface:**
  ```astro
  ---
  interface Props {
    title: string;
    date: Date;
    tags?: string[];
  }

  const { title, date, tags = [] } = Astro.props;
  ---
  ```
- **Slots nombrados** cuando el componente tiene múltiples áreas de contenido.
- **No scripts client-side** a menos que sea absolutamente necesario (usa `client:idle` o `client:visible`).

### Tailwind

- **Utility-first.** Usar clases de Tailwind sobre CSS custom.
- **Extracción de patrones** cuando una combinación se repita 3+ veces: convertir en componente Astro, no en `@apply`.
- **Design tokens** en `tailwind.config.mjs`. No hardcodear colores/spacing en componentes.

### Naming

- **Componentes:** PascalCase (`PostCard.astro`)
- **Utilities:** camelCase (`readingTime.ts`)
- **Constants:** SCREAMING_SNAKE_CASE
- **CSS custom properties:** kebab-case (`--bg-primary`)
- **Slugs:** kebab-case (`my-first-post`)

## Revisión antes de publicar contenido

Checklist para cada post antes de pasar `draft: false`:

- [ ] Título descriptivo y SEO-friendly (max 60 chars)
- [ ] Description entre 150-160 caracteres
- [ ] Al menos 2 tags relevantes
- [ ] Imagen de cover generada (usar Figma o similar, 1200x630)
- [ ] Headings bien estructurados (H2 → H3 → H4, no saltar niveles)
- [ ] Código con lenguaje especificado en code blocks
- [ ] Links internos a otros posts relacionados si aplica
- [ ] Enlaces externos abren en nueva pestaña (target="_blank" con rel="noopener")
- [ ] Leer en voz alta al menos una vez (atrapa errores de flujo)
- [ ] Pasar por Grammarly o similar si es post largo en inglés

## Revisión antes de PR a main

Checklist técnico:

- [ ] `pnpm build` pasa sin errores
- [ ] `pnpm typecheck` pasa
- [ ] `pnpm lint` pasa
- [ ] Preview manual del cambio funciona en ambos idiomas
- [ ] No hay console.logs olvidados
- [ ] No hay TODOs sin ticket asociado

## Cuando trabajar con un agente de IA

### Setup de sesión

Al empezar sesión con Claude Code / Cursor / Windsurf:

1. Asegurar que el agente leyó `AGENTS.md` (lo hace automáticamente si está en raíz)
2. Describir qué quieres hacer con contexto
3. Pedir plan antes de código cuando sea cambio significativo
4. Revisar plan antes de aprobar implementación

### Qué esperar del agente

- Respetar estructura documentada en `AGENTS.md`
- Preguntar antes de instalar dependencias nuevas
- Actualizar docs cuando corresponda
- Proponer ADR si decisión arquitectónica nueva

### Qué NO dejar que haga el agente

- Instalar libs exóticas sin justificación
- Cambiar stack fundamental sin ADR
- Generar cambios masivos en 1 PR (preferir PRs chicos y revisables)
- Commitear código sin tipar
