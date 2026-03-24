import OpenAI from 'openai';
import { BaseModelAdapter, Message, ModelConfig, StreamChunk, ToolDefinition } from './base.js';
import { secrets } from '../security/secrets.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class OpenAIAdapter extends BaseModelAdapter {
  readonly provider = 'openai';
  readonly supportedModels = ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini'];

  private client: OpenAI;

  constructor(apiKey?: string) {
    super();
    this.client = new OpenAI({ apiKey: apiKey ?? secrets.get('OPENAI_API_KEY') ?? 'missing' });
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig,
    tools?: ToolDefinition[]
  ): AsyncGenerator<StreamChunk> {
    const openaiTools = tools?.map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: zodToJsonSchema(tool.inputSchema),
      },
    }));

    const stream = await this.client.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
      messages: messages.map(m => ({
        role: m.role as any,
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
        ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
      })) as any[],
      ...(openaiTools && openaiTools.length > 0 ? { tools: openaiTools as any } : {}),
    });

    let currentToolCall: { id: string; name: string; args: string } | null = null;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (!delta) continue;

      if (delta.content) {
        yield { type: 'text', content: delta.content };
      }

      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          if (tc.function?.name) {
            currentToolCall = { id: tc.id ?? '', name: tc.function.name, args: '' };
          }
          if (tc.function?.arguments && currentToolCall) {
            currentToolCall.args += tc.function.arguments;
          }
        }
      }

      if (chunk.choices[0]?.finish_reason === 'tool_calls' && currentToolCall) {
        yield {
          type: 'tool_call',
          toolCall: {
            id: currentToolCall.id,
            name: currentToolCall.name,
            arguments: JSON.parse(currentToolCall.args || '{}') as Record<string, unknown>,
          },
        };
        currentToolCall = null;
      }

      if (chunk.choices[0]?.finish_reason === 'stop') {
        yield { type: 'done' };
      }
    }
  }

  async listModels(): Promise<string[]> {
    const models = await this.client.models.list();
    return models.data
      .map((m: any) => m.id as string)
      .filter((id: string) => id.startsWith('gpt') || id.startsWith('o1'));
  }

  async countTokens(text: string): Promise<number> {
    // Rough estimate: ~4 chars per token
    return Math.ceil(text.length / 4);
  }
}
