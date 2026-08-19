import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, Clock, Code, Database, FileJson, Table } from 'lucide-react';

const PRESETS = [
  {
    name: '1. Overview Graph Schema',
    query: `MATCH (n)
OPTIONAL MATCH (n)-[r]->(m)
RETURN n, r, m
LIMIT 50`
  },
  {
    name: '2. Candidate Project -> Skill Traversal',
    query: `MATCH (p:Person {id: "p1"})-[:CONTRIBUTED_TO]->(pr:Project)-[:DEMONSTRATES_SKILL]->(s:Skill)
RETURN p.name AS candidate, pr.name AS project, s.name AS demonstratedSkill`
  },
  {
    name: '3. Role Requirements & Gaps',
    query: `MATCH (j:JobRole {id: "j1"})-[rq:REQUIRES_SKILL]->(s:Skill)
OPTIONAL MATCH (p:Person {id: "p1"})-[hs:HAS_SKILL]->(s)
RETURN s.name AS skill, rq.importance AS importance, hs.proficiency AS candidateProficiency`
  },
  {
    name: '4. Tech Enabler Paths',
    query: `MATCH (t:Technology)-[:ENABLES_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(j:JobRole)
RETURN t.name AS technology, s.name AS skill, j.title AS targetRole`
  }
];

export default function CypherPlayground() {
  const [cypherQuery, setCypherQuery] = useState(PRESETS[1].query);
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('json');

  const runQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/graph/cypher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cypher: cypherQuery })
      });
      const json = await res.json();
      setQueryResult(json);
    } catch (err) {
      setQueryResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">openCypher Query Playground</h2>
            <p className="text-xs text-slate-400">Execute live parameterized openCypher queries directly over Bolt / CognoDB</p>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Templates:</span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setCypherQuery(preset.query)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Execution Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Cypher Editor</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCypherQuery(PRESETS[0].query)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset Editor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={runQuery}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>Execute openCypher</span>
            </button>
          </div>
        </div>

        <textarea
          value={cypherQuery}
          onChange={(e) => setCypherQuery(e.target.value)}
          rows={6}
          className="w-full p-4 rounded-xl bg-[#050811] text-xs font-mono text-emerald-400 border border-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
          placeholder="MATCH (n) RETURN n..."
        />
      </div>

      {/* Query Results View */}
      {queryResult && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-slate-400">Execution Result</span>
              {queryResult.executionTimeMs !== undefined && (
                <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Clock className="w-3 h-3" />
                  <span>{queryResult.executionTimeMs} ms</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveView('json')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono ${
                  activeView === 'json' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-[#050811] text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-96">
            {JSON.stringify(queryResult, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}
