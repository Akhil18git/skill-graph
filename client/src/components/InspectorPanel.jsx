import React from 'react';
import { X, Layers, ArrowRight, Code2, Tag, Database, Sparkles } from 'lucide-react';

const entityBadges = {
  Person: 'badge-person',
  Skill: 'badge-skill',
  Project: 'badge-project',
  Technology: 'badge-technology',
  JobRole: 'badge-jobrole',
  Company: 'badge-company',
  Domain: 'badge-domain'
};

export default function InspectorPanel({ selectedNode, onClose, relationships = [] }) {
  if (!selectedNode) return null;

  const props = selectedNode.properties || {};
  const label = selectedNode.label || 'Node';
  const badgeClass = entityBadges[label] || 'badge-person';

  // Find incoming & outgoing edges for selected node
  const connectedEdges = relationships.filter(
    r => r.from === selectedNode.id || r.to === selectedNode.id
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
      
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold uppercase ${badgeClass}`}>
              {label}
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {selectedNode.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Node Name & Main Description */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {props.name || props.title}
          </h2>
          {props.title && props.name && (
            <p className="text-xs text-slate-400 mt-0.5">{props.title}</p>
          )}
          {props.bio && (
            <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {props.bio}
            </p>
          )}
        </div>

        {/* Node Properties Grid */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span>Node Properties</span>
          </span>

          <div className="space-y-2">
            {Object.entries(props).map(([key, value]) => {
              if (['id', 'name', 'bio', 'avatar'].includes(key)) return null;
              return (
                <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="font-mono text-slate-400 capitalize">{key}:</span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{String(value)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connected Graph Relationships */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Connected Edges ({connectedEdges.length})</span>
          </span>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {connectedEdges.map((rel, idx) => {
              const isOutgoing = rel.from === selectedNode.id;
              const targetId = isOutgoing ? rel.to : rel.from;

              return (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rel.type}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {isOutgoing ? `➔ ${targetId}` : `⬅ ${targetId}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* openCypher Representation */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>openCypher Node Pattern</span>
          </span>
          <pre className="p-3 rounded-xl bg-[#050811] text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
            {`(${selectedNode.id}:${label} {id: "${selectedNode.id}"})`}
          </pre>
        </div>

      </div>

      <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 text-center">
        SkillGraph Entity Inspector
      </div>

    </div>
  );
}
