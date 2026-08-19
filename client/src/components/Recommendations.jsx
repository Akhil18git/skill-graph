import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, Award, Zap, Layers, Terminal, Copy, Check } from 'lucide-react';

export default function Recommendations({ people = [] }) {
  const [selectedPersonId, setSelectedPersonId] = useState('p1');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cypherExecuted, setCypherExecuted] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedPersonId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/graph/recommendations?personId=${selectedPersonId}`);
      const json = await res.json();
      if (json.success) {
        setRecommendations(json.data || []);
        setCypherExecuted(json.cypherExecuted);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCypher = () => {
    if (cypherExecuted) {
      navigator.clipboard.writeText(cypherExecuted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activePerson = people.find(p => p.p.id === selectedPersonId)?.p;

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Graph AI Skill Recommendation Engine</h2>
            <p className="text-xs text-slate-400">Discover high-leverage skills recommended via graph co-occurrence paths</p>
          </div>
        </div>

        {/* Candidate Selector */}
        <div className="w-full md:w-64">
          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Target Candidate</label>
          <select
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
          >
            {people.map(item => (
              <option key={item.p.id} value={item.p.id}>
                👤 {item.p.name} ({item.p.title})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-2xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <>
          {/* Candidate Card */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activePerson?.avatar} alt={activePerson?.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30" />
              <div>
                <h3 className="text-sm font-bold text-white">{activePerson?.name}</h3>
                <span className="text-xs text-slate-400">{activePerson?.title}</span>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {recommendations.length} Recommendations Computed
            </span>
          </div>

          {/* Recommendation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((item, idx) => {
              const candidateProf = item.candidateProficiency || 0;
              const requiredProf = item.requiredProficiency || 5;
              const isLevelUp = candidateProf > 0;
              return (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.skill.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">{item.skill.name}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400">Demand Level</span>
                      <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                        {item.skill.demandLevel}
                      </div>
                    </div>
                  </div>

                  {/* Reason text */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Graph Rationale</span>
                    <p className="text-xs text-slate-200">{item.reason}</p>
                  </div>

                  {/* Proficiency progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>
                        Your level:{' '}
                        <span className={isLevelUp ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                          {candidateProf}/5
                        </span>
                      </span>
                      <span>Target: <span className="text-emerald-400 font-bold">{requiredProf}/5</span></span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isLevelUp ? 'bg-gradient-to-r from-amber-500 to-emerald-500' : 'bg-slate-700'}`}
                        style={{ width: `${(candidateProf / requiredProf) * 100}%` }}
                      />
                    </div>
                    <div className={`text-[10px] font-mono text-center ${isLevelUp ? 'text-amber-400' : 'text-rose-400'}`}>
                      {isLevelUp ? `Need +${requiredProf - candidateProf} more levels` : 'Not yet acquired'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Importance: <strong className="text-slate-200">{item.importance}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>Graph Impact: <strong className="text-emerald-400 font-mono">{item.score}/100</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Executed Cypher Query */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Collaborative Graph Filtering openCypher Query</span>
              </div>
              <button
                onClick={copyCypher}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Cypher'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#050811] text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800/90 leading-relaxed">
              {cypherExecuted}
            </pre>
          </div>
        </>
      )}

    </div>
  );
}
