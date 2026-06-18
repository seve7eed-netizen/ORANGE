import React from 'react';
import { motion } from 'motion/react';
import { services } from '../initialProjects';
import { Camera, Video, Film, Sliders, ArrowUpRight } from 'lucide-react';

export default function Services() {
  const getIcon = (id: string) => {
    switch (id) {
      case 's1':
        return <Camera size={20} className="text-accent" />;
      case 's2':
        return <Video size={20} className="text-accent" />;
      case 's3':
        return <Film size={20} className="text-accent" />;
      case 's4':
        return <Sliders size={20} className="text-accent" />;
      default:
        return <Camera size={20} className="text-accent" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-dark-bg border-t border-dark-border" id="services-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Section title */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1.5px] w-6 bg-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-accent uppercase font-black">
              CORE WORK RANGE
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight uppercase">
              크리에이티브 솔루션의 네 가지 기둥
            </h2>
            <p className="max-w-md font-outfit text-xs text-dark-muted leading-relaxed">
              Orange는 단순히 피사체를 렌즈에 포착하는 미학적 순간에 멈추지 않고, 영상의 속도적 연동성과 후반 보정의 미시적 정밀 조율까지 완전무결하게 통합하여 브랜드의 핵심을 정상 궤도로 이끕니다.
            </p>
          </div>
        </div>

        {/* Services List/Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((srv, idx) => (
            <motion.div
              key={srv.id}
              variants={cardVariants}
              className="group p-8 rounded-sm border border-dark-border bg-dark-card/30 backdrop-blur-sm shadow-xs flex flex-col justify-between hover:border-accent/40 hover:bg-dark-card transition-all duration-500 overflow-hidden relative"
            >
              {/* Corner Watermark */}
              <span className="absolute right-6 top-6 font-mono text-[10px] text-dark-muted/20 group-hover:text-accent/30 font-bold tracking-widest uppercase transition-colors">
                [ 0{idx + 1} // CR ]
              </span>

              <div>
                {/* Header info */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="p-2.5 rounded-sm bg-dark-bg border border-dark-border group-hover:border-accent/20 group-hover:bg-accent-dim transition-colors">
                    {getIcon(srv.id)}
                  </div>
                  <div>
                    <h4 className="font-syne text-xs font-black text-accent tracking-widest uppercase mb-1">
                      {srv.englishTitle}
                    </h4>
                    <h3 className="font-outfit text-lg font-bold text-white group-hover:text-accent transition-colors">
                      {srv.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="font-outfit text-xs text-dark-muted leading-relaxed font-light mb-8 max-w-xl group-hover:text-dark-text transition-colors">
                  {srv.description}
                </p>
              </div>

              {/* Scope details */}
              <div className="border-t border-dark-border/60 pt-6 mt-auto">
                <span className="font-mono text-[9px] text-dark-muted block mb-3 uppercase tracking-wider">
                  세부 작업 범위
                </span>
                <div className="flex flex-wrap gap-2">
                  {srv.capabilities.map((cap, capIdx) => (
                    <span 
                      key={capIdx}
                      className="px-2.5 py-1 text-[11px] font-outfit text-dark-muted bg-dark-bg/60 border border-dark-border/40 group-hover:border-accent/15 group-hover:text-white transition-colors capitalize rounded-xs"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Philosophy segment block */}
        <div className="mt-20 p-10 md:p-12 border border-dark-border bg-dark-card/10 rounded-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-accent/3 blur-[60px] pointer-events-none rounded-full" />
          
          <div className="max-w-xl relative z-10 text-left">
            <span className="font-mono text-[10px] text-accent font-extrabold tracking-widest block mb-2 uppercase">
              // ON THE TRACK PHILOSOPHY
            </span>
            <h3 className="font-syne text-xl md:text-2xl font-extrabold text-white uppercase mb-4 tracking-tight">
              작품이 가장 돋보이는 설계
            </h3>
            <p className="font-sans text-xs md:text-sm text-dark-muted leading-relaxed font-light">
              진정한 크리에이터는 디자인 뒤편에서 빛나는 아카이브의 등대 역할을 해야 합니다. Orange는 불필요한 장식과 허세를 걷어낸 미니멀한 구성으로, 오직 당신이 위임한 원본 소스와 결과물이 가장 돋보이는 절대적인 신뢰의 프레젠테이션을 완성합니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10 shrink-0">
            <div className="p-5 border border-dark-border bg-dark-bg rounded-sm flex-1 lg:max-w-[200px]">
              <span className="font-mono text-[22px] text-accent font-bold">100%</span>
              <p className="font-sans text-[11px] text-dark-muted uppercase mt-1 tracking-wider">
                정밀 픽셀 리터칭 신뢰도
              </p>
            </div>
            <div className="p-5 border border-dark-border bg-dark-bg rounded-sm flex-1 lg:max-w-[200px]">
              <span className="font-mono text-[22px] text-accent font-bold">RAW</span>
              <p className="font-sans text-[11px] text-dark-muted uppercase mt-1 tracking-wider">
                6K 하이 프로덕션 워크프로
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
