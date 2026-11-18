# Nexus AI — Standalone Multi-AI Command Centre

Nexus AI is a standalone application for coordinating AI agents, comparing model responses, managing tasks and approvals, and preparing browser-assisted workflows.

**The application has no Lovable runtime dependency.** Its frontend and server use TanStack Start, Vite and Nitro and deploy to Vercel or run on a compatible Node.js host.

## Architecture

- **Application hosting:** Vercel (TanStack Start + Nitro) or a compatible Node.js host.
- **Source control:** GitHub.
- **Authentication and data:** a Supabase project created and controlled independently of Lovable. The app uses Supabase Auth, PostgREST and Row Level Security.
- **AI model access:** Vercel AI Gateway using deployment OIDC for supported models. Provider-specific API credentials or OAuth integrations can be added where a provider supports them.
- **Browser automation:** a separate, locally operated companion. The web app does not extract browser passwords or cookies.

Supabase is a separate database/auth service, not a Lovable runtime or Lovable-managed project. Vercel and the app source can be deployed independently of the Supabase dashboard.

## Production deployment

- **Vercel project:** \`nexus-ai\`
- **Production URL:** https://nexus-ai-tau-teal.vercel.app
- **GitHub repository:** https://github.com/bykirahayes/nexus-agent-command-center

The repository is connected to Vercel. Pushes to \`main\` trigger production deployments; branches and pull requests receive previews. The Vercel project currently keeps deployment protection enabled, which is appropriate for a private command centre.

The project is configured for TanStack Start with Nitro. Use Node.js 22 or later and Bun (the repository includes \`bun.lock\`).

## Database and authentication setup

The new Supabase project is documented in [docs/supabase-setup.md](docs/supabase-setup.md). New accounts automatically receive the demo workspace from the database migration. The original Lovable-linked database is kept separate and must not be deleted until the new account and workspace are verified.

## AI provider access

The production Vercel deployment can authenticate to Vercel AI Gateway using the short-lived \`VERCEL_OIDC_TOKEN\` injected by Vercel. No provider API key needs to be stored in the browser or copied into the repository. Local development can use a Vercel AI Gateway API key in \`.env\` when not using Vercel's local OIDC flow.

The following provider routes are implemented through the Gateway: OpenAI, Anthropic Claude, Google Gemini, xAI Grok and Mistral. Other providers remain listed as unavailable until their direct adapters are implemented.

**Billing:** Vercel AI Gateway is billed through the Vercel team, not through ChatGPT Plus, Claude.ai, Google One or other consumer chat subscriptions. Vercel currently includes $5/month in AI Gateway credits. Further use is pay-as-you-go; check the live [AI Gateway pricing](https://vercel.com/docs/ai-gateway/pricing) before running workloads.

Consumer-account OAuth is not a universal API authentication method. Where a provider offers a supported user OAuth flow, Nexus can integrate it separately; where it does not, use Gateway or a server-side API credential.

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| \`VITE_SUPABASE_URL\` | Browser | Public Supabase project URL |
| \`VITE_SUPABASE_PUBLISHABLE_KEY\` | Browser | Supabase publishable/anon key |
| \`SUPABASE_URL\` | Server | Supabase project URL |
| \`SUPABASE_PUBLISHABLE_KEY\` | Server | Supabase publishable/anon key |
| \`AI_GATEWAY_API_KEY\` | Server only; optional | Gateway key for local or non-Vercel deployments. Production Vercel can use OIDC instead. |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Server only; optional | Reserved for trusted server-side admin operations. Never expose it to the browser. |
| Provider API keys | Server only; optional | Only for future direct provider adapters |

Never prefix service-role, gateway, OAuth or AI provider credentials with \`VITE_\`.

## Local development

Requirements: Node.js 22+, Bun, Docker (for a local Supabase stack), and the Supabase CLI.

\`\`\`sh
cp .env.example .env
bun install
bun run dev
\`\`\`

For local AI Gateway requests, add \`AI_GATEWAY_API_KEY\` to your ignored local \`.env\`, or use the Vercel CLI flow to obtain a development OIDC token.

## Validation

\`\`\`sh
bun run typecheck
bun run lint
bun run test
bun run build
\`\`\`

## Current capability boundaries

- Gateway-backed completion adapters are implemented for OpenAI, Anthropic, Google Gemini, xAI and Mistral model IDs.
- Perplexity, DeepSeek, Copilot and custom endpoints remain unavailable until their direct adapters or provider routes are implemented.
- The multi-agent orchestration core supports parallel, sequential, debate/review, and lead + reviewers modes. The application still needs its authenticated task-execution endpoint wired into the UI before saved tasks can invoke the engine end-to-end.
- The browser companion is separate and must be explicitly paired and authorised before it can operate on websites.
- Consequential browser actions (sending, publishing, purchases, deletions, settings changes and deployments) must pause for human approval.

## Retiring the old Lovable project

Do not delete the old project or backend until the new deployment has been tested. The previous Lovable-generated \`.env\` file was removed from the current source in an earlier commit, but Git history is not rewritten. Review and revoke any old credentials after the new database is live. Once the new account and workspace have been verified, the old Lovable project can be deleted from the Lovable dashboard.
