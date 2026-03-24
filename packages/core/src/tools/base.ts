import { z } from 'zod';

export interface ToolResult {
  success: boolean;
  output: string;
}

export abstract class BaseTool {
  abstract readonly name: string;
  abstract readonly description: string;

  abstract readonly actions: Record<string, {
    schema: z.ZodSchema;
    handler: (args: Record<string, unknown>) => Promise<ToolResult>;
  }>;
}
