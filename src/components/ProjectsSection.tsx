import React, { useState } from 'react';
import { Project } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { Search, Github, ExternalLink, Youtube, FileText, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { ProjectDetailsModal } from './ProjectDetailsModal';

export const ProjectsSection: React.FC = () => {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'RAG', 'Multi-Agent', 'LLM Platform', 'MLOps', 'Edge AI'];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-[#0d0c0b] relative border-t border-[#2a2826] font-geist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2a2826] pb-6">
          <div className="space-y-2">
            <div className="corner-label inline-block">
              [SECTION_PROJECTS] // PRODUCTION_AI_SYSTEMS
            </div>
            <h2 className="font-oswald uppercase text-2xl sm:text-4xl text-white tracking-wide border-l-4 border-[#ff4d00] pl-4">
              Production AI Systems
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl font-geist">
              Engineered and benchmarked for zero-data-loss streaming, sub-100ms vector retrieval, and distributed agent execution.
            </p>
          </div>

          {/* Search Input */}
          <div className="shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by tech (Qdrant, vLLM, CUDA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 pl-9 pr-4 py-1.5 bg-[#161514] border border-[#2a2826] text-zinc-200 placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#ff4d00]"
              />
            </div>
          </div>
        </div>

        {/* Filter Category Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#ff4d00] text-[#0d0c0b] font-bold border-[#ff4d00]'
                  : 'bg-[#161514] text-zinc-400 hover:text-white border-[#2a2826] hover:border-zinc-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="bg-[#161514] border border-[#2a2826] hover:border-[#ff4d00]/70 transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              <div>
                {/* Header Metadata Bar */}
                <div className="px-4 py-2 bg-[#0d0c0b] border-b border-[#2a2826] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#ff4d00] font-bold uppercase">FEATURED_ARTIFACT.0{idx + 1}</span>
                  <span className="text-zinc-500 uppercase">{project.category}</span>
                </div>

                {/* Cover Image */}
                <div className="relative h-44 overflow-hidden bg-black cursor-pointer" onClick={() => setSelectedProject(project)}>
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161514] via-[#161514]/30 to-transparent" />
                  
                  {/* Primary Metric Tag */}
                  {project.metrics[0] && (
                    <div className="absolute bottom-3 right-3 bg-[#0d0c0b]/90 backdrop-blur border border-[#2a2826] px-2.5 py-1 text-right font-mono">
                      <div className="text-[9px] text-zinc-500 uppercase">{project.metrics[0].label}</div>
                      <div className="text-xs font-bold text-[#ff4d00]">{project.metrics[0].value}</div>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <h3 
                    onClick={() => setSelectedProject(project)}
                    className="font-oswald uppercase text-lg font-bold text-white hover:text-[#ff4d00] cursor-pointer transition-colors leading-tight tracking-wide"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-geist">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-[#2a2826] bg-[#0d0c0b] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#161514] hover:bg-zinc-800 border border-[#2a2826] text-zinc-400 hover:text-white transition-colors"
                    title="GitHub Repository"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#161514] hover:bg-zinc-800 border border-[#2a2826] text-zinc-300 hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.videoDemoUrl && (
                    <a
                      href={project.videoDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#161514] hover:bg-zinc-800 border border-[#2a2826] text-red-400 hover:text-red-300 transition-colors"
                      title="Demo Video"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="px-3 py-1 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-bold font-mono uppercase text-[10px] tracking-wider transition-colors flex items-center space-x-1 border border-[#ff4d00]"
                >
                  <span>Specs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
