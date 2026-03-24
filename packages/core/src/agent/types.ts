export interface AgentEvent {
  type: 'text' | 'tool_call' | 'tool_result' | 'done' | 'error' | 'iteration';
  content?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: string;
  iteration?: number;
  error?: string;
}

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'done' | 'error';
  result?: string;
}
