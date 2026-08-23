import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Project,
  BlogPost,
  Certification,
  SkillItem,
  TimelineItem,
  VideoShowcaseItem,
  GitHubRepo,
  SecurityAuditLog,
  SecuritySettings
} from '../types';
import {
  PERSONAL_INFO as INITIAL_PERSONAL_INFO,
  PROJECTS_DATA as INITIAL_PROJECTS_DATA,
  BLOG_POSTS_DATA as INITIAL_BLOG_POSTS_DATA,
  CERTIFICATIONS_DATA as INITIAL_CERTIFICATIONS_DATA,
  SKILLS_DATA as INITIAL_SKILLS_DATA,
  TIMELINE_DATA as INITIAL_TIMELINE_DATA,
  VIDEO_SHOWCASE_DATA as INITIAL_VIDEO_SHOWCASE_DATA,
  GITHUB_REPOS_DATA as INITIAL_GITHUB_REPOS_DATA,
} from '../data/portfolioData';
import {
  sha256Hex,
  DEFAULT_PASSCODE,
  DEFAULT_SALT,
  generateRandomSalt
} from '../utils/security';
import { db, doc, getDoc, setDoc, onSnapshot, PORTFOLIO_DOC_PATH } from '../lib/firebase';

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  points: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface PersonalInfoType {
  name: string;
  title: string;
  handle: string;
  email: string;
  location: string;
  bio: string;
  availability: string;
  github: string;
  linkedin: string;
  twitter: string;
  profileImage?: string;
  avatarUrl?: string;
  stats: { label: string; value: string }[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroTechStack?: string[];
  heroCtaPrimaryText?: string;
  heroCtaSecondaryText?: string;
}

const INITIAL_WORK_EXPERIENCE: WorkExperienceItem[] = [
  {
    id: 'exp-1',
    company: 'Cognitive Scale AI',
    role: 'Lead AI Systems Architect',
    period: '2025 - Present',
    location: 'San Francisco, CA',
    points: [
      'Engineered enterprise multi-agent RAG engines serving 18.4M+ daily tokens with 99.9% SLA.',
      'Slashed GPU inference costs by 45% utilizing vLLM speculative draft models and PagedAttention memory pools.',
      'Built Reciprocal Rank Fusion retrieval with FlashRank cross-encoder context compression.'
    ]
  },
  {
    id: 'exp-2',
    company: 'Aether Vision Labs',
    role: 'Senior ML Engineer',
    period: '2023 - 2024',
    location: 'Palo Alto, CA',
    points: [
      'Designed 128 FPS industrial wafer defect inspection system using TensorRT INT8 YOLOv8 and CUDA C++.',
      'Deployed edge AI models to 14 manufacturing lines, preventing $2.4M in manufacturing scrap.'
    ]
  },
  {
    id: 'exp-3',
    company: 'Stanford AI Lab / Independent',
    role: 'AI Research Fellow',
    period: '2022 - 2023',
    location: 'Stanford, CA',
    points: [
      'Published research on context compression techniques for retrieval-augmented generative systems.',
      'Published paper cited in 80+ AI engineering repositories and open-source vector tools.'
    ]
  }
];

const INITIAL_EDUCATION: EducationItem[] = [
  {
    id: 'edu-ibm-rag-agentic',
    degree: 'IBM RAG and Agentic AI (Professional Certificate)',
    institution: 'IBM / Coursera',
    year: '2026',
    details: '8-Course specialization: LangGraph, LangChain, Multi-Agent Swarms (CrewAI/AutoGen/BeeAI), Vector Databases, Multimodal GenAI.'
  },
  {
    id: 'edu-ibm-deep-learning',
    degree: 'IBM Deep Learning with PyTorch, Keras and Tensorflow (Professional Certificate)',
    institution: 'IBM / Coursera',
    year: '2026',
    details: '5-Course specialization: PyTorch, Keras, TensorFlow 2, Convolutional Neural Networks (CNNs), Transformers, and Deep Learning Capstone.'
  }
];

const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  sessionTimeoutMinutes: 15,
  maxFailedAttempts: 5,
  lockoutDurationSeconds: 60,
  requireConfirmationForDeletions: true,
  requirePasscodeForExport: false
};

const STORAGE_KEYS = {
  PROJECTS: 'nestcy_projects_v3',
  PERSONAL_INFO: 'nestcy_personal_info_v3',
  EXPERIENCE: 'nestcy_experience_v3',
  EDUCATION: 'nestcy_education_v3',
  SKILLS: 'nestcy_skills_v3',
  CERTIFICATIONS: 'nestcy_certifications_v3',
  TIMELINE: 'nestcy_timeline_v3',
  BLOG_POSTS: 'nestcy_blog_posts_v3',
  PASSCODE_HASH: 'nestcy_passcode_hash_v3',
  PASSCODE_SALT: 'nestcy_passcode_salt_v3',
  SECURITY_SETTINGS: 'nestcy_security_settings_v3',
  AUDIT_LOGS: 'nestcy_audit_logs_v3',
  AUTH_SESSION: 'nestcy_auth_session_v3',
  LAST_UPDATED_AT: 'nestcy_last_updated_at_v3',
  EMERGENCY_BACKUP: 'nestcy_emergency_backup_v3'
};

interface PortfolioContextType {
  // Core Portfolio State
  projects: Project[];
  personalInfo: PersonalInfoType;
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  certifications: Certification[];
  timeline: TimelineItem[];
  blogPosts: BlogPost[];
  videoShowcases: VideoShowcaseItem[];
  githubRepos: GitHubRepo[];
  
  // Cloud Sync & Firestore Status
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastCloudSyncTime: string | null;
  forceSyncToCloud: () => Promise<boolean>;
  forcePullFromCloud: () => Promise<boolean>;
  hasEmergencyBackup: boolean;
  restoreEmergencyBackup: () => boolean;

  // Projects CRUD & Upload
  addProject: (project: Project) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  importProjects: (projectsList: Project[]) => void;
  
  // Personal Info & CV Refining
  updatePersonalInfo: (info: Partial<PersonalInfoType>) => void;
  addWorkExperience: (item: WorkExperienceItem) => void;
  updateWorkExperience: (id: string, updated: Partial<WorkExperienceItem>) => void;
  deleteWorkExperience: (id: string) => void;
  addEducation: (item: EducationItem) => void;
  updateEducation: (id: string, updated: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;

  // Skills
  addSkill: (skill: SkillItem) => void;
  updateSkill: (name: string, updated: Partial<SkillItem>) => void;
  deleteSkill: (name: string) => void;

  // Certifications
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, updated: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  // Timeline
  addTimelineItem: (item: TimelineItem) => void;
  updateTimelineItem: (id: string, updated: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;

  // Reset & Backup
  resetToDefaults: () => void;
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => boolean;

  // Security & Authentication
  isAdminAuthenticated: boolean;
  securitySettings: SecuritySettings;
  auditLogs: SecurityAuditLog[];
  failedAttempts: number;
  isLockedOut: boolean;
  lockoutRemainingSeconds: number;
  sessionRemainingSeconds: number | null;
  loginAdmin: (passcode: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  changePasscode: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  verifyAdminPasscode: (passcode: string) => Promise<boolean>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  addAuditLog: (action: string, status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'INFO', details: string) => void;
  clearAuditLogs: () => void;
  exportAuditLogsJSON: () => string;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out removed projects
          const filtered = parsed.filter(p => !['rag-nexus-enterprise', 'agentic-swarm-mcp', 'vision-defect-guard', 'vllm-speculative-gateway'].includes(p.id));
          return (filtered.length > 0 ? filtered : INITIAL_PROJECTS_DATA).map(p => {
            if (p.id === 'marketing-agent') {
              return {
                ...p,
                liveDemoUrl: 'https://market-chat-ten.vercel.app/'
              };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved projects', e);
    }
    return INITIAL_PROJECTS_DATA;
  });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERSONAL_INFO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved personal info', e);
    }
    return INITIAL_PERSONAL_INFO;
  });

  const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved experience', e);
    }
    return INITIAL_WORK_EXPERIENCE;
  });

  const [education, setEducation] = useState<EducationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EDUCATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved education', e);
    }
    return INITIAL_EDUCATION;
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved skills', e);
    }
    return INITIAL_SKILLS_DATA;
  });

  const [certifications, setCertifications] = useState<Certification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved certifications', e);
    }
    return INITIAL_CERTIFICATIONS_DATA;
  });

  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved timeline', e);
    }
    return INITIAL_TIMELINE_DATA;
  });

  const [blogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS_DATA);
  const [videoShowcases] = useState<VideoShowcaseItem[]>(INITIAL_VIDEO_SHOWCASE_DATA);
  const [githubRepos] = useState<GitHubRepo[]>(INITIAL_GITHUB_REPOS_DATA);

  // Cloud Sync State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);
  const [hasEmergencyBackup, setHasEmergencyBackup] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEYS.EMERGENCY_BACKUP));
    } catch {
      return false;
    }
  });
  const isInitialCloudLoadDone = useRef<boolean>(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Security State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECURITY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse security settings', e);
    }
    return INITIAL_SECURITY_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse audit logs', e);
    }
    return [
      {
        id: 'init-1',
        timestamp: new Date().toISOString(),
        action: 'SYSTEM_BOOT',
        status: 'INFO',
        details: 'Admin security guard initialized with cryptographic SHA-256 validation.',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server/Container'
      }
    ];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const session = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.authenticated && parsed.expiresAt > Date.now()) {
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to check session', e);
    }
    return false;
  });

  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState<number>(Date.now());
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number | null>(null);

  const lastActivityRef = useRef<number>(Date.now());

  // Helper to append audit logs
  const addAuditLog = useCallback((action: string, status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'INFO', details: string) => {
    const newEntry: SecurityAuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      action,
      status,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client'
    };
    setAuditLogs(prev => [newEntry, ...prev.slice(0, 99)]); // Keep last 100 entries
  }, []);

  // Record timestamp & update emergency backup whenever data changes
  const markLocalUpdate = useCallback(() => {
    const nowIso = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, nowIso);
    } catch (e) {
      console.warn('Failed to write last updated timestamp', e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(personalInfo));
  }, [personalInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(workExperience));
  }, [workExperience]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(certifications));
  }, [certifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECURITY_SETTINGS, JSON.stringify(securitySettings));
  }, [securitySettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Keep a persistent emergency backup
  useEffect(() => {
    try {
      const backupPayload = {
        savedAt: new Date().toISOString(),
        personalInfo,
        projects,
        workExperience,
        education,
        skills,
        certifications,
        timeline
      };
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_BACKUP, JSON.stringify(backupPayload));
      setHasEmergencyBackup(true);
    } catch (e) {
      console.warn('Emergency backup write error', e);
    }
  }, [personalInfo, projects, workExperience, education, skills, certifications, timeline]);

  // Push full payload to Firestore
  const forceSyncToCloud = useCallback(async (): Promise<boolean> => {
    setCloudSyncStatus('syncing');
    try {
      const nowIso = new Date().toISOString();
      const docRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.id);
      const payload = {
        personalInfo,
        projects,
        workExperience,
        education,
        skills,
        certifications,
        timeline,
        updatedAt: nowIso
      };
      await setDoc(docRef, payload, { merge: true });
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, nowIso);
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
      addAuditLog('CLOUD_SYNC_SUCCESS', 'SUCCESS', 'Synchronized live portfolio data to Firebase Firestore.');
      return true;
    } catch (err) {
      console.error('Error syncing to Firestore:', err);
      setCloudSyncStatus('error');
      addAuditLog('CLOUD_SYNC_FAILED', 'WARNING', 'Failed to synchronize with Firestore: ' + (err as Error).message);
      return false;
    }
  }, [personalInfo, projects, workExperience, education, skills, certifications, timeline, addAuditLog]);

  // Pull full payload from Firestore
  const forcePullFromCloud = useCallback(async (): Promise<boolean> => {
    setCloudSyncStatus('syncing');
    try {
      const docRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.personalInfo) setPersonalInfo(data.personalInfo);
        if (data.projects) setProjects(data.projects);
        if (data.workExperience) setWorkExperience(data.workExperience);
        if (data.education) setEducation(data.education);
        if (data.skills) setSkills(data.skills);
        if (data.certifications) setCertifications(data.certifications);
        if (data.timeline) setTimeline(data.timeline);
        if (data.updatedAt) {
          localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, data.updatedAt);
        }
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(new Date().toLocaleTimeString());
        addAuditLog('CLOUD_PULL_SUCCESS', 'SUCCESS', 'Pulled fresh live state from Firebase Firestore.');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error pulling from Firestore:', err);
      setCloudSyncStatus('error');
      return false;
    }
  }, [addAuditLog]);

  // Initialize Firestore on mount with smart timestamp reconciliation (Anti-Overwrite Protection)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const initFirestore = async () => {
      try {
        setCloudSyncStatus('syncing');
        const docRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.id);
        const docSnap = await getDoc(docRef);

        const localUpdatedStr = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED_AT);
        const localUpdateTime = localUpdatedStr ? new Date(localUpdatedStr).getTime() : 0;

        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          const cloudUpdateTime = cloudData.updatedAt ? new Date(cloudData.updatedAt).getTime() : 0;
          const isStaleData = cloudData.personalInfo && (cloudData.personalInfo.name === 'Alex Rivera' || cloudData.personalInfo.email === 'alex.rivera@ai-arch.dev');
          
          const hasLegacyMockTimeline = cloudData.timeline && Array.isArray(cloudData.timeline) && cloudData.timeline.some((t: any) => t.id === 't1' || t.organization === 'Cognitive Scale AI (San Francisco, CA)');
          const hasLegacyMockSkills = cloudData.skills && Array.isArray(cloudData.skills) && cloudData.skills.some((s: any) => s.name === 'LLM Fine-Tuning (LoRA / QLoRA)' || s.name === 'Segment Anything (SAM) & OpenCV');
          const hasLegacyMockCertifications = cloudData.certifications && Array.isArray(cloudData.certifications) && cloudData.certifications.some((c: any) => c.id === 'cert-nvidia-llm' || c.id === 'cert-aws-ml' || c.credentialId === 'NV-LLM-892104');
          const hasLegacyMockEducation = cloudData.education && Array.isArray(cloudData.education) && cloudData.education.some((e: any) => e.id === 'edu-1' || e.institution === 'Stanford University');
          const sanitizeProjects = (projList: any[]): Project[] => {
            if (!Array.isArray(projList)) return INITIAL_PROJECTS_DATA;
            const filtered = projList.filter(p => !['rag-nexus-enterprise', 'agentic-swarm-mcp', 'vision-defect-guard', 'vllm-speculative-gateway'].includes(p?.id));
            return (filtered.length > 0 ? filtered : INITIAL_PROJECTS_DATA).map(p => {
              if (p.id === 'marketing-agent') {
                return {
                  ...p,
                  liveDemoUrl: 'https://market-chat-ten.vercel.app/',
                  coverImage: (!p.coverImage || p.coverImage.includes('unsplash.com/photo-1460925895917')) ? INITIAL_PROJECTS_DATA[0].coverImage : p.coverImage,
                  gallery: (!p.gallery || p.gallery.some((g: string) => g.includes('unsplash.com/photo-1460925895917'))) ? INITIAL_PROJECTS_DATA[0].gallery : p.gallery
                };
              }
              return p;
            });
          };

          // ANTI-OVERWRITE RULE:
          // If local storage has edits newer than or equal to cloud state, PRESERVE local storage and upload to cloud!
          // Only pull down cloud data if cloud data is strictly newer than local state.
          if (!isStaleData && cloudUpdateTime > localUpdateTime && localUpdateTime === 0) {
            // First time loading on a clean device with existing cloud data
            if (cloudData.personalInfo) setPersonalInfo(cloudData.personalInfo);
            if (cloudData.projects) setProjects(sanitizeProjects(cloudData.projects));
            if (cloudData.workExperience && Array.isArray(cloudData.workExperience)) setWorkExperience(cloudData.workExperience);
            if (cloudData.education && Array.isArray(cloudData.education) && !hasLegacyMockEducation) {
              setEducation(cloudData.education);
            } else {
              setEducation(INITIAL_EDUCATION);
            }
            if (cloudData.skills && Array.isArray(cloudData.skills) && !hasLegacyMockSkills) {
              setSkills(cloudData.skills);
            } else {
              setSkills(INITIAL_SKILLS_DATA);
            }
            if (cloudData.certifications && Array.isArray(cloudData.certifications) && !hasLegacyMockCertifications) {
              setCertifications(cloudData.certifications);
            } else {
              setCertifications(INITIAL_CERTIFICATIONS_DATA);
            }
            if (cloudData.timeline && Array.isArray(cloudData.timeline) && !hasLegacyMockTimeline) {
              setTimeline(cloudData.timeline);
            } else {
              setTimeline(INITIAL_TIMELINE_DATA);
            }
            if (cloudData.updatedAt) localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, cloudData.updatedAt);
          } else if (localUpdateTime >= cloudUpdateTime && localUpdateTime > 0) {
            // Local edits are more recent or equal -> push local edits to cloud to make sure cloud is up to date
            const effectiveTimeline = hasLegacyMockTimeline ? INITIAL_TIMELINE_DATA : timeline;
            const effectiveSkills = hasLegacyMockSkills ? INITIAL_SKILLS_DATA : skills;
            const effectiveCerts = hasLegacyMockCertifications ? INITIAL_CERTIFICATIONS_DATA : certifications;
            const effectiveEdu = hasLegacyMockEducation ? INITIAL_EDUCATION : education;
            const effectiveProjects = sanitizeProjects(projects);

            if (hasLegacyMockTimeline) setTimeline(INITIAL_TIMELINE_DATA);
            if (hasLegacyMockSkills) setSkills(INITIAL_SKILLS_DATA);
            if (hasLegacyMockCertifications) setCertifications(INITIAL_CERTIFICATIONS_DATA);
            if (hasLegacyMockEducation) setEducation(INITIAL_EDUCATION);
            setProjects(effectiveProjects);

            const syncPayload = {
              personalInfo,
              projects: effectiveProjects,
              workExperience,
              education: effectiveEdu,
              skills: effectiveSkills,
              certifications: effectiveCerts,
              timeline: effectiveTimeline,
              updatedAt: localUpdatedStr || new Date().toISOString()
            };
            await setDoc(docRef, syncPayload, { merge: true });
          } else if (!isStaleData && cloudData) {
            // Load cloud data if local is empty/initial
            if (cloudData.personalInfo) setPersonalInfo(cloudData.personalInfo);
            if (cloudData.projects) setProjects(sanitizeProjects(cloudData.projects));
            if (cloudData.workExperience && Array.isArray(cloudData.workExperience)) setWorkExperience(cloudData.workExperience);
            if (cloudData.education && Array.isArray(cloudData.education) && !hasLegacyMockEducation) {
              setEducation(cloudData.education);
            } else {
              setEducation(INITIAL_EDUCATION);
            }
            if (cloudData.skills && Array.isArray(cloudData.skills) && !hasLegacyMockSkills) {
              setSkills(cloudData.skills);
            } else {
              setSkills(INITIAL_SKILLS_DATA);
            }
            if (cloudData.certifications && Array.isArray(cloudData.certifications) && !hasLegacyMockCertifications) {
              setCertifications(cloudData.certifications);
            } else {
              setCertifications(INITIAL_CERTIFICATIONS_DATA);
            }
            if (cloudData.timeline && Array.isArray(cloudData.timeline) && !hasLegacyMockTimeline) {
              setTimeline(cloudData.timeline);
            } else {
              setTimeline(INITIAL_TIMELINE_DATA);
            }
          }
          setCloudSyncStatus('synced');
          setLastCloudSyncTime(new Date().toLocaleTimeString());
        } else {
          // Document does not exist yet in Firestore -> bootstrap with current local data
          const initialPayload = {
            personalInfo,
            projects,
            workExperience,
            education,
            skills,
            certifications,
            timeline,
            updatedAt: new Date().toISOString()
          };
          await setDoc(docRef, initialPayload);
          setCloudSyncStatus('synced');
          setLastCloudSyncTime(new Date().toLocaleTimeString());
        }

        isInitialCloudLoadDone.current = true;

        // Realtime subscription
        unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.updatedAt) {
              setLastCloudSyncTime(new Date(data.updatedAt).toLocaleTimeString());
            }
          }
        }, (err) => {
          console.warn('Firestore snapshot error:', err);
          setCloudSyncStatus('offline');
        });

      } catch (e) {
        console.error('Firebase initial load error:', e);
        setCloudSyncStatus('offline');
      }
    };

    initFirestore();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Rapid auto-save to Firestore on changes (only after initial load completes)
  useEffect(() => {
    if (!isInitialCloudLoadDone.current) return;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        setCloudSyncStatus('syncing');
        const nowIso = new Date().toISOString();
        const docRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.id);
        const payload = {
          personalInfo,
          projects,
          workExperience,
          education,
          skills,
          certifications,
          timeline,
          updatedAt: nowIso
        };
        await setDoc(docRef, payload, { merge: true });
        localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, nowIso);
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(new Date().toLocaleTimeString());
      } catch (err) {
        console.warn('Background Firestore autosave warning:', err);
        setCloudSyncStatus('offline');
      }
    }, 400);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [personalInfo, projects, workExperience, education, skills, certifications, timeline]);

  // Lockout Countdown Timer
  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutUntil) {
        setLockoutUntil(null);
        setLockoutRemainingSeconds(0);
        setFailedAttempts(0);
        clearInterval(interval);
      } else {
        setLockoutRemainingSeconds(Math.ceil((lockoutUntil - now) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Inactivity Auto-Lock Monitor
  useEffect(() => {
    if (!isAdminAuthenticated || securitySettings.sessionTimeoutMinutes <= 0) {
      setSessionRemainingSeconds(null);
      return;
    }

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      setLastActivityTimestamp(Date.now());
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - lastActivityRef.current;
      const timeoutMs = securitySettings.sessionTimeoutMinutes * 60 * 1000;
      const remainingMs = timeoutMs - elapsedMs;

      if (remainingMs <= 0) {
        setIsAdminAuthenticated(false);
        sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        addAuditLog('SESSION_TIMEOUT', 'WARNING', `Admin session timed out after ${securitySettings.sessionTimeoutMinutes} minutes of inactivity.`);
      } else {
        setSessionRemainingSeconds(Math.ceil(remainingMs / 1000));
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      clearInterval(checkInterval);
    };
  }, [isAdminAuthenticated, securitySettings.sessionTimeoutMinutes, addAuditLog]);

  // Authentication Helpers
  const getStoredHashAndSalt = async (): Promise<{ hash: string; salt: string }> => {
    let hash = localStorage.getItem(STORAGE_KEYS.PASSCODE_HASH);
    let salt = localStorage.getItem(STORAGE_KEYS.PASSCODE_SALT);

    if (!hash || !salt) {
      salt = DEFAULT_SALT;
      hash = await sha256Hex(DEFAULT_PASSCODE + salt);
      localStorage.setItem(STORAGE_KEYS.PASSCODE_HASH, hash);
      localStorage.setItem(STORAGE_KEYS.PASSCODE_SALT, salt);
    }
    return { hash, salt };
  };

  const loginAdmin = async (passcode: string): Promise<{ success: boolean; message: string }> => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      return { success: false, message: `Access locked due to excessive failed attempts. Please wait ${remaining}s.` };
    }

    const { hash, salt } = await getStoredHashAndSalt();
    const inputHash = await sha256Hex(passcode + salt);

    if (inputHash === hash) {
      setIsAdminAuthenticated(true);
      setFailedAttempts(0);
      setLockoutUntil(null);
      lastActivityRef.current = Date.now();
      setLastActivityTimestamp(Date.now());

      const timeoutMs = securitySettings.sessionTimeoutMinutes > 0
        ? securitySettings.sessionTimeoutMinutes * 60 * 1000
        : 24 * 60 * 60 * 1000;

      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({
        authenticated: true,
        loginAt: Date.now(),
        expiresAt: Date.now() + timeoutMs
      }));

      addAuditLog('ADMIN_LOGIN_SUCCESS', 'SUCCESS', 'Administrator successfully authorized via master passcode.');
      return { success: true, message: 'Authorization granted. Welcome to Control Console.' };
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);

      if (nextFailed >= securitySettings.maxFailedAttempts) {
        const lockUntil = Date.now() + securitySettings.lockoutDurationSeconds * 1000;
        setLockoutUntil(lockUntil);
        addAuditLog('INTRUSION_LOCKOUT_TRIGGERED', 'WARNING', `Lockout activated for ${securitySettings.lockoutDurationSeconds}s after ${nextFailed} failed login attempts.`);
        return { success: false, message: `Security breach prevention triggered. Locked for ${securitySettings.lockoutDurationSeconds} seconds.` };
      } else {
        const left = securitySettings.maxFailedAttempts - nextFailed;
        addAuditLog('ADMIN_LOGIN_FAILED', 'FAILED', `Invalid passcode entered. ${left} attempts remaining before lockout.`);
        return { success: false, message: `Invalid passcode. ${left} attempt(s) remaining.` };
      }
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    addAuditLog('ADMIN_LOGOUT', 'INFO', 'Administrator voluntarily locked console session.');
  };

  const verifyAdminPasscode = async (passcode: string): Promise<boolean> => {
    const { hash, salt } = await getStoredHashAndSalt();
    const inputHash = await sha256Hex(passcode + salt);
    return inputHash === hash;
  };

  const changePasscode = async (currentPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    const isCurrentValid = await verifyAdminPasscode(currentPass);
    if (!isCurrentValid) {
      addAuditLog('PASSCODE_CHANGE_FAILED', 'FAILED', 'Passcode update denied: Current passcode verification failed.');
      return { success: false, message: 'Current passcode is incorrect.' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'New passcode must be at least 6 characters long.' };
    }

    const newSalt = generateRandomSalt();
    const newHash = await sha256Hex(newPass + newSalt);

    localStorage.setItem(STORAGE_KEYS.PASSCODE_HASH, newHash);
    localStorage.setItem(STORAGE_KEYS.PASSCODE_SALT, newSalt);

    addAuditLog('PASSCODE_CHANGED_SUCCESS', 'SUCCESS', 'Master administrative passcode was updated and re-salted with SHA-256.');
    return { success: true, message: 'Master passcode updated successfully!' };
  };

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => {
      const updated = { ...prev, ...settings };
      addAuditLog('SECURITY_SETTINGS_UPDATED', 'INFO', 'Administrative security parameters and timeout policies modified.');
      return updated;
    });
  };

  const clearAuditLogs = () => {
    const freshLog: SecurityAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: 'AUDIT_LOG_CLEARED',
      status: 'WARNING',
      details: 'Administrator wiped historical security audit log entries.'
    };
    setAuditLogs([freshLog]);
  };

  const exportAuditLogsJSON = () => {
    addAuditLog('AUDIT_LOG_EXPORTED', 'INFO', 'Security audit logs exported to JSON.');
    return JSON.stringify({ exportedAt: new Date().toISOString(), logs: auditLogs }, null, 2);
  };

  // Project operations
  const addProject = (project: Project) => {
    markLocalUpdate();
    setProjects(prev => [project, ...prev]);
    addAuditLog('PROJECT_CREATED', 'SUCCESS', `Created project: "${project.title}" [${project.id}]`);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    markLocalUpdate();
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    addAuditLog('PROJECT_UPDATED', 'INFO', `Updated project properties for ID: ${id}`);
  };

  const deleteProject = (id: string) => {
    markLocalUpdate();
    setProjects(prev => prev.filter(p => p.id !== id));
    addAuditLog('PROJECT_DELETED', 'WARNING', `Deleted project with ID: ${id}`);
  };

  const importProjects = (projectsList: Project[]) => {
    markLocalUpdate();
    setProjects(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newProjects = projectsList.filter(p => !existingIds.has(p.id));
      addAuditLog('PROJECTS_IMPORTED', 'SUCCESS', `Imported ${newProjects.length} new projects via batch import.`);
      return [...newProjects, ...prev];
    });
  };

  // Personal Info & CV operations
  const updatePersonalInfo = (info: Partial<PersonalInfoType>) => {
    markLocalUpdate();
    setPersonalInfo(prev => ({ ...prev, ...info }));
    addAuditLog('CV_INFO_UPDATED', 'INFO', 'Updated primary personal info & coordinates.');
  };

  const addWorkExperience = (item: WorkExperienceItem) => {
    markLocalUpdate();
    setWorkExperience(prev => [item, ...prev]);
    addAuditLog('EXPERIENCE_ADDED', 'SUCCESS', `Added career milestone: ${item.role} @ ${item.company}`);
  };

  const updateWorkExperience = (id: string, updated: Partial<WorkExperienceItem>) => {
    markLocalUpdate();
    setWorkExperience(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('EXPERIENCE_UPDATED', 'INFO', `Updated work experience item ID: ${id}`);
  };

  const deleteWorkExperience = (id: string) => {
    markLocalUpdate();
    setWorkExperience(prev => prev.filter(e => e.id !== id));
    addAuditLog('EXPERIENCE_DELETED', 'WARNING', `Removed work experience item ID: ${id}`);
  };

  const addEducation = (item: EducationItem) => {
    markLocalUpdate();
    setEducation(prev => [...prev, item]);
    addAuditLog('EDUCATION_ADDED', 'SUCCESS', `Added academic degree: ${item.degree}`);
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    markLocalUpdate();
    setEducation(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('EDUCATION_UPDATED', 'INFO', `Updated education item ID: ${id}`);
  };

  const deleteEducation = (id: string) => {
    markLocalUpdate();
    setEducation(prev => prev.filter(e => e.id !== id));
    addAuditLog('EDUCATION_DELETED', 'WARNING', `Removed education item ID: ${id}`);
  };

  // Skills
  const addSkill = (skill: SkillItem) => {
    markLocalUpdate();
    setSkills(prev => [...prev, skill]);
    addAuditLog('SKILL_ADDED', 'SUCCESS', `Added skill: ${skill.name} (${skill.category})`);
  };

  const updateSkill = (name: string, updated: Partial<SkillItem>) => {
    markLocalUpdate();
    setSkills(prev => prev.map(s => (s.name === name ? { ...s, ...updated } : s)));
    addAuditLog('SKILL_UPDATED', 'INFO', `Updated proficiency for skill: ${name}`);
  };

  const deleteSkill = (name: string) => {
    markLocalUpdate();
    setSkills(prev => prev.filter(s => s.name !== name));
    addAuditLog('SKILL_DELETED', 'WARNING', `Deleted skill: ${name}`);
  };

  // Certifications
  const addCertification = (cert: Certification) => {
    markLocalUpdate();
    setCertifications(prev => [cert, ...prev]);
    addAuditLog('CERTIFICATION_ADDED', 'SUCCESS', `Added certification: ${cert.title}`);
  };

  const updateCertification = (id: string, updated: Partial<Certification>) => {
    markLocalUpdate();
    setCertifications(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    addAuditLog('CERTIFICATION_UPDATED', 'INFO', `Updated certification ID: ${id}`);
  };

  const deleteCertification = (id: string) => {
    markLocalUpdate();
    setCertifications(prev => prev.filter(c => c.id !== id));
    addAuditLog('CERTIFICATION_DELETED', 'WARNING', `Deleted certification ID: ${id}`);
  };

  // Timeline
  const addTimelineItem = (item: TimelineItem) => {
    markLocalUpdate();
    setTimeline(prev => [item, ...prev]);
    addAuditLog('TIMELINE_ITEM_ADDED', 'SUCCESS', `Added timeline event: ${item.title} (${item.year})`);
  };

  const updateTimelineItem = (id: string, updated: Partial<TimelineItem>) => {
    markLocalUpdate();
    setTimeline(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    addAuditLog('TIMELINE_ITEM_UPDATED', 'INFO', `Updated timeline entry ID: ${id}`);
  };

  const deleteTimelineItem = (id: string) => {
    markLocalUpdate();
    setTimeline(prev => prev.filter(t => t.id !== id));
    addAuditLog('TIMELINE_ITEM_DELETED', 'WARNING', `Deleted timeline entry ID: ${id}`);
  };

  // Emergency Backup Restore
  const restoreEmergencyBackup = (): boolean => {
    try {
      const backupStr = localStorage.getItem(STORAGE_KEYS.EMERGENCY_BACKUP);
      if (!backupStr) return false;
      const data = JSON.parse(backupStr);
      if (data.personalInfo) setPersonalInfo(data.personalInfo);
      if (data.projects && Array.isArray(data.projects)) setProjects(data.projects);
      if (data.workExperience && Array.isArray(data.workExperience)) setWorkExperience(data.workExperience);
      if (data.education && Array.isArray(data.education)) setEducation(data.education);
      if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
      if (data.certifications && Array.isArray(data.certifications)) setCertifications(data.certifications);
      if (data.timeline && Array.isArray(data.timeline)) setTimeline(data.timeline);
      markLocalUpdate();
      addAuditLog('EMERGENCY_BACKUP_RESTORED', 'SUCCESS', 'Restored full state from local emergency snapshot.');
      return true;
    } catch (e) {
      console.error('Failed to restore emergency backup:', e);
      return false;
    }
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setProjects(INITIAL_PROJECTS_DATA);
    setPersonalInfo(INITIAL_PERSONAL_INFO);
    setWorkExperience(INITIAL_WORK_EXPERIENCE);
    setEducation(INITIAL_EDUCATION);
    setSkills(INITIAL_SKILLS_DATA);
    setCertifications(INITIAL_CERTIFICATIONS_DATA);
    setTimeline(INITIAL_TIMELINE_DATA);
    localStorage.clear();

    // Push clean state directly to Firestore
    try {
      const docRef = doc(db, PORTFOLIO_DOC_PATH.collection, PORTFOLIO_DOC_PATH.id);
      const cleanPayload = {
        personalInfo: INITIAL_PERSONAL_INFO,
        projects: INITIAL_PROJECTS_DATA,
        workExperience: INITIAL_WORK_EXPERIENCE,
        education: INITIAL_EDUCATION,
        skills: INITIAL_SKILLS_DATA,
        certifications: INITIAL_CERTIFICATIONS_DATA,
        timeline: INITIAL_TIMELINE_DATA,
        updatedAt: new Date().toISOString()
      };
      setDoc(docRef, cleanPayload);
    } catch (e) {
      console.warn('Error resetting cloud state:', e);
    }

    addAuditLog('DATA_RESET_FACTORY', 'WARNING', 'All portfolio collections restored to default factory seed data and synced.');
  };

  const exportBackupJSON = () => {
    const payload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      personalInfo,
      projects,
      workExperience,
      education,
      skills,
      certifications,
      timeline
    };
    addAuditLog('PORTFOLIO_BACKUP_EXPORTED', 'SUCCESS', 'Exported full JSON state archive.');
    return JSON.stringify(payload, null, 2);
  };

  const importBackupJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.projects && Array.isArray(data.projects)) setProjects(data.projects);
      if (data.personalInfo) setPersonalInfo(data.personalInfo);
      if (data.workExperience && Array.isArray(data.workExperience)) setWorkExperience(data.workExperience);
      if (data.education && Array.isArray(data.education)) setEducation(data.education);
      if (data.skills && Array.isArray(data.skills)) setSkills(data.skills);
      if (data.certifications && Array.isArray(data.certifications)) setCertifications(data.certifications);
      if (data.timeline && Array.isArray(data.timeline)) setTimeline(data.timeline);
      addAuditLog('PORTFOLIO_BACKUP_RESTORED', 'SUCCESS', 'Restored portfolio database from uploaded JSON backup.');
      return true;
    } catch (e) {
      console.error('Failed to import backup JSON', e);
      addAuditLog('PORTFOLIO_BACKUP_IMPORT_ERROR', 'FAILED', 'Failed to parse or restore uploaded JSON backup.');
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        personalInfo,
        workExperience,
        education,
        skills,
        certifications,
        timeline,
        blogPosts,
        videoShowcases,
        githubRepos,
        cloudSyncStatus,
        lastCloudSyncTime,
        forceSyncToCloud,
        forcePullFromCloud,
        hasEmergencyBackup,
        restoreEmergencyBackup,
        addProject,
        updateProject,
        deleteProject,
        importProjects,
        updatePersonalInfo,
        addWorkExperience,
        updateWorkExperience,
        deleteWorkExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        addCertification,
        updateCertification,
        deleteCertification,
        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,
        resetToDefaults,
        exportBackupJSON,
        importBackupJSON,
        isAdminAuthenticated,
        securitySettings,
        auditLogs,
        failedAttempts,
        isLockedOut: Boolean(lockoutUntil && Date.now() < lockoutUntil),
        lockoutRemainingSeconds,
        sessionRemainingSeconds,
        loginAdmin,
        logoutAdmin,
        changePasscode,
        verifyAdminPasscode,
        updateSecuritySettings,
        addAuditLog,
        clearAuditLogs,
        exportAuditLogsJSON
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
