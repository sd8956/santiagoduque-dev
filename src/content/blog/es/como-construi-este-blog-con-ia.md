---
title: 'Cómo construí este blog con IA'
description: 'Build log honesto: dirigí un agente de IA para construir este sitio. Qué funcionó, dónde la IA falló, y por qué esto no reemplaza saber programar.'
pubDate: 2026-05-01
language: 'es'
tags: ['ai', 'workflow', 'astro', 'claude-code']
featured: true
draft: false
translatedTo: 'how-i-built-this-blog-with-ai'
---

Este blog está construido entero con asistencia de un agente de IA. Lo escribo ahora porque me parece más útil contar la experiencia real — qué funcionó, qué no, y por qué — que sumar otro post genérico al ruido alrededor de "la IA va a reemplazar developers".

Spoiler: no la reemplaza. Pero el cambio en cómo trabajo es real, y vale la pena explicarlo con detalle.

## El experimento

La premisa era simple: armar un sitio estático bilingüe (Astro 6, Tailwind v4, deploy en Cloudflare Workers) usando Claude Code como copiloto. Yo defino la arquitectura y las decisiones, la IA escribe el código y los tests, yo reviso cada diff y cada PR.

Llegué con dos reglas claras desde el día uno:

1. **Yo dirijo, la IA ejecuta.** Nunca al revés.
2. **Reviso TODO.** Cada cambio. Sin excepciones.

Eso suena obvio. Si lo cumplís de verdad, cambia mucho cómo se siente el flujo.

## Lo que funcionó muy bien

Hay tareas en las que un agente con memoria del proyecto y acceso a tooling es notablemente mejor que escribirlas a mano:

**Refactors mecánicos.** Mover funciones entre archivos, dividir un script monolítico en helpers + entry point, escribir 20 tests para un módulo recién extraído. Trabajo correcto que te aburre. La IA no se aburre y comete menos typos.

**Investigar APIs y devolver síntesis.** "¿Cómo limito el alcance del index de Pagefind a una sección del sitio?" — la IA leyó la doc, encontró `data-pagefind-body`, lo aplicó al `<article>` correcto y agregó `data-pagefind-ignore` al botón de búsqueda para que no contaminara el index. Hubiera tardado más buscando yo.

**Tooling y configuración.** La IA escribió la `wrangler.jsonc` final, configuró branch protection en GitHub vía `gh api` con los flags correctos (`enforce_admins: true`, `delete_branch_on_merge: true`), y armó el workflow de CI con los pasos en el orden adecuado. Una vez que le explicás qué querés, lo hace bien.

**Tests.** Cubrir helpers puros con casos de borde es repetitivo y la IA es buena en eso. Le pedí "cubrí `slugify` con casos de acentos, espacios al borde, y strings sin alfanumérico". Devolvió 5 tests sensatos. Eso multiplicado por todo el proyecto: 66 tests al cierre del primer ciclo.

## Dónde la IA falló

Más interesante que lo que funcionó.

**Bugs que typechean pero rompen en runtime.** Cuando agregamos paginación al blog, la IA escribió esto:

```ts
const PAGE_SIZE = 10;

export const getStaticPaths = (async ({ paginate }) => {
  const posts = await getCollection('blog' /* ... */);
  return paginate(posts, { pageSize: PAGE_SIZE });
}) satisfies GetStaticPaths;
```

Typecheck pasa. Lint pasa. Format pasa. Pero el build de Astro rompe con `PAGE_SIZE is not defined`. ¿Por qué? Porque Astro extrae `getStaticPaths` a un módulo aislado al pre-renderizar — las constantes top-level del frontmatter NO están en scope adentro. Solo los imports se hoistean.

La IA no conocía esa restricción. La aprendió cuando CI explotó. Quedó guardada en su memoria persistente para que no la repita. Es una restricción que solo notás cuando tenés contexto profundo del framework.

**Diagnósticos sutiles requieren conocer producción.** Después de deployar, la búsqueda en producción no funcionaba: aparecía "no disponible en dev" en `https://santiagoduque.dev`. La IA no podía diagnosticarlo desde el código. Yo probé con `curl -I https://santiagoduque.dev/pagefind/pagefind.js`, vi el 404, deduje que el problema era el deploy y no la app. De ahí salimos a buscar la falta del `wrangler.jsonc` con `assets.directory` explícito.

Sin saber qué probar y cómo, la IA hubiera quedado dando vueltas.

**Distinguir bug de código vs. bug de contenido.** El switcher de idioma no llevaba a la traducción correcta del post. Reflejo inicial de la IA: "voy a revisar la lógica del switcher". Cuando la dirigí a `git log`, encontró que el código ya estaba bien — el problema era que los `.md` de los posts no declaraban `translatedTo`. El "bug" no estaba en código sino en metadata.

**No tiene buen gusto sin que se lo pidas.** Si dejás suelto al agente, te devuelve algo razonable pero genérico — paginación con números 1, 2, 3 visibles, un TOC con scroll-spy y sticky sidebar, un footer con enlaces sociales centralizados. Hay que pedirle exactamente lo que querés. "TOC inline al tope, indentado para h3, oculto si hay menos de 2 secciones" — sin eso, te trae lo más visto en internet.

## Los docs del repo como contexto compartido

Antes de escribir cualquier línea de código, lo primero que armé fueron los docs. No por completitud — porque eso es lo que la IA va a leer al arrancar cada sesión, y lo que me ahorra después en re-explicaciones.

Tres piezas cargan el peso:

**`AGENTS.md` (raíz del repo).** Convención vendor-neutral: cualquier agente que respete el estándar (Cursor, Claude Code, Aider, Windsurf) lo lee automáticamente. Ahí pongo lo que NO quiero repetir nunca: idioma del usuario (rioplatense), conventional commits, "nunca correr build después de cambios" (regla mía para no perder minutos por gusto), reglas para crear PRs, qué hacer si la IA encuentra una ambigüedad. La IA arranca con todo eso ya cargado.

**`CLAUDE.md` (raíz del repo).** Existe SOLO porque Claude Code tiene esa convención de discovery automática. Es un puntero corto a `AGENTS.md` con tres o cuatro notas específicas a Claude Code (uso de tools, formato de respuesta). Si mañana cambio de agente, no toco la fuente de verdad — sigue estando en `AGENTS.md`.

**`docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/CONTRIBUTING.md`.** El stack, los ADRs (Architecture Decision Records), y el workflow. Cuando la IA quería "mejorar" algo que en realidad era una decisión deliberada, los ADRs la frenaban. "¿Por qué Astro y no Next.js?" — ADR 001 ya tiene la respuesta con tradeoffs explícitos. Sin esto, la IA repite la conversación cada vez y termina proponiendo lo más popular del momento.

El insight que me llevo: **escribir para agentes es escribir para cualquier nuevo colaborador.** Todo lo que pongo en estos archivos también le sirve a alguien humano que entra al proyecto, o a mi yo de dentro de seis meses. El costo de mantenerlos se paga muchas veces.

## La memoria persistente cambia las reglas

La diferencia más grande entre usar IA con memoria y sin memoria es el costo de cada nueva conversación.

Sin memoria: cada sesión arranca desde cero. Tenés que re-explicar el stack, las convenciones, las restricciones. La IA te repite los mismos errores.

Con memoria persistente (uso un sistema llamado Engram, integrado a Claude Code): cada decisión, gotcha, convención, y bug fix se guarda automáticamente. La próxima sesión arranca con todo eso disponible.

Ejemplos concretos del proyecto:

- "`translatedTo` es REQUERIDO en frontmatter para parear posts entre idiomas."
- "Astro `getStaticPaths` corre aislado — top-level frontmatter consts NO están en scope."
- "Pagefind output (`/pagefind/pagefind.js`) es un postbuild artifact — no existe en `astro dev`."

La IA arranca cada sesión con esos warnings cargados. No vuelvo a pelear con los mismos bugs.

## Sobre dirigir agentes

Tres cosas que aprendí:

1. **Pedir cosas específicas con criterio claro.** "Agregá paginación" es vago. "Agregá paginación con 10 posts por página, page 1 en `/blog/`, pages 2+ en `/blog/N/`, hreflang cross-language por número de página, oculto si solo hay una página" es un brief que la IA puede ejecutar bien.

2. **Revisar el diff, no el summary.** Los summaries del agente cuentan lo que la IA INTENTÓ hacer, no necesariamente lo que hizo. Leer el diff es no negociable.

3. **Usar branch protection contra vos mismo Y contra la IA.** Tengo `enforce_admins: true` en master. Eso me bloquea a mí Y a la IA de empujar directo. Cualquier cambio pasa por PR con CI verde. Es un safety net que vale el inconveniente.

## Esto NO reemplaza saber programar

El bug de `PAGE_SIZE` no lo agarro si no entiendo cómo Astro pre-renderiza páginas. El problema del deploy no lo diagnostico si no sé qué hace `wrangler deploy` ni cómo Cloudflare Workers Static Assets sirve archivos. El error de `translatedTo` no lo encuentro si no sé separar bug de código de bug de contenido.

La IA es un multiplicador. Si tu base es sólida, te hace más rápido. Si no, te hace más rápido escribiendo código que parece bien pero está mal — y vas a deployar ese código a producción.

El consejo más útil que puedo dar: **invertí en fundamentos primero.** Después usá IA para acelerar lo que ya entendés. Al revés no funciona.

## Cierre

Construí este blog con asistencia de IA porque quería ver cómo se sentía el flujo en un proyecto real, end-to-end, con producción real. Conclusión: vale la pena para el trabajo mecánico y la investigación, no reemplaza el criterio técnico, y la memoria persistente es lo que hace la diferencia entre "asistente lindo" y "herramienta usable".

Si querés discutir cualquiera de estas decisiones — o contarme dónde te equivocaste vos usando agentes — escribime. Todos los handles están en [contacto](/es/contact/).
