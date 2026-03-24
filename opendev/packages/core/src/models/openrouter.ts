import OpenAI from 'openai';
import { BaseModelAdapter, Message, ModelConfig, StreamChunk, ToolDefinition } from './base.js';
import { secrets } from '../security/secrets.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class OpenRouterAdapter extends BaseModelAdapter {
  readonly provider = 'openrouter';
  readonly supportedModels = [
    'google/gemini-flash-1.5-8b:free',
    'stepfun/step-3.5-flash:free',
    'meta-llama/llama-3-8b-instruct:free',
    'qwen/qwen-2-7b-instruct:free',
    'deepseek/deepseek-chat',
  ];

  private client: OpenAI;

  constructor(apiKey?: string) {
    super();
    this.client = new OpenAI({ 
      apiKey: apiKey ?? secrets.get('OPENROUTER_API_KEY') ?? 'missing',
      baseURL: 'https://openrouter.ai/api/v1' 
    });
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig,
    tools?: ToolDefinition[]
  ): AsyncGenerator<StreamChunk> {
    const freeModels = [
      'google/gemini-flash-1.5-8b:free',
      'stepfun/step-3.5-flash:free',
      'meta-llama/llama-3-8b-instruct:free',
      'qwen/qwen-2-7b-instruct:free',
    ];

    const modelId = config.model.startsWith('openrouter/') 
      ? config.model.replace('openrouter/', '') 
      : config.model;

    // If it's a free model, we prioritize the rotation list
    const rotation = freeModels.includes(modelId) 
      ? [modelId, ...freeModels.filter(m => m !== modelId)]
      : [modelId];

    const openaiTools = tools?.map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: zodToJsonSchema(tool.inputSchema),
      },
    }));

    for (const currentModel of rotation) {
      try {
        console.log(`[OpenRouter] Trying model: ${currentModel}`);
        const stream = await this.client.chat.completions.create({
          model: currentModel,
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
        }, {
          headers: {
            'HTTP-Referer': 'https://github.com/opendev',
            'X-Title': 'OpenJupiter',
          }
        });

        let currentToolCall: { id: string; name: string; args: string } | null = null;
        let yieldedSomething = false;

        for await (const chunk of stream) {
          if (!chunk.choices || chunk.choices.length === 0) continue;
          const delta = chunk.choices[0]?.delta;
          if (!delta) continue;

          if (delta.content) {
            yieldedSomething = true;
            yield { type: 'text', content: delta.content };
          }

          if (delta.tool_calls) {
            yieldedSomething = true;
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
        
        if (yieldedSomething) return; // Success!

      } catch (err: any) {
        if (err.status === 429 && rotation.indexOf(currentModel) < rotation.length - 1) {
          console.warn(`[OpenRouter] 429 Rate Limit on ${currentModel}. Rotating to next model...`);
          continue;
        }
        yield { type: 'error', error: `OpenRouter Error: ${err.message || String(err)}` };
        return;
      }
    }
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }

  async countTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}
