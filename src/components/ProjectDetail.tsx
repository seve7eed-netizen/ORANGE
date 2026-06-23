import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { X, Calendar, User, CheckSquare, Wrench, Image as ImageIcon, Video, Maximize2, ExternalLink } from 'lucide-react';
import { getEmbedUrl } from '../utils/video';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  if (!project) return null;

  const displayCategory = 
    project.category === 'photography' ? '사진 촬영 (Photography)' :
    project.category === 'videography' ? '영상 촬영 (Videography)' :
    project.category === 'editing' ? '영상 편집 (Editing)' : '사진 보정 (Retouching)';

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto" id="project-detail-overlay">
      
      {/* 1. Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 backdrop-blur-md cursor-zoom-out"
      />

      {/* 2. Scrollable Container */}
      <div className="min-h-screen py-12 px-4 md:px-8 flex items-center justify-center relative pointer-events-none">
        
        {/* Modal Window Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-dark-bg border border-dark-border max-w-5xl w-full text-left rounded-sm overflow-hidden shadow-2xl pointer-events-auto z-10"
        >
          
          {/* Main Top Header Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border bg-dark-card/50">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[9px] tracking-[0.2em] text-accent uppercase font-black">
                {project.category.toUpperCase()} // PROJECT INDEX
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 px-3 border border-dark-border/60 rounded-xs text-xs font-mono text-dark-muted hover:text-white hover:border-accent cursor-pointer transition-colors outline-none flex items-center gap-1.5"
              id="close-project-detail-btn"
            >
              <X size={12} />
              <span>EXIT_DET</span>
            </button>
          </div>

          <div className="p-6 md:p-10">
            {/* Top Layout Grid: Left Title Block / Right Meta Placard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-10">
              
              {/* Left Column: Title & Description */}
              <div className="lg:col-span-7 flex flex-col justify-start">
                <span className="font-syne text-[10px] text-accent font-extrabold tracking-widest uppercase mb-1">
                  {displayCategory}
                </span>
                
                <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
                  {project.title}
                </h2>

                <div className="h-[1px] bg-dark-border/60 w-32 mb-6" />

                <h4 className="font-outfit text-xs text-accent font-semibold tracking-wider uppercase mb-3">// PROJECT OVERVIEW</h4>
                <p className="font-sans text-sm text-dark-text/90 leading-relaxed font-light whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Right Column: Mini Museum Spec Placard info (Modern, Minimal) */}
              <div className="lg:col-span-5 bg-dark-card/40 border border-dark-border/80 p-6 rounded-sm flex flex-col gap-5 text-left h-fit self-start">
                
                <h4 className="font-mono text-[10px] text-dark-muted border-b border-dark-border/50 pb-2 uppercase tracking-widest font-black">
                  [ METADATA LOG // SPEC SHEET ]
                </h4>

                {/* Client item */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
                    <User size={11} className="text-accent" />
                    <span>CLIENT_</span>
                  </div>
                  <div className="col-span-2 text-left font-outfit text-xs font-medium text-white">
                    {project.client}
                  </div>
                </div>

                {/* Period item */}
                <div className="grid grid-cols-3 gap-2 border-t border-dark-border/10 pt-4">
                  <div className="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
                    <Calendar size={11} className="text-accent" />
                    <span>TIMELINE_</span>
                  </div>
                  <div className="col-span-2 text-left font-outfit text-xs font-medium text-white">
                    {project.period}
                  </div>
                </div>

                {/* Scope of Work tags */}
                <div className="grid grid-cols-3 gap-2 border-t border-dark-border/10 pt-4">
                  <div className="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
                    <CheckSquare size={11} className="text-accent" />
                    <span>SCOPE_</span>
                  </div>
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {project.scope.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-outfit bg-dark-bg border border-dark-border text-dark-muted rounded-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools utilized */}
                <div className="grid grid-cols-3 gap-2 border-t border-dark-border/10 pt-4">
                  <div className="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
                    <Wrench size={11} className="text-accent" />
                    <span>TOOLS_</span>
                  </div>
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {project.tools.map((tool, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono bg-accent-dim/20 border border-accent/20 text-accent rounded-xs font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Video Segment (If Provided) */}
            {project.videoUrl && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Video size={14} className="text-accent" />
                  <h4 className="font-syne text-xs text-white uppercase tracking-widest font-bold">
                    PREMIUM VIDEO VIEW (프로젝트 영상)
                  </h4>
                </div>
                
                {/* Embedded custom style video player frame */}
                <div className="relative aspect-video w-full overflow-hidden border border-dark-border bg-black rounded-sm shadow-inner group">
                  {project.videoUrl.startsWith('data:video/') || (!project.videoUrl.includes('youtube.com') && !project.videoUrl.includes('youtu.be') && !project.videoUrl.includes('vimeo.com')) ? (
                    <video
                      src={project.videoUrl}
                      controls
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(project.videoUrl)}
                      title={project.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )}
                  
                  {/* Floating brand signature bottom right */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-dark-bg/80 border border-dark-border text-[9px] font-mono text-dark-muted rounded-xs select-none pointer-events-none group-hover:text-accent group-hover:border-accent/40 transition-colors">
                    ORANGE // STREAMING_TRACK
                  </div>
                </div>
              </div>
            )}

            {/* Photo Gallery Grid */}
            <div className="border-t border-dark-border/40 pt-10">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon size={14} className="text-accent" />
                <h4 className="font-syne text-xs text-white uppercase tracking-widest font-bold">
                  PROJECT EXHIBITION CANVAS (추가 전시 이미지)
                </h4>
              </div>

              {/* Main Cover + Additionals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                
                {/* 1. Main Cover Image Card */}
                <div 
                  className="group relative aspect-4/3 overflow-hidden border border-dark-border bg-dark-bg rounded-sm cursor-zoom-in"
                  onClick={() => setSelectedZoomImage(project.coverImage)}
                >
                  <img
                    src={project.coverImage}
                    alt={`${project.title} cover`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={16} className="text-white bg-dark-bg/60 p-1.5 rounded-sm" />
                  </div>
                  <span className="absolute bottom-3 left-3 bg-dark-bg/80 border border-dark-border text-[8px] font-mono px-2 py-0.5 text-dark-muted rounded-xs">
                    MAIN COVER
                  </span>
                </div>

                {/* Additional list images */}
                {project.additionalImages && project.additionalImages.length > 0 ? (
                  project.additionalImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className="group relative aspect-4/3 overflow-hidden border border-dark-border bg-dark-bg rounded-sm cursor-zoom-in"
                      onClick={() => setSelectedZoomImage(img)}
                    >
                      <img
                        src={img}
                        alt={`${project.title} supplementary ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 size={16} className="text-white bg-dark-bg/60 p-1.5 rounded-sm" />
                      </div>
                      <span className="absolute bottom-3 left-3 bg-dark-bg/80 border border-dark-border text-[8px] font-mono px-2 py-0.5 text-dark-muted rounded-xs">
                        PLATE #0{idx + 1}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-dark-border rounded-sm flex items-center justify-center p-6 text-center text-dark-muted bg-dark-card/10 select-none">
                    <span className="font-mono text-[9px] uppercase tracking-wider">
                      추가 전시 미디어가 없습니다.
                    </span>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Footer of the Detail placard */}
          <div className="px-6 py-4 bg-dark-card/20 border-t border-dark-border/40 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[9px] text-dark-muted uppercase">
              ORANGE DIGITAL ARCHIVES © 2026 // SLOGAN: ON THE TRACK
            </span>
            <span className="font-mono text-[9px] text-white/40 font-bold bg-dark-bg px-2.5 py-1 rounded-sm border border-dark-border select-none">
              DIRECTION SET. GOING CORRECTLY.
            </span>
          </div>

        </motion.div>
      </div>

      {/* 3. Fully zoomed lightbox modal */}
      <AnimatePresence>
        {selectedZoomImage && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedZoomImage(null)}
              className="absolute inset-0 bg-black/98 cursor-zoom-out"
            />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden border border-white/10 rounded-sm shadow-2xl z-10"
            >
              <img
                src={selectedZoomImage}
                alt="Zoomed plate"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[85vh] object-contain"
              />
              <button
                onClick={() => setSelectedZoomImage(null)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-accent text-white hover:text-black py-1 px-3 border border-white/20 rounded-xs font-mono text-[10px] font-bold tracking-widest cursor-pointer transition-colors"
                id="lightbox-close-btn"
              >
                CLOSE_IMG
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
