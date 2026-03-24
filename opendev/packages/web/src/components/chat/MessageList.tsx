import React from 'react';
import { ChatMessage } from '../../hooks/useAgent';
import { Wrench } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'tool' ? (
            <div className="flex bg-zinc-900/60 backdrop-blur-sm rounded-xl p-4 mx-4 text-zinc-300 text-sm font-mono gap-3 items-start border border-indigo-500/20 shadow-lg animate-in slide-in-from-bottom-2 mt-4 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
                <Wrench className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="overflow-x-auto w-full">
                <div className="font-semibold text-indigo-300 mb-1.5 flex items-center gap-2">
                  <span className="uppercase text-[10px] tracking-widest opacity-70">Running Tool</span>
                  {message.toolName}
                </div>
                <div className="whitespace-pre-wrap text-zinc-400 bg-black/40 p-3 rounded-lg border border-white/5 overflow-x-auto text-xs">
                  {message.content}
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex w-full mb-4 animate-in slide-in-from-bottom-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white rounded-br-sm shadow-indigo-500/20'
                    : 'bg-zinc-900/80 backdrop-blur-xl text-zinc-100 rounded-bl-sm border border-white/10 leading-relaxed'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle rounded-full" />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
