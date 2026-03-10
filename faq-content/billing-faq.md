# Billing and Plans FAQ

## Charges, Refunds, and Support

### Why was my account charged $850 in 2 hours?

Sources: https://support.claude.com/en/articles/12386328-requesting-a-refund-for-a-paid-claude-plan https://support.claude.com/en/articles/8114526-how-will-i-be-billed https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic's official docs do not publish a special article for "I was charged hundreds of dollars unexpectedly," so you have to separate two cases: subscription billing and API or extra-usage billing.

For API usage, Anthropic bills based on successful usage and exposes billing information in the Console. For paid Claude plans, extra usage can also create charges beyond the included subscription if it has been enabled. So the first job is to identify which product generated the charge: Claude subscription, extra usage, or API.

If the amount looks wrong, gather timestamps, invoice screenshots, workspace or org name, and any evidence of loops or automation gone wrong, then open Support immediately. If you also start a bank dispute, know that Anthropic's refund article says support cannot process a refund while that dispute is pending.

### How do I request a refund for unexpected charges?

Sources: https://support.claude.com/en/articles/12386328-requesting-a-refund-for-a-paid-claude-plan https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic's official process is through the in-product support messenger. Log in, open "Get help," choose the refund flow, and follow the prompts that check eligibility.

The important limit is that Anthropic says payments are generally non-refundable unless the terms or local law make them refundable. So the fastest path is not a vague complaint. It is a precise request with dates, charge amounts, and the reason you believe the charge was unintended.

If your subscription was purchased on iOS, Anthropic says Apple handles that refund path. Android purchases have their own support path as well.

### What's the support process for account or billing issues?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
For paid Claude or Console users, the official support path is the support messenger. You log in, click your initials or name, choose "Get help," and start with Fin, Anthropic's support bot. If the issue needs a human, the conversation is escalated and someone follows up by email.

That means the best billing ticket is one that is already prepared for escalation. Include the exact charge date, amount, plan, and why you think the charge is wrong. Do not make support reconstruct the problem from scratch.

### How long does it take to get a response from support?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic's public support article explains how escalation works, but it does not publish a universal SLA for normal support tickets. What it does say is that Fin passes issues to the Product Support team when more investigation is needed and that the follow-up happens via email.

So the accurate answer is: there is no public guaranteed response window in the help article. For urgent billing problems, open the ticket with enough detail that it can be triaged cleanly on the first pass.

### How do I contact a human at Anthropic?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic explicitly says it does not offer phone or live chat support for normal users. The route to a human is through the support messenger: start with Fin, then wait for team escalation if your issue needs human review.

For team-managed or enterprise accounts, owners and admins have broader support options than normal seat holders. If you are not an owner or admin, escalation may need to go through them.

## Plans and Pricing

### What does Claude Max cost?

Sources: https://support.claude.com/en/articles/11049741-what-is-the-max-plan
As of March 10, 2026, Anthropic's help center says Max is available in two web tiers: Max 5x at $100/month and Max 20x at $200/month. The same article notes that mobile pricing may differ from web pricing.

That detail matters because people often compare an iOS subscription to a web subscription as if they are interchangeable. Anthropic does not present them as identical billing rails.

### What's the difference between Claude free and paid tiers?

Sources: https://support.claude.com/en/articles/11049741-what-is-the-max-plan https://support.claude.com/en/articles/9015913-how-to-get-support
The practical difference is not just "more messages." Paid tiers get more usage, better access during busy periods, and additional features depending on the plan. Max also includes access to Claude Code under the unified subscription model Anthropic describes in its help docs.

The free plan is fine for casual use. If you are coding heavily, relying on Claude daily, or need faster recovery from usage caps, the paid plans are the ones designed for that workload.

### Can I use Claude Code for free?

Sources: https://docs.anthropic.com/en/docs/claude-code/overview https://support.claude.com/es/articles/11145838-usando-claude-code-con-tu-plan-max
Claude Code requires an account path that can authenticate it, and Anthropic's docs describe using either a Claude.ai account or Console account. For included subscription usage, Anthropic's help docs describe Claude Code through Pro and Max plan access rather than a separate unlimited free tier.

So the honest answer is: there is no public "free Claude Code for everyone" article that says you can use the full product without either a supported subscription or API-backed account.

### Why do I have to pay separately for Claude API usage if I already have Pro or Max?

Sources: https://support.claude.com/en/articles/9876003-i-subscribe-to-a-paid-claude-ai-plan-why-do-i-have-to-pay-separately-for-api-usage-on-console
Anthropic treats Claude paid plans and the developer Console as separate products. A paid Claude subscription covers the chat product experience, while API access is billed through the developer platform.

That split surprises a lot of people the first time they move from chatting to building. But Anthropic is explicit about it: if you want both, you need both.

### How much does Claude API cost?

Sources: https://anthropic.com/pricing https://docs.anthropic.com/en/docs/about-claude/pricing https://docs.anthropic.com/en/docs/models-overview
API pricing depends on the model, input tokens, output tokens, and whether you are using features like prompt caching or batch processing. Anthropic's docs point to the pricing page for the most current numbers, which is the right source to trust for live costs.

If you are trying to estimate spend, do not look only at the base input price. Output tokens, cache writes, long-context usage, and batch discounts all change the actual bill.

### What are the free-tier limits for the API?

Sources: https://docs.anthropic.com/en/api/rate-limits
Anthropic's API docs describe usage tiers and spend limits rather than a broad unlimited free tier. As of the current docs, tier advancement is based on deposits and monthly usage thresholds, and the rate-limit page explains the request and token ceilings for each tier.

If you are building anything real, treat the API as a paid product with defined spend and rate boundaries, not as a "maybe free if I stay small" service.

### How is token usage calculated?

Sources: https://docs.anthropic.com/en/api/messages https://docs.anthropic.com/en/docs/build-with-claude/token-counting
Anthropic bills and rate-limits the API by tokens. In plain language, that means your input, the model's output, and in some cases cached or long-context behavior all contribute to usage.

If you need predictability, use the token-counting API before sending expensive requests. That is the official way to estimate size before you commit to the full call.

### How do I cancel my paid Claude subscription?

Sources: https://support.claude.com/en/articles/8325617-how-do-i-cancel-my-paid-claude-subscription
Anthropic's cancellation instructions depend on where you bought the plan. Web and desktop subscriptions are canceled in Settings > Billing. iOS and Android purchases are managed through their respective app-store billing flows.

The key line in the help article is that cancellation takes effect at the end of the current billing period. Canceling stops renewal; it does not usually cut off the paid term immediately.
