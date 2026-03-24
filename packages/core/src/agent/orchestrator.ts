import { randomUUID } from 'node:crypto';
import { ContextManager } from './context-manager.js';
import { AgentExecutor } from './executor.js';
import { AgentPlanner } from './planner.js';
import type { AgentRunInput, AgentRunResult } from './types.js';

export class AgentOrchestrator {
  private readonly planner = new AgentPlanner();
  private readonly executor = new AgentExecutor();
  private readonly contextManager = new ContextManager();

  async run(input: AgentRunInput): Promise<AgentRunResult> {
    const { selectedMessages } = this.contextManager.trim(input.messages);
    const lastUserMessage = [...selectedMessages].reverse().find((m) => m.role === 'user');
    const output = typeof lastUserMessage?.content === 'string' ? lastUserMessage.content : 'Sin contenido de texto.';

    const plan = this.planner.createPlan(selectedMessages);
    const execution = await this.executor.execute(plan, output);

    return {
      sessionId: input.sessionId ?? randomUUID(),
      output: execution.output,
      events: execution.events,
      plan: execution.plan,
      trimmedMessages: input.messages.length - selectedMessages.length,
    };
  }
}
