import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Cpu, Bot, Database, Server, Cloud, Code2, HardDrive, Layers, Zap, Eye, Binary, Workflow, Sparkles } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI Agents', 'LLMs', 'Deep Learning', 'Machine Learning', 'Backend', 'Databases', 'DevOps'];

  const filteredSkills = skills.filter(skill => 
    selectedCategory === 'All' || skill.category === selectedCategory
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return Cpu;
      case 'Bot': return Bot;
      case 'Database': return Database;
      case 'Workflow': return Workflow;
      case 'Zap': return Zap;
      case 'Binary': return Binary;
      case 'Eye': return Eye;
      case 'Server': return Server;
      case 'Cloud': return Cloud;
      case 'Layers': return Layers;
      case 'HardDrive': return HardDrive;
      case 'Code2': return Code2;
      default: return Sparkles;
    }
  };

  return (
    <section id="skills" className="py-20 bg-[#030303] relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
              TECHNICAL PROFICIENCY MATRIX
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              AI & Infrastructure Stack
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
              Categorized breakdown of technical proficiencies across LLM fine-tuning, RAG retrieval, multi-agent frameworks, CUDA acceleration, and cloud MLOps.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 shrink-0 font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs transition-all uppercase tracking-wider ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
            const IconComponent = getIcon(skill.iconName);
            return (
              <div
                key={skill.name}
                className="p-5 rounded-xl bg-black border border-zinc-800 hover:border-zinc-700 transition-all duration-200 space-y-3 font-mono"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-sans">{skill.name}</h3>
                      <span className="text-[10px] text-zinc-500">{skill.category}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase bg-zinc-950 border border-zinc-800 text-emerald-400">
                    {skill.level}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {skill.description}
                </p>


              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
