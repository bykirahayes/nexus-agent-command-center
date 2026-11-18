# Supabase setup for Nexus AI

This guide documents the separately managed Supabase backend for Nexus AI. The Supabase project is owned by the "info@thekianprice.co.uk's Org" organisation, independent of Lovable.

## 1. Project

- Project: nexus-ai
- Project ref: vujhozqroopxjaguzihe
- Region: eu-west-2 (London)
- Plan: Free

The old Lovable-linked Supabase project is intentionally left untouched until the new sign-in and workspace have been verified.

## 2. Database schema

The following migrations are applied and tracked in supabase/migrations/:

- 20261118000000_initial_schema.sql — application tables, row-level security, signup trigger and demo workspace seeding.
- 20261118130524_security_hardening.sql — restricts execution of the signup trigger function, optimises owner policies and adds foreign-key indexes.

To link a local clone and verify the migration history:

\`\`\`sh
bun install
npx supabase login
npx supabase link --project-ref vujhozqroopxjaguzihe
npx supabase migration list
\`\`\`

Run \`npx supabase db push\` only when the local migration files are the intended source of truth and the remote migration history has been checked first.

All nine public application tables have row-level security enabled. Supabase's security advisor reports no current security findings.

## 3. Vercel environment variables

These values are already configured on the Vercel project nexus-ai for Production, Preview and Development:

| Key | Value |
| --- | --- |
| VITE_SUPABASE_URL | New Supabase project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | New project's publishable key |
| SUPABASE_URL | Same new project URL |
| SUPABASE_PUBLISHABLE_KEY | Same new project's publishable key |

The publishable key is intended for client use; row-level security protects the data. The service-role key is not required for current user-facing flows and has not been added to Vercel.

## 4. Authentication URLs — finish in Supabase Dashboard

Open [Nexus AI Authentication URL Configuration](https://supabase.com/dashboard/project/vujhozqroopxjaguzihe/auth/url-configuration) and set:

- Site URL: https://nexus-ai-tau-teal.vercel.app
- Additional Redirect URL: https://nexus-ai-tau-teal.vercel.app/overview
- Local development: http://localhost:3000/**
- Vercel deployment previews (optional): https://nexus-*-info-58135976.vercel.app/**

The Site URL is the base production origin. Redirect URLs are separate allow-list entries used by email confirmation and OAuth flows. Google sign-in remains optional and requires an OAuth client configured in Supabase.

## 5. Production deployment

The Vercel production deployment is built from the repository's main branch in the London function region. Its stable URL is:

https://nexus-ai-tau-teal.vercel.app

After the Auth URL configuration is saved, open the site, create a new account and confirm the email if confirmation is enabled. The signup trigger seeds a demo workspace. Check that the Overview page loads and that a draft task can be created before retiring the old backend.

The Vercel project has deployment SSO protection enabled. This is separate from Nexus AI's own application authentication.

## Existing data and account cutover

The old Lovable-linked backend was checked before the migration. It contained one auth account and seeded demo records: four agents, four tasks, six task messages, four workflows and one approval. It had no configured provider records, browser sessions or domain permissions.

The old auth account is not automatically transferred. Create a fresh account in the new project; the signup trigger seeds a new demo workspace. No passwords, provider API keys or browser session data are copied.

Keep the old backend until the new sign-in and workspace are verified. Then revoke/rotate old credentials and delete the old Lovable project from its dashboard only if you no longer need it.
