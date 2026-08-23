import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ShieldCheck, ExternalLink, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  const { certifications } = usePortfolio();

  return (
    <section id="certifications" className="py-20 bg-[#030303] relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="space-y-2 border-b border-zinc-800 pb-6">
          <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
            VERIFIED CREDENTIALS
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Industry Certifications & Credentials
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
            Official machine learning, deep learning, and agentic AI professional certifications issued by IBM & Coursera.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-xl bg-black border border-zinc-800 hover:border-zinc-700 transition-all duration-200 space-y-3 font-mono flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{cert.institution}</span>
                    <h3 className="text-base font-bold text-white font-sans">{cert.title}</h3>
                  </div>

                  <div className="w-10 h-10 rounded overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <img src={cert.badgeImage} alt={cert.institution} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
                  <span>ISSUED // {cert.issueDate}</span>
                  <span>•</span>
                  <span>ID // {cert.credentialId}</span>
                </div>

                {/* Verified Skills Tags */}
                <div className="flex flex-wrap gap-1 pt-1 font-sans">
                  {cert.skillsVerified.map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 flex items-center space-x-1 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                <span className="text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED</span>
                </span>

                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center space-x-1 transition-colors uppercase"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
