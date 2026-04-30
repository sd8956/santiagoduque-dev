# santiagoduque.dev

Blog personal y portafolio profesional de Santiago Duque.
Tech Lead & Senior Software Engineer especializado en AWS serverless y arquitecturas event-driven.

## Stack

- **Framework:** [Astro](https://astro.build) 4.x
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** [TailwindCSS](https://tailwindcss.com)
- **Contenido:** MDX con Content Collections
- **Package manager:** pnpm
- **Hosting:** Cloudflare Pages
- **Analytics:** Cloudflare Web Analytics (privacy-friendly)
- **Fuente principal:** JetBrains Mono

## Setup local

Requisitos previos:
- Node.js 20+
- pnpm 8+

```bash
# Instalar dependencias
pnpm install

# Desarrollo local (http://localhost:4321)
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview
```

## Comandos útiles

```bash
pnpm dev           # Desarrollo con hot reload
pnpm build         # Build optimizado para producción
pnpm preview       # Preview del build local
pnpm new-post      # Crear nuevo post con template
pnpm lint          # Linting con ESLint
pnpm format        # Format con Prettier
pnpm typecheck     # Verificar tipos TypeScript
```

## Documentación del proyecto

| Archivo | Contenido |
|---|---|
| [AGENTS.md](./AGENTS.md) | Convenciones para agentes de IA (cualquier agente) |
| [CLAUDE.md](./CLAUDE.md) | Específico de Claude Code (apunta a AGENTS.md) |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Decisiones técnicas y estructura |
| [docs/DECISIONS.md](./docs/DECISIONS.md) | ADRs con el "por qué" de cada decisión |
| [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Flujo de trabajo y convenciones |

## Estructura del proyecto

```
src/
├── content/       # Posts y proyectos (Markdown/MDX)
├── components/    # Componentes Astro reusables
├── layouts/       # Layouts base
├── pages/         # Rutas del sitio (incluye /es y /en)
├── i18n/          # Configuración de idiomas
├── styles/        # Estilos globales
├── utils/         # Helpers
└── data/          # Configuración del sitio
```

Detalles completos en [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Idiomas

El sitio es bilingüe (español/inglés) con URLs prefijadas:

- `santiagoduque.dev/es/...` — contenido en español
- `santiagoduque.dev/en/...` — contenido en inglés

No todos los posts se traducen. Cada post tiene su idioma declarado en frontmatter.

## Crear nuevo post

```bash
pnpm new-post
```

Esto crea un archivo en `src/content/blog/{es|en}/` con el frontmatter correcto.

Ver [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) para el flujo completo.

## Para agentes de IA

**Antes de hacer cualquier cambio en el repo, lee [AGENTS.md](./AGENTS.md).**

`AGENTS.md` contiene las convenciones operativas y reglas que cualquier agente (Claude Code, Cursor, Windsurf, etc.) debe seguir al trabajar en este proyecto.

## Deploy

Deploy automático vía Cloudflare Pages:
- Push a `main` → deploy a producción
- Pull requests → preview deployments automáticos

## Licencia

Código: MIT
Contenido (posts, escritos): CC BY-NC-SA 4.0
