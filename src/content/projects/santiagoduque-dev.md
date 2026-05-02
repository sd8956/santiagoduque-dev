---
title: 'santiagoduque.dev'
description:
  es: 'Blog técnico y portafolio personal: sitio estático bilingüe (ES/EN) sobre AWS serverless, arquitecturas event-driven y sistemas AI-native, desplegado en Cloudflare Workers Static Assets.'
  en: 'Personal technical blog and portfolio: static bilingual site (ES/EN) on AWS serverless, event-driven architectures, and AI-native systems, deployed on Cloudflare Workers Static Assets.'
techStack:
  - 'Astro 6'
  - 'TypeScript strict'
  - 'TailwindCSS v4'
  - 'Cloudflare Workers Static Assets'
  - 'Pagefind'
  - 'Vitest'
githubUrl: 'https://github.com/sd8956/santiagoduque-dev'
demoUrl: 'https://santiagoduque.dev'
blogPostSlug:
  es: 'como-construi-este-blog-con-ia'
  en: 'how-i-built-this-blog-with-ai'
featured: true
---

Static-first, bilingüe, sin frameworks de runtime. Highlights:

- **Bilingüe con pareo explícito** entre posts vía `translatedTo` en frontmatter — el switcher de idioma navega entre las versiones reales, no a un fallback.
- **Búsqueda local** con Pagefind, scopeada al blog vía `data-pagefind-body` y oculta en `astro dev` para evitar la pantalla "no disponible".
- **OG images per-post** generadas en `prebuild` con satori + resvg (sin endpoints SSR — todo estático para sobrevivir a Workers).
- **CI con typecheck + lint + format + test + build** y branch protection en `master`: PR-only, status check requerido, sin force-push.
- **Tests con Vitest** sobre utils, i18n, helpers de scripts y un smoke test del pipeline de OG (PNG signature check) — 66 tests al cierre del primer ciclo.
