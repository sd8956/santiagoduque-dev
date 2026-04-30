# Arquitectura

Este documento describe decisiones técnicas y estructura del proyecto.

## Stack definitivo

| Capa | Tecnología | Razón breve |
|---|---|---|
| Framework | Astro 4.x | Static-first, SEO excelente, DX moderna |
| Lenguaje | TypeScript strict | Type safety, mejor DX con agentes de IA |
| Estilos | TailwindCSS | Utility-first, consistencia, rapidez |
| Contenido | MDX + Content Collections | Markdown con componentes cuando haga falta |
| Package manager | pnpm | Velocidad y eficiencia de disco |
| Hosting | Cloudflare Pages | Gratis, rápido, analytics incluido |
| Fuente principal | JetBrains Mono | Monospace profesional de calidad |

Ver [DECISIONS.md](./DECISIONS.md) para justificaciones completas.

## Estructura de carpetas

```
santiagoduque-dev/
├── README.md                    # Overview del proyecto
├── AGENTS.md                    # Convenciones para agentes de IA
├── CLAUDE.md                    # Específico Claude Code (referencia AGENTS.md)
├── docs/
│   ├── ARCHITECTURE.md          # Este archivo
│   ├── DECISIONS.md             # ADRs
│   └── CONTRIBUTING.md          # Flujo de trabajo
│
├── public/                      # Assets estáticos (imágenes, fuentes, CV PDF)
│   ├── fonts/
│   ├── images/
│   └── cv.pdf
│
├── src/
│   ├── content/                 # Content Collections de Astro
│   │   ├── blog/
│   │   │   ├── es/              # Posts en español (.md o .mdx)
│   │   │   └── en/              # Posts en inglés (.md o .mdx)
│   │   ├── projects/            # Proyectos del portfolio
│   │   └── config.ts            # Schemas de Content Collections
│   │
│   ├── components/
│   │   ├── layout/              # Header, Footer, LanguageSwitcher
│   │   ├── blog/                # PostCard, PostList, TagList, TOC
│   │   ├── ui/                  # Button, Badge, CodeBlock (primitivos)
│   │   └── home/                # Hero, FeaturedProjects, RecentPosts
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Layout base (head, meta, analytics)
│   │   ├── BlogLayout.astro     # Para posts individuales
│   │   └── PageLayout.astro     # Para páginas estáticas
│   │
│   ├── pages/
│   │   ├── index.astro          # Redirect según idioma del browser
│   │   ├── es/                  # Páginas en español
│   │   │   ├── index.astro
│   │   │   ├── about.astro
│   │   │   ├── blog/
│   │   │   │   ├── index.astro
│   │   │   │   └── [slug].astro
│   │   │   ├── projects.astro
│   │   │   ├── now.astro
│   │   │   ├── uses.astro
│   │   │   └── contact.astro
│   │   ├── en/                  # Misma estructura que es/
│   │   ├── rss.xml.js
│   │   └── sitemap.xml.js
│   │
│   ├── i18n/
│   │   ├── translations.ts      # Strings de UI en ambos idiomas
│   │   ├── utils.ts             # Helpers (getLangFromUrl, etc.)
│   │   └── config.ts            # Config de idiomas soportados
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── prose.css            # Estilos de contenido markdown
│   │
│   ├── utils/
│   │   ├── dates.ts
│   │   ├── readingTime.ts
│   │   └── seo.ts
│   │
│   └── data/
│       ├── site.ts              # Config global (título, URL, etc.)
│       ├── navigation.ts        # Estructura del menú
│       └── cv.ts                # Datos para página About
│
└── scripts/
    └── new-post.ts              # CLI helper para posts nuevos
```

## Páginas del sitio

El sitio tiene 7 páginas principales, ambas duplicadas por idioma:

| Ruta | Propósito |
|---|---|
| `/` | Landing con hero, proyectos destacados, posts recientes |
| `/about` | CV completo en formato legible + link a PDF |
| `/blog` | Listado de posts con filtros por tag |
| `/blog/[slug]` | Post individual |
| `/projects` | Portfolio de proyectos técnicos |
| `/now` | Qué estoy haciendo actualmente (se actualiza mensualmente) |
| `/uses` | Herramientas y setup |
| `/contact` | Formas de contacto |

## Internacionalización (i18n)

### Estrategia: URLs prefijadas

```
santiagoduque.dev/          → redirect según Accept-Language header
santiagoduque.dev/es/       → home en español
santiagoduque.dev/en/       → home en inglés
```

### Reglas

1. **Cada post declara su idioma en frontmatter.** No hay "post bilingüe".
2. **No todos los posts se traducen.** Solo los estratégicamente importantes.
3. **Posts con traducción se linkean entre sí** vía `translatedTo` / `translatedFrom` en frontmatter.
4. **UI completamente traducida.** Todo string visible en `src/i18n/translations.ts`.
5. **Language switcher visible en header.**

### Frontmatter de un post

```yaml
---
title: "Title in the post's language"
description: "Short description for SEO and cards"
pubDate: 2026-02-15
language: "en"                    # "en" o "es"
tags: ["aws", "security"]
featured: false                    # Aparece en home si true
draft: false
canonicalUrl: "https://..."        # Para cross-posts a dev.to
translatedTo: "slug-en-otro-idioma"   # opcional
translatedFrom: null
coverImage: "/images/cover.png"
---
```

## Estética y diseño

### Principios

- **Terminal minimalista profesional**, no edgy hacker
- **Dark mode default**, light mode opcional
- **Mucho espacio en negro**, sin saturar
- **Tipografía monospace dominante** pero legible
- **Accent color usado con moderación** (highlights, no decoración)

### Paleta de colores

Define en `tailwind.config.mjs` usando CSS custom properties:

```js
// Dark mode
--bg-primary: #0d0d0d
--bg-secondary: #1a1a1a
--text-primary: #e5e5e5
--text-secondary: #a0a0a0
--accent: [Claude Code sugiere basado en principios del sitio]
--border: #2a2a2a
--code-bg: #161616

// Light mode (opcional, implementar después)
--bg-primary: #fafafa
--bg-secondary: #ffffff
--text-primary: #1a1a1a
--text-secondary: #525252
--accent: [versión oscura del accent color]
--border: #e5e5e5
--code-bg: #f5f5f5
```

### Tipografía

- **Body y código:** JetBrains Mono (self-hosted en `public/fonts/`)
- **Headings:** JetBrains Mono Bold o una sans moderna como Inter para contraste (a decidir)

### Referencias que SÍ capturan la estética correcta

- fly.io
- drewdevault.com
- thesephist.com
- bun.sh
- monkeytype.com

### Anti-patrones a evitar

- Glitch effects, matrix rain, terminal typewriter animations excesivas
- Neón saturado
- Emojis en UI core (sí en contenido de posts)
- Referencias cliché de hacking (hoodies, matrix, etc.)

## SEO

Requisitos mínimos para cada página:

- `<title>` único y descriptivo
- `<meta name="description">` único (150-160 caracteres)
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- Canonical URL (especialmente importante para posts cross-posted)
- Structured data (JSON-LD) para posts tipo `BlogPosting`
- `<link rel="alternate" hreflang>` para versiones en otro idioma

## Performance targets

- **Lighthouse scores:** 95+ en todas las categorías
- **Time to First Byte:** <200ms
- **Largest Contentful Paint:** <1s
- **Total bundle size:** <100KB JavaScript crítico

Astro + Cloudflare Pages + pocas dependencias JS hace que esto sea alcanzable sin esfuerzo extraordinario.

## Convenciones de código

- **TypeScript strict.** No `any`, no `@ts-ignore` sin comentario explicando.
- **Astro components** (`.astro`) para todo estático, **React/Vue solo si necesario** para interactividad (preferible nada).
- **Tailwind first**, CSS custom solo para cosas que Tailwind no cubre.
- **Props tipadas** en todos los componentes.
- **Prettier** con configuración en repo.
- **ESLint** con configuración en repo.
- **Conventional commits** (feat, fix, chore, docs, refactor, style, test).

## Testing

Para esta fase inicial no hay tests obligatorios. Agregar cuando:
- Hay lógica compleja de transformación de datos
- Se implementan scripts custom (ej: `new-post.ts`)
- Hay bugs recurrentes en cierto componente

Cuando se agreguen, usar Vitest.
