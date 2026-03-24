import { Message } from '../models/base.js';

const MAX_CONTEXT_TOKENS = 100_000;
const CHARS_PER_TOKEN = 4;

/**
 * Manages the conversation context window,
 * trimming old messages when approaching the token limit.
 */
export class ContextManager {
  private tokenLimit: number;

  constructor(tokenLimit: number = MAX_CONTEXT_TOKENS) {
    this.tokenLimit = tokenLimit;
  }

  estimateTokens(messages: Message[]): number {
    return messages.reduce((acc, m) => {
      const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
      return acc + Math.ceil(content.length / CHARS_PER_TOKEN);
    }, 0);
  }

  trim(messages: Message[]): Message[] {
    if (this.estimateTokens(messages) <= this.tokenLimit) return messages;

    // Keep system message + recent messages
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversational = messages.filter(m => m.role !== 'system');

    let trimmed = [...conversational];
    while (
      trimmed.length > 2 &&
      this.estimateTokens([...systemMessages, ...trimmed]) > this.tokenLimit
    ) {
      // Remove the oldest non-system message
      trimmed = trimmed.slice(1);
    }

    return [...systemMessages, ...trimmed];
  }

  shouldSummarize(messages: Message[]): boolean {
    return this.estimateTokens(messages) > this.tokenLimit * 0.8;
  }
}
