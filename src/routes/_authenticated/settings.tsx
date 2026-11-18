import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Pill } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Nexus AI" }] }),
  component: () => <div className="space-y-6"><PageHeader title="Settings" description="Security and deployment configuration." /><Panel title="Deployment"><p className="text-sm text-muted-foreground">This repository is not yet packaged for self-hosting. Supabase remains the active data and authentication backend; local database support and Docker Compose are still roadmap work.</p><div className="mt-3 flex flex-wrap gap-2"><Pill>Supabase backend</Pill><Pill>Local-first roadmap</Pill><Pill>Docker not configured</Pill></div></Panel><Panel title="Security baseline"><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground"><li>Never commit environment files or secrets.</li><li>Keep model API keys server-side.</li><li>Use row-level security for all user-owned records.</li><li>Require explicit approval before external side effects.</li><li>Use only authorised browser sessions and scoped permissions.</li></ul></Panel></div>,
});
