import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Bot, Workflow, Globe, FolderKanban, Activity, Plug, Settings, Bell, Plus, Search, LogOut, Hexagon, PanelLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApprovals } from "@/lib/data";
import { NewTaskProvider, useNewTask } from "./new-task";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/agents", label: "AI Agents", icon: Bot },
  { to: "/workflows", label: "Workflows", icon: Workflow },
  { to: "/browser", label: "Browser Sessions", icon: Globe },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ email, children }: { email: string; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <NewTaskProvider>
      <div className="flex min-h-screen w-full">
        <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] md:flex", collapsed ? "w-14" : "w-60")}>
          <div className="flex h-14 items-center gap-2 px-4">
            <Hexagon className="size-5 shrink-0 text-primary" />
            {!collapsed && <span className="font-semibold tracking-tight">Nexus AI</span>}
          </div>
          <nav className="flex-1 space-y-0.5 px-2 py-2">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = path === to || path.startsWith(to + "/");
              return (
                <Link key={to} to={to} title={label}
                  className={cn("flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground")}>
                  <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
                  {!collapsed && label}
                </Link>
              );
            })}
          </nav>
          <button onClick={() => setCollapsed(!collapsed)} className="m-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent" aria-label="Toggle sidebar">
            <PanelLeft className="size-4" />{!collapsed && "Collapse"}
          </button>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar email={email} />
          <nav className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
            {NAV.map(({ to, label }) => (
              <Link key={to} to={to} className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs text-muted-foreground" activeProps={{ className: "bg-accent text-foreground" }}>{label}</Link>
            ))}
          </nav>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </NewTaskProvider>
  );
}

function TopBar({ email }: { email: string }) {
  const openTask = useNewTask();
  const [q, setQ] = useState("");
  const { data: approvals = [] } = useApprovals();
  const pending = approvals.filter((a) => a.status === "pending");
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs sm:flex"><span className="size-2 rounded-full bg-primary" />Personal workspace</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start"><DropdownMenuLabel>Workspaces</DropdownMenuLabel><DropdownMenuItem>Personal workspace</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>
      <form className="relative flex-1" onSubmit={(e) => { e.preventDefault(); openTask(q); setQ(""); }}>
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Describe a task for your agents and press Enter…"
          className="h-9 w-full max-w-xl rounded-md border border-input bg-secondary/50 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40" />
      </form>
      <Button size="sm" onClick={() => openTask()} className="shadow-glow"><Plus />New task</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative rounded-md p-2 text-muted-foreground hover:text-foreground" aria-label="Notifications">
            <Bell className="size-4" />
            {pending.length > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-warning" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Approvals waiting</DropdownMenuLabel>
          {pending.length === 0 && <div className="px-2 py-3 text-xs text-muted-foreground">Nothing needs your attention.</div>}
          {pending.map((a) => (
            <DropdownMenuItem key={a.id} onClick={() => a.task_id && navigate({ to: "/tasks/$id", params: { id: a.task_id } })}>
              <span className="text-xs"><span className="text-warning uppercase">{a.action_type}</span> · {a.summary}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-medium uppercase">{email[0]}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}><Settings />Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}><LogOut />Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
