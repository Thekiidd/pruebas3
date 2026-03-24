import type { BaseModelAdapter } from './base.js';
import type { ResolvedModel } from './types.js';

export class ModelRegistry {
  private readonly adapters = new Map<string, BaseModelAdapter>();

  register(adapter: BaseModelAdapter): void {
    this.adapters.set(adapter.provider, adapter);
  }

  listProviders(): string[] {
    return [...this.adapters.keys()];
  }

  listModels(): Record<string, string[]> {
    return [...this.adapters.values()].reduce<Record<string, string[]>>((acc, adapter) => {
      acc[adapter.provider] = adapter.supportedModels;
      return acc;
    }, {});
  }

  resolve(provider: string, model: string): ResolvedModel {
    const adapter = this.adapters.get(provider);

    if (!adapter) {
      throw new Error(`Provider '${provider}' is not registered.`);
    }

    if (!adapter.supportedModels.includes(model)) {
      throw new Error(`Model '${model}' is not supported by provider '${provider}'.`);
    }

    return { provider, model, adapter };
  }
}
