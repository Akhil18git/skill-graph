import React from 'react';
import { Network, Target, Sparkles, Terminal, Database, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dbStatus }) {
  const tabs = [
    { id: 'canvas', label: 'Graph Canvas', icon: Network, badge: 'Interactive' },
    { id: 'matcher', label: 'Role Match & Gap Analysis', icon: Target, badge: 'Multi-Hop' },
    { id: 'recommendations', label: 'Skill Recommendations', icon: Sparkles, badge: 'Graph AI' },
    { id: 'playground', label: 'Cypher Playground', icon: Terminal, badge: 'openCypher' }
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-sans tracking-tight text-white">
                SkillGraph <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AI</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                openCypher
              </span>
            </div>
            <p className="text-xs text-slate-400">AI Skill & Career Intelligence Engine</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Database Connection Pill */}
        <div className="flex items-center gap-2">
          {dbStatus?.connected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>CognoDB Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono" title="Operating with in-memory seeded Cypher driver">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Graph Engine (In-Memory)</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
