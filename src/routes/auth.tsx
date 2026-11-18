import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Hexagon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Nexus AI" }, { name: "description", content: "Sign in to your Nexus AI command centre." }, { property: "og:title", content: "Sign in — Nexus AI" }, { property: "og:description", content: "Sign in to your Nexus AI command centre." }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false); if (error) { toast.error(error.message); return; }
      navigate({ to: "/overview" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: `${window.location.origin}/overview` } });
      setBusy(false); if (error) { toast.error(error.message); return; }
      toast.success("Check your email to confirm your account.");
    }
  }
  async function google() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/overview` },
    });
    setBusy(false);
    if (error) toast.error(error.message);
  }
  return (
    <div className="surface-grid flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-glow">
        <div className="mb-6 flex items-center gap-2"><Hexagon className="size-5 text-primary" /><span className="font-semibold">Nexus AI</span></div>
        <form onSubmit={submit} className="grid gap-3">
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" required minLength={8} placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <Button disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
        </form>
        <Button variant="outline" className="mt-3 w-full" onClick={google}>Continue with Google</Button>
        <button className="mt-4 w-full text-xs text-muted-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}</button>
      </div>
    </div>
  );
}
