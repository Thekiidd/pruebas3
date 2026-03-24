import { randomUUID } from 'node:crypto';
import type { AgentRunInput, AgentRunResult } from './types.js';

export class AgentOrchestrator {
  async run(input: AgentRunInput): Promise<AgentRunResult> {
    const lastUserMessage = [...input.messages].reverse().find((m) => m.role === 'user');

    return {
      sessionId: input.sessionId ?? randomUUID(),
      output: typeof lastUserMessage?.content === 'string' ? lastUserMessage.content : 'Sin contenido de texto.',
    };
  }
}
