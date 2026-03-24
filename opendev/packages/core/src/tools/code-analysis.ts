import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';

export class CodeAnalysisTool extends BaseTool {
  readonly name = 'code_analysis';
  readonly description = 'Analyze code for issues, complexity, and patterns';

  readonly actions = {
    analyze: {
      schema: z.object({ code: z.string(), language: z.string().default('typescript') }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { code, language } = args as { code: string; language: string };

        const lines = code.split('\n');
        const issues: string[] = [];

        // Basic static analysis
        if (language === 'typescript' || language === 'javascript') {
          if (code.includes('any')) issues.push('Warning: use of `any` type detected');
          if (code.includes('console.log')) issues.push('Info: console.log found');
          if (code.includes('TODO') || code.includes('FIXME')) issues.push('Info: TODO/FIXME comments found');
        }

        const report = [
          `Lines: ${lines.length}`,
          `Characters: ${code.length}`,
          `Language: ${language}`,
          issues.length > 0 ? `Issues:\n${issues.map(i => `  - ${i}`).join('\n')}` : 'No issues found',
        ].join('\n');

        return { success: true, output: report };
      },
    },
  };
}
