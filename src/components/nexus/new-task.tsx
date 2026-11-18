import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { MODES, logAudit, useAgents, useInvalidate } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

const Ctx = createContext<(prefill?: string) => void>(() => {});
export const useNewTask = () => useContext(Ctx);

export function NewTaskProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState("");
  return (
    <Ctx.Provider value={(p) => { setPrefill(p ?? ""); setOpen(true); }}>
      {children}
      {open && <NewTaskDialog prefill={prefill} onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}

function NewTaskDialog({ prefill, onClose }: { prefill: string; onClose: () => void }) {
  const { data: agents = [] } = useAgents();
  const [title, setTitle] = useState(prefill);
  const [instructions, setInstructions] = useState("");
  const [url, setUrl] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [mode, setMode] = useState("parallel");
  const [risk, setRisk] = useState("low");
  const [busy, setBusy] = useState(false);
  const inv = useInvalidate();
  const navigate = useNavigate();

  async function submit(asDraft: boolean) {
    if (!title.trim()) { toast.error("Give the task a title"); return; }
    if (!asDraft && picked.length === 0) { toast.error("Choose at least one agent"); return; }
    if (url && !/^https?:\/\//.test(url)) { toast.error("URL must start with http:// or https://"); return; }
    setBusy(true);
    const { data, error } = await supabase.from("tasks").insert({
      title: title.trim().slice(0, 200), instructions: instructions.slice(0, 5000), target_url: url || null,
      agent_ids: picked, mode, risk, status: asDraft ? "draft" : "queued",
    }).select().single();
    setBusy(false);
    if (error || !data) { toast.error(error?.message ?? "Could not create task"); return; }
    await logAudit("task", asDraft ? "draft_saved" : "queued", data.title);
    inv("tasks", "audit");
    toast.success(asDraft ? "Saved as draft" : "Task queued — execution waits for a configured provider");
    onClose();
    navigate({ to: "/tasks/$id", params: { id: data.id } });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>Brief your agents. Side effects always pause for your approval.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Audit our pricing page" maxLength={200} /></div>
          <div className="grid gap-1.5"><Label>Instructions</Label><Textarea rows={4} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="What should the agents do? What does a good result look like?" /></div>
          <div className="grid gap-1.5"><Label>Target website (optional)</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" /></div>
          <div className="grid gap-1.5">
            <Label>Agents</Label>
            <div className="flex flex-wrap gap-2">
              {agents.map((a) => {
                const on = picked.includes(a.id);
                return (
                  <button key={a.id} type="button" onClick={() => setPicked(on ? picked.filter((x) => x !== a.id) : [...picked, a.id])}
                    className={cn("rounded-lg border px-3 py-1.5 text-xs transition", on ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                    {a.name} <span className="opacity-60">· {a.provider_key}</span>
                  </button>
                );
              })}
              {agents.length === 0 && <p className="text-xs text-muted-foreground">No agents yet — create one on the AI Agents page.</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Collaboration mode</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(MODES).map(([k, v]) => (
                  <button key={k} type="button" onClick={() => setMode(k)} className={cn("rounded-md border px-2 py-1.5 text-left text-xs", mode === k ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground")}>{v}</button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Risk level</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {["low", "medium", "high"].map((r) => (
                  <button key={r} type="button" onClick={() => setRisk(r)} className={cn("rounded-md border px-2 py-1.5 text-xs capitalize", risk === r ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground")}>{r}</button>
                ))}
              </div>
              <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground"><ShieldAlert className="mt-px size-3 shrink-0" />Forms, publishing, messages, purchases, deletions, settings and deploys always need approval.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" disabled={busy} onClick={() => submit(true)}>Save draft</Button>
          <Button disabled={busy} onClick={() => submit(false)}>Queue task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
