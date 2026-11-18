// Provider adapter abstraction. Orchestration only depends on this interface,
// so new providers are added by registering an adapter, not by rewriting orchestration.
export interface ChatMessage { role: "system" | "user" | "assistant"; content: string }
export interface CompletionResult { text: string; model: string; usage?: { input: number; output: number } }

export interface ProviderAdapter {
  key: string;
  isConfigured(): boolean;
  complete(input: { model: string; messages: ChatMessage[] }): Promise<CompletionResult>;
}

export class NotConfiguredError extends Error {
  constructor(provider: string) {
    super(`Provider "${provider}" is not configured. Add its API key in project secrets.`);
  }
}
