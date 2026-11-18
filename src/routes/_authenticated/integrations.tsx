import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Plug, ShieldCheck, Workflow } from "lucide-react";
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
  const status = useQuery({
    queryKey: ["provider-secret-status"],
    queryFn: () => getProviderSecretStatus(),
  });
  const gatewayConnected = status.data?.gateway === true;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect model providers through your Vercel account, or use provider-specific credentials where supported."
      />

      <Panel title="Vercel AI Gateway">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Workflow className="size-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">One connection · multiple model providers</h2>
                <Pill className={gatewayConnected ? "border-primary/30 bg-primary/10 text-primary" : ""}>
                  {status.isLoading ? "Checking…" : status.isError ? "Status unavailable" : gatewayConnected ? "Connected via Vercel" : "Not available in this runtime"}
                </Pill>
              </div>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                Production deployments authenticate to AI Gateway with Vercel OIDC. Nexus does not need to store your provider API keys for the supported models below.
              </p>
              <p className="mt-2 max-w-3xl text-xs text-muted-foreground">
                This uses your Vercel team's AI Gateway billing, not your ChatGPT Plus, Claude.ai, Google One, or other consumer chat subscription. Vercel currently includes $5/month in AI Gateway credit; additional use is pay-as-you-go.
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <a href="https://vercel.com/docs/ai-gateway" target="_blank" rel="noreferrer">
              Gateway details <ExternalLink className="ml-1 size-3" />
            </a>
          </Button>
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        {PROVIDERS.map((provider) => {
          const configured = status.data?.providers?.[provider.key] === true;
          const message = status.isLoading
            ? "Checking connection…"
            : status.isError
              ? "Status unavailable"
              : configured
                ? "Available through Vercel AI Gateway"
                : provider.gatewaySupported
                  ? "Gateway authentication unavailable"
                  : provider.methods.includes("unavailable")
                    ? "No supported model API"
                    : "Direct provider adapter not implemented yet";

          return (
            <Panel key={provider.key} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{provider.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{provider.vendor}</p>
                </div>
                <Pill>{provider.methods.join(" / ")}</Pill>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {provider.capabilities.map((capability) => (
                  <Pill key={capability}>{capability}</Pill>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{provider.note}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                <span className={configured ? "text-xs text-primary" : "text-xs text-muted-foreground"}>
                  {message}
                </span>
                <Button asChild size="sm" variant="outline">
                  <a href={provider.docsUrl} target="_blank" rel="noreferrer">
                    Provider docs <ExternalLink className="ml-1 size-3" />
                  </a>
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel title="Credential safety">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          Vercel OIDC credentials are supplied at runtime and are never sent to the browser. Provider API keys, where needed, must remain in server-side secrets. Signing in to a consumer chat website does not automatically grant API access to Nexus.
        </p>
      </Panel>
    </div>
  );
}
