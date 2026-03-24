import React, { useState } from 'react';
import { Terminal, Copy, Check, Home, MessageSquare, BrainCircuit, Globe, TerminalSquare, Puzzle, Package, ArrowRight, Github } from 'lucide-react';

interface LandingProps {
  onEnterApp: () => void;
}

export function Landing({ onEnterApp }: LandingProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const commands = [
    { label: 'OpenRouter (Free)', cmd: 'openjupiter config set OPENROUTER_API_KEY <your-key>' },
    { label: 'Anthropic (Paid)', cmd: 'openjupiter config set ANTHROPIC_API_KEY <your-key>' },
  ];

  return (
    <div className="min-h-screen bg-[#03050C] text-slate-300 font-sans selection:bg-amber-500/30 overflow-y-auto relative w-full">
      {/* Deep Space Starfield Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpIi8+PC9zdmc+')] opacity-70 pointer-events-none" />
      {/* Background Orbits with Moons */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full border-[1px] border-white/5 pointer-events-none animate-[spin_120s_linear_infinite]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400/80 rounded-full shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
      </div>
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full border-[1px] border-amber-500/10 pointer-events-none animate-[spin_80s_linear_infinite_reverse]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
      </div>
      
      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10 w-full">
        <header className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-3 relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
            <div className="p-2.5 bg-gradient-to-tr from-amber-600 to-orange-400 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] relative">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300 tracking-tighter">OpenJupiter</h1>
          </div>
          <button 
            onClick={onEnterApp}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
          >
            Launch Web App <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Quick Start Section */}
        <section className="mb-24 animate-in slide-in-from-bottom-4 duration-700">
          <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-8">
            <span className="text-amber-500 font-mono">&gt;</span> Quick Start
          </h2>
          
          <div className="bg-[#050814]/80 backdrop-blur-md border border-amber-500/10 rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5 opacity-50">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-amber-500/70 uppercase tracking-[0.2em] font-semibold">npm i -g openjupiter</span>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <p className="text-sm font-mono text-slate-400"># Set your API keys. Runs the cosmic server locally. <span className="text-amber-400 ml-2">🪐</span></p>
              
              <div className="space-y-4">
                {commands.map((c, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/60 rounded-2xl p-4 border border-white/5 group hover:border-amber-500/30 transition-colors">
                    <div className="font-mono text-[13px] sm:text-sm">
                      <span className="text-amber-500 mr-4">$</span>
                      <span className="text-slate-300 font-medium">{c.cmd}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(c.cmd, i)}
                      className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-amber-500/20 hover:text-amber-300 transition-colors shrink-0"
                    >
                      {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center mt-8">Then just run <code className="text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded ml-1 font-mono">openjupiter start</code> in your project.</p>
            </div>
          </div>
        </section>

        {/* What It Does Section */}
        <section className="mb-24 animate-in slide-in-from-bottom-8 duration-700 delay-150">
          <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-8">
            <span className="text-amber-500 font-mono">&gt;</span> Power Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Home />}
              title="Runs on Your Machine" 
              desc="Mac, Windows, or Linux. Anthropic, OpenAI, or local models. Private by default—your data stays yours." 
            />
            <FeatureCard 
              icon={<MessageSquare />}
              title="Interactive Chat GUI" 
              desc="Talk to it visually on the web app, or command it purely from your terminal via our CLI mode." 
            />
            <FeatureCard 
              icon={<BrainCircuit />}
              title="Persistent Memory" 
              desc="Remembers your project context using vector stores. It becomes uniquely adapted to your codebase." 
            />
            <FeatureCard 
              icon={<Globe />}
              title="Browser Control" 
              desc="Integrated tools to search the web, read documentation sites, and extract answers automatically." 
            />
            <FeatureCard 
              icon={<TerminalSquare />}
              title="Full System Access" 
              desc="Read and write files, run shell commands, execute scripts. Full access or sandboxed—your choice." 
            />
            <FeatureCard 
              icon={<Puzzle />}
              title="MCP Plugins" 
              desc="Extend its capabilities with standard Model Context Protocol plugins. Give it superhuman tools." 
            />
          </div>
        </section>

        {/* Works With Everything Section */}
        <section className="text-center animate-in fade-in duration-1000 delay-300">
          <h2 className="flex items-center justify-center gap-3 text-2xl font-bold text-white mb-8">
            <span className="text-amber-500 font-mono">&gt;</span> Works With Your Stack
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge icon={<Package />} text="React & Node" color="text-cyan-400" />
            <Badge icon={<Terminal />} text="TypeScript" color="text-blue-500" />
            <Badge icon={<Github />} text="GitHub CLI" color="text-slate-100" />
            <Badge icon={<Globe />} text="Browser Automation" color="text-amber-400" />
            <Badge icon={<BrainCircuit />} text="Claude 3.5 & GPT-4o" color="text-purple-400" />
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#050814]/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:bg-[#0a0f24] hover:border-amber-500/20 transition-all group shadow-md shadow-black/50 cursor-default">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all shadow-inner shadow-amber-500/20">
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Badge({ icon, text, color }: { icon: React.ReactNode, text: string, color: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-colors cursor-default">
      {React.cloneElement(icon as React.ReactElement, { className: `w-4 h-4 ${color}` })}
      <span className="text-sm font-medium text-slate-300">{text}</span>
    </div>
  );
}
