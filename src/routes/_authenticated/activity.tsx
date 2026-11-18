import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({ meta: [{ title: "Activity — Nexus AI" }] }),
  component: () => (
    <div>
      <PageHeader title="Activity" />
      <EmptyState title="This section isn't built yet" hint="Coming in the next pass." />
    </div>
  ),
});
