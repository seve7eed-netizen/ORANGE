/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import Services from './components/Services';
import ProjectDetail from './components/ProjectDetail';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { initialProjects } from './initialProjects';
import { Project } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, Camera, Palette, Sliders, Play, Settings, Landmark, ShieldCheck } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('gallery'); // 'gallery', 'services', 'philosophy', 'admin'
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // References for scrolling
  const archiveRef = useRef<HTMLDivElement | null>(null);

  // Load from local Storage on boot, fallback to elegant preset
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orange_archive_portfolios');
      if (saved) {
        setProjects(JSON.parse(saved));
      } else {
        setProjects(initialProjects);
        localStorage.setItem('orange_archive_portfolios', JSON.stringify(initialProjects));
      }
    } catch (e) {
      setProjects(initialProjects);
    }
  }, []);

  const updatePersistedData = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem('orange_archive_portfolios', JSON.stringify(updated));
  };

  const handleAddProject = (p: Project) => {
    const updated = [p, ...projects];
    updatePersistedData(updated);
  };

  const handleUpdateProject = (p: Project) => {
    const updated = projects.map((orig) => (orig.id === p.id ? p : orig));
    updatePersistedData(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    updatePersistedData(updated);
  };

  const handleResetToDefault = () => {
    updatePersistedData(initialProjects);
  };

  const handleImportBackup = (imported: Project[]) => {
    updatePersistedData(imported);
  };

  const handleScrollToArchive = () => {
    setCurrentTab('gallery');
    setTimeout(() => {
      if (archiveRef.current) {
        archiveRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        document.getElementById('archive-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen flex flex-col font-sans selection:bg-accent selection:text-black">
      
      {/* 1. Header Navigation Wrapper */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // If switching to gallery, smooth scroll to gallery anchor automatically
          if (tab === 'gallery') {
            setTimeout(() => {
              document.getElementById('archive-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        isAdmin={isAdminLoggedIn}
        onAdminClick={() => setCurrentTab('admin')}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setCurrentTab('gallery');
          alert('관리자 모드가 해제되었습니다. 전시관 메인 화면으로 전환됩니다.');
        }}
      />

      {/* 2. Main Page Body with Motion Wrapper */}
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          {currentTab === 'gallery' && (
            <motion.div
              key="gallery-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Introduction Banner */}
              <Hero onScrollToArchive={handleScrollToArchive} />

              {/* Central Exhibition grid */}
              <div ref={archiveRef} id="archive-section">
                <ProjectGrid
                  projects={projects}
                  onProjectClick={(p) => setSelectedProject(p)}
                />
              </div>

              {/* Minimalist preview of range */}
              <Services />
            </motion.div>
          )}

          {currentTab === 'services' && (
            <motion.div
              key="services-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Services />
            </motion.div>
          )}

          {currentTab === 'philosophy' && (
            <motion.div
              key="philosophy-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="py-24 px-6 md:px-12 max-w-7xl mx-auto"
              id="philosophy-section"
            >
              {/* Section Header */}
              <div className="flex flex-col mb-16 text-left max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-[1.5px] w-6 bg-accent" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-accent uppercase font-black">
                    BIOGRAPHY & SLOGAN PHILOSOPHY
                  </span>
                </div>
                <h2 className="font-syne text-3xl sm:text-5xl font-black text-white leading-tight uppercase mb-6">
                  DIRECTION IS <br />
                  MORE IMPORTANT THAN <span className="text-accent">SPEED</span>
                </h2>
                <div className="h-[2px] bg-accent w-16 mb-6" />
                <p className="font-outfit text-sm text-dark-muted leading-relaxed font-light">
                  활동명 <span className="text-white font-medium">Orange</span>인 크리에이터 <span className="text-white font-semibold">김장섭</span>은, 단순히 아름다운 구도를 기교적으로 포착하는 것에 머물지 않고 촬영, 연출, 편집, 파인아트 리터칭까지 수치화할 수 없는 창작 가도를 유기적 궤도로 기획합니다.
                </p>
              </div>

              {/* Core Philosophy blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
                
                {/* Pillar 1 */}
                <div className="p-8 border border-dark-border bg-dark-card/20 rounded-sm relative">
                  <span className="font-syne text-4xl font-extrabold text-[#222222] absolute top-6 right-6">01</span>
                  <div className="flex items-center gap-2 mb-5">
                    <Compass size={16} className="text-accent" />
                    <h3 className="font-outfit text-base font-bold text-white tracking-tight">예정된 계획과 정밀함</h3>
                  </div>
                  <h4 className="font-outfit text-xs text-accent font-semibold block mb-3">SYSTEMATIC INTEGRATION</h4>
                  <p className="font-sans text-xs text-dark-muted leading-relaxed font-light">
                    슬로건 <strong className="text-white font-medium">"ON THE TRACK"</strong>은 올바른 방향으로 일정표대로 정상 궤도에 올라와 있음을 의미합니다. 제작 기간 동안 클라이언트와의 면밀한 분석 및 설계 조율을 거쳐, 오직 한 치의 흐트러짐 없는 완벽한 아카이브 가도를 고집합니다.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-8 border border-dark-border bg-dark-card/20 rounded-sm relative">
                  <span className="font-syne text-4xl font-extrabold text-[#222222] absolute top-6 right-6">02</span>
                  <div className="flex items-center gap-2 mb-5">
                    <Camera size={16} className="text-accent" />
                    <h3 className="font-outfit text-base font-bold text-white tracking-tight">유기적인 사륜 구동</h3>
                  </div>
                  <h4 className="font-outfit text-xs text-accent font-semibold block mb-3">PHOTOGRAPHY TO EDITING</h4>
                  <p className="font-sans text-xs text-dark-muted leading-relaxed font-light">
                    수많은 크리에이터가 '촬영 따로, 편집 따로, 보정 따로' 파편화되는 업계에서, Orange는 네 분야(사진 소스 촬영, 시네마 영상 촬영, 비트 매치 및 사운드 컷 편집, 포토샵 하이엔드 픽셀 수정)를 통합 제어합니다. 후반 보정을 염두에 둔 촬영 설계로 가치를 보장합니다.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-8 border border-dark-border bg-dark-card/20 rounded-sm relative">
                  <span className="font-syne text-4xl font-extrabold text-[#222222] absolute top-6 right-6">03</span>
                  <div className="flex items-center gap-2 mb-5">
                    <Palette size={16} className="text-accent" />
                    <h3 className="font-outfit text-base font-bold text-white tracking-tight">피사체 본연의 전시</h3>
                  </div>
                  <h4 className="font-outfit text-xs text-accent font-semibold block mb-3">MINIMAL ARCHIVIST</h4>
                  <p className="font-sans text-xs text-dark-muted leading-relaxed font-light">
                    장식이 가려지면 본질이 훼손됩니다. 웹사이트 자체의 격조 높은 설계는 오직 작품을 안전하게 지탱하는 전시장 고유의 회색 콘크리트 액자가 되어야 합니다. Orange의 포트폴리오 아카이브는 가식적인 UI를 지양하고 철저히 오리지널 미디어 중심의 비주얼을 전면에 세웁니다.
                  </p>
                </div>

              </div>

              {/* Dynamic Exhibition placard credentials block */}
              <div className="border border-dark-border bg-dark-card/40 p-8 rounded-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                <div>
                  <h3 className="font-syne text-xl font-bold text-white uppercase mb-2">
                    김장섭 // CREATOR ORANGE
                  </h3>
                  <span className="font-mono text-[10px] text-accent tracking-widest block mb-4">
                    [ MASTER CREATOR & VISUAL ARCHIVIST ]
                  </span>
                  <p className="font-sans text-xs text-dark-muted leading-relaxed font-light max-w-lg">
                    우리가 만들어낼 이야기의 궤도는 이미 정해져 있습니다. 당신이 설계한 브랜드와 인물, 건축물의 이야기를 가도가 어긋나지 않도록 올바른 철로에 안착시켜 드리겠습니다. 촬영 및 전반 프로덕션 협업 제안은 언제든 열려 있습니다.
                  </p>
                </div>

                <div className="flex flex-col gap-3 font-mono text-[11px] text-dark-muted border-t md:border-t-0 md:border-l border-dark-border/60 pt-6 md:pt-0 md:pl-8">
                  <div className="flex items-center justify-between">
                    <span>ROLE 01 / FILM & COMM. PHOTO</span>
                    <span className="text-white">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ROLE 02 / CINEMATIC DIRECTING</span>
                    <span className="text-accent font-semibold">ON THE TRACK</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ROLE 03 / PREMIUM COLOR GRADE</span>
                    <span className="text-white">DAVINCI RESOLVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ROLE 04 / FINE ART SKIN WORK</span>
                    <span className="text-white">PHOTOSHOP</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {currentTab === 'admin' && (
            <motion.div
              key="admin-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <AdminPanel
                projects={projects}
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onResetToDefault={handleResetToDefault}
                onImportBackup={handleImportBackup}
                isAdminLoggedIn={isAdminLoggedIn}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Sliding project detail overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* 4. Footer info bar */}
      <Footer />
      
    </div>
  );
}
