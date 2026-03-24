import React from 'react';
import { Settings, MessageSquare, Folder, Cpu } from 'lucide-react';
import { useAgentStore } from '../../stores/agent.store';

export function Sidebar() {
  const { modelId, setModel, workdir, setWorkdir } = useAgentStore();

  const models = [
    { value: 'anthropic/claude-sonnet-4-5', label: 'Claude 3.5 Sonnet' },
    { value: 'anthropic/claude-opus-4-5', label: 'Claude 3 Opus' },
    { value: 'anthropic/claude-haiku-4-5', label: 'Claude 3.5 Haiku' },
    { value: 'openai/gpt-4o', label: 'GPT-4o' },
    { value: 'openai/o1-preview', label: 'o1-preview' },
    { value: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  ];

  return (
    <div className="w-64 bg-zinc-950/40 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full text-zinc-300 relative z-20 shadow-2xl">
      <div className="p-5 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
        <div className="p-1.5 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-lg shadow-lg shadow-amber-500/20">
          <Cpu className="text-white w-5 h-5" />
        </div>
        <h1 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 tracking-tight">OpenJupiter</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Active Model
          </label>
          <select
            value={modelId}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 hover:border-white/20 transition-all outline-none appearance-none"
          >
            {models.map(m => (
              <option key={m.value} value={m.value} className="bg-zinc-900">{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Folder className="w-4 h-4 text-orange-400" />
            Workspace
          </label>
          <input
            type="text"
            value={workdir}
            onChange={(e) => setWorkdir(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 hover:border-white/20 transition-all outline-none placeholder:text-zinc-600"
            placeholder="/path/to/project"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Sessions
          </label>
          <div className="space-y-1.5">
            <button className="w-full text-left px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10 shadow-sm">
              Current Session
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-zinc-400 transition-colors">
              New Chat
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors w-full p-2 rounded-md hover:bg-zinc-800">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
