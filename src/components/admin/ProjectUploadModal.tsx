import React, { useState, useRef } from 'react';
import { Project } from '../../types';
import {
  X,
  Upload,
  FileCode,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  Layers,
  Code2
} from 'lucide-react';

interface ProjectUploadModalProps {
  onClose: () => void;
  onImport: (projects: Project[]) => void;
}

export const ProjectUploadModal: React.FC<ProjectUploadModalProps> = ({
  onClose,
  onImport
}) => {
  const [mode, setMode] = useState<'json' | 'markdown' | 'quick-schema'>('json');
  const [jsonText, setJsonText] = useState('');
  const [markdownText, setMarkdownText] = useState('');
  const [parsedProjects, setParsedProjects] = useState<Project[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template example for JSON
  const sampleJsonTemplate = `[
  {
    "id": "my-custom-ai-system",
    "title": "Autonomous Code Reviewer Swarm",
    "slug": "autonomous-code-reviewer-swarm",
    "subtitle": "Multi-Agent Git Hook Static & Semantic AST Analysis",
    "category": "Multi-Agent",
    "description": "Multi-agent review bot parsing AST trees, verifying typing safety, and generating automated PR comments.",
    "coverImage": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    "gallery": [],
    "technologies": ["LangGraph", "Tree-Sitter", "TypeScript", "FastAPI", "Docker"],
    "featured": true,
    "githubUrl": "https://github.com/alexrivera-ai/code-reviewer-swarm",
    "metrics": [
      { "label": "Review Latency", "value": "<1.2s" },
      { "label": "Bug Detection Rate", "value": "94.2%" }
    ],
    "problem": "Manual code reviews bottlenecked sprint velocity and missed subtle concurrent race conditions.",
    "solution": "Built a LangGraph multi-agent supervisor analyzing AST diffs and generating PR review annotations.",
    "architectureDescription": "GitHub Webhook -> AST Parser -> Agent Swarm -> Synthesis -> GitHub PR comment.",
    "architectureNodes": [
      { "id": "1", "label": "GitHub Webhook", "type": "client", "status": "Active" },
      { "id": "2", "label": "AST Tree Parser", "type": "gateway", "status": "Active" },
      { "id": "3", "label": "Agent Reviewers", "type": "model", "status": "Active" }
    ],
    "technicalChallenges": [
      { "title": "Large Diff Token Budgeting", "detail": "Implemented AST-aware semantic chunking.", "metricImpact": "Trimmed context by 55%" }
    ],
    "lessonsLearned": ["Syntactic trees reduce LLM hallucination in code review."],
    "futureImprovements": ["Add automatic unit test test-bench generation."]
  }
]`;

  const sampleMarkdownTemplate = `# PROJECT NAME
One-sentence problem statement

[Live Demo](https://demo.example.com) | [GitHub](https://github.com/alexrivera-ai/project)

---

### THE PROBLEM
What problem were you solving? Describe the bottleneck, scale constraint, or latency issue.

---

### THE SYSTEM
Architecture diagram / pipeline summary: GitHub Webhook -> AST Parser -> Agent Swarm -> Synthesis -> PR Comment.

---

### HOW IT WORKS
- Component 1: AST Parser and Diff Chunking Engine
- Component 2: LangGraph Supervisor Orchestrator
- Component 3: Specialized Security & Style Evaluation Agents
- Component 4: Synthesizer & GitHub Annotation Publisher

---

### ENGINEERING DECISIONS
- Why LangGraph? State machine support for cyclic agent evaluation loops.
- Why RAG? In-repo semantic retrieval for project-specific conventions.
- Why this architecture? Decoupled worker agents isolate context windows.
- Why these models? Claude 3.5 Sonnet for code parsing + Flash for fast routing.

---

### THE HARD PART
What broke? Token budget exhausted on 5,000+ line pull requests.
What constraint existed? GitHub API ratelimits & sub-second response expectation.
What did you change? Implemented AST-aware semantic chunking & parallel sub-agent workers.

---

### EVALUATION
- Review Latency: <1.2s
- Bug Detection Accuracy: 94.2%
- Context Window Reduction: 55%

---

### RESULT
Automated code review across 40+ microservices, reducing PR review cycle times by 65%.

---

### STACK
Python · LangGraph · FastAPI · PostgreSQL · Docker
`;

  // Parse JSON input
  const handleParseJSON = () => {
    setErrorMsg(null);
    try {
      const data = JSON.parse(jsonText);
      const items: Project[] = Array.isArray(data) ? data : [data];
      
      // Basic normalization
      const validated: Project[] = items.map((p, i) => ({
        id: p.id || `project-${Date.now()}-${i}`,
        title: p.title || 'Untitled Project',
        slug: p.slug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `project-${i}`),
        subtitle: p.subtitle || '',
        category: p.category || 'RAG',
        description: p.description || p.problem || '',
        coverImage: p.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        gallery: p.gallery || [],
        technologies: p.technologies || ['Python', 'FastAPI'],
        featured: p.featured ?? true,
        githubUrl: p.githubUrl || 'https://github.com/alexrivera-ai',
        liveDemoUrl: p.liveDemoUrl || '',
        videoDemoUrl: p.videoDemoUrl || '',
        metrics: p.metrics || [{ label: 'Performance', value: 'Optimized' }],
        problem: p.problem || '',
        solution: p.solution || '',
        architectureDescription: p.architectureDescription || '',
        architectureNodes: p.architectureNodes || [
          { id: '1', label: 'Client Gateway', type: 'client', status: 'Active' },
          { id: '2', label: 'Inference Engine', type: 'model', status: 'Active' }
        ],
        technicalChallenges: p.technicalChallenges || [],
        lessonsLearned: p.lessonsLearned || [],
        codeSnippet: p.codeSnippet || undefined,
        futureImprovements: p.futureImprovements || []
      }));

      setParsedProjects(validated);
    } catch (e: any) {
      setErrorMsg(`JSON Parse Error: ${e.message}`);
    }
  };

  // Parse Markdown input
  const handleParseMarkdown = () => {
    setErrorMsg(null);
    try {
      const titleMatch = markdownText.match(/^#\s+(.+)$/m);
      const lines = markdownText.split('\n');
      let subtitle = '';
      if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (l && !l.startsWith('#') && !l.startsWith('---') && !l.startsWith('[') && !l.startsWith('**')) {
            subtitle = l;
            break;
          }
        }
      }

      const githubMatch = markdownText.match(/\[GitHub\]\(([^)]+)\)|\*\*GitHub:\*\*\s*(.+)$/m);
      const liveDemoMatch = markdownText.match(/\[Live Demo\]\(([^)]+)\)|\[Try Demo\]\(([^)]+)\)|\*\*Live Demo:\*\*\s*(.+)$/m);

      const problemMatch = markdownText.match(/###\s+(?:THE PROBLEM|Problem)\s+([\s\S]*?)(?=---|###|$)/i);
      const systemMatch = markdownText.match(/###\s+(?:THE SYSTEM|System|Architecture)\s+([\s\S]*?)(?=---|###|$)/i);
      const worksMatch = markdownText.match(/###\s+(?:HOW IT WORKS|How It Works|Solution)\s+([\s\S]*?)(?=---|###|$)/i);
      const decisionsMatch = markdownText.match(/###\s+(?:ENGINEERING DECISIONS|Engineering Decisions)\s+([\s\S]*?)(?=---|###|$)/i);
      const hardPartMatch = markdownText.match(/###\s+(?:THE HARD PART|The Hard Part|Challenges)\s+([\s\S]*?)(?=---|###|$)/i);
      const evaluationMatch = markdownText.match(/###\s+(?:EVALUATION|Evaluation|Metrics)\s+([\s\S]*?)(?=---|###|$)/i);
      const resultMatch = markdownText.match(/###\s+(?:RESULT|Result|Lessons)\s+([\s\S]*?)(?=---|###|$)/i);
      const stackMatch = markdownText.match(/###\s+(?:STACK|Stack)\s+([\s\S]*?)(?=---|###|$)/i) || markdownText.match(/\*\*Technologies:\*\*\s*(.+)$/m);

      const title = titleMatch ? titleMatch[1].trim() : 'PROJECT NAME';
      const githubUrl = githubMatch ? (githubMatch[1] || githubMatch[2] || '').trim() : 'https://github.com/alexrivera-ai';
      const liveDemoUrl = liveDemoMatch ? (liveDemoMatch[1] || liveDemoMatch[2] || liveDemoMatch[3] || '').trim() : '';

      const problem = problemMatch ? problemMatch[1].trim() : '';
      const architectureDescription = systemMatch ? systemMatch[1].trim() : '';
      const solution = worksMatch ? worksMatch[1].trim() : '';
      const engineeringDecisions = decisionsMatch ? decisionsMatch[1].trim() : '';
      const hardPartText = hardPartMatch ? hardPartMatch[1].trim() : '';
      const evaluationText = evaluationMatch ? evaluationMatch[1].trim() : '';
      const resultText = resultMatch ? resultMatch[1].trim() : '';
      const stackText = stackMatch ? (stackMatch[1] || '').trim() : '';

      // Parse stack
      const technologies = stackText
        ? stackText.replace(/·/g, ',').split(/,|\n/).map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
        : ['Python', 'LangGraph', 'FastAPI', 'PostgreSQL'];

      // Parse metrics
      const metricsList: { label: string; value: string }[] = [];
      if (evaluationText) {
        evaluationText.split('\n').forEach(line => {
          const clean = line.replace(/^[-*]\s*/, '').trim();
          if (clean.includes(':')) {
            const [k, v] = clean.split(':');
            metricsList.push({ label: k.trim(), value: v.trim() });
          }
        });
      }
      if (metricsList.length === 0) {
        metricsList.push({ label: 'Review Latency', value: '<1.2s' }, { label: 'Accuracy', value: '94.2%' });
      }

      // Parse challenges
      const technicalChallenges = hardPartText ? [
        {
          title: 'THE HARD PART',
          detail: hardPartText,
          metricImpact: 'Resolved scale & latency bottleneck'
        }
      ] : [];

      // Parse result/lessons
      const lessonsLearned = resultText ? [resultText] : [];

      const newProject: Project = {
        id: `project-${Date.now()}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subtitle: subtitle || 'One-sentence problem statement',
        category: 'Multi-Agent',
        description: problem ? problem.slice(0, 160) + '...' : 'Production AI system architecture.',
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        gallery: [],
        technologies,
        featured: true,
        githubUrl,
        liveDemoUrl,
        metrics: metricsList,
        problem,
        solution,
        engineeringDecisions,
        architectureDescription,
        architectureNodes: [
          { id: '1', label: 'Ingestion Layer', type: 'client', status: 'Active' },
          { id: '2', label: 'Orchestrator Node', type: 'gateway', status: 'Active' },
          { id: '3', label: 'Inference Engine', type: 'model', status: 'Active' }
        ],
        technicalChallenges,
        lessonsLearned,
        futureImprovements: []
      };

      setParsedProjects([newProject]);
    } catch (e: any) {
      setErrorMsg(`Markdown Parse Error: ${e.message}`);
    }
  };

  // Handle Drag & Drop File Upload
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    setErrorMsg(null);
    const reader = new FileReader();
    
    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setJsonText(content);
        setMode('json');
        try {
          const parsed = JSON.parse(content);
          const list = Array.isArray(parsed) ? parsed : [parsed];
          setParsedProjects(list);
        } catch (err: any) {
          setErrorMsg(`Error parsing dropped JSON: ${err.message}`);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdownText(content);
        setMode('markdown');
      };
      reader.readAsText(file);
    } else {
      setErrorMsg('Please upload a .json or .md/.txt project spec file.');
    }
  };

  const handleConfirmImport = () => {
    if (parsedProjects.length === 0) {
      alert('No parsed projects to import.');
      return;
    }
    onImport(parsedProjects);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div 
        className="relative w-full max-w-3xl my-6 bg-black border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-200 max-h-[90vh] flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                Upload & Import AI Projects
              </h2>
              <span className="text-[10px] text-zinc-500">JSON SCHEMA // MARKDOWN READMES // FILE DROPPING</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex space-x-1 text-xs">
            <button
              onClick={() => setMode('json')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors flex items-center space-x-1.5 ${
                mode === 'json'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white bg-zinc-900'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>JSON Schema</span>
            </button>

            <button
              onClick={() => setMode('markdown')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors flex items-center space-x-1.5 ${
                mode === 'markdown'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white bg-zinc-900'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Markdown / README</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (mode === 'json') {
                setJsonText(sampleJsonTemplate);
                setTimeout(handleParseJSON, 50);
              } else {
                setMarkdownText(sampleMarkdownTemplate);
                setTimeout(handleParseMarkdown, 50);
              }
            }}
            className="px-2.5 py-1 text-[9px] uppercase rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center space-x-1"
          >
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>Load Sample</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs bg-[#030303]">
          
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-emerald-400 bg-emerald-950/20'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,.md,.txt"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
            <div className="font-bold text-white text-xs">
              Click to browse or drop .json / .md file here
            </div>
            <div className="text-[10px] text-zinc-500 font-sans mt-1">
              Supports single project JSON, bulk project array JSON, or formatted Markdown files.
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg flex items-center space-x-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Text Editor Area */}
          {mode === 'json' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Paste Project JSON Code</label>
                <button
                  type="button"
                  onClick={handleParseJSON}
                  className="px-2.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-[10px] uppercase border border-zinc-700 font-bold"
                >
                  Parse JSON Schema
                </button>
              </div>
              <textarea
                rows={8}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste project schema JSON here..."
                className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-600"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Paste Markdown / README Text</label>
                <button
                  type="button"
                  onClick={handleParseMarkdown}
                  className="px-2.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-[10px] uppercase border border-zinc-700 font-bold"
                >
                  Parse Markdown
                </button>
              </div>
              <textarea
                rows={8}
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                placeholder="# Project Title&#10;**Category:** Multi-Agent&#10;### Problem&#10;..."
                className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-600"
              />
            </div>
          )}

          {/* Parsed Preview Section */}
          {parsedProjects.length > 0 && (
            <div className="space-y-3 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready to Import: {parsedProjects.length} Project(s)</span>
                </div>
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-1 rounded bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                >
                  <span>Confirm Import</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {parsedProjects.map((p, idx) => (
                  <div key={idx} className="p-3 bg-black border border-zinc-800 rounded flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.2 bg-zinc-900 text-emerald-400 text-[9px] uppercase font-bold rounded">
                          {p.category}
                        </span>
                        <span className="font-bold text-white text-xs truncate">{p.title}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">{p.subtitle}</div>
                      <div className="text-[9px] text-zinc-500 font-sans truncate">
                        Stack: {p.technologies.join(', ')}
                      </div>
                    </div>

                    <span className="text-[10px] text-zinc-500 uppercase shrink-0">
                      {p.metrics?.length || 0} metrics
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs uppercase"
          >
            Cancel
          </button>

          {parsedProjects.length > 0 && (
            <button
              onClick={handleConfirmImport}
              className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Import {parsedProjects.length} Project(s) to Portfolio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
