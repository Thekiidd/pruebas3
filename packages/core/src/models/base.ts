import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system', 'tool']),
  content: z.string().or(z.array(z.any())),
  tool_call_id: z.string().optional(),
  tool_calls: z.array(z.any()).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ModelConfigSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(4096),
  topP: z.number().min(0).max(1).optional(),
  stream: z.boolean().default(true),
  systemPrompt: z.string().optional(),
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

export interface StreamChunk {
  type: 'text' | 'tool_call' | 'tool_result' | 'done' | 'error';
  content?: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
  };
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
}

export abstract class BaseModelAdapter {
  abstract readonly provider: string;
  abstract readonly supportedModels: string[];

  abstract streamChat(
    messages: Message[],
    config: ModelConfig,
    tools?: ToolDefinition[]
  ): AsyncGenerator<StreamChunk>;

  abstract listModels(): Promise<string[]>;

  abstract countTokens(text: string): Promise<number>;
}
