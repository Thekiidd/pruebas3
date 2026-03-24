/**
 * Token counting and management utilities.
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token (GPT-style BPE)
  return Math.ceil(text.length / 4);
}

export function estimateMessageTokens(messages: Array<{ content: string | unknown[] }>): number {
  return messages.reduce((total, msg) => {
    const content = typeof msg.content === 'string'
      ? msg.content
      : JSON.stringify(msg.content);
    return total + estimateTokens(content) + 4; // 4 tokens overhead per message
  }, 0);
}

export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n...[truncated]';
}

export const TOKEN_LIMITS: Record<string, number> = {
  'claude-opus-4-5': 200_000,
  'claude-sonnet-4-5': 200_000,
  'claude-haiku-4-5': 200_000,
  'gpt-4o': 128_000,
  'gpt-4o-mini': 128_000,
  'gemini-2.0-flash': 1_000_000,
  'gemini-2.0-pro': 2_000_000,
};
