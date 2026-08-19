import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GraphCanvas from './components/GraphCanvas';
import RoleMatcher from './components/RoleMatcher';
import Recommendations from './components/Recommendations';
import CypherPlayground from './components/CypherPlayground';
import InspectorPanel from './components/InspectorPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('canvas');
  const [dbStatus, setDbStatus] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [people, setPeople] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch DB status
      const statusRes = await fetch('/api/graph/status');
      const statusJson = await statusRes.json();
      setDbStatus(statusJson);

      // Fetch Graph Overview
      const overviewRes = await fetch('/api/graph/overview');
      const overviewJson = await overviewRes.json();
      if (overviewJson.success && overviewJson.data?.[0]) {
        setGraphData(overviewJson.data[0]);
      }

      // Fetch People candidates
      const peopleRes = await fetch('/api/graph/people');
      const peopleJson = await peopleRes.json();
      if (peopleJson.success) {
        setPeople(peopleJson.data);
      }

      // Fetch Job Roles
      const rolesRes = await fetch('/api/graph/roles');
      const rolesJson = await rolesRes.json();
      if (rolesJson.success) {
        setRoles(rolesJson.data);
      }
    } catch (err) {
      console.error('Failed to load graph dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} dbStatus={dbStatus} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {loading ? (
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <p className="text-sm font-mono text-slate-400">Loading SkillGraph openCypher Dataset...</p>
          </div>
        ) : (
          <>
            {activeTab === 'canvas' && (
              <GraphCanvas
                graphData={graphData}
                onSelectNode={(node) => setSelectedNode(node)}
                selectedNodeId={selectedNode?.id}
              />
            )}

            {activeTab === 'matcher' && (
              <RoleMatcher people={people} roles={roles} />
            )}

            {activeTab === 'recommendations' && (
              <Recommendations people={people} />
            )}

            {activeTab === 'playground' && (
              <CypherPlayground />
            )}
          </>
        )}
      </main>

      {/* Node Inspector Drawer */}
      <InspectorPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        relationships={graphData.relationships}
      />

    </div>
  );
}
