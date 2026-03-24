import React, { useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  disabled: boolean;
  isStreaming: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onStop,
  disabled,
  isStreaming,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative flex items-end w-full p-4 bg-transparent mt-2">
      <div className="relative w-full shadow-2xl shadow-black/40 rounded-3xl mx-auto backdrop-blur-3xl bg-black/40 border border-white/10 group focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message to OpenJupiter..."
          disabled={disabled}
          className="w-full max-h-[250px] min-h-[56px] bg-transparent text-zinc-100 rounded-3xl px-5 py-4 pr-14 resize-none focus:outline-none disabled:opacity-50 placeholder:text-zinc-500 font-medium"
          rows={1}
        />
        <div className="absolute right-3 bottom-0 top-0 flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={onStop}
              className="p-2.5 text-zinc-400 hover:text-red-400 hover:bg-black/40 rounded-full transition-all duration-300"
              title="Stop generating"
            >
              <Square size={20} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={!value.trim() || disabled}
              className={`p-2.5 rounded-full transition-all duration-300 shadow-md ${
                !value.trim() || disabled
                  ? 'text-zinc-600 bg-black/40 shadow-none'
                  : 'text-white bg-gradient-to-tr from-indigo-500 to-purple-500 hover:shadow-indigo-500/25 hover:-translate-y-0.5'
              }`}
            >
              <Send size={18} className={!value.trim() || disabled ? '' : 'ml-0.5'} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
