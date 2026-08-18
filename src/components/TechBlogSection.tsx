import React, { useState } from 'react';
import { BLOG_POSTS_DATA } from '../data/portfolioData';
import { BlogPost } from '../types';
import { BookOpen, Clock, Calendar, Tag, ArrowRight, X, Copy, Check, Sparkles, Code, Calculator } from 'lucide-react';

export const TechBlogSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const categories = ['All', 'RAG Architecture', 'Multi-Agent Systems', 'Transformer Math'];

  const filteredPosts = BLOG_POSTS_DATA.filter(post => 
    selectedCategory === 'All' || post.category === selectedCategory
  );

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="blog" className="py-20 bg-black relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
              TECHNICAL PUBLICATIONS
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              AI Engineering Papers & Insights
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
              In-depth technical explainers, mathematical derivations, and architecture blueprints on LLMs, RAG, and agentic infrastructure.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5 shrink-0 font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-xs transition-all uppercase tracking-wider ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="group rounded-xl bg-[#030303] border border-zinc-800 hover:border-zinc-600 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden bg-zinc-950">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-black/90 text-zinc-300 border border-zinc-800">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-violet-400" />
                      <span>{post.publishedDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-violet-400" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center space-x-2">
                    <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full" />
                    <span className="text-zinc-300">{post.author.name}</span>
                  </div>

                  <span className="text-zinc-400 flex items-center space-x-1 group-hover:text-white transition-colors">
                    <span>READ</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div 
            className="relative w-full max-w-4xl my-6 bg-black border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Close Button */}
            <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0 font-mono">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[9px] uppercase bg-zinc-900 text-zinc-400 border border-zinc-800">
                  {activeArticle.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">{activeArticle.title}</h2>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Content (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 grow">
              
              {/* Header Info */}
              <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500 pb-3 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-6 h-6 rounded-full" />
                  <span className="text-zinc-300 font-bold">{activeArticle.author.name}</span>
                </div>
                <span>•</span>
                <span>{activeArticle.publishedDate}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>

              {/* Main Text Content */}
              <div className="prose prose-invert max-w-none text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                {activeArticle.content}
              </div>

              {/* Mathematical Formulas */}
              {activeArticle.mathFormulas && activeArticle.mathFormulas.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-zinc-800 font-mono">
                  <h4 className="text-[10px] uppercase text-violet-400 tracking-wider flex items-center space-x-2">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Mathematical Derivations</span>
                  </h4>
                  {activeArticle.mathFormulas.map((math, idx) => (
                    <div key={idx} className="p-4 rounded bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="text-xs font-bold text-zinc-300">{math.label}</div>
                      <div className="p-2.5 rounded bg-black border border-zinc-800 text-center text-emerald-400 text-xs overflow-x-auto">
                        {math.latex}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{math.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Code Snippets */}
              {activeArticle.codeSnippets && activeArticle.codeSnippets.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-zinc-800 font-mono">
                  <h4 className="text-[10px] uppercase text-violet-400 tracking-wider flex items-center space-x-2">
                    <Code className="w-3.5 h-3.5" />
                    <span>Reference Implementation</span>
                  </h4>
                  {activeArticle.codeSnippets.map((snippet, idx) => (
                    <div key={idx} className="rounded bg-zinc-950 border border-zinc-800 overflow-hidden text-xs">
                      <div className="px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-300 font-bold">{snippet.title}</span>
                        <button
                          onClick={() => handleCopyCode(snippet.code, idx)}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] flex items-center space-x-1 uppercase"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3.5 text-zinc-300 overflow-x-auto text-xs">{snippet.code}</pre>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
              <span>PUBLICATION // VERIFIED</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
