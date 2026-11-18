import { createFileRoute } from "@tanstack/react-router";
import { Globe, ShieldAlert } from "lucide-react";
import { PageHeader, Panel, Pill } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/browser")({
  head: () => ({ meta: [{ title: "Browser Sessions — Nexus AI" }] }),
  component: BrowserPage,
});

function BrowserPage() {
  return <div className="space-y-6">
    <PageHeader title="Browser sessions" description="Website access is delegated through an explicitly authorised local companion." />
    <Panel className="p-5">
      <div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2 text-warning"><Globe className="size-5" /></div><div><h2 className="font-semibold">Browser companion required</h2><p className="text-xs text-muted-foreground">No local companion is currently connected.</p></div></div>
      <p className="mt-4 text-sm text-muted-foreground">This dashboard does not control your browser or reuse logged-in sessions yet. A separate local companion must be installed and paired before any browser activity can take place.</p>
      <div className="mt-4 flex flex-wrap gap-2"><Pill>Read-only by default</Pill><Pill>Domain-scoped permissions</Pill><Pill>Revocable sessions</Pill><Pill>Audit trail</Pill></div>
    </Panel>
    <Panel title="Permission model"><div className="space-y-3 text-sm"><div><p className="font-medium">Read-only</p><p className="text-xs text-muted-foreground">Navigate and inspect only explicitly allowed domains.</p></div><div><p className="font-medium">Action access</p><p className="text-xs text-muted-foreground">Disabled by default. Each consequential action must pause for your approval.</p></div><div className="flex items-start gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground"><ShieldAlert className="size-4 shrink-0" />Nexus will not request passwords or exported cookies, bypass CAPTCHAs, or evade website access controls.</div></div></Panel>
  </div>;
}
