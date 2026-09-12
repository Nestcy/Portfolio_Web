import React, { useState } from 'react';
import { X, ExternalLink, Github, Youtube, Cpu, CheckCircle2, ShieldAlert, Lightbulb, Sparkles, Layers, ArrowRight, Code } from 'lucide-react';
import { Project } from '../types';
import { ArchitectureDiagram } from './ArchitectureDiagram';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'challenges' | 'code'>('overview');

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl my-8 bg-black border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-200 max-h-[90vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0 font-mono">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-violet-400 font-bold uppercase">
                {project.category}
              </span>
              <span className="text-zinc-500">ID: {project.slug}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{project.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-black border-b border-zinc-800 flex items-center space-x-2 shrink-0 overflow-x-auto font-mono text-[11px]">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'challenges', label: 'Tradeoffs & Metrics' },
            { id: 'code', label: 'Implementation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 uppercase tracking-wider rounded border transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-black font-bold border-white'
                  : 'text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700 bg-zinc-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 grow bg-[#050505]">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cover Image & Links */}
              <div className="relative rounded-lg overflow-hidden border border-zinc-800 group">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-56 sm:h-72 object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-5">
                  <div className="flex flex-wrap items-center gap-2.5 w-full">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-mono uppercase font-semibold flex items-center space-x-2 rounded transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>

                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-mono uppercase font-bold flex items-center space-x-2 rounded transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}

                    {project.videoDemoUrl && (
                      <a
                        href={project.videoDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/80 text-red-300 text-xs font-mono uppercase font-semibold flex items-center space-x-2 rounded transition-all"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                        <span>Video Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/60 p-px rounded-lg overflow-hidden">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 bg-black text-center font-mono">
                    <div className="text-lg font-bold text-emerald-400">{m.value}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Problem & Solution Dual Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-950/10 border border-red-900/40 space-y-2">
                  <div className="flex items-center space-x-2 text-red-400 font-mono font-bold text-xs uppercase">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>THE PROBLEM</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{project.problem}</p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/10 border border-emerald-900/40 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>HOW IT WORKS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{project.solution}</p>
                </div>
              </div>

              {/* Video Walkthrough Player Section */}
              {project.videoDemoUrl && (
                <div className="p-4 bg-black border border-zinc-800 rounded-lg space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase">
                      <Youtube className="w-4 h-4 text-rose-500" />
                      <span>DEMO VIDEO WALKTHROUGH</span>
                    </div>
                    <a
                      href={project.videoDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-zinc-400 hover:text-white flex items-center space-x-1 uppercase"
                    >
                      <span>Open External Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {project.videoDemoUrl.startsWith('data:video') || project.videoDemoUrl.includes('dropbox.com') || project.videoDemoUrl.includes('.mp4') || project.videoDemoUrl.endsWith('.webm') ? (
                    <video
                      src={project.videoDemoUrl.includes('dropbox.com') ? project.videoDemoUrl.replace('dl=0', 'raw=1').replace('dl=1', 'raw=1') : project.videoDemoUrl}
                      controls
                      className="w-full max-h-[380px] object-contain bg-black rounded-lg border border-zinc-800 shadow-xl"
                    />
                  ) : project.videoDemoUrl.includes('youtube.com') || project.videoDemoUrl.includes('youtu.be') ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-800 shadow-xl">
                      <iframe
                        src={project.videoDemoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        title={`${project.title} Video Demo`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between text-xs text-zinc-300">
                      <span>Video Demo Available: {project.videoDemoUrl}</span>
                      <a
                        href={project.videoDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold uppercase text-[10px] flex items-center space-x-1.5"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                        <span>Watch Demo</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Engineering Decisions */}
              {project.engineeringDecisions && (
                <div className="p-4 rounded-lg bg-violet-950/10 border border-violet-900/40 space-y-2">
                  <div className="flex items-center space-x-2 text-violet-400 font-mono font-bold text-xs uppercase">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>ENGINEERING DECISIONS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{project.engineeringDecisions}</p>
                </div>
              )}

              {/* Technologies Tag Grid */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">STACK</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lessons Learned */}
              <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Key Architectural Insights</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                  {project.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="leading-relaxed">{lesson}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Architecture Diagram */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <ArchitectureDiagram nodes={project.architectureNodes} />
              <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-300 space-y-1.5 font-mono">
                <span className="text-violet-400 font-bold uppercase text-[10px]">Dataflow Specification:</span>
                <p className="leading-relaxed font-sans text-xs text-zinc-400">{project.architectureDescription}</p>
              </div>
            </div>
          )}

          {/* Tab 3: Technical Challenges */}
          {activeTab === 'challenges' && (
            <div className="space-y-3 font-mono text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Production Engineering Tradeoffs</h4>
              {project.technicalChallenges.map((challenge, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-black border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{challenge.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 text-[10px] border border-emerald-500/30">
                      {challenge.metricImpact}
                    </span>
                  </div>
                  <p className="text-xs font-sans text-zinc-400 leading-relaxed">{challenge.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Code Snippet */}
          {activeTab === 'code' && project.codeSnippet && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center space-x-2">
                  <Code className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-zinc-200">{project.codeSnippet.filename}</span>
                </span>
                <span className="text-[10px] uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                  {project.codeSnippet.language}
                </span>
              </div>

              <div className="p-4 rounded-lg bg-black border border-zinc-800 text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                <pre>{project.codeSnippet.code}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500 shrink-0">
          <span>SPECIFICATION_VERIFIED // {project.slug}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-mono uppercase text-[10px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
