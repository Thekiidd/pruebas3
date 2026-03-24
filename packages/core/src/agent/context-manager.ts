import type { Message } from '../models/base.js';

export interface ContextWindowResult {
  selectedMessages: Message[];
  droppedMessages: Message[];
}

export class ContextManager {
  constructor(private readonly maxMessages = 20) {}

  trim(messages: Message[]): ContextWindowResult {
    if (messages.length <= this.maxMessages) {
      return { selectedMessages: messages, droppedMessages: [] };
    }

    const droppedCount = messages.length - this.maxMessages;
    return {
      selectedMessages: messages.slice(droppedCount),
      droppedMessages: messages.slice(0, droppedCount),
    };
  }
}
