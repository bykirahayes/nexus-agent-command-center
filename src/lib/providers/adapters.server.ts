// Server-only adapter stubs. Secrets are read from process.env inside calls and never returned or logged.
import { PROVIDERS } from "./catalog";
import { NotConfiguredError, type ProviderAdapter } from "./adapter";

function stub(key: string, secretName: string | null): ProviderAdapter {
  return {
    key,
    isConfigured: () => !!secretName && !!process.env[secretName],
    async complete() {
      if (!secretName || !process.env[secretName]) throw new NotConfiguredError(key);
      // Live model calls are intentionally not implemented in this first pass.
      throw new Error(`Live calls for "${key}" are not implemented yet (adapter stub).`);
    },
  };
}

export const adapters: Record<string, ProviderAdapter> = Object.fromEntries(
  PROVIDERS.map((p) => [p.key, stub(p.key, p.secretName)]),
);
