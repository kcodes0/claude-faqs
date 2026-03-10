# Contributing

This project is designed so community members can improve the FAQ without needing to understand the full Worker codebase.

## What makes a good contribution

Good FAQ contributions usually do one of these well:

- add a question that really comes up in Discord, Reddit, or support discussions
- replace a shallow answer with something more concrete and current
- add official Anthropic sources to an answer that currently relies on community memory
- update stale pricing, plan, or product details
- split an overloaded topic into clearer files or subcategories

## Before you open a PR

1. Check whether the question already exists in `faq-content/`.
2. Prefer official Anthropic sources when the answer is time-sensitive.
3. Keep the question phrased the way users actually ask it.
4. Write the answer for a tired human who wants the next correct step, not a wall of filler.

## Local contribution flow

```bash
bun install
bun run check:faq
bun run build:faq
bun run typecheck
```

If you want to preview the Worker locally:

```bash
bun run dev
```

## Markdown conventions

Use normal markdown headings:

- `#` for the file/category title
- `##` for subcategories
- `###` for questions

Optional metadata lines at the top of an answer:

```md
Answered by: YourName
Sources: https://docs.anthropic.com/... https://support.claude.com/...
Last verified: auto
```

Guidelines:

- keep answers practical and direct
- say when Anthropic does not document something publicly
- do not invent precise support SLAs, pricing, or feature promises
- link official docs for unstable facts like pricing, plans, and release timing
- avoid duplicate questions unless the wording or user intent is genuinely different

## Pull request checklist

- the answer is actually useful, not just technically true
- the source links are official where the topic is time-sensitive
- `bun run check:faq` passes
- `bun run build:faq` was run so `faq-index.json` is current
- response wording is clear enough to reuse in bots or embeds

## Non-code contributions

If you are not comfortable opening a PR, use the FAQ suggestion issue template instead. A maintainer can turn that into a content update.
