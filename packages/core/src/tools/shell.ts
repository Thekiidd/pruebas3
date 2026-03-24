import { spawn } from 'node:child_process';
import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';

const BLOCKED_COMMANDS = ['rm -rf /', 'mkfs', 'dd if=/dev/zero', ':(){:|:&};:'];
const TIMEOUT_MS = 30_000;

export class ShellTool extends BaseTool {
  readonly name = 'shell';
  readonly description = 'Execute shell commands in the project directory';

  private workdir: string;

  constructor(workdir: string) {
    super();
    this.workdir = workdir;
  }

  readonly actions = {
    exec: {
      schema: z.object({
        command: z.string(),
        timeout: z.number().positive().max(120_000).default(TIMEOUT_MS),
      }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { command, timeout } = args as { command: string; timeout: number };
        // Security: block dangerous commands
        for (const blocked of BLOCKED_COMMANDS) {
          if (command.includes(blocked)) {
            return { success: false, output: `Blocked command: ${blocked}` };
          }
        }

        return new Promise((resolve) => {
          const isWin = process.platform === 'win32';
          const shell = isWin ? 'cmd' : 'sh';
          const shellFlag = isWin ? '/c' : '-c';

          const proc = spawn(shell, [shellFlag, command], {
            cwd: this.workdir,
            env: { ...process.env, PATH: process.env['PATH'] },
          });

          let stdout = '';
          let stderr = '';

          proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
          proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

          const timer = setTimeout(() => {
            proc.kill('SIGTERM');
            resolve({ success: false, output: `Command timed out after ${timeout}ms` });
          }, timeout);

          proc.on('close', (code) => {
            clearTimeout(timer);
            const output = [stdout, stderr].filter(Boolean).join('\n');
            resolve({
              success: code === 0,
              output: output || `Exit code: ${code}`,
            });
          });
        });
      },
    },
  };
}
