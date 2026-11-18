// Provider catalogue. Connection availability is checked server-side; never put credentials here.
export type ConnectionMethod = "vercel_gateway" | "api_key" | "oauth" | "browser_limited" | "unavailable";

export interface ProviderInfo {
  key: string;
  name: string;
  vendor: string;
  methods: ConnectionMethod[];
  gatewaySupported: boolean;
  secretName: string | null;
  capabilities: string[];
  models: string[];
  docsUrl: string;
  note: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    key: "openai",
    name: "OpenAI",
    vendor: "OpenAI",
    methods: ["vercel_gateway", "api_key"],
    gatewaySupported: true,
    secretName: null,
    capabilities: ["Chat", "Tools", "Vision", "Reasoning"],
    models: ["gpt-5", "gpt-5-mini"],
    docsUrl: "https://platform.openai.com/docs",
    note: "Available through Vercel AI Gateway using your Vercel deployment identity. This does not use a ChatGPT consumer subscription; Gateway usage is billed through Vercel.",
  },
  {
    key: "anthropic",
    name: "Anthropic Claude",
    vendor: "Anthropic",
    methods: ["vercel_gateway", "api_key"],
    gatewaySupported: true,
    secretName: null,
    capabilities: ["Chat", "Tools", "Long context", "Vision"],
    models: ["claude-sonnet-4.6", "claude-sonnet-4.5"],
    docsUrl: "https://docs.anthropic.com/",
    note: "Available through Vercel AI Gateway. Claude.ai consumer plans are not used for inference. Direct Anthropic API and linked-billing OAuth are separate integrations.",
  },
  {
    key: "gemini",
    name: "Google Gemini",
    vendor: "Google",
    methods: ["vercel_gateway", "oauth", "api_key"],
    gatewaySupported: true,
    secretName: null,
    capabilities: ["Chat", "Multimodal", "Long context"],
    models: ["gemini-2.5-pro", "gemini-2.5-flash"],
    docsUrl: "https://ai.google.dev/gemini-api/docs",
    note: "Available through Vercel AI Gateway now. A separate Google-account OAuth connection can be added for Gemini API access; signing into Google for Nexus itself is not that permission.",
  },
  {
    key: "copilot",
    name: "Microsoft Copilot",
    vendor: "Microsoft",
    methods: ["unavailable"],
    gatewaySupported: false,
    secretName: null,
    capabilities: ["Chat"],
    models: [],
    docsUrl: "https://learn.microsoft.com/azure/ai-services/openai/",
    note: "Consumer Copilot has no public model API. Use Azure OpenAI through a custom endpoint instead.",
  },
  {
    key: "xai",
    name: "xAI Grok",
    vendor: "xAI",
    methods: ["vercel_gateway", "api_key"],
    gatewaySupported: true,
    secretName: null,
    capabilities: ["Chat", "Reasoning", "Tools"],
    models: ["grok-4.20-non-reasoning", "grok-4.20-multi-agent"],
    docsUrl: "https://docs.x.ai/",
    note: "Available through Vercel AI Gateway. X Premium subscriptions are not used for model inference.",
  },
  {
    key: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity",
    methods: ["api_key"],
    gatewaySupported: false,
    secretName: "PERPLEXITY_API_KEY",
    capabilities: ["Web search", "Citations"],
    models: ["sonar", "sonar-pro"],
    docsUrl: "https://docs.perplexity.ai/",
    note: "Requires Perplexity API access. A Perplexity consumer sign-in is not an API credential; the direct adapter is not implemented yet.",
  },
  {
    key: "deepseek",
    name: "DeepSeek",
    vendor: "DeepSeek",
    methods: ["api_key"],
    gatewaySupported: false,
    secretName: "DEEPSEEK_API_KEY",
    capabilities: ["Chat", "Reasoning", "Code"],
    models: ["deepseek-chat", "deepseek-reasoner"],
    docsUrl: "https://api-docs.deepseek.com/",
    note: "Requires a DeepSeek API key. The direct adapter is not implemented yet.",
  },
  {
    key: "mistral",
    name: "Mistral",
    vendor: "Mistral AI",
    methods: ["vercel_gateway", "api_key"],
    gatewaySupported: true,
    secretName: null,
    capabilities: ["Chat", "Code", "Reasoning"],
    models: ["mistral-large-4", "mistral-large-3"],
    docsUrl: "https://docs.mistral.ai/",
    note: "Available through Vercel AI Gateway using your Vercel deployment identity.",
  },
  {
    key: "custom",
    name: "Custom OpenAI-compatible",
    vendor: "Self-hosted / Azure / Ollama",
    methods: ["api_key"],
    gatewaySupported: false,
    secretName: "CUSTOM_LLM_API_KEY",
    capabilities: ["Chat", "Configurable"],
    models: ["(set by endpoint)"],
    docsUrl: "https://platform.openai.com/docs/api-reference",
    note: "Custom endpoints require their own server-side endpoint and credentials. Direct custom-endpoint execution is not implemented yet.",
  },
];

export const providerByKey = (k: string) => PROVIDERS.find((p) => p.key === k);
