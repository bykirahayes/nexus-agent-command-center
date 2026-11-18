import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type T = Database["public"]["Tables"];
export type Agent = T["agents"]["Row"];
export type Task = T["tasks"]["Row"];
export type TaskMessage = T["task_messages"]["Row"];
export type Workflow = T["workflows"]["Row"];
export type Approval = T["approvals"]["Row"];
export type AuditEvent = T["audit_events"]["Row"];
export type Provider = T["providers"]["Row"];
export type BrowserSession = T["browser_sessions"]["Row"];
export type Permission = T["permissions"]["Row"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];

async function q<R>(p: PromiseLike<{ data: R | null; error: { message: string } | null }>): Promise<R> {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data as R;
}

export const useAgents = () =>
  useQuery({ queryKey: ["agents"], queryFn: () => q<Agent[]>(supabase.from("agents").select("*").order("created_at")) });
export const useTasks = () =>
  useQuery({ queryKey: ["tasks"], queryFn: () => q<Task[]>(supabase.from("tasks").select("*").order("created_at", { ascending: false })) });
export const useTask = (id: string) =>
  useQuery({ queryKey: ["task", id], queryFn: () => q<Task>(supabase.from("tasks").select("*").eq("id", id).single()) });
export const useTaskMessages = (id: string) =>
  useQuery({ queryKey: ["task_messages", id], queryFn: () => q<TaskMessage[]>(supabase.from("task_messages").select("*").eq("task_id", id).order("created_at")) });
export const useWorkflows = () =>
  useQuery({ queryKey: ["workflows"], queryFn: () => q<Workflow[]>(supabase.from("workflows").select("*").order("created_at")) });
export const useApprovals = () =>
  useQuery({ queryKey: ["approvals"], queryFn: () => q<Approval[]>(supabase.from("approvals").select("*").order("created_at", { ascending: false })) });
export const useAudit = () =>
  useQuery({ queryKey: ["audit"], queryFn: () => q<AuditEvent[]>(supabase.from("audit_events").select("*").order("created_at", { ascending: false }).limit(200)) });
export const useProviders = () =>
  useQuery({ queryKey: ["providers"], queryFn: () => q<Provider[]>(supabase.from("providers").select("*")) });
export const useBrowserSessions = () =>
  useQuery({ queryKey: ["browser_sessions"], queryFn: () => q<BrowserSession[]>(supabase.from("browser_sessions").select("*").order("created_at", { ascending: false })) });
export const usePermissions = () =>
  useQuery({ queryKey: ["permissions"], queryFn: () => q<Permission[]>(supabase.from("permissions").select("*").order("domain")) });

export async function logAudit(category: string, action: string, detail?: string) {
  await supabase.from("audit_events").insert({ category, action, detail: detail ?? null });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: string[]) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

export function useDecideApproval() {
  const inv = useInvalidate();
  return useMutation({
    mutationFn: async ({ a, decision }: { a: Approval; decision: "approved" | "rejected" }) => {
      await q(supabase.from("approvals").update({ status: decision, decided_at: new Date().toISOString() }).eq("id", a.id).select());
      if (a.task_id) {
        await q(supabase.from("tasks").update({ status: decision === "approved" ? "queued" : "failed", updated_at: new Date().toISOString() }).eq("id", a.task_id).select());
      }
      await logAudit("approval", decision, a.summary);
    },
    onSuccess: () => inv("approvals", "tasks", "task", "audit"),
  });
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "Draft", queued: "Queued", running: "Running", needs_approval: "Needs approval", completed: "Completed", failed: "Failed",
};
export const MODES: Record<string, string> = {
  parallel: "Parallel research", sequential: "Sequential hand-off", debate: "Debate / review", lead_reviewers: "Lead + reviewers",
};
export const timeAgo = (d: string) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
