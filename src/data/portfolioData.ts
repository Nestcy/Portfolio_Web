import { Project, BlogPost, Certification, SkillItem, TimelineItem, VideoShowcaseItem, GitHubRepo } from '../types';

export const PERSONAL_INFO = {
  name: "Nestcy",
  title: "Lead AI Systems Architect & Staff ML Engineer",
  handle: "@Nestcy",
  email: "nestcy770@gmail.com",
  location: "San Francisco, CA (Open to Remote / Hybrid)",
  bio: "Architecting fault-tolerant LLM infrastructure, real-time multi-agent swarms, hybrid RAG engines, and low-latency computer vision pipelines for high-throughput enterprise scale.",
  availability: "Open for Staff AI Roles, Advisory & System Consulting",
  github: "https://github.com/Nestcy",
  linkedin: "https://linkedin.com/in/nestcy",
  twitter: "https://x.com/nestcy",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  heroTitle: "Building Intelligent Systems, Not Just Software.",
  heroSubtitle: "Lead AI System Architect specializing in high-scale LLM architectures, RAG pipelines, sub-100ms vector retrieval, and autonomous agent orchestration. Converting complex research into production-grade systems.",
  heroTechStack: ["PyTorch", "LangGraph", "Pinecone", "CUDA", "Rust", "vLLM", "Ray", "Qdrant", "TensorRT", "BGE-M3"],
  heroCtaPrimaryText: "View Projects",
  heroCtaSecondaryText: "Resume CV",
  stats: [
    { label: "Daily Token Throughput", value: "18.4M+" },
    { label: "RAG Precision @ K=5", value: "95.6%" },
    { label: "P99 Inference Latency", value: "<120ms" },
    { label: "Production Agents", value: "34+" },
  ]
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "marketing-agent",
    title: "Marketing Agent — Agentic Content Calendar Platform",
    slug: "marketing-agent",
    subtitle: "Businesses need a consistent social content presence but don't have time to plan and write it daily — and fully autonomous posting tools solve that by removing the human from what actually ships.",
    category: "Multi-Agent",
    description: "Small businesses either do their own social content or hand it to a tool that generates and posts autonomously. This middle path AI does the actual planning and writing work, but never publishes anything without explicit human approval at both strategy and post levels.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["Python", "LangGraph", "FastAPI", "Groq (Llama 3.1 / 3.3)", "PostgreSQL", "Celery", "Redis", "Pydantic", "React"],
    featured: true,
    githubUrl: "https://github.com/Nestcy/marketing_agent",
    liveDemoUrl: "https://chat-ad-architect.lovable.app",
    videoDemoUrl: "",
    metrics: [
      { label: "Approval Gates", value: "2 (Plan & Day)" },
      { label: "Publishing Control", value: "100% Human Approval" },
      { label: "LLM Inference Cost", value: "Flat per Campaign" },
      { label: "Context Window Cap", value: "Strict Hard Limits" }
    ],
    problem: `Small businesses either do their own social content (time they don't have) or hand it to a tool that generates and posts autonomously (which removes their judgment from what represents their brand). I wanted a middle path: an AI that does the actual planning and writing work, but never publishes anything without an explicit human approval — at both the strategy level and the individual-post level.`,
    solution: `Component 1 — Research & Planning Graph (LangGraph)
Researches a business (capped scrape/search content, not full raw pages), then produces a lightweight 3-day strategy outline in a single LLM call — one call regardless of how long the campaign runs, since day-by-day detail isn't decided yet at this stage.

Component 2 — Two Human-Approval Gates
Plan Gate and Day Gate. Nothing generated ever auto-publishes; every piece of output requires an explicit human decision, and every refinement is persisted (campaign_preferences) and re-applied to all future generations — feedback compounds rather than resets each time.

Component 3 — Daily Content Generation (standalone, not graph-chained)
Generates one day's caption, ad copy variants, and image prompt at a time — deliberately not pre-computed for the whole campaign upfront, which is what keeps token cost flat regardless of campaign length. No image is generated directly; the image prompt is meant to be pasted into whatever image tool the business already uses.

Component 4 — Celery Beat Cron + Chat Router
A daily background job keeps content generated ahead of schedule without requiring the business to remember to log in. A Groq tool-calling chat interface exposes the exact same approve/refine/tweak actions as the REST API, so chat and the dashboard UI always operate on one consistent, Postgres-persisted source of truth.`,
    architectureDescription: `Business input -> Research Node (Tavily + Firecrawl, capped context) -> Planner Node (single LLM call -> 3-day strategy outline) -> PLAN GATE (human: approve / refine) -> Day Content Node (per day: caption + ad copy variants + image prompt) -> DAY GATE (human: approve / tweak) -> Persisted state (Postgres) -> REST API + Chat interface (same underlying actions) -> Celery Beat (daily cron)`,
    architectureNodes: [
      { id: "1", label: "Business Input & Web Research (Tavily + Firecrawl)", type: "client", status: "Active" },
      { id: "2", label: "Planner Node (Single LLM Call)", type: "model", status: "Active" },
      { id: "3", label: "PLAN GATE (Human Strategy Approval)", type: "gateway", status: "Active" },
      { id: "4", label: "Day Content Node (Caption + Ad Copy)", type: "model", status: "Active" },
      { id: "5", label: "DAY GATE (Human Post Approval)", type: "gateway", status: "Active" },
      { id: "6", label: "Postgres Persisted State & REST/Chat API", type: "db", status: "Active" }
    ],
    engineeringDecisions: `Why LangGraph?
The research → plan step is a genuine small pipeline with a clear start/stop, well suited to a graph with checkpointed state. But day-by-day content generation is deliberately kept OUTSIDE the graph as a standalone function — chaining it into the graph would have encouraged pre-generating an entire campaign's content upfront, which is exactly the "expensive by default" pattern I was trying to avoid.

Why RAG?
Not used here, deliberately. Business context comes from live web research (Tavily/Firecrawl) per campaign rather than a persistent vector store — each campaign is a one-time research pass on a specific business, not a corpus that benefits from retrieval over repeated queries. RAG would have added infrastructure (a vector DB) without a real retrieval workload to justify it.

Why this architecture (two gates, not one)?
A single "review before publish" gate seems sufficient at first, but it either forces reviewing an entire campaign's strategy AND every day's content at once (overwhelming), or reviewing nothing until it's too granular to give useful strategic feedback. Splitting into a plan-level gate and a day-level gate lets feedback happen at the right altitude for each kind of decision.

Why these models?
Groq-hosted Llama models, chosen for low-latency, low-cost inference suited to a workload that's mostly structured short-form generation (captions, ad copy, prompts) rather than long-form reasoning. Model choice is now configurable per call-site via environment variables (GROQ_PLANNER_MODEL, GROQ_DAY_MODEL, GROQ_CHAT_MODEL), so heavier models can be reserved for the one-time planning call while cheaper/faster models handle the higher-frequency day-generation and chat calls.`,
    technicalChallenges: [
      {
        title: "Groq Rate Limit Spikes & Token Inflation",
        detail: "Traced to four compounding causes: uncapped web scrape context in prompts, heavier default models, unbounded user feedback history re-sent on every call, and chat tools serializing all past days into context. Fixed by capping scrape context, making model selection configurable, capping feedback to recent entries, and trimming chat tool serialization to summary counts. Added a transparent retry-and-wait layer (capped at 90s) reading Groq's Retry-After header paired with a frontend rotating status message.",
        metricImpact: "Brought per-minute token usage under control with flat costs & smooth retries."
      }
    ],
    lessonsLearned: [
      "A working two-gate agentic pipeline (research → strategy draft → human approval → daily content generation → human approval → persisted output) preserves brand safety while automating heavy planning work.",
      "Per-minute token usage is best managed through root-cause context capping rather than blanket rate-limiting.",
      "Deliberately eliminating direct image generation removed an entire billing & failure-mode dependency without reducing user value."
    ],
    codeSnippet: {
      language: "python",
      filename: "marketing_graph_pipeline.py",
      code: `from langgraph.graph import StateGraph, END
from pydantic import BaseModel

class CampaignState(BaseModel):
    business_input: str
    research_summary: str
    plan_approved: bool = False
    campaign_preferences: list[str] = []

def plan_gate_node(state: CampaignState):
    if not state.plan_approved:
        return "WAIT_HUMAN_APPROVAL"
    return "GENERATE_DAY_CONTENT"`
    },
    futureImprovements: [
      "Support multi-channel output formatting tailored for LinkedIn, Twitter/X, and Instagram carousels.",
      "Add automated engagement analytics tracking back to Postgres to continuously refine campaign preference weights."
    ]
  },
  {
    id: "rag-nexus-enterprise",
    title: "RAG-Nexus Enterprise Engine",
    slug: "rag-nexus-enterprise",
    subtitle: "Hybrid Dense-Sparse Vector Retrieval & Context Compressor",
    category: "RAG",
    description: "Production RAG engine handling 5,000+ internal enterprise PDFs and Slack logs. Features Reciprocal Rank Fusion (RRF), BGE-M3 embeddings, Qdrant cluster quantization, and FlashRank cross-encoder reranking.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["FastAPI", "Qdrant", "PyTorch", "BGE-M3", "FlashRank", "Redis", "Docker", "LangChain"],
    featured: true,
    githubUrl: "https://github.com/Nestcy/rag-nexus-enterprise",
    liveDemoUrl: "https://rag-nexus.demo.ai-arch.dev",
    videoDemoUrl: "https://youtube.com/watch?v=demo_rag_nexus",
    metrics: [
      { label: "Search Hit Rate @ 5", value: "95.6%" },
      { label: "Vector DB Latency", value: "14ms" },
      { label: "Context Window Saved", value: "68%" },
      { label: "PDF Processed", value: "120K+" }
    ],
    problem: "Enterprise customer documentation had 45,000+ unstructured documents. Standard semantic vector search failed on domain jargon, part numbers, and multi-hop questions while blowing past context token budgets.",
    solution: "Designed a two-stage hybrid retrieval architecture: BM25 sparse index combined with BGE-M3 dense embeddings via Reciprocal Rank Fusion (RRF k=60), followed by an edge-optimized cross-encoder reranker that prunes context noise by 68%.",
    architectureDescription: "Ingestion Worker extracts tables & text -> BGE-M3 Embedder -> Qdrant HNSW Index -> BM25 Sparse Index -> Reciprocal Rank Fusion -> Cross-Encoder FlashRank -> LLM Synthesis -> Client streaming websocket.",
    architectureNodes: [
      { id: "1", label: "Document Ingestion", type: "client", status: "Active" },
      { id: "2", label: "BM25 Sparse + BGE-M3 Dense", type: "gateway", status: "Active" },
      { id: "3", label: "Qdrant Vector Cluster", type: "vector", status: "Active" },
      { id: "4", label: "FlashRank Cross-Encoder Reranker", type: "cache", status: "Active" },
      { id: "5", label: "Gemini 2.5 Flash Synthesis", type: "model", status: "Active" }
    ],
    technicalChallenges: [
      {
        title: "Table & Schema Extraction from Scanned PDF Documents",
        detail: "Standard pdfplumber missed multi-column tables. Built a custom LayoutLMv3 vision-text pipeline to parse markdown tables before chunking.",
        metricImpact: "Improved table query recall by 340%"
      },
      {
        title: "High Memory Footprint of Dense HNSW Vector Indices",
        detail: "Applied 8-bit scalar quantization (SQ) and payload memory indexing in Qdrant.",
        metricImpact: "Reduced RAM footprint from 64GB down to 14.2GB with <0.3% recall loss."
      }
    ],
    lessonsLearned: [
      "Naive semantic search is insufficient for technical documentation with alphanumeric IDs; hybrid BM25 + dense retrieval is non-negotiable.",
      "Context reranking produces far better synthesis answers than simply sending top-20 raw chunks to the LLM."
    ],
    codeSnippet: {
      language: "python",
      filename: "hybrid_rrf_reranker.py",
      code: `def reciprocal_rank_fusion(dense_results, sparse_results, k=60):
    """
    Combines dense vector search scores and sparse BM25 ranks via RRF algorithm.
    """
    rrf_scores = {}
    for rank, doc in enumerate(dense_results):
        rrf_scores[doc.id] = rrf_scores.get(doc.id, 0) + 1 / (k + rank + 1)
        
    for rank, doc in enumerate(sparse_results):
        rrf_scores[doc.id] = rrf_scores.get(doc.id, 0) + 1 / (k + rank + 1)
        
    sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_docs[:20]  # Top 20 passed to Cross-Encoder`
    },
    futureImprovements: [
      "Add speculative decoding for synthesis latency reduction below 50ms.",
      "Implement automatic document graph construction using Neo4j for multi-entity relationship reasoning."
    ]
  },
  {
    id: "agentic-swarm-mcp",
    title: "AgenticSwarm MCP Orchestrator",
    slug: "agentic-swarm-mcp",
    subtitle: "Stateful Multi-Agent Workflow Engine with Model Context Protocol",
    category: "Multi-Agent",
    description: "Autonomous multi-agent orchestration framework powered by LangGraph and MCP protocol. Agents dynamically coordinate code execution, Web research, SQL querying, and security compliance.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["LangGraph", "Python", "MCP Protocol", "TypeScript", "FastAPI", "PostgreSQL", "Docker", "Temporal.io"],
    featured: true,
    githubUrl: "https://github.com/Nestcy/agentic-swarm-mcp",
    liveDemoUrl: "https://agentic-swarm.demo.ai-arch.dev",
    videoDemoUrl: "https://youtube.com/watch?v=demo_agentic_swarm",
    metrics: [
      { label: "Agent Task Accuracy", value: "98.2%" },
      { label: "Parallel Tool Calls", value: "12 / sec" },
      { label: "Self-Healing Rate", value: "91.4%" },
      { label: "MCP Tools Integrated", value: "28" }
    ],
    problem: "Single-prompt agent pipelines get stuck in loop locks when encountering unexpected API schema errors or code syntax bugs during autonomous task execution.",
    solution: "Engineered a stateful cyclic graph architecture with LangGraph and MCP (Model Context Protocol). Included supervisor evaluation nodes, human-in-the-loop checkpoints, and dynamic plan re-routing upon error catching.",
    architectureDescription: "User Prompt -> Supervisor Agent -> Task Decomposition Graph -> Parallel Tool Execution Nodes (Code Sandbox, SQL, Web Search, Github API) -> Critique & Verification Node -> Final Artifact Generator.",
    architectureNodes: [
      { id: "1", label: "User Task Request", type: "client", status: "Active" },
      { id: "2", label: "Supervisor Agent Node", type: "model", status: "Active" },
      { id: "3", label: "MCP Tool Executor Swarm", type: "gateway", status: "Active" },
      { id: "4", label: "Isolated Code Sandbox", type: "db", status: "Active" },
      { id: "5", label: "Critique & Human Approval Gate", type: "cache", status: "Active" }
    ],
    technicalChallenges: [
      {
        title: "Preventing Infinite Recursion Loops in Autonomous Agent Swarms",
        detail: "Implemented deterministic state graph constraints with exponential backoff and LLM self-reflection state inspection.",
        metricImpact: "Zero infinite loops across 100,000 automated workflow runs."
      }
    ],
    lessonsLearned: [
      "Agents need strict, typed output schematics (Pydantic v2) at every node transition to prevent state drift.",
      "The Model Context Protocol (MCP) drastically simplifies tool sharing across multiple LLM providers."
    ],
    codeSnippet: {
      language: "typescript",
      filename: "supervisor_agent.ts",
      code: `import { StateGraph, END } from "@langchain/langgraph";

export function createSwarmWorkflow() {
  const workflow = new StateGraph({ channels: stateChannels });
  
  workflow.addNode("planner", plannerAgent);
  workflow.addNode("coder", codeGeneratorAgent);
  workflow.addNode("verifier", codeVerifierAgent);
  workflow.addNode("mcp_executor", mcpToolExecutor);

  workflow.addEdge("planner", "coder");
  workflow.addConditionalEdges("coder", (state) => {
    return state.hasErrors ? "verifier" : "mcp_executor";
  });
  
  return workflow.compile();
}`
    },
    futureImprovements: [
      "Integrate persistent memory vector layers using Zep for multi-session agent context retention."
    ]
  },
  {
    id: "vision-defect-guard",
    title: "VisionGuard Industrial Inspection AI",
    slug: "vision-defect-guard",
    subtitle: "Real-Time 120 FPS Computer Vision Defect Detection System",
    category: "Computer Vision",
    description: "Edge AI visual defect detection system for high-speed manufacturing assembly lines. Combines YOLOv8 TensorRT optimized inference with SAM (Segment Anything) zero-shot anomaly detection.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["TensorRT", "YOLOv8", "OpenCV", "PyTorch", "NVIDIA Jetson", "C++", "CUDA", "gRPC"],
    featured: true,
    githubUrl: "https://github.com/Nestcy/vision-defect-guard",
    liveDemoUrl: "https://visionguard.demo.ai-arch.dev",
    videoDemoUrl: "https://youtube.com/watch?v=demo_visionguard",
    metrics: [
      { label: "FPS Processing", value: "128 FPS" },
      { label: "Defect Recall Rate", value: "99.8%" },
      { label: "End-to-End Latency", value: "7.8ms" },
      { label: "FP Rate", value: "< 0.02%" }
    ],
    problem: "Manual industrial surface quality check suffered from high false negatives and missed subtle micro-cracks on silicon wafers moving at 2.5 meters/second.",
    solution: "Engineered a hybrid vision model using TensorRT INT8 quantized YOLOv8 for sub-10ms bounding box detection, coupled with OpenCV CUDA hardware acceleration and zero-shot Segment Anything fallback.",
    architectureDescription: "Industrial GigE Camera -> NVIDIA DeepStream SDK -> CUDA Memory Ring Buffer -> TensorRT INT8 YOLOv8 Model -> Real-time PLC Hardware Trigger.",
    architectureNodes: [
      { id: "1", label: "GigE Industrial Camera Stream", type: "client", status: "Active" },
      { id: "2", label: "NVIDIA DeepStream Pipeline", type: "gateway", status: "Active" },
      { id: "3", label: "TensorRT INT8 Model CUDA Kernel", type: "model", status: "Active" },
      { id: "4", label: "Anomaly Telemetry DB", type: "db", status: "Active" }
    ],
    technicalChallenges: [
      {
        title: "Jitter and Dropped Frames under High Industrial Lighting Fluctuations",
        detail: "Implemented custom adaptive brightness normalization in CUDA C++ before feeding tensor buffers into neural inference.",
        metricImpact: "Maintained 0 frame drops over 72 hours of uninterrupted stress testing."
      }
    ],
    lessonsLearned: [
      "Converting PyTorch models to TensorRT INT8 requires careful calibration dataset selection to avoid precision collapse on fine visual details."
    ],
    codeSnippet: {
      language: "cpp",
      filename: "cuda_inference_pipeline.cu",
      code: `__global__ void preprocess_kernel(const uint8_t* src, float* dst, int width, int height) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    if (x < width && y < height) {
        int idx = (y * width + x) * 3;
        dst[0 * width * height + y * width + x] = (src[idx + 0] / 255.0f - 0.485f) / 0.229f;
        dst[1 * width * height + y * width + x] = (src[idx + 1] / 255.0f - 0.456f) / 0.224f;
        dst[2 * width * height + y * width + x] = (src[idx + 2] / 255.0f - 0.406f) / 0.225f;
    }
}`
    },
    futureImprovements: [
      "Deploy model quantization directly to edge microcontrollers using TensorRT-Micro."
    ]
  },
  {
    id: "vllm-speculative-gateway",
    title: "SpeculativeLLM Inference Gateway",
    slug: "vllm-speculative-gateway",
    subtitle: "High-Throughput Distributed LLM Serving with Draft Models",
    category: "LLM Platform",
    description: "Production LLM router featuring Speculative Decoding, PagedAttention via vLLM, and dynamic load balancing across GPU clusters to slash token costs by 45%.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["vLLM", "Python", "Rust", "Ray", "Triton Inference Server", "Kubernetes", "Prometheus"],
    featured: false,
    githubUrl: "https://github.com/Nestcy/vllm-speculative-gateway",
    liveDemoUrl: "https://llm-gateway.demo.ai-arch.dev",
    metrics: [
      { label: "Token Acceleration", value: "2.4x Speedup" },
      { label: "GPU VRAM Efficiency", value: "+310%" },
      { label: "P99 Latency Reduction", value: "52%" },
      { label: "Cost Savings", value: "45%" }
    ],
    problem: "Autoregressive generation on 70B parameter LLMs was cost-prohibitive and bottlenecked by GPU memory bandwidth for low-latency user chat interactions.",
    solution: "Deployed a speculative decoding architecture utilizing a small 1B draft model (Qwen-1.5B) to draft token candidates, verified in parallel by Llama-3-70B using custom PagedAttention memory pools.",
    architectureDescription: "Incoming WebSocket -> Rust Load Balancer -> Ray Cluster Node -> Draft Model Fast Generation -> Target Model Parallel Acceptance Matrix -> Stream Output.",
    architectureNodes: [
      { id: "1", label: "Rust API Router", type: "gateway", status: "Active" },
      { id: "2", label: "Ray Distributed Cluster", type: "client", status: "Active" },
      { id: "3", label: "Draft Model (Qwen-1.5B)", type: "model", status: "Active" },
      { id: "4", label: "Target Model (Llama3-70B)", type: "model", status: "Active" }
    ],
    technicalChallenges: [
      {
        title: "Draft Acceptance Rate Degradation on Complex Code Contexts",
        detail: "Fine-tuned the draft model specifically on acceptance candidate distributions generated by the target model.",
        metricImpact: "Increased token acceptance rate from 62% to 84%."
      }
    ],
    lessonsLearned: [
      "Speculative decoding delivers massive throughput improvements when draft and target models share tokenizers and alignment distributions."
    ],
    codeSnippet: {
      language: "python",
      filename: "speculative_engine.py",
      code: `async function generate_speculative_tokens(draft_model, target_model, prompt, k=5):
    draft_tokens = await draft_model.generate_draft_candidates(prompt, steps=k)
    accepted_mask = await target_model.verify_batch(prompt, draft_tokens)
    return [token for token, is_valid in zip(draft_tokens, accepted_mask) if is_valid]`
    },
    futureImprovements: [
      "Implement medusa-style multi-head decoding to eliminate the separate draft model overhead."
    ]
  }
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: "rag-architecture-deep-dive",
    title: "Building Production RAG: Hybrid Search, RRF, and Context Pruning",
    slug: "rag-architecture-deep-dive",
    excerpt: "Why naive vector search breaks in production enterprise applications and how to build a resilient, high-precision retrieval pipeline with Reciprocal Rank Fusion.",
    category: "RAG Architecture",
    publishedDate: "2026-06-18",
    readTime: "9 min read",
    author: {
      name: "Nestcy",
      role: "Lead AI Systems Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["RAG", "Vector Search", "Qdrant", "BM25", "FlashRank", "Python"],
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    codeSnippets: [
      {
        title: "Reciprocal Rank Fusion Implementation",
        language: "python",
        code: `def reciprocal_rank_fusion(dense_rankings: list, sparse_rankings: list, k: int = 60):
    """
    RRF combines scores from distinct retrieval systems without requiring score normalization.
    """
    rrf_map = {}
    for rank, item in enumerate(dense_rankings):
        rrf_map[item.id] = rrf_map.get(item.id, 0.0) + (1.0 / (k + rank + 1))
        
    for rank, item in enumerate(sparse_rankings):
        rrf_map[item.id] = rrf_map.get(item.id, 0.0) + (1.0 / (k + rank + 1))
        
    return sorted(rrf_map.items(), key=lambda x: x[1], reverse=True)`
      }
    ],
    mathFormulas: [
      {
        label: "Reciprocal Rank Fusion Score Formula",
        latex: "RRF\\,Score(d \\in D) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}",
        explanation: "Where M is the set of retrieval systems (dense and sparse), k is a smoothing constant (typically 60), and r_m(d) is the rank position of document d in system m."
      },
      {
        label: "Cosine Similarity Formula",
        latex: "\\text{Sim}(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|} = \\frac{\\sum_{i=1}^{n} A_i B_i}{\\sqrt{\\sum_{i=1}^{n} A_i^2} \\sqrt{\\sum_{i=1}^{n} B_i^2}}",
        explanation: "Measures the inner product cosine angle between two normalized dense embedding vectors in hyperdimensional space."
      }
    ],
    content: `
### The Problem with Naive Vector Search
Most standard RAG tutorials recommend chunking a document into 500-token blocks, passing them through an embedding model, storing them in a vector database, and pulling top-k cosine similarity matches.

When deployed to enterprise users, this naive approach quickly fails due to:
1. **Loss of Keyword Precision**: Searching for exact serial numbers, error codes (e.g. \`ERR_409_CONFLICT\`), or specialized jargon yields poor dense vector alignment.
2. **Context Dilution**: Sending 10 raw 500-token chunks consumes 5,000 tokens of context window, filling the prompt with noisy irrelevant text.
3. **Multi-Hop Blind Spots**: Documents requiring multi-document synthesis are missed when top-k chunks belong to unrelated sections.

### The Solution: Hybrid Dense-Sparse Retrieval
To solve keyword precision while preserving semantic search, we combine **Dense Embeddings (BGE-M3)** with **Sparse Lexical Search (BM25)**.

By scoring candidates using Reciprocal Rank Fusion (RRF), we get the best of both worlds: lexical precision for exact tokens and semantic coverage for intent matching.
`
  },
  {
    id: "how-ai-agents-work",
    title: "How Autonomous AI Agents Work: LangGraph & Model Context Protocol",
    slug: "how-ai-agents-work",
    excerpt: "Deconstructing cyclic state graphs, supervisor agents, tool execution sandboxes, and the revolutionary Model Context Protocol (MCP) for tool sharing.",
    category: "Multi-Agent Systems",
    publishedDate: "2026-05-22",
    readTime: "11 min read",
    author: {
      name: "Nestcy",
      role: "Lead AI Systems Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["Agents", "LangGraph", "MCP Protocol", "Architecture", "Python"],
    featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    codeSnippets: [
      {
        title: "MCP Client Tool Invocation",
        language: "typescript",
        code: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";

const client = new Client({ name: "agent-runner", version: "1.0.0" });
await client.connect(transport);

const tools = await client.listTools();
const result = await client.callTool({
  name: "execute_sql_query",
  arguments: { query: "SELECT count(*) FROM production_users;" }
});`
      }
    ],
    mathFormulas: [
      {
        label: "Markov Decision State Transition for Agents",
        latex: "P(S_{t+1} = s' \\mid S_t = s, A_t = a) = T(s, a, s')",
        explanation: "In an agentic state graph, the probability of transitioning to state s' depends on the current environment state s and the chosen tool action a."
      }
    ],
    content: `
### What makes an AI Agent truly "Autonomous"?
Single-shot prompt completion is deterministic. An **Agent**, by contrast, possesses a loop: it observes the current state, selects a tool action, evaluates the execution feedback, and iteratively updates its internal trajectory until the goal state is satisfied.

### The Shift from DAGs to Cyclic State Graphs
Early framework attempts forced agent steps into Directed Acyclic Graphs (DAGs). However, real-world task resolution requires loops — retrying failed code compilation, requesting human input, or breaking down complex queries dynamically.
`
  },
  {
    id: "attention-mechanism-transformers",
    title: "Understanding Attention: Scaled Dot-Product to FlashAttention-3",
    slug: "attention-mechanism-transformers",
    excerpt: "Mathematical derivation of Transformer attention mechanisms, KV-caching memory dynamics, and how GPU SRAM kernel fusion unlocks 100k+ context windows.",
    category: "Transformer Math",
    publishedDate: "2026-04-10",
    readTime: "14 min read",
    author: {
      name: "Nestcy",
      role: "Lead AI Systems Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    tags: ["Transformers", "PyTorch", "CUDA", "Attention Math", "Deep Learning"],
    featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    mathFormulas: [
      {
        label: "Scaled Dot-Product Attention Formula",
        latex: "\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V",
        explanation: "Where Q represents Queries, K represents Keys, V represents Values, and d_k is the dimension of key vectors acting as scaling factor."
      },
      {
        label: "Multi-Head Attention Equation",
        latex: "\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O",
        explanation: "Projects Q, K, and V into h distinct subspace representations in parallel."
      }
    ],
    content: `
### Deriving Scaled Dot-Product Attention
At the core of modern generative AI lies the attention calculation. Given input matrices Q (Queries), K (Keys), and V (Values) in dimension d_k:

1. Multiply Query matrix Q by transposed Key matrix K^T to compute affinity scores.
2. Scale by 1 / sqrt(d_k) to prevent dot products from growing excessively large in high dimensions (which drives Softmax gradients to zero).
3. Apply Softmax row-wise to convert scores into normalized probability weights.
4. Multiply by Value matrix V to produce context vectors.
`
  }
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: "cert-nvidia-llm",
    title: "NVIDIA Certified Specialist - Building Transformer & LLM Applications",
    institution: "NVIDIA Deep Learning Institute",
    issueDate: "2026-01",
    credentialId: "NV-LLM-892104",
    credentialUrl: "https://nvidia.com/verify/NV-LLM-892104",
    badgeImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    skillsVerified: ["TensorRT-LLM", "CUDA Kernels", "Transformer Optimization", "Multi-GPU Distributed Training"]
  },
  {
    id: "cert-aws-ml",
    title: "AWS Certified Machine Learning - Specialty",
    institution: "Amazon Web Services",
    issueDate: "2025-11",
    credentialId: "AWS-MLS-49120",
    credentialUrl: "https://aws.amazon.com/verification",
    badgeImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=200&q=80",
    skillsVerified: ["SageMaker", "Feature Store", "Distributed Training", "MLOps Pipelines"]
  },
  {
    id: "cert-deeplearning-agents",
    title: "AI Agent System Architect Certification",
    institution: "DeepLearning.AI",
    issueDate: "2025-08",
    credentialId: "DLAI-AGENT-77291",
    credentialUrl: "https://coursera.org/verify/DLAI-AGENT-77291",
    badgeImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=200&q=80",
    skillsVerified: ["LangGraph", "Autonomous Swarms", "Tool Calling Safety", "MCP Servers"]
  },
  {
    id: "cert-gcp-ml",
    title: "Google Cloud Professional Machine Learning Engineer",
    institution: "Google Cloud",
    issueDate: "2025-04",
    credentialId: "GCP-MLE-33910",
    credentialUrl: "https://google.com/credentials",
    badgeImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80",
    skillsVerified: ["Vertex AI", "BigQuery ML", "Kubeflow", "Model Monitoring"]
  }
];

export const SKILLS_DATA: SkillItem[] = [
  // LLMs & AI Agents
  { name: "LLM Fine-Tuning (LoRA / QLoRA)", category: "LLMs", proficiency: 96, level: "Expert", iconName: "Cpu", yearsExperience: "4 yrs", description: "PEFT, Unsloth, Axolotl, DeepSpeed ZeRO-3 fine-tuning on domain datasets." },
  { name: "LangGraph & Multi-Agent Swarms", category: "AI Agents", proficiency: 98, level: "Expert", iconName: "Bot", yearsExperience: "3 yrs", description: "Cyclic state graphs, supervisor agents, human-in-the-loop approval workflows." },
  { name: "RAG & Vector Search Engines", category: "LLMs", proficiency: 98, level: "Expert", iconName: "Database", yearsExperience: "4 yrs", description: "Qdrant, Milvus, Pinecone, BM25 hybrid fusion, cross-encoder reranking." },
  { name: "Model Context Protocol (MCP)", category: "AI Agents", proficiency: 95, level: "Expert", iconName: "Workflow", yearsExperience: "2 yrs", description: "Building custom MCP servers, secure tool execution, JSON-RPC transports." },
  
  // Machine Learning & Deep Learning
  { name: "PyTorch & CUDA Acceleration", category: "Deep Learning", proficiency: 94, level: "Expert", iconName: "Zap", yearsExperience: "5 yrs", description: "Custom CUDA C++ kernels, PyTorch 2.0 compile, FlashAttention-3 integration." },
  { name: "Transformer Math & Architectures", category: "Machine Learning", proficiency: 96, level: "Expert", iconName: "Binary", yearsExperience: "5 yrs", description: "KV-cache management, speculative decoding, RoPE embeddings, GQA attention." },
  
  // Computer Vision
  { name: "YOLOv8 & TensorRT Edge Vision", category: "Computer Vision", proficiency: 92, level: "Expert", iconName: "Eye", yearsExperience: "4 yrs", description: "Sub-10ms real-time object detection, NVIDIA DeepStream, INT8 quantization." },
  { name: "Segment Anything (SAM) & OpenCV", category: "Computer Vision", proficiency: 90, level: "Advanced", iconName: "Camera", yearsExperience: "3 yrs", description: "Zero-shot visual segmentation, CUDA video streaming ring buffers." },

  // Backend & Cloud & MLOps
  { name: "FastAPI & High-Throughput Async", category: "Backend", proficiency: 95, level: "Expert", iconName: "Server", yearsExperience: "5 yrs", description: "Async HTTP/WebSockets, streaming response generation, gRPC microservices." },
  { name: "vLLM & Ray Distributed Inference", category: "DevOps", proficiency: 92, level: "Expert", iconName: "Cloud", yearsExperience: "3 yrs", description: "PagedAttention memory pools, continuous batching, multi-GPU server clusters." },
  { name: "Docker, Kubernetes & Helm", category: "Cloud", proficiency: 88, level: "Advanced", iconName: "Layers", yearsExperience: "4 yrs", description: "Containerizing GPU workloads, K8s autoscaling based on queue depth metrics." },
  { name: "PostgreSQL, Redis & Qdrant", category: "Databases", proficiency: 94, level: "Expert", iconName: "HardDrive", yearsExperience: "5 yrs", description: "pgvector index tuning, Redis caching layers, Qdrant HNSW payload search." },
  { name: "React, TypeScript & Tailwind CSS", category: "Frontend", proficiency: 92, level: "Expert", iconName: "Code2", yearsExperience: "5 yrs", description: "Building high-performance AI web dashboards, live streaming UI components." }
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "t1",
    year: "2025 - Present",
    title: "Lead AI Systems Architect",
    organization: "Cognitive Scale AI (San Francisco, CA)",
    type: "Career",
    description: "Heading the Core AI Infrastructure team. Built enterprise multi-agent RAG engines serving 18M+ daily LLM tokens with 99.9% uptime SLA.",
    impact: "Reduced infrastructure inference costs by 45% while boosting search hit-rate to 95.6%.",
    skillsUsed: ["LangGraph", "vLLM", "Qdrant", "PyTorch", "FastAPI", "Kubernetes"]
  },
  {
    id: "t2",
    year: "2024",
    title: "Winner - Global AI Agents Hackathon",
    organization: "NVIDIA & Anthropic Hackathon",
    type: "Hackathon",
    description: "Designed 'AgenticSwarm', an autonomous software debugging agent using MCP protocol and sandboxed runtime execution.",
    impact: "Awarded 1st Place out of 1,200+ global teams and $50k GPU computing credits.",
    skillsUsed: ["MCP Protocol", "LangGraph", "Docker Sandbox", "Llama-3"]
  },
  {
    id: "t3",
    year: "2023 - 2024",
    title: "Senior Machine Learning Engineer",
    organization: "Aether Vision Labs",
    type: "Career",
    description: "Designed sub-10ms industrial defect detection pipelines using YOLOv8, C++ CUDA, and NVIDIA Jetson edge devices.",
    impact: "Deployed to 14 semiconductor assembly lines, preventing $2.4M in manufacturing scrap.",
    skillsUsed: ["YOLOv8", "TensorRT", "CUDA C++", "OpenCV", "DeepStream"]
  },
  {
    id: "t4",
    year: "2022 - 2023",
    title: "AI Research Fellow",
    organization: "Stanford AI Lab / Independent Research",
    type: "Research",
    description: "Published research on context compression techniques for retrieval-augmented generative systems.",
    impact: "Published paper cited in 80+ AI engineering repositories.",
    skillsUsed: ["PyTorch", "Transformers", "Information Retrieval", "BGE Embeddings"]
  }
];

export const VIDEO_SHOWCASE_DATA: VideoShowcaseItem[] = [
  {
    id: "v1",
    title: "RAG-Nexus: Real-Time Hybrid Vector Retrieval in Action",
    description: "Watch how Reciprocal Rank Fusion and Cross-Encoder Reranking retrieve exact policy snippets from a 50,000 document PDF corpus in under 75ms.",
    duration: "3:45",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // HTML5 sample video for rich live playback
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    technologies: ["FastAPI", "Qdrant", "FlashRank", "Python"],
    views: "14.2K views",
    highlights: ["0:15 - BM25 vs Dense Search breakdown", "1:20 - Reciprocal Rank Fusion execution", "2:40 - Context compression demo"]
  },
  {
    id: "v2",
    title: "Building Autonomous Agents with LangGraph & Model Context Protocol",
    description: "Step-by-step demonstration of a multi-agent swarm debugging a broken React codebase autonomously inside a secure Docker sandbox.",
    duration: "5:12",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    technologies: ["LangGraph", "MCP Protocol", "TypeScript", "Docker"],
    views: "22.8K views",
    highlights: ["0:45 - Supervisor agent routing", "2:10 - MCP tool invocation over JSON-RPC", "4:00 - Human-in-the-loop approval"]
  },
  {
    id: "v3",
    title: "128 FPS Computer Vision Defect Inspection with TensorRT INT8",
    description: "Live camera stream feed showing real-time wafer defect bounding box segmentation with sub-8ms processing latency.",
    duration: "2:30",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    technologies: ["CUDA", "TensorRT", "YOLOv8", "NVIDIA Jetson"],
    views: "9.5K views",
    highlights: ["0:30 - Camera hardware sync", "1:15 - INT8 TensorRT inference timing", "2:00 - False positive filter"]
  }
];

export const GITHUB_REPOS_DATA: GitHubRepo[] = [
  {
    name: "marketing_agent",
    description: "Agentic content calendar platform with LangGraph, Groq Llama 3, and two human-approval gates.",
    stars: 840,
    forks: 95,
    language: "Python",
    languageColor: "#3572A5",
    url: "https://github.com/Nestcy/marketing_agent",
    isPinned: true
  },
  {
    name: "rag-nexus-enterprise",
    description: "Production hybrid dense-sparse RAG retrieval engine with FlashRank reranking and Qdrant vector clustering.",
    stars: 1420,
    forks: 210,
    language: "Python",
    languageColor: "#3572A5",
    url: "https://github.com/Nestcy/rag-nexus-enterprise",
    isPinned: true
  },
  {
    name: "agentic-swarm-mcp",
    description: "LangGraph-powered stateful multi-agent framework utilizing Model Context Protocol (MCP) for tool sharing.",
    stars: 2180,
    forks: 340,
    language: "TypeScript",
    languageColor: "#3178C6",
    url: "https://github.com/Nestcy/agentic-swarm-mcp",
    isPinned: true
  },
  {
    name: "vllm-speculative-gateway",
    description: "Speculative decoding router for vLLM & Ray clusters achieving 2.4x speedup on Llama-3 70B models.",
    stars: 980,
    forks: 115,
    language: "Rust",
    languageColor: "#dea584",
    url: "https://github.com/Nestcy/vllm-speculative-gateway",
    isPinned: true
  }
];
