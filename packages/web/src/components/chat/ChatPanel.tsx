import React, { useRef, useEffect } from 'react';
import { useAgent, ChatMessage } from '../../hooks/useAgent';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function ChatPanel() {
  const [input, setInput] = React.useState('');
  const { messages, isStreaming, sendMessage, stopGeneration } = useAgent();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    const msg = input;
    setInput('');
    void sendMessage(msg);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-md p-8 rounded-3xl bg-[#050814]/60 border border-amber-500/10 backdrop-blur-xl shadow-[0_10px_50px_-10px_rgba(245,158,11,0.15)] relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] relative">
                <span className="text-4xl relative z-10">🪐</span>
              </div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300 mb-3 tracking-tight">OpenJupiter Systems</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Your cosmic engineering terminal. Type a command to initialize planetary systems, run shell tasks, or analyze files in orbit.</p>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        <div ref={bottomRef} />
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onStop={stopGeneration}
          disabled={false}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
