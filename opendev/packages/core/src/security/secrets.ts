import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/**
 * Secrets management — stores and retrieves API keys securely globally.
 * Uses ~/.opendev/config.json as the primary persistent store, falling back to process.env.
 */
export class SecretsManager {
  private configPath: string;
  private configDir: string;
  private inMemoryStore = new Map<string, string>();

  constructor() {
    this.configDir = path.join(os.homedir(), '.openjupiter');
    this.configPath = path.join(this.configDir, 'config.json');
    this.loadGlobalConfig();
  }

  private loadGlobalConfig(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf8');
        const data = JSON.parse(content) as Record<string, string>;
        for (const [k, v] of Object.entries(data)) {
          this.inMemoryStore.set(k, v);
        }
      }
    } catch {
      // Ignore initial load errors
    }
  }

  private saveGlobalConfig(): void {
    try {
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { recursive: true });
      }
      const data = Object.fromEntries(this.inMemoryStore);
      fs.writeFileSync(this.configPath, JSON.stringify(data, null, 2), 'utf8');
    } catch {
      // Ignore save errors
    }
  }

  get(key: string): string | undefined {
    // Priority: Local User Config > process.env > in-memory fallback
    return this.inMemoryStore.get(key) ?? process.env[key];
  }

  set(key: string, value: string): void {
    this.inMemoryStore.set(key, value);
    this.saveGlobalConfig(); // Persist immediately
  }

  require(key: string): string {
    const value = this.get(key);
    if (!value) {
      throw new Error(
        `Required secret "${key}" is not set.\n` +
        `Use the CLI to configure it: openjupiter config set ${key} <YOUR_KEY>`
      );
    }
    return value;
  }

  has(key: string): boolean {
    return this.inMemoryStore.has(key) || key in process.env;
  }
}

export const secrets = new SecretsManager();
