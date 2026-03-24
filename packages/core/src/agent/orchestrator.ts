import { ModelRegistry } from '../models/registry.js';
import { ToolRegistry } from '../tools/registry.js';
import { Message, ModelConfig, ToolDefinition } from '../models/base.js';
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { AgentEvent } from './types.js';
import { z } from 'zod';

export const AgentConfigSchema = z.object({
  modelId: z.string().default('anthropic/claude-sonnet-4-5'),
  workdir: z.string().default(process.cwd()),
  maxIterations: z.number().positive().default(20),
  systemPrompt: z.string().optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

const DEFAULT_SYSTEM_PROMPT = `You are OpenDev, an expert AI coding agent.
You have access to tools to read/write files, execute commands, and search the web.
Think step by step. Use tools to accomplish tasks. Be precise and careful with code changes.
Always verify your work by running tests after making changes.`;

export class AgentOrchestrator {
  private registry: ModelRegistry;
  private config: AgentConfig;
  private tools: ToolRegistry;
  private conversationHistory: Message[] = [];

  constructor(config: Partial<AgentConfig> = {}) {
    this.config = AgentConfigSchema.parse(config);
    this.registry = new ModelRegistry();
    this.tools = new ToolRegistry(this.config.workdir);
  }

  async *run(userMessage: string): AsyncGenerator<AgentEvent> {
    this.conversationHistory.push({ role: 'user', content: userMessage });

    let effectiveSystemPrompt = this.config.systemPrompt;
    if (!effectiveSystemPrompt) {
      const systemPromptFile = path.join(this.config.workdir, '.openjupiter', 'cerebro.md');
      try {
        if (fs.existsSync(systemPromptFile)) {
          effectiveSystemPrompt = fs.readFileSync(systemPromptFile, 'utf8');
        }
      } catch (e) {
        // Fallback to default if file read fails
        console.warn(`Could not read system prompt from ${systemPromptFile}: ${e}`);
      }
    }
    effectiveSystemPrompt = effectiveSystemPrompt ?? DEFAULT_SYSTEM_PROMPT;

    const modelConfig: ModelConfig = {
      model: this.config.modelId.includes('/')
        ? this.config.modelId.slice(this.config.modelId.indexOf('/') + 1)
        : this.config.modelId,
      maxTokens: 4096,
      temperature: 0.7,
      stream: true,
      systemPrompt: this.config.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
    };

    const adapter = this.registry.getAdapter(this.config.modelId);

    for (let iteration = 0; iteration < this.config.maxIterations; iteration++) {
      yield { type: 'iteration', iteration };

      let assistantMessage = '';
      let hadToolCall = false;

      const availableTools: ToolDefinition[] = this.tools.getAll().flatMap((tool) => 
        Object.entries(tool.actions).map(([actionName, action]) => ({
          name: `${tool.name}_${actionName}`,
          description: `${tool.description} (Action: ${actionName})`,
          inputSchema: action.schema
        }))
      );

      for await (const chunk of adapter.streamChat(this.conversationHistory, modelConfig, availableTools)) {
        if (chunk.type === 'text' && chunk.content) {
          assistantMessage += chunk.content;
          yield { type: 'text', content: chunk.content };
        }

        if (chunk.type === 'tool_call' && chunk.toolCall) {
          hadToolCall = true;
          yield {
            type: 'tool_call',
            toolName: chunk.toolCall.name,
            toolArgs: chunk.toolCall.arguments,
          };

          const result = await this.executeTool(chunk.toolCall.name, chunk.toolCall.arguments);
          yield { type: 'tool_result', toolResult: result };

          this.conversationHistory.push({
            role: 'tool',
            content: result,
            tool_call_id: chunk.toolCall.id,
          });
        }

        if (chunk.type === 'done') {
          if (assistantMessage) {
            this.conversationHistory.push({ role: 'assistant', content: assistantMessage });
          }
          if (!hadToolCall) {
            yield { type: 'done' };
            return;
          }
          break;
        }
      }
    }

    yield { type: 'error', error: `Reached max iterations (${this.config.maxIterations})` };
  }

  private async executeTool(name: string, args: Record<string, unknown>): Promise<string> {
    const parts = name.split('_');
    const toolName = parts[0] ?? '';
    const action = parts.slice(1).join('_') || 'exec';

    const tool = this.tools.get(toolName);

    if (!tool) {
      return `Error: Tool "${toolName}" not found. Available: ${this.tools.listNames().join(', ')}`;
    }

    try {
      const toolAction = tool.actions[action];
      if (!toolAction) return `Error: Action "${action}" not found on tool "${toolName}"`;

      const validated = toolAction.schema.parse(args) as Record<string, unknown>;
      const result = await toolAction.handler(validated);
      return result.success ? result.output : `Error: ${result.output}`;
    } catch (err) {
      return `Error executing ${name}: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): Message[] {
    return [...this.conversationHistory];
  }
}
