export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: 'RAG' | 'Multi-Agent' | 'Computer Vision' | 'LLM Platform' | 'MLOps' | 'Edge AI';
  description: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  featured: boolean;
  githubUrl: string;
  liveDemoUrl?: string;
  videoDemoUrl?: string;
  metrics: { label: string; value: string }[];
  problem: string;
  solution: string;
  architectureDescription: string;
  architectureNodes: { id: string; label: string; type: 'client' | 'gateway' | 'vector' | 'model' | 'db' | 'cache'; status: string }[];
  engineeringDecisions?: string;
  technicalChallenges: { title: string; detail: string; metricImpact: string }[];
  lessonsLearned: string[];
  codeSnippet?: { language: string; filename: string; code: string };
  futureImprovements: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'RAG Architecture' | 'Multi-Agent Systems' | 'Vector Databases' | 'Transformer Math' | 'Prompt Engineering' | 'MLOps';
  publishedDate: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  featuredImage: string;
  codeSnippets?: { title: string; language: string; code: string }[];
  mathFormulas?: { label: string; latex: string; explanation: string }[];
}

export interface Certification {
  id: string;
  title: string;
  institution: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  badgeImage: string;
  skillsVerified: string[];
}

export interface SkillItem {
  name: string;
  category: 'Machine Learning' | 'Deep Learning' | 'Computer Vision' | 'NLP' | 'LLMs' | 'AI Agents' | 'Backend' | 'Frontend' | 'Cloud' | 'Databases' | 'DevOps' | 'Tools';
  proficiency: number; // 0 - 100
  level: 'Expert' | 'Advanced' | 'Proficient';
  iconName: string;
  yearsExperience: string;
  description: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  organization: string;
  type: 'Career' | 'Research' | 'Hackathon' | 'Certification' | 'Achievement';
  description: string;
  impact: string;
  skillsUsed: string[];
  link?: string;
}

export interface VideoShowcaseItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string; // e.g. embedded video or mockup player
  thumbnail: string;
  technologies: string[];
  views: string;
  highlights: string[];
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
  isPinned: boolean;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'INFO';
  details: string;
  userAgent?: string;
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number;
  maxFailedAttempts: number;
  lockoutDurationSeconds: number;
  requireConfirmationForDeletions: boolean;
  requirePasscodeForExport: boolean;
}

