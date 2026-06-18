import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, CategoryFilter } from '../types';
import { Eye, Search, Grid, LayoutGrid, Calendar } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectGrid({ projects, onProjectClick }: ProjectGridProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'ALL CR' },
    { value: 'photography', label: '사진 촬영' },
    { value: 'videography', label: '영상 촬영' },
    { value: 'editing', label: '영상 편집' },
    { value: 'retouching', label: '사진 보정' }
  ];

  // Filtering + Searching
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeFilter === 'all' || project.category === activeFilter;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.scope.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-24 px-6 md:px-12 bg-dark-bg" id="archive-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Section title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-dark-border/40 pb-10">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[1.5px] w-6 bg-accent" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-accent uppercase font-black">
                EXHIBITION GALLERY
              </span>
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight uppercase select-none">
              DIGITAL <span className="text-accent">ARCHIVE</span>
            </h2>
            <p className="font-outfit text-xs text-dark-muted mt-2 font-light">
              마우스 클릭을 통해 각 오리지널 프로젝트의 상세 사양(클라이언트, 범위, 사용 툴, 기획)을 열람할 수 있습니다.
            </p>
          </div>

          {/* Search box within minimal frame */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="프로젝트, 기술, 클라이언트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-dark-border bg-dark-card/30 text-xs text-white placeholder-dark-muted rounded-sm focus:border-accent/40 focus:outline-none transition-colors font-sans"
              id="gallery-search-input"
            />
            <Search size={12} className="absolute left-3 top-3.5 text-dark-muted" />
          </div>
        </div>

        {/* Minimal Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
          {categories.map((tab) => {
            const isSelected = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className="relative px-5 py-2.5 font-outfit text-xs font-semibold tracking-wider transition-colors outline-none cursor-pointer select-none whitespace-nowrap rounded-sm"
                id={`filter-tab-${tab.value}`}
              >
                <span className={`${isSelected ? 'text-black z-10 relative font-extrabold' : 'text-dark-muted hover:text-white'}`}>
                  {tab.label}
                </span>
                {isSelected && (
                  <motion.span
                    layoutId="filter-active-pill"
                    className="absolute inset-0 bg-accent rounded-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Count */}
        <div className="flex items-center gap-2 mb-8 font-mono text-[9px] text-dark-muted select-none">
          <LayoutGrid size={10} className="text-accent" />
          <span>총 <span className="text-white font-medium">{filteredProjects.length}</span>개의 전시물 아카이빙됨.</span>
        </div>

        {/* Grid Area with Smooth Exit and Entry Animations */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const formattedIndex = String(index + 1).padStart(2, '0');
              const displayCategory = 
                project.category === 'photography' ? '사진 촬영' :
                project.category === 'videography' ? '영상 촬영' :
                project.category === 'editing' ? '영상 편집' : '사진 보정';

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onProjectClick(project)}
                  className="group relative cursor-pointer flex flex-col justify-between overflow-hidden border border-dark-border bg-dark-card/25 hover:border-accent/35 transition-all duration-300 rounded-sm hover:-translate-y-1 w-full"
                  id={`project-card-${project.id}`}
                >
                  {/* Card Image Block */}
                  <div className="relative aspect-video w-full overflow-hidden bg-dark-bg border-b border-dark-border">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Dark gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-60" />

                    {/* View Details Float Trigger Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInHover={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 px-4 py-2 border border-accent/40 bg-accent-dim text-accent font-mono text-[11px] font-bold rounded-sm tracking-widest"
                      >
                        <Eye size={12} className="animate-pulse" />
                        <span>OPEN CABINET</span>
                      </motion.div>
                    </div>

                    {/* Left top subtle project card label */}
                    <span className="absolute top-4 left-4 font-mono text-[9px] text-white/50 bg-dark-bg/80 backdrop-blur-xs py-0.5 px-2 border border-white/10 rounded-xs select-none">
                      [ {formattedIndex} ]
                    </span>

                    {/* Light accent indicator */}
                    {project.featured && (
                      <span className="absolute top-4 right-4 text-[9px] font-mono font-bold bg-accent text-black uppercase py-0.5 px-2 rounded-xs">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Card Content Texts */}
                  <div className="p-6 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] font-bold tracking-widest text-accent uppercase">
                        {project.category.toUpperCase()} // # {displayCategory}
                      </span>
                      <div className="flex items-center gap-1.5 text-dark-muted font-mono text-[9px]">
                        <Calendar size={9} />
                        <span>{project.period}</span>
                      </div>
                    </div>

                    <h3 className="font-outfit text-base font-bold text-white group-hover:text-accent transition-colors tracking-tight line-clamp-1 mb-2">
                      {project.title}
                    </h3>

                    <p className="font-outfit text-xs text-dark-muted leading-relaxed font-light line-clamp-2 md:h-10">
                      {project.description}
                    </p>

                    {/* Footer list of tools */}
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-dark-border/40">
                      {project.tools.slice(0, 3).map((tool, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="font-mono text-[9px] text-dark-muted bg-dark-card py-0.5 px-1.5 rounded-xs border border-dark-border"
                        >
                          {tool}
                        </span>
                      ))}
                      {project.tools.length > 3 && (
                        <span className="font-mono text-[9px] text-accent font-bold py-0.5 px-1.5">
                          +{project.tools.length - 3} OTHER
                        </span>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search Fallback */}
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 border border-dashed border-dark-border rounded-sm text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6"
            id="empty-gallery-fallback"
          >
            <span className="text-xl text-dark-muted uppercase font-syne font-black mb-3">전시물이 존재하지 않습니다</span>
            <p className="font-outfit text-xs text-dark-muted max-w-xs leading-relaxed">
              입력하신 검색어 "{searchQuery}" 또는 필터와 일치하는 작품 자료가 없습니다. 다른 키워드로 검색해 주세요.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="mt-6 px-4 py-2 border border-accent text-accent font-mono text-[10px] tracking-wide font-black hover:bg-accent hover:text-black cursor-pointer transition-all duration-300 rounded-sm"
              id="empty-gallery-reset-btn"
            >
              RESET ALL SELECTIONS
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
