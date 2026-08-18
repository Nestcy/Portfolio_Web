import React, { useState } from 'react';
import { Terminal, Database, Send, Cpu, Zap, RefreshCw, CheckCircle2, Sparkles, AlertCircle, Play } from 'lucide-react';

export const AiPlaygroundSection: React.FC = () => {
  // RAG Simulator State
  const [ragQuery, setRagQuery] = useState('How does Reciprocal Rank Fusion improve enterprise vector search accuracy?');
  const [ragLoading, setRagLoading] = useState(false);
  const [ragResult, setRagResult] = useState<any>(null);

  // AI Chat Assistant State
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string; source?: string }>>([
    {
      sender: 'assistant',
      text: "Hello! I am Alex's AI Architecture Assistant. Ask me anything about Alex's production RAG systems, multi-agent LangGraph pipelines, or model evaluation benchmarks.",
      source: "gemini-2.5-flash"
    }
  ]);

  const executeRagSimulation = async () => {
    if (!ragQuery.trim()) return;
    setRagLoading(true);
    try {
      const res = await fetch('/api/rag-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ragQuery })
      });
      const data = await res.json();
      setRagResult(data);
    } catch (err) {
      console.error('RAG Simulate error:', err);
    } finally {
      setRagLoading(false);
    }
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userText = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setChatHistory(prev => [
        ...prev,
        { sender: 'assistant', text: data.reply || 'No response generated.', source: data.source }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { sender: 'assistant', text: "Error connecting to AI endpoint. Operating in fallback mode." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <section id="playground" className="py-20 bg-black relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="space-y-2 border-b border-zinc-800 pb-6">
          <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
            INTERACTIVE AI ENDPOINTS
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Live AI System Console
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
            Test real-time vector retrieval algorithms and interact directly with Alex's AI Representative powered by Gemini.
          </p>
        </div>

        {/* Dual Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sandbox 1: Live RAG Vector Search Simulator */}
          <div className="rounded-xl bg-[#030303] border border-zinc-800 p-5 shadow-2xl flex flex-col justify-between space-y-5 font-mono">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
                <div className="flex items-center space-x-2 text-white font-bold">
                  <Database className="w-4 h-4 text-violet-400" />
                  <span>RAG Vector Search Simulator</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] uppercase">
                  Qdrant + BM25
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-zinc-500 tracking-wider">Document Query Input:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    placeholder="Search query..."
                    className="flex-1 px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-600"
                  />
                  <button
                    onClick={executeRagSimulation}
                    disabled={ragLoading}
                    className="px-4 py-2 bg-white text-black font-bold uppercase text-[10px] tracking-wider rounded hover:bg-zinc-200 transition-colors flex items-center space-x-1"
                  >
                    {ragLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{ragLoading ? 'Search...' : 'Execute'}</span>
                  </button>
                </div>
              </div>

              {/* RAG Search Results & Latency Metrics */}
              {ragResult ? (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-3 gap-px bg-zinc-800/60 p-px rounded overflow-hidden text-center text-[10px]">
                    <div className="p-2 bg-black">
                      <div className="text-zinc-500 uppercase">Embedding</div>
                      <div className="text-violet-400 font-bold">{ragResult.metrics.embeddingTimeMs}ms</div>
                    </div>
                    <div className="p-2 bg-black">
                      <div className="text-zinc-500 uppercase">Vector HNSW</div>
                      <div className="text-emerald-400 font-bold">{ragResult.metrics.vectorSearchTimeMs}ms</div>
                    </div>
                    <div className="p-2 bg-black">
                      <div className="text-zinc-500 uppercase">Cross-Rerank</div>
                      <div className="text-cyan-400 font-bold">{ragResult.metrics.rerankTimeMs}ms</div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {ragResult.retrievedChunks.map((chunk: any) => (
                      <div key={chunk.id} className="p-3 rounded bg-black border border-zinc-800/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500">{chunk.source}</span>
                          <span className="text-emerald-400 font-bold">RRF: {chunk.similarity}</span>
                        </div>
                        <p className="text-zinc-300 font-sans text-xs leading-relaxed">{chunk.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded bg-black border border-zinc-800/80 text-center text-zinc-500 text-[11px] font-mono">
                  Press 'Execute' to run live dense/sparse vector retrieval & reranking.
                </div>
              )}
            </div>
          </div>

          {/* Sandbox 2: Ask Alex's AI Representative */}
          <div className="rounded-xl bg-[#030303] border border-zinc-800 p-5 shadow-2xl flex flex-col justify-between space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
              <div className="flex items-center space-x-2 text-white font-bold">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>AI Agent Representative</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase">
                Gemini 2.5 Flash
              </span>
            </div>

            {/* Chat History Box */}
            <div className="p-3.5 rounded bg-black border border-zinc-800 h-60 overflow-y-auto space-y-2.5 font-sans text-xs">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded text-xs ${
                      msg.sender === 'user'
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-200 space-y-1'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.source && (
                      <div className="text-[9px] font-mono text-zinc-500 text-right">
                        SOURCE // {msg.source}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start font-mono text-[10px]">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 text-emerald-400 flex items-center space-x-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Processing query stream...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} className="flex items-center space-x-2 font-mono">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about RAG, Agents, experience..."
                className="flex-1 px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-600"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatMessage.trim()}
                className="p-2 rounded bg-white hover:bg-zinc-200 text-black font-bold transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
