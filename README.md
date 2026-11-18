# Nexus AI — Standalone Multi-AI Command Centre

Nexus AI is a standalone application for coordinating AI agents, comparing model responses, managing tasks and approvals, and preparing browser-assisted workflows.

**The application has no Lovable runtime dependency.** Its frontend and server use TanStack Start, Vite and Nitro and deploy to Vercel or run on a compatible Node.js host.

## Architecture

- **Application hosting:** Vercel (TanStack Start + Nitro) or a compatible Node.js host.
- **Source control:** GitHub.
- **Authentication and data:** a Supabase project created and controlled independently of Lovable. The app uses Supabase Auth, PostgREST and Row Level Security.
- **AI execution:** server-side provider adapters. Provider credentials belong in server environment variables only.
- **Browser automation:** a separate, locally operated companion. The web app does not extract browser passwords or cookies.

Supabase is a separate database/auth service, not a Lovable runtime or Lovable-managed project. Vercel and the app source can be deployed independently of the Supabase dashboard.

## Production deployment

- **Vercel project:** `nexus-ai`
- **Production URL:** https://nexus-ai-tau-teal.vercel.app
- **GitHub repository:** https://github.com/bykirahayes/nexus-agent-command-center

The repository is connected to Vercel. Pushes to `main` trigger production deployments; branches and pull requests receive previews. The Vercel project currently keeps deployment protection enabled, which is appropriate for a private command centre.

The project is configured for TanStack Start with Nitro. Use Node.js 22 or later and Bun (the repository includes `bun.lock`).

## Database and authentication setup

Create a **new Supabase project in an account you control**. Do not reconnect this app to the old Lovable-managed database.

Detailed steps are in [docs/supabase-setup.md](docs/supabase-setup.md). In summary:

1. Create the new Supabase project.
2. Link this repository to it with the Supabase CLI and apply the checked-in migration.
3. Add the new project's URL and publishable key to Vercel environment variables.
4. Set the Supabase Auth site URL and redirect allow-list to the production URL.
5. Redeploy and create your new Nexus account.

New accounts automatically receive the demo workspace from the database migration. The original Lovable-linked database currently contains one auth account and seeded demo records (agents, tasks, messages and workflows), but no connected provider credentials or browser sessions. The original auth account is not automatically carried to the new project; create a fresh account after cutover.

## Environment variables

Set the following in Vercel Project Settings → Environment Variables for Production, Preview and Development as appropriate. For local development, copy `.env.example` to `.env`.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser | Public Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser | Supabase publishable/anon key |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Server | Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only; optional | Reserved for trusted server-side admin operations. Never expose it to the browser. |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc. | Server only; optional | Provider credentials (live adapters are not yet implemented) |

The app also accepts `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY` as alternatives for the publishable key. Never prefix service-role or AI provider credentials with `VITE_`.

## Local development

Requirements: Node.js 22+, Bun, Docker (for a local Supabase stack), and the Supabase CLI.

```sh
cp .env.example .env
bun install
bun run dev
```

To run Supabase locally, use `supabase start`, then copy the local API URL and anon/publishable key from `supabase status` into `.env`.

## Validation

```sh
bun run typecheck
bun run lint
bun run test
bun run build
```

## Current capability boundaries

- The provider catalog is metadata only until the provider adapters are implemented and tested against credentials you configure.
- The multi-agent orchestration core supports parallel, sequential, debate/review, and lead + reviewers modes.
- The browser companion is separate and must be explicitly paired and authorised before it can operate on websites.
- Consequential browser actions (sending, publishing, purchases, deletions, settings changes and deployments) must pause for human approval.

## Retiring the old Lovable project

Do not delete the old project or backend until the new deployment has been tested. The previous Lovable-generated `.env` file was removed from the current source in an earlier commit, but Git history is not rewritten. Review and revoke any old credentials after the new database is live. Once the new account and workspace have been verified, the old Lovable project can be deleted from the Lovable dashboard.

