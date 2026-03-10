# General Questions About Claude

## Core Behavior

### Why does Claude ignore my instructions sometimes?

Sources: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks
Usually because the instruction was vague, conflicted with other instructions, collided with a safety boundary, or was buried inside too much context. Anthropic's prompting guides consistently reward clarity, specificity, and good structure.

If you want better compliance, tighten the task, define the output shape, and remove conflicting asks. Claude is much more reliable when the prompt is coherent.

### Why does Claude make things up or sound confidently wrong?

Sources: https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tool https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
Claude can still hallucinate. Anthropic's docs treat evaluation and grounding as necessary engineering work, not as optional polish.

So the right mental model is not that Claude lies on purpose. It is that language models can produce plausible but wrong output if the task is ambiguous or the model is not grounded in the right context.

### How often does Claude get updated?

Sources: https://docs.anthropic.com/en/release-notes/claude-apps https://docs.anthropic.com/en/release-notes/api
There is no fixed public cadence like "every second Tuesday." Anthropic ships updates when they are ready and records them in release notes.

If update timing matters to your workflow, watch release notes, not forum speculation.
