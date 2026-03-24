import { create } from 'zustand';

interface AgentState {
  modelId: string;
  workdir: string;
  systemPrompt?: string;
  setModel: (id: string) => void;
  setWorkdir: (dir: string) => void;
  setSystemPrompt: (prompt: string) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  modelId: 'openrouter/google/gemini-flash-1.5-8b:free',
  workdir: '.',
  setModel: (id) => set({ modelId: id }),
  setWorkdir: (dir) => set({ workdir: dir }),
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
}));
