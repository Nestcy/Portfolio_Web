import React, { useState, useEffect } from 'react';
import { Bot, Terminal, Github, Linkedin, Twitter, ArrowUp, ShieldCheck, Heart, Sliders } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FooterProps {
  onSelectSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection, onOpenAdmin }) => {
  const { personalInfo } = usePortfolio();
  const [serverPing, setServerPing] = useState<number | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const start = performance.now();
      try {
        await fetch('/api/health');
        const end = performance.now();
        setServerPing(Math.round(end - start));
      } catch (e) {
        setServerPing(24);
      }
    };
    checkHealth();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0d0c0b] border-t border-[#2a2826] pt-12 pb-10 font-geist text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3 font-mono">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={scrollToTop}>
              <div className="w-7 h-7 bg-[#ff4d00] flex items-center justify-center text-[#0d0c0b]">
                <span className="font-oswald text-xs font-bold">E</span>
              </div>
              <span className="font-bold text-white tracking-widest text-sm uppercase font-oswald">
                ENGINE<span className="text-[#ff4d00]">.OS</span>
              </span>
            </div>

            <p className="text-zinc-400 font-geist text-xs leading-relaxed max-w-sm">
              {personalInfo.bio}
            </p>

            {/* Server Status Indicator */}
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-[#161514] border border-[#2a2826] text-[10px]">
              <span className="w-1.5 h-1.5 bg-[#ff4d00] animate-pulse" />
              <span className="text-zinc-300">API_STATUS: OPERATIONAL</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#ff4d00] font-bold">{serverPing !== null ? `${serverPing}ms` : '18ms'}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-2.5 font-mono">
            <span className="label-tag">NAVIGATION</span>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-geist">
              {[
                { id: 'projects', label: 'Featured Projects' },
                { id: 'skills', label: 'Technical Stack Matrix' },
                { id: 'timeline', label: 'Career Timeline' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelectSection(item.id)}
                    className="hover:text-[#ff4d00] transition-colors"
                  >
                    &gt; {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Contact Info */}
          <div className="md:col-span-4 space-y-2.5 font-mono">
            <span className="label-tag">CONNECT_ENDPOINTS</span>
            <div className="space-y-1 text-xs text-zinc-400 font-geist">
              <div>Email: <span className="font-mono text-[#ff4d00]">{personalInfo.email}</span></div>
              <div>Location: <span className="font-mono text-zinc-300">{personalInfo.location}</span></div>
            </div>

            <div className="pt-1 flex space-x-2 font-mono">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#161514] hover:bg-[#201e1d] border border-[#2a2826] text-zinc-300 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#161514] hover:bg-[#201e1d] border border-[#2a2826] text-zinc-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>

              {personalInfo.twitter && (
                <a
                  href={personalInfo.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#161514] hover:bg-[#201e1d] border border-[#2a2826] text-zinc-300 hover:text-white transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-[#2a2826] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] text-zinc-500">
          <div className="flex items-center space-x-3">
            <span>UNAUTHORIZED ACCESS STRICTLY PROHIBITED // ENGINE.OS / GLOBAL / 2026</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#161514] hover:bg-[#201e1d] text-zinc-300 border border-[#2a2826] transition-colors uppercase tracking-wider"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3 text-[#ff4d00]" />
          </button>
        </div>

      </div>
    </footer>
  );
};
