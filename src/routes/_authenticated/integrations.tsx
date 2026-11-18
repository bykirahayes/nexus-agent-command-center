import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Plug, ShieldCheck } from "lucide-react";
import { PageHeader, Panel, Pill } from "@/components/nexus/bits";
import { PROVIDERS } from "@/lib/providers/catalog";
import { getProviderSecretStatus } from "@/lib/providers/providers.functions";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Nexus AI" }] }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const status = useQuery({ queryKey: ["provider-secret-status"], queryFn: () => getProviderSecretStatus() });
  return <div className="space-y-6">
    <PageHeader title="Integrations" description="Provider catalogue and server-side credential readiness. A key being present does not yet mean live requests are supported." />
    <div className="grid gap-3 md:grid-cols-2">
      {PROVIDERS.map((p) => {
        const configured = status.data?.[p.key] === true;
        return <Panel key={p.key} className="p-4">
          <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{p.name}</h2><p className="mt-1 text-xs text-muted-foreground">{p.vendor}</p></div><Pill>{p.methods.join(" / ")}</Pill></div>
          <div className="mt-3 flex flex-wrap gap-1.5">{p.capabilities.map((c) => <Pill key={c}>{c}</Pill>)}</div>
          <p className="mt-3 text-xs text-muted-foreground">{p.note}</p>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
            <span className={configured ? "text-xs text-primary" : "text-xs text-muted-foreground"}>{status.isLoading ? "Checking server…" : status.isError ? "Status unavailable" : configured ? "Credential present · adapter unavailable" : "Not configured"}</span>
            <Button asChild size="sm" variant="outline"><a href={p.docsUrl} target="_blank" rel="noreferrer">Provider docs <ExternalLink className="ml-1 size-3" /></a></Button>
          </div>
        </Panel>;
      })}
    </div>
    <Panel title="Credential safety"><p className="flex items-start gap-2 text-sm text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />API keys must be configured in the server's secret environment, never pasted into browser storage or committed to Git. Consumer chat subscriptions do not automatically grant API access.</p></Panel>
  </div>;
}
