import React, { useState } from 'react';
import { usePortfolio, WorkExperienceItem, EducationItem } from '../../context/PortfolioContext';
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  Download,
  Check,
  Briefcase,
  GraduationCap,
  Eye,
  User,
  ExternalLink,
  ShieldAlert,
  Upload,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const AdminResumeTab: React.FC = () => {
  const {
    personalInfo,
    updatePersonalInfo,
    workExperience,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    education,
    addEducation,
    updateEducation,
    deleteEducation,
    skills,
    certifications
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'experience' | 'education' | 'preview'>('profile');
  const [copied, setCopied] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [expToDelete, setExpToDelete] = useState<WorkExperienceItem | null>(null);
  const [eduToDelete, setEduToDelete] = useState<EducationItem | null>(null);

  // Plain-text CV generator
  const generatePlaintextCV = () => {
    return `===================================================================
CURRICULUM VITAE: ${personalInfo.name.toUpperCase()}
${personalInfo.title}
Location: ${personalInfo.location} | Email: ${personalInfo.email}
GitHub: ${personalInfo.github} | LinkedIn: ${personalInfo.linkedin}
===================================================================

EXECUTIVE SUMMARY:
${personalInfo.bio}

CORE BENCHMARKS & STATS:
${personalInfo.stats.map(s => `• ${s.label}: ${s.value}`).join('\n')}

PROFESSIONAL EXPERIENCE:
${workExperience.map(exp => `
${exp.role.toUpperCase()} — ${exp.company} (${exp.period})
Location: ${exp.location || 'Remote'}
${exp.points.map(pt => `  * ${pt}`).join('\n')}`).join('\n')}

EDUCATION & RESEARCH:
${education.map(edu => `
• ${edu.degree} — ${edu.institution} (${edu.year})
  ${edu.details || ''}`).join('\n')}

VERIFIED CERTIFICATIONS:
${certifications.map(c => `• ${c.title} — ${c.institution} (${c.issueDate})`).join('\n')}

KEY TECHNICAL SKILLS:
${skills.map(s => `${s.name} (${s.level})`).join(', ')}
`;
  };

  const handleCopyPlaintext = () => {
    navigator.clipboard.writeText(generatePlaintextCV());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = `# ${personalInfo.name}
**${personalInfo.title}**  
*${personalInfo.location} | ${personalInfo.email}*  
[GitHub](${personalInfo.github}) | [LinkedIn](${personalInfo.linkedin})

---

## Executive Summary
${personalInfo.bio}

## Key Metrics
${personalInfo.stats.map(s => `- **${s.label}**: \`${s.value}\``).join('\n')}

## Work Experience
${workExperience.map(exp => `
### ${exp.role} — ${exp.company}
*${exp.period} | ${exp.location || 'Remote'}*
${exp.points.map(pt => `- ${pt}`).join('\n')}
`).join('\n')}

## Education
${education.map(edu => `
### ${edu.degree}
*${edu.institution} | ${edu.year}*
${edu.details || ''}
`).join('\n')}

## Certifications
${certifications.map(c => `- **${c.title}** — ${c.institution} (\`${c.issueDate}\`)`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.name.toLowerCase().replace(/\s+/g, '_')}_cv.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const subTabs = [
    { id: 'profile', num: '01', label: 'Identity Matrix', icon: User },
    { id: 'experience', num: '02', label: 'Work History', icon: Briefcase },
    { id: 'education', num: '03', label: 'Degrees & Research', icon: GraduationCap },
    { id: 'preview', num: '04', label: 'Raw Telemetry CV', icon: Eye },
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Subroutine Tab Switcher */}
      <div className="flex flex-wrap border border-[#2a2826] bg-[#161514] w-fit">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 sm:px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-r border-[#2a2826] last:border-r-0 flex items-center space-x-2 ${
                isActive
                  ? 'bg-[#ff4d00] text-[#0d0c0b] font-bold'
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              <span className={`text-[10px] ${isActive ? 'text-[#0d0c0b] font-extrabold' : 'text-[#ff4d00]'}`}>{tab.num}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE IDENTITY */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          
          {/* Main Grid: Parameters on Left, Node Stats on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            
            {/* Parameters Panel */}
            <div className="border border-[#2a2826] p-5 sm:p-6 bg-[#161514]/60 space-y-4">
              <div className="flex justify-between items-center border-b border-[#2a2826] pb-3">
                <span className="label-tag">// PARAM_IDENTITY</span>
                <span className="text-[10px] text-zinc-500 uppercase">SYS_REV: 2026.4</span>
              </div>

              {/* PROFILE IMAGE & AVATAR UPLOADER */}
              <div className="p-3.5 bg-[#0d0c0b] border border-[#2a2826] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="label-tag text-[#ff4d00] m-0 font-bold">// PROFILE_IMAGE_ASSET</span>
                  <span className="text-[10px] text-zinc-500 uppercase">HERO & NAVBAR AVATAR</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={personalInfo.profileImage || personalInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt="Profile Avatar"
                    className="w-16 h-16 object-cover border-2 border-[#ff4d00] shrink-0"
                  />

                  <div className="space-y-2 w-full">
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] text-xs font-bold font-mono uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const res = ev.target?.result as string;
                                updatePersonalInfo({ profileImage: res, avatarUrl: res });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {personalInfo.profileImage && (
                        <button
                          type="button"
                          onClick={() => updatePersonalInfo({ profileImage: '', avatarUrl: '' })}
                          className="px-3 py-1.5 border border-red-900/60 bg-red-950/20 text-red-400 hover:bg-red-900/40 text-xs font-bold font-mono uppercase transition-colors"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <input
                      type="url"
                      value={personalInfo.profileImage || ''}
                      onChange={(e) => updatePersonalInfo({ profileImage: e.target.value, avatarUrl: e.target.value })}
                      className="tactical-input text-[11px] py-1"
                      placeholder="Or paste image URL (e.g. https://.../photo.jpg)"
                    />
                  </div>
                </div>
              </div>

              {/* OP_NAME and ROLE_ID in side-by-side or stacked format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="label-tag">OP_NAME</span>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                    className="tactical-input"
                    placeholder="E.g. Alex Rivera"
                  />
                </div>

                <div>
                  <span className="label-tag">ROLE_ID</span>
                  <input
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                    className="tactical-input"
                    placeholder="E.g. Staff AI Systems Architect"
                  />
                </div>

                <div>
                  <span className="label-tag">COMMS_CHANNEL</span>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    className="tactical-input text-[#ff4d00]"
                    placeholder="alex@rivera.ai"
                  />
                </div>

                <div>
                  <span className="label-tag">LOC_SECTOR</span>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    className="tactical-input"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <span className="label-tag">OBJ_SUMMARY</span>
                <textarea
                  rows={4}
                  value={personalInfo.bio}
                  onChange={(e) => updatePersonalInfo({ bio: e.target.value })}
                  className="tactical-input leading-relaxed resize-none text-[12px]"
                  placeholder="System design focus, distributed clusters, inference latency optimizations..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="label-tag">GITHUB_ENDPOINT</span>
                  <input
                    type="text"
                    value={personalInfo.github}
                    onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                    className="tactical-input text-xs"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <span className="label-tag">LINKEDIN_ENDPOINT</span>
                  <input
                    type="text"
                    value={personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                    className="tactical-input text-xs"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              {/* HERO SECTION CONFIGURATION */}
              <div className="pt-4 border-t border-[#2a2826] space-y-4">
                <div className="flex justify-between items-center border-b border-[#2a2826] pb-2">
                  <span className="label-tag text-[#ff4d00] font-bold">// HERO_SECTION_CONFIG</span>
                  <span className="text-[10px] text-zinc-500 uppercase">HERO SECTION PARAMETERS</span>
                </div>

                <div>
                  <span className="label-tag">HERO_TITLE</span>
                  <input
                    type="text"
                    value={personalInfo.heroTitle || 'Building Intelligent Systems, Not Just Software.'}
                    onChange={(e) => updatePersonalInfo({ heroTitle: e.target.value })}
                    className="tactical-input font-bold text-white"
                    placeholder="E.g. Building Intelligent Systems, Not Just Software."
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Tip: Use a comma to highlight the second clause in orange accent.</p>
                </div>

                <div>
                  <span className="label-tag">HERO_SUBTITLE</span>
                  <textarea
                    rows={3}
                    value={personalInfo.heroSubtitle || ''}
                    onChange={(e) => updatePersonalInfo({ heroSubtitle: e.target.value })}
                    className="tactical-input leading-relaxed resize-none text-[12px]"
                    placeholder="Lead AI System Architect specializing in high-scale LLM architectures..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="label-tag">SYS_AVAILABILITY_TAG</span>
                    <input
                      type="text"
                      value={personalInfo.availability}
                      onChange={(e) => updatePersonalInfo({ availability: e.target.value })}
                      className="tactical-input text-emerald-400"
                      placeholder="Open for Staff AI Roles, Advisory & System Consulting"
                    />
                  </div>

                  <div>
                    <span className="label-tag">HERO_TECH_STACK (COMMA SEPARATED)</span>
                    <input
                      type="text"
                      value={personalInfo.heroTechStack ? personalInfo.heroTechStack.join(', ') : 'PyTorch, LangGraph, Pinecone, CUDA, Rust, vLLM'}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const chips = raw.split(',').map(s => s.trimStart());
                        updatePersonalInfo({ heroTechStack: chips });
                      }}
                      onBlur={(e) => {
                        const raw = e.target.value;
                        const chips = raw.split(',').map(s => s.trim()).filter(Boolean);
                        updatePersonalInfo({ heroTechStack: chips });
                      }}
                      className="tactical-input text-xs"
                      placeholder="PyTorch, LangGraph, Pinecone, CUDA, Rust, vLLM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="label-tag">PRIMARY_CTA_TEXT</span>
                    <input
                      type="text"
                      value={personalInfo.heroCtaPrimaryText || 'View Projects'}
                      onChange={(e) => updatePersonalInfo({ heroCtaPrimaryText: e.target.value })}
                      className="tactical-input text-xs"
                      placeholder="View Projects"
                    />
                  </div>

                  <div>
                    <span className="label-tag">SECONDARY_CTA_TEXT</span>
                    <input
                      type="text"
                      value={personalInfo.heroCtaSecondaryText || 'Resume CV'}
                      onChange={(e) => updatePersonalInfo({ heroCtaSecondaryText: e.target.value })}
                      className="tactical-input text-xs"
                      placeholder="Resume CV"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Status Card */}
            <div className="border border-[#2a2826] p-5 sm:p-6 bg-[#161514]/60 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#2a2826] pb-3">
                  <span className="label-tag">// EXPORT_TELEMETRY</span>
                  <span className="text-[10px] text-[#ff4d00] font-bold">READY</span>
                </div>

                <div className="space-y-3 text-[11px]">
                  <div>
                    <span className="label-tag">PRIMARY_DISCIPLINE</span>
                    <div className="text-white font-bold text-sm mt-0.5">Distributed LLM & Inference</div>
                  </div>

                  <div>
                    <span className="label-tag">DEPLOYMENT_STATUS</span>
                    <div className="text-[#ff4d00] font-bold">Active // Available for Contract/Staff</div>
                  </div>

                  <div>
                    <span className="label-tag">SECURITY_CLEARANCE</span>
                    <div className="text-emerald-400">Level 4 // Root Console</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={handleCopyPlaintext}
                  className="w-full py-2.5 px-3 bg-[#161514] hover:bg-zinc-900 border border-[#2a2826] text-white font-mono text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#ff4d00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Plaintext CV'}</span>
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="w-full py-2.5 px-3 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-mono text-[11px] uppercase font-bold tracking-wider transition-colors flex items-center justify-center space-x-2 border border-[#ff4d00]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD CV</span>
                </button>
              </div>
            </div>

          </div>

          {/* System Metrics Benchmarks */}
          <div className="border border-[#2a2826] p-5 bg-[#161514]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2826] pb-3">
              <span className="label-tag">// PERFORMANCE_BENCHMARKS ({personalInfo.stats.length})</span>
              <button
                type="button"
                onClick={() => {
                  updatePersonalInfo({
                    stats: [...personalInfo.stats, { label: 'AGENT_THROUGHPUT', value: '18.4M/s' }]
                  });
                }}
                className="px-2.5 py-1 bg-[#2a2826] hover:bg-[#ff4d00] hover:text-[#0d0c0b] text-white text-[10px] uppercase font-bold transition-colors"
              >
                + Add Metric
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {personalInfo.stats.map((stat, idx) => (
                <div key={idx} className="border border-[#2a2826] bg-[#0d0c0b] p-3 relative group">
                  <div className="mb-1">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...personalInfo.stats];
                        updated[idx].label = e.target.value;
                        updatePersonalInfo({ stats: updated });
                      }}
                      className="w-full bg-transparent text-[10px] text-zinc-400 uppercase tracking-wider outline-none focus:text-[#ff4d00]"
                    />
                  </div>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...personalInfo.stats];
                      updated[idx].value = e.target.value;
                      updatePersonalInfo({ stats: updated });
                    }}
                    className="w-full bg-transparent font-oswald text-2xl font-bold text-white outline-none focus:text-[#ff4d00]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updatePersonalInfo({
                        stats: personalInfo.stats.filter((_, i) => i !== idx)
                      });
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1"
                    title="Remove Metric"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WORK EXPERIENCE */}
      {activeSubTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#161514] border border-[#2a2826]">
            <div>
              <span className="label-tag">// WORK_POSITIONS ({workExperience.length})</span>
              <p className="text-zinc-500 text-[11px] mt-1">Tactical production engineering history and impact telemetry.</p>
            </div>
            <button
              onClick={() => {
                const item: WorkExperienceItem = {
                  id: `exp-${Date.now()}`,
                  company: 'AI Research Labs',
                  role: 'Principal Systems Architect',
                  period: '2025 - PRESENT',
                  location: 'San Francisco, CA',
                  points: [
                    'Built automated evaluation rigs processing 10k synthetic tasks per hour.'
                  ]
                };
                addWorkExperience(item);
                setEditingExpId(item.id);
              }}
              className="px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-bold text-xs uppercase flex items-center space-x-1.5 border border-[#ff4d00]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>

          <div className="space-y-3">
            {workExperience.map((exp) => {
              const isEditing = editingExpId === exp.id;
              return (
                <div key={exp.id} className="p-5 bg-[#161514]/70 border border-[#2a2826] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2a2826] pb-2.5">
                    <div>
                      <div className="font-oswald text-lg font-bold text-white uppercase tracking-wide">{exp.role}</div>
                      <div className="text-[11px] text-[#ff4d00]">{exp.company} &bull; {exp.location || 'Remote'}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-[#0d0c0b] border border-[#2a2826] text-zinc-300 text-[10px]">
                        {exp.period}
                      </span>
                      <button
                        onClick={() => setEditingExpId(isEditing ? null : exp.id)}
                        className="p-1 border border-[#2a2826] text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpToDelete(exp)}
                        className="p-1 border border-[#2a2826] text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        title="Delete Position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <span className="label-tag">ROLE_TITLE</span>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateWorkExperience(exp.id, { role: e.target.value })}
                            className="tactical-input text-xs"
                            placeholder="e.g. Lead AI Systems Architect"
                          />
                        </div>
                        <div>
                          <span className="label-tag">ORG_ENTITY</span>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                            className="tactical-input text-xs"
                            placeholder="e.g. Cognitive Scale AI"
                          />
                        </div>
                        <div>
                          <span className="label-tag">LOCATION</span>
                          <input
                            type="text"
                            value={exp.location || ''}
                            onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                            className="tactical-input text-xs"
                            placeholder="e.g. San Francisco, CA / Remote"
                          />
                        </div>
                        <div>
                          <span className="label-tag">TIMEFRAME</span>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => updateWorkExperience(exp.id, { period: e.target.value })}
                            className="tactical-input text-xs text-[#ff4d00]"
                            placeholder="e.g. 2025 - Present"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="label-tag">KEY_ACHIEVEMENTS</span>
                        {exp.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center space-x-2">
                            <span className="text-[#ff4d00]">&gt;</span>
                            <input
                              type="text"
                              value={pt}
                              onChange={(e) => {
                                const newPoints = [...exp.points];
                                newPoints[pIdx] = e.target.value;
                                updateWorkExperience(exp.id, { points: newPoints });
                              }}
                              className="tactical-input text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                updateWorkExperience(exp.id, {
                                  points: exp.points.filter((_, i) => i !== pIdx)
                                });
                              }}
                              className="p-1 text-zinc-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            updateWorkExperience(exp.id, {
                              points: [...exp.points, '']
                            });
                          }}
                          className="px-2.5 py-1 text-[10px] uppercase bg-[#2a2826] hover:bg-zinc-700 text-white font-mono"
                        >
                          + Add Bullet Point
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-1 text-zinc-300 text-xs leading-relaxed">
                      {exp.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#ff4d00] mt-0.5">&gt;</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CREDENTIALS */}
      {activeSubTab === 'education' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#161514] border border-[#2a2826]">
            <div>
              <span className="label-tag">// ACADEMIC_CREDENTIALS ({education.length})</span>
              <p className="text-zinc-500 text-[11px] mt-1">Research fellowships, master programs, and neural systems theory.</p>
            </div>
            <button
              onClick={() => {
                const item: EducationItem = {
                  id: `edu-${Date.now()}`,
                  degree: 'M.S. in Computer Science & AI',
                  institution: 'Stanford University',
                  year: '2024 - 2026',
                  details: 'Research focus on low-rank adaptation and distributed gradient consensus.'
                };
                addEducation(item);
                setEditingEduId(item.id);
              }}
              className="px-3 py-1.5 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-bold text-xs uppercase flex items-center space-x-1.5 border border-[#ff4d00]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="p-5 bg-[#161514]/70 border border-[#2a2826] space-y-3">
                <div className="flex items-center justify-between border-b border-[#2a2826] pb-2.5">
                  <div>
                    <h4 className="font-oswald text-base font-bold text-white uppercase">{edu.degree}</h4>
                    <div className="text-[11px] text-zinc-400">{edu.institution} ({edu.year})</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingEduId(editingEduId === edu.id ? null : edu.id)}
                      className="p-1 border border-[#2a2826] text-zinc-400 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEduToDelete(edu)}
                      className="p-1 border border-[#2a2826] text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      title="Delete Academic Credential"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingEduId === edu.id ? (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Degree Title"
                        className="tactical-input text-xs"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder="University / Institute"
                        className="tactical-input text-xs"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                        placeholder="Graduation Year"
                        className="tactical-input text-xs text-[#ff4d00]"
                      />
                    </div>
                    <input
                      type="text"
                      value={edu.details || ''}
                      onChange={(e) => updateEducation(edu.id, { details: e.target.value })}
                      placeholder="Specialization, thesis, or honors..."
                      className="tactical-input text-xs"
                    />
                  </div>
                ) : (
                  edu.details && <p className="text-xs text-zinc-400 leading-relaxed">&gt; {edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RAW TELEMETRY PREVIEW */}
      {activeSubTab === 'preview' && (
        <div className="p-6 bg-[#0d0c0b] border border-[#2a2826] space-y-4">
          <div className="flex justify-between items-center border-b border-[#2a2826] pb-3">
            <span className="label-tag">// RAW_CV_STREAM</span>
            <span className="text-[#ff4d00] text-[10px]">FORMAT: UTF-8</span>
          </div>
          <pre className="p-4 bg-[#161514] border border-[#2a2826] text-zinc-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {generatePlaintextCV()}
          </pre>
        </div>
      )}

      {/* Confirmation Modals for Deletions */}
      <DeleteConfirmModal
        isOpen={Boolean(expToDelete)}
        title={`Delete Position`}
        itemType="Work Experience Position"
        itemTitle={expToDelete ? `${expToDelete.role} at ${expToDelete.company}` : ''}
        onClose={() => setExpToDelete(null)}
        onConfirm={() => {
          if (expToDelete) {
            deleteWorkExperience(expToDelete.id);
            setExpToDelete(null);
          }
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(eduToDelete)}
        title={`Delete Academic Credential`}
        itemType="Education Record"
        itemTitle={eduToDelete ? `${eduToDelete.degree} - ${eduToDelete.institution}` : ''}
        onClose={() => setEduToDelete(null)}
        onConfirm={() => {
          if (eduToDelete) {
            deleteEducation(eduToDelete.id);
            setEduToDelete(null);
          }
        }}
      />

    </div>
  );
};
