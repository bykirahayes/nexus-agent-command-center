import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/nexus/app-shell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { email: data.user.email ?? "user" };
  },
  component: Layout,
});

function Layout() {
  const { email } = Route.useRouteContext();
  return <AppShell email={email}><Outlet /></AppShell>;
}
