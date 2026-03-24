import type { Message } from '../models/base.js';

export interface PlanStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export class AgentPlanner {
  createPlan(messages: Message[]): PlanStep[] {
    const lastUser = [...messages].reverse().find((message) => message.role === 'user');
    const title = typeof lastUser?.content === 'string' && lastUser.content.trim().length > 0
      ? `Resolver: ${lastUser.content.trim().slice(0, 60)}`
      : 'Resolver solicitud del usuario';

    return [
      { id: 'analyze', title: 'Analizar requerimiento', status: 'completed' },
      { id: 'execute', title, status: 'in_progress' },
      { id: 'validate', title: 'Validar resultados', status: 'pending' },
    ];
  }
}
