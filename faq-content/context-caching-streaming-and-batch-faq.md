# Context, Caching, Streaming, and Batch FAQ

## Context Windows and Tokens

### What is Claude's context window limit?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/context-windows https://docs.anthropic.com/en/docs/models-overview
For most modern Claude API usage, the standard context window discussed in Anthropic's docs is 200K tokens. That is the working baseline people usually mean when they ask about the context window.

The main thing to remember is that the window covers the full conversation state for the current turn, not just your latest message. Previous turns, files, tool blocks, and the upcoming output all compete for the same budget.

### How does the 1M token context window work?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/context-windows https://docs.anthropic.com/en/release-notes/api
Anthropic's docs say the 1M token window is currently a beta feature for Claude Sonnet 4, available to organizations in usage tier 4 or with custom limits. You enable it with the published beta header.

That means two things matter before you plan around it: your org tier must qualify, and long-context pricing changes once requests go beyond the standard 200K threshold. It is powerful, but it is not just "the normal model with five times more room for free."

### Why am I hitting token limits so quickly?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/context-windows https://docs.anthropic.com/en/docs/build-with-claude/token-counting
Usually because you are paying for the entire rolling conversation, not just the current prompt. Long chat history, large files, tool traces, and verbose outputs all count.

Anthropic's token-counting API exists for exactly this reason. If you need predictability, estimate first instead of guessing after the limit trips.

### How do I optimize context usage for long-running tasks?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/context-windows https://docs.anthropic.com/en/docs/build-with-claude/token-counting
The reliable pattern is to reduce repeated baggage. Keep prompts focused, summarize old state into compact notes, and avoid sending the same huge instructions on every turn when a memory file or cached prefix would do.

For developer workflows, this usually means: move stable instructions into a reusable system prompt or memory file, keep only the active diff in chat, and count tokens before expensive turns.

### What is context compaction?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/context-windows
Anthropic describes chat-style context as rolling forward over time, and in product conversations that often feels like compaction or older context becoming less useful. The exact implementation differs by product, but the practical effect is the same: long conversations degrade precision if you keep stuffing more into them.

If something must survive, write it down in a file or system instruction. Do not assume a huge chat transcript is the best place to preserve critical state.

## Prompt Caching

### What is prompt caching and how do I use it?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
Prompt caching lets you mark reusable prompt prefixes so Anthropic can avoid recomputing identical context on later requests. It is best for big static blocks like long instructions, policy docs, or large shared reference content.

The official docs walk through cache breakpoints and explain how Anthropic now reads from the longest cached prefix automatically. In practice, caching is worth it when your requests share a lot of stable context across calls.

### How does prompt caching reduce token usage?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching https://docs.anthropic.com/en/release-notes/api
Caching does not make tokens disappear. It changes how repeated prefixes are priced and processed. If you keep resending the same long prompt prefix, Anthropic can reuse that cached work rather than charging you as if every request were brand new.

The win is biggest when your prompt has a large stable prefix and a small changing tail.

### Why is my cache usage so high?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
Usually because your application is writing or refreshing caches for large prefixes more often than you expected. The docs make clear that cache design matters. If your supposedly shared prefix keeps changing, cache efficiency collapses.

So high cache usage is often a prompt-design problem, not a mysterious billing problem. Find the moving parts and stop putting them inside the cached prefix.

### What is the cache drive feature?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
Anthropic's public prompt-caching docs do not describe a feature literally named "cache drive." If you heard that term in community conversation, it is not a documented first-class product concept in the current official docs.

The official concepts to anchor on are cache breakpoints, cache reads, cache writes, and cache TTL.

## Streaming

### How do I use streaming mode with Claude?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/streaming https://docs.anthropic.com/en/api/messages
Anthropic's official streaming mode uses server-sent events. In the Messages API, you set `stream: true` and then process the incremental SSE events as they arrive.

This is the right choice when you want responsive UI updates, partial output rendering, or low-latency bot replies. It is not just a cosmetic feature. It changes how your client should parse and render output.

### Can I get real-time responses from Claude?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/streaming
Yes. Anthropic's streaming docs are the official path for real-time token-by-token or chunk-by-chunk output. If your client supports SSE cleanly, Claude can feel much more responsive than waiting for one final blob.

The implementation detail that matters is buffering. If your proxy or framework buffers the response, streaming will look broken even when Claude is behaving correctly.

### What is the stream-json interface?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/streaming
Anthropic's current streaming docs focus on SSE event streams rather than a separate product named `stream-json`. If you are trying to get machine-readable partial output, the key official concepts are structured content blocks and streamed events, not a special standalone JSON stream protocol page.

So if someone says "stream-json," treat that as implementation shorthand unless they can point to a specific SDK helper.

## Batch Processing

### What is the Message Batches API for?

Sources: https://docs.anthropic.com/en/api/creating-message-batches https://docs.anthropic.com/en/docs/build-with-claude/batch-processing
Anthropic's Message Batches API is for large async workloads where immediate responses are not required. The official docs say batches can process up to 100,000 requests or 256 MB total size and usually finish well under the 24-hour cap.

The point is cost and throughput. Anthropic's batch-processing guide describes batches as the cheaper, larger-scale path for evaluation, classification, and bulk generation work.

### How are batch jobs billed?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/batch-processing https://anthropic.com/pricing
Anthropic's batch docs say the Message Batches API is cost efficient and describe a 50% discount relative to the synchronous Messages path for supported work. That is the headline benefit most teams care about.

But cost control still matters. The same docs warn that high-throughput batch processing can overshoot a workspace spending limit slightly because many requests are in flight at once.

### Why did my batch job get stuck in a loop or run far more times than expected?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/batch-processing https://docs.anthropic.com/en/api/creating-message-batches
Anthropic's batch docs do not describe a "loop detector" that saves you from duplicate submission logic. If a batch appears to run repeatedly, that is usually an application bug, retry policy bug, or duplicate scheduler event on your side.

The official best practices help here: use unique `custom_id` values, dry-run the request shape through the normal Messages API first, and monitor batch status instead of blind re-submission.

### How do I prevent batch-processing loops?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/batch-processing
Use idempotency in your own orchestration. Anthropic's docs stress meaningful unique `custom_id` values, regular status checks, and careful retry logic. That is the correct foundation.

If you are building a queue around batches, store your own submission state and refuse to enqueue the same job twice unless you can prove the first one failed.
