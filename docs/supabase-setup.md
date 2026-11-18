# Supabase setup for Nexus AI

This guide creates a database/auth backend that is independent of Lovable. You own the Supabase organisation, project, billing and credentials. The Vercel app remains private behind the Vercel deployment protection configured on the project.

## 1. Create the new project

1. Sign in to the Supabase dashboard using an account you control.
2. Create a new project named `nexus-ai`.
3. Choose a region close to your users and Vercel deployment. Keep the database password in a password manager.
4. Wait for the project to finish provisioning.

Do not use the old Lovable-linked Supabase project for this cutover.

## 2. Apply the database schema

From a local clone of this repository:

```sh
bun install
npx supabase login
npx supabase link --project-ref <new-project-ref>
npx supabase db push
```

The migration creates the application tables, row-level security policies and a signup trigger that seeds a demo workspace for each new user.

Before proceeding, check the migration history in the Supabase dashboard and confirm that `20261118000000_initial_schema.sql` was applied successfully.

## 3. Configure the app's environment variables

In Supabase Project Settings → API, copy the project URL and publishable key (or legacy anon key).

In Vercel → `nexus-ai` → Settings → Environment Variables, add:

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | New Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | New project's publishable key |
| `SUPABASE_URL` | Same new project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Same new project's publishable key |

Set them for Production. Add them to Preview and Development only if those environments should use the same database. For a safer arrangement, use separate Supabase projects for production and preview.

The service-role key is not required for the current user-facing data flows. Do not add it unless a future trusted server-side admin function requires it.

## 4. Configure authentication URLs

In Supabase → Authentication → URL Configuration:

- Site URL: `https://nexus-ai-tau-teal.vercel.app`
- Redirect URL: `https://nexus-ai-tau-teal.vercel.app/overview`
- Local development redirect: `http://localhost:3000/overview`

If you add a custom domain later, add its `/overview` callback URL too.

Email/password sign-in works through Supabase Auth. Google sign-in is optional and requires your own Google OAuth client credentials configured in Supabase's provider settings.

## 5. Redeploy and create your account

After adding the environment variables, trigger a production redeployment in Vercel. Open the production URL, choose **Sign up**, create your account and confirm the email if confirmation is enabled.

The database trigger seeds the new user with demo agents, tasks, messages, workflows and a sample approval. Confirm the Overview page loads and that you can create a draft task before retiring the old backend.

## Existing data and account cutover

The old Lovable-linked backend was checked before writing this guide. It contained one auth account and seeded demo records: four agents, four tasks, six task messages, four workflows and one approval. It had no configured provider records, browser sessions or domain permissions.

The old auth account is not automatically transferable by this setup. Create a fresh account in the new project; the migration re-seeds the demo workspace. No API keys, passwords, provider credentials or browser session data are copied.

Keep the old backend until the new sign-in and workspace are verified. Then revoke/rotate old credentials and delete the old Lovable project from its dashboard if you no longer need it.
