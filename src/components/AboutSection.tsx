import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { UserCheck, Shield, Cpu, Target, Terminal, Sparkles, Layers, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { personalInfo } = usePortfolio();

  return (
    <section id="about" className="py-20 bg-black relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="space-y-2 border-b border-zinc-800 pb-6">
          <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
            ENGINEER PROFILE
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            About {personalInfo.name}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
            {personalInfo.bio}
          </p>
        </div>

        {/* Bio & Philosophy Dual Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Avatar & Quick Specs */}
          <div className="lg:col-span-5 space-y-4 font-mono">
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 p-1.5 bg-[#030303] group">
              <img
                src={personalInfo.profileImage || personalInfo.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                alt={personalInfo.name}
                className="w-full h-80 object-cover rounded group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-x-3 bottom-3 p-3 rounded bg-black/90 border border-zinc-800 text-[10px] space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{personalInfo.name.toUpperCase()}</span>
                  <span className="text-emerald-400">{personalInfo.location.toUpperCase()}</span>
                </div>
                <div className="text-zinc-400 font-sans">{personalInfo.title}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#030303] border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500 uppercase text-[10px]">Core Focus:</span>
                <span className="text-white font-bold">LLM Systems & Agents</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500 uppercase text-[10px]">Availability:</span>
                <span className="text-emerald-400 font-bold">{personalInfo.availability}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Core Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Professional Summary */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2 font-mono">
                <Target className="w-5 h-5 text-violet-400" />
                <span>Mission & Engineering Philosophy</span>
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                I believe AI systems should be engineered for reliability, not just impressive demos. My focus is on building applications that remain grounded in trusted information, operate within clearly defined constraints, and produce consistent results in production.
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Rather than relying on increasingly larger models, I design systems that combine retrieval, structured workflows, tool use, and software engineering principles to reduce hallucinations, improve transparency, and keep AI aligned with its intended task.
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono">
              <div className="p-4 rounded-xl bg-[#030303] border border-zinc-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-white font-bold text-xs">
                  <Shield className="w-3.5 h-3.5 text-violet-400" />
                  <span>Reliable Agentic Systems</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Designing multi-step agent workflows with explicit state management, structured tool use, and human oversight where appropriate.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#030303] border border-zinc-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-white font-bold text-xs">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Grounded Retrieval</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Building Retrieval-Augmented Generation (RAG) pipelines that combine embeddings, vector search, and document retrieval to provide responses grounded in trusted data.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#030303] border border-zinc-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-white font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Production-Oriented Engineering</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Developing modular Python backends, APIs, and AI workflows that emphasize maintainability, observability, and cost-conscious deployment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#030303] border border-zinc-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-white font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Practical AI</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Building AI applications that solve real problems through dependable system design rather than relying solely on larger foundation models.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
