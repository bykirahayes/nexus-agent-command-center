import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "@/components/nexus/bits";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({ meta: [{ title: "Projects — Nexus AI" }] }),
  component: () => <div className="space-y-6"><PageHeader title="Projects" description="Group tasks, agents and workflows around a shared objective." /><Panel><EmptyState title="Project management is not implemented yet" hint="The current data model does not include a projects table. No sample projects are presented as real records." /></Panel></div>,
});
