import React, { useState } from 'react';
import { ChatPanel } from './components/chat/ChatPanel';
import { Sidebar } from './components/sidebar/Sidebar';
import { Landing } from './components/landing/Landing';

export function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');

  if (view === 'landing') {
    return <Landing onEnterApp={() => setView('app')} />;
  }

  return (
    <div className="flex h-screen w-full text-zinc-100 overflow-hidden font-sans bg-transparent selection:bg-indigo-500/30">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full min-w-0 bg-transparent relative z-10">
        <ChatPanel />
      </main>
    </div>
  );
}
