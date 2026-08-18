import React, { useState, useEffect } from 'react';
import { Bot, Terminal, Command, FileText, Sparkles, Menu, X, ArrowUpRight, Sliders, Shield } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenCommandPalette: () => void;
  onOpenResume: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  onOpenCommandPalette,
  onOpenResume,
}) => {
  const { personalInfo } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: Array<{ id: string; label: string; badge?: string }> = [
    { id: 'projects', label: 'Architecture' },
    { id: 'about', label: 'Profile' },
    { id: 'skills', label: 'Stack' },
    { id: 'timeline', label: 'Logs' },
    { id: 'contact', label: 'Deployment' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-[#0d0c0b]/95 backdrop-blur-md border-b border-[#2a2826] py-2.5 shadow-2xl' 
        : 'bg-[#0d0c0b]/70 backdrop-blur-sm border-b border-[#2a2826]/70 py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          
          {/* Logo & Node Status */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('hero')}>
            <img
              src={personalInfo.profileImage || personalInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
              alt={personalInfo.name}
              className="w-7 h-7 object-cover border border-[#ff4d00] shadow-sm"
            />
            <div className="flex items-center space-x-3">
              <span className="font-bold tracking-widest text-white uppercase text-xs font-oswald">
                ENGINE<span className="text-[#ff4d00]">.OS</span>
              </span>
              <div className="hidden md:flex items-center space-x-2 px-2.5 py-0.5 bg-[#161514] border border-[#2a2826] text-[10px] text-zinc-400 font-mono">
                <span className="w-1.5 h-1.5 bg-[#ff4d00] animate-pulse" />
                <span>SYS_READY</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[11px] font-mono uppercase tracking-[0.15em] text-zinc-400">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors relative py-1 ${
                    isActive 
                      ? 'text-[#ff4d00] border-b-2 border-[#ff4d00] font-bold' 
                      : 'hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 px-1 py-0.2 text-[9px] bg-[#ff4d00]/10 text-[#ff4d00] border border-[#ff4d00]/30 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Cmd + K Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-[#161514] border border-[#2a2826] hover:border-zinc-500 text-zinc-400 hover:text-white text-[10px] font-mono transition-all"
              title="Command Palette (Cmd+K)"
            >
              <Command className="w-3 h-3 text-zinc-400" />
              <span>CMD K</span>
            </button>

            {/* Resume Button */}
            <button
              onClick={onOpenResume}
              className="px-3 py-1.5 border border-[#2a2826] bg-[#161514] hover:bg-[#201e1d] text-zinc-300 hover:text-white text-[11px] font-mono uppercase tracking-wider transition-colors"
            >
              <span>CV.pdf</span>
            </button>

            {/* Hire CTA */}
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden sm:flex items-center space-x-1 px-3.5 py-1.5 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] text-[11px] font-mono font-bold uppercase tracking-wider transition-colors shadow-sm border border-[#ff4d00]"
            >
              <span>Hire Agent</span>
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 bg-[#161514] border border-[#2a2826] text-zinc-400 lg:hidden hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-[#161514] border border-[#2a2826] shadow-2xl space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2 uppercase tracking-wider border transition-all text-[10px] ${
                    activeSection === item.id
                      ? 'bg-[#ff4d00] text-[#0d0c0b] border-[#ff4d00] font-bold'
                      : 'bg-[#0d0c0b] text-zinc-400 border-[#2a2826] hover:border-zinc-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="pt-2 border-t border-[#2a2826] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenCommandPalette}
                  className="flex items-center space-x-1.5 text-[10px] text-zinc-400 px-2.5 py-1.5 bg-[#0d0c0b] border border-[#2a2826] font-mono"
                >
                  <Command className="w-3 h-3" />
                  <span>CMD K</span>
                </button>
                <button
                  onClick={onOpenResume}
                  className="flex items-center space-x-1.5 text-[10px] text-zinc-400 px-2.5 py-1.5 bg-[#0d0c0b] border border-[#2a2826] font-mono uppercase"
                >
                  <span>CV</span>
                </button>
              </div>
              
              <button
                onClick={() => handleNavClick('contact')}
                className="px-4 py-1.5 bg-[#ff4d00] text-[#0d0c0b] font-bold uppercase text-[10px] tracking-wider"
              >
                Hire Agent
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
