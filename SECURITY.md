# Security policy

## Secrets and environment files
- Never commit `.env`, API keys, access tokens, passwords, Supabase service-role keys, or browser session material.
- Keep provider credentials in server-side environment variables or a dedicated secret manager. Never expose them through Vite client variables (for example, `VITE_*_API_KEY`).
- The committed `.env` from the initial Lovable export has been removed from the working branch and replaced with `.env.example`, which contains variable names only. Because values were previously committed, rotate any credentials that may have been exposed and review repository history. Removing a file in a new commit does not erase it from Git history.
- Supabase publishable/anon keys are designed for client use, but they are not a substitute for row-level security. Never put a service-role/secret key in client code.

## Browser automation
- Use only browser sessions explicitly authorised by the account owner.
- Do not collect passwords, export cookies, bypass access controls, evade CAPTCHAs, or use stealth automation.
- Scope permissions by domain and action. Require human confirmation before sending, publishing, purchasing, deleting, modifying settings, or deploying.

## Reporting
Report suspected vulnerabilities to the repository maintainer privately rather than opening a public issue containing secrets or exploit details.
