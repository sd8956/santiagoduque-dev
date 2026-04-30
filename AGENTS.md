# AGENTS.md

Convenciones para cualquier agente de IA (Claude Code, Cursor, Windsurf, Aider, Copilot, etc.) trabajando en este repositorio.

Este archivo es **single source of truth** para reglas y workflow. Otros archivos específicos de agente (`CLAUDE.md`, `.cursorrules`, etc.) deben referirse a este.

---

## Lectura obligatoria al iniciar sesión

Antes de hacer cualquier cambio, lee estos archivos en orden:

1. **[README.md](./README.md)** — overview del proyecto y stack
2. **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — decisiones técnicas y estructura
3. **[docs/DECISIONS.md](./docs/DECISIONS.md)** — ADRs con el "por qué" de cada decisión
4. **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)** — flujo de trabajo y convenciones

Confirma comprensión al humano antes de proceder con cualquier tarea.

---

## Reglas operativas críticas

### Antes de escribir código

1. **Propón un plan primero.** No empieces a escribir código sin que el humano apruebe la dirección.
2. **Divide en tareas pequeñas.** Cada commit debe ser revisable individualmente.
3. **Pregunta antes de instalar dependencias nuevas.** Las dependencias son decisiones arquitectónicas.

### Mientras escribes código

1. **TypeScript strict.** No `any` sin comentario justificando. No `@ts-ignore` sin comentario.
2. **Tailwind first.** No CSS custom cuando un utility class de Tailwind sirve.
3. **Astro components** para todo estático. React/Vue solo si la interactividad lo requiere.
4. **Props tipadas** en todos los componentes.
5. **Conventional commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`).

### Cuando termines una tarea

1. **Commit con mensaje convencional**, no genérico.
2. **Resumen breve** de qué hiciste y por qué.
3. **Espera confirmación** del humano antes de la siguiente tarea.

---

## Lo que NO debes hacer

### Decisiones arquitectónicas sin aprobar

Si vas a hacer alguna de estas, **PARA y pregunta al humano primero**:

- Instalar una librería que no está mencionada en el plan
- Cambiar la estructura de carpetas documentada
- Modificar configuración fundamental (Astro config, Tailwind config, tsconfig)
- Deprecar o reemplazar una decisión documentada en `DECISIONS.md`
- Crear archivos fuera de las carpetas convencionales

### Código sin documentar el "por qué"

- No agregues lógica compleja sin un comentario explicando la intención
- No copies snippets de internet sin entender qué hacen
- No uses patterns "porque están de moda" sin justificar

### Cambios masivos en un solo commit

- Preferible: 5 commits de 50 líneas cada uno
- A evitar: 1 commit de 500 líneas

### Asumir contexto que no tienes

Si algo no está claro:
- ¿No sabes si esa decisión está documentada? → busca en `docs/DECISIONS.md`
- ¿No sabes si ya existe un componente similar? → busca en `src/components/`
- ¿No sabes qué espera el humano? → pregunta antes de adivinar

---

## Workflow al cambiar arquitectura

Si una tarea requiere cambio arquitectónico (nueva librería, nuevo patrón, cambio de stack):

1. **Para antes de implementar.**
2. **Propón explícitamente:**
   - Qué cambia
   - Por qué es necesario
   - Alternativas consideradas
   - Tradeoffs
3. **Espera aprobación del humano.**
4. **Si se aprueba:** crea entrada en `docs/DECISIONS.md` siguiendo el formato ADR.
5. **Después implementa.**

Cualquier ADR nuevo debe seguir el template al final de `docs/DECISIONS.md`.

---

## Estructura de archivos

```
santiagoduque-dev/
├── README.md                    # Overview público (raíz para GitHub)
├── AGENTS.md                    # Este archivo (raíz para descubrimiento)
├── CLAUDE.md                    # Específico de Claude Code (apunta aquí)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   └── CONTRIBUTING.md
├── public/                      # Assets estáticos
├── src/
│   ├── content/                 # Posts y proyectos
│   ├── components/              # Astro components
│   ├── layouts/
│   ├── pages/
│   ├── i18n/
│   ├── styles/
│   ├── utils/
│   └── data/
└── scripts/                     # Scripts de utilidad (new-post, etc.)
```

---

## Crear contenido nuevo (posts, proyectos)

### Posts del blog

- Ubicación: `src/content/blog/{es|en}/[slug].md` o `.mdx`
- Frontmatter obligatorio según schema en `src/content/config.ts`
- Ver `docs/CONTRIBUTING.md` sección "Crear nuevo post" para detalles

### Proyectos del portfolio

- Ubicación: `src/content/projects/[slug].md`
- Frontmatter según schema
- Ver `docs/CONTRIBUTING.md` sección "Crear nuevo proyecto"

---

## i18n (multilenguaje)

- Sitio en español e inglés con rutas prefijadas (`/es/...`, `/en/...`)
- Cada post declara su idioma en frontmatter
- UI strings en `src/i18n/translations.ts`
- **No traduces todos los posts.** Cada post es en UN solo idioma.

Ver ADR 003 y ADR 004 en `docs/DECISIONS.md` para razonamiento.

---

## Stack técnico (resumen)

| Capa | Tecnología |
|---|---|
| Framework | Astro 4.x |
| Lenguaje | TypeScript (strict) |
| Estilos | TailwindCSS |
| Contenido | MDX + Content Collections |
| Package manager | pnpm |
| Hosting | Cloudflare Pages |

Detalles completos en `docs/ARCHITECTURE.md`.

---

## Comandos del proyecto

```bash
pnpm install         # Instalar dependencias
pnpm dev             # Desarrollo local (puerto 4321)
pnpm build           # Build producción
pnpm preview         # Preview del build
pnpm typecheck       # Verificar tipos
pnpm lint            # Linting
pnpm format          # Format con Prettier
pnpm new-post        # Crear post nuevo (CLI helper)
```

---

## Cuando algo no está claro

Orden de consulta:

1. **`docs/ARCHITECTURE.md`** para "cómo se hace X en este proyecto"
2. **`docs/DECISIONS.md`** para "por qué se hace X de esta forma"
3. **`docs/CONTRIBUTING.md`** para flujos de trabajo
4. **El humano** para todo lo demás

Es preferible preguntar que asumir.

---

## Última actualización de este archivo

Cada vez que se cambien convenciones para agentes, actualizar este archivo. Si las convenciones cambian sustancialmente, considerar nuevo ADR documentando el cambio.
