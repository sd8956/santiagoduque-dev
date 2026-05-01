---
title: 'How I built this blog with AI'
description: "Honest build log: I directed an AI agent to build this site. What worked, where the AI failed, and why this doesn't replace knowing how to code."
pubDate: 2026-05-01
language: 'en'
tags: ['ai', 'workflow', 'astro', 'claude-code']
featured: true
draft: false
translatedTo: 'como-construi-este-blog-con-ia'
---

This blog is built end-to-end with help from an AI agent. Writing this now because I think the honest version of the experience — what worked, what didn't, why — is more useful than another generic post in the noise around "AI is going to replace developers."

Spoiler: it isn't. But the way I work has genuinely changed, and that change deserves a careful walkthrough.

## The experiment

The premise was simple: build a static bilingual site (Astro 6, Tailwind v4, deploy on Cloudflare Workers) using Claude Code as a coding partner. I'd set the architecture and the decisions, the AI would write code and tests, and I'd review every diff and every PR.

Two rules from day one:

1. **I direct, the AI executes.** Never the reverse.
2. **I review everything.** Every change. No exceptions.

That sounds obvious. If you actually enforce it, the workflow feels different.

## What worked very well

There are tasks where an agent with project memory and tooling access is meaningfully better than typing them yourself:

**Mechanical refactors.** Moving functions between files, splitting a monolithic script into helpers + entry point, writing 20 tests for a freshly extracted module. Correct work that bores you. The AI doesn't get bored and makes fewer typos.

**Investigating APIs and reporting back.** "How do I scope the Pagefind index to a section of the site?" — the AI read the docs, found `data-pagefind-body`, applied it to the right `<article>`, and added `data-pagefind-ignore` to the search trigger so it didn't pollute the index. Faster than I would've found it.

**Tooling and configuration.** The AI wrote the final `wrangler.jsonc`, configured GitHub branch protection via `gh api` with the right flags (`enforce_admins: true`, `delete_branch_on_merge: true`), and laid out the CI workflow with steps in the right order. Once you tell it what you want, it does it correctly.

**Tests.** Covering pure helpers with edge cases is repetitive work and the AI is good at it. I asked: "cover `slugify` with cases for accents, leading/trailing spaces, and strings with no alphanumerics". It returned 5 sensible tests. Multiplied across the project: 66 tests by the end of the first cycle.

## Where the AI failed

More interesting than what worked.

**Bugs that typecheck but break at runtime.** When we added pagination to the blog, the AI wrote this:

```ts
const PAGE_SIZE = 10;

export const getStaticPaths = (async ({ paginate }) => {
  const posts = await getCollection('blog' /* ... */);
  return paginate(posts, { pageSize: PAGE_SIZE });
}) satisfies GetStaticPaths;
```

Typecheck passes. Lint passes. Format passes. But the Astro build fails with `PAGE_SIZE is not defined`. Why? Because Astro extracts `getStaticPaths` to an isolated module during prerender — top-level frontmatter consts aren't in scope inside it. Only imports get hoisted.

The AI didn't know about that restriction. It learned it when CI blew up. The lesson is now in its persistent memory so it doesn't reintroduce it. That kind of restriction is one you only catch with deep framework context.

**Subtle diagnostics need production knowledge.** After deploy, search wasn't working in production: it showed "unavailable in dev" on `https://santiagoduque.dev`. The AI couldn't diagnose that from code alone. I tried `curl -I https://santiagoduque.dev/pagefind/pagefind.js`, saw the 404, and deduced the problem was deploy-side, not app-side. From there we tracked it to a missing `wrangler.jsonc` with explicit `assets.directory`.

Without knowing what to test and how, the AI would've kept circling.

**Distinguishing code bug from content bug.** The language switcher wasn't routing to the right translated post. The AI's instinct: "let me check the switcher logic". When I pointed it at `git log`, it found the code was already correct — the problem was that the post `.md` files didn't declare `translatedTo`. The "bug" wasn't in code; it was in metadata.

**No taste without explicit asks.** Left to its own devices, the agent gives you something reasonable but generic — pagination with 1, 2, 3 visible page numbers; a TOC with scroll-spy and sticky sidebar; a footer with centered social links. You have to ask for exactly what you want. "Inline TOC at the top, indented for h3, hidden if there are fewer than 2 sections" — without that, it returns whatever's most common online.

## Repo docs as shared context

Before writing a single line of code, the first thing I built were the docs. Not for completeness — because they're what the AI reads at the start of every session, and what saves me from re-explaining the same things later.

Three pieces carry the weight:

**`AGENTS.md` (repo root).** Vendor-neutral convention: any agent that respects the standard (Cursor, Claude Code, Aider, Windsurf) reads it automatically. This is where I put what I never want to repeat: my Spanish dialect (Rioplatense), conventional commits, "never run build after changes" (my rule, to avoid wasting minutes for nothing), PR creation rules, what to do when the AI hits ambiguity. The AI starts every session with all of it already loaded.

**`CLAUDE.md` (repo root).** Exists ONLY because Claude Code has that automatic discovery convention. It's a short pointer to `AGENTS.md` plus three or four notes specific to Claude Code (tool usage, response format). If I switch agents tomorrow, I don't touch the source of truth — it stays in `AGENTS.md`.

**`docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/CONTRIBUTING.md`.** The stack, the ADRs (Architecture Decision Records), and the workflow. When the AI wanted to "improve" something that was actually a deliberate decision, the ADRs stopped it. "Why Astro and not Next.js?" — ADR 001 already has the answer with explicit tradeoffs. Without this, the AI repeats the conversation every time and ends up proposing whatever is most popular right now.

The insight I take from this: **writing for agents is writing for any new collaborator.** Everything I put in these files also helps a human joining the project, or my future self six months from now. The cost of maintaining them gets paid back many times over.

## Persistent memory changes the rules

The biggest difference between using AI with memory and without memory is the cost of starting a new conversation.

Without memory: every session begins from zero. You re-explain the stack, the conventions, the constraints. The AI repeats the same mistakes.

With persistent memory (I use Engram, integrated with Claude Code): every decision, gotcha, convention, and bug fix is automatically saved. The next session starts with all of it loaded.

Concrete examples from this project:

- "`translatedTo` is REQUIRED in frontmatter to pair posts across languages."
- "Astro `getStaticPaths` runs in isolation — top-level frontmatter consts are NOT in scope."
- "Pagefind output (`/pagefind/pagefind.js`) is a postbuild artifact — it doesn't exist during `astro dev`."

The AI starts each session with those warnings already loaded. I don't fight the same bugs twice.

## On directing agents

Three things I learned:

1. **Ask for specific things with clear criteria.** "Add pagination" is vague. "Add pagination with 10 posts per page, page 1 at `/blog/`, pages 2+ at `/blog/N/`, hreflang cross-language paired by page number, hidden when there's only one page" is a brief the AI can execute well.

2. **Read the diff, not the summary.** Agent summaries describe what the AI _intended_ to do, not necessarily what it did. Reading the diff is non-negotiable.

3. **Use branch protection against yourself AND the AI.** I have `enforce_admins: true` on master. That blocks me AND it. Every change goes through a PR with green CI. It's a safety net worth the friction.

## This does NOT replace knowing how to code

I don't catch the `PAGE_SIZE` bug if I don't understand how Astro prerenders pages. I don't diagnose the deploy issue if I don't know what `wrangler deploy` does or how Cloudflare Workers Static Assets serves files. I don't separate code bug from content bug if I don't have the instinct for it.

AI is a multiplier. If your foundation is solid, it makes you faster. If it isn't, it makes you faster at writing code that _looks_ fine but is broken — and you'll deploy that code to production.

The most useful advice I can give: **invest in fundamentals first.** Then use AI to accelerate what you already understand. The other order doesn't work.

## Closing

I built this blog with AI assistance because I wanted to see how the workflow felt on a real, end-to-end project with real production. Conclusion: worth it for mechanical work and research, doesn't replace technical judgment, and persistent memory is what separates "fun assistant" from "usable tool."

If you want to discuss any of these decisions — or tell me where you got it wrong using agents yourself — reach out. Every handle is on the [contact](/en/contact/) page.
