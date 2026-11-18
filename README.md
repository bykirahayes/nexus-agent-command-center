# Nexus AI — Agent Command Center

Nexus AI is a local-first, personal multi-AI command centre. The application shell and initial data model were generated with Lovable; this repository is being developed toward a self-hosted orchestration application.

## Current implementation status

This repository is an **incomplete development scaffold**, not yet a production-ready multi-agent service.

- Authentication and data access are wired to a Supabase project configured through environment variables.
- The UI shell and task composer exist; several feature routes remain placeholders.
- Provider metadata is catalogued, but provider adapters are not yet implemented as live model clients.
- Browser automation is intentionally not available until a separately authorised local companion exists.
- Workflows must remain drafts until a real execution engine is implemented.
- Do not interpret seeded or simulated values as live connections or active agent execution.

## Providers and billing

Provider API access is separate from most consumer chat subscriptions. Configure API credentials server-side and review each provider's billing, quota, regional availability, and terms before use. A listed provider is not automatically connected.

## Local development

Requirements: Node.js compatible with the lockfile, Bun (the repository includes `bun.lock`), and access to the configured Supabase project.

```sh
cp .env.example .env
# Fill in the Supabase values from your own project.
bun install
bun run dev
```

The generated Supabase client expects `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and corresponding `VITE_*` values. Never put server secrets in a `VITE_*` variable.

## Validation

```sh
bun run lint
bun run test
bun run build
```

A successful local build does not by itself validate the remote Supabase schema, authentication policies, or production deployment.

## Self-hosting roadmap

1. Stabilise authentication, database migrations, and row-level security.
2. Implement server-side provider adapters and task orchestration.
3. Add approval-gated execution and immutable audit events.
4. Build a local browser companion with domain-scoped permissions.
5. Add Docker Compose, health checks, persistence, backup/restore, and deployment documentation.

See [SECURITY.md](./SECURITY.md) before configuring credentials or browser permissions.

## Lovable

Original project: https://lovable.dev/projects/6a2a6a9a-635d-4e65-8302-3e0c7f78a096
