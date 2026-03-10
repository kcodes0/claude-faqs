# Backend and Integrations FAQ

## Databases and App Architecture

### Should I use Firebase or look for alternatives?

Sources: https://docs.anthropic.com/en/docs/claude-code/tutorials https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts
Anthropic does not publish an official "Firebase vs X" buyer's guide. So this is one of those questions where Claude can help you reason about tradeoffs, but Anthropic is not going to make the architecture choice for you.

Use Firebase when you want fast setup, auth, hosting, and a managed realtime stack. Look elsewhere when you need stronger SQL ergonomics, stricter relational modeling, or more predictable infrastructure control. Claude Code can work with either, but your product constraints should make the call.

### What are the security concerns people raise about Firebase?

Sources: https://docs.anthropic.com/en/docs/claude-code/security
This is not an Anthropic-specific security topic, so the official Claude docs will not give you Firebase hardening rules. The relevant Anthropic lesson is narrower: if Claude has credentials or deployment access, the repo and permission model should make it hard to misuse them.

For Firebase specifically, the common risk is not "Firebase is insecure by design." It is misconfigured rules, over-broad client access, and shipping admin credentials into the wrong environment.

### How do I set up a database with Claude Code?

Sources: https://docs.anthropic.com/en/docs/claude-code/tutorials https://docs.anthropic.com/en/docs/claude-code/mcp
Claude Code does not have a single official database wizard. The productive path is to give Claude a clear schema or migration target, the relevant config files, and the commands your stack already uses.

If you want Claude to inspect or query a live database safely, MCP is the official pattern for connecting external tools. That gives you a cleaner integration story than telling Claude to invent shell commands against production.

### Can I build a full-stack app with Claude Code and Firebase?

Sources: https://docs.anthropic.com/en/docs/claude-code/overview https://docs.anthropic.com/en/docs/claude-code/tutorials
Yes. Nothing in Anthropic's docs suggests Claude Code is limited to backend-only or frontend-only work. It operates on the codebase and tooling you provide.

The real constraint is discipline. Full-stack projects work best when you keep the app structure clear, document the architecture in `CLAUDE.md`, and avoid asking Claude to redesign the entire stack every session.

### What's the cheapest database option for Claude Code projects?

Sources: https://docs.anthropic.com/en/docs/claude-code/tutorials
Anthropic does not publish database cost rankings because that is outside the product docs. The better question is what is cheapest for your workload and failure tolerance, not what is cheapest in a vacuum.

For small projects, hosted Postgres, SQLite plus a simple deploy target, or a lightweight serverless database often beats overcomplicated early infrastructure. Claude Code can support any of those if the repo setup is sane.

## Integration Questions

### What payment or identity tools work well with Claude?

Sources: https://docs.anthropic.com/en/api/messages https://docs.anthropic.com/en/docs/claude-code/mcp
Anthropic's API is transport-agnostic here. Claude does not require a specific billing stack or identity provider. The official docs focus on API calls, tool use, and MCP integration points, not on endorsing one payments vendor or auth provider.

So the right answer is the boring one: use the tools your product can operate well. Claude integrates through APIs and tools, not through a hidden preference for one SaaS vendor.

### Can I integrate Claude with Telegram?

Sources: https://docs.anthropic.com/en/api/messages https://docs.anthropic.com/en/docs/welcome
Yes. Anthropic's API is a standard developer API, so Telegram integration is just an application-layer build. Anthropic does not publish a special Telegram-only guide because none is required.

You need a Telegram bot on one side and a normal Claude API client on the other. Everything in between is your formatting, auth, and state-management logic.

### How do I share projects built with Claude Code?

Sources: https://docs.anthropic.com/en/docs/claude-code/github-actions https://docs.anthropic.com/en/docs/claude-code/tutorials
Anthropic's workflow docs point toward normal developer collaboration patterns: branches, pull requests, CI, and project instructions in `CLAUDE.md`. Claude does not change the fundamental sharing model.

If you want other people to build on top of your project, the highest-leverage thing you can do is ship a repo that explains itself. Good docs beat clever prompts every time.
