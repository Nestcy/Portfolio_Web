import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, systemPrompt } = req.body || {};
    const ai = getAI();

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${
                  systemPrompt ||
                  'You are an AI Architecture Assistant representing Nestcy, Lead AI Systems Architect specializing in LLM Infrastructure, Multi-Agent Swarms, RAG, and Computer Vision. Respond concisely, technically, and authoritatively to hiring managers and founders.'
                }\n\nUser Question: ${message}`,
              },
            ],
          },
        ],
      });

      res.json({
        reply: response.text || 'AI Agent generated output successfully.',
        source: 'gemini-2.5-flash',
      });
      return;
    }

    // High quality fallback responses for showcase
    const queryLower = (message || '').toLowerCase();
    let fallback =
      "As Nestcy's AI System Representative, I can confirm Nestcy specializes in production RAG pipelines with Qdrant/Milvus, LangGraph multi-agent orchestration, and vLLM optimization with 99.9% uptime SLAs.";

    if (queryLower.includes('rag') || queryLower.includes('vector')) {
      fallback =
        "Nestcy's custom RAG pipeline uses hybrid dense-sparse retrieval (BGE-M3 + BM25), reciprocal rank fusion (RRF), and FlashRank re-ranking to achieve 94.2% hit-rate @ K=5 with latency < 140ms.";
    } else if (queryLower.includes('agent') || queryLower.includes('langgraph') || queryLower.includes('mcp')) {
      fallback =
        'Nestcy builds stateful, autonomous multi-agent systems using LangGraph & Model Context Protocol (MCP) with Human-in-the-loop checkpoints, tool safety guards, and fallback routing.';
    } else if (queryLower.includes('hire') || queryLower.includes('contact') || queryLower.includes('available')) {
      fallback =
        'Nestcy is currently open to Staff / Lead AI Engineer roles, AI startup advisory, and high-impact LLM system consulting. Reach out directly via the contact form or email nestcy770@gmail.com!';
    }

    res.json({
      reply: fallback,
      source: 'simulated-agent-engine',
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: 'Failed to process query with AI model', details: err.message });
  }
}
