# Claude Code Workflows FAQ

## Getting Started and Structure

### What are the best workflows for Claude Code if I'm building locally on a remote Ubuntu box?

Sources: https://docs.anthropic.com/en/docs/claude-code/remote-control https://docs.anthropic.com/en/docs/claude-code/tutorials https://docs.anthropic.com/en/docs/claude-code/memory
The cleanest setup is to keep Claude Code close to the code and the shell tools it needs. For a remote Ubuntu box, that usually means SSH into the machine, run Claude Code there, and keep the repo, test commands, and build tools local to that environment instead of bouncing files back and forth.

Anthropic's remote-control and workflow docs push the same general principle: make the environment explicit, keep project instructions in `CLAUDE.md`, and use reproducible commands. In practice, that means one repo, one `CLAUDE.md`, and a short list of common commands Claude can rely on without guessing.

### What is the best way to structure projects in Claude Code?

Sources: https://docs.anthropic.com/en/docs/claude-code/tutorials https://docs.anthropic.com/en/docs/claude-code/memory
Anthropic's tutorials and memory docs point toward a simple structure: keep a project-level `CLAUDE.md` at the repo root, write down architecture constraints there, and let Claude learn the project from files instead of long repeated chat prompts.

The practical version is straightforward. Put project rules in `CLAUDE.md`, keep docs near the code they describe, and avoid hiding important instructions in one-off chats. Claude Code works best when the repo itself explains how it should be modified.

### How do I save workspace context between sessions?

Sources: https://docs.anthropic.com/en/docs/claude-code/memory https://docs.anthropic.com/en/docs/claude-code/slash-commands
Anthropic's official answer is memory files. Use `./CLAUDE.md` for shared project context and `~/.claude/CLAUDE.md` for your own cross-project preferences.

That is better than trying to keep a giant chat alive forever. Save decisions, coding standards, and common commands in memory files, then use `/memory` when you want to edit them during a session.

### Can I create session-type profiles for different use cases?

Sources: https://docs.anthropic.com/en/docs/claude-code/settings https://docs.anthropic.com/en/docs/claude-code/memory
There is no official "profile switcher" button described in the docs, but the settings and memory model already give you most of what people mean by profiles. You can keep shared project settings in `.claude/settings.json`, local-only preferences in `.claude/settings.local.json`, and separate user defaults in `~/.claude/CLAUDE.md`.

So the practical answer is yes, but you build it from settings files and memory layers rather than from a dedicated profile UI.

## Branching, Parallelism, and Agents

### What is the proper branching setup for Claude Code work?

Sources: https://docs.anthropic.com/en/docs/claude-code/tutorials
Anthropic's workflow docs consistently favor small, reviewable units of work. That usually means a normal feature branch per task, not one giant long-lived branch where Claude is trying to juggle unrelated changes.

If you want Claude to stay sharp, keep branches scoped. One feature, one fix, one doc pass. The more unrelated drift you pack into a branch, the more likely review and context quality both degrade.

### What's the best way to run parallel agents or parallel workstreams safely?

Sources: https://docs.anthropic.com/en/docs/claude-code/tutorials https://docs.anthropic.com/en/docs/claude-code/sub-agents
Anthropic's docs cover both worktrees and subagents for parallelism. The safe pattern is to separate independent work physically or logically: use Git worktrees for truly separate code changes, and subagents for specialized analysis inside a single task.

Do not run a pile of agents against the same mutable files and hope merge conflicts sort themselves out. Parallelism helps when tasks are independent. It becomes self-inflicted damage when everything edits the same surface area.

### What are the best practices for remote control and automation?

Sources: https://docs.anthropic.com/en/docs/claude-code/remote-control https://docs.anthropic.com/en/docs/claude-code/github-actions
The official docs show two strong paths: operate Claude Code directly on the machine that owns the repo, or automate through CI and the SDK. In both cases, the theme is the same: make the environment explicit, use versioned project instructions, and keep credentials in secrets rather than in prompts or scripts.

If you are automating, decide what Claude is allowed to do before you scale it. Good automation is mostly good guardrails.

### How do I effectively use subagents and MCPs with Claude Code?

Sources: https://docs.anthropic.com/en/docs/claude-code/sub-agents https://docs.anthropic.com/en/docs/claude-code/mcp
Subagents are best for specialized roles inside Claude Code: reviewer, debugger, migration helper, docs pass, and so on. MCP is the bridge to outside systems like tickets, docs, databases, and internal tooling.

The mistake to avoid is treating either of these as magic. Give each subagent a narrow job. For MCP, only connect tools that you genuinely want Claude to have access to. A smaller, well-understood tool surface is usually safer and more reliable.

### What MCPs are available?

Sources: https://docs.anthropic.com/en/docs/claude-code/mcp https://docs.anthropic.com/en/docs/claude-code/overview
Anthropic documents how Claude Code connects to MCP servers, but it does not maintain one single official catalog of every community server worth using. The official docs focus more on how to connect and authenticate than on ranking a marketplace.

So the accurate answer is: Anthropic officially supports MCP integration, but discovery of specific servers is still mostly a community and ecosystem question.

### Can Claude Code automatically accept permissions without prompting?

Sources: https://docs.anthropic.com/en/docs/claude-code/settings https://docs.anthropic.com/en/docs/claude-code/hooks https://docs.anthropic.com/en/docs/claude-code/security
Yes, but this is where you should slow down. Anthropic documents `permissions.allow`, `defaultMode`, and hook outputs that can bypass prompts in controlled ways. That means you can reduce repetitive confirmations for known-safe commands.

The tradeoff is obvious: every step you take toward auto-approval removes a safety checkpoint. The right compromise is to auto-allow boring, repeatable commands like lint or test runs and keep risky network, delete, or deployment actions behind explicit review.

### What permissions does Claude Code need?

Sources: https://docs.anthropic.com/en/docs/claude-code/security https://docs.anthropic.com/en/docs/claude-code/settings
Claude Code is designed around a permission system precisely because it can read files, run commands, and modify code. Anthropic's security docs describe read-only defaults and settings-based control over what can be allowed, denied, or escalated.

In practical terms, Claude needs only the permissions that match the job you want it to do. If it is auditing code, read access may be enough. If it is fixing tests, then file edits and selected shell commands make sense. Start narrow and expand only when necessary.

### How do I see what a subagent is doing and improve visibility?

Sources: https://docs.anthropic.com/en/docs/claude-code/sub-agents https://docs.anthropic.com/en/docs/claude-code/slash-commands
Anthropic's subagent docs focus on configuring specialized helpers and controlling tool access. If you want better visibility, the best path is to make the subagent's remit specific and ask for explicit progress or evidence, not just "go work on this."

In other words, better visibility comes from better task shape. Give the agent a bounded task, ask for outputs that can be verified, and avoid vague multi-hour delegation.

### How do I submit Claude Code feature requests or wishlist items?

Sources: https://docs.anthropic.com/en/docs/claude-code/slash-commands https://support.claude.com/en/articles/9015913-how-to-get-support https://github.com/anthropics/claude-code/issues/new/choose
Anthropic's docs point to `/bug` for reporting issues from Claude Code itself, and public GitHub issues are the obvious home for product feedback when Anthropic has opened that channel. For account-specific requests, use Support instead.

If you are writing a feature request, include the workflow that breaks today, not just the feature name. "Need persistent session profiles for support triage" is useful. "Please add profiles" is much less so.
