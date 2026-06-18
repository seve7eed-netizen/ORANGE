import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onScrollToArchive: () => void;
  onPillarClick?: (category: 'photography' | 'videography') => void;
}

export default function Hero({ onScrollToArchive, onPillarClick }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-8 select-none">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center flex-1 justify-center"
      >
        
        {/* ==================== THE GOLDEN-RATIO RUNNING TRACK MASTER COMPOSITION (Z-1) ==================== */}
        <motion.div 
          variants={itemVariants} 
          className="w-full max-w-4xl flex flex-col items-center mb-10 sm:mb-12 uppercase relative z-1"
        >
          {/* Running Track SVG - Proportioned exactly to the Golden Ratio (890 x 550) */}
          <div className="w-full flex items-center justify-center relative">
            <svg 
              viewBox="0 0 890 550" 
              className="w-full h-auto text-accent select-none pointer-events-none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Vintage high-end camera viewfinder halation/glow filter */}
                <filter id="breathing-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComponentTransfer in="blur" result="glow">
                    <feFuncA type="linear" slope="2.2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g>
                {/* 1. Vintage racing track lines (Concentric, extremely fine 1.5px lines) */}
                {/* Outer Track Border (Fine Terracotta orange) */}
                <path 
                  d="M 290,105 L 600,105 A 170,170 0 0,1 770,275 A 170,170 0 0,1 600,445 L 290,445 A 170,170 0 0,1 120,275 A 170,170 0 0,1 290,105 Z" 
                  fill="none" 
                  stroke="#F37021" 
                  strokeWidth="1.5" 
                  opacity="0.45"
                />
                
                {/* Lane Divider (Dashed, stopwatch-style index) */}
                <path 
                  d="M 290,137 L 600,137 A 138,138 0 0,1 738,275 A 138,138 0 0,1 600,413 L 290,413 A 138,138 0 0,1 152,275 A 138,138 0 0,1 290,137 Z" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="1" 
                  strokeDasharray="5 7"
                  opacity="0.25"
                />

                {/* Inner Track Border (Fine Terracotta orange) */}
                <path 
                  d="M 290,170 L 600,170 A 105,105 0 0,1 705,275 A 105,105 0 0,1 600,380 L 290,380 A 105,105 0 0,1 185,275 A 105,105 0 0,1 290,170 Z" 
                  fill="none" 
                  stroke="#F37021" 
                  strokeWidth="1.5" 
                  opacity="0.45"
                />

                {/* Starting grid thin tick lines */}
                <line x1="290" y1="105" x2="290" y2="170" stroke="#F37021" strokeWidth="1" opacity="0.35" />
                <line x1="600" y1="105" x2="600" y2="170" stroke="#F37021" strokeWidth="1" opacity="0.35" />
                <line x1="290" y1="380" x2="290" y2="445" stroke="#F37021" strokeWidth="1" opacity="0.35" />
                <line x1="600" y1="380" x2="600" y2="445" stroke="#F37021" strokeWidth="1" opacity="0.35" />

                {/* 2. Beautifully Configured Master Brand Typography inside the track */}
                <g transform="translate(445, 260)" textAnchor="middle">
                  {/* Crisp flat default state text (Base layer in clean white) */}
                  <text 
                    x="0" 
                    y="0" 
                    fontFamily="Syncopate, sans-serif" 
                    fontWeight="700" 
                    fontSize="36" 
                    fill="#e5e8e8" 
                    letterSpacing="1"
                    dominantBaseline="middle"
                    className="select-none pointer-events-none"
                  >
                    ORANGE
                    <tspan fill="#F37021" dx="8" dy="1" fontSize="42">•</tspan>
                  </text>

                  {/* Pulsing breathing white glow layer overlays on top */}
                  <text 
                    x="0" 
                    y="0" 
                    fontFamily="Syncopate, sans-serif" 
                    fontWeight="700" 
                    fontSize="36" 
                    fill="#ffffff" 
                    letterSpacing="1"
                    dominantBaseline="middle"
                    filter="url(#breathing-glow)"
                    className="select-none pointer-events-none"
                  >
                    ORANGE
                    <tspan fill="#F37021" dx="8" dy="1" fontSize="42">•</tspan>
                    <animate 
                      attributeName="opacity" 
                      values="0.05; 0.95; 0.05" 
                      dur="3.8s" 
                      repeatCount="indefinite" 
                      calcMode="spline"
                      keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                    />
                  </text>
                </g>

                {/* "ON THE TRACK" subtitle spaced beautifully below */}
                <text 
                  x="445" 
                  y="320" 
                  fontFamily="Outfit, SUIT, system-ui, sans-serif" 
                  fontWeight="800" 
                  fontSize="18" 
                  fill="#7f9090" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  letterSpacing="14"
                  style={{ transform: "scaleX(1.1)", transformOrigin: "445px 320px" }}
                  className="opacity-90 select-none pointer-events-none"
                >
                  ON THE TRACK
                </text>
              </g>
            </svg>
          </div>
        </motion.div>
        {/* ==================== END OF COMPOSITION ==================== */}

        {/* Philosophy Intro & Description (Placed cleanly at relative z-10 for pixel-perfect readability) */}
        <motion.div 
          variants={itemVariants}
          className="max-w-2xl flex flex-col items-center text-center px-4 relative z-10"
        >
          <blockquote className="font-sans text-base sm:text-lg text-white/90 italic font-medium leading-relaxed tracking-wide mb-6">
            "예정된 계획대로 진행되고 있다. 올바른 방향으로 정상 궤도에 올라와 있다."
          </blockquote>
          <p className="font-sans text-xs sm:text-sm text-dark-muted leading-relaxed tracking-wider font-light mb-12 sm:mb-16">
            Orange는 촬영, 영상 제작, 편집, 보정의 유기적인 결합을 통해<br className="hidden sm:inline" />
            브랜드와 사람이 가진 내러티브를 가장 순수하고 깊이 있는 방향으로 이끌어가는 크리에이터, 김장섭입니다.
          </p>
        </motion.div>

        {/* Work pillars shortcuts (Placed cleanly at relative z-10) */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-12 sm:mb-16 relative z-10"
        >
          {[
            { tag: 'PHOTOGRAPHY' as const, title: '사진 촬영', category: 'photography' as const },
            { tag: 'VIDEOGRAPHY' as const, title: '영상 촬영', category: 'videography' as const }
          ].map((pillar, idx) => (
            <div 
              key={idx}
              className="group relative p-4 border border-dark-border bg-dark-card/30 backdrop-blur-sm rounded-sm text-center sm:text-left hover:border-accent/45 transition-all duration-500 hover:bg-dark-card/65 cursor-pointer"
              onClick={() => onPillarClick?.(pillar.category)}
            >
              <div className="absolute top-2 right-2 font-mono text-[9px] text-accent font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                0{idx + 1}
              </div>
              <h3 className="font-syne text-xs text-white opacity-40 group-hover:opacity-100 group-hover:text-accent font-extrabold tracking-[0.15em] transition-all">
                {pillar.tag}
              </h3>
              <p className="font-sans text-sm font-medium text-dark-muted group-hover:text-white transition-colors mt-1.5">
                {pillar.title}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator (Placed cleanly at relative z-10) */}
        <motion.div 
          variants={itemVariants}
          className="mt-4 flex flex-col items-center gap-2 cursor-pointer text-dark-muted hover:text-accent transition-colors duration-300 relative z-10"
          onClick={onScrollToArchive}
          id="hero-scroll-indicator"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] font-bold">ENTER EXHIBITION</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={14} className="text-accent" />
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}
