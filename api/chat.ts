import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
                  'You are an AI Architecture Assistant representing Alex Rivera, Principal AI Engineer specializing in LLM Infrastructure, Multi-Agent Swarms, RAG, and Computer Vision. Respond concisely, technically, and authoritatively to hiring managers and founders.'
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
      "As Alex's AI System Representative, I can confirm Alex specializes in production RAG pipelines with Qdrant/Milvus, LangGraph multi-agent orchestration, and vLLM optimization with 99.9% uptime SLAs.";

    if (queryLower.includes('rag') || queryLower.includes('vector')) {
      fallback =
        "Alex's custom RAG pipeline uses hybrid dense-sparse retrieval (BGE-M3 + BM25), reciprocal rank fusion (RRF), and FlashRank re-ranking to achieve 94.2% hit-rate @ K=5 with latency < 140ms.";
    } else if (queryLower.includes('agent') || queryLower.includes('langgraph') || queryLower.includes('mcp')) {
      fallback =
        'Alex builds stateful, autonomous multi-agent systems using LangGraph & Model Context Protocol (MCP) with Human-in-the-loop checkpoints, tool safety guards, and fallback routing.';
    } else if (queryLower.includes('hire') || queryLower.includes('contact') || queryLower.includes('available')) {
      fallback =
        'Alex is currently open to Staff / Lead AI Engineer roles, AI startup advisory, and high-impact LLM system consulting. Reach out directly via the contact form or email alex.rivera@ai-arch.dev!';
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
