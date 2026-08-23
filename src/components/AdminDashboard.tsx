import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AdminProjectsTab } from './admin/AdminProjectsTab';
import { AdminResumeTab } from './admin/AdminResumeTab';
import { AdminSkillsTab } from './admin/AdminSkillsTab';
import { AdminCertificationsTab } from './admin/AdminCertificationsTab';
import { AdminTimelineTab } from './admin/AdminTimelineTab';
import { AdminMediaTab } from './admin/AdminMediaTab';
import { AdminSecurityTab } from './admin/AdminSecurityTab';
import { AdminSecurityGate } from './admin/AdminSecurityGate';
import {
  Layers,
  FileText,
  Cpu,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  Download,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  Lock,
  Shield,
  Clock,
  Menu,
  X,
  Cloud,
  CloudCheck,
  CloudAlert
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onViewLiveSection?: (sectionId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onViewLiveSection
}) => {
  const {
    projects,
    personalInfo,
    skills,
    certifications,
    timeline,
    resetToDefaults,
    exportBackupJSON,
    importBackupJSON,
    isAdminAuthenticated,
    logoutAdmin,
    sessionRemainingSeconds,
    auditLogs,
    cloudSyncStatus,
    lastCloudSyncTime,
    forceSyncToCloud,
    forcePullFromCloud,
    hasEmergencyBackup,
    restoreEmergencyBackup
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'certifications' | 'timeline' | 'media' | 'security'>('profile');
  const [notification, setNotification] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isManualSyncing, setIsManualSyncing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If not authenticated, guard with the Admin Security Gate
  if (!isAdminAuthenticated) {
    return <AdminSecurityGate onClose={onClose} />;
  }

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    const success = await forceSyncToCloud();
    setIsManualSyncing(false);
    if (success) {
      showNotification('Firebase Firestore successfully synced with current data!');
    } else {
      showNotification('Firebase sync encountered an issue. Check connection.');
    }
  };

  const handleManualPull = async () => {
    setIsManualSyncing(true);
    const success = await forcePullFromCloud();
    setIsManualSyncing(false);
    if (success) {
      showNotification('Successfully fetched fresh portfolio data from Firebase!');
    } else {
      showNotification('Failed to pull from cloud or no remote doc found.');
    }
  };

  const handleRestoreEmergency = () => {
    const success = restoreEmergencyBackup();
    if (success) {
      showNotification('Emergency backup restored successfully!');
      handleManualSync();
    } else {
      showNotification('No local emergency backup found.');
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `engine_os_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Engine.OS state exported to JSON');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJSON(content);
      if (success) {
        showNotification('System state restored from JSON backup & autosynced to cloud!');
      } else {
        showNotification('Failed to parse backup JSON. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    resetToDefaults();
    showNotification('Reset to seed datasets.');
  };

  const navModules = [
    { id: 'profile', tag: 'Identity', num: '01', label: 'Profile', sectionCode: 'SECTION_IDENTITY', icon: FileText },
    { id: 'projects', tag: 'Artifacts', num: '02', label: 'Work', sectionCode: 'SECTION_PROJECTS', count: projects.length, icon: Layers },
    { id: 'skills', tag: 'Matrix', num: '03', label: 'Skills', sectionCode: 'SECTION_MATRIX', count: skills.length, icon: Cpu },
    { id: 'certifications', tag: 'Credentials', num: '04', label: 'Certs', sectionCode: 'SECTION_CREDENTIALS', count: certifications.length, icon: ShieldCheck },
    { id: 'timeline', tag: 'Telemetry', num: '05', label: 'Logs', sectionCode: 'SECTION_CHRONO', count: timeline.length, icon: Calendar },
    { id: 'media', tag: 'Assets', num: '06', label: 'Media', sectionCode: 'SECTION_ASSETS', icon: ImageIcon },
    { id: 'security', tag: 'Defense', num: '07', label: 'Security & Key', sectionCode: 'SECTION_DEFENSE', icon: Lock },
  ];

  const currentModule = navModules.find(m => m.id === activeTab) || navModules[0];

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#dfdbd7] font-geist antialiased flex flex-col selection:bg-[#ff4d00] selection:text-[#0d0c0b] p-2 sm:p-4 md:p-5">
      
      {/* Hidden File Input for Backup Import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleImportBackup}
      />

      {/* TACTICAL INTERFACE GRID CONTAINER */}
      <div className="border-2 border-[#2a2826] bg-[#0d0c0b] flex-1 flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER ROW */}
        <header className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b border-[#2a2826] bg-[#0d0c0b]">
          
          {/* Logo and Subroutine Header */}
          <div className="p-3.5 sm:px-6 flex items-center justify-between border-b md:border-b-0 md:border-r border-[#2a2826]">
            <div className="flex items-center space-x-4">
              <span className="font-oswald text-2xl font-bold tracking-widest text-[#ff4d00]">
                E.OS
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-500 font-mono tracking-wider">
                // ARCHITECTURE_CONSOLE_V1
              </span>
            </div>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1.5 border border-[#2a2826] text-zinc-400 hover:text-white"
            >
              {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Header Controls & Status Badges */}
          <div className="flex items-center justify-end px-4 sm:px-6 py-2.5 gap-2.5 font-mono text-xs">
            
            {/* Cloud Sync Status Indicator */}
            <div className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 border text-[10px] uppercase tracking-wider ${
              cloudSyncStatus === 'synced' 
                ? 'bg-[#101b13] border-emerald-800/60 text-emerald-400'
                : cloudSyncStatus === 'syncing'
                ? 'bg-[#1e150a] border-amber-800/60 text-amber-400 animate-pulse'
                : 'bg-[#1f1111] border-red-800/60 text-red-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                cloudSyncStatus === 'synced' ? 'bg-emerald-400' : cloudSyncStatus === 'syncing' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
              <span>
                {cloudSyncStatus === 'synced' ? 'FIREBASE: LIVE' : cloudSyncStatus === 'syncing' ? 'SYNCING...' : 'OFFLINE'}
              </span>
              {lastCloudSyncTime && (
                <span className="text-zinc-500 hidden xl:inline">({lastCloudSyncTime})</span>
              )}
            </div>

            <div className="label-tag bg-[#ff4d00] text-[#0d0c0b] font-bold m-0 px-2.5 py-1 text-[10px] hidden sm:inline-block tracking-wider">
              ENCRYPTED_LINK
            </div>

            {sessionRemainingSeconds !== null && (
              <div className="hidden lg:flex items-center space-x-1.5 text-zinc-400 bg-[#161514] px-2.5 py-1 border border-[#2a2826] text-[10px]">
                <Clock className="w-3 h-3 text-[#ff4d00]" />
                <span>TIMEOUT: {Math.floor(sessionRemainingSeconds / 60)}m {sessionRemainingSeconds % 60}s</span>
              </div>
            )}

            {hasEmergencyBackup && (
              <button
                onClick={handleRestoreEmergency}
                className="px-2.5 py-1.5 border border-amber-600/60 hover:border-amber-400 bg-[#1e170c] text-amber-300 text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
                title="Restore from Local Auto-Backup"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Auto-Backup</span>
              </button>
            )}

            <button
              onClick={handleManualSync}
              disabled={isManualSyncing}
              className="px-2.5 py-1.5 border border-[#2a2826] hover:border-emerald-500/60 bg-[#161514] text-[#dfdbd7] text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
              title="Force Sync to Firebase Firestore"
            >
              <RefreshCw className={`w-3 h-3 text-emerald-400 ${isManualSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Cloud</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 border border-[#2a2826] hover:border-zinc-500 bg-[#161514] text-[#dfdbd7] text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
              title="Import JSON Backup"
            >
              <Upload className="w-3 h-3 text-[#ff4d00]" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-2.5 py-1.5 border border-[#2a2826] hover:border-zinc-500 bg-[#161514] text-[#dfdbd7] text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
              title="Export JSON Backup"
            >
              <Download className="w-3 h-3 text-zinc-300" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-2.5 py-1.5 border border-[#2a2826] hover:border-[#ff4d00]/60 bg-[#161514] text-zinc-400 hover:text-white text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
              title="Lock Session"
            >
              <Lock className="w-3 h-3 text-[#ff4d00]" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] font-bold font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1.5 transition-colors border border-[#ff4d00]"
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </header>

        {/* Sync Notification Banner */}
        {notification && (
          <div className="bg-[#ff4d00]/10 border-b border-[#ff4d00]/40 px-6 py-2 flex items-center justify-between text-xs font-mono text-[#ff4d00] animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-zinc-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3-COLUMN INTERFACE BODY */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[70px_1fr] lg:grid-cols-[70px_1fr_300px] overflow-hidden">
          
          {/* COLUMN 1: VERTICAL TACTICAL NAV */}
          <nav className={`
            border-r border-[#2a2826] bg-[#0d0c0b] flex flex-col justify-start divide-y divide-[#2a2826]
            ${mobileSidebarOpen ? 'block' : 'hidden md:flex'}
          `}>
            {navModules.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`h-20 w-full flex items-center justify-center transition-all uppercase tracking-widest text-[11px] font-mono cursor-pointer relative ${
                    isActive
                      ? 'bg-[#ff4d00] text-[#0d0c0b] font-bold shadow-md'
                      : 'text-zinc-500 hover:text-[#dfdbd7] hover:bg-[#161514]'
                  }`}
                  style={{ writingMode: 'vertical-rl' }}
                  title={tab.label}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[9px] opacity-75 mt-1 font-bold">
                      [{tab.count}]
                    </span>
                  )}
                </button>
              );
            })}

            <div className="flex-1 flex items-end justify-center pb-4">
              <button
                onClick={handleResetData}
                title="Emergency Reset Datasets"
                className="p-2 text-zinc-600 hover:text-[#ff4d00] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>

          {/* COLUMN 2: MAIN CONTENT VIEWPORT */}
          <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-140px)] relative bg-[#0d0c0b]">
            <div className="corner-label absolute top-3 left-4 sm:left-6">
              [{currentModule.sectionCode}]
            </div>

            {/* Tactical Section Title */}
            <div className="mt-4 mb-6">
              <h2 className="font-oswald uppercase text-2xl sm:text-3xl text-white tracking-wide border-l-4 border-[#ff4d00] pl-4 leading-tight">
                {currentModule.label === 'Profile' && 'Executive Profile & Identity'}
                {currentModule.label === 'Work' && 'AI Project Artifacts'}
                {currentModule.label === 'Skills' && 'Core Competency Matrix'}
                {currentModule.label === 'Certs' && 'Verified AI Credentials'}
                {currentModule.label === 'Logs' && 'Career Telemetry Logs'}
                {currentModule.label.includes('Media') && 'Media Assets & Image Hub'}
                {currentModule.label.includes('Security') && 'Security & Cryptographic Defense'}
              </h2>
            </div>

            {/* Active Module Components */}
            <div className="space-y-6">
              {activeTab === 'profile' && <AdminResumeTab />}
              {activeTab === 'projects' && <AdminProjectsTab />}
              {activeTab === 'skills' && <AdminSkillsTab />}
              {activeTab === 'certifications' && <AdminCertificationsTab />}
              {activeTab === 'timeline' && <AdminTimelineTab />}
              {activeTab === 'media' && <AdminMediaTab />}
              {activeTab === 'security' && <AdminSecurityTab />}
            </div>
          </main>

          {/* COLUMN 3: SIDEBAR STATUS PANEL & LOG STREAM */}
          <aside className="hidden lg:flex flex-col border-l border-[#2a2826] bg-[#0f0e0d] divide-y divide-[#2a2826] text-xs font-mono">
            
            {/* CPU Load Metric */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span>CPU_LOAD</span>
                <span className="text-[#ff4d00] font-bold">42%</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2826] overflow-hidden">
                <div className="h-full bg-[#ff4d00] w-[42%] transition-all duration-500" />
              </div>
            </div>

            {/* Memory Sync Metric */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span>MEM_SYNC</span>
                <span className="text-[#ff4d00] font-bold">89%</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2826] overflow-hidden">
                <div className="h-full bg-[#ff4d00] w-[89%] transition-all duration-500" />
              </div>
            </div>

            {/* GPU Cluster Sync */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                <span>GPU_CLUSTER</span>
                <span className="text-[#ff4d00] font-bold">94%</span>
              </div>
              <div className="w-full h-1.5 bg-[#2a2826] overflow-hidden">
                <div className="h-full bg-[#ff4d00] w-[94%] transition-all duration-500" />
              </div>
            </div>

            {/* Node Information */}
            <div className="p-4 space-y-2 text-[10px] text-zinc-400">
              <div className="flex justify-between">
                <span className="text-zinc-500">OPERATOR:</span>
                <span className="text-white truncate max-w-[140px]">{personalInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ROLE_CLASS:</span>
                <span className="text-white truncate max-w-[140px]">{personalInfo.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ARTIFACTS:</span>
                <span className="text-[#ff4d00] font-bold">{projects.length} Registered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">EVENTS:</span>
                <span className="text-white">{auditLogs.length} Logged</span>
              </div>
            </div>

            {/* Cloud Persistence Module */}
            <div className="p-4 space-y-2.5 text-[10px] bg-[#121110]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-bold tracking-wider flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${cloudSyncStatus === 'synced' ? 'bg-emerald-400' : cloudSyncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-red-400'}`} />
                  FIRESTORE CLOUD
                </span>
                <span className={`font-mono text-[9px] uppercase ${cloudSyncStatus === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {cloudSyncStatus === 'synced' ? 'CONNECTED' : cloudSyncStatus === 'syncing' ? 'WRITING...' : 'STANDALONE'}
                </span>
              </div>
              <div className="text-[9px] text-zinc-500 font-mono">
                {lastCloudSyncTime ? `Last synced at ${lastCloudSyncTime}` : 'Autosync active upon edits'}
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={handleManualSync}
                  disabled={isManualSyncing}
                  className="py-1 px-2 bg-[#1a1817] hover:bg-[#252321] border border-[#2a2826] text-zinc-300 hover:text-white text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-2.5 h-2.5 text-emerald-400 ${isManualSyncing ? 'animate-spin' : ''}`} />
                  Push
                </button>
                <button
                  onClick={handleManualPull}
                  disabled={isManualSyncing}
                  className="py-1 px-2 bg-[#1a1817] hover:bg-[#252321] border border-[#2a2826] text-zinc-300 hover:text-white text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-2.5 h-2.5 text-sky-400" />
                  Pull
                </button>
              </div>
            </div>

            {/* Live Log Stream */}
            <div className="p-4 flex-1 flex flex-col justify-start relative">
              <div className="corner-label mb-2">
                [LOG_STREAM]
              </div>
              <div className="text-[10px] leading-relaxed text-zinc-500 font-mono space-y-1 mt-2">
                <div className="text-zinc-400">&gt; SESSION_START: ACTIVE_01</div>
                <div className="text-emerald-400">&gt; AUTHENTICATING... OK</div>
                <div className="text-zinc-400">&gt; LOADING MODULES... 100%</div>
                <div className="text-zinc-400">&gt; NO THREATS DETECTED</div>
                <div className="text-[#ff4d00] animate-pulse">&gt; READY FOR INPUT_</div>
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="text-[9px] text-zinc-600 truncate border-t border-zinc-900 pt-1">
                    &gt; {log.action} [{log.status}]
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>

        {/* FOOTER CELL */}
        <footer className="border-t border-[#2a2826] p-2.5 px-4 sm:px-6 bg-[#0d0c0b] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">
          <span>UNAUTHORIZED ACCESS STRICTLY PROHIBITED</span>
          <span className="hidden md:inline">SECURE_SYSTEM_V.1.0.0 // LOC: 37.7749° N, 122.4194° W</span>
          <span>ENGINE.OS / GLOBAL / 2026</span>
        </footer>

      </div>

    </div>
  );
};
