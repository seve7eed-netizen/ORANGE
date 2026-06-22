import React from 'react';
import { motion } from 'motion/react';
import { Camera, Video, ArrowRight } from 'lucide-react';

interface PhilosophyProps {
  onPillarClick: (category: 'photography' | 'videography') => void;
}

export default function Philosophy({ onPillarClick }: PhilosophyProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center py-20 px-4 md:px-8 bg-black z-10 overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-accent/[0.04] blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-accent/[0.02] blur-[120px] mix-blend-screen" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.006] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center z-10"
      >
        {/* Section Header Indicator */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
          <span className="h-[1px] w-6 bg-accent opacity-60" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-accent uppercase font-black">
            OUR PHILOSOPHY
          </span>
          <span className="h-[1px] w-6 bg-accent opacity-60" />
        </motion.div>

        {/* Philosophy Intro Quote */}
        <motion.div variants={itemVariants} className="max-w-2xl px-4 mb-4">
          <blockquote className="font-sans text-xl sm:text-2xl md:text-3xl text-white/95 italic font-semibold leading-relaxed tracking-wide mb-8">
            "예정된 계획대로 진행되고 있다.<br />올바른 방향으로 정상 궤도에 올라와 있다."
          </blockquote>
          
          <div className="w-12 h-[1px] bg-dark-border/80 mx-auto mb-8" />
          
          <p className="font-sans text-xs sm:text-sm text-dark-muted leading-relaxed tracking-wider font-light mb-12">
            Orange는 촬영, 영상 제작, 편집, 보정의 유기적인 결합을 통해<br className="hidden sm:inline" />
            브랜드와 사람이 가진 내러티브를 가장 순수하고 깊이 있는 방향으로 이끌어가는 크리에이터, 김장섭입니다.
          </p>
        </motion.div>

        {/* Work Pillars - Big clean responsive cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl px-4"
        >
          {/* Photography Pillar */}
          <div
            onClick={() => onPillarClick('photography')}
            className="group relative p-8 border border-dark-border bg-dark-card/20 backdrop-blur-md rounded-sm text-center sm:text-left hover:border-accent/50 transition-all duration-500 hover:bg-dark-card/60 cursor-pointer flex flex-col justify-between min-h-[160px]"
            id="philosophy-pillar-photography"
          >
            <div className="flex items-center justify-between pointer-events-none mb-6">
              <div className="p-2 border border-dark-border bg-dark-bg/60 rounded-xs text-accent/80 group-hover:text-accent group-hover:border-accent/40 transition-colors">
                <Camera size={18} />
              </div>
              <span className="font-mono text-[10px] text-accent font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                01_PHOTOGRAPHY
              </span>
            </div>
            
            <div className="pointer-events-none text-left">
              <h3 className="font-syne text-sm text-white/90 group-hover:text-accent font-black tracking-[0.1em] transition-all mb-1">
                사진 촬영
              </h3>
              <p className="font-sans text-xs text-dark-muted group-hover:text-white/80 transition-colors">
                브랜드 고유의 비주얼 정체성을 고밀도로 담아내는 아카이브입니다.
              </p>
            </div>
          </div>

          {/* Videography Pillar */}
          <div
            onClick={() => onPillarClick('videography')}
            className="group relative p-8 border border-dark-border bg-dark-card/20 backdrop-blur-md rounded-sm text-center sm:text-left hover:border-accent/50 transition-all duration-500 hover:bg-dark-card/60 cursor-pointer flex flex-col justify-between min-h-[160px]"
            id="philosophy-pillar-videography"
          >
            <div className="flex items-center justify-between pointer-events-none mb-6">
              <div className="p-2 border border-dark-border bg-dark-bg/60 rounded-xs text-accent/80 group-hover:text-accent group-hover:border-accent/40 transition-colors">
                <Video size={18} />
              </div>
              <span className="font-mono text-[10px] text-accent font-semibold opacity-30 group-hover:opacity-100 transition-opacity">
                02_VIDEOGRAPHY
              </span>
            </div>
            
            <div className="pointer-events-none text-left">
              <h3 className="font-syne text-sm text-white/90 group-hover:text-accent font-black tracking-[0.1em] transition-all mb-1">
                영상 촬영
              </h3>
              <p className="font-sans text-xs text-dark-muted group-hover:text-white/80 transition-colors">
                순수한 무드와 유기적 이야기를 시간 속에 응축하는 필름 워크입니다.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
