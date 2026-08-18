import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Award, Trophy, BookOpen, ShieldCheck, CheckCircle2, ArrowUpDown } from 'lucide-react';

const parseTimelineYear = (yearStr: string): number => {
  if (!yearStr) return 0;
  const isPresent = /present|current|now/i.test(yearStr);
  const numbers = yearStr.match(/\d{4}/g);
  
  if (numbers && numbers.length > 0) {
    const start = parseInt(numbers[0], 10);
    return start * 1000 + (isPresent ? 999 : 0);
  }
  
  if (isPresent) {
    return 999999;
  }
  
  return 0;
};

export const TimelineSection: React.FC = () => {
  const { timeline } = usePortfolio();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const types = ['All', 'Career', 'Research', 'Hackathon', 'Certification', 'Achievement'];

  const filteredTimeline = timeline
    .filter(item => selectedType === 'All' || item.type === selectedType)
    .sort((a, b) => {
      const yearA = parseTimelineYear(a.year);
      const yearB = parseTimelineYear(b.year);
      return sortDirection === 'desc' ? yearB - yearA : yearA - yearB;
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Career': return Briefcase;
      case 'Research': return BookOpen;
      case 'Hackathon': return Trophy;
      case 'Certification': return ShieldCheck;
      case 'Achievement': return Award;
      default: return Award;
    }
  };

  return (
    <section id="timeline" className="py-20 bg-black relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
              MILESTONES & LEADERSHIP
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              Career Timeline & Track Record
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
              Chronological milestone track detailing staff AI engineering leadership, global hackathon victories, and academic research fellowship impact.
            </p>
          </div>

          {/* Type Filters & Chronological Sort Toggle */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono">
            <button
              type="button"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 rounded text-xs transition-all uppercase tracking-wider bg-zinc-950 text-[#ff4d00] border border-[#ff4d00]/50 hover:bg-[#ff4d00] hover:text-[#0d0c0b] font-bold flex items-center space-x-1.5"
              title="Toggle Chronological Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortDirection === 'asc' ? 'Chronological (Past → Present)' : 'Reverse (Present → Past)'}</span>
            </button>

            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded text-xs transition-all uppercase tracking-wider ${
                  selectedType === type
                    ? 'bg-white text-black font-bold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-zinc-800 ml-3 sm:ml-6 space-y-8 pl-5 sm:pl-8">
          {filteredTimeline.map((item) => {
            const IconComponent = getTypeIcon(item.type);
            return (
              <div key={item.id} className="relative group">
                
                {/* Timeline Dot Icon */}
                <div className="absolute -left-[27px] sm:-left-[39px] top-1 w-8 h-8 rounded bg-zinc-950 border border-zinc-700 text-zinc-300 flex items-center justify-center shadow">
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Timeline Card */}
                <div className="p-5 rounded-xl bg-[#030303] border border-zinc-800 hover:border-zinc-700 transition-all duration-200 shadow-xl space-y-3 font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-[10px] text-violet-400 font-bold">{item.year}</span>
                      <h3 className="text-base font-bold text-white tracking-tight font-sans">{item.title}</h3>
                      <div className="text-xs text-zinc-400 font-sans">{item.organization}</div>
                    </div>

                    <span className="self-start sm:self-center px-2 py-0.5 rounded text-[9px] font-semibold uppercase bg-zinc-950 text-zinc-400 border border-zinc-800">
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {item.description}
                  </p>

                  {/* Impact Highlight Pill */}
                  {item.impact && (
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-emerald-400 flex items-center space-x-2 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span><strong className="font-mono uppercase text-[10px] text-zinc-400">Impact //</strong> {item.impact}</span>
                    </div>
                  )}

                  {/* Skills Used */}
                  {item.skillsUsed && item.skillsUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.skillsUsed.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
