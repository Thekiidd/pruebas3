import { Message, ModelConfig } from '../models/base.js';
import { AgentTask } from './types.js';

/**
 * Planner breaks down a high-level user request into discrete subtasks.
 * In a full implementation this would call the LLM to decompose the goal.
 */
export class Planner {
  decomposeTask(userMessage: string): AgentTask[] {
    // Simple single-task plan — LLM-based decomposition would go here
    return [
      {
        id: crypto.randomUUID(),
        description: userMessage,
        status: 'pending',
      },
    ];
  }

  buildSystemPrompt(tasks: AgentTask[], _config: ModelConfig): string {
    const taskList = tasks.map((t, i) => `${i + 1}. ${t.description}`).join('\n');
    return `You are OpenDev, an expert AI coding agent. Your tasks:\n${taskList}`;
  }

  estimateComplexity(messages: Message[]): 'simple' | 'medium' | 'complex' {
    const totalLength = messages.reduce((acc, m) =>
      acc + (typeof m.content === 'string' ? m.content.length : 0), 0);

    if (totalLength < 1000) return 'simple';
    if (totalLength < 5000) return 'medium';
    return 'complex';
  }
}
