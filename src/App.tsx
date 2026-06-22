/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
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
  const [currentTab, setCurrentTab] = useState<string>('home'); // 'home', 'philosophy', 'gallery', 'admin'
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [scrollY, setScrollY] = useState(0);

  // References for scrolling
  const archiveRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  // Scroll listener for landing splash scale effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll observer to update active header menu item as visitor scrolls
  useEffect(() => {
    if (currentTab === 'admin') return;

    const handleScrollState = () => {
      const homeEl = document.getElementById('section-home');
      const philEl = document.getElementById('section-philosophy');
      const galleryEl = document.getElementById('section-gallery');

      if (!homeEl || !philEl || !galleryEl) return;

      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      const philTop = philEl.offsetTop;
      const galleryTop = galleryEl.offsetTop;

      if (scrollPosition >= galleryTop) {
        if (!isScrollingRef.current) {
          setCurrentTab('gallery');
        }
      } else if (scrollPosition >= philTop) {
        if (!isScrollingRef.current) {
          setCurrentTab('philosophy');
        }
      } else {
        if (!isScrollingRef.current) {
          setCurrentTab('home');
        }
      }
    };

    window.addEventListener('scroll', handleScrollState);
    return () => window.removeEventListener('scroll', handleScrollState);
  }, [currentTab]);

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

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      isScrollingRef.current = true;
      setCurrentTab(sectionId);
      
      const headerOffset = 64; // Height of the sticky header
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Keep tracking active scroll state to avoid flip during transit animation
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 850);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'admin') {
      setCurrentTab('admin');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (currentTab === 'admin') {
      setCurrentTab(tab);
      setTimeout(() => {
        scrollToSection(tab);
      }, 80);
    } else {
      scrollToSection(tab);
    }
  };

  const handleScrollToArchive = () => {
    setActiveFilter('all');
    scrollToSection('gallery');
  };

  const handlePillarClick = (category: 'photography' | 'videography') => {
    setActiveFilter(category);
    scrollToSection('gallery');
  };

  const handleEnterJournal = () => {
    scrollToSection('philosophy');
  };

  return (
    <div className="relative bg-dark-bg text-white min-h-screen flex flex-col font-sans selection:bg-accent selection:text-black">
      {/* 1. Header Navigation Wrapper */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        isAdmin={isAdminLoggedIn}
        onAdminClick={() => setCurrentTab('admin')}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setCurrentTab('home');
          window.scrollTo({ top: 0, behavior: 'instant' });
          alert('관리자 모드가 해제되었습니다. 메인 화면으로 전환됩니다.');
        }}
        scrollY={scrollY}
      />

      {/* 2. Main Page Body with Motion Wrapper */}
      <main className="flex-grow pt-16 font-sans">
        <AnimatePresence mode="wait">
          {currentTab === 'admin' ? (
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
          ) : (
            <motion.div
              key="main-ambient-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex flex-col"
            >
              {/* Seamless unified ambient background for continuous scroll content */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                {/* Upper ambient glow */}
                <div className="absolute top-[5%] -right-[15%] w-[700px] h-[700px] rounded-full bg-accent/[0.045] blur-[150px] mix-blend-screen" />
                
                {/* Middle ambient glow */}
                <div className="absolute top-[35%] -left-[15%] w-[600px] h-[600px] rounded-full bg-accent/[0.030] blur-[130px] mix-blend-screen" />
                
                {/* Lower ambient glow in ProjectGrid area */}
                <div className="absolute bottom-[10%] -right-[15%] w-[750px] h-[750px] rounded-full bg-accent/[0.04] blur-[160px] mix-blend-screen" />
                
                {/* Vintage vignette/moody ambient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_10%,_var(--color-dark-bg)_80%)] opacity-80" />
                
                {/* Subtle minimalist grid structure */}
                <div className="absolute inset-0 opacity-[0.008] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:50px_50px]" />
              </div>

              {/* Section 1: HOME */}
              <div id="section-home" className="relative z-10 w-full">
                <Hero onEnter={handleEnterJournal} />
              </div>

              {/* Section 2: PHILOSOPHY */}
              <div id="section-philosophy" className="relative z-10 w-full border-t border-dark-border/40">
                <Philosophy onPillarClick={handlePillarClick} />
              </div>

              {/* Section 3: GALLERY/EXHIBITION */}
              <div id="section-gallery" className="relative z-10 w-full border-t border-dark-border/40">
                <div id="archive-section" className="relative bg-transparent">
                  <ProjectGrid
                    projects={projects}
                    onProjectClick={(p) => setSelectedProject(p)}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                </div>
              </div>
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
