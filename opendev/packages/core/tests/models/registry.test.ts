import { describe, it, expect } from 'vitest';
import { ModelRegistry } from '../../src/models/registry.js';

describe('ModelRegistry', () => {
  it('should create registry with all adapters', () => {
    const registry = new ModelRegistry();
    expect(registry).toBeDefined();
  });

  it('should get adapter by provider name', () => {
    const registry = new ModelRegistry();
    const adapter = registry.getAdapter('anthropic');
    expect(adapter).toBeDefined();
    expect(adapter.provider).toBe('anthropic');
  });

  it('should get adapter by provider/model', () => {
    const registry = new ModelRegistry();
    const adapter = registry.getAdapter('anthropic/claude-sonnet-4-5');
    expect(adapter).toBeDefined();
    expect(adapter.provider).toBe('anthropic');
  });

  it('should throw for unknown model', () => {
    const registry = new ModelRegistry();
    expect(() => registry.getAdapter('unknown-model')).toThrow();
  });

  it('should list all models', async () => {
    const registry = new ModelRegistry();
    const models = await registry.listAll();
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
    expect(models.some(m => m.startsWith('anthropic/'))).toBe(true);
  });
});
