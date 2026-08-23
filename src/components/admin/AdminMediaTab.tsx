import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  User,
  Layers,
  ShieldCheck,
  Video,
  RefreshCw,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AdminMediaTab: React.FC = () => {
  const {
    personalInfo,
    updatePersonalInfo,
    projects,
    updateProject,
    certifications,
    updateCertification
  } = usePortfolio();

  const [activeMediaSection, setActiveMediaSection] = useState<'profile' | 'projects' | 'certifications'>('profile');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Profile Image File Upload Handler
  const handleProfileFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updatePersonalInfo({
          profileImage: result,
          avatarUrl: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Project Cover Upload Handler
  const handleProjectImageUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateProject(projectId, { coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Cert Badge Upload Handler
  const handleCertImageUpload = (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateCertification(certId, { badgeImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Avatar Presets
  const AVATAR_PRESETS = [
    { label: 'Ernest Zimba (Default Profile)', url: '/src/assets/images/ernest_zimba_profile_1787503261020.jpg' },
    { label: 'AI Researcher', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Tech Lead', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
    { label: 'System Architect', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' }
  ];

  const currentProfileImg = personalInfo.profileImage || personalInfo.avatarUrl || '/src/assets/images/ernest_zimba_profile_1787503261020.jpg';

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#161514] border border-[#2a2826]">
        <div>
          <div className="flex items-center space-x-2 text-[#ff4d00]">
            <ImageIcon className="w-4 h-4" />
            <h2 className="font-syne font-bold uppercase text-sm tracking-wider">Media Assets & Image Manager</h2>
          </div>
          <p className="text-[11px] text-zinc-400 font-geist mt-0.5">
            Upload personal headshots, project cover graphics, and credential badges.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-[#0d0c0b] p-1 border border-[#2a2826]">
          <button
            onClick={() => setActiveMediaSection('profile')}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center space-x-1.5 transition-colors ${
              activeMediaSection === 'profile'
                ? 'bg-[#ff4d00] text-[#0d0c0b]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Photo</span>
          </button>

          <button
            onClick={() => setActiveMediaSection('projects')}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center space-x-1.5 transition-colors ${
              activeMediaSection === 'projects'
                ? 'bg-[#ff4d00] text-[#0d0c0b]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveMediaSection('certifications')}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center space-x-1.5 transition-colors ${
              activeMediaSection === 'certifications'
                ? 'bg-[#ff4d00] text-[#0d0c0b]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cert Badges</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: PROFILE / HEADSHOT PHOTO */}
      {activeMediaSection === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Upload Controls */}
          <div className="p-5 bg-[#161514]/70 border border-[#2a2826] space-y-5">
            <div className="flex justify-between items-center border-b border-[#2a2826] pb-2">
              <span className="label-tag text-[#ff4d00] font-bold">// UPLOAD_PROFILE_IMAGE</span>
              <span className="text-[10px] text-zinc-500 uppercase">HERO & NAVBAR AVATAR</span>
            </div>

            {/* Drag & Drop File Upload Box */}
            <div className="space-y-2">
              <span className="label-tag">UPLOAD_IMAGE_FILE</span>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#2a2826] hover:border-[#ff4d00] bg-[#0d0c0b] cursor-pointer transition-colors group">
                <Upload className="w-8 h-8 text-zinc-500 group-hover:text-[#ff4d00] mb-2 transition-colors" />
                <span className="text-xs font-bold text-zinc-300 group-hover:text-white uppercase">
                  Click or Drop Image File Here
                </span>
                <span className="text-[10px] text-zinc-500 mt-1">
                  Supports PNG, JPG, WEBP, SVG (Auto-converts to Data URL)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct Image URL Input */}
            <div className="space-y-2">
              <span className="label-tag">IMAGE_URL_ENDPOINT</span>
              <input
                type="url"
                value={personalInfo.profileImage || ''}
                onChange={(e) => updatePersonalInfo({ profileImage: e.target.value, avatarUrl: e.target.value })}
                placeholder="https://images.unsplash.com/your-image.jpg"
                className="tactical-input text-xs"
              />
            </div>

            {/* Avatar Presets */}
            <div className="space-y-2 pt-2 border-t border-[#2a2826]">
              <span className="label-tag text-zinc-400">PRESET_AVATARS</span>
              <div className="grid grid-cols-2 gap-2">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => updatePersonalInfo({ profileImage: preset.url, avatarUrl: preset.url })}
                    className={`p-2 border text-left flex items-center space-x-2 bg-[#0d0c0b] transition-colors ${
                      currentProfileImg === preset.url
                        ? 'border-[#ff4d00] text-white'
                        : 'border-[#2a2826] text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-7 h-7 object-cover border border-zinc-700 rounded-sm" />
                    <span className="text-[10px] uppercase font-bold truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset / Remove Button */}
            {personalInfo.profileImage && (
              <div className="pt-2 border-t border-[#2a2826]">
                <button
                  type="button"
                  onClick={() => updatePersonalInfo({ profileImage: '', avatarUrl: '' })}
                  className="px-3 py-1.5 border border-red-900/60 bg-red-950/20 text-red-400 hover:bg-red-900/40 text-xs font-bold uppercase flex items-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default Headshot</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Live Preview Frame */}
          <div className="p-5 bg-[#161514]/70 border border-[#2a2826] space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-[#2a2826] pb-2 mb-4">
                <span className="label-tag text-emerald-400 font-bold">// LIVE_HERO_PREVIEW</span>
                <span className="text-[10px] text-zinc-500 uppercase">PORTFOLIO DISPLAY MODE</span>
              </div>

              {/* Headshot Card Preview */}
              <div className="p-4 bg-[#0d0c0b] border-2 border-[#ff4d00]/60 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <img
                      src={currentProfileImg}
                      alt={personalInfo.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-[#ff4d00] shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#ff4d00] text-[#0d0c0b] p-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="corner-label inline-block text-[9px]">
                      [VERIFIED_HEADSHOT]
                    </span>
                    <h3 className="font-syne font-bold text-white text-base">{personalInfo.name}</h3>
                    <p className="text-zinc-400 text-xs font-geist">{personalInfo.title}</p>
                    <p className="text-emerald-400 text-[10px]">{personalInfo.location}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-[#161514] border border-[#2a2826] text-[11px] text-zinc-400 font-geist">
                  &ldquo;{personalInfo.bio || 'Architecting fault-tolerant LLM infrastructure.'}&rdquo;
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0d0c0b] border border-[#2a2826] text-[10px] text-zinc-400 space-y-1">
              <p className="text-[#ff4d00] font-bold uppercase">// SYSTEM_NOTE</p>
              <p>Your uploaded image stores directly in your browser context state and persists locally. It updates the Hero section, Navbar header, and exported Resume modal automatically.</p>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: PROJECTS COVER IMAGES */}
      {activeMediaSection === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-[#161514]/70 border border-[#2a2826] space-y-3">
                <div className="flex justify-between items-center border-b border-[#2a2826] pb-2">
                  <span className="font-syne font-bold text-white truncate max-w-[200px]">{project.title}</span>
                  <span className="label-tag text-[9px] text-[#ff4d00] m-0">{project.category}</span>
                </div>

                <div className="flex space-x-3">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-24 h-16 object-cover border border-[#2a2826] shrink-0"
                  />

                  <div className="space-y-2 flex-1">
                    <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0d0c0b] hover:bg-[#ff4d00] text-zinc-300 hover:text-[#0d0c0b] border border-[#2a2826] hover:border-[#ff4d00] cursor-pointer transition-colors w-full justify-center text-xs font-bold uppercase">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProjectImageUpload(project.id, e)}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={project.coverImage}
                      onChange={(e) => updateProject(project.id, { coverImage: e.target.value })}
                      placeholder="Cover Image URL..."
                      className="tactical-input text-[10px] py-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: CERTIFICATION BADGES */}
      {activeMediaSection === 'certifications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-4 bg-[#161514]/70 border border-[#2a2826] space-y-3">
              <div className="flex justify-between items-center border-b border-[#2a2826] pb-2">
                <span className="font-syne font-bold text-white truncate">{cert.title}</span>
                <span className="text-[10px] text-zinc-500">{cert.institution}</span>
              </div>

              <div className="flex space-x-3">
                <img
                  src={cert.badgeImage}
                  alt={cert.title}
                  className="w-16 h-16 object-cover border border-[#2a2826] shrink-0"
                />

                <div className="space-y-2 flex-1">
                  <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0d0c0b] hover:bg-[#ff4d00] text-zinc-300 hover:text-[#0d0c0b] border border-[#2a2826] hover:border-[#ff4d00] cursor-pointer transition-colors w-full justify-center text-xs font-bold uppercase">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Badge Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCertImageUpload(cert.id, e)}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    value={cert.badgeImage}
                    onChange={(e) => updateCertification(cert.id, { badgeImage: e.target.value })}
                    placeholder="Badge Image URL..."
                    className="tactical-input text-[10px] py-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
