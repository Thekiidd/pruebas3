import type { Message } from '../models/base.js';

export interface AgentRunInput {
  messages: Message[];
  sessionId?: string;
}

export interface AgentRunResult {
  sessionId: string;
  output: string;
}
