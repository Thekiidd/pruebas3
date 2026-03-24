import { BaseModelAdapter, type Message, type ModelConfig, type StreamChunk, type ToolDefinition } from './base.js';

export class MockModelAdapter extends BaseModelAdapter {
  readonly provider = 'mock';
  readonly supportedModels = ['mock-fast', 'mock-smart'];

  async *streamChat(messages: Message[], _config: ModelConfig, _tools?: ToolDefinition[]): AsyncGenerator<StreamChunk> {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    const content = typeof lastUserMessage?.content === 'string' ? `Echo: ${lastUserMessage.content}` : 'Echo: (no text)';

    yield { type: 'text', content };
    yield { type: 'done', usage: { inputTokens: messages.length, outputTokens: 1 } };
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }

  async countTokens(text: string): Promise<number> {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }
}
