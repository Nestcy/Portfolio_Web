import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      timestamp: new Date().toISOString(),
      service: "AI Engineer System Portfolio API",
      geminiConnected: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Assistant Chatbot / Recruiter Q&A Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, systemPrompt } = req.body;
      const ai = getAI();

      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt || "You are an AI Architecture Assistant representing Alex Rivera, Principal AI Engineer specializing in LLM Infrastructure, Multi-Agent Swarms, RAG, and Computer Vision. Respond concisely, technically, and authoritatively to hiring managers and founders."}\n\nUser Question: ${message}`,
                },
              ],
            },
          ],
        });

        res.json({
          reply: response.text || "AI Agent generated output successfully.",
          source: "gemini-2.5-flash",
        });
      } else {
        // High quality fallback responses for showcase
        const queryLower = (message || "").toLowerCase();
        let fallback = "As Alex's AI System Representative, I can confirm Alex specializes in production RAG pipelines with Qdrant/Milvus, LangGraph multi-agent orchestration, and vLLM optimization with 99.9% uptime SLAs.";

        if (queryLower.includes("rag") || queryLower.includes("vector")) {
          fallback = "Alex's custom RAG pipeline uses hybrid dense-sparse retrieval (BGE-M3 + BM25), reciprocal rank fusion (RRF), and FlashRank re-ranking to achieve 94.2% hit-rate @ K=5 with latency < 140ms.";
        } else if (queryLower.includes("agent") || queryLower.includes("langgraph") || queryLower.includes("mcp")) {
          fallback = "Alex builds stateful, autonomous multi-agent systems using LangGraph & Model Context Protocol (MCP) with Human-in-the-loop checkpoints, tool safety guards, and fallback routing.";
        } else if (queryLower.includes("hire") || queryLower.includes("contact") || queryLower.includes("available")) {
          fallback = "Alex is currently open to Staff / Lead AI Engineer roles, AI startup advisory, and high-impact LLM system consulting. Reach out directly via the contact form or email alex.rivera@ai-arch.dev!";
        }

        res.json({
          reply: fallback,
          source: "simulated-agent-engine",
        });
      }
    } catch (err: any) {
      console.error("Chat API Error:", err);
      res.status(500).json({ error: "Failed to process query with AI model", details: err.message });
    }
  });

  // RAG Simulator API endpoint
  app.post("/api/rag-simulate", (req, res) => {
    const { query } = req.body;
    const tokens = (query || "Vector Retrieval").split(" ");

    res.json({
      query: query || "Building high-throughput multi-agent RAG system",
      embedding: Array.from({ length: 8 }, () => Number((Math.random() * 2 - 1).toFixed(4))),
      retrievedChunks: [
        {
          id: "chunk-0941",
          source: "docs/architecture/rag_v3_spec.md",
          similarity: 0.942,
          denseScore: 0.92,
          sparseScore: 0.96,
          content: "Hybrid search combines dense vector embeddings (text-embedding-3-large) with sparse lexical indexes (BM25) via Reciprocal Rank Fusion.",
        },
        {
          id: "chunk-0882",
          source: "benchmarks/latency_qdrant.json",
          similarity: 0.887,
          denseScore: 0.89,
          sparseScore: 0.87,
          content: "Qdrant HNSW index with scalar quantization reduced RAM usage by 4x while keeping recall@10 above 98.1%.",
        },
        {
          id: "chunk-0815",
          source: "services/reranker/flashrank.py",
          similarity: 0.824,
          denseScore: 0.81,
          sparseScore: 0.84,
          content: "Cross-encoder re-ranking step prunes top-50 candidates down to top-5 most relevant context snippets for context compression.",
        },
      ],
      metrics: {
        embeddingTimeMs: 18,
        vectorSearchTimeMs: 14,
        rerankTimeMs: 42,
        totalLatencyMs: 74,
        tokensProcessed: tokens.length * 12,
      },
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI-ENGINEER-PORTFOLIO] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
