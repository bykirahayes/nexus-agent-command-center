import { createFileRoute, Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Nexus AI — Multi-AI command centre" }, { name: "description", content: "Connect AI providers, assign work and let agents collaborate with approval gates." }, { property: "og:title", content: "Nexus AI — Multi-AI command centre" }, { property: "og:description", content: "Connect AI providers, assign work and let agents collaborate with approval gates." }] }),
  component: () => (
    <div className="surface-grid flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Hexagon className="size-10 text-primary" />
      <h1 className="text-4xl font-semibold tracking-tight">Nexus AI</h1>
      <p className="max-w-md text-muted-foreground">Your personal command centre for multiple AI agents — with honest capability limits and approval gates.</p>
      <Button asChild className="shadow-glow"><Link to="/overview">Open command centre</Link></Button>
    </div>
  ),
});
