import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';

export class FileSystemTool extends BaseTool {
  readonly name = 'filesystem';
  readonly description = 'Read, write, and list files in the project directory';

  private workdir: string;

  constructor(workdir: string) {
    super();
    this.workdir = resolve(workdir);
  }

  readonly actions = {
    read: {
      schema: z.object({ path: z.string() }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { path } = args as { path: string };
        const safePath = this.resolveSafe(path);
        const content = await readFile(safePath, 'utf-8');
        return { success: true, output: content };
      },
    },

    write: {
      schema: z.object({
        path: z.string(),
        content: z.string(),
        createDirs: z.boolean().default(true),
      }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { path, content, createDirs } = args as { path: string; content: string; createDirs: boolean };
        const safePath = this.resolveSafe(path);
        if (createDirs) {
          await mkdir(resolve(safePath, '..'), { recursive: true });
        }
        await writeFile(safePath, content, 'utf-8');
        return { success: true, output: `Written ${content.length} bytes to ${path}` };
      },
    },

    list: {
      schema: z.object({
        path: z.string().default('.'),
        recursive: z.boolean().default(false),
      }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { path, recursive } = args as { path: string; recursive: boolean };
        const safePath = this.resolveSafe(path);
        const entries = await this.listDir(safePath, recursive);
        return { success: true, output: entries.join('\n') };
      },
    },
  };

  private resolveSafe(inputPath: string): string {
    const resolved = resolve(this.workdir, inputPath);
    if (!resolved.startsWith(this.workdir)) {
      throw new Error(`Path traversal detected: ${inputPath}`);
    }
    return resolved;
  }

  private async listDir(dir: string, recursive: boolean): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const results: string[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const fullPath = join(dir, entry.name);
      const relPath = relative(this.workdir, fullPath);
      results.push(entry.isDirectory() ? `${relPath}/` : relPath);

      if (recursive && entry.isDirectory()) {
        results.push(...await this.listDir(fullPath, recursive));
      }
    }
    return results;
  }
}
