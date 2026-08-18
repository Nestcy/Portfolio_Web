import React, { useState } from 'react';
import { Cpu, Database, Server, Zap, Shield, Play, Pause, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'gateway' | 'vector' | 'model' | 'db' | 'cache';
  status: string;
}

interface ArchitectureDiagramProps {
  nodes: ArchitectureNode[];
  title?: string;
  subtitle?: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  nodes,
  title = "System Dataflow Architecture",
  subtitle = "Interactive node execution & packet trajectory simulator"
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [isSimulating, setIsSimulating] = useState(true);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const nodeIcons = {
    client: Server,
    gateway: Zap,
    vector: Database,
    model: Cpu,
    db: Database,
    cache: Shield,
  };

  return (
    <div className="bg-black rounded-lg border border-zinc-800 p-5 shadow-2xl space-y-4 font-sans">
      {/* Header & Simulation Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3 font-mono">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>{title}</span>
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-2.5 py-1 rounded border text-[10px] font-mono flex items-center space-x-1.5 transition-all uppercase tracking-wider ${
              isSimulating 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isSimulating ? 'Active Packets' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Architecture Flow Graph */}
      <div className="relative py-6 px-3 bg-[#050505] rounded border border-zinc-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] space-x-3">
          {nodes.map((node, index) => {
            const Icon = nodeIcons[node.type] || Server;
            const isSelected = node.id === selectedNodeId;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <button
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`flex-1 p-3 rounded border text-left transition-all relative group cursor-pointer font-mono ${
                    isSelected 
                      ? 'bg-zinc-900 border-white text-white shadow-md' 
                      : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className="w-4 h-4 text-zinc-300" />
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-500 uppercase">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mb-1 line-clamp-1">{node.label}</div>
                  <div className="flex items-center text-[9px] text-emerald-400 space-x-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{node.status}</span>
                  </div>
                </button>

                {/* Arrow Connector */}
                {index < nodes.length - 1 && (
                  <div className="relative flex items-center justify-center w-6 text-zinc-600">
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                    {isSimulating && (
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Spec Sheet */}
      {selectedNode && (
        <div className="p-3.5 rounded bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-violet-400 font-bold uppercase text-[10px]">
              LAYER_INSPECTION // {selectedNode.label}
            </span>
            <p className="text-zinc-400 font-sans text-xs">
              Configured for zero-data-loss streaming with low-latency fallback routing protocols.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[10px]">
            <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              Latency: <span className="text-emerald-400 font-bold">12ms</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              SLA: <span className="text-violet-400 font-bold">99.99%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
