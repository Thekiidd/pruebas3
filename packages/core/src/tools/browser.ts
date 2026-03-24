import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';

export class BrowserTool extends BaseTool {
  readonly name = 'browser';
  readonly description = 'Automate browser interactions using Playwright';

  readonly actions = {
    navigate: {
      schema: z.object({ url: z.string().url() }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { url } = args as { url: string };
        try {
          const { chromium } = await import('playwright');
          const browser = await chromium.launch({ headless: true });
          const page = await browser.newPage();
          await page.goto(url);
          const content = await page.content();
          await browser.close();
          return { success: true, output: content.slice(0, 5000) };
        } catch (err) {
          return { success: false, output: `Browser error: ${err instanceof Error ? err.message : String(err)}` };
        }
      },
    },

    screenshot: {
      schema: z.object({ url: z.string().url(), path: z.string() }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { url, path } = args as { url: string; path: string };
        try {
          const { chromium } = await import('playwright');
          const browser = await chromium.launch({ headless: true });
          const page = await browser.newPage();
          await page.goto(url);
          await page.screenshot({ path, fullPage: true });
          await browser.close();
          return { success: true, output: `Screenshot saved to ${path}` };
        } catch (err) {
          return { success: false, output: `Screenshot error: ${err instanceof Error ? err.message : String(err)}` };
        }
      },
    },
  };
}
