import { createFileRoute } from "@tanstack/react-router";
import { Activity, Bot, CircleDollarSign, Plug, Plus, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, EmptyState, LoadingState, ErrorState, StatusBadge } from "@/components/nexus/bits";
import { useAgents, useTasks, useProviders, useApprovals, timeAgo } from "@/lib/data";
import { useNewTask } from "@/components/nexus/new-task";

export const Route = createFileRoute("/_authenticated/overview")({
  head: () => ({ meta: [{ title: "Overview — Nexus AI" }] }),
  component: OverviewPage,
});

function OverviewPage() {
  const openTask = useNewTask();
  const agents = useAgents();
  const tasks = useTasks();
  const providers = useProviders();
  const approvals = useApprovals();
  const error = agents.error || tasks.error || providers.error || approvals.error;
  const loading = agents.isLoading || tasks.isLoading || providers.isLoading || approvals.isLoading;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const running = (tasks.data ?? []).filter((t) => t.status === "running").length;
  const queued = (tasks.data ?? []).filter((t) => t.status === "queued").length;
  const pending = (approvals.data ?? []).filter((a) => a.status === "pending").length;
  const connected = (providers.data ?? []).filter((p) => p.status === "connected").length;
  const metrics = [
    { label: "Agents", value: agents.data?.length ?? 0, icon: Bot, detail: "Configured agents" },
    { label: "Providers", value: connected, icon: Plug, detail: "Connected accounts" },
    { label: "Active tasks", value: running + queued, icon: Activity, detail: running + " running · " + queued + " queued" },
    { label: "Awaiting approval", value: pending, icon: ShieldCheck, detail: "Human review required" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Command overview" description="Your AI operations, connections and approvals in one place."
        actions={<Button onClick={() => openTask()}><Plus className="mr-2 size-4" />New task</Button>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => <Panel key={m.label} className="p-4"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs">{m.label}</span><m.icon className="size-4" /></div><div className="mt-3 text-2xl font-semibold tabular-nums">{m.value}</div><p className="mt-1 text-xs text-muted-foreground">{m.detail}</p></Panel>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Recent tasks" action={<Button size="sm" variant="outline" onClick={() => openTask()}>Create task</Button>}>
          {(tasks.data ?? []).length === 0 ? <EmptyState title="No tasks yet" hint="Create a task to start building your agent workspace." /> :
            <div className="space-y-3">{(tasks.data ?? []).slice(0, 6).map((task) => <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"><div className="min-w-0"><p className="truncate text-sm font-medium">{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{timeAgo(task.created_at)}</p></div><StatusBadge status={task.status} /></div>)}</div>}
        </Panel>
        <div className="space-y-4">
          <Panel title="System readiness"><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Provider adapters</span><span className="text-primary">Vercel AI Gateway routes</span></div><div className="flex justify-between"><span className="text-muted-foreground">Browser companion</span><span className="text-warning">Not connected</span></div><div className="flex justify-between"><span className="text-muted-foreground">Workflow execution</span><span className="text-warning">UI not wired yet</span></div><div className="flex justify-between"><span className="text-muted-foreground">Approval gates</span><span className="text-primary">UI available</span></div></div></Panel>
          <Panel title="Operating costs"><div className="flex items-center gap-3"><CircleDollarSign className="size-5 text-muted-foreground" /><div><p className="text-2xl font-semibold">£0.00</p><p className="text-xs text-muted-foreground">No provider usage recorded</p></div></div></Panel>
        </div>
      </div>
      <Panel title="Approvals requiring attention">{pending === 0 ? <p className="text-sm text-muted-foreground">No pending approvals.</p> : <p className="text-sm">{pending} action(s) are waiting for your decision.</p>}</Panel>
      <p className="text-xs text-muted-foreground">Provider model routing is available through Vercel AI Gateway. Saved task execution still needs to be wired into the UI before tasks invoke the orchestration engine.</p>
    </div>
  );
}
