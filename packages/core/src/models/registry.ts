import { BaseModelAdapter } from './base.js';
import { AnthropicAdapter } from './anthropic.js';
import { OpenAIAdapter } from './openai.js';
import { GeminiAdapter } from './gemini.js';
import { OllamaAdapter } from './ollama.js';
import { OpenRouterAdapter } from './openrouter.js';

export class ModelRegistry {
  private adapters = new Map<string, BaseModelAdapter>();

  constructor() {
    const adapters: BaseModelAdapter[] = [
      new AnthropicAdapter(),
      new OpenAIAdapter(),
      new GeminiAdapter(),
      new OllamaAdapter(),
      new OpenRouterAdapter(),
    ];

    for (const adapter of adapters) {
      for (const model of adapter.supportedModels) {
        this.adapters.set(`${adapter.provider}/${model}`, adapter);
      }
      this.adapters.set(adapter.provider, adapter);
    }
  }

  getAdapter(modelId: string): BaseModelAdapter {
    const adapter = this.adapters.get(modelId)
      ?? this.adapters.get(modelId.split('/')[0] ?? '');

    if (!adapter) {
      throw new Error(
        `No adapter found for model: ${modelId}. Use one of: anthropic, openai, google, ollama`
      );
    }
    return adapter;
  }

  async listAll(): Promise<string[]> {
    const all: string[] = [];
    const seen = new Set<BaseModelAdapter>();

    for (const adapter of this.adapters.values()) {
      if (seen.has(adapter)) continue;
      seen.add(adapter);
      try {
        const models = await adapter.listModels();
        all.push(...models.map(m => `${adapter.provider}/${m}`));
      } catch {
        // Adapter unavailable (e.g., Ollama not running)
      }
    }
    return all;
  }
}

export const modelRegistry = new ModelRegistry();
