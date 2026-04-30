# CLAUDE.md

Este archivo es leído automáticamente por Claude Code al iniciar una sesión en este repositorio.

## Convenciones generales

**El source of truth para todas las convenciones es [AGENTS.md](./AGENTS.md).** Este archivo (CLAUDE.md) existe únicamente porque Claude Code tiene esta convención de descubrimiento; pero las reglas operativas están en `AGENTS.md` para mantener compatibilidad con otros agentes (Cursor, Windsurf, Aider, etc.).

**Lee primero [AGENTS.md](./AGENTS.md) y los documentos referenciados ahí antes de hacer cualquier cambio.**

---

## Específico de Claude Code

Las siguientes reglas son adicionales al contenido de `AGENTS.md` y aplican específicamente cuando trabajamos con Claude Code:

### Sobre el uso de tools

- **Prefiere `view` sobre asunciones** sobre el contenido de archivos. Cuando vas a editar algo, lee primero.
- **Usa `bash_tool` con descripciones claras** que expliquen qué intenta hacer cada comando.
- **Usa `str_replace` para cambios pequeños y específicos.** Para cambios grandes, considera reescribir el archivo completo.

### Sobre el flujo de conversación

- **Resume cambios significativos** al final de cada bloque de trabajo.
- **No silencies errores.** Si algo falla, repórtalo claramente al humano.
- **Pregunta cuando hay ambigüedad** en vez de hacer asunciones.

### Sobre estructura de respuestas

- **Concisión:** evita preámbulos excesivos. Si la tarea es clara, ejecuta y reporta.
- **Markdown:** usa formato cuando ayuda a la legibilidad, pero no abuses de headers para respuestas cortas.
- **Código:** siempre con sintaxis highlighting apropiado (` ```typescript`, ` ```bash`, etc.).

### Cuando crees PRs

Claude Code puede crear pull requests. Cuando lo haga:

- **Título:** conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Descripción:** explica el "por qué" además del "qué"
- **Mantén PRs pequeños:** preferiblemente <300 líneas
- **No hagas force push** sin confirmar con el humano

---

## Recordatorio sobre AGENTS.md

Si esta es tu primera vez en este repositorio, **detente aquí y lee `AGENTS.md` completo antes de continuar**. Sin ese contexto, las reglas que vas a seguir van a ser inconsistentes con las convenciones del proyecto.
