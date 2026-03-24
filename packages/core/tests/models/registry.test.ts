import { describe, expect, it } from 'vitest';
import { MockModelAdapter } from '../../src/models/mock.js';
import { ModelRegistry } from '../../src/models/registry.js';

describe('ModelRegistry', () => {
  it('registers and resolves models', () => {
    const registry = new ModelRegistry();
    registry.register(new MockModelAdapter());

    expect(registry.listProviders()).toEqual(['mock']);
    expect(registry.listModels()).toEqual({ mock: ['mock-fast', 'mock-smart'] });

    const resolved = registry.resolve('mock', 'mock-fast');
    expect(resolved.provider).toBe('mock');
    expect(resolved.model).toBe('mock-fast');
  });

  it('throws for unknown provider', () => {
    const registry = new ModelRegistry();
    expect(() => registry.resolve('missing', 'x')).toThrow("Provider 'missing' is not registered.");
  });
});
