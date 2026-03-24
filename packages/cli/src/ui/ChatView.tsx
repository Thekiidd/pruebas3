/** @jsxRuntime classic */
/** @jsx React.createElement */
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { AgentOrchestrator } from '@opendev/core';

interface ChatViewProps {
  model: string;
  workdir: string;
}

interface Message {
  role: 'user' | 'assistant' | 'tool';
  content: string;
}

export function ChatView({ model, workdir }: ChatViewProps) {
  const { exit } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Type a message (Enter to send, Ctrl+C to exit)');

  const agent = useMemo(() => new AgentOrchestrator({ modelId: model, workdir }), [model, workdir]);

  useInput((inputChar, key) => {
    if (key.ctrl && inputChar === 'c') {
      exit();
      return;
    }

    if (key.return) {
      if (input.trim() && !isRunning) {
        void sendMessage(input.trim());
        setInput('');
      }
      return;
    }

    if (key.backspace || key.delete) {
      setInput(prev => prev.slice(0, -1));
      return;
    }

    if (!key.ctrl && !key.meta) {
      setInput(prev => prev + inputChar);
    }
  });

  async function sendMessage(content: string) {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsRunning(true);
    setStatus('Thinking...');

    let assistantContent = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

    try {
      for await (const event of agent.run(content)) {
        if (event.type === 'text') {
          assistantContent += event.content ?? '';
          setMessages(prev =>
            prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m)
          );
        }
        if (event.type === 'tool_call') {
          setStatus(`🔧 ${event.toolName ?? 'tool'}...`);
        }
        if (event.type === 'done') {
          setStatus('Type a message (Enter to send, Ctrl+C to exit)');
        }
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : String(err)}` },
      ]);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="orange">🪐 OpenJupiter Chat</Text>
        <Text dimColor> [{model}] {workdir}</Text>
      </Box>

      {messages.map((msg, i) => (
        <Box key={i} marginBottom={1}>
          <Text bold color={msg.role === 'user' ? 'yellow' : msg.role === 'tool' ? 'gray' : 'orange'}>
            {msg.role === 'user' ? '▶ You: ' : msg.role === 'tool' ? '🔧 Tool: ' : '🪐 Jupiter: '}
          </Text>
          <Text>{msg.content}</Text>
        </Box>
      ))}

      <Box marginTop={1}>
        <Text color="gray">{status}</Text>
      </Box>

      <Box marginTop={1} borderStyle="single">
        <Text color="green">❯ </Text>
        <Text>{input}<Text color="gray">█</Text></Text>
      </Box>
    </Box>
  );
}
