import React, { useState } from 'react';
import { VIDEO_SHOWCASE_DATA } from '../data/portfolioData';
import { Play } from 'lucide-react';

export const VideoShowcase: React.FC = () => {
  const [activeVideo] = useState(VIDEO_SHOWCASE_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="videos" className="py-20 bg-[#030303] relative border-t border-zinc-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="space-y-2 border-b border-zinc-800 pb-6">
          <div className="inline-block px-2.5 py-0.5 border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] font-mono uppercase tracking-widest rounded-md">
            ARCHITECTURE DEMOS
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Video Walkthroughs & Live Artifacts
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
            Watch live screen recordings of multi-agent swarm execution, vector RAG retrieval, and CUDA vision object detection.
          </p>
        </div>

        {/* Video Player & Selection Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Large Video Player */}
          <div className="lg:col-span-12 space-y-4 max-w-5xl mx-auto w-full">
            <div className="relative rounded-xl bg-black border border-zinc-800 overflow-hidden shadow-2xl group">
              {isPlaying ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-[360px] sm:h-[450px] object-cover bg-black"
                />
              ) : (
                <div className="relative w-full h-[360px] sm:h-[450px]">
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transition-all shadow-2xl hover:scale-110"
                    >
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </button>
                  </div>
                  

                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

