import { z } from 'zod';
import { BaseTool, ToolResult } from './base.js';
import { secrets } from '../security/secrets.js';

interface SearchResult {
  title: string;
  url: string;
  description: string;
}

export class WebSearchTool extends BaseTool {
  readonly name = 'web_search';
  readonly description = 'Search the web using Brave or Tavily API';

  private braveApiKey: string;
  private tavilyApiKey: string;

  constructor() {
    super();
    this.braveApiKey = secrets.get('BRAVE_API_KEY') ?? '';
    this.tavilyApiKey = secrets.get('TAVILY_API_KEY') ?? '';
  }

  readonly actions = {
    search: {
      schema: z.object({
        query: z.string(),
        maxResults: z.number().positive().default(5),
      }),
      handler: async (args: Record<string, unknown>): Promise<ToolResult> => {
        const { query, maxResults } = args as { query: string; maxResults: number };
        try {
          if (this.tavilyApiKey) {
            return await this.tavilySearch(query, maxResults);
          } else if (this.braveApiKey) {
            return await this.braveSearch(query, maxResults);
          }
          return { success: false, output: 'No search API key configured. Set BRAVE_API_KEY or TAVILY_API_KEY.' };
        } catch (err) {
          return { success: false, output: `Search error: ${err instanceof Error ? err.message : String(err)}` };
        }
      },
    },
  };

  private async tavilySearch(query: string, maxResults: number): Promise<ToolResult> {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: this.tavilyApiKey,
        query,
        max_results: maxResults,
      }),
    });

    if (!response.ok) throw new Error(`Tavily error: ${response.statusText}`);
    const data = await response.json() as { results: SearchResult[] };
    const formatted = data.results
      .map((r, i) => `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.description}`)
      .join('\n\n');

    return { success: true, output: formatted };
  }

  private async braveSearch(query: string, maxResults: number): Promise<ToolResult> {
    const params = new URLSearchParams({ q: query, count: String(maxResults) });
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
      headers: { 'Accept': 'application/json', 'X-Subscription-Token': this.braveApiKey ?? '' },
    });

    if (!response.ok) throw new Error(`Brave error: ${response.statusText}`);
    const data = await response.json() as { web?: { results: SearchResult[] } };
    const results = data.web?.results ?? [];
    const formatted = results
      .map((r, i) => `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.description}`)
      .join('\n\n');

    return { success: true, output: formatted };
  }
}
