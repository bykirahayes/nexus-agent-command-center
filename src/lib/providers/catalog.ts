// Provider catalog: static metadata only. No secrets ever live here.
export type ConnectionMethod = "api_key" | "oauth" | "browser_limited" | "unavailable";

export interface ProviderInfo {
  key: string;
  name: string;
  vendor: string;
  methods: ConnectionMethod[];
  secretName: string | null; // env/secret name looked up server-side
  capabilities: string[];
  models: string[];
  docsUrl: string;
  note: string;
}

export const PROVIDERS: ProviderInfo[] = [
  { key: "openai", name: "OpenAI", vendor: "OpenAI", methods: ["api_key"], secretName: "OPENAI_API_KEY", capabilities: ["Chat", "Tools", "Vision", "Reasoning"], models: ["gpt-5", "gpt-5-mini", "o-series"], docsUrl: "https://platform.openai.com/api-keys", note: "ChatGPT Free/Plus subscriptions do not include API access. API usage is billed separately." },
  { key: "anthropic", name: "Anthropic Claude", vendor: "Anthropic", methods: ["api_key"], secretName: "ANTHROPIC_API_KEY", capabilities: ["Chat", "Tools", "Long context", "Vision"], models: ["claude-opus", "claude-sonnet", "claude-haiku"], docsUrl: "https://console.anthropic.com/settings/keys", note: "Claude.ai Free/Pro plans do not include API credits." },
  { key: "gemini", name: "Google Gemini", vendor: "Google", methods: ["api_key"], secretName: "GEMINI_API_KEY", capabilities: ["Chat", "Multimodal", "Long context", "Free tier"], models: ["gemini-2.5-pro", "gemini-2.5-flash"], docsUrl: "https://aistudio.google.com/apikey", note: "Google AI Studio offers a rate-limited free API tier, subject to Google's terms." },
  { key: "copilot", name: "Microsoft Copilot", vendor: "Microsoft", methods: ["unavailable"], secretName: null, capabilities: ["Chat"], models: [], docsUrl: "https://learn.microsoft.com/azure/ai-services/openai/", note: "Consumer Copilot has no public API. Use Azure OpenAI via the custom endpoint instead." },
  { key: "xai", name: "xAI Grok", vendor: "xAI", methods: ["api_key"], secretName: "XAI_API_KEY", capabilities: ["Chat", "Realtime search", "Tools"], models: ["grok-4", "grok-3-mini"], docsUrl: "https://console.x.ai", note: "X Premium subscriptions do not include API access." },
  { key: "perplexity", name: "Perplexity", vendor: "Perplexity", methods: ["api_key"], secretName: "PERPLEXITY_API_KEY", capabilities: ["Web search", "Citations"], models: ["sonar", "sonar-pro"], docsUrl: "https://www.perplexity.ai/settings/api", note: "Perplexity Pro includes limited monthly API credit; free accounts do not." },
  { key: "deepseek", name: "DeepSeek", vendor: "DeepSeek", methods: ["api_key"], secretName: "DEEPSEEK_API_KEY", capabilities: ["Chat", "Reasoning", "Code"], models: ["deepseek-chat", "deepseek-reasoner"], docsUrl: "https://platform.deepseek.com/api_keys", note: "Pay-as-you-go API, separate from the free chat app." },
  { key: "mistral", name: "Mistral", vendor: "Mistral AI", methods: ["api_key"], secretName: "MISTRAL_API_KEY", capabilities: ["Chat", "Code", "Free tier"], models: ["mistral-large", "codestral", "mistral-small"], docsUrl: "https://console.mistral.ai/api-keys", note: "La Plateforme offers an experimental free tier with rate limits." },
  { key: "custom", name: "Custom OpenAI-compatible", vendor: "Self-hosted / Azure / Ollama", methods: ["api_key"], secretName: "CUSTOM_LLM_API_KEY", capabilities: ["Chat", "Configurable"], models: ["(set by endpoint)"], docsUrl: "https://platform.openai.com/docs/api-reference", note: "Any endpoint implementing the OpenAI chat completions API. Base URL secret: CUSTOM_LLM_BASE_URL." },
];

export const providerByKey = (k: string) => PROVIDERS.find((p) => p.key === k);
