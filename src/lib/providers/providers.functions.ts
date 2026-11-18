import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Returns only booleans: whether each provider's secret exists server-side. Never the value.
export const getProviderSecretStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { adapters } = await import("./adapters.server");
    return Object.fromEntries(Object.values(adapters).map((a) => [a.key, a.isConfigured()]));
  });
