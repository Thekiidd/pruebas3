import type { StreamChunk } from '../models/base.js';
import type { PlanStep } from './planner.js';

export interface ExecutionResult {
  output: string;
  events: StreamChunk[];
  plan: PlanStep[];
}

export class AgentExecutor {
  async execute(plan: PlanStep[], output: string): Promise<ExecutionResult> {
    const completedPlan = plan.map((step) => ({
      ...step,
      status: step.status === 'pending' || step.status === 'in_progress' ? 'completed' : step.status,
    }));

    return {
      output,
      plan: completedPlan,
      events: [
        { type: 'text', content: output },
        { type: 'done' },
      ],
    };
  }
}
