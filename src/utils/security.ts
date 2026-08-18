export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'INFO';
  details: string;
  userAgent?: string;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number; // 5, 15, 30, 60, 0 (disabled)
  maxFailedAttempts: number; // 3, 5, 10
  lockoutDurationSeconds: number; // 30, 60, 300
  requireConfirmationForDeletions: boolean;
  requirePasscodeForExport: boolean;
}

export const DEFAULT_PASSCODE = 'admin2026';
export const DEFAULT_SALT = 'alexrivera_ai_engine_salt_2026';

// Cryptographic hash using Web Crypto API SHA-256 with fallback
export async function sha256Hex(message: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('SubtleCrypto error, falling back to lightweight hash', e);
  }

  // Fallback hash if subtle crypto is restricted
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

export function generateRandomSalt(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let salt = '';
  for (let i = 0; i < 16; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
}

export function calculatePasswordStrength(pass: string): {
  score: number; // 0 to 100
  level: 'Weak' | 'Fair' | 'Strong' | 'Ironclad';
  color: string;
  feedback: string[];
} {
  if (!pass) {
    return { score: 0, level: 'Weak', color: 'text-zinc-500', feedback: ['Enter a passcode'] };
  }

  let score = 0;
  const feedback: string[] = [];

  if (pass.length >= 6) score += 25;
  else feedback.push('At least 6 characters');

  if (pass.length >= 10) score += 20;

  if (/[A-Z]/.test(pass)) score += 15;
  else feedback.push('Include uppercase letters');

  if (/[a-z]/.test(pass)) score += 10;

  if (/[0-9]/.test(pass)) score += 15;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(pass)) score += 15;
  else feedback.push('Include special symbols (!@#$%^&*)');

  let level: 'Weak' | 'Fair' | 'Strong' | 'Ironclad' = 'Weak';
  let color = 'text-rose-400';

  if (score >= 85) {
    level = 'Ironclad';
    color = 'text-emerald-400';
  } else if (score >= 60) {
    level = 'Strong';
    color = 'text-cyan-400';
  } else if (score >= 40) {
    level = 'Fair';
    color = 'text-amber-400';
  }

  return { score, level, color, feedback };
}
