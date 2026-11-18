import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/agents")({
  head: () => ({ meta: [{ title: "Agents — Nexus AI" }] }),
  component: () => (
    <div>
      <PageHeader title="Agents" />
      <EmptyState title="This section isn't built yet" hint="Coming in the next pass." />
    </div>
  ),
});
