import { useState, useCallback, useRef } from 'react';
import { useAgentStore } from '../stores/agent.store';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolName?: string;
  isStreaming?: boolean;
}

export function useAgent(sessionId: string = 'default') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { modelId, workdir } = useAgentStore();

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }]);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.DEV ? 'localhost:3000' : window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/ws/agent/${sessionId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'message', content, model: modelId, workdir }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data as string) as {
        type: string;
        content?: string;
        name?: string;
        args?: Record<string, unknown>;
        error?: string;
      };

      if (data.type === 'text') {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: m.content + (data.content ?? '') }
            : m
        ));
      }

      if (data.type === 'tool_call') {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'tool',
          content: JSON.stringify(data.args, null, 2),
          toolName: data.name ?? 'unknown_tool',
        }]);
      }

      if (data.type === 'done' || data.type === 'error') {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, isStreaming: false, ...(data.type === 'error' ? { content: m.content + `\n\nError: ${data.error}` } : {}) }
            : m
        ));
        setIsStreaming(false);
        ws.close();
      }
    };

    ws.onerror = () => {
      setIsStreaming(false);
      setMessages(prev => prev.map(m =>
        m.id === assistantMsgId ? { ...m, isStreaming: false, content: m.content + '\n\nWebSocket connection error.' } : m
      ));
    };
  }, [sessionId, modelId, workdir, isStreaming]);

  const stopGeneration = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      setIsStreaming(false);
    }
  }, []);

  return { messages, isStreaming, sendMessage, stopGeneration };
}
