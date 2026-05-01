---
title: 'santiagoduque.dev'
description: 'Blog técnico y portafolio personal: sitio estático bilingüe (ES/EN) sobre cloud security, AWS y arquitecturas event-driven, desplegado en Cloudflare Workers Static Assets.'
techStack:
  - 'Astro 6'
  - 'TypeScript strict'
  - 'TailwindCSS v4'
  - 'Cloudflare Workers Static Assets'
  - 'Pagefind'
  - 'Vitest'
githubUrl: 'https://github.com/sd8956/santiagoduque-dev'
demoUrl: 'https://santiagoduque.dev'
blogPostSlug: 'como-construimos-este-blog'
featured: true
---

Static-first, bilingüe, sin frameworks de runtime. Highlights:

- **Bilingüe con pareo explícito** entre posts vía `translatedTo` en frontmatter — el switcher de idioma navega entre las versiones reales, no a un fallback.
- **Búsqueda local** con Pagefind, scopeada al blog vía `data-pagefind-body` y oculta en `astro dev` para evitar la pantalla "no disponible".
- **OG images per-post** generadas en `prebuild` con satori + resvg (sin endpoints SSR — todo estático para sobrevivir a Workers).
- **CI con typecheck + lint + format + test + build** y branch protection en `master`: PR-only, status check requerido, sin force-push.
- **Tests con Vitest** sobre utils, i18n, helpers de scripts y un smoke test del pipeline de OG (PNG signature check) — 66 tests al cierre del primer ciclo.
