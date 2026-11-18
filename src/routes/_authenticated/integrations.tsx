import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Nexus AI" }] }),
  component: () => (
    <div>
      <PageHeader title="Integrations" />
      <EmptyState title="This section isn't built yet" hint="Coming in the next pass." />
    </div>
  ),
});
