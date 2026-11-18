import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, EmptyState } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/browser")({
  head: () => ({ meta: [{ title: "Browser — Nexus AI" }] }),
  component: () => (
    <div>
      <PageHeader title="Browser" />
      <EmptyState title="This section isn't built yet" hint="Coming in the next pass." />
    </div>
  ),
});
