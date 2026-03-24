import { describe, it, expect, vi } from 'vitest';
import { AgentOrchestrator } from '../../src/agent/orchestrator.js';

describe('AgentOrchestrator', () => {
  it('should create orchestrator with default config', () => {
    const agent = new AgentOrchestrator();
    expect(agent).toBeDefined();
    expect(agent.getHistory()).toEqual([]);
  });

  it('should accept partial config', () => {
    const agent = new AgentOrchestrator({ maxIterations: 5 });
    expect(agent).toBeDefined();
  });

  it('should add user message to history', async () => {
    const agent = new AgentOrchestrator();

    // Mock the model adapter to avoid real API calls
    const mockAdapter = {
      streamChat: vi.fn(async function*() {
        yield { type: 'text' as const, content: 'Hello!' };
        yield { type: 'done' as const };
      }),
    };

    // Patch the registry
    (agent as unknown as Record<string, unknown>)['registry'] = {
      getAdapter: () => mockAdapter,
    };

    const events: string[] = [];
    for await (const event of agent.run('Say hello')) {
      events.push(event.type);
    }

    expect(events).toContain('text');
    expect(events).toContain('done');
    expect(agent.getHistory().length).toBeGreaterThan(0);
  });

  it('should clear history', () => {
    const agent = new AgentOrchestrator();
    agent.clearHistory();
    expect(agent.getHistory()).toEqual([]);
  });
});
