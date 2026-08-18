import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, Printer, ExternalLink, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { personalInfo, workExperience, education, projects, certifications, skills } = usePortfolio();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const summaryText = `
${personalInfo.name.toUpperCase()} - ${personalInfo.title}
Email: ${personalInfo.email} | Location: ${personalInfo.location}
GitHub: ${personalInfo.github} | LinkedIn: ${personalInfo.linkedin}

EXECUTIVE SUMMARY:
${personalInfo.bio}

CORE BENCHMARKS:
${personalInfo.stats.map(s => `• ${s.label}: ${s.value}`).join('\n')}

EXPERIENCE:
${workExperience.map(exp => `
${exp.role} — ${exp.company} (${exp.period})
${exp.points.map(pt => `  * ${pt}`).join('\n')}`).join('\n')}

EDUCATION:
${education.map(edu => `• ${edu.degree} — ${edu.institution} (${edu.year})`).join('\n')}

INDUSTRY CERTIFICATIONS (VERIFIABLE CREDENTIALS):
${certifications.map(c => `• ${c.title} — ${c.institution} (${c.issueDate})\n  Credential ID: ${c.credentialId}\n  Verifiable Source: ${c.credentialUrl}\n  Verified Skills: ${c.skillsVerified.join(', ')}`).join('\n\n')}

CORE SKILLS:
${skills.map(s => s.name).join(', ')}
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    // Attempt printing in a clean dedicated printable popup window
    try {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${personalInfo.name} - Resume</title>
              <meta charset="utf-8" />
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
                body {
                  font-family: 'Space Grotesk', system-ui, sans-serif;
                  color: #111827;
                  background: #ffffff;
                  margin: 0;
                  padding: 32px;
                  font-size: 12px;
                  line-height: 1.5;
                }
                .header {
                  border-bottom: 2px solid #ea580c;
                  padding-bottom: 12px;
                  margin-bottom: 20px;
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                }
                h1 {
                  font-family: 'Oswald', sans-serif;
                  font-size: 26px;
                  text-transform: uppercase;
                  margin: 0 0 2px 0;
                  color: #000;
                  letter-spacing: 0.02em;
                }
                .title {
                  color: #ea580c;
                  font-weight: 700;
                  font-size: 13px;
                }
                .contact {
                  text-align: right;
                  font-size: 11px;
                  color: #4b5563;
                }
                .section-title {
                  font-family: 'Oswald', sans-serif;
                  font-size: 13px;
                  text-transform: uppercase;
                  color: #ea580c;
                  border-bottom: 1px solid #e5e7eb;
                  padding-bottom: 4px;
                  margin-top: 18px;
                  margin-bottom: 10px;
                  letter-spacing: 0.05em;
                }
                .exp-card {
                  margin-bottom: 14px;
                }
                .exp-header {
                  display: flex;
                  justify-content: space-between;
                  font-weight: 700;
                  font-size: 13px;
                }
                .period {
                  color: #ea580c;
                  font-weight: 600;
                }
                ul {
                  margin: 4px 0 0 0;
                  padding-left: 16px;
                }
                li {
                  margin-bottom: 3px;
                }
                .grid-2 {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 10px;
                }
                .stat-box {
                  background: #f9fafb;
                  border: 1px solid #e5e7eb;
                  padding: 8px 12px;
                  border-radius: 4px;
                }
                .stat-val {
                  font-family: 'Oswald', sans-serif;
                  font-size: 16px;
                  color: #ea580c;
                  font-weight: bold;
                }
                .stat-lbl {
                  font-size: 10px;
                  text-transform: uppercase;
                  color: #6b7280;
                }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <h1>${personalInfo.name}</h1>
                  <div class="title">${personalInfo.title}</div>
                  <div style="color: #6b7280; font-size: 11px;">${personalInfo.location}</div>
                </div>
                <div class="contact">
                  <div>Email: ${personalInfo.email}</div>
                  <div>GitHub: ${personalInfo.github}</div>
                  <div>LinkedIn: ${personalInfo.linkedin}</div>
                </div>
              </div>

              <div class="section-title">EXECUTIVE SUMMARY</div>
              <p style="margin-top:0;">${personalInfo.bio}</p>

              <div class="section-title">CORE BENCHMARKS</div>
              <div class="grid-2">
                ${personalInfo.stats.map(s => `
                  <div class="stat-box">
                    <div class="stat-lbl">${s.label}</div>
                    <div class="stat-val">${s.value}</div>
                  </div>
                `).join('')}
              </div>

              <div class="section-title">WORK EXPERIENCE</div>
              ${workExperience.map(exp => `
                <div class="exp-card">
                  <div class="exp-header">
                    <span>${exp.role} — ${exp.company} ${exp.location ? `(${exp.location})` : ''}</span>
                    <span class="period">${exp.period}</span>
                  </div>
                  <ul>
                    ${exp.points.map(pt => `<li>${pt}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}

              ${education.length > 0 ? `
                <div class="section-title">ACADEMIC CREDENTIALS</div>
                <div class="grid-2">
                  ${education.map(edu => `
                    <div class="stat-box">
                      <strong style="display:block; font-size:12px;">${edu.degree}</strong>
                      <span style="color:#6b7280;">${edu.institution} (${edu.year})</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="section-title">INDUSTRY CERTIFICATIONS (VERIFIABLE CREDENTIALS)</div>
              <div class="grid-2">
                ${certifications.map(c => `
                  <div class="stat-box" style="margin-bottom: 6px;">
                    <strong style="display:block; font-size:12px; color:#111;">${c.title}</strong>
                    <div style="color:#4b5563; font-size:11px; margin-top:2px;">
                      <span>${c.institution} • Issued ${c.issueDate}</span>
                    </div>
                    <div style="font-size:10px; color:#374151; margin-top:2px;">
                      <span>Credential ID: <code style="background:#e5e7eb; padding:1px 4px; border-radius:2px;">${c.credentialId}</code></span>
                    </div>
                    <div style="margin-top: 4px;">
                      <a href="${c.credentialUrl}" target="_blank" rel="noopener noreferrer" style="color:#ea580c; font-size:10px; font-weight:600; text-decoration:underline;">
                        Verify Credential: ${c.credentialUrl} ↗
                      </a>
                    </div>
                    ${c.skillsVerified && c.skillsVerified.length > 0 ? `
                      <div style="font-size:9px; color:#6b7280; margin-top:3px;">
                        Verified Skills: ${c.skillsVerified.join(', ')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>

              <div class="section-title">FEATURED PRODUCTION SYSTEMS</div>
              <div class="grid-2">
                ${projects.slice(0, 4).map(p => `
                  <div class="stat-box">
                    <strong style="display:block; font-size:12px;">${p.title}</strong>
                    <span style="color:#6b7280;">${p.subtitle}</span>
                    ${p.githubUrl ? `
                      <div style="margin-top:2px;">
                        <a href="${p.githubUrl}" target="_blank" style="color:#ea580c; font-size:9px; text-decoration:underline;">GitHub: ${p.githubUrl}</a>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>

              <div class="section-title">CORE SKILLS & TECHNOLOGIES</div>
              <p style="margin-top:0; color:#374151;">${skills.map(s => s.name).join(', ')}</p>

              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 250);
                };
              </script>
            </body>
          </html>
        `);
        printWin.document.close();
        return;
      }
    } catch (e) {
      console.warn('Popup blocked, falling back to direct window.print()');
    }

    // Direct window print fallback
    window.print();
  };

  const handleDownloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${personalInfo.name} - Resume</title>
  <meta charset="utf-8" />
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; max-width: 820px; margin: 30px auto; padding: 24px; line-height: 1.6; font-size: 13px; }
    h1 { font-size: 26px; text-transform: uppercase; margin-bottom: 2px; color: #000; }
    .title { color: #ea580c; font-weight: bold; margin-bottom: 8px; font-size: 14px; }
    .contact { font-size: 12px; color: #4b5563; margin-bottom: 16px; }
    .section-title { font-size: 13px; text-transform: uppercase; color: #ea580c; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; letter-spacing: 0.05em; }
    .card { background: #f9fafb; border: 1px solid #e5e7eb; padding: 10px 14px; border-radius: 4px; margin-bottom: 10px; }
    a { color: #ea580c; text-decoration: underline; }
    ul { padding-left: 20px; margin: 4px 0; }
    li { margin-bottom: 3px; }
  </style>
</head>
<body>
  <h1>${personalInfo.name}</h1>
  <div class="title">${personalInfo.title} | ${personalInfo.location}</div>
  <div class="contact">Email: ${personalInfo.email} | GitHub: ${personalInfo.github} | LinkedIn: ${personalInfo.linkedin}</div>
  
  <div class="section-title">Executive Summary</div>
  <p>${personalInfo.bio}</p>

  <div class="section-title">Work Experience</div>
  ${workExperience.map(exp => `
    <div class="card">
      <div style="display:flex; justify-content:space-between; font-weight:bold;">
        <span>${exp.role} — ${exp.company} ${exp.location ? `(${exp.location})` : ''}</span>
        <span style="color:#ea580c;">${exp.period}</span>
      </div>
      <ul>
        ${exp.points.map(pt => `<li>${pt}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <div class="section-title">Academic Credentials</div>
  ${education.map(edu => `
    <div class="card" style="margin-bottom:6px;">
      <strong>${edu.degree}</strong> — ${edu.institution} (${edu.year})
    </div>
  `).join('')}

  <div class="section-title">Industry Certifications (Verifiable Credentials)</div>
  ${certifications.map(c => `
    <div class="card">
      <div style="display:flex; justify-content:space-between; font-weight:bold;">
        <span>${c.title}</span>
        <span style="color:#ea580c;">Issued: ${c.issueDate}</span>
      </div>
      <div style="font-size:12px; color:#4b5563; margin-top:2px;">${c.institution}</div>
      <div style="font-size:11px; margin-top:3px;">
        <strong>Credential ID:</strong> <code>${c.credentialId}</code>
      </div>
      <div style="font-size:11px; margin-top:3px;">
        <strong>Verifiable Link:</strong> <a href="${c.credentialUrl}" target="_blank" rel="noopener noreferrer">${c.credentialUrl} ↗</a>
      </div>
      ${c.skillsVerified && c.skillsVerified.length > 0 ? `
        <div style="font-size:11px; color:#6b7280; margin-top:3px;">
          <strong>Skills:</strong> ${c.skillsVerified.join(', ')}
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div class="section-title">Core Skills</div>
  <p>${skills.map(s => s.name).join(', ')}</p>
</body>
</html>
    `.trim();

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0c0b]/85 backdrop-blur-md overflow-y-auto font-geist">
      <div 
        id="resume-modal-container"
        className="relative w-full max-w-4xl my-8 bg-[#0d0c0b] border border-[#2a2826] shadow-2xl overflow-hidden text-[#dfdbd7] max-h-[90vh] flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-[#161514] border-b border-[#2a2826] flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#0d0c0b] border border-[#2a2826] text-[#ff4d00]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-oswald uppercase">{personalInfo.name} - TELEMETRY_CV_SPEC</h2>
              <span className="text-[10px] text-zinc-400 font-mono">{personalInfo.title}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="px-2.5 py-1 bg-[#161514] hover:bg-zinc-800 border border-[#2a2826] text-zinc-200 text-xs font-semibold flex items-center space-x-1 transition-colors uppercase text-[10px]"
              title="Copy Plaintext CV"
            >
              {copied ? <Check className="w-3 h-3 text-[#ff4d00]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Plaintext'}</span>
            </button>

            <button
              onClick={handleDownloadHTML}
              className="px-2.5 py-1 bg-[#161514] hover:bg-zinc-800 border border-[#2a2826] text-zinc-200 text-xs font-semibold flex items-center space-x-1 transition-colors uppercase text-[10px]"
              title="Download Offline HTML Document"
            >
              <Download className="w-3 h-3 text-zinc-400" />
              <span>Download HTML</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-bold text-xs flex items-center space-x-1 transition-colors uppercase text-[10px] border border-[#ff4d00]"
              title="Print to PDF or Printer"
            >
              <Printer className="w-3 h-3" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-[#161514] text-zinc-400 hover:text-white border border-[#2a2826]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content View */}
        <div className="p-6 overflow-y-auto space-y-6 font-geist text-xs text-zinc-300 leading-relaxed bg-[#0d0c0b]">
          
          {/* Header Info Block */}
          <div className="border-b border-[#2a2826] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={personalInfo.profileImage || personalInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={personalInfo.name}
                className="w-16 h-16 object-cover border-2 border-[#ff4d00] shrink-0"
              />
              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-oswald uppercase text-white tracking-wide">{personalInfo.name}</h1>
                <p className="text-[#ff4d00] font-mono text-xs font-semibold">{personalInfo.title}</p>
                <p className="text-zinc-500 text-xs font-mono">{personalInfo.location}</p>
              </div>
            </div>

            <div className="space-y-0.5 text-right font-mono text-zinc-400 text-[11px]">
              <div>Email: {personalInfo.email}</div>
              <div>GitHub: {personalInfo.github}</div>
              <div>LinkedIn: {personalInfo.linkedin}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1.5">
            <span className="label-tag">EXECUTIVE_SUMMARY</span>
            <p className="p-3.5 bg-[#161514] border border-[#2a2826] text-zinc-300 leading-relaxed font-geist text-xs">
              {personalInfo.bio}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {personalInfo.stats.map((s, idx) => (
              <div key={idx} className="p-2.5 bg-[#161514] border border-[#2a2826] font-mono">
                <div className="text-[9px] text-zinc-500 uppercase">{s.label}</div>
                <div className="text-base font-bold font-oswald text-[#ff4d00]">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className="space-y-3">
            <span className="label-tag">WORK_EXPERIENCE</span>
            
            <div className="space-y-3">
              {workExperience.map((exp) => (
                <div key={exp.id} className="p-3.5 bg-[#161514] border border-[#2a2826] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-white">
                    <div className="font-oswald uppercase text-sm tracking-wide flex items-center space-x-2">
                      <span>{exp.role} — {exp.company}</span>
                      {exp.location && (
                        <span className="text-zinc-400 font-mono font-normal text-xs normal-case">
                          • {exp.location}
                        </span>
                      )}
                    </div>
                    <span className="text-[#ff4d00] font-mono text-xs">{exp.period}</span>
                  </div>
                  <ul className="space-y-1 text-zinc-300 text-xs">
                    {exp.points.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#ff4d00]">&gt;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-2">
              <span className="label-tag">ACADEMIC_CREDENTIALS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3 bg-[#161514] border border-[#2a2826] space-y-0.5">
                    <div className="font-bold text-white text-xs uppercase font-oswald">{edu.degree}</div>
                    <div className="text-[11px] text-zinc-400">{edu.institution} ({edu.year})</div>
                    {edu.details && <div className="text-[10px] text-zinc-500">&gt; {edu.details}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Projects */}
          <div className="space-y-2">
            <span className="label-tag">FEATURED_SYSTEMS</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {projects.slice(0, 4).map(p => (
                <div key={p.id} className="p-3 bg-[#161514] border border-[#2a2826] space-y-0.5">
                  <div className="font-bold text-white text-xs uppercase font-oswald">{p.title}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2">&gt; {p.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-1.5">
            <span className="label-tag">INDUSTRY_CERTIFICATIONS (VERIFIABLE_CREDENTIALS)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 font-mono text-[10px]">
              {certifications.map(c => (
                <div key={c.id} className="p-2.5 bg-[#161514] border border-[#2a2826] flex flex-col justify-between space-y-1.5">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-white leading-tight font-sans">{c.title}</span>
                      <span className="text-[#ff4d00] font-bold shrink-0">{c.issueDate}</span>
                    </div>
                    <div className="text-zinc-400 text-[9px] mt-0.5">{c.institution} • ID: {c.credentialId}</div>
                  </div>

                  <div className="pt-1 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-zinc-500 text-[9px]">Official Verification</span>
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ff4d00] hover:text-[#ff7733] font-bold text-[9px] flex items-center space-x-0.5 underline uppercase"
                    >
                      <span>Verify Source</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5 inline" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-3 bg-[#161514] border-t border-[#2a2826] flex items-center justify-between text-[10px] font-mono text-zinc-500 shrink-0 no-print">
          <span>SECURE_SYSTEM_V.1.0.0 // ENGINE.OS</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#0d0c0b] hover:bg-[#201e1d] text-white font-mono text-[10px] font-bold uppercase border border-[#2a2826]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
