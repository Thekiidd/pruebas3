import { simpleGit, SimpleGit } from 'simple-git';
import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';

export class GitTool extends BaseTool {
  readonly name = 'git';
  readonly description = 'Perform git operations on the repository';

  private git: SimpleGit;

  constructor(workdir: string) {
    super();
    this.git = simpleGit(workdir);
  }

  readonly actions = {
    status: {
      schema: z.object({}),
      handler: async (_args: Record<string, unknown>): Promise<ToolResult> => {
        const status = await this.git.status();
        const output = [
          `Branch: ${status.current}`,
          `Modified: ${status.modified.join(', ') || 'none'}`,
          `Added: ${status.created.join(', ') || 'none'}`,
          `Deleted: ${status.deleted.join(', ') || 'none'}`,
        ].join('\n');
        return { success: true, output };
      },
    },

    diff: {
      schema: z.object({ file: z.string().optional() }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { file } = args as { file?: string };
        const diff = file ? await this.git.diff([file]) : await this.git.diff();
        return { success: true, output: diff || 'No changes' };
      },
    },

    commit: {
      schema: z.object({
        message: z.string(),
        files: z.array(z.string()).optional(),
      }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { message, files } = args as { message: string; files?: string[] };
        if (files && files.length > 0) {
          await this.git.add(files);
        } else {
          await this.git.add('.');
        }
        const result = await this.git.commit(message);
        return { success: true, output: `Committed: ${result.commit}` };
      },
    },

    log: {
      schema: z.object({ n: z.number().positive().default(10) }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { n } = args as { n: number };
        const log = await this.git.log({ maxCount: n });
        const output = log.all
          .map(entry => `${entry.hash.slice(0, 7)} ${entry.date} ${entry.message}`)
          .join('\n');
        return { success: true, output };
      },
    },
  };
}
