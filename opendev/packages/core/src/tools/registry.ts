import { BaseTool } from './base.js';
import { FileSystemTool } from './filesystem.js';
import { ShellTool } from './shell.js';
import { WebSearchTool } from './web-search.js';
import { GitTool } from './git.js';
import { BrowserTool } from './browser.js';
import { CodeAnalysisTool } from './code-analysis.js';

export class ToolRegistry {
  private tools = new Map<string, BaseTool>();

  constructor(workdir: string) {
    const tools: BaseTool[] = [
      new FileSystemTool(workdir),
      new ShellTool(workdir),
      new WebSearchTool(),
      new GitTool(workdir),
      new BrowserTool(),
      new CodeAnalysisTool(),
    ];

    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  get(name: string): BaseTool | undefined {
    return this.tools.get(name);
  }

  getAll(): BaseTool[] {
    return Array.from(this.tools.values());
  }

  listNames(): string[] {
    return Array.from(this.tools.keys());
  }
}
