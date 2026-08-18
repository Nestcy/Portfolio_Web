import React, { useState } from 'react';
import { Project } from '../../types';
import {
  X,
  Save,
  Trash2,
  FileText,
  LayoutGrid,
  CheckCircle2,
  Code2,
  Sparkles,
  ExternalLink,
  Github,
  Layers,
  HelpCircle,
  Cpu,
  Flame,
  BarChart3,
  CheckSquare,
  Video,
  Upload,
  Play
} from 'lucide-react';

interface ProjectEditorModalProps {
  project?: Project | null;
  isNew?: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const CATEGORY_OPTIONS = [
  'Multi-Agent',
  'RAG & Search',
  'LLM Gateway & Inference',
  'Computer Vision',
  'MLOps & Infra',
  'Edge & Realtime AI'
];

interface FormState {
  title: string;
  subtitle: string;
  category: string;
  githubUrl: string;
  liveDemoUrl: string;
  videoDemoUrl: string;
  coverImage: string;
  featured: boolean;
  problem: string;
  architectureDescription: string;
  solution: string;
  engineeringDecisions: string;
  hardPart: string;
  evaluation: string;
  result: string;
  technologies: string;
}

const projectToFormState = (p?: Project | null): FormState => {
  if (!p) {
    return {
      title: 'Marketing Agent — Agentic Content Calendar Platform',
      subtitle: "Businesses need a consistent social content presence but don't have time to plan and write it daily — and fully autonomous posting tools solve that by removing the human from what actually ships.",
      category: 'Multi-Agent',
      githubUrl: 'https://github.com/Nestcy/marketing_agent',
      liveDemoUrl: 'https://chat-ad-architect.lovable.app',
      videoDemoUrl: '',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      problem: `Small businesses either do their own social content (time they don't have) or hand it to a tool that generates and posts autonomously (which removes their judgment from what represents their brand). I wanted a middle path: an AI that does the actual planning and writing work, but never publishes anything without an explicit human approval — at both the strategy level and the individual-post level.`,
      architectureDescription: `Business input -> Research Node (Tavily + Firecrawl, capped context) -> Planner Node (single LLM call -> 3-day strategy outline) -> PLAN GATE (human: approve / refine) -> Day Content Node (per day: caption + ad copy variants + image prompt) -> DAY GATE (human: approve / tweak) -> Persisted state (Postgres) -> REST API + Chat interface -> Celery Beat (daily cron)`,
      solution: `Component 1 — Research & Planning Graph (LangGraph)
Researches a business (capped scrape/search content, not full raw pages), then produces a lightweight 3-day strategy outline in a single LLM call.

Component 2 — Two Human-Approval Gates
Plan Gate and Day Gate. Nothing generated ever auto-publishes; every piece of output requires explicit human decision.

Component 3 — Daily Content Generation (standalone, not graph-chained)
Generates one day's caption, ad copy variants, and image prompt at a time to keep token cost flat.

Component 4 — Celery Beat Cron + Chat Router
Daily background job generates next due day. Groq chat router exposes the same approve/refine actions.`,
      engineeringDecisions: `Why LangGraph?
Research -> plan step is a genuine small pipeline with clear start/stop. Day-by-day content generation is deliberately kept OUTSIDE the graph as a standalone function.

Why RAG?
Not used here, deliberately. Business context comes from live web research (Tavily/Firecrawl) per campaign rather than a persistent vector store.

Why this architecture (two gates, not one)?
Splitting into a plan-level gate and a day-level gate lets feedback happen at the right altitude for each decision.

Why these models?
Groq-hosted Llama models, chosen for low-latency, low-cost inference suited to structured short-form generation.`,
      hardPart: `What broke?
Groq rate limits started firing constantly during testing.

What constraint existed?
Free/dev-tier per-minute token limits combined with unneeded context re-sent on calls.

What did I change?
Added hard caps to web scrapes, made model selection configurable per call-site, capped user feedback history, and trimmed chat tool serialization. Added transparent retry-and-wait layer (capped at 90s) reading Groq Retry-After header with a frontend rotating status message.`,
      evaluation: `Operational token usage per generation call before vs after rate-limit fixes, and functional testing of both approval gates to confirm feedback actually persists and is reflected in subsequent generations.`,
      result: `A working two-gate agentic pipeline, deployed and demoable end-to-end: research -> strategy draft -> human approval -> daily content generation -> human approval -> persisted, copy-ready output.`,
      technologies: 'Python, LangGraph, FastAPI, Groq (Llama 3.1 / 3.3), PostgreSQL, Celery, Redis, Pydantic, React'
    };
  }

  return {
    title: p.title || '',
    subtitle: p.subtitle || '',
    category: p.category || 'Multi-Agent',
    githubUrl: p.githubUrl || '',
    liveDemoUrl: p.liveDemoUrl || '',
    videoDemoUrl: p.videoDemoUrl || '',
    coverImage: p.coverImage || '',
    featured: p.featured ?? true,
    problem: p.problem || p.description || '',
    architectureDescription: p.architectureDescription || '',
    solution: p.solution || '',
    engineeringDecisions: p.engineeringDecisions || '',
    hardPart: p.technicalChallenges?.map(c => `${c.title}:\n${c.detail}`).join('\n\n') || '',
    evaluation: p.metrics?.map(m => `${m.label}: ${m.value}`).join('\n') || '',
    result: p.lessonsLearned?.join('\n') || '',
    technologies: p.technologies?.join(', ') || ''
  };
};

const formStateToMarkdown = (f: FormState) => {
  return `# ${f.title || 'PROJECT NAME'}
${f.subtitle || 'One-sentence problem statement'}

[Live Demo] → ${f.liveDemoUrl || 'https://demo.example.com'}
[GitHub] → ${f.githubUrl || 'https://github.com/user/repo'}

---

### THE PROBLEM
${f.problem || ''}

---

### THE SYSTEM
${f.architectureDescription || ''}

---

### HOW IT WORKS
${f.solution || ''}

---

### ENGINEERING DECISIONS
${f.engineeringDecisions || ''}

---

### THE HARD PART
${f.hardPart || ''}

---

### EVALUATION
${f.evaluation || ''}

---

### RESULT
${f.result || ''}

---

### STACK
${f.technologies || ''}
`;
};

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  project,
  isNew,
  onClose,
  onSave,
  onDelete
}) => {
  const [editorMode, setEditorMode] = useState<'form' | 'markdown'>('form');
  const [formState, setFormState] = useState<FormState>(() => projectToFormState(project));
  const [markdownText, setMarkdownText] = useState<string>(() => formStateToMarkdown(projectToFormState(project)));

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormState(prev => ({ ...prev, videoDemoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModeChange = (newMode: 'form' | 'markdown') => {
    if (newMode === 'markdown') {
      setMarkdownText(formStateToMarkdown(formState));
    } else {
      // Sync from markdown back to form state if needed
      const titleMatch = markdownText.match(/^#\s+(.+)$/m);
      const problemMatch = markdownText.match(/###\s+(?:THE PROBLEM|Problem)\s+([\s\S]*?)(?=---|###|$)/i);
      const systemMatch = markdownText.match(/###\s+(?:THE SYSTEM|System|Architecture)\s+([\s\S]*?)(?=---|###|$)/i);
      const worksMatch = markdownText.match(/###\s+(?:HOW IT WORKS|How It Works|Solution)\s+([\s\S]*?)(?=---|###|$)/i);
      const decisionsMatch = markdownText.match(/###\s+(?:ENGINEERING DECISIONS|Engineering Decisions)\s+([\s\S]*?)(?=---|###|$)/i);
      const hardPartMatch = markdownText.match(/###\s+(?:THE HARD PART|The Hard Part|Challenges)\s+([\s\S]*?)(?=---|###|$)/i);
      const evaluationMatch = markdownText.match(/###\s+(?:EVALUATION|Evaluation|Metrics)\s+([\s\S]*?)(?=---|###|$)/i);
      const resultMatch = markdownText.match(/###\s+(?:RESULT|Result|Lessons)\s+([\s\S]*?)(?=---|###|$)/i);
      const stackMatch = markdownText.match(/###\s+(?:STACK|Stack)\s+([\s\S]*?)(?=---|###|$)/i);

      if (titleMatch) {
        setFormState(prev => ({
          ...prev,
          title: titleMatch[1].trim(),
          problem: problemMatch ? problemMatch[1].trim() : prev.problem,
          architectureDescription: systemMatch ? systemMatch[1].trim() : prev.architectureDescription,
          solution: worksMatch ? worksMatch[1].trim() : prev.solution,
          engineeringDecisions: decisionsMatch ? decisionsMatch[1].trim() : prev.engineeringDecisions,
          hardPart: hardPartMatch ? hardPartMatch[1].trim() : prev.hardPart,
          evaluation: evaluationMatch ? evaluationMatch[1].trim() : prev.evaluation,
          result: resultMatch ? resultMatch[1].trim() : prev.result,
          technologies: stackMatch ? stackMatch[1].trim().replace(/·/g, ',') : prev.technologies
        }));
      }
    }
    setEditorMode(newMode);
  };

  const buildProjectFromForm = (): Project => {
    const techArray = formState.technologies
      ? formState.technologies.split(/[,·]/).map(t => t.trim()).filter(Boolean)
      : ['Python', 'React', 'FastAPI'];

    const metricsList: { label: string; value: string }[] = [];
    if (formState.evaluation) {
      formState.evaluation.split('\n').forEach(line => {
        const clean = line.replace(/^[-*]\s*/, '').trim();
        if (clean.includes(':')) {
          const [k, ...rest] = clean.split(':');
          metricsList.push({ label: k.trim(), value: rest.join(':').trim() });
        } else if (clean) {
          metricsList.push({ label: 'Evaluation Metric', value: clean });
        }
      });
    }

    const slug = formState.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;

    return {
      id: project?.id || `project-${Date.now()}`,
      title: formState.title || 'Marketing Agent — Agentic Content Calendar Platform',
      slug: project?.slug || slug,
      subtitle: formState.subtitle,
      category: formState.category,
      description: formState.problem || formState.subtitle,
      coverImage: formState.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      gallery: project?.gallery || [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
      ],
      technologies: techArray,
      featured: formState.featured,
      githubUrl: formState.githubUrl,
      liveDemoUrl: formState.liveDemoUrl,
      videoDemoUrl: formState.videoDemoUrl,
      metrics: metricsList.length > 0 ? metricsList : (project?.metrics || [
        { label: "Approval Gates", value: "2 (Plan & Day)" },
        { label: "Publishing Control", value: "100% Human Approval" }
      ]),
      problem: formState.problem,
      solution: formState.solution,
      engineeringDecisions: formState.engineeringDecisions,
      architectureDescription: formState.architectureDescription,
      architectureNodes: project?.architectureNodes || [
        { id: "1", label: "Business Input & Web Research", type: "client", status: "Active" },
        { id: "2", label: "Planner Node (Llama)", type: "model", status: "Active" },
        { id: "3", label: "PLAN GATE (Human Strategy Approval)", type: "gateway", status: "Active" },
        { id: "4", label: "Day Content Node (Caption + Copy)", type: "model", status: "Active" },
        { id: "5", label: "DAY GATE (Human Post Approval)", type: "gateway", status: "Active" },
        { id: "6", label: "Postgres Persisted State & API", type: "db", status: "Active" }
      ],
      technicalChallenges: formState.hardPart
        ? [{ title: 'THE HARD PART', detail: formState.hardPart, metricImpact: 'Resolved' }]
        : (project?.technicalChallenges || []),
      lessonsLearned: formState.result ? formState.result.split('\n').filter(Boolean) : (project?.lessonsLearned || []),
      codeSnippet: project?.codeSnippet || { language: 'python', filename: 'marketing_graph.py', code: 'def plan_gate(): pass' },
      futureImprovements: project?.futureImprovements || []
    };
  };

  const handleSave = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const updated = buildProjectFromForm();
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div 
        className="relative w-full max-w-4xl my-6 bg-black border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-200 max-h-[92vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[#ff4d00]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {isNew ? 'Create New AI System Specification' : `Edit Specification: ${formState.title || 'Untitled'}`}
              </h2>
              <span className="text-[10px] text-zinc-500 font-mono uppercase">PROJECT FORM SPECIFICATION EDITOR</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-md">
              <button
                type="button"
                onClick={() => handleModeChange('form')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  editorMode === 'form'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Form Fields</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('markdown')}
                className={`px-3 py-1 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  editorMode === 'markdown'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Markdown Spec</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center space-x-1.5 transition-colors uppercase tracking-wider shadow-sm cursor-pointer font-mono"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Spec</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 bg-[#030303] flex-1">
          {editorMode === 'form' ? (
            <div className="space-y-6">
              {/* SECTION 1: CORE METADATA & DEMO LINKS */}
              <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800/60">
                  <Code2 className="w-4 h-4 text-[#ff4d00]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Project Identity & Live Links</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center space-x-1">
                      <span>PROJECT NAME</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.title}
                      onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Marketing Agent — Agentic Content Calendar Platform"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-zinc-600 font-sans font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">CATEGORY</label>
                    <select
                      value={formState.category}
                      onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-sans"
                    >
                      {CATEGORY_OPTIONS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">ONE-SENTENCE PROBLEM STATEMENT / SUBTITLE</label>
                  <input
                    type="text"
                    value={formState.subtitle}
                    onChange={(e) => setFormState(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Businesses need a consistent social content presence but don't have time to plan..."
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                      <span>LIVE DEMO URL</span>
                    </label>
                    <input
                      type="url"
                      value={formState.liveDemoUrl}
                      onChange={(e) => setFormState(prev => ({ ...prev, liveDemoUrl: e.target.value }))}
                      placeholder="https://chat-ad-architect.lovable.app"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-emerald-400 font-mono focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center space-x-1">
                      <Github className="w-3 h-3 text-zinc-300" />
                      <span>GITHUB REPOSITORY URL</span>
                    </label>
                    <input
                      type="url"
                      value={formState.githubUrl}
                      onChange={(e) => setFormState(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/Nestcy/marketing_agent"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-300 font-mono focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">COVER IMAGE URL</label>
                    <input
                      type="text"
                      value={formState.coverImage}
                      onChange={(e) => setFormState(prev => ({ ...prev, coverImage: e.target.value }))}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-400 font-mono focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-5">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formState.featured}
                      onChange={(e) => setFormState(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#ff4d00] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs font-mono text-zinc-200 uppercase cursor-pointer select-none">
                      Feature on Primary Portfolio Feed
                    </label>
                  </div>
                </div>

                {/* DEMO VIDEO SPECIFICATION FIELD & UPLOAD PLACEHOLDER */}
                <div className="p-3.5 bg-black/90 border border-zinc-800/90 rounded-lg space-y-3 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                    <label className="text-[10px] text-zinc-200 uppercase font-bold flex items-center space-x-1.5">
                      <Video className="w-3.5 h-3.5 text-rose-500" />
                      <span>DEMO VIDEO SPECIFICATION</span>
                    </label>
                    {formState.videoDemoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormState(prev => ({ ...prev, videoDemoUrl: '' }))}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-mono underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Video</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Option 1: URL Input */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-400 uppercase font-bold">1. Demo Video URL / Embed Link</span>
                      <input
                        type="text"
                        value={formState.videoDemoUrl}
                        onChange={(e) => setFormState(prev => ({ ...prev, videoDemoUrl: e.target.value }))}
                        placeholder="e.g. https://youtube.com/watch?v=... or Loom / MP4 link"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-rose-300 font-mono focus:outline-none focus:border-zinc-600"
                      />
                    </div>

                    {/* Option 2: File Upload */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-400 uppercase font-bold">2. Upload Video File</span>
                      <label className="flex items-center justify-center space-x-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-700 hover:border-rose-500 rounded text-xs text-zinc-300 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-mono text-[11px] uppercase truncate">
                          {formState.videoDemoUrl?.startsWith('data:video') ? 'Video Uploaded (Click to Change)' : 'Browse or Drop MP4 / WEBM File'}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Active Video Preview / Player Box */}
                  {formState.videoDemoUrl && (
                    <div className="p-2.5 bg-zinc-950 border border-zinc-800/90 rounded space-y-2">
                      <div className="text-[10px] text-emerald-400 flex items-center justify-between">
                        <span className="flex items-center space-x-1 font-bold">
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>ACTIVE DEMO VIDEO PREVIEW</span>
                        </span>
                        <span className="text-zinc-500 text-[9px] truncate max-w-[220px]">
                          {formState.videoDemoUrl.startsWith('data:') ? 'Local File Upload' : formState.videoDemoUrl}
                        </span>
                      </div>

                      {formState.videoDemoUrl.startsWith('data:video') || formState.videoDemoUrl.endsWith('.mp4') || formState.videoDemoUrl.endsWith('.webm') ? (
                        <video
                          src={formState.videoDemoUrl}
                          controls
                          className="w-full max-h-48 object-contain bg-black rounded border border-zinc-800"
                        />
                      ) : (
                        <div className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded text-xs text-zinc-300 flex items-center justify-between">
                          <span className="truncate text-[11px] font-mono text-zinc-300">Video Link: {formState.videoDemoUrl}</span>
                          <a
                            href={formState.videoDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold uppercase rounded border border-rose-800/80 flex items-center space-x-1 shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Test Link</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: THE PROBLEM & THE SYSTEM */}
              <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800/60">
                  <HelpCircle className="w-4 h-4 text-[#ff4d00]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. The Problem & System Architecture</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">THE PROBLEM (What problem were you solving?)</label>
                  <textarea
                    rows={4}
                    value={formState.problem}
                    onChange={(e) => setFormState(prev => ({ ...prev, problem: e.target.value }))}
                    placeholder="Small businesses either do their own social content or hand it to a tool that generates autonomously..."
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 leading-relaxed font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">THE SYSTEM (Architecture Diagram & Flow Overview)</label>
                  <textarea
                    rows={4}
                    value={formState.architectureDescription}
                    onChange={(e) => setFormState(prev => ({ ...prev, architectureDescription: e.target.value }))}
                    placeholder="Business input -> Research Node (Tavily + Firecrawl) -> Planner Node -> PLAN GATE -> Day Content Node -> DAY GATE -> Postgres"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-600 leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION 3: HOW IT WORKS & ENGINEERING DECISIONS */}
              <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800/60">
                  <Layers className="w-4 h-4 text-[#ff4d00]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. How It Works & Engineering Decisions</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">HOW IT WORKS (Components Breakdown)</label>
                  <textarea
                    rows={5}
                    value={formState.solution}
                    onChange={(e) => setFormState(prev => ({ ...prev, solution: e.target.value }))}
                    placeholder="Component 1 — Research & Planning Graph (LangGraph)&#10;Component 2 — Two Human-Approval Gates&#10;Component 3 — Daily Content Generation&#10;Component 4 — Celery Beat Cron + Chat Router"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 leading-relaxed font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">ENGINEERING DECISIONS (Why LangGraph? Why RAG? Why two gates? Why these models?)</label>
                  <textarea
                    rows={5}
                    value={formState.engineeringDecisions}
                    onChange={(e) => setFormState(prev => ({ ...prev, engineeringDecisions: e.target.value }))}
                    placeholder="Why LangGraph? Research -> plan step is a genuine small pipeline...&#10;Why RAG? Not used here, deliberately...&#10;Why two gates? Splitting strategy and post level..."
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* SECTION 4: THE HARD PART, EVALUATION, RESULT & STACK */}
              <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800/60">
                  <Flame className="w-4 h-4 text-[#ff4d00]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">4. The Hard Part, Evaluation & Tech Stack</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">THE HARD PART (What broke? What constraint existed? What did you change?)</label>
                  <textarea
                    rows={4}
                    value={formState.hardPart}
                    onChange={(e) => setFormState(prev => ({ ...prev, hardPart: e.target.value }))}
                    placeholder="What broke? Groq rate limits...&#10;What constraint existed? Token limits...&#10;What changed? Capped web scrape context, configurable model selection, feedback history truncation..."
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 leading-relaxed font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center space-x-1">
                      <BarChart3 className="w-3 h-3 text-emerald-400" />
                      <span>EVALUATION / METRICS</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formState.evaluation}
                      onChange={(e) => setFormState(prev => ({ ...prev, evaluation: e.target.value }))}
                      placeholder="Approval Gates: 2 (Plan & Day)&#10;Publishing Control: 100% Human Approval"
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-emerald-400 font-mono focus:outline-none focus:border-zinc-600 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center space-x-1">
                      <CheckSquare className="w-3 h-3 text-zinc-300" />
                      <span>RESULT / KEY LESSONS</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formState.result}
                      onChange={(e) => setFormState(prev => ({ ...prev, result: e.target.value }))}
                      placeholder="A working two-gate agentic pipeline, deployed and demoable end-to-end..."
                      className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-[#ff4d00]" />
                    <span>STACK / TECHNOLOGIES (Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formState.technologies}
                    onChange={(e) => setFormState(prev => ({ ...prev, technologies: e.target.value }))}
                    placeholder="Python, LangGraph, FastAPI, Groq (Llama 3.1 / 3.3), PostgreSQL, Celery, Redis, Pydantic, React"
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* MARKDOWN CANVAS MODE */
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg shrink-0">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-sans">Markdown Document Canvas</h3>
                  <p className="text-[10px] text-zinc-500 font-sans">Write or paste your full project spec directly in raw markdown format.</p>
                </div>
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-[10px] rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>MARKDOWN SYNC ACTIVE</span>
                </div>
              </div>

              <textarea
                rows={22}
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="w-full flex-1 min-h-[460px] p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-600 leading-relaxed resize-y"
              />
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] text-zinc-500">
              {project?.id ? `ID: ${project.id}` : 'Draft Mode'}
            </span>
            {!isNew && project && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(project)}
                className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                title="Delete this project artifact"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Project</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Spec</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
