# Architecture Decision Records

Este documento registra las decisiones arquitectónicas significativas del proyecto.
Nuevas decisiones importantes se agregan como ADRs numerados en orden cronológico.

Formato inspirado en [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

---

## ADR 001: Usar Astro como framework

**Fecha:** 2026
**Estado:** Aceptado

### Contexto

Necesito un blog técnico que sea:
- Rápido (SEO importa, recruiters lo ven, posts largos con código deben cargar bien)
- Simple de mantener (no quiero pelear con configuración)
- Flexible para mezclar páginas estáticas (About, Uses) y contenido dinámico (blog)
- Compatible con MDX para ocasionalmente tener componentes en posts

### Opciones consideradas

1. **Astro** — Static-first, excelente SEO, comunidad creciente
2. **Next.js** — Popular, pero overkill para un blog, server complexity innecesaria
3. **Gatsby** — En decadencia, GraphQL layer agrega complejidad no justificada
4. **Hugo** — Rápido pero Go templates son más difíciles de mantener para mí
5. **Jekyll** — Viejo y limitado

### Decisión

Usar Astro.

### Consecuencias

**Positivas:**
- HTML estático puro por defecto, performance excelente
- Content Collections nativas con type-safety
- Islands architecture para cuando necesito interactividad
- DX moderna con TypeScript
- Cualquier agente de IA entiende Astro (sintaxis cercana a HTML/JSX)

**Negativas:**
- Comunidad más pequeña que Next.js (aunque creciendo rápido)
- Algunos plugins menos maduros

---

## ADR 002: TailwindCSS para estilos

**Fecha:** 2026
**Estado:** Aceptado

### Contexto

Necesito sistema de estilos que sea consistente, rápido de iterar, y que no genere CSS muerto en producción.

### Decisión

TailwindCSS con configuración custom para los design tokens del sitio.

### Razón

- Utility-first elimina bikeshedding sobre naming
- Tree-shaking automático → CSS final muy pequeño
- Documentación excelente y universal
- Cualquier agente de IA lo entiende sin contexto adicional
- Design tokens en `tailwind.config.mjs` mantienen consistencia

### Consecuencias

**Positivas:**
- CSS final extremadamente pequeño
- Consistencia visual automática
- Refactoring rápido

**Negativas:**
- HTML con clases largas (mitigar con componentes Astro reusables)
- Curva de aprendizaje inicial

---

## ADR 003: i18n con rutas prefijadas

**Fecha:** 2026
**Estado:** Aceptado

### Contexto

El sitio es bilingüe español/inglés. Necesito estrategia clara para estructura de URLs, SEO, y navegación.

### Opciones consideradas

1. **Rutas prefijadas** (`/es/...`, `/en/...`)
2. **Subdominios** (`es.santiagoduque.dev`, `en.santiagoduque.dev`)
3. **Query params** (`?lang=es`)
4. **Detection + cookies sin URLs visibles**

### Decisión

Rutas prefijadas con redirect en `/` basado en `Accept-Language` header del browser.

### Razón

- SEO óptimo (cada idioma tiene URLs únicas indexables)
- `hreflang` tags funcionan limpio
- Compartir links preserva el idioma
- Implementación nativa en Astro con poca configuración

### Consecuencias

**Positivas:**
- SEO perfecto por idioma
- UX clara para usuarios
- Fácil de mantener

**Negativas:**
- Duplicación de estructura de páginas en `/es/` y `/en/`
- Duplicación mitigada con componentes reusables

---

## ADR 004: No traducir todos los posts

**Fecha:** 2026
**Estado:** Aceptado

### Contexto

Traducir cada post requiere tiempo significativo. Con 10-15 horas semanales de dedicación entre estudio y escritura, traducir todo reduciría drasticamente la cantidad de contenido producido.

### Decisión

Cada post se escribe en UN solo idioma. Solo se traducen posts estratégicamente importantes (ej: los que tienen potencial de atraer mucho tráfico o son piezas de posicionamiento).

### Razón

- Optimizar para cantidad de contenido total
- Español para audiencia LatAm (comunidad + SEO local)
- Inglés para audiencia internacional y recruiters US/EU
- Decisión por post, no regla rígida

### Criterios para traducir un post

Traducir si cumple al menos 2 de estos:
- Atrae tráfico orgánico alto (top 5 posts por visitas)
- Es pieza de posicionamiento profesional clave
- Contenido tipo "guide" o "reference" con larga vida útil
- Alguien lo pide explícitamente

### Consecuencias

**Positivas:**
- Más contenido producido en total
- Cada post en el idioma donde naturalmente funciona mejor
- Flexibilidad de decisión case-by-case

**Negativas:**
- Algunos lectores no encuentran contenido en su idioma preferido
- Mitigado: cada página en blog list muestra idioma claramente

---

## ADR 005: Cloudflare Pages para hosting

**Fecha:** 2026
**Estado:** Aceptado

### Opciones consideradas

1. **Cloudflare Pages** — Gratis, rápido, analytics incluido
2. **GitHub Pages** — Gratis, simple, pero menos features
3. **Vercel** — Gratis para personal, excelente DX, pero ecosistema NextJS-centric
4. **Netlify** — Histórico líder, features buenas, plan gratis con límites

### Decisión

Cloudflare Pages.

### Razón

- Global CDN incluido (latencia baja en todo el mundo)
- Web Analytics gratis, privacy-friendly (sin banner de cookies)
- Deploy previews automáticos
- Límites generosos en plan gratuito (500 builds/mes, bandwidth ilimitado)
- Integración con resto del ecosistema Cloudflare si algún día necesito Workers, R2, etc.

### Consecuencias

**Positivas:**
- Performance global excelente
- Analytics sin consent banner
- Escalabilidad sin cambiar hosting

**Negativas:**
- Dependencia de Cloudflare como vendor
- Mitigado: el stack es portable, migrar es trivial

---

## ADR 006: MDX para posts

**Fecha:** 2026
**Estado:** Aceptado

### Contexto

Markdown estándar es suficiente 95% del tiempo, pero ocasionalmente necesito componentes custom en posts (diagramas interactivos, alertas, tabs de código, etc.).

### Decisión

Usar MDX (Markdown + JSX) con Content Collections de Astro.

### Razón

- Markdown estándar sigue funcionando sin cambios
- Componentes Astro disponibles cuando se necesitan
- Type-safety en frontmatter vía Content Collections
- Compatibilidad completa con syntax highlighters

### Consecuencias

**Positivas:**
- Flexibilidad total
- Mejor DX que Markdown puro
- Frontmatter validado automáticamente

**Negativas:**
- Ligeramente más complejo que Markdown puro
- Mitigado: usar JSX solo cuando es realmente necesario

---

## ADR 007: TypeScript strict mode

**Fecha:** 2026
**Estado:** Aceptado

### Decisión

TypeScript con `strict: true` en `tsconfig.json` desde el día 1.

### Razón

- Atrapa bugs en compile time
- Mejor experiencia con agentes de IA (tipos dan contexto)
- Código más mantenible a largo plazo
- No cuesta más esfuerzo escribir tipos correctos desde el inicio que retrofitear después

### Reglas

- No `any` sin comentario justificando
- No `@ts-ignore` sin comentario justificando
- Interfaces explícitas para props de componentes
- Tipos derivados (no duplicados) cuando sea posible

---

## ADR 008: Comentarios diferidos a fase posterior

**Fecha:** 2026
**Estado:** Aceptado

### Contexto

Blogs técnicos frecuentemente tienen sistema de comentarios. Opciones populares: Disqus, Giscus (GitHub Discussions), Utterances.

### Decisión

**No implementar comentarios en la fase inicial.** Re-evaluar cuando el blog tenga tráfico orgánico significativo (>500 visitas/semana).

### Razón

- Audience inicial será muy pequeña (primeros 6 meses)
- Comentarios sin audience generan engagement fake o spam
- Complejidad adicional (moderación, privacy) sin beneficio claro
- Twitter/X y LinkedIn ya sirven como canales de discusión

### Cuando se re-evalúe

Implementar con **Giscus** porque:
- Comentarios almacenados en GitHub Discussions (backup natural)
- Requiere GitHub account (filtra spam)
- Gratis
- Privacy-friendly
- Themable al estilo del sitio

---

## ADR 009: Estructura `docs/` + AGENTS.md como source of truth

**Fecha:** 2026
**Estado:** Aceptado

### Contexto

Necesito decidir dónde viven los archivos de documentación del proyecto y cómo los agentes de IA descubren las convenciones.

### Opciones consideradas

**Para ubicación de docs:**
1. Todo en raíz (`README.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `CONTRIBUTING.md`)
2. Carpeta `docs/` con todo excepto README
3. Carpeta `docs/` con todo (incluyendo README)

**Para descubrimiento por agentes:**
1. Solo `CLAUDE.md` (específico Claude Code)
2. Solo `AGENTS.md` (estándar emergente agnóstico)
3. Ambos: `AGENTS.md` como source of truth + `CLAUDE.md` como wrapper

### Decisión

**Estructura:**
- `README.md` en raíz (convención de GitHub)
- `AGENTS.md` y `CLAUDE.md` en raíz (convención de descubrimiento)
- `ARCHITECTURE.md`, `DECISIONS.md`, `CONTRIBUTING.md` en `docs/`

**Source of truth para agentes:** `AGENTS.md`. `CLAUDE.md` solo redirige a `AGENTS.md` con notas específicas de Claude Code.

### Razón

**Por qué `docs/` para algunos archivos:**
- Reduce ruido en raíz del repo
- Convención común en proyectos open source
- Los archivos en `docs/` son referencia, no onboarding inmediato

**Por qué README en raíz:**
- GitHub lo renderiza automáticamente en la página del repo
- Es lo primero que ve cualquier visitante
- Convención universal

**Por qué AGENTS.md como source of truth:**
- Estándar emergente agnóstico (Cursor, Windsurf, Aider lo van adoptando)
- Si en el futuro cambio de Claude Code a otro agente, no tengo que reescribir docs
- Single source of truth evita drift entre archivos

**Por qué mantener CLAUDE.md también:**
- Claude Code lo lee automáticamente al iniciar sesión
- Pero solo redirige a AGENTS.md + notas específicas
- Sin duplicación de contenido

### Consecuencias

**Positivas:**
- Estructura limpia y portable
- Compatible con múltiples agentes de IA
- Documentación organizada por propósito
- Fácil de mantener

**Negativas:**
- Un archivo más en raíz (CLAUDE.md como wrapper)
- Mitigado: el archivo es muy corto y solo redirige

---

## Template para ADRs futuros

```markdown
## ADR NNN: [Título corto de la decisión]

**Fecha:** YYYY-MM-DD
**Estado:** [Propuesto | Aceptado | Rechazado | Deprecado | Reemplazado por ADR XXX]

### Contexto
Qué problema estamos resolviendo, qué circumstancias llevaron a esto.

### Opciones consideradas (opcional)
1. Opción A
2. Opción B
3. Opción C

### Decisión
Qué vamos a hacer.

### Razón
Por qué esta opción sobre las demás.

### Consecuencias
**Positivas:** ...
**Negativas:** ...
```
