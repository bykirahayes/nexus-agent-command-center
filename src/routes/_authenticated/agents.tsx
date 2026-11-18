import { createFileRoute } from "@tanstack/react-router";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, EmptyState, LoadingState, ErrorState, Pill } from "@/components/nexus/bits";
import { useAgents } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/agents")({
  head: () => ({ meta: [{ title: "AI Agents — Nexus AI" }] }),
  component: AgentsPage,
});

function AgentsPage() {
  const { data = [], isLoading, error } = useAgents();
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  return <div className="space-y-6">
    <PageHeader title="AI Agents" description="Agent profiles define which provider and model a task can use." />
    {data.length === 0 ? <EmptyState title="No agents configured" hint="Agent creation will be enabled alongside the live orchestration service." /> :
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{data.map((a) => <Panel key={a.id} className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><Bot className="size-5" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{a.name}</p><p className="text-xs text-muted-foreground">{a.provider_key} · {a.model}</p></div></div><p className="mt-3 text-sm text-muted-foreground">{a.description || "No description provided."}</p><div className="mt-3 flex gap-2"><Pill>{a.role}</Pill><Pill>{a.enabled ? "Enabled" : "Disabled"}</Pill>{a.is_demo && <Pill>Demo</Pill>}</div></Panel>)}</div>}
    <Panel title="Agent execution"><p className="text-sm text-muted-foreground">Agents are stored as configuration records. Live execution is disabled until provider adapters and task orchestration are implemented and tested.</p></Panel>
  </div>;
}
