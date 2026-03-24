import Anthropic from '@anthropic-ai/sdk';
import { BaseModelAdapter, Message, ModelConfig, StreamChunk, ToolDefinition } from './base.js';
import { z } from 'zod';
import { secrets } from '../security/secrets.js';

export class AnthropicAdapter extends BaseModelAdapter {
  readonly provider = 'anthropic';
  readonly supportedModels = [
    'claude-opus-4-5',
    'claude-sonnet-4-5',
    'claude-haiku-4-5',
  ];

  private client: Anthropic;

  constructor(apiKey?: string) {
    super();
    this.client = new Anthropic({ apiKey: apiKey ?? secrets.get('ANTHROPIC_API_KEY') ?? 'missing' });
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig,
    tools?: ToolDefinition[]
  ): AsyncGenerator<StreamChunk> {
    const anthropicTools = tools?.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: zodToJsonSchema(tool.inputSchema),
    }));

    const stream = this.client.messages.stream({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      ...(config.systemPrompt ? { system: config.systemPrompt } : {}),
      messages: messages.map(formatMessage),
      ...(anthropicTools && anthropicTools.length > 0 ? { tools: anthropicTools as any } : {}),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield { type: 'text', content: event.delta.text };
        } else if (event.delta.type === 'input_json_delta') {
          yield { type: 'text', content: event.delta.partial_json };
        }
      } else if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use') {
          yield {
            type: 'tool_call',
            toolCall: {
              id: event.content_block.id,
              name: event.content_block.name,
              arguments: {},
            },
          };
        }
      } else if (event.type === 'message_stop') {
        const finalMessage = await stream.finalMessage();
        yield {
          type: 'done',
          usage: {
            inputTokens: finalMessage.usage.input_tokens,
            outputTokens: finalMessage.usage.output_tokens,
          },
        };
      }
    }
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }

  async countTokens(text: string): Promise<number> {
    // Fallback to rough heuristic if exact counting requires beta API
    return Math.ceil(text.length / 4);
  }
}

function formatMessage(msg: Message): Anthropic.MessageParam {
  return {
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: typeof msg.content === 'string'
      ? msg.content
      : (msg.content as Anthropic.ContentBlock[]),
  };
}

function zodToJsonSchema(schema: z.ZodSchema): Record<string, unknown> {
  // Simplified Zod to JSON Schema conversion
  // In production use the zod-to-json-schema package
  return (schema as unknown as { _def: Record<string, unknown> })._def ?? {};
}
