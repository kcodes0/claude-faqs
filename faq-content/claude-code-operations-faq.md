# Claude Code Operations FAQ

## Installation and Setup

### How do I install Claude Code on different operating systems?

Sources: https://docs.anthropic.com/en/docs/claude-code/overview https://docs.anthropic.com/en/docs/claude-code/getting-started
Anthropic's current quick start starts with Node.js 18 or newer and `npm install -g @anthropic-ai/claude-code`. On macOS and Linux, that is the normal path. On Windows, Anthropic's setup docs route you through WSL rather than a pure native install.

After install, run `claude doctor` or `/doctor` to verify the environment. That one step saves a lot of time because it catches path, login, and shell issues before you start blaming the model.

### What are the system requirements for Claude Code?

Sources: https://docs.anthropic.com/en/docs/claude-code/overview https://docs.anthropic.com/en/docs/claude-code/getting-started
The official baseline is simple: Node.js 18 or newer, plus either a Claude.ai account or Anthropic Console account depending on how you are logging in. Beyond that, the real requirement is a sane development shell with standard tooling available.

If you are on Windows, Anthropic's setup guidance currently assumes WSL for the main experience. If you are on Linux or macOS, the normal shell environment is the intended path.

### Why is Claude Code segfaulting on WSL?

Sources: https://docs.anthropic.com/en/docs/claude-code/troubleshooting https://docs.anthropic.com/en/docs/claude-code/getting-started
Anthropic's troubleshooting guide does not publish a single "segfault root cause" article, but it does document the most common WSL class of failures: Windows Node/npm leaking into WSL, OS detection problems, and filesystem or networking penalties when the project lives under `/mnt/c`.

So if you are seeing segfaults or instability on WSL, check the boring path first: `which node`, `which npm`, whether your project is on the Linux filesystem, and whether `nvm` is loaded in your shell. Those are the known failure zones Anthropic actually documents.

### What's the fix for the bun version issue or runtime crashes?

Sources: https://docs.anthropic.com/en/docs/claude-code/troubleshooting https://docs.anthropic.com/en/docs/claude-code/overview
Anthropic's current public install path is Node and npm, not bun. So if a specific bun build is crashing, the official answer is not "wait for a magic bun fix" but "use the supported install path and verify with doctor."

If you are chasing a version-specific runtime crash, narrow the variables. Switch to the documented Node/npm install, retest, and only then decide whether you are dealing with a Claude Code bug or a local runtime mismatch.

### How do I use my system's Node.js instead of a conflicting runtime?

Sources: https://docs.anthropic.com/en/docs/claude-code/troubleshooting https://docs.anthropic.com/en/docs/claude-code/getting-started
Anthropic's troubleshooting guide is explicit that WSL problems often come from the wrong `node` or `npm` being picked up. The fix is to make sure `which node` and `which npm` resolve to Linux paths, not Windows ones, and to load `nvm` correctly if you use it.

In other words, do not fight path ambiguity. Make the shell resolve to one clear runtime and keep Windows and WSL Node installations from trampling each other.

## Stability and Errors

### Why does Claude Code crash or hang on my system?

Sources: https://docs.anthropic.com/en/docs/claude-code/troubleshooting
Anthropic's troubleshooting page points to a few common causes: very large contexts, heavy resource usage, missing `ripgrep`, filesystem penalties on WSL, and stale auth state. That means "Claude Code crashed" is usually not actionable until you narrow it to install, auth, search, or system-resource behavior.

Use `claude doctor`, try a clean restart, and simplify the environment before assuming the problem is deep. Half the time the failure is local setup, not the agent itself.

### What should I do if I keep seeing the 1S8XB4M error?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support https://status.anthropic.com
Anthropic does not publish a public support article that maps the `1S8XB4M` code to one stable root cause. So the honest answer is that this is not a documented user-fixable code today.

Treat it like an opaque service or account error: check [status.anthropic.com](https://status.anthropic.com), retry in a fresh session, and then report the exact code to Support with timestamps and product context. That gives Anthropic something they can trace internally.

### What does "upstream connect error or disconnect/reset before headers" usually mean?

Sources: https://status.anthropic.com https://support.claude.com/en/articles/9015913-how-to-get-support
That message usually points to a service-edge or network-path failure rather than a normal prompt problem. Anthropic does not have a public help article that fully decodes every reverse-proxy error string, so the best official move is to check the status page and then report it if the issue persists.

If the error appears during a known incident window, do not waste time trying ten local fixes in a row. Wait for the platform to recover or route around the failing path.

### How do I check Claude.ai availability and system status?

Sources: https://status.anthropic.com
Anthropic's official status source is [status.anthropic.com](https://status.anthropic.com). Use that first when the product feels broken in a way that affects multiple users or multiple devices.

That sounds obvious, but it matters. A lot of wasted debugging time comes from treating an outage like a personal environment bug.

### How do I report a real Claude Code bug?

Sources: https://docs.anthropic.com/en/docs/claude-code/slash-commands https://support.claude.com/en/articles/9015913-how-to-get-support https://github.com/anthropics/claude-code/issues/new/choose
The official in-product path is `/bug`, which sends the conversation to Anthropic. For broader product issues or publicly reproducible problems, Anthropic's GitHub issue flow is also useful when available.

Good bug reports include the command you ran, the shell and OS, whether you were on macOS, Linux, WSL1, or WSL2, and whether `claude doctor` showed anything unusual. Anthropic's troubleshooting docs specifically ask for environment detail on Windows and WSL problems for exactly this reason.
