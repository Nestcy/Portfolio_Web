import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Shield,
  KeyRound,
  Lock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Download,
  Trash2,
  Search,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Sliders
} from 'lucide-react';
import { calculatePasswordStrength } from '../../utils/security';

export const AdminSecurityTab: React.FC = () => {
  const {
    securitySettings,
    updateSecuritySettings,
    changePasscode,
    auditLogs,
    clearAuditLogs,
    exportAuditLogsJSON,
    logoutAdmin,
    sessionRemainingSeconds
  } = usePortfolio();

  // Passcode change form state
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscodes, setShowPasscodes] = useState(false);
  const [passcodeLoading, setPasscodeLoading] = useState(false);
  const [passcodeSuccess, setPasscodeSuccess] = useState<string | null>(null);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Audit log filter state
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');

  const passwordStrength = calculatePasswordStrength(newPasscode);

  const handlePasscodeChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    setPasscodeSuccess(null);

    if (!currentPasscode) {
      setPasscodeError('Please enter your current passcode.');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setPasscodeError('New passcode and confirmation do not match.');
      return;
    }

    if (newPasscode.length < 6) {
      setPasscodeError('New passcode must be at least 6 characters long.');
      return;
    }

    setPasscodeLoading(true);
    try {
      const res = await changePasscode(currentPasscode, newPasscode);
      if (res.success) {
        setPasscodeSuccess(res.message);
        setCurrentPasscode('');
        setNewPasscode('');
        setConfirmPasscode('');
      } else {
        setPasscodeError(res.message);
      }
    } catch (err: any) {
      setPasscodeError(err?.message || 'Error changing passcode');
    } finally {
      setPasscodeLoading(false);
    }
  };

  const handleExportLogs = () => {
    const jsonStr = exportAuditLogsJSON();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `security_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearLogs = () => {
    clearAuditLogs();
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = logFilter === 'ALL' || log.status === logFilter;
    const matchesSearch = logSearch === '' ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.timestamp.includes(logSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Section Title & Security Telemetry Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0a0a0a] border border-[#f0f0f0]/20">
        <div>
          <div className="label-tech text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-1">
            // Access Defense & Key Management
          </div>
          <h2 className="text-lg font-syne font-bold text-white uppercase tracking-tight flex items-center space-x-2">
            <span>Security & Cryptographic Controls</span>
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Configure administrative passcodes, inactivity timeouts, brute-force rate limiters, and inspect cryptographic audit logs.
          </p>
        </div>

        {/* Instant Lock Button */}
        <div className="flex items-center space-x-2 font-mono">
          <button
            onClick={logoutAdmin}
            className="px-4 py-2 bg-zinc-950 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-800 text-zinc-300 hover:text-rose-300 text-xs font-bold flex items-center space-x-2 transition-colors uppercase tracking-wider"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock Session</span>
          </button>
        </div>
      </div>

      {/* Security Health Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-[#0a0a0a] border border-[#f0f0f0]/20 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>Passcode Hash</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff4d00]" />
          </div>
          <div className="text-sm font-bold text-white font-syne">SHA-256 + Salt</div>
          <div className="text-[10px] text-[#ff4d00]">Cryptographically Protected</div>
        </div>

        <div className="p-4 bg-[#0a0a0a] border border-[#f0f0f0]/20 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>Session Timeout</span>
            <Clock className="w-3.5 h-3.5 text-zinc-300" />
          </div>
          <div className="text-sm font-bold text-white font-syne">
            {securitySettings.sessionTimeoutMinutes > 0 ? `${securitySettings.sessionTimeoutMinutes} Minutes` : 'Disabled'}
          </div>
          <div className="text-[10px] text-zinc-400">
            {sessionRemainingSeconds ? `Active: ~${Math.floor(sessionRemainingSeconds / 60)}m left` : 'Detection armed'}
          </div>
        </div>

        <div className="p-4 bg-[#0a0a0a] border border-[#f0f0f0]/20 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>Brute-Force Guard</span>
            <ShieldAlert className="w-3.5 h-3.5 text-[#ff4d00]" />
          </div>
          <div className="text-sm font-bold text-white font-syne">
            {securitySettings.maxFailedAttempts} Max Attempts
          </div>
          <div className="text-[10px] text-[#ff4d00]">
            {securitySettings.lockoutDurationSeconds}s Auto Lockout
          </div>
        </div>

        <div className="p-4 bg-[#0a0a0a] border border-[#f0f0f0]/20 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>Security Audit Log</span>
            <Activity className="w-3.5 h-3.5 text-zinc-300" />
          </div>
          <div className="text-sm font-bold text-white font-syne">{auditLogs.length} Events</div>
          <div className="text-[10px] text-zinc-400">Real-time Telemetry</div>
        </div>
      </div>

      {/* Two Column Layout: Passcode Change & Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Passcode Management Card */}
        <div className="p-6 bg-[#0a0a0a] border border-[#f0f0f0]/20 space-y-5 font-mono">
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
            <KeyRound className="w-4 h-4 text-[#ff4d00]" />
            <h3 className="font-syne font-bold text-white text-sm uppercase">Rotate Master Passcode</h3>
          </div>

          <form onSubmit={handlePasscodeChange} className="space-y-4 text-xs">
            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Current Master Passcode</label>
              <div className="relative">
                <input
                  type={showPasscodes ? 'text' : 'password'}
                  value={currentPasscode}
                  onChange={(e) => setCurrentPasscode(e.target.value)}
                  placeholder="Enter current passcode..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-[#ff4d00] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">New Master Passcode</label>
              <input
                type={showPasscodes ? 'text' : 'password'}
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="Enter new passcode (min 6 chars)..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-[#ff4d00] focus:outline-none"
                required
              />
              {newPasscode && (
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">Strength: {passwordStrength.level}</span>
                  <div className="w-24 h-1 bg-zinc-800 overflow-hidden">
                    <div className={`h-full ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="label-tech text-[10px] text-zinc-500 mb-1">Confirm New Passcode</label>
              <input
                type={showPasscodes ? 'text' : 'password'}
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Re-enter new passcode..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-[#ff4d00] focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPasscodes(!showPasscodes)}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center space-x-1"
              >
                {showPasscodes ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPasscodes ? 'Hide Passcodes' : 'Show Passcodes'}</span>
              </button>

              <button
                type="submit"
                disabled={passcodeLoading || !currentPasscode || !newPasscode}
                className="px-4 py-2 bg-[#ff4d00] hover:bg-[#ff6622] text-white font-bold text-xs uppercase disabled:opacity-40 border border-[#ff4d00]"
              >
                {passcodeLoading ? 'Hashing...' : 'Update Passcode'}
              </button>
            </div>

            {passcodeError && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            {passcodeSuccess && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{passcodeSuccess}</span>
              </div>
            )}
          </form>
        </div>

        {/* Security Policy Settings */}
        <div className="p-6 bg-[#0a0a0a] border border-[#f0f0f0]/20 space-y-5 font-mono">
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-4 h-4 text-[#ff4d00]" />
            <h3 className="font-syne font-bold text-white text-sm uppercase">Active Defense Policies</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Timeout duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-zinc-300 font-bold">
                <span>Inactivity Session Timeout</span>
                <span className="text-[#ff4d00]">
                  {securitySettings.sessionTimeoutMinutes === 0 ? 'Disabled' : `${securitySettings.sessionTimeoutMinutes} min`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={securitySettings.sessionTimeoutMinutes}
                onChange={(e) => updateSecuritySettings({ sessionTimeoutMinutes: parseInt(e.target.value) })}
                className="w-full accent-[#ff4d00]"
              />
            </div>

            {/* Max failed attempts */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-zinc-300 font-bold">
                <span>Brute-Force Max Attempts</span>
                <span className="text-[#ff4d00]">{securitySettings.maxFailedAttempts} attempts</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={securitySettings.maxFailedAttempts}
                onChange={(e) => updateSecuritySettings({ maxFailedAttempts: parseInt(e.target.value) })}
                className="w-full accent-[#ff4d00]"
              />
            </div>

            {/* Lockout duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-zinc-300 font-bold">
                <span>Lockout Penalty Duration</span>
                <span className="text-[#ff4d00]">{securitySettings.lockoutDurationSeconds}s</span>
              </div>
              <input
                type="range"
                min="15"
                max="300"
                step="15"
                value={securitySettings.lockoutDurationSeconds}
                onChange={(e) => updateSecuritySettings({ lockoutDurationSeconds: parseInt(e.target.value) })}
                className="w-full accent-[#ff4d00]"
              />
            </div>

            {/* Confirmation toggle */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-zinc-200 font-bold">Require Deletion Confirmation</div>
                <div className="text-[11px] text-zinc-500 font-sans">Forces verified safety popup on project removal</div>
              </div>
              <input
                type="checkbox"
                checked={securitySettings.requireConfirmationForDeletions}
                onChange={(e) => updateSecuritySettings({ requireConfirmationForDeletions: e.target.checked })}
                className="w-4 h-4 accent-[#ff4d00]"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Audit Logs Table */}
      <div className="p-6 bg-[#0a0a0a] border border-[#f0f0f0]/20 space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#ff4d00]" />
            <h3 className="font-syne font-bold text-white text-sm uppercase">Cryptographic Audit Trail ({filteredLogs.length})</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportLogs}
              className="px-3 py-1 bg-transparent hover:bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs flex items-center space-x-1"
            >
              <Download className="w-3 h-3 text-[#ff4d00]" />
              <span>Export Log</span>
            </button>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1 bg-transparent hover:bg-red-950/40 border border-zinc-800 text-zinc-500 hover:text-red-400 text-xs flex items-center space-x-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-2 text-xs">
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit actions or IP hashes..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00]"
            />
          </div>

          <select
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="SUCCESS">Success Only</option>
            <option value="WARNING">Warnings Only</option>
            <option value="FAILURE">Failures Only</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                <th className="py-2 px-2">Timestamp</th>
                <th className="py-2 px-2">Action</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-950">
                  <td className="py-2 px-2 text-zinc-500 text-[10px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2 px-2 font-bold text-white whitespace-nowrap">{log.action}</td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold ${
                      log.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900' :
                      log.status === 'WARNING' ? 'text-amber-400 bg-amber-950/40 border border-amber-900' :
                      'text-rose-400 bg-rose-950/40 border border-rose-900'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-zinc-400 font-sans text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
