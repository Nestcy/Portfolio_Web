import React, { useState } from 'react';
import { Mail, Linkedin, Github, Twitter, MapPin, FileText, Send, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import confetti from 'canvas-confetti';

interface ContactSectionProps {
  onOpenResume: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
  const { personalInfo } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleType: 'Staff / Lead AI Engineer Role',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const quickTopics = [
    "Staff / Lead AI Engineering Role",
    "AI Architecture Consulting & RAG",
    "Multi-Agent Swarm System Design",
    "Speaking & Technical Advisory"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setFormData({ name: '', email: '', roleType: 'Staff / Lead AI Engineer Role', message: '' });
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 bg-[#030303] relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
            DIRECT INQUIRIES
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Initiate Contact
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Interested in hiring {personalInfo.name} for a Staff / Lead AI position, seeking system design advisory, or discussing production RAG architectures? Drop a line below.
          </p>
        </div>

        {/* Dual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-xl bg-black border border-zinc-800 space-y-5 font-mono">
              
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white font-sans">Contact Information</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Fastest response via email. Available for PST, EST, and European timezone alignments.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-300">
                <a href={`mailto:${personalInfo.email}`} className="flex items-center space-x-2.5 p-2.5 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="truncate">{personalInfo.email}</span>
                </a>

                <div className="flex items-center space-x-2.5 p-2.5 rounded bg-zinc-950 border border-zinc-800">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="pt-1 flex flex-wrap gap-2">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors uppercase tracking-wider"
                >
                  <Github className="w-3.5 h-3.5 text-zinc-400" />
                  <span>GitHub</span>
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors uppercase tracking-wider"
                >
                  <Linkedin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>LinkedIn</span>
                </a>

                {personalInfo.twitter && (
                  <a
                    href={personalInfo.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors uppercase tracking-wider"
                  >
                    <Twitter className="w-3.5 h-3.5 text-zinc-400" />
                    <span>X / Twitter</span>
                  </a>
                )}
              </div>

              {/* Download Resume Button */}
              <div className="pt-3 border-t border-zinc-800">
                <button
                  onClick={onOpenResume}
                  className="w-full py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all uppercase tracking-wider"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Download Resume (PDF)</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 font-mono">
            <div className="p-6 rounded-xl bg-black border border-zinc-800 space-y-5">
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-sans">Send a Direct Message</h3>
                <p className="text-xs text-zinc-500 font-sans">Directly populates {personalInfo.name}'s priority inbox queue.</p>
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-zinc-500">Topic Selection:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, roleType: topic }))}
                      className={`px-2.5 py-1 rounded text-xs transition-all uppercase ${
                        formData.roleType === topic
                          ? 'bg-white text-black font-bold'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {sentSuccess ? (
                <div className="p-5 rounded-xl bg-zinc-950 border border-emerald-500/30 text-center space-y-3 font-sans">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Message Transmitted Successfully</h4>
                  <p className="text-xs text-zinc-400">
                    Thank you for reaching out. {personalInfo.name} typically responds to recruitment & technical inquiries within 12 hours.
                  </p>
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Sarah Chen"
                        className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-600 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="sarah@company.com"
                        className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-600 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 uppercase">Message Details *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Detail your role requirements, system architecture needs, or project timeline..."
                      className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-600 resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-2.5 rounded bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sending ? 'Transmitting...' : 'Send Message'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
