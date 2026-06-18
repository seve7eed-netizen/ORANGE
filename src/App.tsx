/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import ProjectDetail from './components/ProjectDetail';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { initialProjects } from './initialProjects';
import { Project, CategoryFilter } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Sliders, Play, Settings, Landmark, ShieldCheck } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('gallery'); // 'gallery', 'services', 'philosophy', 'admin'
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  // References for scrolling
  const archiveRef = useRef<HTMLDivElement | null>(null);

  // Load from local Storage on boot, fallback to elegant preset
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orange_archive_portfolios');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep purge of any items matching obsolete categories or deprecated IDs (p3, p4, p6)
        const filtered = parsed.filter((p: any) => 
          p && 
          p.id !== 'p3' && 
          p.id !== 'p4' && 
          p.id !== 'p6' && 
          (p.category === 'photography' || p.category === 'videography')
        );
        if (filtered.length !== parsed.length || parsed.length === 0 || !parsed.some((p: any) => p.id === 'p1')) {
          setProjects(initialProjects);
          localStorage.setItem('orange_archive_portfolios', JSON.stringify(initialProjects));
        } else {
          setProjects(filtered);
        }
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

  const handlePillarClick = (category: 'photography' | 'videography') => {
    setActiveFilter(category);
    handleScrollToArchive();
  };

  return (
    <div className="relative bg-dark-bg text-white min-h-screen flex flex-col font-sans selection:bg-accent selection:text-black">
      {/* Subtle global vintage background grain */}
      <div className="absolute inset-0 bg-grain opacity-[0.04] z-0 pointer-events-none select-none" />
      
      {/* 1. Header Navigation Wrapper */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // If switching to gallery, smooth scroll to gallery anchor automatically
          if (tab === 'gallery') {
            setActiveFilter('all');
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
      <main className="flex-grow pt-16 font-sans">
        <AnimatePresence mode="wait">
          {currentTab === 'gallery' && (
            <motion.div
              key="gallery-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden"
            >
              {/* Seamless unified ambient background for both Hero and Gallery */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                {/* Upper ambient glow in Hero area */}
                <div className="absolute top-[8%] -right-[10%] w-[600px] h-[600px] rounded-full bg-accent/3 blur-[120px] mix-blend-screen" />
                
                {/* Middle ambient glow around transition/about area */}
                <div className="absolute top-[35%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent/2 blur-[100px] mix-blend-screen" />
                
                {/* Lower ambient glow in ProjectGrid area */}
                <div className="absolute bottom-[15%] -right-[10%] w-[650px] h-[650px] rounded-full bg-accent/3 blur-[130px] mix-blend-screen" />
                
                {/* Grid layout spanning from top to very bottom of the page */}
                <div className="absolute inset-0 opacity-[0.012] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* Unified grain texture */}
                <div className="absolute inset-0 bg-grain opacity-[0.045]" />
              </div>

              {/* Introduction Banner */}
              <Hero onScrollToArchive={handleScrollToArchive} onPillarClick={handlePillarClick} />

              {/* Central Exhibition grid */}
              <div ref={archiveRef} id="archive-section" className="relative z-10 bg-transparent">
                <ProjectGrid
                  projects={projects}
                  onProjectClick={(p) => setSelectedProject(p)}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                />
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
