import { Message } from '../models/base.js';

/**
 * Summarizer condenses long conversation history to save context window tokens.
 */
export class Summarizer {
  summarize(messages: Message[]): string {
    const pairs = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => {
        const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
        return `${m.role.toUpperCase()}: ${content.slice(0, 200)}`;
      });

    return `[Conversation summary — ${messages.length} messages]\n${pairs.join('\n')}`;
  }
}
