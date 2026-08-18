import React, { useState, useEffect } from 'react';
import { Command, Search, X, FileText, ArrowRight, Bot, Cpu, Terminal, Sparkles, Sliders } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenAdmin?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  onOpenResume,
  onOpenAdmin
}) => {
  const { projects, personalInfo } = usePortfolio();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'View RAG & Agent Projects', icon: Cpu, section: 'projects' },
    { label: 'Inspect AI Tech Stack Matrix', icon: Bot, section: 'skills' },
    { label: 'Explore Career Telemetry Timeline', icon: Terminal, section: 'timeline' },
    { label: `Download ${personalInfo.name} Resume (PDF)`, icon: FileText, action: onOpenResume },
  ];

  const isSecretAdminQuery = ['admin', ':admin', 'sudo', 'login', 'console', 'root', 'engine.os'].includes(query.trim().toLowerCase());

  const matchingProjects = projects.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.technologies.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#0E1424] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Command Search Bar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-[#0B0F19]">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, AI models, skills, or blog articles..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">ESC</span>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Quick Actions */}
          {!query && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2">Quick Navigation</span>
              <div className="space-y-1">
                {quickActions.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (act.action) act.action();
                        else if (act.section) onSelectSection(act.section);
                        onClose();
                      }}
                      className="w-full p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/30 text-left flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-medium text-slate-200">{act.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Projects */}
          {matchingProjects.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider px-2">Projects ({matchingProjects.length})</span>
              <div className="space-y-1">
                {matchingProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectSection('projects');
                      onClose();
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.category} • {p.technologies.slice(0, 3).join(', ')}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Secret Administrative Override Option */}
          {isSecretAdminQuery && onOpenAdmin && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-[#ff4d00] uppercase tracking-wider px-2 flex items-center space-x-1">
                <Sliders className="w-3 h-3 text-[#ff4d00]" />
                <span>Encrypted Admin Console Override</span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full p-3.5 rounded-2xl bg-[#ff4d00]/10 hover:bg-[#ff4d00]/20 border border-[#ff4d00]/40 text-left flex items-center justify-between transition-colors font-mono"
              >
                <div>
                  <div className="text-xs font-bold text-[#ff4d00]">Launch Control Console &mdash; Authentication Gate</div>
                  <div className="text-[10px] text-zinc-400">Passcode authentication required for administrative privileges</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#ff4d00]" />
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0B0F19] border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between px-4">
          <span>Command Navigation Matrix</span>
          <span>Use ▲ ▼ to navigate • ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
