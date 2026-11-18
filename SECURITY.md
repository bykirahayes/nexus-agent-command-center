# Security policy

## Credentials and configuration
- Never commit `.env`, API keys, access tokens, passwords, Supabase service-role keys, or browser session material.
- Provider credentials must stay in server-side environment variables or a dedicated secret manager. Never use `VITE_*` for service credentials.
- Supabase publishable/anon keys are client-safe only when Row Level Security and table policies are correctly configured. They are not a substitute for RLS.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or logs.
- Earlier repository history included a Supabase project identifier and publishable configuration. Removing files in new commits does not erase history. Review active credentials and rotate/revoke them as appropriate.

## Browser automation
- Use only browser sessions explicitly authorised by the account owner.
- Do not collect passwords, export cookies, bypass access controls, evade CAPTCHAs, or use stealth automation.
- Scope permissions by domain and action. Require human confirmation before sending, publishing, purchasing, deleting, modifying settings, or deploying.

## Data migration
- Export any existing Supabase data and verify the backup before retiring an earlier project.
- Do not assume a new Supabase project contains existing users, sessions, records, or OAuth configuration.
- Keep backups encrypted and access-controlled.

## Reporting
Report suspected vulnerabilities to the repository maintainer privately rather than opening a public issue containing secrets or exploit details.
