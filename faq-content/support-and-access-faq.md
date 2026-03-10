# Support and Access FAQ

## Support Channels

### Why do my emails to support@anthropic.com bounce?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic's official support guidance points users to the Help Center messenger, not to a general-purpose open email inbox for all support traffic. So if a direct email bounces, that is usually a workflow issue, not proof that support is unavailable.

Use the messenger inside the help flow instead. That is the documented path Anthropic wants users on for account, billing, and product issues.

### Is there a dedicated support platform?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Yes. Anthropic's documented support surface is the support messenger launched from the Help Center or product UI. Fin, the support bot, handles intake and escalates to a human team when needed.

That is the main thing users should know: the official platform is not a public phone line or open inbox. It is the support messenger.

### What's the best way to report bugs?

Sources: https://docs.anthropic.com/en/docs/claude-code/slash-commands https://support.claude.com/en/articles/9015913-how-to-get-support
For Claude Code specifically, Anthropic documents `/bug` as the in-product reporting path. For account-specific or product-access issues, the support messenger is the right route.

The best report is reproducible. Include timestamps, platform, the exact error text, and whether the issue reproduces in a fresh session.

### How do I reach a human at Anthropic support?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
You start with the support messenger and Fin. If the issue needs deeper investigation, Anthropic escalates it and the human follow-up comes by email.

There is no normal phone-support path in the official help article. If someone promises a different route, ask for the official source.

## Community Access and Permissions

### Why can't I reply to messages in a Discord thread or channel?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
This is not usually an Anthropic-platform permission issue. It is almost always a Discord server role, channel override, thread lock, or integration-permission setting.

That means the fix is inside the community server, not inside Claude. If the bot can post elsewhere but not in that channel, have a server admin inspect the channel and role-level permissions first.

### How do I get access to specific Discord channels?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic does not control your community's Discord permissions. Channel access is handled by the Discord server's own roles, verification flows, and moderation settings.

So the right answer is operational, not technical: ask the server admins what role or verification gate unlocks that channel.

### Can I automate permission acceptance in a community bot?

Sources: https://docs.anthropic.com/en/docs/claude-code/settings https://docs.anthropic.com/en/docs/claude-code/security
If you mean Claude Code's local permission prompts, yes, Anthropic documents controlled auto-allow settings. If you mean Discord server permissions, no, that is the wrong layer. Discord roles and integration permissions are handled by Discord and server admins.

Keep those two concepts separate. Local agent execution permissions and community access-control permissions are not the same problem.

## Subscription Edge Cases

### Can I transfer a Claude subscription from iOS to the web without paying twice?

Sources: https://support.claude.com/en/articles/10177702-how-do-i-upgrade-my-claude-plan https://support.claude.com/en/articles/8325617-how-do-i-cancel-my-paid-claude-subscription https://support.claude.com/en/articles/11049741-what-is-the-max-plan
Anthropic's help docs separate web billing from app-store billing, and they do not describe a one-click migration that ports remaining iOS subscription value directly into a web Max plan. That is why people run into double-billing anxiety here.

The safe path is to check your current billing rail first. If the plan is managed by Apple, cancel it there, confirm the end date, and then decide when to start the web plan. If timing matters or charges overlap, ask Support before switching rather than after.

### How do I manage a Claude Max subscription?

Sources: https://support.claude.com/en/articles/11049741-what-is-the-max-plan https://support.claude.com/en/articles/8325617-how-do-i-cancel-my-paid-claude-subscription https://support.claude.com/en/articles/10177702-how-do-i-upgrade-my-claude-plan
Anthropic's Max-plan help article explains the plan tiers, while the cancel and upgrade articles explain where to change billing. In practice, managing Max means knowing where you bought it: web, iOS, or Android.

If it is web-based, use Settings > Billing. If it is mobile-store based, manage it through that platform. That split is the part users miss most often.
