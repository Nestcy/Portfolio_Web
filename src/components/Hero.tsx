import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroProps {
  onViewProjects: () => void;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewProjects, onOpenResume }) => {
  const { personalInfo } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor(width / 24), 50);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1,
      alpha: Math.random() * 0.4 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(161, 161, 170, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(82, 82, 91, ${0.2 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const heroTitle = personalInfo.heroTitle || "Building Intelligent Systems, Not Just Software.";
  const heroSubtitle = personalInfo.heroSubtitle || "Lead AI System Architect specializing in high-scale LLM architectures, RAG pipelines, sub-100ms vector retrieval, and autonomous agent orchestration. Converting complex research into production-grade systems.";
  const specializations = personalInfo.heroTechStack && personalInfo.heroTechStack.length > 0
    ? personalInfo.heroTechStack
    : ["PyTorch", "LangGraph", "Pinecone", "CUDA", "Rust", "vLLM", "Ray", "Qdrant", "TensorRT", "BGE-M3"];
  const ctaPrimary = personalInfo.heroCtaPrimaryText || "View Projects";
  const ctaSecondary = personalInfo.heroCtaSecondaryText || "Resume CV";

  return (
    <section id="hero" className="relative pt-28 pb-20 min-h-[65vh] flex flex-col justify-center bg-[#0d0c0b] border-b border-[#2a2826] overflow-hidden font-geist">
      {/* Background Grid Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full opacity-30" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ff4d00 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Availability Tag */}
        <div className="flex justify-start mb-6">
          <div className="corner-label inline-block">
            [SYS_STATUS] // AI_ENGINEERING_SPECIALIST &bull; {personalInfo.availability}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_260px] gap-8 items-start">
          
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="font-oswald uppercase text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-[1.05] border-l-4 border-[#ff4d00] pl-4 sm:pl-6">
                {heroTitle.includes(',') ? (
                  <>
                    {heroTitle.split(',')[0]}, <span className="text-[#ff4d00]">{heroTitle.split(',').slice(1).join(',')}</span>
                  </>
                ) : (
                  heroTitle
                )}
              </h1>

              <p className="text-[#dfdbd7]/80 text-sm sm:text-base leading-relaxed max-w-2xl font-geist">
                {heroSubtitle}
              </p>

              {/* Monospace Tech Chips */}
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <span
                    key={spec}
                    className="label-tag text-[10px] m-0"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onViewProjects}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#ff4d00] hover:bg-[#ff6622] text-[#0d0c0b] text-xs font-bold font-mono uppercase tracking-widest transition-colors shadow-lg border border-[#ff4d00]"
              >
                {ctaPrimary}
              </button>

              <button
                onClick={onOpenResume}
                className="flex-1 sm:flex-none px-6 py-3 border border-[#2a2826] bg-[#161514] hover:bg-[#201e1d] text-white text-xs font-bold font-mono uppercase tracking-widest transition-colors"
              >
                {ctaSecondary}
              </button>
            </div>
          </div>

          {/* Profile Headshot Card - Always Visible */}
          <div className="relative p-3 bg-[#161514]/80 border border-[#2a2826] font-mono w-full max-w-xs mx-auto md:max-w-none">
            <div className="corner-label mb-2 flex justify-between items-center text-[9px]">
              <span>[OPERATOR_ID]</span>
              <span className="text-emerald-400">&bull; ONLINE</span>
            </div>

            <div className="relative group overflow-hidden border border-[#ff4d00]/50 mb-3">
              <img
                src={personalInfo.profileImage || personalInfo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={personalInfo.name}
                className="w-full h-48 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-syne font-bold truncate">
                {personalInfo.name}
              </div>
            </div>

            <div className="text-[10px] text-zinc-400 space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-zinc-500">ROLE:</span>
                <span className="text-[#ff4d00] font-bold truncate max-w-[150px]">{personalInfo.title.split('&')[0]}</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span className="text-zinc-500">CLEARANCE:</span>
                <span className="text-white">L5 ARCHITECT</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
