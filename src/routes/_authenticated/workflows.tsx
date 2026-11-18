import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/workflows")({
  head: () => ({ meta: [{ title: "Workflows — Nexus AI" }] }),
  component: () => (
    <div>
      <PageHeader title="Workflows" />
      <EmptyState title="This section isn't built yet" hint="Coming in the next pass." />
    </div>
  ),
});
