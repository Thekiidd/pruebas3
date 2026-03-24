import type { Message, StreamChunk } from '../models/base.js';
import type { PlanStep } from './planner.js';

export interface AgentRunInput {
  messages: Message[];
  sessionId?: string;
}

export interface AgentRunResult {
  sessionId: string;
  output: string;
  events: StreamChunk[];
  plan: PlanStep[];
  trimmedMessages: number;
}
