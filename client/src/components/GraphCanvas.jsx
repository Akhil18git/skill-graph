import React, { useEffect, useRef, useState } from 'react';
import { Network as VisNetwork } from 'vis-network';
import { Filter, ZoomIn, ZoomOut, RefreshCw, Eye, Info, Sparkles, Layers } from 'lucide-react';

const entityColors = {
  Person: { bg: '#3b82f6', border: '#60a5fa', highlight: '#93c5fd' },
  Skill: { bg: '#10b981', border: '#34d399', highlight: '#6ee7b7' },
  Project: { bg: '#8b5cf6', border: '#a78bfa', highlight: '#c4b5fd' },
  Technology: { bg: '#f59e0b', border: '#fbbf24', highlight: '#fde047' },
  JobRole: { bg: '#ec4899', border: '#f472b6', highlight: '#fbcfe8' },
  Company: { bg: '#06b6d4', border: '#22d3ee', highlight: '#67e8f9' },
  Domain: { bg: '#6366f1', border: '#818cf8', highlight: '#a5b4fc' }
};

export default function GraphCanvas({ graphData, onSelectNode, selectedNodeId }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [filterType, setFilterType] = useState('ALL');
  const [stats, setStats] = useState({ nodeCount: 0, edgeCount: 0 });

  useEffect(() => {
    if (!containerRef.current || !graphData?.nodes) return;

    // Process nodes
    let visNodes = graphData.nodes.map(n => {
      const color = entityColors[n.label] || { bg: '#64748b', border: '#94a3b8' };
      const isSelected = selectedNodeId === n.id;

      return {
        id: n.id,
        label: `${n.properties.name || n.properties.title}\n(${n.label})`,
        shape: 'box',
        margin: 10,
        font: { color: '#ffffff', face: 'Inter, sans-serif', size: 12, multi: true },
        color: {
          background: color.bg,
          border: isSelected ? '#ffffff' : color.border,
          highlight: { background: color.highlight, border: '#ffffff' }
        },
        borderWidth: isSelected ? 3 : 1.5,
        shadow: { enabled: true, color: color.bg, size: isSelected ? 15 : 5 },
        raw: n
      };
    });

    if (filterType !== 'ALL') {
      visNodes = visNodes.filter(n => n.raw.label.toUpperCase() === filterType.toUpperCase());
    }

    const nodeIds = new Set(visNodes.map(n => n.id));

    // Process edges
    let visEdges = (graphData.relationships || [])
      .filter(r => nodeIds.has(r.from) && nodeIds.has(r.to))
      .map((r, index) => ({
        id: `e-${index}`,
        from: r.from,
        to: r.to,
        label: r.type,
        font: { color: '#94a3b8', size: 10, align: 'middle', background: 'rgba(15, 23, 42, 0.8)' },
        color: { color: 'rgba(255, 255, 255, 0.2)', highlight: '#60a5fa' },
        arrows: { to: { enabled: true, scaleFactor: 0.6 } },
        smooth: { type: 'continuous', roundness: 0.2 }
      }));

    setStats({ nodeCount: visNodes.length, edgeCount: visEdges.length });

    const options = {
      nodes: {
        borderWidthSelected: 3,
        chosen: true
      },
      edges: {
        smooth: true
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true
      }
    };

    const network = new VisNetwork(containerRef.current, { nodes: visNodes, edges: visEdges }, options);
    networkRef.current = network;

    network.on('selectNode', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const targetNode = graphData.nodes.find(n => n.id === nodeId);
        if (targetNode && onSelectNode) {
          onSelectNode(targetNode);
        }
      }
    });

    return () => {
      network.destroy();
    };
  }, [graphData, filterType, selectedNodeId]);

  const handleZoomIn = () => networkRef.current?.zoomIn();
  const handleZoomOut = () => networkRef.current?.zoomOut();
  const handleFit = () => networkRef.current?.fit();

  return (
    <div className="relative w-full h-[calc(100vh-120px)] rounded-2xl glass-panel overflow-hidden border border-slate-800">
      
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 glass-card rounded-xl pointer-events-auto">
          <div className="flex items-center gap-1 px-2.5 py-1 text-slate-400 text-xs font-medium">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Filter:</span>
          </div>
          {['ALL', 'Person', 'Skill', 'Project', 'Technology', 'JobRole', 'Company', 'Domain'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Graph Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 p-1.5 glass-card rounded-xl">
            <button onClick={handleZoomIn} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleZoomOut} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleFit} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80" title="Fit Graph">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass-card rounded-xl text-xs text-slate-400 font-mono">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nodes: <strong className="text-white">{stats.nodeCount}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Edges: <strong className="text-white">{stats.edgeCount}</strong></span>
          </div>
        </div>

      </div>

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 px-3 py-2 glass-card rounded-xl border border-slate-800/80 text-[11px]">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-400" /> Legend:
        </span>
        {Object.entries(entityColors).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.bg }} />
            <span className="text-slate-300">{label}</span>
          </div>
        ))}
      </div>

      {/* Network Canvas Container */}
      <div ref={containerRef} className="w-full h-full bg-[#080c14]" />

    </div>
  );
}
