import { describe, expect, it } from 'vitest';
import { AgentOrchestrator } from '../../src/agent/orchestrator.js';

describe('AgentOrchestrator', () => {
  it('echoes latest user text message and returns execution artifacts', async () => {
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.run({
      messages: [{ role: 'user', content: 'hola' }],
    });

    expect(result.output).toBe('hola');
    expect(result.events.at(0)?.type).toBe('text');
    expect(result.plan).toHaveLength(3);
    expect(result.trimmedMessages).toBe(0);
    expect(result.sessionId.length).toBeGreaterThan(0);
  });

  it('trims old messages using context manager', async () => {
    const orchestrator = new AgentOrchestrator();
    const messages = Array.from({ length: 25 }, (_, index) => ({
      role: 'user' as const,
      content: `m-${index}`,
    }));

    const result = await orchestrator.run({ messages });
    expect(result.trimmedMessages).toBe(5);
    expect(result.output).toBe('m-24');
  });
});
