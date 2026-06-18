import React from 'react';
import { Mail, Instagram, Compass, ArrowUp } from 'lucide-react';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-bg border-t border-dark-border py-16 px-6 md:px-12 relative overflow-hidden select-none text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* Top block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start pb-12 mb-12 border-b border-dark-border/40">
          
          {/* Logo brand info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-syne text-xl font-bold text-white tracking-widest">
                ORANGE
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>

            <p className="font-outfit text-xs text-dark-muted max-w-sm leading-relaxed font-light">
              미스터 크리에이터 오렌지(김장섭)는 렌즈의 프레임을 통해 정량화할 수 없는 세상의 미학적인 궤도를 정밀 추적하고 구축하여, 가장 올바른 가도로 이야기를 안내합니다.
            </p>
          </div>

          {/* Slogan Philosophy */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-mono text-[9px] tracking-[0.25em] text-accent uppercase font-black block">
              // BRAND SLOGAN
            </span>
            <span className="font-syne font-black text-white text-lg tracking-wider block">
              ON THE TRACK
            </span>
            <span className="font-outfit text-xs text-dark-muted font-light leading-relaxed">
              "올바른 방향이자 예정된 계획대로 진행되고 있으며 정상 궤도에 서 있다."
            </span>
          </div>

          {/* Contact Coordinates */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-mono text-[9px] tracking-[0.25em] text-accent uppercase font-black block">
              // CONTACT ME
            </span>
            
            <div className="flex flex-col gap-2 font-mono text-[11px] text-dark-muted">
              <a 
                href="mailto:seve7eed@gmail.com" 
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
              >
                <Mail size={12} className="text-accent" />
                <span>seve7eed@gmail.com</span>
              </a>
              <div 
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer select-text"
              >
                <Instagram size={12} className="text-accent" />
                <span>@orange_on_the_track</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass size={12} className="text-accent" />
                <span className="select-none">SEOUL, KOREA // WORLDWIDE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyrights / Return to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[10px] font-mono text-dark-muted text-center sm:text-left leading-relaxed">
            <span>© 2026 ORANGE (김장섭) CORP. ALL RIGHTS RESERVED.</span>
            <span className="hidden sm:inline text-dark-border">|</span>
            <span className="hover:text-accent transition-colors">PORTFOLIO EXHIBITION CABINET</span>
          </div>

          {/* Return to top clicker */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 py-1 px-3.5 border border-dark-border hover:border-accent bg-dark-card/30 text-dark-muted hover:text-accent font-mono text-[9px] tracking-widest font-black rounded-xs transition-colors cursor-pointer outline-none uppercase"
            id="footer-back-to-top-btn"
          >
            <span>RETURN TO CEILING</span>
            <ArrowUp size={11} />
          </button>
        </div>

      </div>
    </footer>
  );
}
