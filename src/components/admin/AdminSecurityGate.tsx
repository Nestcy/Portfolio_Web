import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Lock,
  Unlock,
  ShieldAlert,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

interface AdminSecurityGateProps {
  onClose: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({ onClose }) => {
  const {
    loginAdmin,
    isLockedOut,
    lockoutRemainingSeconds,
    failedAttempts,
    securitySettings
  } = usePortfolio();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || isLockedOut || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginAdmin(passcode.trim());
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
        setPasscode('');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-[#ff4d00] selection:text-[#0a0a0a]">
      
      {/* Top Left Return Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-transparent hover:bg-zinc-900 border border-[#f0f0f0]/20 text-zinc-300 hover:text-white font-mono text-xs flex items-center space-x-2 transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#ff4d00]" />
          <span>Live Portfolio</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-[#0a0a0a] border-2 border-[#f0f0f0]/30 shadow-2xl relative z-10">
        
        {/* Terminal Header Strip */}
        <div className="p-4 border-b border-[#f0f0f0]/20 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-[#ff4d00] rounded-[2px] animate-pulse" />
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-white">
              ENGINEER.OS <span className="font-mono text-zinc-500 text-[10px]">// SECURITY GATE</span>
            </span>
          </div>
          <div className="px-2 py-0.5 border border-zinc-800 text-[9px] text-zinc-400 font-mono">
            SHA-256
          </div>
        </div>

        {/* Lockout Warning Banner */}
        {isLockedOut && (
          <div className="p-4 bg-rose-950/80 border-b border-rose-800 text-rose-300 text-xs space-y-2 font-mono">
            <div className="flex items-center space-x-2 font-bold text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>LOCKOUT ACTIVE &mdash; DEFENSE ENGAGED</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Maximum attempt threshold ({securitySettings.maxFailedAttempts}) reached. Authentication locked for{' '}
              <span className="font-bold text-white bg-rose-900 px-1.5 py-0.5">
                {lockoutRemainingSeconds}s
              </span>.
            </p>
          </div>
        )}

        {/* Main Content Form */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 border border-[#f0f0f0]/20 bg-zinc-950 text-[#ff4d00] mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-syne font-extrabold text-2xl text-white uppercase tracking-tight">
              Control Console
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-xs mx-auto leading-relaxed">
              Enter master access key to manage systems, telemetry metrics, and career logs.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase">
                <label htmlFor="master-passcode" className="flex items-center space-x-1.5">
                  <KeyRound className="w-3 h-3 text-[#ff4d00]" />
                  <span>Master Passcode</span>
                </label>
                {failedAttempts > 0 && !isLockedOut && (
                  <span className="text-amber-400">
                    Failed: {failedAttempts}/{securitySettings.maxFailedAttempts}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="master-passcode"
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  disabled={isLockedOut || loading}
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-white font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLockedOut || loading || !passcode.trim()}
              className="w-full py-3 bg-[#ff4d00] hover:bg-[#ff6622] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-[#ff4d00]"
            >
              {loading ? (
                <span>Validating Hash...</span>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Authenticate & Unlock</span>
                </>
              )}
            </button>
          </form>

          {/* Secure Access Notice */}
          <div className="pt-3 border-t border-zinc-800 font-mono text-[11px] text-zinc-500 text-center space-y-1">
            <div className="flex items-center justify-center space-x-1.5 text-zinc-400 font-mono text-[10px]">
              <ShieldCheck className="w-3 h-3 text-[#ff4d00]" />
              <span>Owner Access Guard &bull; SHA-256 Authentication</span>
            </div>
            <p className="text-[9px] text-zinc-600">
              Session is encrypted and logged to security telemetry.
            </p>
          </div>

        </div>

        {/* Diagnostic Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
          <span>STATUS: ARMED</span>
          <span>TIMEOUT: {securitySettings.sessionTimeoutMinutes > 0 ? `${securitySettings.sessionTimeoutMinutes}M` : 'OFF'}</span>
        </div>

      </div>
    </div>
  );
};
