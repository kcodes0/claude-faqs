# Account Issues FAQ

## Access and Login

### Why can't I log in to my account?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support https://support.claude.com/en/articles/7993562-i-entered-my-email-address-but-i-haven-t-received-my-login-code https://docs.anthropic.com/en/docs/claude-code/troubleshooting
If Claude will not let you in, start with the simple checks first: make sure you are using the correct email, retry the login flow, and check spam or delayed inbox rules if the issue is a missing verification email. Anthropic's help center also points to the support messenger for cases where the normal login path is blocked.

If the problem is specific to Claude Code, the official troubleshooting guide recommends logging out, restarting the app, and forcing a clean login by removing the cached auth file if needed. That is a practical fix when the account itself is fine but the local auth state is stale.

If you still cannot log in after that, use the Help Center messenger and choose the "I can't login" path. That is the official route for account-access issues.

### I entered my email address but I haven't received my verification email. What should I try?

Sources: https://support.claude.com/en/articles/7993562-i-entered-my-email-address-but-i-haven-t-received-my-login-code
Anthropic's official guidance here is short: confirm the email address is correct, use the retry option, and check spam or filtered folders. That sounds basic, but it covers the most common failure modes.

If the code still does not arrive, stop retrying over and over and move to support. Repeated attempts can make the situation harder to reason about because you no longer know whether you are waiting on an old email or a new one.

### How do I change my email address or recover an account tied to an old email?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support https://support.claude.com/en/articles/12386328-requesting-a-refund-for-a-paid-claude-plan
There is not a broad public self-serve article that says "click here to change your Claude account email" for every plan type. In practice, Anthropic routes account-recovery and subscription-access issues through the support messenger, and the refund article explicitly says that if you cannot access the email tied to the account, you should contact Support from another email and identify the inaccessible account.

That means the safe path is: gather the old email address, payment details, plan name, and any recent billing dates, then open support from a reachable email address. Ask for account access help first and billing changes second. That gives the team a clearer verification trail.

### How do I update my payment method if my email account is disabled?

Sources: https://support.claude.com/en/articles/12386328-requesting-a-refund-for-a-paid-claude-plan https://support.claude.com/en/articles/9015913-how-to-get-support https://support.claude.com/en/articles/12997130-understanding-your-billing-address-and-tax-calculation
Normally, Anthropic expects you to update billing details through Settings > Billing. If you cannot access the account because the original email is gone, you are outside the normal self-serve flow.

The official support guidance is to contact Support from another email and identify the account you cannot access. Include the inaccessible email address, your plan, the last billing date you recognize, and enough payment detail for the team to validate ownership. If the subscription was started through Apple or Google, expect some billing actions to be redirected to the app-store platform that processed the purchase.

### I'm getting an "access denied" message. What does that usually mean?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support https://support.claude.com/en/articles/13200993-restrict-access-to-claude-with-ip-allowlisting
"Access denied" is not one single bug. It can mean the account is not entitled to a feature, the organization has restricted access, or an enterprise control like IP allowlisting is blocking the request.

If you are on an organization-managed plan, first check with the workspace owner or IT admin before assuming it is a broken account. Anthropic's IP allowlisting documentation makes clear that enterprise admins can block access based on network location.

If this is a personal plan and the error persists across web and app login, open the support messenger rather than guessing. You want Anthropic to confirm whether the issue is entitlement, auth state, or account-level restriction.

## Bans and Suspensions

### My account was banned. What can I do?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic does not publish a public, step-by-step appeal playbook for every ban scenario. The practical path is to contact Support through the Help Center and ask for clarification or review.

Keep the message clean and factual. Include the account email, when the ban appeared, whether you were using Claude.ai, Claude Code, or the API, and any recent billing or security events that may help support understand what happened. Long emotional writeups do not help nearly as much as a tight timeline.

### How do I appeal an account ban?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
There is no public "appeal form" article that Anthropic points to for standard users. Appeals go through the same support path as other account issues.

Use the support messenger, provide the exact account identifier, and ask for a review. If the account is organization-managed, the owner or admin may need to contact Anthropic on your behalf.

### My account is temporarily suspended. How long will it last?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic does not publish a universal suspension timer because suspensions can happen for different reasons. Some are automated safety or verification checks, others are billing or access problems.

That means the only reliable answer is account-specific. Support can tell you whether the suspension is temporary, what needs to be fixed, and whether further verification is required.

## Security and Recovery

### Someone else is using my account. What should I do?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Treat this as an account-security issue, not a normal login problem. Sign out of other sessions if you still can, change the email password attached to the account, and contact Support with a short timeline of suspicious activity.

If the billing method is attached to the compromised account, mention that immediately so the support team understands the financial risk, not just the login risk.

### I deleted my account by accident. Can I recover it?

Sources: https://support.claude.com/en/articles/9015913-how-to-get-support
Anthropic's public help docs do not promise full self-serve recovery for deleted accounts. If this happened recently, contact Support immediately and ask whether recovery is still possible.

Do not assume waiting is harmless. For deletion, the important variable is usually timing and what data lifecycle has already started on Anthropic's side.
