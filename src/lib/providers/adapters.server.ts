// Server-only provider adapters. Vercel AI Gateway uses the deployment OIDC token
// automatically; a manually-created AI_GATEWAY_API_KEY is only needed outside Vercel.
import { PROVIDERS } from "./catalog";
import { NotConfiguredError, type CompletionResult, type ProviderAdapter } from "./adapter";

const GATEWAY_MODEL_DEFAULTS: Record<string, string> = {
  openai: "openai/gpt-5",
  anthropic: "anthropic/claude-sonnet-4.6",
  gemini: "google/gemini-2.5-pro",
  xai: "spacexai/grok-4.20-non-reasoning",
  mistral: "mistral/mistral-large-4",
};

const GATEWAY_MODEL_ALIASES: Record<string, Record<string, string>> = {
  openai: {
    "gpt-5": "openai/gpt-5",
    "gpt-5-mini": "openai/gpt-5-mini",
  },
  anthropic: {
    "claude-sonnet": "anthropic/claude-sonnet-4.6",
    "claude-sonnet-4.5": "anthropic/claude-sonnet-4.5",
    "claude-sonnet-4.6": "anthropic/claude-sonnet-4.6",
  },
  gemini: {
    "gemini-2.5-pro": "google/gemini-2.5-pro",
    "gemini-2.5-flash": "google/gemini-2.5-flash",
  },
  xai: {
    "grok-4": "spacexai/grok-4.20-non-reasoning",
    "grok-4.20-non-reasoning": "spacexai/grok-4.20-non-reasoning",
    "grok-4.20-multi-agent": "spacexai/grok-4.20-multi-agent",
  },
  mistral: {
    "mistral-large": "mistral/mistral-large-4",
    "mistral-large-3": "mistral/mistral-large-3",
    "mistral-large-4": "mistral/mistral-large-4",
  },
};

type GatewayResponse = {
  model?: string;
  choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    input_tokens?: number;
    output_tokens?: number;
  };
  error?: { message?: string };
};

function gatewayCredential(): string | undefined {
  return process.env["AI_GATEWAY_API_KEY"] || process.env["VERCEL_OIDC_TOKEN"];
}

function resolveGatewayModel(providerKey: string, requestedModel: string): string {
  if (requestedModel.includes("/")) return requestedModel;
  return GATEWAY_MODEL_ALIASES[providerKey]?.[requestedModel] ?? GATEWAY_MODEL_DEFAULTS[providerKey] ?? requestedModel;
}

function extractText(content: GatewayResponse["choices"] extends Array<infer T> ? T extends { message?: infer M } ? M extends { content?: infer C } ? C : never : never : never): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((part) => part && typeof part.text === "string")
      .map((part) => part.text)
      .join("");
  }
  return "";
}

function gatewayAdapter(key: string): ProviderAdapter {
  const provider = PROVIDERS.find((item) => item.key === key);
  const gatewaySupported = provider?.gatewaySupported === true;

  return {
    key,
    isConfigured: () => gatewaySupported && Boolean(gatewayCredential()),
    async complete(input) {
      const credential = gatewayCredential();
      if (!gatewaySupported || !credential) throw new NotConfiguredError(key);

      const model = resolveGatewayModel(key, input.model);
      const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${credential}\`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: input.messages,
          stream: false,
        }),
        signal: AbortSignal.timeout(120_000),
      });

      const payload = (await response.json().catch(() => null)) as GatewayResponse | null;
      if (!response.ok) {
        const detail = payload?.error?.message || response.statusText || "Unknown gateway error";
        throw new Error(\`Vercel AI Gateway request failed (\${response.status}): \${detail}\`);
      }

      const content = extractText(payload?.choices?.[0]?.message?.content);
      if (!content) throw new Error("Vercel AI Gateway returned an empty or unsupported response.");

      const usage = payload?.usage;
      const result: CompletionResult = {
        text: content,
        model: payload?.model || model,
        ...(usage
          ? {
              usage: {
                input: usage.prompt_tokens ?? usage.input_tokens ?? 0,
                output: usage.completion_tokens ?? usage.output_tokens ?? 0,
              },
            }
          : {}),
      };
      return result;
    },
  };
}

export const adapters: Record<string, ProviderAdapter> = Object.fromEntries(
  PROVIDERS.map((provider) => [provider.key, gatewayAdapter(provider.key)]),
);
