import { createFileRoute } from "@tanstack/react-router";
import { Workflow, Plus } from "lucide-react";
import { PageHeader, Panel, EmptyState, LoadingState, ErrorState, Pill } from "@/components/nexus/bits";
import { useWorkflows } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/workflows")({
  head: () => ({ meta: [{ title: "Workflows — Nexus AI" }] }),
  component: WorkflowsPage,
});

function WorkflowsPage() {
  const { data = [], isLoading, error } = useWorkflows();
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  return <div className="space-y-6">
    <PageHeader title="Workflows" description="Reusable multi-agent plans. Workflow execution remains disabled until the orchestration engine is implemented." />
    {data.length === 0 ? <EmptyState title="No workflows saved" hint="Create and save workflow drafts when the visual editor is available." /> :
      <div className="grid gap-3 md:grid-cols-2">{data.map((w) => <Panel key={w.id} className="p-4"><div className="flex items-center gap-2"><Workflow className="size-4 text-primary" /><h2 className="font-semibold">{w.name}</h2></div><p className="mt-2 text-sm text-muted-foreground">{w.description || "No description."}</p><div className="mt-3 flex gap-2"><Pill>{w.status}</Pill>{w.is_template && <Pill>Template</Pill>}</div></Panel>)}</div>}
  </div>;
}
