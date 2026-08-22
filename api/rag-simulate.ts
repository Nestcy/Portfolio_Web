import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query } = req.body || {};
  const tokens = (query || 'Vector Retrieval').split(' ');

  res.json({
    query: query || 'Building high-throughput multi-agent RAG system',
    embedding: Array.from({ length: 8 }, () => Number((Math.random() * 2 - 1).toFixed(4))),
    retrievedChunks: [
      {
        id: 'chunk-0941',
        source: 'docs/architecture/rag_v3_spec.md',
        similarity: 0.942,
        denseScore: 0.92,
        sparseScore: 0.96,
        content:
          'Hybrid search combines dense vector embeddings (text-embedding-3-large) with sparse lexical indexes (BM25) via Reciprocal Rank Fusion.',
      },
      {
        id: 'chunk-0882',
        source: 'benchmarks/latency_qdrant.json',
        similarity: 0.887,
        denseScore: 0.89,
        sparseScore: 0.87,
        content: 'Qdrant HNSW index with scalar quantization reduced RAM usage by 4x while keeping recall@10 above 98.1%.',
      },
      {
        id: 'chunk-0815',
        source: 'services/reranker/flashrank.py',
        similarity: 0.824,
        denseScore: 0.81,
        sparseScore: 0.84,
        content:
          'Cross-encoder re-ranking step prunes top-50 candidates down to top-5 most relevant context snippets for context compression.',
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
}
