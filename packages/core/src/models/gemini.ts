import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseModelAdapter, Message, ModelConfig, StreamChunk } from './base.js';
import { secrets } from '../security/secrets.js';

export class GeminiAdapter extends BaseModelAdapter {
  readonly provider = 'google';
  readonly supportedModels = ['gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-flash'];

  private client: GoogleGenerativeAI;

  constructor(apiKey?: string) {
    super();
    this.client = new GoogleGenerativeAI(apiKey ?? secrets.get('GOOGLE_API_KEY') ?? secrets.get('GEMINI_API_KEY') ?? '');
  }

  async *streamChat(
    messages: Message[],
    config: ModelConfig
  ): AsyncGenerator<StreamChunk> {
    const model = this.client.getGenerativeModel({
      model: config.model,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
      ...(config.systemPrompt ? { systemInstruction: config.systemPrompt } : {}),
    });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
    }));

    const lastMessage = messages[messages.length - 1];
    const lastContent = typeof lastMessage?.content === 'string'
      ? lastMessage.content
      : JSON.stringify(lastMessage?.content);

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastContent ?? '');

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield { type: 'text', content: text };
    }

    yield { type: 'done' };
  }

  async listModels(): Promise<string[]> {
    return this.supportedModels;
  }

  async countTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }
}
