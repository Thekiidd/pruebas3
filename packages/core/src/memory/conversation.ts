import { Message } from '../models/base.js';

export interface ConversationSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationMemory {
  private sessions = new Map<string, ConversationSession>();

  createSession(id?: string): ConversationSession {
    const sessionId = id ?? crypto.randomUUID();
    const session: ConversationSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(id: string): ConversationSession | undefined {
    return this.sessions.get(id);
  }

  addMessage(sessionId: string, message: Message): void {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);
    session.messages.push(message);
    session.updatedAt = new Date();
  }

  clearSession(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.messages = [];
      session.updatedAt = new Date();
    }
  }

  listSessions(): ConversationSession[] {
    return Array.from(this.sessions.values());
  }
}
