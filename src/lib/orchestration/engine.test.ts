import { describe, expect, it, vi } from "vitest";
import type { ProviderAdapter } from "../providers/adapter";
import { orchestrateTask, type AgentConfig, type OrchestrationTask } from "./engine";

function mockAdapter(key: string): ProviderAdapter {
  return {
    key,
    isConfigured: () => true,
    complete: vi.fn(async ({ model }) => ({ model, text: `response from ${key}` })),
  };
}

const agents: AgentConfig[] = [
  { id: "a1", name: "Alpha", providerKey: "alpha", model: "alpha-model" },
  { id: "a2", name: "Beta", providerKey: "beta", model: "beta-model" },
];

const baseTask: OrchestrationTask = {
  title: "Compare approaches",
  instructions: "Research the best approach and explain trade-offs.",
  mode: "parallel",
  agents,
};

describe("orchestrateTask", () => {
  it("runs independent agents in parallel mode", async () => {
    const adapters = { alpha: mockAdapter("alpha"), beta: mockAdapter("beta") };
    const result = await orchestrateTask(baseTask, adapters);
    expect(result.status).toBe("completed");
    expect(result.runs).toHaveLength(2);
    expect(result.runs.map((run) => run.status)).toEqual(["completed", "completed"]);
  });

  it("passes earlier output to later agents in sequential mode", async () => {
    const alpha = mockAdapter("alpha");
    const beta = mockAdapter("beta");
    const result = await orchestrateTask({ ...baseTask, mode: "sequential" }, { alpha, beta });
    expect(result.runs).toHaveLength(2);
    expect(beta.complete).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ content: expect.stringContaining("response from alpha") }),
        ]),
      }),
    );
  });

  it("uses the first agent as lead and returns a final synthesis", async () => {
    const adapters = { alpha: mockAdapter("alpha"), beta: mockAdapter("beta") };
    const result = await orchestrateTask({ ...baseTask, mode: "lead_reviewers" }, adapters);
    expect(result.status).toBe("completed");
    expect(result.synthesisAgentId).toBe("a1");
    expect(result.synthesis).toContain("response from alpha");
    expect(result.runs).toHaveLength(3);
  });

  it("rejects tasks without agents", async () => {
    await expect(orchestrateTask({ ...baseTask, agents: [] }, {})).rejects.toThrow(
      "Select at least one agent",
    );
  });

  it("reports partial success when a provider fails", async () => {
    const failing: ProviderAdapter = {
      key: "beta",
      isConfigured: () => true,
      complete: async () => {
        throw new Error("Provider unavailable");
      },
    };
    const result = await orchestrateTask(baseTask, {
      alpha: mockAdapter("alpha"),
      beta: failing,
    });
    expect(result.status).toBe("partial");
    expect(result.runs.find((run) => run.agentId === "a2")?.error).toBe("Provider unavailable");
  });
});
