import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type TaskStatus } from "@/lib/data";
import { Loader2, AlertTriangle, Inbox } from "lucide-react";

const tone: Record<TaskStatus, string> = {
  draft: "text-muted-foreground border-border",
  queued: "text-info border-info/30 bg-info/10",
  running: "text-primary border-primary/30 bg-primary/10",
  needs_approval: "text-warning border-warning/30 bg-warning/10",
  completed: "text-success border-success/20 bg-success/5",
  failed: "text-destructive border-destructive/30 bg-destructive/10",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", tone[status])}>
      <span className={cn("size-1.5 rounded-full bg-current", status === "running" && "pulse-dot")} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground", className)}>{children}</span>;
}

export function DemoTag() {
  return <Pill className="border-warning/30 bg-warning/10 text-warning">Simulated</Pill>;
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function LoadingState() {
  return <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading…</div>;
}
export function ErrorState({ error }: { error: unknown }) {
  return <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertTriangle className="size-4" />{error instanceof Error ? error.message : "Something went wrong"}</div>;
}
export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-8 text-center">
      <Inbox className="size-5 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="max-w-sm text-xs text-muted-foreground">{hint}</p>}
      {action}
    </div>
  );
}
