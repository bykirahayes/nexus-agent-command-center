import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusBadge, LoadingState, ErrorState } from "@/components/nexus/bits";
import { useTask } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/tasks/$id")({
  head: () => ({ meta: [{ title: "Task — Nexus AI" }] }),
  component: TaskPage,
});

function TaskPage() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useTask(id);
  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState error={error} />;
  return <div><PageHeader title={data.title} description={data.instructions} /><StatusBadge status={data.status} /></div>;
}
