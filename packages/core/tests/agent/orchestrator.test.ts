import { describe, expect, it } from 'vitest';
import { AgentOrchestrator } from '../../src/agent/orchestrator.js';

describe('AgentOrchestrator', () => {
  it('echoes latest user text message', async () => {
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.run({
      messages: [{ role: 'user', content: 'hola' }],
    });

    expect(result.output).toBe('hola');
    expect(result.sessionId.length).toBeGreaterThan(0);
  });
});
