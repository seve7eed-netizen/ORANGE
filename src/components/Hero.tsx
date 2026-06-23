import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  onEnter: () => void;
}

export default function Hero({ onEnter }: HeroProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const logoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.8, ease: 'easeOut' }
    }
  };

  return (
    <section className="relative -mt-16 h-[100dvh] w-full flex flex-col items-center justify-center bg-black px-4 md:px-8 overflow-hidden z-20 select-none">
      
      {/* Immersive centered logo */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={logoVariants}
        className="w-full max-w-4xl flex flex-col items-center uppercase relative"
      >
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
              <g>
                <path 
                  d="M 290,105 L 600,105 A 170,170 0 0,1 770,275 A 170,170 0 0,1 600,445 L 290,445 A 170,170 0 0,1 120,275 A 170,170 0 0,1 290,105 Z" 
                  fill="none" 
                  stroke="#F37021" 
                  strokeWidth="1.5" 
                  opacity="0.45"
                />
                <path 
                  d="M 290,105 L 600,105 A 170,170 0 0,1 770,275 A 170,170 0 0,1 600,445 L 290,445 A 170,170 0 0,1 120,275 A 170,170 0 0,1 290,105 Z" 
                  fill="none" 
                  stroke="#F37021" 
                  strokeWidth="2.5" 
                  filter="url(#breathing-glow)"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.05; 0.95; 0.05" 
                    dur="3.8s" 
                    repeatCount="indefinite" 
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </path>
              </g>
              
              <g>
                <path 
                  d="M 290,137 L 600,137 A 138,138 0 0,1 738,275 A 138,138 0 0,1 600,413 L 290,413 A 138,138 0 0,1 152,275 A 138,138 0 0,1 290,137 Z" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="1" 
                  strokeDasharray="5 7"
                  opacity="0.25"
                />
                <path 
                  d="M 290,137 L 600,137 A 138,138 0 0,1 738,275 A 138,138 0 0,1 600,413 L 290,413 A 138,138 0 0,1 152,275 A 138,138 0 0,1 290,137 Z" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="1.5" 
                  strokeDasharray="5 7"
                  filter="url(#breathing-glow)"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.05; 0.45; 0.05" 
                    dur="3.8s" 
                    repeatCount="indefinite" 
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </path>
              </g>

              <g>
                <path 
                  d="M 290,170 L 600,170 A 105,105 0 0,1 705,275 A 105,105 0 0,1 600,380 L 290,380 A 105,105 0 0,1 185,275 A 105,105 0 0,1 290,170 Z" 
                  fill="none" 
                  stroke="#F37021" 
                  strokeWidth="1.5" 
                  opacity="0.45"
                />
                <path 
                  d="M 290,170 L 600,170 A 105,105 0 0,1 705,275 A 105,105 0 0,1 600,380 L 290,380 A 105,105 0 0,1 185,275 A 105,105 0 0,1 290,170 Z" 
                  fill="none" 
                  stroke="#F37021" 
                  strokeWidth="2.5" 
                  filter="url(#breathing-glow)"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.05; 0.95; 0.05" 
                    dur="3.8s" 
                    repeatCount="indefinite" 
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </path>
              </g>

              {/* Starting grid thin tick lines */}
              <g>
                <line x1="290" y1="105" x2="290" y2="170" stroke="#F37021" strokeWidth="1" opacity="0.35" />
                <line x1="290" y1="105" x2="290" y2="170" stroke="#F37021" strokeWidth="1.5" filter="url(#breathing-glow)">
                  <animate 
                    attributeName="opacity" 
                    values="0.05; 0.95; 0.05" 
                    dur="3.8s" 
                    repeatCount="indefinite" 
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </line>
              </g>
              <g>
                <line x1="600" y1="105" x2="600" y2="170" stroke="#F37021" strokeWidth="1" opacity="0.35" />
                <line x1="600" y1="105" x2="600" y2="170" stroke="#F37021" strokeWidth="1.5" filter="url(#breathing-glow)">
                  <animate 
                    attributeName="opacity" 
                    values="0.05; 0.95; 0.05" 
                    dur="3.8s" 
                    repeatCount="indefinite" 
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </line>
              </g>
              <g>
                <line x1="290" y1="380" x2="290" y2="445" stroke="#F37021" strokeWidth="1" opacity="0.35" />
                <line x1="290" y1="380" x2="290" y2="445" stroke="#F37021" strokeWidth="1.5" filter="url(#breathing-glow)">
                  <animate 
                    attributeName="opacity" 
                    values="0.05; 0.95; 0.05" 
                    dur="3.8s" 
                    repeatCount="indefinite" 
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </line>
              </g>
              <g>
                <line x1="600" y1="380" x2="600" y2="445" stroke="#F37021" strokeWidth="1" opacity="0.35" />
                <line x1="600" y1="380" x2="600" y2="445" stroke="#F37021" strokeWidth="1.5" filter="url(#breathing-glow)">
                  <animate 
                    attributeName="opacity" 
                    values="0.05; 0.95; 0.05" 
                    dur="3.8s" 
                    repeatCount="indefinite" 
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </line>
              </g>

              {/* 2. Brand Typography (static actual size) */}
              <g transform="translate(445, 260)" textAnchor="middle">
                <text 
                  x="0" 
                  y="0" 
                  fontFamily="'Syncopate', sans-serif" 
                  fontWeight="700" 
                  fontSize="38" 
                  fill="#ffffff" 
                  letterSpacing="3"
                  dominantBaseline="middle"
                  className="select-none pointer-events-none"
                >
                  ORANGE
                </text>

                {/* Pulsing breathing white glow layer */}
                <text 
                  x="0" 
                  y="0" 
                  fontFamily="'Syncopate', sans-serif" 
                  fontWeight="700" 
                  fontSize="38" 
                  fill="#ffffff" 
                  letterSpacing="3"
                  dominantBaseline="middle"
                  filter="url(#breathing-glow)"
                  className="select-none pointer-events-none"
                >
                  ORANGE
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

              {/* "ON THE TRACK" subtitle with breathing glow */}
              <g>
                <text 
                  x="445" 
                  y="320" 
                  fontFamily="'Antonio', 'SUIT', sans-serif" 
                  fontWeight="700" 
                  fontSize="17" 
                  fill="#9d9690" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  letterSpacing="16"
                  className="opacity-90 select-none pointer-events-none"
                >
                  ON THE TRACK
                </text>
                <text 
                  x="445" 
                  y="320" 
                  fontFamily="'Antonio', 'SUIT', sans-serif" 
                  fontWeight="700" 
                  fontSize="17" 
                  fill="#ffffff" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  letterSpacing="16"
                  filter="url(#breathing-glow)"
                  className="select-none pointer-events-none"
                >
                  ON THE TRACK
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
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Modern entrance CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1.0 }}
        className="absolute bottom-16 flex flex-col items-center gap-3 z-10"
      >
        <button
          onClick={onEnter}
          className="flex items-center gap-2 px-6 py-3 border border-accent/40 bg-accent-dim/15 hover:bg-accent text-accent hover:text-black font-mono text-[11px] tracking-[0.2em] font-bold rounded-sm transition-all duration-300 group cursor-pointer"
          id="enter-site-btn"
        >
          <span>ENTER JOURNAL</span>
          <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

    </section>
  );
}
