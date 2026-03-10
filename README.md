# Claude Community FAQ API

A community-maintained FAQ corpus for Claude, Claude Code, and Anthropic account issues, served through a Cloudflare Worker API so Discord bots, Reddit bots, dashboards, and internal tools can pull answers programmatically.

## What this repo contains

- `faq-content/`: the markdown source of truth for FAQ answers
- `scripts/build-faq-index.ts`: converts markdown into `faq-index.json`
- `src/`: the Cloudflare Worker API, parser, search logic, and types
- `docs/API.md`: API reference with request and response examples
- `WALL_OF_FAME.md`: contributor recognition

## FAQ categories

- [Account Issues](faq-content/account-issues-faqs.md)
- [Billing and Plans](faq-content/billing-faq.md)
- [Claude Code Workflows](faq-content/claude-code-faq.md)
- [Claude Code Operations](faq-content/claude-code-operations-faq.md)
- [Context, Caching, Streaming, and Batch](faq-content/context-caching-streaming-and-batch-faq.md)
- [Backend and Integrations](faq-content/backend-and-integrations-faq.md)
- [Models, Safety, and Updates](faq-content/models-safety-and-updates-faq.md)
- [Support and Access](faq-content/support-and-access-faq.md)
- [Claude Usage](faq-content/claude-usage.md)
- [General Questions](faq-content/general-faq.md)

## Contributing a FAQ update

1. Fork the repo.
2. Create a branch.
3. Add or edit markdown files inside `faq-content/`.
4. Run the local checks.
5. Open a pull request.

Contributor workflow:

```bash
bun install
bun run check:faq
bun run build:faq
bun run typecheck
```

Optional local API preview:

```bash
bun run dev
```

## FAQ file format

Each file is auto-discovered from `faq-content/`. You do not need to register new files anywhere.

Use this structure:

```md
# Category Name

## Subcategory Name

### The question users actually ask

Answered by: YourName
Sources: https://docs.anthropic.com/... https://support.claude.com/...
Last verified: auto
Your answer here.
```

Notes:

- `Answered by:` is optional.
- `Sources:` is strongly recommended.
- `Last verified:` is optional. If omitted or set to `auto`, the build script stamps the current date in Anthropic HQ timezone (`America/Los_Angeles`).
- `general-faq.md` may use `## Question` headings directly.

## Suggesting new FAQs without a PR

If you are not changing code directly, open a GitHub issue with the suggested question, where you saw it come up, and any official Anthropic source that helps answer it.

## API usage

See [docs/API.md](docs/API.md) for endpoints, auth, response formats, and Discord bot examples.

## Recognition

Contributors and maintainers are recognized in [WALL_OF_FAME.md](WALL_OF_FAME.md).

---
*This project is an independent community effort is not affiliated with Anthropic or Claude in any way.*
