import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Exposes readiness only. Tokens themselves are never returned to the browser.
export const getProviderSecretStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { adapters } = await import("./adapters.server");
    const gatewayAvailable = Boolean(
      process.env["AI_GATEWAY_API_KEY"] || process.env["VERCEL_OIDC_TOKEN"],
    );

    return {
      gateway: gatewayAvailable,
      providers: Object.fromEntries(
        Object.values(adapters).map((adapter) => [adapter.key, adapter.isConfigured()]),
      ),
    };
  });
