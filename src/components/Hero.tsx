import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';

interface HeroProps {
  onScrollToArchive: () => void;
}

export default function Hero({ onScrollToArchive }: HeroProps) {
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

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: '100%',
      transition: { duration: 1.2, ease: "easeInOut" }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-6 md:px-12 bg-dark-bg overflow-hidden select-none">
      
      {/* Background cinematic mesh overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[30%] -right-[15%] w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent/3 blur-[100px] mix-blend-screen" />
        {/* Gallery floor grids (Subtle reference lines) */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center text-white"
      >
        
        {/* Subtle Identity tag */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-dark-border bg-dark-card text-dark-muted font-mono text-[10px] tracking-[0.2em] uppercase"
        >
          <Sparkles size={11} className="text-accent" />
          <span>VISUAL ARCHIVE & DIARY OF ORANGE</span>
        </motion.div>

        {/* Big Premium Header Typo: ON THE TRACK */}
        <motion.h1 
          variants={itemVariants}
          className="font-syne text-4xl sm:text-6xl md:text-8xl font-black leading-none tracking-tight mb-4 select-none uppercase"
        >
          ON THE <span className="text-accent">TRACK</span>
        </motion.h1>

        {/* Framing line representing a track */}
        <motion.div 
          variants={lineVariants}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-accent to-transparent max-w-xl mx-auto mb-8"
        />

        {/* Philosophy Intro */}
        <motion.p 
          variants={itemVariants}
          className="max-w-2xl font-outfit text-sm md:text-base text-dark-muted leading-relaxed tracking-wide font-light mb-12 px-4"
        >
          <span className="text-white font-medium italic block mb-3">
            "예정된 계획대로 진행되고 있다. 올바른 방향으로 정상 궤도에 올라와 있다."
          </span>
          Orange는 촬영, 영상 제작, 편집, 보정의 유기적인 결합을 통해<br className="hidden sm:inline" />
          브랜드와 사람이 가진 내러티브를 가장 순수하고 깊이 있는 방향으로 이끌어가는 크리에이터, 김장섭입니다.
        </motion.p>

        {/* Work pillars shortcuts */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          {[
            { tag: 'PHOTOGRAPHY', title: '사진 촬영' },
            { tag: 'VIDEOGRAPHY', title: '영상 촬영' },
            { tag: 'EDITING', title: '영상 편집' },
            { tag: 'RETOUCHING', title: '사진 보정' }
          ].map((pillar, idx) => (
            <div 
              key={idx}
              className="group relative p-4 border border-dark-border bg-dark-card/40 backdrop-blur-sm rounded-sm text-left hover:border-accent/45 transition-all duration-500 hover:bg-dark-card"
            >
              <div className="absolute top-2 right-2 font-mono text-[9px] text-accent font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                0{idx + 1}
              </div>
              <h3 className="font-syne text-xs text-white opacity-40 group-hover:opacity-100 group-hover:text-accent font-extrabold tracking-[0.1em] transition-all">
                {pillar.tag}
              </h3>
              <p className="font-outfit text-sm font-medium text-dark-muted group-hover:text-white transition-colors mt-1.5">
                {pillar.title}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Scroll action scroll indicator */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 flex flex-col items-center gap-2 cursor-pointer hover:text-accent transition-colors duration-300"
          onClick={onScrollToArchive}
          id="hero-scroll-indicator"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] text-dark-muted">ENTER EXHIBITION</span>
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
