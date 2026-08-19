import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertCircle, Briefcase, Award, Code2, ArrowRight, Terminal, Copy, Check } from 'lucide-react';

export default function RoleMatcher({ people = [], roles = [] }) {
  const [selectedPersonId, setSelectedPersonId] = useState('p1');
  const [selectedRoleId, setSelectedRoleId] = useState('j1');
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchMatch();
  }, [selectedPersonId, selectedRoleId]);

  const fetchMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/graph/match?personId=${selectedPersonId}&roleId=${selectedRoleId}`);
      const json = await res.json();
      if (json.success) {
        setMatchData(json);
      }
    } catch (err) {
      console.error('Failed to fetch role match:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCypher = () => {
    if (matchData?.cypherExecuted) {
      navigator.clipboard.writeText(matchData.cypherExecuted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const data = matchData?.data || {};

  return (
    <div className="space-y-6">
      
      {/* Header Selector Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Graph Career Match & Gap Analysis</h2>
            <p className="text-xs text-slate-400">Multi-hop Cypher traversal connecting candidate experience to target roles</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          
          {/* Select Candidate */}
          <div className="w-full sm:w-60">
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Select Candidate</label>
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-blue-500"
            >
              {people.map(item => (
                <option key={item.p.id} value={item.p.id}>
                  👤 {item.p.name} ({item.p.title})
                </option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 hidden sm:block" />

          {/* Select Role */}
          <div className="w-full sm:w-60">
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Target Job Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-pink-500"
            >
              {roles.map(item => (
                <option key={item.j.id} value={item.j.id}>
                  🎯 {item.j.title} ({item.j.domain})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-2xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <>
          {/* Match Score Gauge & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Score Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Graph Compatibility Score</span>
              
              <div className="relative flex items-center justify-center my-3">
                <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center">
                  <span className="text-4xl font-extrabold font-sans text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    {data.matchPercentage || 0}%
                  </span>
                </div>
              </div>

              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{data.matchedSkills?.length || 0} Skills Verified</span>
              </div>
            </div>

            {/* Candidate Summary */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Candidate Profile</span>
                <h3 className="text-lg font-bold text-white mt-1">{data.person?.name}</h3>
                <p className="text-xs text-slate-300 font-medium">{data.person?.title}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{data.person?.bio}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Target: <strong className="text-slate-200">{data.role?.title}</strong></span>
              </div>
            </div>

            {/* Role Requirements Overview */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-pink-400">Target Role Spectrum</span>
                <h3 className="text-lg font-bold text-white mt-1">{data.role?.title}</h3>
                <p className="text-xs text-slate-300 font-medium">Domain: {data.role?.domain}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300">Level: {data.role?.experienceLevel}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300">Range: {data.role?.salaryRange}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Total Skill Requirements:</span>
                <span className="text-white font-bold">{(data.matchedSkills?.length || 0) + (data.missingSkills?.length || 0)}</span>
              </div>
            </div>

          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Matched Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Acquired & Verified Skills</h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {data.matchedSkills?.length || 0} Matches
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {data.matchedSkills?.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{item.skill.name}</span>
                        {item.verifiedByProject && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Project Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{item.skill.category}</span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="text-slate-400 font-mono text-[10px]">Req Level:</span>
                        <span className="font-bold text-pink-400">{item.requiredProficiency}/5</span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        Candidate: {item.candidateProficiency}/5
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skill Gaps */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Skill Gaps to Bridge</h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {data.missingSkills?.length || 0} Gaps Found
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {data.missingSkills?.map((item, i) => {
                  const hasPartial = item.candidateProficiency > 0;
                  const gapAmount = item.requiredProficiency - (item.candidateProficiency || 0);
                  return (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">{item.skill.name}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              item.importance === 'CRITICAL'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {item.importance}
                            </span>
                            {item.verifiedByProject && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                Project Touched
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{item.skill.category}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-mono text-slate-400">Gap</div>
                          <div className="text-sm font-bold text-rose-400">+{gapAmount} levels</div>
                        </div>
                      </div>

                      {/* Proficiency bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                          <span>Your level: <span className={hasPartial ? 'text-amber-400 font-bold' : 'text-slate-500'}>{item.candidateProficiency || 0}/5</span></span>
                          <span>Required: <span className="text-rose-400 font-bold">{item.requiredProficiency}/5</span></span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all"
                            style={{ width: `${((item.candidateProficiency || 0) / item.requiredProficiency) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(!data.missingSkills || data.missingSkills.length === 0) && (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    🎉 Outstanding! Candidate fully meets all required proficiency levels for this role!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Project Evidence Paths */}
          {data.projectEvidence && data.projectEvidence.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Project Evidence & Multi-Hop Traversal Proof</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projectEvidence.map((ev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-purple-300">📁 {ev.project}</span>
                      <p className="text-xs text-slate-400">Role in project: <strong className="text-slate-200">{ev.role}</strong></p>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-mono">
                        <span>Demonstrated Skill: <strong>{ev.demonstratedSkill}</strong></span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-400">
                      Score: {(ev.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Executed Cypher Query Inspector */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Executed openCypher Multi-Hop Query</span>
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
              {matchData?.cypherExecuted}
            </pre>
          </div>
        </>
      )}

    </div>
  );
}
