# Nexus AI — Standalone Multi-AI Command Centre

Nexus AI is a standalone application for coordinating AI agents, comparing model responses, managing tasks and approvals, and preparing browser-assisted workflows.

**The application no longer uses Lovable runtime packages, auth helpers, telemetry, project configuration, or build tooling.** The frontend and server are built with TanStack Start, Vite and Nitro and deploy directly to Vercel or run on your own server.

## Architecture

- **Application hosting:** Vercel (TanStack Start + Nitro) or any compatible Node.js host.
- **Source control:** GitHub.
- **Authentication and data:** a Supabase project owned and configured independently of Lovable. Auth and database access use the standard Supabase client and Row Level Security.
- **AI execution:** server-side provider adapters. Provider credentials belong in server environment variables only.
- **Browser automation:** a separate, locally operated companion. The web application does not extract browser passwords or cookies.

The Supabase project is a separate service; it is not a Lovable dependency. The Vercel project and application code can be deployed independently of the Supabase dashboard.

## Vercel deployment

1. Import `bykirahayes/nexus-agent-command-center` into Vercel and select the `nexus-ai` project.
2. Set the framework to **TanStack Start**. The repository includes `vercel.json` and the native `nitro/vite` configuration.
3. Add the environment variables listed below to Preview and Production.
4. Deploy from the Git-connected repository. Pushes to the production branch deploy production; pull requests/branches get previews.

Use Node.js 22 or later. The repository uses Bun and includes `bun.lock`.

## Supabase setup

Create or select a Supabase project in an account you control. Do not use the old Lovable-managed project for a fresh standalone installation unless you have intentionally chosen to keep it.

For a fresh database, apply the checked-in migration:

```sh
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

For a self-hosted Supabase stack, initialise and start the stack with the Supabase CLI/Docker, then apply the same migration to that local instance.

In Supabase Authentication settings, configure the site URL and allowed redirect URLs for your Vercel deployment and local development. Enable Google OAuth only after you have configured your own Google OAuth credentials in Supabase. Email/password sign-in works through Supabase Auth.

## Environment variables

Set these in Vercel Project Settings → Environment Variables. For local development, copy `.env.example` to `.env`.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser + server | Public Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Supabase publishable/anon key |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Server | Server-side publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin operations where explicitly required |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc. | Server only | Optional provider credentials |

You may use the equivalent `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY` variable names for the public key. Never add the service-role key or AI provider keys to `VITE_*` variables or commit them to Git.

## Local development

Requirements: Node.js 22+, Bun, Docker (only if running Supabase locally), and the Supabase CLI.

```sh
cp .env.example .env
bun install
bun run dev
```

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

## Migration note

The previous Lovable-generated `.env` file was removed from the current source in an earlier commit. Git history is not rewritten. Review the old Supabase project and rotate/revoke any credentials that may still be active before retiring that project. Export or migrate existing user data before deleting the old backend.
